"""Enquadramento automatico pelo rosto: gera a trajetoria do centro do corte.

Nao recorta video nenhum. Le o trecho, acha o rosto a poucas amostras por segundo e
devolve, em JSON, onde o centro do enquadramento deve estar ao longo do tempo. Quem
aplica e o preview (CSS object-position) e o render (Remotion), com a mesma conta.

A regra que evita o tremor e a de um operador de camera, nao a de um GPS:
- zona morta: o rosto anda dentro de uma faixa central sem a camera mexer;
- so se move quando o rosto FICA fora da zona por mais de meio segundo (um
  rosto que pisca pra fora e volta nao move nada);
- transicao suave (smoothstep) de ~0,7 s ate o novo centro;
- corte de cena (troca de camera) zera tudo: o proximo centro entra seco, sem
  panoramica atravessando a tela.

Uso:
    python enquadrar.py --video ENTRADA.mp4 --start 12.5 --end 48.0 --alvo 1080:1920 --out saida.json

Saida no stdout: progresso {"frame":N,"total":M} e, na ultima linha, {"ok":true,...}.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import urllib.request
from pathlib import Path

import numpy as np

TOOLS = Path(__file__).resolve().parent
MODELO = TOOLS / "modelos" / "face_detection_yunet_2023mar.onnx"
MODELO_URL = ("https://github.com/opencv/opencv_zoo/raw/main/models/"
              "face_detection_yunet/face_detection_yunet_2023mar.onnx")
MODELO_BYTES_MIN = 200_000

FPS_ANALISE = 5.0
LARGURA_DETECCAO = 320
ZONA_MORTA = 0.06          # fracao da largura do RECORTE que o rosto anda sem mover a camera
PERSISTENCIA_S = 0.6       # quanto tempo fora da zona antes de mover
TRANSICAO_S = 0.7          # duracao da panoramica
CORTE_DE_CENA = 0.45       # diferenca de histograma entre amostras vizinhas
SEGUNDO_ROSTO = 0.55       # area minima (relativa ao maior) pra contar como "dois rostos"
OFFSET_VERTICAL = -0.08    # o rosto fica um pouco acima do centro (regra de tercos)


def log(*a: object) -> None:
    print(*a, file=sys.stderr, flush=True)


def emitir(obj: dict) -> None:
    print(json.dumps(obj, ensure_ascii=False), flush=True)


def garantir_modelo() -> Path:
    if MODELO.exists() and MODELO.stat().st_size >= MODELO_BYTES_MIN:
        return MODELO
    MODELO.parent.mkdir(parents=True, exist_ok=True)
    parte = MODELO.with_suffix(".part")
    log("baixando o detector de rosto (230 KB)…")
    urllib.request.urlretrieve(MODELO_URL, parte)
    if parte.stat().st_size < MODELO_BYTES_MIN:
        parte.unlink(missing_ok=True)
        raise RuntimeError("download do detector veio incompleto")
    parte.replace(MODELO)
    return MODELO


def sondar(video: Path) -> tuple[int, int, float]:
    r = subprocess.run([
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height:format=duration", "-of", "json", str(video),
    ], capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit("nao consegui abrir o video")
    d = json.loads(r.stdout)
    st = d["streams"][0]
    return int(st["width"]), int(st["height"]), float(d.get("format", {}).get("duration") or 0)


def alvo_de(texto: str) -> tuple[int, int]:
    w, h = texto.split(":")
    return int(w), int(h)


def smoothstep(x: float) -> float:
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def detectar(detector, quadro) -> list[tuple[float, float, float]]:
    """Devolve rostos como (cx, cy, area) normalizados 0..1 do quadro."""
    h, w = quadro.shape[:2]
    _, faces = detector.detect(quadro)
    saida = []
    if faces is None:
        return saida
    for f in faces:
        x, y, fw, fh = float(f[0]), float(f[1]), float(f[2]), float(f[3])
        saida.append(((x + fw / 2) / w, (y + fh / 2) / h, (fw * fh) / (w * h)))
    return saida


def centro_dos_rostos(rostos: list[tuple[float, float, float]]) -> tuple[float, float] | None:
    if not rostos:
        return None
    rostos = sorted(rostos, key=lambda r: -r[2])
    maior = rostos[0]
    # dois rostos de tamanho parecido (entrevista): centro entre os dois
    if len(rostos) > 1 and rostos[1][2] >= maior[2] * SEGUNDO_ROSTO:
        b = rostos[1]
        return ((maior[0] + b[0]) / 2, (maior[1] + b[1]) / 2)
    return (maior[0], maior[1])


def assinatura(cv2, quadro) -> np.ndarray:
    cinza = cv2.cvtColor(cv2.resize(quadro, (64, 36), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY)
    h = cv2.calcHist([cinza], [0], None, [32], [0, 256]).flatten()
    return h / max(1.0, float(h.sum()))


def suavizar(
    brutos: list[tuple[float, float] | None],
    cenas: list[bool],
    fps: float,
    zona_x: float,
    zona_y: float,
) -> list[tuple[float, float]]:
    """A camera de operador. `brutos[i]` e o centro do rosto na amostra i (ou None)."""
    n = len(brutos)
    saida: list[tuple[float, float]] = [(0.5, 0.5)] * n
    persist = max(1, int(round(PERSISTENCIA_S * fps)))
    trans = max(1, int(round(TRANSICAO_S * fps)))

    # preenche buracos segurando o ultimo rosto visto (dentro da cena)
    cheio: list[tuple[float, float]] = []
    ultimo: tuple[float, float] | None = None
    for i in range(n):
        if cenas[i]:
            ultimo = None
        if brutos[i] is not None:
            ultimo = brutos[i]
        elif ultimo is None:
            # ainda nao viu rosto nesta cena: pega o primeiro que aparecer a frente
            j = i + 1
            while j < n and not cenas[j] and brutos[j] is None:
                j += 1
            ultimo = brutos[j] if j < n and not cenas[j] and brutos[j] is not None else (0.5, 0.5)
        cheio.append(ultimo)

    segurado = cheio[0]
    origem = segurado
    alvo = segurado
    passo = trans  # passo >= trans significa "parado"
    fora_desde = -1
    for i in range(n):
        if cenas[i] and i > 0:
            segurado = origem = alvo = cheio[i]
            passo = trans
            fora_desde = -1
        atual = cheio[i]
        if passo < trans:
            passo += 1
            k = smoothstep(passo / trans)
            segurado = (origem[0] + (alvo[0] - origem[0]) * k, origem[1] + (alvo[1] - origem[1]) * k)
        fora = abs(atual[0] - segurado[0]) > zona_x or abs(atual[1] - segurado[1]) > zona_y
        if fora:
            if fora_desde < 0:
                fora_desde = i
            if i - fora_desde + 1 >= persist and passo >= trans:
                # mediana das amostras fora da zona: a posicao nova, sem o ruido
                xs = sorted(c[0] for c in cheio[fora_desde:i + 1])
                ys = sorted(c[1] for c in cheio[fora_desde:i + 1])
                alvo = (xs[len(xs) // 2], ys[len(ys) // 2])
                origem = segurado
                passo = 0
                fora_desde = -1
        else:
            fora_desde = -1
        saida[i] = segurado
    return saida


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--video", required=True, type=Path)
    ap.add_argument("--start", type=float, default=0.0)
    ap.add_argument("--end", type=float, default=None)
    ap.add_argument("--alvo", default="1080:1920", help="largura:altura do video final")
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--fps", type=float, default=FPS_ANALISE)
    a = ap.parse_args()

    import cv2  # import tardio: erro de instalacao vira mensagem, nao traceback no topo

    modelo = garantir_modelo()
    largura, altura, dur_src = sondar(a.video)
    inicio = max(0.0, a.start)
    fim = min(dur_src, a.end) if a.end is not None and dur_src > 0 else (a.end or dur_src)
    if fim <= inicio:
        raise SystemExit("trecho vazio")

    aw, ah = alvo_de(a.alvo)
    escala_cobrir = max(aw / largura, ah / altura)
    recorte_w = (aw / escala_cobrir) / largura   # fracao da largura da fonte
    recorte_h = (ah / escala_cobrir) / altura
    zona_x = ZONA_MORTA * recorte_w
    zona_y = ZONA_MORTA * recorte_h * (largura / altura)

    # O ffmpeg (dav1d, multithread) decodifica 4K muito mais rapido que o OpenCV
    # e ja entrega o quadro pequeno: so o que o detector precisa atravessa o cano.
    det_w = min(LARGURA_DETECCAO, largura)
    det_h = max(32, int(round(altura * det_w / largura / 2)) * 2)
    detector = cv2.FaceDetectorYN.create(str(modelo), "", (det_w, det_h), 0.6, 0.3, 200)
    fps_real = a.fps
    total = int((fim - inicio) * fps_real) + 1
    tamanho = det_w * det_h * 3
    proc = subprocess.Popen([
        "ffmpeg", "-v", "error", "-ss", f"{inicio:.3f}", "-to", f"{fim:.3f}", "-i", str(a.video),
        "-vf", f"fps={fps_real},scale={det_w}:{det_h}", "-f", "rawvideo", "-pix_fmt", "bgr24", "-",
    ], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)

    brutos: list[tuple[float, float] | None] = []
    cenas: list[bool] = []
    tempos: list[float] = []
    com_rosto = 0
    max_simult = 0
    assin_ant: np.ndarray | None = None
    i = 0
    assert proc.stdout is not None
    while True:
        bloco = proc.stdout.read(tamanho)
        if len(bloco) < tamanho:
            break
        quadro = np.frombuffer(bloco, dtype=np.uint8).reshape((det_h, det_w, 3))
        t = inicio + i / fps_real
        rostos = detectar(detector, quadro)
        centro = centro_dos_rostos(rostos)
        if centro is not None:
            com_rosto += 1
            max_simult = max(max_simult, len(rostos))
        assin = assinatura(cv2, quadro)
        corte = assin_ant is not None and float(np.abs(assin - assin_ant).sum()) / 2 > CORTE_DE_CENA
        assin_ant = assin
        brutos.append(centro)
        cenas.append(bool(corte))
        tempos.append(round(t, 3))
        i += 1
        if i % 5 == 0:
            emitir({"frame": min(i, total), "total": total})
    proc.stdout.close()
    proc.wait()

    if not tempos:
        raise SystemExit("nenhum quadro lido no trecho")

    centros = suavizar(brutos, cenas, fps_real, zona_x, zona_y)
    quadros = [
        [tempos[k], round(centros[k][0], 4), round(min(1.0, max(0.0, centros[k][1] + OFFSET_VERTICAL * recorte_h)), 4)]
        for k in range(len(tempos))
    ]
    dados = {
        "versao": 1,
        "fonte": {"largura": largura, "altura": altura},
        "alvo": {"largura": aw, "altura": ah},
        "inicioS": inicio,
        "fimS": fim,
        "fps": round(fps_real, 3),
        "quadros": quadros,
        "rostos": {"amostras": len(tempos), "comRosto": com_rosto, "maximoSimultaneo": max_simult},
        "cenas": int(sum(cenas)),
    }
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps(dados, ensure_ascii=False), encoding="utf-8")
    emitir({"ok": True, "amostras": len(tempos), "comRosto": com_rosto,
            "maximoSimultaneo": max_simult, "cenas": int(sum(cenas)), "arquivo": str(a.out)})


if __name__ == "__main__":
    main()
