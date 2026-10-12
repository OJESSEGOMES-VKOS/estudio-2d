"""Receita do vídeo aprovado: cama escura bem baixa + golpes só nas ênfases (cortes, letreiro, tela de destaque, fecho).
Os tempos saem de src/palavras.json com a mesma regra do Corte.tsx (corte 2 quadros antes da palavra).
Saída: public/trilha.wav.
uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/som.py [--saida arquivo.wav]
"""
import json, sys, wave
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

AQUI = Path(__file__).resolve().parent.parent
# entrada padrão: src/palavras.json [{text,start,end}]; a duração é a de public/voz.wav
_ps = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
with wave.open(str(AQUI / 'public' / 'voz.wav')) as _v:
    _dur = round(_v.getnframes() / _v.getframerate(), 2)
P = {'duracao': _dur, 'palavras': [{'texto': p['text'], 'de': p['start'], 'ate': p['end']} for p in _ps]}
SR = 48000
D = P['duracao']
N = int(D * SR)
rng = np.random.default_rng(3)


def w(txt, n=1):
    k = 0
    for p in P['palavras']:
        if p['texto'].lower().strip('.,!?') == txt and (k := k + 1) == n:
            return p['de']
    raise KeyError(txt)


def add(buf, t, s, g):
    i = int(t * SR)
    j = min(N, i + len(s))
    if 0 <= i < N:
        buf[i:j] += g * s[:j - i]


def whoosh(d):
    n = int(d * SR)
    return sosfilt(butter(2, [300, 3000], 'band', fs=SR, output='sos'), rng.standard_normal(n)) * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.5


def impacto(f=48, d=1.2):
    t = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * f * t * (1 - 0.3 * t)) * np.exp(-t * 3.5) + sosfilt(butter(2, 900, 'low', fs=SR, output='sos'), rng.standard_normal(len(t))) * np.exp(-t * 14) * 0.4


c = lambda t: t - 0.06
# 2026-10-12 (pedido do Jessé): sem P&B, sem nome do modelo, sem tela creme do "Inclusive"; tela de destaque no
# "você está vendo apenas um desses modelos."; prévias desde o "Eu posso até".
base1, base2, base3 = c(w('ele')), c(w('para', 2)), c(w('inclusive'))
destaque, previas, bloco2, base4, cta, fecho = w('você', 2), c(w('eu', 2)), c(w('mas')), w('como') + 0.04, c(w('comenta')), c(w('que', 2))

tt = np.arange(N) / SR
pad = sum(np.sin(2 * np.pi * f * tt) * a for f, a in ((55, 0.5), (82.4, 0.3), (110, 0.25), (130.8, 0.18)))
pad *= 0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * tt)
pad = sosfilt(butter(2, 500, 'low', fs=SR, output='sos'), pad) * 0.05
pad[(tt >= destaque) & (tt < previas)] *= 0.6  # a tela de destaque é respiro

fx = np.zeros(N)
for x in (base1, base2, base3, previas, base4):
    add(fx, x - 0.15, whoosh(0.3), 0.35)
for x in (bloco2, cta):  # chicotes
    add(fx, x - 0.12, whoosh(0.24), 0.5)
add(fx, destaque - 0.1, whoosh(0.5), 0.2)
add(fx, w('modelos'), whoosh(0.6), 0.25)  # letreiro
add(fx, w('modelos', 2), impacto(60, 0.8), 0.35)  # "modelos." da tela de destaque
add(fx, w('edição', 2), impacto(55, 0.9), 0.4)
add(fx, fecho, impacto(40, 1.6), 0.9)

mix = pad + fx
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 10 ** (-9 / 20)
saida = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'public' / 'trilha.wav'
wavfile.write(saida, SR, (np.stack([mix, mix], 1) * 32767).astype(np.int16))
print(saida, round(D, 2))
