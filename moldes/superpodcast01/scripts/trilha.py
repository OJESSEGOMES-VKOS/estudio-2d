"""Trilha do superpodcast01 (MODELO §9): cama contínua por baixo da voz (o chão não cai nas pausas), batida alta junto
do vazamento de abertura (ref2: pico nos primeiros 0,6 s) e uma batida com sopro no vazamento da virada (20,15 s).
Clima frio de minidocumentário: drone grave em Ré menor, pulso surdo lento (80 bpm), notas esparsas de piano frio
e ar agudo. Sintetizada aqui (sem música de terceiro).
Saída: public/trilha.wav (cama + batidas: a música, opção) e public/efeitos.wav (só as batidas e o sopro, no mesmo nível
em que estão na trilha: o padrão do modelo, que o mixar.sh usa quando a música está desligada).
A duração é a de src/Reel.tsx (última palavra + FOLGA, lido de lá: uma fonte só). Num vídeo novo, VAZAMENTOS abaixo = os
mesmos de src/Reel.tsx.
uso: ../../.venv/Scripts/python.exe scripts/trilha.py   (SAIDA=<pasta> grava fora de public/)
"""
import json
import os
import re
import sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

AQUI = Path(__file__).resolve().parent.parent
SR = 48000
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
_folga = re.search(r'^const FOLGA = ([\d.]+);', (AQUI / 'src' / 'Reel.tsx').read_text(encoding='utf-8'), re.M)
if not PS or not _folga:
    sys.exit('scripts/trilha.py: preciso de src/palavras.json com a fala e de "const FOLGA = <segundos>;" em src/Reel.tsx.')
D = round(PS[-1]['end'] + float(_folga.group(1)), 2)  # = DURACAO do src/Reel.tsx
VAZAMENTOS = [0.0, 19.99]  # = VAZAMENTOS do src/Reel.tsx: batida alta na abertura, sopro + batida na virada
N = int(D * SR)
tt = np.arange(N) / SR
rng = np.random.default_rng(11)
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
hp = lambda x, f: sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
bp = lambda x, a, b: sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)


def add(buf, t, s, g):
    i = int(t * SR)
    j = min(N, i + len(s))
    if 0 <= i < N:
        buf[i:j] += g * s[:j - i]


# drone: Ré menor -> Si bemol -> Fá -> Dó, trocando a cada ~7,5 s, bem filtrado
ACORDES = [(0.0, [38, 45, 50, 53]), (7.5, [34, 41, 50, 53]), (15.0, [41, 48, 53, 57]), (22.5, [36, 43, 52, 55])]
drone = np.zeros(N)
for k, (t0, notas) in enumerate(ACORDES):
    t1 = ACORDES[k + 1][0] if k + 1 < len(ACORDES) else D + 1
    env = np.clip((tt - t0 + 0.6) / 1.2, 0, 1) * np.clip((t1 + 0.6 - tt) / 1.2, 0, 1)
    for m in notas:
        f = hz(m)
        for det in (-0.15, 0.15):
            drone += (np.sin(2 * np.pi * (f + det) * tt + rng.random() * 6.28) + 0.2 * np.sin(4 * np.pi * (f + det) * tt)) * env * (1.0 if m < 45 else 0.45)
drone = lp(drone, 700)
drone /= np.max(np.abs(drone)) + 1e-9

# pulso surdo a 80 bpm (um "coração" grave), entra depois da abertura
pulso = np.zeros(N)
tb = np.arange(int(0.35 * SR)) / SR
bumbo = np.sin(2 * np.pi * (52 + 40 * np.exp(-tb * 30)) * tb) * np.exp(-tb * 9)
b = 60 / 80
t = 0.75
while t < D - 0.3:
    add(pulso, t, bumbo, 1.0 if int(round(t / b)) % 2 == 0 else 0.6)
    t += b

# notas esparsas de piano frio (seno com harmônicos e queda), Ré menor pentatônica
piano = np.zeros(N)
tn = np.arange(int(2.5 * SR)) / SR
NOTAS = [(1.5, 74), (4.5, 72), (6.0, 69), (9.0, 77), (12.0, 74), (13.5, 72), (16.5, 69), (18.0, 72), (21.0, 74), (24.0, 77), (25.5, 74), (27.0, 69)]
for t0, m in NOTAS:
    f = hz(m)
    s = (np.sin(2 * np.pi * f * tn) + 0.35 * np.sin(4 * np.pi * f * tn) + 0.12 * np.sin(6 * np.pi * f * tn)) * np.exp(-tn * 2.2) * np.minimum(1, tn / 0.004)
    add(piano, t0, s, 1.0)
piano = lp(piano, 3500)

ar = hp(rng.standard_normal(N), 6000) * 0.5
ar = lp(ar, 11000)

# batidas: abertura (alta, como a ref2) e virada
fx = np.zeros(N)
ti = np.arange(int(1.4 * SR)) / SR
impacto = np.sin(2 * np.pi * (40 + 60 * np.exp(-ti * 18)) * ti) * np.exp(-ti * 3.2) + bp(rng.standard_normal(len(ti)), 200, 3000) * np.exp(-ti * 14) * 0.5
nw = int(0.45 * SR)
sopro = bp(rng.standard_normal(nw), 500, 6000) * np.sin(np.linspace(0, np.pi, nw)) ** 2
for v in VAZAMENTOS:
    if v == 0:
        add(fx, 0.0, impacto, 1.0)
    else:
        add(fx, round(v - 0.24, 2), sopro, 0.35)
        add(fx, round(v + 0.16, 2), impacto, 0.75)

cama = drone * 0.55 + pulso * 0.42 + piano * 0.16 + ar * 0.03
cama *= np.minimum(1, (tt + 0.05) / 0.4)
mix = cama + fx * 0.9
mix[-int(0.25 * SR):] *= np.linspace(1, 0, int(0.25 * SR))
SAIDA = Path(os.environ.get('SAIDA', AQUI / 'public'))
for nome, x in (('trilha.wav', mix), ('efeitos.wav', fx * 0.9)):
    x = x / (np.max(np.abs(mix)) + 1e-9) * 10 ** (-3 / 20)
    wavfile.write(SAIDA / nome, SR, (np.stack([x, x], 1) * 32767).astype(np.int16))
print(SAIDA / 'trilha.wav', SAIDA / 'efeitos.wav', D)
