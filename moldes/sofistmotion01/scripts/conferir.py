"""Conferência do texto (BRIEF, lições de 2026-10-12 + MODELO §16), lendo src/tempos.json e src/palavras.json.
uso: ../../.venv/Scripts/python.exe scripts/conferir.py   (sai 1 se algo falhar)
- toda palavra da fala aparece uma vez só, nasce no start dela (±2 quadros) e fica >= 0,4 s depois de nascer;
- bloco >= 1,5 s, máx. 4 linhas, termina dentro da cena dele (nada atravessa troca);
- zona segura 9:16: y 250-1500, x 60-940 (largura medida com a Inter Bold de scripts/Inter-Bold.ttf, OFL);
- nenhum trecho > 2,5 s sem palavra nova ou troca de cena (fora o fecho);
- texto na tela: nenhum travessão, nenhum nome de modelo.
"""
import json, sys
from pathlib import Path
from PIL import ImageFont

AQUI = Path(__file__).resolve().parent.parent
T = json.loads((AQUI / 'src' / 'tempos.json').read_text(encoding='utf-8'))
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
FPS = T['fps']
FONTE = str(AQUI / 'scripts' / 'Inter-Bold.ttf')
cenas = {c['id']: c for c in T['cenas']}
erros, nasc = [], []
vezes = [0] * len(PS)
q = lambda s: round(s * FPS)
txt = lambda i: T['texto'].get(str(i), PS[i]['text'])
fontes = {}
def largura(s, fs):
    if fs not in fontes: fontes[fs] = ImageFont.truetype(FONTE, fs)
    return fontes[fs].getlength(s) * (1 - 0.02)  # letter-spacing -0.02em do Reel

for b in T['blocos']:
    c = cenas[b['cena']]
    de = b.get('de_q', c['de_q']); ate = b.get('ate_q', c['ate_q'])
    ids = [i for l in b['linhas'] for i in l['ids']]
    pri = max(de, q(PS[ids[0]]['start']))
    if (ate - pri) / FPS < 1.5 and b['cena'] != 'C10': erros.append(f"{b['id']}: bloco {(ate - pri) / FPS:.2f} s (< 1,5)")
    if len(b['linhas']) > 4: erros.append(f"{b['id']}: {len(b['linhas'])} linhas")
    if ate > c['ate_q'] or de < c['de_q']: erros.append(f"{b['id']}: atravessa a troca da cena {c['id']}")
    for l in b['linhas']:
        s = ' '.join(txt(i) for i in l['ids']); fs = l['fs']
        w = largura(s, fs); x0 = 540 - w / 2; x1 = 540 + w / 2
        y0 = l['y'] - fs * 0.62; y1 = l['y'] + fs * 0.62
        if x0 < 60 or x1 > 940: erros.append(f"{b['id']}: '{s}' x {x0:.0f}-{x1:.0f} fora da zona")
        if y0 < 250 or y1 > 1500: erros.append(f"{b['id']}: '{s}' y {y0:.0f}-{y1:.0f} fora da zona")
        if '—' in s: erros.append(f"{b['id']}: travessão em '{s}'")
        for i in l['ids']:
            vezes[i] += 1
            n = max(de, q(PS[i]['start']))
            d = n - PS[i]['start'] * FPS
            if abs(d) > 2: erros.append(f"{b['id']}: '{txt(i)}' nasce {n / FPS:.2f} s, dita {PS[i]['start']:.2f} ({d:+.1f} q)")
            if (ate - n) / FPS < 0.4 - 1e-6: erros.append(f"{b['id']}: '{txt(i)}' fica {(ate - n) / FPS:.2f} s (< 0,4)")
            nasc.append(n)
for i, v in enumerate(vezes):
    if v != 1: erros.append(f"palavra {i} '{PS[i]['text']}' aparece {v}x")
# eventos: palavra nova ou troca de cena; fecho (C10) fora
ev = sorted(set(nasc + [c['de_q'] for c in T['cenas']]))
for a, b2 in zip(ev, ev[1:]):
    if b2 <= cenas['C10']['de_q'] and (b2 - a) / FPS > 2.5: erros.append(f"{a / FPS:.2f}-{b2 / FPS:.2f} s sem evento novo")
todo = ' '.join(txt(i) for i in range(len(PS))).lower()
for nome in ('sofistmotion', 'modelodinamico', 'superpodcast'):
    if nome in todo: erros.append(f"nome de modelo no texto: {nome}")
print(f"{len(erros)} erros")
for e in erros: print('  ' + e)
sys.exit(1 if erros else 0)
