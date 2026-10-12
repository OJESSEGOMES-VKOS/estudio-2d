"""Som do anunciomotion01 (vitrine; adaptado do sofistmotion01): trilha sintetizada + efeitos nas trocas, tudo calculado dos tempos do vídeo.
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
VIRADA = CEN['S7']
FECHO = CEN['S10']
# eletrônica baixa (MODELO §6): pad em Lá menor, baixo, bumbo em semínimas 120 bpm e hi-hat nas colcheias
ACORDES = [(0.0, [45, 57, 60, 64]), (CEN['S3'], [41, 53, 57, 60]), (CEN['S5'], [48, 55, 60, 64]), (CEN['S6'], [43, 55, 59, 62]),
           (VIRADA, [41, 53, 57, 60, 64]), (CEN['S8'], [45, 57, 60, 64, 67]), (CEN['S9'], [43, 55, 59, 62]), (FECHO, [45, 57, 60, 64, 71])]
pad = np.zeros(N); baixo = np.zeros(N)
for k, (t0, notas) in enumerate(ACORDES):
    t1 = ACORDES[k + 1][0] if k + 1 < len(ACORDES) else D + 2
    env = np.clip((tt - t0 + 0.03) / 0.1, 0, 1) * np.clip((t1 + 0.1 - tt) / 0.15, 0, 1)
    if k == len(ACORDES) - 1: env *= np.where(tt > D - 1.2, np.exp(-(tt - D + 1.2) / 0.5), 1)
    for m in notas[1:]:
        for det in (-0.2, 0.2):
            ph = 2 * np.pi * (hz(m) + det) * tt
            pad += env * (2 * ((ph / (2 * np.pi)) % 1) - 1) * 0.2
    baixo += env * np.sin(2 * np.pi * hz(notas[0] - 12) * tt)
pad = lp(pad, 1600)
passo = 60 / 120
pulso = np.zeros(N); nk = int(0.25 * SR); xk = np.arange(nk) / SR
kick = np.sin(2 * np.pi * 50 * xk * (1 + 1.5 * np.exp(-xk * 30))) * env_ad(nk, 0.002, 0.08)
hat = hp(rng.standard_normal(int(0.05 * SR)), 7000) * env_ad(int(0.05 * SR), 0.001, 0.015)
t = 0.0; k = 0
while t < D - 1.0:
    if k % 2 == 0: add(pulso, t, kick, 0.6 if t >= VIRADA else 0.4)
    else: add(pulso, t, hat, 0.12)
    t += passo / 2; k += 1
sub = np.zeros(N)
for alvo, dur in ((VIRADA, 1.2), (FECHO, 0.9)):
    n = int(dur * SR); x = np.linspace(0, 1, n)
    add(sub, alvo - dur, bp(rng.standard_normal(n), 800, 7000) * x ** 2, 0.35)
trilha = 0.5 * pad / (np.max(np.abs(pad)) + 1e-9) + 0.5 * baixo / (np.max(np.abs(baixo)) + 1e-9) + pulso + sub
trilha *= np.minimum(1, tt / 0.3)
sr_v, voz = wavfile.read(AQUI / 'public' / 'voz.wav')
voz = voz.astype(np.float64); voz = voz.mean(1) if voz.ndim == 2 else voz
voz = voz[:N] if len(voz) >= N else np.pad(voz, (0, N - len(voz)))
ev = np.sqrt(lp(voz ** 2, 8).clip(0)); ev /= ev.max() + 1e-9
trilha *= lp(10 ** (-5 * np.clip(ev / 0.12, 0, 1) / 20), 6)


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


# entradas de cena: corte = estalo + whoosh curto; borrão = whoosh; íris = whoosh + impacto
for c in T['cenas'][1:]:
    t0 = q2s(c['de_q'])
    add(fx, t0 - 0.2, whoosh(0.3, 400, 8000), 0.45)
    if c['entrada'] == 'corte': add(fx, t0, estalo(), 0.3)
    if c['entrada'] == 'iris': add(fx, t0, impacto(50, 1.2), 0.5)
add(fx, ini(0) - 0.05, whoosh(0.4, 500, 4000), 0.4)
for k in range(9): add(fx, ini(4) + (k / 9) ** 1.6 * 0.45, tique(2400 + k * 80), 0.25)   # contador
add(fx, ini(4) + 0.45, sino(1568), 0.2)
for i in (8, 9, 10, 11, 12): add(fx, ini(i), tique(1800), 0.3)                          # clipes caindo
for i in (16, 18, 19): add(fx, ini(i), whoosh(0.25, 600, 5000), 0.25)                     # placas
add(fx, ini(24), sino(1760, 0.9), 0.18)                                                   # melhorei
for i in (27, 28, 30, 31): add(fx, ini(i), tique(3000), 0.35)                            # ícones orbitando
add(fx, ini(39), sino(2093, 0.6), 0.18)                                                   # coração
add(fx, ini(44), whoosh(0.3, 5000, 400, sobe=False), 0.25); add(fx, ini(45), sino(1320, 0.7), 0.2)
de = q2s(T['previas']['de_q'])
add(fx, de - 0.15, whoosh(0.4, 300, 6000), 0.45)
add(fx, ini(55), whoosh(0.3, 1500, 5000), 0.2)
add(fx, ini(58), whoosh(0.6, 300, 9000), 0.35)                                            # aceleradas
for i in (68, 69, 70, 71): add(fx, ini(i), tique(2600), 0.3)                             # pílulas escrevendo
add(fx, ini(78), tique(1500), 0.55); add(fx, ini(78) + 0.03, sino(1760, 0.6), 0.15)        # interruptor
add(fx, ini(84) - 0.05, metal(1.4), 0.22); add(fx, ini(84), impacto(55, 1.6), 0.35)       # EDIÇÃO
add(fx, ini(86), whoosh(0.3, 3000, 600, sobe=False), 0.18)

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
