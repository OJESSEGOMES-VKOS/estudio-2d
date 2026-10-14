"""Som do sofistmotion01 (vitrine): trilha sintetizada + efeitos nas trocas, tudo calculado dos tempos do vídeo.
Gera public/trilha.wav (pulso grave + pad quente + brilho, com ducking pela voz, ~16 dB abaixo dela) e
public/efeitos.wav (whoosh, estalo, impacto, tiques, brilho metálico). Cauda de ~2 s no fim (sofistmotion01.md).
Tudo vem do plano (src/tempos.json): a duração, as cenas (o efeito de cada tela vai com o id dela: C2 notebook, C3
atravessar, C5 celular, C6 corte vermelho, C7 portas), os flashes, as prévias, "virada", "acordes" (segundos ou id de
cena; sem a lista, um acorde por cena) e as marcas. O que o plano não tem não toca.
uso: ../../.venv/Scripts/python.exe scripts/som.py   (SAIDA=<pasta> grava fora de public/)
"""
import json, os, re, subprocess, sys, unicodedata
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

AQUI = Path(__file__).resolve().parent.parent
SAIDA = Path(os.environ.get('SAIDA', AQUI / 'public'))
T = json.loads((AQUI / 'src' / 'tempos.json').read_text(encoding='utf-8'))
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
SR = 48000
FPS = T['fps']
D = T['duracao_q'] / FPS
N = int(D * SR)
tt = np.arange(N) / SR
rng = np.random.default_rng(11)
q2s = lambda q: q / FPS
ini = lambda i: round(PS[i]['start'] * FPS) / FPS
limpa = lambda s: re.sub(r'[^a-z0-9]', '', ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn'))
if [w for w in map(limpa, T.get('fala', '').split()) if w] != [w for w in (limpa(p['text']) for p in PS) if w]:
    sys.exit('O plano (src/tempos.json) não é desta fala: rode scripts/conferir.py, que diz o que refazer.')
MARCAS = T.get('marcas') or {}
marca = lambda nome: ini(MARCAS[nome][0]) if nome in MARCAS else None  # sem a marca, o efeito dela não toca
CQ = {c['id']: c['de_q'] for c in T['cenas']}
cen = lambda i: q2s(CQ[i]) if i in CQ else None  # início da cena (s), ou None se o plano não a tem
LINHAS = [l for b in T['blocos'] for l in b['linhas']]
tipo = lambda t: next((l for l in LINHAS if l.get('tipo') == t), None)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
hp = lambda x, f: sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
bp = lambda x, a, b: sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)


def add(buf, t, s, g=1.0):
    i = int(t * SR)
    if i < 0:
        s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if i < N:
        buf[i:j] += g * s[:j - i]


def env_ad(n, a, d):
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na)
    e[na:] = np.exp(-np.arange(n - na) / (d * SR))
    return e


# ---------------- trilha ----------------
VIRADA = cen(T['virada']) if T.get('virada') in CQ else float('inf')   # clarão com portas (sem "virada": o pulso não sobe)
FECHO = q2s(T['cenas'][-1]['de_q'])                                     # a última cena
# acordes (Ré menor): Dm, Bb, F, C ... virada: Bb, F, Gm, A ... fecho: Dm(add9); o último é sempre o do fecho
NOTAS = [[38, 50, 57, 62, 65], [34, 46, 53, 58, 62], [41, 53, 57, 60, 65], [36, 48, 55, 60, 64], [38, 50, 57, 62, 65], [37, 49, 56, 61, 64],
         [34, 46, 53, 58, 62, 65], [41, 53, 57, 60, 65, 69], [31, 43, 50, 55, 58, 62], [33, 45, 52, 57, 61, 64]]
NOTAS_FECHO = [38, 50, 57, 62, 64, 65, 69]
inicios = [cen(x) if isinstance(x, str) else x for x in T.get('acordes') or [c['de_q'] / FPS for c in T['cenas']]]
ACORDES = [(t0, NOTAS_FECHO if k == len(inicios) - 1 else NOTAS[k % len(NOTAS)]) for k, t0 in enumerate(inicios)]
pad = np.zeros(N)
baixo = np.zeros(N)
for k, (t0, notas) in enumerate(ACORDES):
    t1 = ACORDES[k + 1][0] if k + 1 < len(ACORDES) else D + 3
    fim = D - 0.2 if k == len(ACORDES) - 1 else t1
    env = np.clip((tt - t0 + 0.05) / 0.25, 0, 1) * np.clip((fim + 0.25 - tt) / 0.5, 0, 1)
    if k == len(ACORDES) - 1:
        env *= np.where(tt > FECHO + 1.5, np.exp(-(tt - FECHO - 1.5) / 1.6), 1)
    for m in notas[1:]:
        f = hz(m)
        for det in (-0.18, 0.0, 0.18):
            ph = rng.random() * 6.28
            pad += env * (np.sin(2 * np.pi * (f + det) * tt + ph) + 0.3 * np.sin(4 * np.pi * (f + det) * tt + ph)) * 0.33
    fb = hz(notas[0])
    baixo += env * np.sin(2 * np.pi * fb * tt)
pad = lp(pad, 2200) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.25 * tt))

# pulso grave em colcheias (110 bpm), mais forte depois da virada, some no fecho
bpm = 110
passo = 60 / bpm / 2
pulso = np.zeros(N)
kick = np.sin(2 * np.pi * 52 * np.arange(int(0.25 * SR)) / SR * (1 - 0.35 * np.arange(int(0.25 * SR)) / (0.25 * SR))) * env_ad(int(0.25 * SR), 0.003, 0.09)
t = 0.0
k = 0
while t < FECHO:
    g = (0.55 if k % 2 == 0 else 0.25) * (1.0 if t >= VIRADA else 0.7)
    if not any(q2s(c['de_q']) - 0.25 < t < q2s(c['de_q']) for c in T['cenas'] if c.get('entrada') == 'preto-seco'):  # respira no preto seco
        add(pulso, t, kick, g)
    t += passo; k += 1
# brilho: arpejo agudo discreto
brilho = np.zeros(N)
nota = int(0.22 * SR)
pl = env_ad(nota, 0.004, 0.12)
t = 1.2; k = 0
while t < FECHO + 1.0:
    acc = [a for a in ACORDES if a[0] <= t][-1][1]
    m = acc[1 + (k * 2) % (len(acc) - 1)] + 24
    s = np.sin(2 * np.pi * hz(m) * np.arange(nota) / SR) * pl
    add(brilho, t, s, 0.18 if t >= VIRADA else 0.11)
    t += passo; k += 1
# subida antes da virada e antes do fecho
sub = np.zeros(N)
for alvo, dur in [x for x in ((VIRADA, 1.6), (FECHO, 1.0)) if x[0] != float('inf')]:
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    ruido = bp(rng.standard_normal(n), 800, 7000) * x ** 2
    add(sub, alvo - dur, ruido, 0.35)

trilha = 0.55 * pad / (np.max(np.abs(pad)) + 1e-9) + 0.45 * baixo / (np.max(np.abs(baixo)) + 1e-9) + pulso + brilho + sub
trilha *= np.minimum(1, tt / 0.4)
# ducking pela voz (envelope de 60 ms), até -5 dB
sr_v, voz = wavfile.read(AQUI / 'public' / 'voz.wav')
voz = voz.astype(np.float64)
voz = voz.mean(1) if voz.ndim == 2 else voz
voz = voz[:N] if len(voz) >= N else np.pad(voz, (0, N - len(voz)))
ev = np.sqrt(lp(voz ** 2, 8) .clip(0))
ev /= ev.max() + 1e-9
duck = 10 ** (-5 * np.clip(ev / 0.12, 0, 1) / 20)
trilha *= lp(duck, 6)


# ---------------- efeitos ----------------
fx = np.zeros(N)


def whoosh(dur, a=300, b=6000, sobe=True):
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    r = rng.standard_normal(n)
    out = np.zeros(n)
    for j in range(8):  # varredura do filtro em 8 faixas
        s0, s1 = j * n // 8, (j + 1) * n // 8
        fr = a * (b / a) ** ((j + 0.5) / 8 if sobe else 1 - (j + 0.5) / 8)
        out[s0:s1] = bp(r, fr * 0.6, min(fr * 1.6, 20000))[s0:s1]
    return out * np.sin(np.pi * x) ** 1.5


def estalo():
    n = int(0.5 * SR)
    return hp(rng.standard_normal(n), 2500) * env_ad(n, 0.001, 0.05)


def impacto(f0=48, dur=1.6):
    n = int(dur * SR)
    tb = np.arange(n) / SR
    return np.sin(2 * np.pi * f0 * tb * (1 - 0.25 * tb / dur)) * np.exp(-tb * 3.0) + lp(rng.standard_normal(n), 300) * env_ad(n, 0.002, 0.12) * 0.6


def tique(f=2600):
    n = int(0.05 * SR)
    tb = np.arange(n) / SR
    return np.sin(2 * np.pi * f * tb) * np.exp(-tb * 120)


def sino(f=1320, dur=1.2):
    n = int(dur * SR)
    tb = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * h * tb) * np.exp(-tb * (2.5 + h)) / h for h in (1, 2.01, 3.03, 4.2))


def metal(dur=1.4):
    n = int(dur * SR)
    tb = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * (2000 + 900 * k) * tb * (1 + 0.15 * tb)) / (k + 1) for k in range(6))
    return s * np.sin(np.pi * np.clip(tb / dur, 0, 1)) ** 2 * 0.5


# cada efeito preso a uma marca, a uma linha especial ou a uma cena do plano; o que o plano não tem, não toca (ordem fixa)
if tipo('gigante') and tipo('gigante').get('gigante'):
    add(fx, ini(tipo('gigante')['gigante'][0]) - 0.05, whoosh(0.5, 500, 4000), 0.5)   # palavra gigante entrando
if marca('contador') is not None:
    for k in range(9):                                                  # contador 0 -> 100
        add(fx, marca('contador') + (k / 9) ** 1.6 * 0.5, tique(2400 + k * 80), 0.25)
    add(fx, marca('contador') + 0.53, sino(1568), 0.22)
for fl in T['flashes']:                                                 # flashes
    t0 = q2s(fl['q'])
    add(fx, t0 - 0.35, whoosh(0.4, 400, 9000), 0.55)
    add(fx, t0, estalo(), 0.28)
    if fl['cor'] != 'branco':
        add(fx, t0, impacto(44 if fl['cor'] == 'sol' else 58, 1.8 if fl['cor'] == 'sol' else 1.0), 0.8 if fl['cor'] == 'sol' else 0.45)
if 'C3' in CQ:
    add(fx, cen('C3') - 0.3, whoosh(0.35, 6000, 300, sobe=False), 0.55) # atravessar
if 'C7' in CQ:
    add(fx, q2s(CQ['C7'] + 6), whoosh(0.5, 200, 3000), 0.45)           # portas abrindo
if 'C5' in CQ:
    add(fx, cen('C5'), whoosh(0.45, 300, 5000), 0.4)                    # celular girando
if 'C6' in CQ:
    add(fx, cen('C6'), impacto(40, 1.2), 0.65)                          # corte para o vermelho
if 'C2' in CQ:
    add(fx, cen('C2') + 0.02, whoosh(0.45, 300, 5000), 0.35)            # notebook girando
for t0 in ([cen('C3')] if 'C3' in CQ else []) + [marca(m) for m in ('cartao1', 'cartao2', 'cartao3', 'cartao4') if m in MARCAS]:
    add(fx, t0, tique(1800), 0.3)                                       # cartões chegando
if marca('melhorei') is not None:
    add(fx, marca('melhorei'), sino(1760, 0.9), 0.15)                   # "melhorei": o cartão acende
for t0 in [marca(m) for m in ('roleta1', 'roleta2', 'roleta3', 'roleta4') if m in MARCAS]:   # roleta: um gomo por palavra
    add(fx, t0, tique(3200), 0.4); add(fx, t0 + 0.03, tique(2100), 0.25)
if marca('coracao') is not None:
    add(fx, marca('coracao'), sino(2093, 0.5), 0.12)                    # coração
if T.get('previas'):
    de = q2s(T['previas']['de_q'])
    add(fx, de - 0.2, whoosh(0.45, 300, 6000), 0.45); add(fx, de - 0.1, whoosh(0.45, 300, 6000), 0.35)   # prévias voando
if marca('setas') is not None:
    add(fx, marca('setas'), whoosh(0.3, 1500, 5000), 0.2)               # setas
if marca('tres') is not None:
    for k in range(3):
        add(fx, marca('tres') + k * 0.1, tique(2000 + 400 * k), 0.4)    # selo 1x 2x 3x
    add(fx, marca('tres') + 0.22, sino(1760, 1.0), 0.18)
if marca('clique') is not None:
    add(fx, marca('clique'), tique(1500), 0.55); add(fx, marca('clique') + 0.02, whoosh(0.4, 400, 3000), 0.3)   # clique + pasta abrindo
for k, m in enumerate(('icone1', 'icone2', 'icone3', 'icone4')):
    if m in MARCAS:
        add(fx, marca(m), sino(1320 * 2 ** (k * 4 / 12), 0.6), 0.12)   # ícones saltando
if tipo('assinatura'):
    a = ini(tipo('assinatura')['ids'][0])
    add(fx, a - 0.05, metal(1.6), 0.25)                                 # "EDIÇÃO" em ouro, luz passando
    add(fx, a, impacto(55, 2.0), 0.35)
if marca('seta_baixo') is not None:
    add(fx, marca('seta_baixo'), whoosh(0.3, 3000, 600, sobe=False), 0.18)   # seta para baixo

trilha = lp(trilha, 12000)


def grava(nome, x, pico):
    x = x / (np.max(np.abs(x)) + 1e-9) * 10 ** (pico / 20)
    wavfile.write(SAIDA / nome, SR, (np.stack([x, x], 1) * 32767).astype(np.int16))


def lufs(nome):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str((AQUI / 'public' if nome == 'voz.wav' else SAIDA) / nome), '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', o)[-1])


VOZ = lufs('voz.wav')
grava('trilha.wav', trilha, -6)
g = (VOZ - 16) - lufs('trilha.wav')
grava('trilha.wav', trilha, -6 + g)
grava('efeitos.wav', fx, -9)
print(f"voz {VOZ:.1f} LUFS | trilha {lufs('trilha.wav'):.1f} LUFS | efeitos {lufs('efeitos.wav'):.1f} LUFS | {D:.2f} s")
