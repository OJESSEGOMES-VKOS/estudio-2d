"""Trilha do modelo (a mesma do vídeo do dentista, 2026-10-07): cama
suave e clara em ré maior, bem baixa, + um whoosh leve só no flash da ênfase ("Mas", palavra 62).
Saída: public/trilha.wav (cama + whoosh: a música, opção) e public/efeitos.wav (só o whoosh, no mesmo nível em que está
na trilha: o padrão do modelo, que o mixar.sh usa quando a música está desligada).
Lê src/palavras_voz.json (scripts/palavras.py). Num vídeo novo, FLASH abaixo = o tempo do corte da ênfase, o mesmo
FLASH de src/Reel.tsx: um número inteiro é o índice de uma palavra (corte 2 quadros antes dela, como c(de(i)) no Reel);
um número com vírgula decimal (float) são os segundos; --flash <segundos> na linha de comando vale por cima. None tira
o whoosh.
uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/som.py [--flash 8.12] [--saida arquivo.wav]
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
W = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
if [w['text'].strip() for w in W] != [p['texto'] for p in P['palavras']]:
    sys.exit('scripts/som.py: src/palavras_voz.json não é desta fala. Rode antes: ../../.venv/Scripts/python.exe scripts/palavras.py')
FLASH = 62  # int = índice da palavra (corte 2 quadros antes); float = segundos (o FLASH do src/Reel.tsx); None = sem whoosh
if '--flash' in sys.argv:
    FLASH = float(sys.argv[sys.argv.index('--flash') + 1])
if isinstance(FLASH, int) and not 0 <= FLASH < len(P['palavras']):
    sys.exit(f'scripts/som.py: FLASH = {FLASH}, mas a fala tem {len(P["palavras"])} palavras (0 a {len(P["palavras"]) - 1}). '
             'Ponha o índice da palavra da ênfase, os segundos do FLASH do src/Reel.tsx (ex.: 8.12) ou None.')
if isinstance(FLASH, float) and not 0.2 <= FLASH < D:
    sys.exit(f'scripts/som.py: FLASH = {FLASH} s fica fora da fala (0,2 a {D} s).')
flash = None if FLASH is None else P['palavras'][FLASH]['de'] - 0.06 if isinstance(FLASH, int) else FLASH

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
if flash is not None:
    i0 = int((flash - 0.2) * SR)
    j0 = min(N, i0 + n)
    fx[i0:j0] += whoosh[:j0 - i0] * 0.5

mix = pad / (np.max(np.abs(pad)) + 1e-9) + fx
saida = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'public' / 'trilha.wav'
efeitos = saida.with_name(saida.name.replace('trilha', 'efeitos') if 'trilha' in saida.name else saida.stem + '_efeitos.wav')
for arq, x in ((saida, mix), (efeitos, fx)):
    x = x / (np.max(np.abs(mix)) + 1e-9) * 10 ** (-6 / 20)
    wavfile.write(arq, SR, (np.stack([x, x], 1) * 32767).astype(np.int16))
print(saida, efeitos, round(D, 2), 'flash', flash if flash is None else round(flash, 2))
