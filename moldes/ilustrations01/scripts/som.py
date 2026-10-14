"""Trilha e efeitos do ilustrations01 (ilustrations01.md), sintetizados, sem nada de terceiros.

- trilha.wav: pulso suave a cada 0,73 s (o compasso medido na ref1) com pad grave em lá menor; a grade de tempos é
  ancorada para cair um tempo exatamente na virada ("outros", 21,91 s), onde entra a parte forte (bumbo, baixo,
  arpejo, pad aberto), que sobe mais um pouco na moral (ref4: trilha sobe na moral). Some em 0,25 s no fim.
- efeitos.wav: passo leve de cada boneco (mesma conta de src/Reel.tsx), "varredura" em cada edição (uma nota por
  modelo, subindo), brilho no "um desses modelos", sopro subindo/descendo nas prévias, impacto + acorde na virada,
  varredura verde do último, baque no apagão, toques na digitação da moral.
Os níveis já saem no arquivo, relativos à voz (scripts/mixar.sh soma tudo a 0 dB e normaliza em -14 LUFS).
Tudo vem do plano (src/plano.json, o mesmo que o vídeo lê): duração, chegadas, edições, prévias, virada, apagão e moral.
O que o plano não tem não toca; sem "virada", a trilha fica só na parte calma.
uso: ../../.venv/Scripts/python.exe scripts/som.py [ganho trilha dB] [ganho efeitos dB]   (SAIDA=<pasta> grava fora de public/)
"""
import json
import os
import re
import sys
import unicodedata
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

AQUI = Path(__file__).resolve().parent.parent
SAIDA = Path(os.environ.get('SAIDA', AQUI / 'public'))
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
PL = json.loads((AQUI / 'src' / 'plano.json').read_text(encoding='utf-8'))
limpa = lambda s: re.sub(r'[^a-z0-9]', '', ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn'))
if [x for x in map(limpa, PL.get('fala', '').split()) if x] != [x for x in (limpa(p['text']) for p in PS) if x]:
    sys.exit('O plano (src/plano.json) não é desta fala: rode node scripts/checar.mjs, que diz o que refazer.')


def tempo(x):
    """o mesmo tempo do src/Reel.tsx: segundos, [índice, "palavra"] ou [índice, "palavra", mais segundos]"""
    if x is None or isinstance(x, (int, float)):
        return x
    return PS[x[0]]['start'] if len(x) < 3 else PS[x[0]]['start'] + x[2]


SR = 48000
D = round((PS[-1]['end'] + PL['cauda']) * 100) / 100  # o DURACAO do vídeo
N = int(D * SR)
tt = np.arange(N) / SR
rng = np.random.default_rng(11)
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
hp = lambda x, f: sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
bp = lambda x, a, b: sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
db = lambda g: 10 ** (g / 20)

# relógio igual ao de src/Reel.tsx (src/plano.json)
EDICOES = [tempo(c['edita']) for c in PL['chegadas'] if not c.get('voce') and c.get('edita') is not None]
VOCE = [tempo(c['edita']) for c in PL['chegadas'] if c.get('voce') and c.get('edita') is not None]
APENAS_UM, VIRADA, APAGAO = tempo(PL.get('apenasUm')), tempo(PL.get('virada')), tempo(PL.get('apagao'))
SOBE = tempo(PL['previas']['sobe']) if PL.get('previas') else None
DESCE = tempo(PL['previas']['desce']) if PL.get('previas') else None
MORAL = [(tempo(m['de']), m['dig'], len(m['txt'])) for m in PL['moral']]
CHEGADAS = [(c['x0'], c['x1'], tempo(c['t0']), c['d']) for c in PL['chegadas']]
PASSO, K = 62, 1.8
VARRE = 0.28


def add(buf, t, s, g=1.0):
    i = int(round(t * SR))
    if i < 0:
        s = s[-i:]
        i = 0
    j = min(len(buf), i + len(s))
    if i < len(buf) and j > i:
        buf[i:j] += g * s[:j - i]


def env(n, a, r):
    """ataque linear de a s e queda exponencial com constante r s, n amostras"""
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / r)


# ------------------------------------------------------------------ trilha
BEAT = 0.73
b0 = VIRADA - round(VIRADA / BEAT) * BEAT if VIRADA is not None else 0.0  # um tempo cai exatamente na virada
batidas = [b0 + k * BEAT for k in range(int(D / BEAT) + 2) if b0 + k * BEAT >= -0.01]
ACORDES = [[45, 52, 57, 60, 64], [41, 48, 57, 60, 65], [48, 55, 60, 64, 67], [43, 50, 59, 62, 67]]  # Am F C G
acorde = lambda t: ACORDES[int(np.floor((t - b0) / (4 * BEAT))) % 4]

pad = np.zeros(N)
nseg = int(4 * BEAT * SR)
for k in range(int(D / (4 * BEAT)) + 2):
    t0 = b0 + k * 4 * BEAT
    seg_t = np.arange(nseg + int(0.8 * SR)) / SR
    e = np.minimum(1, seg_t / 0.5) * np.clip((4 * BEAT + 0.6 - seg_t) / 0.6, 0, 1)
    s = np.zeros_like(seg_t)
    for m in acorde(t0 + 0.01):
        for det in (-0.15, 0.15):
            f = hz(m) + det
            s += (np.sin(2 * np.pi * f * seg_t) + 0.3 * np.sin(4 * np.pi * f * seg_t)) * (1.0 if m < 50 else 0.5)
    add(pad, t0, s * e)
pad_fechado = lp(pad, 700)
pad_aberto = lp(pad, 2600)

pulso = np.zeros(N)  # parte A: pluck abafado no tempo
kick = np.zeros(N)
baixo = np.zeros(N)
arpejo = np.zeros(N)
for bt in batidas:
    nota = acorde(bt + 0.01)
    n = int(0.5 * SR)
    x = np.arange(n) / SR
    pl = np.sin(2 * np.pi * hz(nota[2]) * x) * env(n, 0.004, 0.12)
    add(pulso, bt, lp(pl, 1500))
    if VIRADA is not None and bt >= VIRADA - 0.01:
        nk = int(0.45 * SR)
        xk = np.arange(nk) / SR
        f = 48 + 90 * np.exp(-xk / 0.03)
        add(kick, bt, np.sin(2 * np.pi * np.cumsum(f) / SR) * env(nk, 0.002, 0.16))
        for h in (0, 0.5):
            nb = int(0.33 * SR)
            xb = np.arange(nb) / SR
            add(baixo, bt + h * BEAT, lp(np.sign(np.sin(2 * np.pi * hz(nota[0] - 12) * xb)) * 0.6 + np.sin(2 * np.pi * hz(nota[0] - 12) * xb), 380) * env(nb, 0.006, 0.18))
        for q in range(4):
            na = int(0.25 * SR)
            xa = np.arange(na) / SR
            m = nota[[2, 3, 4, 3][q]] + 12
            add(arpejo, bt + q * BEAT / 4, (np.sin(2 * np.pi * hz(m) * xa) + 0.2 * np.sin(6 * np.pi * hz(m) * xa)) * env(na, 0.003, 0.07))

forte = (tt >= VIRADA).astype(float) if VIRADA is not None else np.zeros(N)
sobe_moral = 1 + 0.25 * np.clip((tt - MORAL[0][0]) / 0.6, 0, 1) if MORAL else 1
trilha = (0.55 * pad_fechado * (1 - forte) + 0.5 * pad_aberto * forte) / (np.max(np.abs(pad)) + 1e-9) * 0.5
trilha += pulso / (np.max(np.abs(pulso)) + 1e-9) * 0.22 * (1 - 0.35 * forte)
trilha += forte * (kick / (np.max(np.abs(kick)) + 1e-9) * 0.55 + baixo / (np.max(np.abs(baixo)) + 1e-9) * 0.3 + arpejo / (np.max(np.abs(arpejo)) + 1e-9) * 0.16)
trilha *= np.where(forte > 0, db(1), 1.0) * sobe_moral
trilha *= np.minimum(1, tt / 0.6) * np.clip((D - tt) / 0.25, 0, 1)

# ------------------------------------------------------------------ efeitos
fx = np.zeros(N)


def passo():
    n = int(0.09 * SR)
    return bp(rng.standard_normal(n), 180, 1600) * env(n, 0.002, 0.018)


for x0, x1, t0, d in CHEGADAS:
    marcas = np.arange(t0, t0 + d, 1 / 200)
    xs = x0 + (x1 - x0) * (1 - (1 - np.clip((marcas - t0) / d, 0, 1)) ** K)
    passos = np.floor((xs - x0) / PASSO)
    for k in np.where(np.diff(passos) > 0)[0]:
        t = marcas[k + 1]
        v = (x1 - x0) * K * (1 - (t - t0) / d) ** (K - 1) / d
        if t >= 0 and xs[k + 1] > -20:
            add(fx, t, passo(), 0.35 * min(1, 0.35 + v / 500))


def varredura(f0, f1, dur=0.28, brilho=1.0):
    n = int((dur + 0.35) * SR)
    x = np.arange(n) / SR
    f = f0 + (f1 - f0) * np.clip(x / dur, 0, 1) ** 0.7
    tom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, x / 0.02) * np.exp(-np.maximum(0, x - dur) / 0.08)
    ar = hp(rng.standard_normal(n), 3000) * np.minimum(1, x / 0.01) * np.exp(-x / 0.12) * 0.25 * brilho
    clique = np.zeros(n)
    clique[:int(0.004 * SR)] = np.hanning(int(0.004 * SR)) * 0.6
    return tom * 0.5 + ar + clique


NOTAS = [72, 76, 79, 83]  # dó, mi, sol, si: cada modelo uma nota acima
for k, t in enumerate(EDICOES):
    m = NOTAS[k % len(NOTAS)]
    add(fx, t, varredura(hz(m) * 0.5, hz(m)), 0.33)


def sino(m, dur=1.6):
    n = int(dur * SR)
    x = np.arange(n) / SR
    f = hz(m)
    return (np.sin(2 * np.pi * f * x) + 0.4 * np.sin(2 * np.pi * 2.76 * f * x) * np.exp(-x / 0.15)) * env(n, 0.003, dur / 4)


if APENAS_UM is not None:
    add(fx, APENAS_UM, sino(88, 1.4), 0.10)  # brilho branco no destaque


def sopro(f0, f1, dur):
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    ruido = rng.standard_normal(n)
    out = np.zeros(n)
    bloco = 1024
    for i in range(0, n, bloco):
        fc = f0 * (f1 / f0) ** x[i]
        seg = ruido[max(0, i - 2048):i + bloco]
        out[i:i + bloco] = bp(seg, fc * 0.6, min(fc * 1.6, 20000))[-len(out[i:i + bloco]):]
    return out * np.sin(np.pi * x) ** 1.5


if SOBE is not None:
    add(fx, SOBE - 0.05, sopro(300, 2800, 0.7), 0.16)
    add(fx, DESCE - 0.02, sopro(2600, 260, 0.55), 0.12)

# virada: impacto grave + acorde aceso (dó maior aberto)
nv = int(1.6 * SR)
xv = np.arange(nv) / SR
impacto = np.sin(2 * np.pi * np.cumsum(42 + 70 * np.exp(-xv / 0.05)) / SR) * env(nv, 0.002, 0.35)
impacto += lp(rng.standard_normal(nv), 900) * env(nv, 0.001, 0.06) * 0.5
if VIRADA is not None:
    add(fx, VIRADA, impacto, 0.55)
    for m in (72, 76, 79, 84):
        add(fx, VIRADA + 0.01, sino(m, 2.2), 0.06)

for ED_VOCE in VOCE:
    add(fx, ED_VOCE, varredura(hz(84) * 0.5, hz(84)), 0.33)  # a sua tela sai editada, verde
    for m in (79, 84, 88):
        add(fx, ED_VOCE + VARRE, sino(m, 1.4), 0.05)

nt = int(0.7 * SR)
xt = np.arange(nt) / SR
if APAGAO is not None:
    add(fx, APAGAO, np.sin(2 * np.pi * 46 * xt) * env(nt, 0.004, 0.18), 0.35)  # apagão

for t0, dig, n_letras in MORAL:  # um toque a cada 2 letras digitadas
    for k in range(0, n_letras, 2):
        nk = int(0.03 * SR)
        add(fx, t0 + k * dig / n_letras, hp(rng.standard_normal(nk), 2500) * env(nk, 0.001, 0.006), 0.07)

fx *= np.clip((D - tt) / 0.25, 0, 1)


def grava(nome, x, ganho_db):
    x = x * db(ganho_db)
    pico = np.max(np.abs(x))
    if pico > 0.98:
        raise SystemExit(f'{nome}: pico {pico:.2f} estoura, baixe o ganho')
    wavfile.write(SAIDA / nome, SR, (np.stack([x, x], 1) * 32767).astype(np.int16))
    print(f'{SAIDA / nome}  pico {20 * np.log10(pico + 1e-9):.1f} dBFS')


G_TRILHA = float(sys.argv[1]) if len(sys.argv) > 1 else -6.0
G_FX = float(sys.argv[2]) if len(sys.argv) > 2 else -8.0
grava('trilha.wav', trilha / (np.max(np.abs(trilha)) + 1e-9), G_TRILHA)
grava('efeitos.wav', fx / (np.max(np.abs(fx)) + 1e-9), G_FX)
print('batida 0 em', round(b0, 3), '| virada em', VIRADA)
