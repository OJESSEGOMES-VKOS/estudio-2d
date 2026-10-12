"""modelodinamico02: cama + efeitos no tempo das palavras do decupado (src/d1/palavras.json).
Os instantes repetem as âncoras de src/d2/Cenas.tsx (mesmas palavras). Saída: public/d2/trilha.wav.
uso (de dentro do molde): ../../.venv/Scripts/python.exe d2/som.py
"""
import json
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

AQUI = Path(__file__).resolve().parent.parent
P = json.loads((AQUI / 'src' / 'd1' / 'palavras.json').read_text(encoding='utf-8'))
SR = 48000
D = P['duracao'] + 1.2
N = int(D * SR)
rng = np.random.default_rng(11)



def limpa(s):
    return s.lower().strip('.,!?')


def w(txt, n=1):
    k = 0
    for p in P['palavras']:
        if limpa(p['texto']) == txt and (k := k + 1) == n:
            return p['de']
    raise KeyError(txt)


def env(n, a, r):
    e = np.ones(n)
    ka, kr = int(a * SR), int(r * SR)
    e[:ka] = np.linspace(0, 1, ka)
    e[n - kr:] *= np.linspace(1, 0, kr)
    return e


def add(buf, t, s, g=1.0):
    i = int(t * SR)
    j = min(N, i + len(s))
    if 0 <= i < N:
        buf[i:j] += g * s[:j - i]


def nota(f, d, a=0.4, r=1.2):
    t = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * env(len(t), a, r)


def whoosh(d=0.3):
    n = int(d * SR)
    r = sosfilt(butter(2, [500, 4000], 'band', fs=SR, output='sos'), rng.standard_normal(n))
    return r * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.5


def pop(f=900):
    t = np.arange(int(0.09 * SR)) / SR
    return np.sin(2 * np.pi * f * t * (1 - 2.5 * t)) * np.exp(-t * 45)


def tique():
    n = int(0.025 * SR)
    return rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 260) * 0.4


def snip():
    t = np.arange(int(0.12 * SR)) / SR
    r = sosfilt(butter(2, 2500, 'high', fs=SR, output='sos'), rng.standard_normal(len(t)) * np.exp(-t * 60))
    return r * 0.8 + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 80) * 0.3


# cama: Am - F - C - G, 2 s por acorde (mais andada que a do modelopadrao01), bem baixa
cama = np.zeros(N)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
acordes = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
for k, t0 in enumerate(np.arange(0, D, 2.0)):
    for m in acordes[k % 4]:
        add(cama, t0, nota(hz(m), 2.4, 0.3, 0.9), 0.07)
    add(cama, t0, nota(hz(acordes[k % 4][0] - 12), 2.4, 0.05, 0.9), 0.12)
    for b in range(4):  # pulso leve em colcheia
        add(cama, t0 + b * 0.5, tique(), 0.10)
cama = sosfilt(butter(2, 2200, 'low', fs=SR, output='sos'), cama)

fx = np.zeros(N)
cortes = [w('100%'), w('eu'), w('cada'), w('que'), w('foi', 2), w('mas'), w('chegar'), w('na'), w('ele', 2), w('analisando'), w('frame'),
          w('através'), w('muitas'), w('aqui', 2), w('te'), w('o', 4), w('do'), w('sendo'), w('ou'), w('mas', 2)]
for c in cortes:  # cada troca de fundo ganha um golpe curto
    add(fx, c - 0.06 - 0.1, whoosh(0.22), 0.4)
    add(fx, c - 0.06, pop(180), 0.5)
for t0 in (w('ele', 2), w('do')):  # as íris
    add(fx, t0 - 0.2, whoosh(0.6), 0.45)
add(fx, w('claude'), pop(1300), 0.35)
add(fx, w('mandei') + 0.65, pop(1000), 0.4)
add(fx, w('corte'), snip(), 0.6)
add(fx, w('decidiu'), whoosh(0.3), 0.35)
for p in P['palavras']:
    if w('edita') - 0.01 <= p['de'] <= w('mim') + 0.01:
        for j in range(3):
            add(fx, p['de'] + j * 0.07, tique(), 0.4)
for k in range(9):
    add(fx, w('método') + k * 0.11, pop(500 + 60 * k), 0.15)
for k in range(16):
    add(fx, w('analisando') + k * (w('160') - w('analisando')) / 16, tique(), 0.3)
add(fx, w('160'), pop(1250), 0.45)
for m in (w('frame'), w('frame', 2)):
    add(fx, m, snip(), 0.45)
for k in range(6):
    add(fx, w('desenvolvemos', 2) + k * 0.22, pop(900 + 80 * k), 0.15)
    add(fx, w('regras') + 0.15 + k * 0.2, pop(700 + 50 * k), 0.15)
add(fx, w('claude', 3), pop(1300), 0.35)
add(fx, w('aplicadas') + 0.2, whoosh(0.3), 0.3)
add(fx, w('teste') + 0.15, pop(140), 0.8)
add(fx, w('calibrando'), whoosh(0.4), 0.3)
add(fx, w('aqui', 3), pop(1300), 0.4)

mix = cama + fx
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 10 ** (-9 / 20)
wavfile.write(AQUI / 'public' / 'd2' / 'trilha.wav', SR, (np.stack([mix, mix], 1) * 32767).astype(np.int16))
print('public/d2/trilha.wav', round(D, 2), 's; cortes', [round(c, 2) for c in cortes])
