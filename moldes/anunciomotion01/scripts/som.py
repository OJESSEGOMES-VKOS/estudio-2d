"""Som do anunciomotion01 (vitrine; adaptado do sofistmotion01): trilha sintetizada + efeitos nas trocas, tudo calculado dos tempos do vídeo.
Gera public/trilha.wav (pulso grave + pad quente + brilho, com ducking pela voz, ~16 dB abaixo dela) e
public/efeitos.wav (whoosh, estalo, impacto, tiques, brilho metálico). Cauda de ~2 s no fim (modelos/anunciomotion01/anunciomotion01.md §9).
Tudo vem do plano (src/tempos.json): a duração, as entradas das cenas, as prévias, "virada", "acordes" (segundos ou id
de cena; sem a lista, um acorde por cena) e as marcas (nome livre ganha o tique padrão). Efeito de nome fixo que o plano não tem não toca.
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
tem = lambda *nomes: [marca(m) for m in nomes if m in MARCAS]
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
VIRADA = CEN[T['virada']] if T.get('virada') in CEN else float('inf')  # sem "virada": o pulso não sobe
FECHO = q2s(T['cenas'][-1]['de_q'])                                   # a última cena
# eletrônica baixa (anunciomotion01.md §6): pad em Lá menor, baixo, bumbo em semínimas 120 bpm e hi-hat nas colcheias; o último acorde é o do fecho
NOTAS = [[45, 57, 60, 64], [41, 53, 57, 60], [48, 55, 60, 64], [43, 55, 59, 62], [41, 53, 57, 60, 64], [45, 57, 60, 64, 67], [43, 55, 59, 62]]
NOTAS_FECHO = [45, 57, 60, 64, 71]
inicios = [CEN[x] if isinstance(x, str) else x for x in T.get('acordes') or [c['de_q'] / FPS for c in T['cenas']]]
ACORDES = [(t0, NOTAS_FECHO if k == len(inicios) - 1 else NOTAS[k % len(NOTAS)]) for k, t0 in enumerate(inicios)]
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
for alvo, dur in [x for x in ((VIRADA, 1.2), (FECHO, 0.9)) if x[0] != float('inf')]:
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
# cada efeito preso a uma marca do plano (src/tempos.json → "marcas"); nome fixo toca o efeito dele, nome livre toca o tique padrão (fim da lista)
for t0 in tem('inicio'): add(fx, t0 - 0.05, whoosh(0.4, 500, 4000), 0.4)
for t0 in tem('cem'):
    for k in range(9): add(fx, t0 + (k / 9) ** 1.6 * 0.45, tique(2400 + k * 80), 0.25)  # contador
    add(fx, t0 + 0.45, sino(1568), 0.2)
for t0 in tem('clipe1', 'clipe2', 'clipe3', 'clipe4', 'clipe5'): add(fx, t0, tique(1800), 0.3)   # clipes caindo
for t0 in tem('placa1', 'placa2', 'placa3'): add(fx, t0, whoosh(0.25, 600, 5000), 0.25)          # placas
for t0 in tem('melhorei'): add(fx, t0, sino(1760, 0.9), 0.18)                                     # melhorei
for t0 in tem('orbita1', 'orbita2', 'orbita3', 'orbita4'): add(fx, t0, tique(3000), 0.35)        # ícones orbitando
for t0 in tem('coracao'): add(fx, t0, sino(2093, 0.6), 0.18)                                      # coração
for t0 in tem('apenas'): add(fx, t0, whoosh(0.3, 5000, 400, sobe=False), 0.25)
for t0 in tem('um'): add(fx, t0, sino(1320, 0.7), 0.2)
if T.get('previas'):
    de = q2s(T['previas']['de_q'])
    add(fx, de - 0.15, whoosh(0.4, 300, 6000), 0.45)
for t0 in tem('setas'): add(fx, t0, whoosh(0.3, 1500, 5000), 0.2)
for t0 in tem('aceleradas'): add(fx, t0, whoosh(0.6, 300, 9000), 0.35)                            # aceleradas
for t0 in tem('outros', 'pilula1', 'pilula2', 'pilula3'): add(fx, t0, tique(2600), 0.3)           # pílulas escrevendo
for t0 in tem('usar'): add(fx, t0, tique(1500), 0.55); add(fx, t0 + 0.03, sino(1760, 0.6), 0.15)  # interruptor
for t0 in tem('edicao'): add(fx, t0 - 0.05, metal(1.4), 0.22); add(fx, t0, impacto(55, 1.6), 0.35)   # EDIÇÃO
for t0 in tem('embaixo'): add(fx, t0, whoosh(0.3, 3000, 600, sobe=False), 0.18)
# marca de nome livre (qualquer nome fora da lista acima): ganha um tique leve no tempo dela. As de nome fixo seguem com o efeito próprio.
PROPRIAS = {'inicio', 'cem', 'clipe1', 'clipe2', 'clipe3', 'clipe4', 'clipe5', 'placa1', 'placa2', 'placa3', 'melhorei', 'orbita1', 'orbita2', 'orbita3', 'orbita4',
            'coracao', 'apenas', 'um', 'setas', 'aceleradas', 'outros', 'pilula1', 'pilula2', 'pilula3', 'usar', 'edicao', 'embaixo',
            'videos'}  # 'videos' só move a tela (S10), fica sem som
for nome in MARCAS:
    if nome not in PROPRIAS: add(fx, marca(nome), tique(2200), 0.22)

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
