"""Mede o som de uma referência: chão de ruído (tem trilha por baixo?) e efeito sonoro nos cortes.
uso: python som.py <video.mp4> <prefixo>   (lê <prefixo>_cortes.txt; grava <prefixo>_som.txt)
- chão: percentil 10 do volume em janelas de 50 ms. Voz seca sem trilha fica abaixo de -55 dB nas pausas;
  trilha constante segura o chão perto de -35 a -45 dB.
- por minuto: o mesmo chão, minuto a minuto (a trilha entra e sai?).
- cortes: energia de agudos (>3 kHz) nos 300 ms em volta de cada corte comparada com a mediana do vídeo.
  Corte com agudo > 2x a mediana = provável whoosh/swoosh/pop no corte.
"""
import subprocess, sys
import numpy as np

video, pref = sys.argv[1], sys.argv[2]
sr = 16000
raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', video, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'],
                     capture_output=True).stdout
a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
j = int(0.05 * sr)
n = len(a) // j
fr = a[:n * j].reshape(n, j)
db = 20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-9)
# agudos: diferença de primeira ordem realça alta frequência
hp = np.diff(a, prepend=0)
hfr = hp[:n * j].reshape(n, j)
hdb = np.sqrt((hfr ** 2).mean(1))
med_h = np.median(hdb)

cortes = []
for l in open(f'{pref}_cortes.txt', encoding='utf-8').readlines()[2:]:
    p = l.split()
    t = int(p[1][:2]) * 60 + float(p[1][3:])
    if t > 0.5:
        cortes.append(t)
picos = []
for t in cortes:
    i = int(t / 0.05)
    w = hdb[max(0, i - 3):i + 3]
    picos.append(w.max() / med_h if len(w) else 0)
picos = np.array(picos)

with open(f'{pref}_som.txt', 'w', encoding='utf-8') as f:
    f.write(f'chao p10 {np.percentile(db, 10):.1f} dB | p25 {np.percentile(db, 25):.1f} | mediana {np.median(db):.1f} | p95 {np.percentile(db, 95):.1f}\n')
    f.write('chao p10 por minuto: ' + ' '.join(f'{np.percentile(db[m * 1200:(m + 1) * 1200], 10):.0f}' for m in range(n // 1200 + 1) if len(db[m * 1200:(m + 1) * 1200])) + '\n')
    if len(picos):
        f.write(f'cortes {len(picos)} | com agudo >2x a mediana {int((picos > 2).sum())} ({100 * (picos > 2).mean():.0f}%) | >3x {int((picos > 3).sum())}\n')
        # base de comparação: mesmos números em instantes aleatórios
        rng = np.random.default_rng(1)
        al = []
        for t in rng.uniform(1, n * 0.05 - 1, 400):
            i = int(t / 0.05)
            al.append(hdb[max(0, i - 3):i + 3].max() / med_h)
        al = np.array(al)
        f.write(f'instantes aleatorios 400 | >2x {100 * (al > 2).mean():.0f}% | >3x {100 * (al > 3).mean():.0f}%\n')
print(open(f'{pref}_som.txt', encoding='utf-8').read())
