"""Trilha do storypodcast01: cama contínua por baixo da voz (MODELO §10: as refs têm chão de som de -24,6 a -28,3 dB,
provável trilha contínua). Pad escuro e frio de podcast de reflexão, 4 acordes lentos (Lá menor, Fá, Dó, Mi menor), com
um sopro grave discreto na entrada do P&B e um whoosh curto no chicote. Corte seco no fim, como o vídeo.
Saída: public/trilha.wav.  uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/trilha.py [--saida arquivo.wav]
"""
import json, sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

AQUI = Path(__file__).resolve().parent.parent
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
SR = 48000
D = 29.83  # = DURACAO do src/Reel.tsx (corte seco 0,2 s depois da última palavra); muda a cada vídeo
N = int(D * SR)
tt = np.arange(N) / SR
rng = np.random.default_rng(7)
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
bp = lambda x, a, b: sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

ACORDES = [(0.0, [45, 52, 57, 60, 64]), (7.4, [41, 48, 57, 60, 64]), (14.9, [48, 55, 60, 64, 67]), (22.3, [40, 47, 55, 59, 64])]
pad = np.zeros(N)
for k, (t0, notas) in enumerate(ACORDES):
    t1 = ACORDES[k + 1][0] if k + 1 < len(ACORDES) else D + 1
    env = np.clip((tt - t0 + 0.8) / 1.6, 0, 1) * np.clip((t1 + 0.8 - tt) / 1.6, 0, 1)
    for m in notas:
        f = hz(m)
        for det in (-0.12, 0.12):
            ph = rng.random() * 6.28
            v = np.sin(2 * np.pi * (f + det) * tt + ph) + 0.25 * np.sin(2 * np.pi * 2 * (f + det) * tt + ph) + 0.08 * np.sin(2 * np.pi * 3 * (f + det) * tt)
            pad += v * env * (1.0 if m < 50 else 0.55)
pad = lp(pad, 900) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.11 * tt))
pad += lp(rng.standard_normal(N), 500) * 0.04  # ar do quarto
pad /= np.max(np.abs(pad)) + 1e-9


def add(buf, t, s, g):
    i = int(t * SR)
    j = min(N, i + len(s))
    if 0 <= i < N:
        buf[i:j] += g * s[:j - i]


fx = np.zeros(N)
pb = PS[41]['start'] - 0.06  # entrada do P&B (clarão)
tb = np.arange(int(1.6 * SR)) / SR
add(fx, pb - 0.02, np.sin(2 * np.pi * 48 * tb * (1 - 0.2 * tb)) * np.exp(-tb * 2.6), 0.45)
nw = int(0.35 * SR)
add(fx, PS[83]['start'] - 0.06 - 0.2, bp(rng.standard_normal(nw), 400, 4000) * np.sin(np.linspace(0, np.pi, nw)) ** 2, 0.18)

mix = pad * np.minimum(1, tt / 1.5) + fx
mix[-int(0.01 * SR):] *= np.linspace(1, 0, int(0.01 * SR))
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 10 ** (-6 / 20)
saida = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'public' / 'trilha.wav'
wavfile.write(saida, SR, (np.stack([mix, mix], 1) * 32767).astype(np.int16))
print(saida, D)
