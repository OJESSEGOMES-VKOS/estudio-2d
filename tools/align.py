"""Refina os tempos das palavras ancorando na energia real do audio.

O whisper acerta O QUE foi dito, mas marca QUANDO com atraso (mediana ~120ms neste
material, com casos de 1s). Aqui a correcao e feita sem modelo extra: a fala tem
ataques nitidos depois de cada pausa, e esses ataques sao ancoras confiaveis.

Metodo: agrupa as palavras em frases (pausa >= GAP), acha o comeco e o fim reais da
fala de cada frase na envoltoria de energia, e reescala as palavras da frase entre as
duas ancoras. Palavra so se move dentro da tolerancia; sem ancora confiavel, fica como
estava (nunca piora o que ja estava bom).

Uso: python align.py <audio_ou_video> <transcript.json>   (reescreve o arquivo)
"""
import json
import subprocess
import sys
from pathlib import Path

from pack import gravar_takes

SR = 8000          # taxa da analise
RATE = 200         # colunas de energia por segundo (5ms de resolucao)
GAP = 0.25         # pausa que separa frases, em segundos
TOL = 0.35         # alcance de uma ancora, ja descontado o vies (segundos)
MIN_FALA = 0.05    # fala minima pra confirmar um ataque (segundos)
MIN_SIL = 0.12     # silencio minimo antes do ataque (segundos)


try:
    import numpy as _np
except ImportError:
    _np = None


def envelope(media: Path) -> list[float]:
    """Pico absoluto do audio por coluna de 5ms, em 0..1."""
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(media), "-vn", "-ac", "1",
         "-ar", str(SR), "-f", "s16le", "-"],
        capture_output=True, check=True,
    ).stdout
    per = SR // RATE
    if _np is not None:
        return _envelope_numpy(raw, per)
    env = []
    for i in range(0, len(raw) - per * 2 + 1, per * 2):
        pico = 0
        for j in range(0, per * 2, 2):
            v = int.from_bytes(raw[i + j:i + j + 2], "little", signed=True)
            v = -v if v < 0 else v
            if v > pico:
                pico = v
        env.append(pico / 32768)
    return env


def _envelope_numpy(raw: bytes, per: int) -> list[float]:
    """Mesma conta de `envelope`, vetorizada: pico absoluto por coluna de `per`
    amostras int16. Trunca a cauda incompleta, igual ao loop original."""
    amostras = _np.frombuffer(raw, dtype="<i2")
    n_colunas = len(amostras) // per
    if n_colunas == 0:
        return []
    aparados = amostras[: n_colunas * per].reshape(n_colunas, per)
    pico = _np.abs(aparados.astype(_np.int32)).max(axis=1)
    return (pico / 32768.0).tolist()


def mascara_fala(env: list[float]) -> list[int]:
    """Fala x silencio. O limiar sai do proprio material (gravação baixa e comum)."""
    ordenado = sorted(env)
    piso = ordenado[int(len(ordenado) * 0.20)]        # ruido de fundo
    teto = ordenado[int(len(ordenado) * 0.98)]        # fala
    limiar = max(piso * 2.5, piso + (teto - piso) * 0.16)
    return [1 if v > limiar else 0 for v in env]


def ancoras(m: list[int]) -> tuple[list[float], list[float]]:
    """Instantes em que a fala comeca e em que ela termina."""
    sil = int(MIN_SIL * RATE)
    fala = int(MIN_FALA * RATE)
    inicios, fins = [], []
    for i in range(1, len(m) - fala):
        if m[i] == 1 and m[i - 1] == 0 and sum(m[max(0, i - sil):i]) == 0 \
                and sum(m[i:i + fala]) >= fala * 0.8:
            inicios.append(i / RATE)
    for i in range(fala, len(m) - sil):
        if m[i] == 0 and m[i - 1] == 1 and sum(m[i:i + sil]) == 0 \
                and sum(m[i - fala:i]) >= fala * 0.8:
            fins.append(i / RATE)
    return inicios, fins


def perto(alvo: float, pontos: list[float], tol: float, minimo: float = -1e9):
    """A ancora mais proxima do alvo, dentro da tolerancia e depois de `minimo`.

    O `minimo` mantem o casamento em ordem: uma frase nunca ancora antes da
    anterior, que era como uma frase acabava colada na ancora errada.
    """
    cand = [p for p in pontos if p >= minimo and abs(p - alvo) <= tol]
    return min(cand, key=lambda x: abs(x - alvo)) if cand else None


def estimar_vies(grupos, ini_a) -> float:
    """De quanto o whisper atrasa, medido so onde nao ha duvida.

    Conta apenas as frases com UMA unica ancora na vizinhanca: nessas o
    casamento e certo, e a mediana delas vira o viés aplicado no resto.
    """
    certos = []
    for fr in grupos:
        t = fr[0]["start"]
        perto_t = [p for p in ini_a if t - 0.80 <= p <= t + 0.30]
        if len(perto_t) == 1:
            certos.append(perto_t[0] - t)
    if len(certos) < 3:
        return 0.0
    certos.sort()
    return certos[len(certos) // 2]


def refinar(words: list[dict], env: list[float]) -> tuple[list[dict], int]:
    m = mascara_fala(env)
    ini_a, fim_a = ancoras(m)
    # agrupa em frases
    frases, atual = [], []
    for w in words:
        if atual and w["start"] - atual[-1]["end"] >= GAP:
            frases.append(atual)
            atual = []
        atual.append(w)
    if atual:
        frases.append(atual)

    # o whisper atrasa de forma parecida no material inteiro: mede esse atraso
    # onde o casamento e inequivoco e usa ele pra mirar as ancoras do resto
    vies = estimar_vies(frases, ini_a)

    movidas = 0
    ultimo = -1e9
    for fr in frases:
        a0, b0 = fr[0]["start"], fr[-1]["end"]
        dur = b0 - a0
        if dur <= 0:
            continue
        # janela estreita no alvo ja corrigido pelo vies, e sempre depois da
        # ancora da frase anterior: a ordem impede prender no lugar errado
        a1 = perto(a0 + vies, ini_a, TOL, minimo=ultimo)
        b1 = perto(b0 + vies, fim_a, TOL, minimo=(a1 if a1 is not None else ultimo))
        if a1 is not None:
            ultimo = a1
        # so estica se as duas ancoras existem e nao invertem a frase
        if a1 is not None and b1 is not None and b1 - a1 > dur * 0.5:
            escala = (b1 - a1) / dur
            desloca = a1 - a0 * escala
        elif a1 is not None:
            escala, desloca = 1.0, a1 - a0     # ancora so o comeco
        else:
            continue
        for w in fr:
            w["start"] = round(w["start"] * escala + desloca, 3)
            w["end"] = round(max(w["end"] * escala + desloca, w["start"] + 0.03), 3)
        movidas += len(fr)

    # garante ordem crescente (uma frase nunca invade a seguinte)
    for x, y in zip(words, words[1:]):
        if y["start"] < x["start"]:
            y["start"] = x["start"]
        if x["end"] > y["start"]:
            x["end"] = max(x["start"] + 0.03, y["start"])
    return words, movidas


def main() -> None:
    media, tpath = Path(sys.argv[1]), Path(sys.argv[2])
    data = json.loads(tpath.read_text(encoding="utf-8"))
    env = envelope(media)
    words, movidas = refinar(data["words"], env)
    data["words"] = words
    data["aligned"] = True
    tpath.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    # as linhas que o agente le precisam bater com as palavras que acabaram de mover
    if (tpath.parent / "takes_packed.md").exists():
        gravar_takes(tpath.parent, words)
    print(json.dumps({"words": len(words), "refined": movidas}))


if __name__ == "__main__":
    main()
