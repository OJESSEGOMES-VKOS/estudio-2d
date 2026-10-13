"""Som do youtubedark01 (vitrine, família B): MODELO §5B "trilha de piano ou cordas bem baixa por baixo de tudo,
sem efeito sonoro no corte". Piano esparso (instrumento do som.py do curta aprovado) + cordas suaves em Lá menor,
ducking pela voz, 16 dB abaixo dela. Efeitos discretos só em acontecimentos DENTRO da cena (nunca no corte):
a barra chegando a 100%, as prévias entrando nos quadros, o risco vermelho sob "EDIÇÃO".
Gera public/trilha.wav e public/efeitos.wav.  uso: ../../.venv/Scripts/python.exe scripts/som.py   (SAIDA=<pasta> grava fora de public/)
"""
import json, os, re, subprocess, sys, unicodedata
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

AQUI = Path(__file__).resolve().parent.parent
SAIDA = Path(os.environ.get('SAIDA', AQUI / 'public'))
T = json.loads((AQUI / 'src' / 'tempos.json').read_text(encoding='utf-8'))
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
SR, FPS = 48000, T['fps']
D = T['duracao_q'] / FPS
N = int(D * SR)
tt = np.arange(N) / SR
rng = np.random.default_rng(5)
ini = lambda i: round(PS[i]['start'] * FPS) / FPS
limpa = lambda s: re.sub(r'[^a-z0-9]', '', ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn'))
if [w for w in map(limpa, T.get('fala', '').split()) if w] != [w for w in (limpa(p['text']) for p in PS) if w]:
    sys.exit('O plano (src/tempos.json) não é desta fala: rode scripts/conferir.py, que diz o que refazer.')
MARCAS = T.get('marcas') or {}


def marca(nome):
    """segundo da marca do plano (src/tempos.json → marcas); sem a marca, o efeito dela não toca"""
    return ini(MARCAS[nome][0]) if nome in MARCAS else None
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
hp = lambda x, f: sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
bp = lambda x, a, b: sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)


def add(buf, t, s, g=1.0):
    i = int(t * SR)
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if i < N: buf[i:j] += g * s[:j - i]


def piano(m, d=3.0, vel=1.0):  # o mesmo piano do curta aprovado (tools/som.py do HOJE)
    f = hz(m); t = np.arange(int(d * SR)) / SR; x = np.zeros(len(t))
    for n in range(1, 9):
        fn = f * n * (1 + 0.0004 * n * n); dec = 1.2 + 0.9 * n + (m - 48) * 0.03
        x += (1 / n ** 1.25) * np.sin(2 * np.pi * fn * t + n) * np.exp(-t * dec)
        x += (0.5 / n ** 1.4) * np.sin(2 * np.pi * fn * 1.0012 * t) * np.exp(-t * dec * 1.1)
    x += bp(rng.standard_normal(len(t)), 800, 4000) * np.exp(-t * 90) * 0.15 * vel
    x = lp(x, 1800 + 2600 * vel)
    r = int(0.3 * SR); x[-r:] *= np.linspace(1, 0, r)
    return x * vel


# acordes (Lá menor, calmo): Am, F, C, G ... no fecho Am(add9)
# um acorde por cena: o ciclo Am, F, C, G e, nas três últimas, a cadência F(add), C, Am(add9) do fecho
CICLO = [[45, 57, 60, 64], [41, 53, 57, 60], [48, 55, 60, 64], [43, 55, 59, 62]]
FECHO = [[41, 53, 57, 60, 64], [48, 55, 60, 64], [45, 57, 59, 60, 64]]
inis = [c['de_q'] / FPS for c in T['cenas']]
nf = min(3, len(inis))
ACORDES = [(t0, CICLO[k % 4] if k < len(inis) - nf else FECHO[3 - nf + k - (len(inis) - nf)]) for k, t0 in enumerate(inis)]
cordas = np.zeros(N)
pno = np.zeros(N)
for k, (t0, notas) in enumerate(ACORDES):
    t1 = ACORDES[k + 1][0] if k + 1 < len(ACORDES) else D
    env = np.clip((tt - t0 + 0.1) / 0.6, 0, 1) * np.clip((t1 + 0.5 - tt) / 0.6, 0, 1)
    for m in notas[1:]:
        for det in (-0.25, 0.0, 0.22):
            ph = rng.random() * 6.28
            vib = 0.004 * np.sin(2 * np.pi * 5.1 * tt + ph)
            cordas += env * np.sin(2 * np.pi * hz(m) * (1 + vib) * tt + ph) * 0.3
    cordas += env * 0.5 * np.sin(2 * np.pi * hz(notas[0] - 12) * tt)
    # piano: baixo no tempo forte + duas notas do acorde, esparso
    add(pno, t0, piano(notas[0], 3.0, 0.8), 0.9)
    passo = 0.75
    t = t0 + passo
    j = 0
    while t < t1 - 0.2:
        add(pno, t, piano(notas[1 + j % (len(notas) - 1)] + 12, 2.0, 0.55), 0.45)
        t += passo; j += 1
cordas = lp(cordas, 1500)
trilha = 0.5 * cordas / (np.abs(cordas).max() + 1e-9) + 0.7 * pno / (np.abs(pno).max() + 1e-9)
trilha *= np.minimum(1, tt / 0.5) * np.clip((D - tt) / 1.2, 0, 1)
# reverb curto
ir = lp(rng.standard_normal(int(2.2 * SR)) * np.exp(-np.arange(int(2.2 * SR)) / SR * 3.1), 5000)
ir /= np.sqrt(np.sum(ir ** 2))
trilha = trilha + 0.35 * fftconvolve(trilha, ir)[:N]
# ducking pela voz, até -5 dB
sr_v, voz = wavfile.read(AQUI / 'public' / 'voz.wav')
voz = voz.astype(np.float64); voz = voz.mean(1) if voz.ndim == 2 else voz
voz = voz[:N] if len(voz) >= N else np.pad(voz, (0, N - len(voz)))
ev = np.sqrt(lp(voz ** 2, 8).clip(0)); ev /= ev.max() + 1e-9
trilha *= lp(10 ** (-5 * np.clip(ev / 0.12, 0, 1) / 20), 6)

# ---------------- efeitos (dentro da cena, nunca no corte) ----------------
fx = np.zeros(N)


def sino(f=1320, dur=1.2):
    tb = np.arange(int(dur * SR)) / SR
    return sum(np.sin(2 * np.pi * f * h * tb) * np.exp(-tb * (2.5 + h)) / h for h in (1, 2.01, 3.03, 4.2))


def tique(f=2400):
    tb = np.arange(int(0.05 * SR)) / SR
    return np.sin(2 * np.pi * f * tb) * np.exp(-tb * 120)


def sopro(dur=0.5, a=300, b=4000):
    n = int(dur * SR); x = np.linspace(0, 1, n); r = rng.standard_normal(n); out = np.zeros(n)
    for j in range(8):
        s0, s1 = j * n // 8, (j + 1) * n // 8
        fr = a * (b / a) ** ((j + 0.5) / 8)
        out[s0:s1] = bp(r, fr * 0.6, min(fr * 1.6, 20000))[s0:s1]
    return out * np.sin(np.pi * x) ** 1.5


def caneta(dur=0.3):  # risco de caneta (o sublinhado vermelho do curta aprovado)
    n = int(dur * SR); x = np.linspace(0, 1, n)
    return bp(rng.standard_normal(n), 2500, 7000) * (0.6 + 0.4 * np.sin(2 * np.pi * 18 * x)) * np.sin(np.pi * x)


# cada efeito preso a uma marca do plano (src/tempos.json → marcas); marca que o plano não tem, efeito que não toca
if marca('barra_cheia') is not None:                        # barra enchendo até 100%
    for k in range(5):
        add(fx, marca('barra_cheia') + k * 0.1, tique(2200 + 120 * k), 0.3)
if marca('barra_fim') is not None:
    add(fx, marca('barra_fim'), sino(1760, 1.0), 0.25)
if T.get('previas'):                                        # as prévias acendem nos quadros
    pv = T['previas']['de_q'] / FPS
    add(fx, pv - 0.15, sopro(0.45, 300, 5000), 0.45)
    add(fx, pv, sino(1320, 0.8), 0.15)
if marca('risco') is not None:                              # "EDIÇÃO" + risco vermelho
    add(fx, marca('risco'), sino(1568, 1.2), 0.28)
    add(fx, marca('risco') + 0.2, caneta(0.3), 0.5)


def grava(nome, x, pico):
    x = x / (np.max(np.abs(x)) + 1e-9) * 10 ** (pico / 20)
    wavfile.write(SAIDA / nome, SR, (np.stack([x, x], 1) * 32767).astype(np.int16))


def lufs(nome):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str((AQUI / 'public' if nome == 'voz.wav' else SAIDA) / nome), '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', o)[-1])


VOZ = lufs('voz.wav')
grava('trilha.wav', trilha, -6)
g = (VOZ - 16) - lufs('trilha.wav')
grava('trilha.wav', trilha, -6 + g)
grava('efeitos.wav', fx, -16)
print(f"voz {VOZ:.1f} LUFS | trilha {lufs('trilha.wav'):.1f} LUFS | efeitos {lufs('efeitos.wav'):.1f} LUFS | {D:.2f} s")
