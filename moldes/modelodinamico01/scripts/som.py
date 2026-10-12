"""modelodinamico01 (vitrine): só efeitos sonoros, sem música, como o vídeo aprovado do modelo (som_v2.py do reel
editado pelo Claude). Cada som nasce de um evento visual de src/Cenas.tsx (corte, clique, item que entra, ✓, tecla).
Saída: public/sfx.wav (sem prévias) ou public/sfx_previas.wav (com --previas).
uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/som.py [--previas] [--saida arquivo.wav]
"""
import json, sys, wave
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

AQUI = Path(__file__).resolve().parent.parent
# entrada padrão: src/palavras.json [{text,start,end}]; a duração é a de public/voz.wav
_ps = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
with wave.open(str(AQUI / 'public' / 'voz.wav')) as _v:
    _dur = round(_v.getnframes() / _v.getframerate(), 2)
P = {'duracao': _dur, 'palavras': [{'texto': p['text'], 'de': p['start'], 'ate': p['end']} for p in _ps]}
PREVIAS = '--previas' in sys.argv
SR = 48000
D = P['duracao']
N = int(D * SR)
rng = np.random.default_rng(7)


def limpa(s):
    return s.lower().strip('.,!?')


def w(txt, n=1):
    k = 0
    for p in P['palavras']:
        if limpa(p['texto']) == txt and (k := k + 1) == n:
            return p['de']
    raise KeyError(txt)


def add(buf, t, s, g=1.0):
    i = int(t * SR)
    j = min(N, i + len(s))
    if 0 <= i < N:
        buf[i:j] += g * s[:j - i]


def env(n, a, r):
    e = np.ones(n)
    ka, kr = int(a * SR), int(r * SR)
    e[:ka] = np.linspace(0, 1, ka)
    e[n - kr:] *= np.linspace(1, 0, kr)
    return e


def lp(x, f):
    return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)


def tt(d):
    return np.arange(int(d * SR)) / SR


# ---------------------------------------------------------------- os efeitos: curtos, quentes, sem agudo estridente
def clique(g=1.0):
    """clique de interface: estalo curto + corpo grave"""
    t = tt(0.04)
    return (bp(rng.standard_normal(len(t)), 1800, 5000) * np.exp(-t * 260) * 0.7 + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 90) * 0.5) * g


def pop(f=620):
    """popup grave de elemento que surge (pedido do Jessé: no lugar de swoosh): corpo grave que sobe um pouco + estalo macio"""
    g = 150 + (f - 520) * 0.25  # o f antigo só varia o tom: 150 a 225 Hz
    t = tt(0.16)
    corpo = np.sin(2 * np.pi * np.cumsum(g * (1 + 0.9 * np.exp(-t * 40))) / SR) * np.exp(-t * 26)
    estalo = lp(rng.standard_normal(len(t)), 1800) * np.exp(-t * 180) * 0.25
    return lp(corpo + estalo, 2500)


def ar(d=0.32, lo=350, hi=2600):
    """sopro de ar nos cortes"""
    n = int(d * SR)
    return bp(rng.standard_normal(n), lo, hi) * np.sin(np.linspace(0, np.pi, n)) ** 3 * 0.55


def tecla():
    t = tt(0.03)
    return bp(rng.standard_normal(len(t)), 2200, 6000) * np.exp(-t * 320) * 0.55 + np.sin(2 * np.pi * 240 * t) * np.exp(-t * 140) * 0.25


def tic():
    t = tt(0.015)
    return bp(rng.standard_normal(len(t)), 2500, 7000) * np.exp(-t * 450) * 0.5


def toque():
    """confirmação (✓): duas notas de sino, baixas e curtas"""
    s = np.zeros(int(0.9 * SR))
    for k, (f, g) in enumerate(((1318.5, 0.32), (1975.5, 0.22))):
        t = tt(0.8)
        n = (np.sin(2 * np.pi * f * t) + 0.15 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 6) * g
        i = int(k * 0.07 * SR)
        s[i:i + len(n)] += n
    return lp(s, 6000)


def baque(f=75):
    t = tt(0.25)
    return np.sin(2 * np.pi * f * t * (1 - 0.6 * t)) * np.exp(-t * 18)


def tesoura():
    """a lâmina do corte: dois cliques colados"""
    return np.concatenate([clique(0.6), np.zeros(int(0.03 * SR)), clique(0.4)])


def risco(d=0.25):
    n = int(d * SR)
    return bp(rng.standard_normal(n), 1500, 4500) * env(n, 0.03, 0.12) * 0.35


def subida(d):
    """barra de progresso: ruído filtrado que sobe devagar"""
    n = int(d * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    seg = int(0.05 * SR)
    for i in range(0, n, seg):
        f = 500 + 2500 * i / n
        out[i:i + seg] = bp(x[i:i + seg], f, f * 1.6)
    return out * env(n, 0.2, 0.15) * 0.12


fx = np.zeros(N)
c = lambda t: t - 0.06  # os cortes de tema.ts

# cortes entre modos: a tela nova surge com o popup grave (mais baixo quando corta pro rosto)
cortes = {'criado': c(w('ele')), 'modelos': c(w('diferença')), 'instagram': c(w('inclusive')), 'nome': c(w('você', 2)),
          'previas': c(w('eu', 2)), 'mas': c(w('mas')), 'outros': c(w('ver')), 'comenta': c(w('comenta'))}
for nome, t0 in cortes.items():
    rosto = nome == 'mas' or (nome == 'previas' and not PREVIAS)
    add(fx, t0, pop(540 if rosto else 600), 0.3 if rosto else 0.42)

# gancho: o celular, o contador a 100%, o chip do Claude
add(fx, 0.02, pop(560), 0.36)
cem = w('100%')
for k in range(10):
    add(fx, cem + k * 0.035, tic(), 0.35 - k * 0.015)
add(fx, cem + 0.36, pop(820), 0.35)
add(fx, w('claude'), pop(560), 0.4)

# criado: as linhas da pasta entram, a última fica selecionada
cd = cortes['criado']
for t0 in (cd + 0.2, w('criado'), w('justamente'), w('para')):
    add(fx, t0, tic(), 0.3)
add(fx, w('mostrar'), clique(0.7), 0.45)

# modelos: as 8 pastas entram, enchem (criei), o ✓ desce (melhorei); troca de card; os formatos; o Claude
md = cortes['modelos'] + 0.12
for i in range(8):
    add(fx, md + i * 0.08, tic(), 0.24)
for i in range(8):
    add(fx, w('criei') + i * 0.05, tic(), 0.14)
for i in range(8):
    add(fx, w('melhorei') + (i + 0.5) / 16, tic(), 0.2)
add(fx, w('melhorei') + 0.5, toque(), 0.26)
ed = w('editar') - 0.08
add(fx, ed, pop(640), 0.32)
for t0 in (w('qualquer'), w('tipo'), w('vídeo', 2)):
    add(fx, t0, pop(680), 0.3)
add(fx, w('claude', 2), pop(560), 0.4)

# instagram: o toque, a aba, o coração de toque duplo
add(fx, w('estiver'), clique(0.7), 0.45)
add(fx, w('instagram'), tic(), 0.3)
add(fx, w('agora'), pop(720), 0.42)

# nome: as miniaturas entram, a seleção no modelo da vez
for i in range(4):
    add(fx, w('vendo') - 0.1 + i * 0.07, tic(), 0.2)
add(fx, w('um'), clique(0.8), 0.5)

# prévias (só na versão com prévias): o contorno desenhado, as duas entram, o 3x
if PREVIAS:
    pv = cortes['previas']
    add(fx, pv, risco(0.3), 0.35)
    add(fx, w('colocar'), pop(660), 0.36)
    add(fx, w('colocar') + 0.22, pop(700), 0.36)
    for i in range(2):
        add(fx, w('aceleradas') + i * 0.08, tic(), 0.32)

# outros: o catálogo entra, o cursor clica no modelo; o prompt digita o comando, o arquivo entra, envia
for i in range(6):
    add(fx, w('ver') + i * 0.1, tic(), 0.22)
add(fx, w('esse', 2) - 0.04, clique(), 0.5)
add(fx, w('aprender') - 0.08, pop(620), 0.32)
como = w('como', 2)
for j in range(17):
    add(fx, como + 0.45 * j / 17 + rng.uniform(-0.006, 0.006), tecla(), rng.uniform(0.18, 0.28))
add(fx, w('isso'), pop(700), 0.32)
add(fx, w('vídeos') - 0.03, clique(), 0.5)
add(fx, w('vídeos') + 0.05, toque(), 0.28)

# comenta: toque no campo, EDIÇÃO digitado, Publicar, o comentário surge, o coração, a DM chega
cm = cortes['comenta']
add(fx, cm + 0.22, clique(0.7), 0.45)
ed2 = w('edição', 2)
for j in range(6):
    add(fx, ed2 + 0.42 * j / 6 + rng.uniform(-0.006, 0.006), tecla(), rng.uniform(0.24, 0.32))
pub = w('aqui', 2) + 0.06
add(fx, pub, clique(), 0.55)
add(fx, pub + 0.02, pop(640), 0.34)
add(fx, w('embaixo') + 0.15, pop(760), 0.3)
add(fx, w('que', 2), pop(600), 0.36)
add(fx, w('dm'), toque(), 0.28)

# um pouco de sala pra não soar seco demais
ir = rng.standard_normal(int(0.35 * SR)) * np.exp(-tt(0.35) * 14)
ir = lp(ir, 5000)
fx = fx + 0.12 * fftconvolve(fx, ir)[:N] / np.max(np.abs(ir))

x = fx / (np.max(np.abs(fx)) + 1e-9) * 10 ** (-6 / 20)
nome = 'sfx_previas.wav' if PREVIAS else 'sfx.wav'
saida = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'public' / nome
wavfile.write(saida, SR, (np.stack([x, x], 1) * 32767).astype(np.int16))
print(saida, round(D, 2), 's')
