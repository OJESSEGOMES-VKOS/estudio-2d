"""Trilha do modelo (a mesma do vídeo do dentista, 2026-10-07): cama
suave e clara em ré maior, bem baixa, + um whoosh leve só no flash da ênfase ("Mas", palavra 62). Saída: public/trilha.wav.
Lê src/palavras_voz.json (scripts/palavras.py).
uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/som.py [--saida arquivo.wav]
"""
import json, sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

AQUI = Path(__file__).resolve().parent.parent
P = json.loads((AQUI / 'src' / 'palavras_voz.json').read_text(encoding='utf-8'))
SR = 48000
D = P['duracao']
N = int(D * SR)
tt = np.arange(N) / SR
rng = np.random.default_rng(7)
flash = P['palavras'][62]['de'] - 0.06

# progressão lenta em ré maior (I - vi - IV - V), 4 compassos de 4 s, acordes em senoides suaves com ataque lento
ACORDES = [(146.8, 185.0, 220.0, 293.7), (123.5, 146.8, 185.0, 246.9), (98.0, 146.8, 196.0, 246.9), (110.0, 138.6, 164.8, 220.0)]
pad = np.zeros(N)
for i in range(int(D // 4) + 1):
    a = i * 4.0
    n0, n1 = int(a * SR), min(N, int((a + 4.6) * SR))
    if n0 >= N:
        break
    seg = tt[n0:n1] - a
    env = np.minimum(1, seg / 1.2) * np.exp(-np.maximum(0, seg - 3.6) * 4)
    for k, f in enumerate(ACORDES[i % 4]):
        pad[n0:n1] += env * np.sin(2 * np.pi * f * seg + k) * (0.28 - k * 0.04)
# pulso de piano leve (nota aguda a cada 1 s)
for i in range(int(D)):
    f = ACORDES[(i // 4) % 4][3] * 2
    n0 = int(i * SR)
    n1 = min(N, n0 + int(0.9 * SR))
    seg = tt[n0:n1] - i
    pad[n0:n1] += np.sin(2 * np.pi * f * seg) * np.exp(-seg * 5) * 0.08
pad = sosfilt(butter(2, 2500, 'low', fs=SR, output='sos'), pad)
pad *= np.minimum(1, tt / 1.5) * np.minimum(1, (D - tt) / 1.5)

n = int(0.35 * SR)
whoosh = sosfilt(butter(2, [400, 4000], 'band', fs=SR, output='sos'), rng.standard_normal(n)) * np.sin(np.linspace(0, np.pi, n)) ** 2
fx = np.zeros(N)
i0 = int((flash - 0.2) * SR)
fx[i0:i0 + n] += whoosh * 0.5

mix = pad / (np.max(np.abs(pad)) + 1e-9) + fx
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 10 ** (-6 / 20)
saida = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'public' / 'trilha.wav'
wavfile.write(saida, SR, (np.stack([mix, mix], 1) * 32767).astype(np.int16))
print(saida, round(D, 2), 'flash', round(flash, 2))
