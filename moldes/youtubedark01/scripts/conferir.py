"""Conferência do texto e dos cortes (BRIEF + lições de 2026-10-12), lendo src/tempos.json e src/palavras.json.
uso: ../../.venv/Scripts/python.exe scripts/conferir.py   (sai 1 se algo falhar)
- toda palavra da fala aparece uma vez só (legenda + comando fixo), nasce no start dela (±2 quadros) e fica >= 0,4 s;
- bloco >= 1,5 s, máx. 4 linhas, vive dentro da cena dele (nada atravessa corte); no máximo 2 posições de texto;
- cada corte cai no start de uma palavra (±2 quadros);
- zona segura 9:16: y 250-1500, x 60-940 (largura medida com a Comic Neue Bold, contorno incluído);
- texto na tela: nenhum travessão, nenhum nome de modelo (as etiquetas das prévias vêm da prop e ficam fora da conta).
"""
import json, math, sys
from pathlib import Path
from PIL import ImageFont

AQUI = Path(__file__).resolve().parent.parent
T = json.loads((AQUI / 'src' / 'tempos.json').read_text(encoding='utf-8'))
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
FPS = T['fps']
FONTE = AQUI / 'scripts' / 'ComicNeue-Bold.ttf'  # mesma fonte do @remotion/google-fonts (google/fonts, OFL)
q = lambda s: math.floor(s * FPS + 0.5)
txt = lambda i: T['texto'].get(str(i), PS[i]['text'].upper())
cenas = {c['id']: c for c in T['cenas']}
erros, vezes, fontes = [], [0] * len(PS), {}


def largura(s, fs):
    if fs not in fontes: fontes[fs] = ImageFont.truetype(str(FONTE), fs)
    pal = s.split(' ')
    w = sum(fontes[fs].getlength(p) + len(p) * 1 for p in pal) + (len(pal) - 1) * fs * 0.28
    return w + fs * 0.16  # contorno (metade de cada lado)


def linha(nome, ids, fs, y, de, ate):
    s = ' '.join(txt(i) for i in ids)
    w = largura(s, fs); x0, x1 = 540 - w / 2, 540 + w / 2
    y0, y1 = y - fs * 0.62, y + fs * 0.62
    if x0 < 60 or x1 > 940: erros.append(f"{nome}: '{s}' x {x0:.0f}-{x1:.0f} fora da zona")
    if y0 < 250 or y1 > 1500: erros.append(f"{nome}: '{s}' y {y0:.0f}-{y1:.0f} fora da zona")
    if '—' in s: erros.append(f"{nome}: travessão em '{s}'")
    for i in ids:
        vezes[i] += 1
        n = max(de, q(PS[i]['start']))
        d = n - PS[i]['start'] * FPS
        if abs(d) > 2: erros.append(f"{nome}: '{txt(i)}' nasce {n / FPS:.2f} s, dita {PS[i]['start']:.2f} ({d:+.1f} q)")
        if (ate - n) / FPS < 0.4 - 1e-6: erros.append(f"{nome}: '{txt(i)}' fica {(ate - n) / FPS:.2f} s (< 0,4)")
    return w


L = T['legenda']
for b in T['blocos']:
    c = cenas[b['cena']]
    de, ate = c['de_q'], c['ate_q']
    pri = max(de, q(PS[b['linhas'][0][0]]['start']))
    if (ate - pri) / FPS < 1.5: erros.append(f"{b['id']}: bloco {(ate - pri) / FPS:.2f} s (< 1,5)")
    if len(b['linhas']) > 4: erros.append(f"{b['id']}: {len(b['linhas'])} linhas")
    for k, ids in enumerate(b['linhas']):
        linha(b['id'], ids, L['fs'], L['y0'] + k * L['passo'], de, ate)
fx = T['fixo']; c = cenas[fx['cena']]
for l in fx['linhas']:
    linha('fixo', l['ids'], l['fs'], l['y'], c['de_q'], c['ate_q'])
for i, v in enumerate(vezes):
    if v != 1: erros.append(f"palavra {i} '{PS[i]['text']}' aparece {v}x")
# cortes na palavra
starts = [PS[i]['start'] * FPS for i in range(len(PS))]
for c in T['cenas'][1:]:
    d = min(abs(c['de_q'] - s) for s in starts)
    if d > 2: erros.append(f"corte {c['id']} em {c['de_q'] / FPS:.2f} s fora de palavra ({d:.1f} q)")
# cenas contíguas
for a, b in zip(T['cenas'], T['cenas'][1:]):
    if a['ate_q'] != b['de_q']: erros.append(f"buraco entre {a['id']} e {b['id']}")
todo = ' '.join(txt(i) for i in range(len(PS))).lower()
for nome in ('youtubedark', 'superpodcast', 'youtubeedition', 'modelo0'):
    if nome in todo: erros.append(f"nome de modelo no texto: {nome}")
p = T['previas']
print(f"{len(erros)} erros | cenas {len(T['cenas'])} | prévias {p['de_q'] / FPS:.2f}-{p['ate_q'] / FPS:.2f} s | duração {T['duracao_q'] / FPS:.2f} s")
for e in erros: print('  ' + e)
sys.exit(1 if erros else 0)
