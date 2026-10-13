"""Conferência do texto e dos cortes (BRIEF + lições de 2026-10-12), lendo src/tempos.json e src/palavras.json.
uso: ../../.venv/Scripts/python.exe scripts/conferir.py   (sai 1 se algo falhar)
- antes de tudo: o plano é desta fala (campo "fala" igual a src/palavras.json, sem contar maiúscula, acento e
  pontuação), os ids existem e cada marca cai na palavra que diz;
- toda palavra da fala aparece uma vez só (legenda + comando fixo), nasce no start dela (±2 quadros) e fica >= 0,4 s;
- bloco >= 1,5 s, máx. 4 linhas, vive dentro da cena dele (nada atravessa corte); no máximo 2 posições de texto;
- cada corte no start de uma palavra (±2 quadros); a duração cobre a fala;
- zona segura 9:16: y 250-1500, x 60-940 (largura medida com a Comic Neue Bold, contorno incluído);
- texto na tela: nenhum travessão, nenhum nome de modelo (as etiquetas das prévias vêm da prop e ficam fora da conta).
Partes opcionais (fixo, previas, fade_q, marcas) só são conferidas se existirem no plano.
"""
import json, math, re, sys, unicodedata
from pathlib import Path
from PIL import ImageFont

AQUI = Path(__file__).resolve().parent.parent
BRUTO = (AQUI / 'src' / 'tempos.json').read_text(encoding='utf-8')
T = json.loads(BRUTO)
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
FPS = T['fps']
FONTE = AQUI / 'scripts' / 'ComicNeue-Bold.ttf'  # mesma fonte do @remotion/google-fonts (google/fonts, OFL)


def linha(chave):
    """linha do src/tempos.json onde a chave aparece, para a mensagem dizer onde mexer"""
    i = BRUTO.find(chave)
    return BRUTO[:i].count('\n') + 1 if i >= 0 else '?'


onde = lambda nome: linha(f'"{nome}"')  # a chave ou o id entre aspas


def limpa(s):
    s = unicodedata.normalize('NFD', s.lower())
    return re.sub(r'[^a-z0-9]', '', ''.join(c for c in s if unicodedata.category(c) != 'Mn'))


def pare(msg):
    print('O PLANO NÃO BATE COM A FALA\n  ' + msg.replace('\n', '\n  '))
    sys.exit(1)


# ---------------------------------------------------------------- 1. o plano é desta fala?
plano = [w for w in map(limpa, T.get('fala', '').split()) if w]
fala = [w for w in (limpa(p['text']) for p in PS) if w]
LF, LC, LB, LX = onde('fala'), onde('cenas'), onde('blocos'), onde('fixo')
if plano != fala:
    k = next((i for i, (a, b) in enumerate(zip(plano, fala)) if a != b), min(len(plano), len(fala)))
    pare(f"src/tempos.json foi feito para outra fala (campo \"fala\", linha {LF}): na palavra {k + 1} o plano tem "
         f"\"{plano[k] if k < len(plano) else '(fim)'}\" e src/palavras.json tem \"{fala[k] if k < len(fala) else '(fim)'}\".\n"
         f"Refaça o plano sobre a fala nova: \"cenas\" (linha {LC}), \"blocos\" (linha {LB}), "
         f"\"fixo\", \"marcas\", \"texto\" e \"duracao_q\" em src/tempos.json, as ilustrações em src/Cenas.tsx (LEIA, \"Vídeo novo\"),\n"
         f"e cole no campo \"fala\" o texto da fala nova: {' '.join(p['text'] for p in PS)}")
n = len(PS)
fora = []
for b in T['blocos']:
    fora += [f"bloco {b['id']} (linha {onde(b['id'])}): id {i}" for l in b['linhas'] for i in l if not 0 <= i < n]
for l in (T.get('fixo') or {}).get('linhas', []):
    fora += [f"fixo (linha {LX}): id {i}" for i in l['ids'] if not 0 <= i < n]
for nome, (i, palavra) in (T.get('marcas') or {}).items():
    if not 0 <= i < n:
        fora.append(f"marca \"{nome}\" (linha {onde(nome)}): id {i}")
    elif limpa(PS[i]['text']) != limpa(palavra):
        fora.append(f"marca \"{nome}\" (linha {onde(nome)}): a palavra {i} é \"{PS[i]['text']}\", não \"{palavra}\"")
if fora:
    pare(f"a fala tem {n} palavras (ids 0 a {n - 1}) e o plano aponta para o que não existe:\n" + '\n'.join(fora))

# ---------------------------------------------------------------- 2. tempo, posição e zona segura
q = lambda s: math.floor(s * FPS + 0.5)
txt = lambda i: T['texto'].get(str(i), PS[i]['text'].upper())
cenas = {c['id']: c for c in T['cenas']}
erros, vezes, fontes = [], [0] * n, {}


def largura(s, fs):
    if fs not in fontes: fontes[fs] = ImageFont.truetype(str(FONTE), fs)
    pal = s.split(' ')
    w = sum(fontes[fs].getlength(p) + len(p) * 1 for p in pal) + (len(pal) - 1) * fs * 0.28
    return w + fs * 0.16  # contorno (metade de cada lado)


def confere(nome, ids, fs, y, de, ate):
    s = ' '.join(txt(i) for i in ids)
    w = largura(s, fs); x0, x1 = 540 - w / 2, 540 + w / 2
    y0, y1 = y - fs * 0.62, y + fs * 0.62
    if x0 < 60 or x1 > 940: erros.append(f"{nome}: '{s}' x {x0:.0f}-{x1:.0f} fora da zona (quebre a linha ou diminua o fs)")
    if y0 < 250 or y1 > 1500: erros.append(f"{nome}: '{s}' y {y0:.0f}-{y1:.0f} fora da zona")
    if '—' in s: erros.append(f"{nome}: travessão em '{s}'")
    for i in ids:
        vezes[i] += 1
        nq = max(de, q(PS[i]['start']))
        d = nq - PS[i]['start'] * FPS
        if abs(d) > 2: erros.append(f"{nome}: '{txt(i)}' nasce {nq / FPS:.2f} s, dita {PS[i]['start']:.2f} ({d:+.1f} q): a cena começa tarde demais")
        if (ate - nq) / FPS < 0.4 - 1e-6: erros.append(f"{nome}: '{txt(i)}' fica {(ate - nq) / FPS:.2f} s (< 0,4): estique a cena ou passe a palavra para o bloco seguinte")


for b in T['blocos']:
    if b['cena'] not in cenas:
        erros.append(f"{b['id']}: a cena {b['cena']} não existe em \"cenas\""); continue
    c = cenas[b['cena']]
    de, ate = c['de_q'], c['ate_q']
    pri = max(de, q(PS[b['linhas'][0][0]]['start']))
    if (ate - pri) / FPS < 1.5: erros.append(f"{b['id']}: bloco {(ate - pri) / FPS:.2f} s (< 1,5): junte com o bloco vizinho")
    if len(b['linhas']) > 4: erros.append(f"{b['id']}: {len(b['linhas'])} linhas (máx. 4)")
    L = T['legenda']
    for k, ids in enumerate(b['linhas']):
        confere(b['id'], ids, L['fs'], L['y0'] + k * L['passo'], de, ate)
fx = T.get('fixo')
if fx:
    c = cenas[fx['cena']]
    for l in fx['linhas']:
        confere('fixo', l['ids'], l['fs'], l['y'], c['de_q'], c['ate_q'])
for i, v in enumerate(vezes):
    if v != 1: erros.append(f"palavra {i} '{PS[i]['text']}' aparece {v}x")
# cortes na palavra
starts = [p['start'] * FPS for p in PS]
for c in T['cenas'][1:]:
    d = min(abs(c['de_q'] - s) for s in starts)
    if d > 2: erros.append(f"corte {c['id']} em {c['de_q'] / FPS:.2f} s fora de palavra ({d:.1f} q)")
# cenas contíguas, do 0 ao fim
if T['cenas'][0]['de_q'] != 0: erros.append(f"a 1ª cena começa em {T['cenas'][0]['de_q']}, não em 0")
for a, b in zip(T['cenas'], T['cenas'][1:]):
    if a['ate_q'] != b['de_q']: erros.append(f"buraco entre {a['id']} e {b['id']}")
if T['cenas'][-1]['ate_q'] != T['duracao_q']: erros.append(f"a última cena acaba em {T['cenas'][-1]['ate_q']}, a duração é {T['duracao_q']}")
if T['duracao_q'] / FPS < PS[-1]['end']: erros.append(f"duracao_q {T['duracao_q']} ({T['duracao_q'] / FPS:.2f} s) corta a fala, que acaba em {PS[-1]['end']:.2f} s")
todo = ' '.join(txt(i) for i in range(n)).lower()
for nome in ('youtubedark', 'superpodcast', 'youtubeedition', 'modelo0'):
    if nome in todo: erros.append(f"nome de modelo no texto: {nome}")
p = T.get('previas')
pv = f"prévias {p['de_q'] / FPS:.2f}-{p['ate_q'] / FPS:.2f} s" if p else 'sem prévias'
print(f"{len(erros)} erros | cenas {len(T['cenas'])} | {pv} | duração {T['duracao_q'] / FPS:.2f} s")
for e in erros: print('  ' + e)
sys.exit(1 if erros else 0)
