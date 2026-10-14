"""Efeitos só nas texturas (whoosh nos desfoques e no chicote, sopro antes do flash branco, impacto grave nas palavras
vermelhas, glitch no VHS) e, com --cama, a trilha escura de trailer (drone grave + pulso lento). Mesma receita do vídeo
aprovado do modelo (2026-10-08). Saída: public/trilha.wav, do tamanho do vídeo (fim da última palavra + 0,73 s).
uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/som.py [--cama] [--efeitos] [--saida arquivo.wav]
--cama: liga a música (desligada por padrão, regras da casa; a vitrine saiu com ela).
--efeitos: liga o glitch do VHS (use junto com a prop efeitos: true; desligado por padrão, como a prop).
Os eventos ficam no PLANO DO SOM abaixo, com o índice da palavra em src/palavras.json e a palavra esperada: são os mesmos
cortes de src/Reel.tsx e se refazem junto com ele. Se a fala mudou, o script para e diz a linha a refazer.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

# ---------------------------------------------------------------- o PLANO DO SOM (refazer num vídeo novo; lista vazia desliga)
# (índice da palavra, palavra esperada[, deslocamento em s])
VHS = [(35, 'se'), (83, 'comenta')]                                   # glitch no início de cada VHS (só com --efeitos)
DESFOQUES = [(25, 'para'), (62, 'mas'), (68, 'outros'), (75, 'aprender')]  # whoosh nos desfoques e no chicote
FLASHES = [(51, 'colocar')]                                           # sopro antes do flash branco
IMPACTOS = [(4, '100%'), (19, 'modelos'), (30, 'vídeo'), (47, 'modelos.', -0.06), (71, 'edição'), (84, 'edição')]  # palavras vermelhas
# ---------------------------------------------------------------- fim do plano

AQUI = Path(__file__).resolve().parent.parent
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
if not PS:
    sys.exit('src/palavras.json está vazio: este molde precisa da fala transcrita.')
FONTE = Path(__file__).read_text(encoding='utf-8').splitlines()


def sem(s):
    s = unicodedata.normalize('NFD', s)
    return re.sub(r'[^a-z0-9%]', '', ''.join(c for c in s if not unicodedata.combining(c)).lower())


def w(ev):
    """início da palavra do evento, conferida contra a fala (ignora maiúscula, acento e pontuação)"""
    i, esperada = ev[0], ev[1]
    if i >= len(PS) or sem(PS[i]['text']) != sem(esperada):
        achada = f'"{PS[i]["text"]}"' if i < len(PS) else f'nada (a fala só vai de 0 a {len(PS) - 1})'
        linha = next((k + 1 for k, l in enumerate(FONTE) if f'({i}, {esperada!r}' in l), '?')
        sys.exit(f'O plano do som não bate com a fala de src/palavras.json.\nscripts/som.py:{linha}: o evento ({i}, {esperada!r}) '
                 f'espera "{esperada}" na palavra {i}, e a fala tem {achada}.\n'
                 'Refaça o PLANO DO SOM com os mesmos cortes da seção "O PLANO" de src/Reel.tsx (modelos/modelodinamico03/modelodinamico03.md, seção do vídeo novo).')
    return PS[i]['start'] + (ev[2] if len(ev) > 2 else 0)


SR = 48000
D = round(PS[-1]['end'] + 0.73, 2)  # a duração do vídeo (src/Reel.tsx: DURACAO)
N = int(D * SR)
tt = np.arange(N) / SR
rng = np.random.default_rng(11)
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
bp = lambda x, a, b: sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)


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
for ev in (VHS if '--efeitos' in sys.argv else ()):                  # VHS: "se você estiver", fecho "comenta"
    add(fx, c(w(ev)), glitch(0.5), 0.5)
for ev in DESFOQUES:                                                  # desfoques e o chicote
    add(fx, c(w(ev)) - 0.22, whoosh(0.4), 0.35)
for ev in FLASHES:                                                    # sopro antes do flash ("colocar")
    add(fx, c(w(ev)) - 0.5, whoosh(0.6) * np.linspace(0, 1, int(0.6 * SR)), 0.4)
for ev in IMPACTOS:  # 100%, MODELOS, VÍDEO, nome do modelo, EDIÇÃO, EDIÇÃO (2ª rodada: TRÊS VEZES saiu)
    add(fx, w(ev) - 0.03, impacto(), 0.55)

# a mesma régua de volume com ou sem a cama: os efeitos saem no mesmo nível nos dois casos
ref = cama / (np.max(np.abs(cama)) + 1e-9) + fx
mix = ref if '--cama' in sys.argv else fx
mix = mix / (np.max(np.abs(ref)) + 1e-9)
mix *= 10 ** (-6 / 20)
saida = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'public' / 'trilha.wav'
wavfile.write(saida, SR, (np.stack([mix, mix], 1) * 32767).astype(np.int16))
print(saida, round(D, 2), 's', 'com a cama' if '--cama' in sys.argv else 'só efeitos')
