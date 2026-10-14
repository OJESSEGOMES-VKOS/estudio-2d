"""Assinatura do modelo: os números que dão a cara dele, medidos no vídeo aprovado e na gravação de onde ele saiu.

uso (da raiz do estúdio):  .venv/Scripts/python.exe tools/assinatura.py <modelo|todos>
grava modelos/<modelo>/assinatura.json com:
  entrada: a gravação de origem do molde (moldes/<m>/public/fala.mp4), crua: rosto (tamanho e lugar) e luz/cor.
           É o ponto de partida em que o código do molde foi calibrado; tools/adaptar.py leva a gravação nova até ele.
           entrada.desenho: quando o molde não desenha a fala crua e sim um tratamento dela (public/fala_grade.mp4, feito
           pelo scripts/grade.py do molde), a luz e a cor desse arquivo. O grade tem números fixos (exposição, pretos,
           fundo) e a mesma luz de partida não garante a mesma luz depois dele (roupa, objetos claros, parede); por isso
           tools/adaptar.py --desenho leva o fala_grade.mp4 novo até esta medida, depois do grade.
  saida:   o vídeo aprovado (modelos/<m>/exemplos/vitrine-<m>.mp4 ou o exemplo mais novo que não é de cliente; no estúdio
           aberto, modelos/<m>/referencia/referencia.mp4):
           luz e cor, enquadramento do rosto (aberto, fechado, cabeça cortada) e ritmo de corte.
           É contra isso que tools/parece.py confere o vídeo novo.
Rode de novo sempre que o vídeo aprovado de um modelo mudar, e ao criar um modelo novo.
"""
import json, re, subprocess, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')  # acentos no terminal do Windows
import os
os.environ.setdefault("OPENCV_LOG_LEVEL", "ERROR")
import cv2, numpy as np

RAIZ = Path(__file__).resolve().parents[1]
YUNET = RAIZ / 'tools' / 'modelos' / 'face_detection_yunet_2023mar.onnx'
# vídeos de exemplos/ que nunca viram referência (de cliente, de política): 'cliente' no nome, mais os termos de
# tools/nao-referencia.txt (um por linha), que só existe no estúdio local
_extra = RAIZ / 'tools' / 'nao-referencia.txt'
NAO_REF = re.compile('|'.join(['cliente'] + (_extra.read_text(encoding='utf-8').split() if _extra.exists() else [])), re.I)


def quadros(video: Path, fps: float = 4):
    """Os quadros do vídeo a `fps`, em 270x480 (deitado: 480x270), BGR."""
    w, h = map(int, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                                    '-of', 'csv=p=0', str(video)], capture_output=True, text=True).stdout.strip().split(',')[:2])
    W, H = (480, 270) if w > h else (270, 480)
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', str(video), '-vf', f'fps={fps},scale={W}:{H}', '-f', 'rawvideo',
                          '-pix_fmt', 'bgr24', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3), (w, h)


def luz_cor(qs) -> dict:
    """Mediana por quadro: brilho (L do Lab, 0-255), contraste (L p95 - p5), saturação (S do HSV) e temperatura
    (b do Lab - 128: positivo é quente/amarelo, negativo é frio/azul) e tom (a do Lab - 128: positivo é magenta)."""
    L, C, S, B, A = [], [], [], [], []
    for q in qs:
        lab = cv2.cvtColor(q, cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.float32)
        p5, p95 = np.percentile(lab[:, 0], [5, 95])
        L.append(lab[:, 0].mean()); C.append(p95 - p5); B.append(lab[:, 2].mean() - 128); A.append(lab[:, 1].mean() - 128)
        S.append(cv2.cvtColor(q, cv2.COLOR_BGR2HSV)[..., 1].mean())
    md = lambda v: round(float(np.median(v)), 2)
    return {'brilho': md(L), 'contraste': md(C), 'saturacao': md(S), 'temperatura': md(B), 'tom': md(A)}


def rostos(qs) -> list:
    """[cx, cy, h, topo] do maior rosto em cada quadro, em fração do quadro (None quando não acha)."""
    H, W = qs.shape[1:3]
    det = cv2.FaceDetectorYN.create(str(YUNET), '', (W, H), 0.6)
    out = []
    for q in qs:
        _, f = det.detect(np.ascontiguousarray(q))
        if f is None or not len(f):
            out.append(None); continue
        x, y, w, h = map(float, max(f, key=lambda r: r[2] * r[3])[:4])
        out.append([(x + w / 2) / W, (y + h / 2) / H, h / H, y / H])
    return out


def enquadramento(rs: list) -> dict | None:
    """O rosto no vídeo: tamanho no plano aberto (p25) e no fechado (p75), lugar, e quanto do tempo a cabeça sai do quadro
    (o alto da cabeça fica ~0,35 da altura do rosto acima da caixa do rosto)."""
    # rosto menor que 12% da altura não é a pessoa em cena: é o rosto num cartão da colagem, num monitor do B-roll ou
    # numa prévia; ele puxaria o 'plano aberto' do modelo para baixo
    ok = [r for r in rs if r and r[2] >= 0.12]
    if len(ok) < max(4, 0.2 * len(rs)):
        return None
    h = np.array([r[2] for r in ok])
    corta = np.mean([r[3] - 0.35 * r[2] < 0 for r in ok])
    return {'rosto_aberto': round(float(np.percentile(h, 25)), 4), 'rosto_fechado': round(float(np.percentile(h, 75)), 4),
            'rosto_cy': round(float(np.median([r[1] for r in ok])), 4), 'rosto_cx': round(float(np.median([r[0] for r in ok])), 4),
            'cabeca_cortada': round(float(corta), 3), 'com_rosto': round(len(ok) / len(rs), 3)}


def ritmo(qs, fps: float) -> float:
    """Trocas bruscas de imagem por minuto (corte seco, transição, troca de tela), pela diferença entre quadros vizinhos."""
    g = [cv2.cvtColor(q, cv2.COLOR_BGR2GRAY).astype(np.float32) for q in qs]
    d = np.array([np.abs(a - b).mean() for a, b in zip(g, g[1:])])
    if not len(d):
        return 0.0
    cortes = int(np.sum(d > max(18.0, np.median(d) * 4)))
    return round(cortes / (len(qs) / fps / 60), 1)


def medir_video(video: Path, fps: float = 4, rosto: bool = True) -> dict:
    qs, (w, h) = quadros(video, fps)
    m = {'video': video.name, 'segundos': round(len(qs) / fps, 1), 'formato': f'{w}x{h}', **luz_cor(qs), 'cortes_min': ritmo(qs, fps)}
    if rosto:
        e = enquadramento(rostos(qs))
        if e:
            m.update(e)
    return m


def aprovado(m: str) -> Path | None:
    ex = RAIZ / 'modelos' / m / 'exemplos'
    vit = ex / f'vitrine-{m}.mp4'
    if vit.exists():
        return vit
    cands = sorted((f for f in ex.glob('*.mp4') if not NAO_REF.search(f.name)), key=lambda f: f.stat().st_mtime, reverse=True)
    if cands:
        return cands[0]
    # no estúdio aberto, que não traz exemplos/: a referência própria do modelo (tools/referencia.py)
    ref = RAIZ / 'modelos' / m / 'referencia' / 'referencia.mp4'
    return ref if ref.exists() else None


def assinar(m: str) -> None:
    ap = aprovado(m)
    if not ap:
        print(f'{m}: sem vídeo aprovado em modelos/{m}/exemplos/, pulei'); return
    fala = RAIZ / 'moldes' / m / 'public' / 'fala.mp4'
    sig = {'modelo': m, 'gerado_de': ap.name}
    if fala.exists():
        e = medir_video(fala, fps=2)
        sig['entrada'] = {k: e[k] for k in e if k not in {'video', 'cortes_min'}}
        grade = fala.with_name('fala_grade.mp4')
        if grade.exists():
            sig['entrada']['desenho'] = {'arquivo': grade.name, **luz_cor(quadros(grade, 2)[0])}
    sig['saida'] = medir_video(ap, fps=4, rosto=fala.exists())
    (RAIZ / 'modelos' / m / 'assinatura.json').write_text(json.dumps(sig, ensure_ascii=False, indent=1), encoding='utf-8')
    s = sig['saida']
    print(f"{m}: brilho {s['brilho']}, contraste {s['contraste']}, saturação {s['saturacao']}, temperatura {s['temperatura']}, "
          f"{s['cortes_min']} cortes/min" + (f", rosto aberto {s['rosto_aberto']} fechado {s['rosto_fechado']}" if 'rosto_aberto' in s else ''))


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    alvo = sys.argv[1]
    nomes = sorted(p.parent.name for p in (RAIZ / 'modelos').glob('*/MODELO.md')) if alvo == 'todos' else [alvo]
    for m in nomes:
        if not m.startswith('_'):
            assinar(m)
