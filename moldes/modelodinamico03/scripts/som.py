"""Trilha escura de trailer (drone grave + pulso lento) e efeitos só nas texturas: glitch no VHS, whoosh nos desfoques e no
chicote, sopro no flash branco e um impacto grave nas palavras vermelhas. Mesma receita do vídeo aprovado
do modelo (2026-10-08), com os tempos da fala da vitrine (índices de src/palavras.json). Saída: public/trilha.wav.
uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/som.py [--efeitos] [--saida arquivo.wav]
(o glitch do VHS só entra com --efeitos, o mesmo padrão da prop efeitos do vídeo: desligado)
"""
import json
import sys
import wave
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

AQUI = Path(__file__).resolve().parent.parent
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
SR = 48000
with wave.open(str(AQUI / 'public' / 'voz.wav')) as _v:
    D = round(_v.getnframes() / _v.getframerate(), 2)  # duração da fala
N = int(D * SR)
tt = np.arange(N) / SR
rng = np.random.default_rng(11)
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
bp = lambda x, a, b: sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)


def w(i):
    """início da palavra i de src/palavras.json"""
    return PS[i]['start']


def add(buf, t, s, g):
    i = int(t * SR)
    j = min(N, i + len(s))
    if 0 <= i < N:
        buf[i:j] += g * s[:j - i]


# drone: lá grave + quinta, batimento lento, e um pulso a cada 2 s
drone = sum(np.sin(2 * np.pi * f * tt + k) * a for k, (f, a) in enumerate(((55, 0.5), (55.4, 0.4), (82.4, 0.25), (110, 0.12))))
drone = lp(drone, 400) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.07 * tt))
pulso = np.zeros(N)
for i in range(int(D / 2)):
    n0 = int(i * 2 * SR)
    seg = np.arange(min(N - n0, int(0.9 * SR))) / SR
    pulso[n0:n0 + len(seg)] += np.sin(2 * np.pi * 46 * seg) * np.exp(-seg * 6)
cama = drone * 0.5 + pulso * 0.35
cama *= np.minimum(1, tt / 1.2) * np.minimum(1, (D - tt) / 1.5)


def whoosh(d):
    n = int(d * SR)
    return bp(rng.standard_normal(n), 300, 3500) * np.sin(np.linspace(0, np.pi, n)) ** 2


def glitch(d):
    n = int(d * SR)
    s = rng.standard_normal(n) * (rng.random(n) > 0.5)
    s = bp(s, 800, 6000) * np.repeat(rng.random(n // 400 + 1) > 0.4, 400)[:n]
    return s * np.exp(-np.linspace(0, 3, n))


def impacto(d=1.4, f=42):
    t = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * f * t * (1 - 0.25 * t)) * np.exp(-t * 3.2) + lp(rng.standard_normal(len(t)), 700) * np.exp(-t * 16) * 0.35


fx = np.zeros(N)
c = lambda t: t - 0.06
for i in ((35, 83) if '--efeitos' in sys.argv else ()):                                           # VHS: "se você estiver", fecho "comenta"
    add(fx, c(w(i)), glitch(0.5), 0.5)
for i in (25, 62, 68, 75):                                   # desfoques e o chicote
    add(fx, c(w(i)) - 0.22, whoosh(0.4), 0.35)
fl = c(w(51))
add(fx, fl - 0.5, whoosh(0.6) * np.linspace(0, 1, int(0.6 * SR)), 0.4)  # sopro antes do flash ("colocar")
for t in (w(4), w(19), w(30), w(47) - 0.06, w(71), w(84)):  # 100%, MODELOS, VÍDEO, nome do modelo, EDIÇÃO, EDIÇÃO (2ª rodada: TRÊS VEZES saiu)
    add(fx, t - 0.03, impacto(), 0.55)

mix = cama / (np.max(np.abs(cama)) + 1e-9) + fx
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 10 ** (-6 / 20)
saida = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'public' / 'trilha.wav'
wavfile.write(saida, SR, (np.stack([mix, mix], 1) * 32767).astype(np.int16))
print(saida, round(D, 2))
