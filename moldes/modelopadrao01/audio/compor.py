"""Trilha e efeitos sintetizados no tempo da imagem (lê src/tempos.json), o mesmo som do v4 do modelopadrao01.
Sem amostra, sem IA. Cama calma (acordes suaves) bem abaixo da voz; efeito só em evento de verdade; silêncio na
virada ("Mas se você quiser"). Saída: public/trilha.wav (48 kHz estéreo); com --previas, public/trilha_previas.wav
(soma os sons das prévias).
uso (de dentro do molde): ../../.venv/Scripts/python.exe audio/compor.py [--previas] [--saida arquivo.wav]
"""
import json, sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

AQUI = Path(__file__).parent.parent
T = json.loads((AQUI / 'src' / 'tempos.json').read_text(encoding='utf-8'))
SR = 48000
PREVIAS = '--previas' in sys.argv
D = T['duracao'] + 0.3
N = int(D * SR)
cama = np.zeros(N)
fx = np.zeros(N)
rng = np.random.default_rng(7)


def env(n, a, r):
    e = np.ones(n)
    ka, kr = int(a * SR), int(r * SR)
    e[:ka] = np.linspace(0, 1, ka)
    e[n - kr:] *= np.linspace(1, 0, kr)
    return e


def add(buf, t, sinal, g=1.0):
    i = int(t * SR)
    j = min(N, i + len(sinal))
    if i < N:
        buf[i:j] += g * sinal[:j - i]


def nota(f, d, a=0.4, r=1.2):
    t = np.arange(int(d * SR)) / SR
    s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    return s * env(len(t), a, r)


# cama: progressão lenta (Am - F - C - G), 4 s por acorde, oitava média, filtrada
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
acordes = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
for k, t0 in enumerate(np.arange(0, D, 4.0)):
    for m in acordes[k % 4]:
        add(cama, t0, nota(hz(m), 4.6, 1.2, 1.8), 0.08)
    add(cama, t0, nota(hz(acordes[k % 4][0] - 12), 4.6, 0.8, 1.8), 0.10)
cama = sosfilt(butter(2, 1800, 'low', fs=SR, output='sos'), cama)

# a virada: a cama some e volta (respiro antes da tese)
S = T['silencio']
tt = np.arange(N) / SR
ganho = np.ones(N)
ganho[(tt >= S['de']) & (tt < S['ate'])] = 0
volta = (tt >= S['ate']) & (tt < S['ate'] + 0.8)
ganho[volta] = (tt[volta] - S['ate']) / 0.8
cama *= np.convolve(ganho, np.ones(480) / 480, mode='same')


def whoosh(d=0.35):
    n = int(d * SR)
    r = rng.standard_normal(n)
    r = sosfilt(butter(2, [400, 3500], 'band', fs=SR, output='sos'), r)
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return r * e * 0.5


def pop(f=900):
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t * (1 - 2.5 * t)) * np.exp(-t * 45)


def tique():
    n = int(0.025 * SR)
    return rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 260) * 0.4


def grave():
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * 55 * t) * np.exp(-t * 6)


def snip():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    r = rng.standard_normal(n) * np.exp(-t * 60)
    return sosfilt(butter(2, 2500, 'high', fs=SR, output='sos'), r) * 0.8 + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 80) * 0.3


ED, MO, CE, PV, PR, FE = (T[k] for k in ('editor', 'modelos', 'celular', 'previas', 'prompt', 'fecho'))
# editor: o vídeo entra, a lâmina, a legenda, a tela, o vídeo cresce
add(fx, ED['de'] - 0.2, whoosh(0.5), 0.5)
add(fx, ED['corte'], snip(), 0.7)
add(fx, ED['legenda'], pop(880), 0.35)
add(fx, ED['tela'], pop(1100), 0.35)
add(fx, ED['devolve'] - 0.1, whoosh(0.5), 0.5)
# os modelos: um pop por cartão, ✓, barras, formatos, o Claude
passo = (MO['modelos'] - MO['de'] - 0.12) / 7
for k in range(8):
    add(fx, MO['de'] + 0.12 + k * passo, pop(700 + 40 * k), 0.14)
for k in range(8):
    add(fx, MO['criei'] + 0.05 * k, tique(), 0.3)
add(fx, MO['melhorei'], whoosh(0.45), 0.25)
add(fx, MO['editar'], whoosh(0.3), 0.3)
for k, t0 in enumerate(MO['formatos']):
    add(fx, t0, pop(950 + 120 * k), 0.3)
add(fx, MO['claude'], pop(1300), 0.35)
add(fx, MO['sai'] - 0.1, whoosh(), 0.45)
# o celular: interface do Reel, os outros modelos saem de trás, o nome, devolve
add(fx, CE['instagram'], pop(1000), 0.3)
add(fx, CE['desses'] - 0.1, whoosh(0.4), 0.35)
add(fx, CE['nome'], pop(1250), 0.4)
add(fx, CE['devolve'] - 0.1, whoosh(0.5), 0.45)
if PREVIAS:
    add(fx, PV['de'] - 0.1, whoosh(), 0.45)
    add(fx, PV['x3'], pop(1300), 0.35)
    add(fx, PV['sai'] - 0.1, whoosh(), 0.45)
add(fx, T['outros']['de'], pop(900), 0.3)
# o prompt: digitando as palavras dele, envia
add(fx, PR['de'] - 0.1, whoosh(), 0.45)
for t0 in PR['palavras']:
    for j in range(3):
        add(fx, t0 + j * 0.05, tique(), 0.35)
add(fx, PR['palavras'][-1], pop(1200), 0.35)
add(fx, PR['sai'] - 0.1, whoosh(), 0.4)
# fecho: o campo sobe, EDIÇÃO digitada, envia, a DM chega
add(fx, FE['comenta'] + 0.2, whoosh(0.35), 0.35)
for j in range(6):
    add(fx, FE['edicao'] + j * 0.07, tique(), 0.4)
add(fx, FE['embaixo'], pop(1100), 0.35)
add(fx, FE['mandar'] - 0.1, whoosh(0.4), 0.4)
add(fx, FE['dm'], pop(1300), 0.4)
add(fx, S['de'] + 0.05, grave(), 0.6)

mix = cama + fx
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 10 ** (-9 / 20)
est = np.stack([mix, mix], axis=1)
nome = 'trilha_previas.wav' if PREVIAS else 'trilha.wav'
saida = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'public' / nome
wavfile.write(saida, SR, (est * 32767).astype(np.int16))
print(saida, round(D, 2), 's')
