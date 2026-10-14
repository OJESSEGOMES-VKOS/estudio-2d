"""Trilha do youtubeedition01 (modelos/youtubeedition01/youtubeedition01.md, seção 7): cama contínua por baixo da voz o
vídeo inteiro, voz sempre na frente; efeito curto e discreto na entrada de cada tela.
Clima de vídeo de método no YouTube: piano elétrico macio em Fá maior (Fmaj7, Am7, Dm7, C), baixo redondo, bumbo
leve a 96 bpm e chocalho; um sopro em cada giro do cartão e na tela de reels, um toque curto em cada título e na
palavra-chave do pedido. Sintetizada aqui (sem música de terceiro). A duração sai da fala (src/palavras.json, 0,7 s
depois da última palavra, a mesma do vídeo); os sopros e toques vêm por argumento, e o `node scripts/checar.mjs` imprime
o comando com os deste plano. Música é opção: o vídeo sai sem ela se você não rodar isto.
Saída: public/trilha.wav.
uso: ../../.venv/Scripts/python.exe scripts/trilha.py [--sopros 5.24 11.75 21.91] [--toques 1.2 13.24 27.35]
     (SAIDA=<pasta> grava fora de public/; os números acima são os do aprovado)
"""
import argparse, json, os
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

ap = argparse.ArgumentParser()
ap.add_argument('--sopros', nargs='*', type=float, default=[], help='segundos dos giros do cartão e da tela de reels')
ap.add_argument('--toques', nargs='*', type=float, default=[], help='segundos dos títulos e da palavra-chave do pedido')
a = ap.parse_args()
AQUI = Path(__file__).resolve().parent.parent
SR = 48000
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
D = round((PS[-1]['end'] + 0.7) * 30) / 30  # o DURACAO_Q do src/plano.ts
N = int(D * SR)
tt = np.arange(N) / SR
rng = np.random.default_rng(7)
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
hp = lambda x, f: sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
bp = lambda x, a, b: sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)


def add(buf, t, s, g):
    i = int(t * SR)
    j = min(N, i + len(s))
    if 0 <= i < N:
        buf[i:j] += g * s[:j - i]


BPM = 96
b = 60 / BPM
COMPASSO = 4 * b
# acordes de 1 compasso: Fmaj7, Am7, Dm7, C(add9)
ACORDES = [[53, 57, 60, 64], [57, 60, 64, 67], [50, 57, 60, 65], [48, 55, 62, 64]]
BAIXO = [41, 45, 38, 36]

# piano elétrico: seno + leve modulação (tremolo) com queda, acorde no 1 e um eco no "e" do 3
ep = np.zeros(N)
tn = np.arange(int(2.6 * SR)) / SR


def nota_ep(m, dur=2.4):
    f = hz(m)
    s = np.sin(2 * np.pi * f * tn + 0.8 * np.sin(2 * np.pi * f * tn) * np.exp(-tn * 6))
    s *= np.exp(-tn * 1.6) * np.minimum(1, tn / 0.006) * (1 + 0.12 * np.sin(2 * np.pi * 5 * tn))
    return s


k = 0
t = 0.0
while t < D:
    ac = ACORDES[k % 4]
    for m in ac:
        add(ep, t, nota_ep(m), 0.25)
    for m in ac[1:]:
        add(ep, t + 2.5 * b, nota_ep(m + 12), 0.07)
    # baixo redondo
    tb = np.arange(int(COMPASSO * SR)) / SR
    f = hz(BAIXO[k % 4])
    sb = (np.sin(2 * np.pi * f * tb) + 0.25 * np.sin(4 * np.pi * f * tb)) * np.exp(-tb * 0.9) * np.minimum(1, tb / 0.01)
    add(ep, t, sb, 0.5)
    t += COMPASSO
    k += 1
ep = lp(ep, 2600)

# bumbo leve no 1 e no 3, chocalho em colcheias
bat = np.zeros(N)
tk = np.arange(int(0.3 * SR)) / SR
bumbo = np.sin(2 * np.pi * (48 + 55 * np.exp(-tk * 35)) * tk) * np.exp(-tk * 11)
nch = int(0.06 * SR)
choc = hp(rng.standard_normal(nch), 7000) * np.exp(-np.arange(nch) / SR * 70)
t = 0.0
i = 0
while t < D:
    if i % 4 in (0, 2):
        add(bat, t, bumbo, 1.0)
    add(bat, t, choc, 0.22)
    add(bat, t + b / 2, choc, 0.14)
    t += b
    i += 1

# efeitos: sopro nos giros e na tela de reels, toque curto nos títulos
fx = np.zeros(N)
nw = int(0.42 * SR)
sopro = bp(rng.standard_normal(nw), 600, 7000) * np.sin(np.linspace(0, np.pi, nw)) ** 2
for t0 in a.sopros:
    add(fx, t0 - 0.06, sopro, 0.5)
tq = np.arange(int(0.25 * SR)) / SR
toque = (np.sin(2 * np.pi * 1320 * tq) * 0.6 + np.sin(2 * np.pi * 1980 * tq) * 0.3) * np.exp(-tq * 28)
for t0 in a.toques:
    add(fx, t0, toque, 0.35)

cama = ep * 0.62 + bat * 0.30
cama *= np.minimum(1, (tt + 0.05) / 0.6)
mix = cama + fx
mix[-int(0.5 * SR):] *= np.linspace(1, 0, int(0.5 * SR))
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 10 ** (-3 / 20)
SAIDA = Path(os.environ.get('SAIDA', AQUI / 'public'))
wavfile.write(SAIDA / 'trilha.wav', SR, (np.stack([mix, mix], 1) * 32767).astype(np.int16))
print(SAIDA / 'trilha.wav', round(D, 2))
