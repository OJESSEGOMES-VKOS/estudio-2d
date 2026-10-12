"""Som do sofistmotion01 (vitrine): trilha sintetizada + efeitos nas trocas, tudo calculado dos tempos do vídeo.
Gera public/trilha.wav (pulso grave + pad quente + brilho, com ducking pela voz, ~16 dB abaixo dela) e
public/efeitos.wav (whoosh, estalo, impacto, tiques, brilho metálico). Cauda de ~2 s no fim (MODELO §9).
uso: ../../.venv/Scripts/python.exe scripts/som.py   (SAIDA=<pasta> grava fora de public/)
"""
import json, os, re, subprocess
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
CEN = {c['id']: q2s(c['de_q']) for c in T['cenas']}
VIRADA = CEN['C7']   # clarão com portas
FECHO = CEN['C10']
# acordes (Ré menor): Dm, Bb, F, C ... virada: Bb, F, Gm, A ... fecho: Dm(add9)
ACORDES = [
    (0.0, [38, 50, 57, 62, 65]), (3.07, [34, 46, 53, 58, 62]), (6.0, [41, 53, 57, 60, 65]), (8.1, [36, 48, 55, 60, 64]),
    (10.7, [38, 50, 57, 62, 65]), (12.57, [37, 49, 56, 61, 64]),
    (VIRADA, [34, 46, 53, 58, 62, 65]), (17.14, [41, 53, 57, 60, 65, 69]), (20.0, [31, 43, 50, 55, 58, 62]), (24.0, [33, 45, 52, 57, 61, 64]),
    (FECHO, [38, 50, 57, 62, 64, 65, 69]),
]
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
    if not (CEN['C5'] - 0.25 < t < CEN['C5']):  # respira no preto seco
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
for alvo, dur in ((VIRADA, 1.6), (FECHO, 1.0)):
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


add(fx, ini(0) - 0.05, whoosh(0.5, 500, 4000), 0.5)                     # palavra gigante entrando
for k in range(9):                                                      # contador 0 -> 100
    add(fx, ini(4) + (k / 9) ** 1.6 * 0.5, tique(2400 + k * 80), 0.25)
add(fx, ini(4) + 0.53, sino(1568), 0.22)
for fl in T['flashes']:                                                 # flashes
    t0 = q2s(fl['q'])
    add(fx, t0 - 0.35, whoosh(0.4, 400, 9000), 0.55)
    add(fx, t0, estalo(), 0.28)
    if fl['cor'] != 'branco':
        add(fx, t0, impacto(44 if fl['cor'] == 'sol' else 58, 1.8 if fl['cor'] == 'sol' else 1.0), 0.8 if fl['cor'] == 'sol' else 0.45)
add(fx, CEN['C3'] - 0.3, whoosh(0.35, 6000, 300, sobe=False), 0.55)     # atravessar
add(fx, q2s(441), whoosh(0.5, 200, 3000), 0.45)                         # portas abrindo
add(fx, CEN['C5'], whoosh(0.45, 300, 5000), 0.4)                        # celular girando
add(fx, CEN['C6'], impacto(40, 1.2), 0.65)                              # corte para o vermelho
add(fx, CEN['C2'] + 0.02, whoosh(0.45, 300, 5000), 0.35)                # notebook girando
for n in (137, round(PS[16]['start'] * FPS), round(PS[18]['start'] * FPS), round(PS[19]['start'] * FPS), round(PS[22]['start'] * FPS)):
    add(fx, q2s(n), tique(1800), 0.3)                                   # cartões chegando
add(fx, ini(24), sino(1760, 0.9), 0.15)                                 # "melhorei": o cartão acende
for i in (27, 28, 29, 30):                                              # roleta: um gomo por palavra
    add(fx, ini(i), tique(3200), 0.4); add(fx, ini(i) + 0.03, tique(2100), 0.25)
add(fx, ini(39), sino(2093, 0.5), 0.12)                                 # coração
de = q2s(T['previas']['de_q'])
add(fx, de - 0.2, whoosh(0.45, 300, 6000), 0.45); add(fx, de - 0.1, whoosh(0.45, 300, 6000), 0.35)   # prévias voando
add(fx, ini(55), whoosh(0.3, 1500, 5000), 0.2)                          # setas
for k in range(3):
    add(fx, ini(60) + k * 0.1, tique(2000 + 400 * k), 0.4)              # selo 1x 2x 3x
add(fx, ini(60) + 0.22, sino(1760, 1.0), 0.18)
add(fx, ini(75), tique(1500), 0.55); add(fx, ini(75) + 0.02, whoosh(0.4, 400, 3000), 0.3)          # clique + pasta abrindo
for i in (76, 77, 78, 79):
    add(fx, ini(i), sino(1320 * 2 ** ((i - 76) * 4 / 12), 0.6), 0.12)   # ícones saltando
add(fx, ini(84) - 0.05, metal(1.6), 0.25)                               # "EDIÇÃO" em ouro, luz passando
add(fx, ini(84), impacto(55, 2.0), 0.35)
add(fx, ini(85), whoosh(0.3, 3000, 600, sobe=False), 0.18)              # seta para baixo

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
