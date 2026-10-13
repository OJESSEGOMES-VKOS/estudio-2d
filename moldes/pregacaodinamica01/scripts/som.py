"""Receita do vídeo aprovado: cama escura bem baixa + golpes só nas ênfases (cortes, letreiro, tela de destaque, fecho).
Os tempos saem de src/palavras.json com a mesma regra do Corte.tsx (corte 2 quadros antes da palavra).
Saída: public/trilha.wav (cama + golpes: a música, opção) e public/efeitos.wav (só os golpes, no mesmo nível em que estão
na trilha: o padrão do modelo, que o mixar.sh usa quando a música está desligada).
Num vídeo novo, refaça o PLANO DO SOM abaixo com os mesmos trechos de T em src/Corte.tsx (None desliga o golpe).
uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/som.py [--saida arquivo.wav]
"""
import json, math, re, sys, unicodedata
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

AQUI = Path(__file__).resolve().parent.parent
# entrada padrão: src/palavras.json [{text,start,end}]. A duração é a do vídeo, com a mesma conta de src/Corte.tsx (uma
# fonte só): última palavra + FOLGA (lido de lá), em quadros inteiros arredondados para baixo (QUADROS / 30).
_ps = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
if not _ps:
    sys.exit('src/palavras.json está vazio: este molde precisa da fala transcrita.')
_folga = re.search(r'^const FOLGA = ([\d.]+);', (AQUI / 'src' / 'Corte.tsx').read_text(encoding='utf-8'), re.M)
if not _folga:
    sys.exit('scripts/som.py: não achei "const FOLGA = <segundos>;" em src/Corte.tsx (a duração do vídeo sai de lá).')
_dur = math.floor(float(f"{_ps[-1]['end'] + float(_folga.group(1)):.2f}") * 30) / 30
P = {'duracao': _dur, 'palavras': [{'texto': p['text'], 'de': p['start'], 'ate': p['end']} for p in _ps]}
SR = 48000
D = P['duracao']
N = int(D * SR)
rng = np.random.default_rng(3)


def norm(s):
    """sem maiúscula, acento nem pontuação (o Whisper varia), como o norm() do Corte.tsx"""
    s = ''.join(ch for ch in unicodedata.normalize('NFD', s) if not unicodedata.combining(ch))
    return re.sub(r'[^a-z0-9%]', '', s.lower())


def w(txt, n=1):
    k = 0
    for p in P['palavras']:
        if norm(p['texto']) == norm(txt) and (k := k + 1) == n:
            return p['de']
    vez = f' ({n}ª vez)' if n > 1 else ''
    sys.exit(f'scripts/som.py: a palavra "{txt}"{vez} não é dita na fala de src/palavras.json. Refaça o PLANO DO SOM '
             '(neste arquivo) com os mesmos trechos de T em src/Corte.tsx; None desliga o golpe.')


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
# ================================================================ O PLANO DO SOM (o mesmo de T em src/Corte.tsx)
# 2026-10-12 (pedido do Jessé): sem P&B, sem nome do modelo, sem tela creme do "Inclusive"; tela de destaque no
# "você está vendo apenas um desses modelos."; prévias desde o "Eu posso até". None desliga o golpe (e na lista golpes,
# é só tirar o item).
base1, base2, base3 = c(w('ele')), c(w('para', 2)), c(w('inclusive'))
destaque, previas, bloco2, base4, cta, fecho = w('você', 2), c(w('eu', 2)), c(w('mas')), w('como') + 0.04, c(w('comenta')), c(w('que', 2))
letreiro = w('modelos')  # a palavra do LETREIRO
golpes = [(w('modelos', 2), 60, 0.8, 0.35),  # "modelos." da tela de destaque
          (w('edição', 2), 55, 0.9, 0.4)]  # "edição" do Comenta
# ================================================================

tt = np.arange(N) / SR
pad = sum(np.sin(2 * np.pi * f * tt) * a for f, a in ((55, 0.5), (82.4, 0.3), (110, 0.25), (130.8, 0.18)))
pad *= 0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * tt)
pad = sosfilt(butter(2, 500, 'low', fs=SR, output='sos'), pad) * 0.05
if destaque is not None:  # a tela de destaque é respiro, até o próximo trecho ligado
    fim = next((x for x in (previas, bloco2, base4, cta, fecho) if x is not None), D + 1)
    pad[(tt >= destaque) & (tt < fim)] *= 0.6

fx = np.zeros(N)
for x in (base1, base2, base3, previas, base4):
    if x is not None:
        add(fx, x - 0.15, whoosh(0.3), 0.35)
for x in (bloco2, cta):  # chicotes
    if x is not None:
        add(fx, x - 0.12, whoosh(0.24), 0.5)
if destaque is not None:
    add(fx, destaque - 0.1, whoosh(0.5), 0.2)
if letreiro is not None:
    add(fx, letreiro, whoosh(0.6), 0.25)
for t0, f0, d0, g0 in golpes:
    add(fx, t0, impacto(f0, d0), g0)
if fecho is not None:
    add(fx, fecho, impacto(40, 1.6), 0.9)

mix = pad + fx
saida = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'public' / 'trilha.wav'
efeitos = saida.with_name(saida.name.replace('trilha', 'efeitos') if 'trilha' in saida.name else saida.stem + '_efeitos.wav')
for arq, x in ((saida, mix), (efeitos, fx)):
    x = x / (np.max(np.abs(mix)) + 1e-9) * 10 ** (-9 / 20)
    wavfile.write(arq, SR, (np.stack([x, x], 1) * 32767).astype(np.int16))
print(saida, efeitos, round(D, 2))
