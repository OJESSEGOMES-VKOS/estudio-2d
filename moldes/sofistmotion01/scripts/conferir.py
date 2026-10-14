"""Conferência do texto (BRIEF, lições de 2026-10-12 + sofistmotion01.md), lendo src/tempos.json e src/palavras.json.
uso: ../../.venv/Scripts/python.exe scripts/conferir.py   (sai 1 se algo falhar; não grava nada)
- antes de tudo: o plano é desta fala ("fala" igual a src/palavras.json, sem contar maiúscula, acento e pontuação), os
  ids existem, cada marca cai na palavra que diz e a duração cobre a fala; se não, para dizendo o que refazer e a linha;
- toda palavra da fala aparece uma vez só, nasce no start dela (±2 quadros) e fica >= 0,4 s depois de nascer;
- bloco >= 1,5 s, máx. 4 linhas, termina dentro da cena dele (nada atravessa troca);
- zona segura 9:16: y 250-1500, x 60-940 (largura medida com a Inter Bold de scripts/Inter-Bold.ttf, OFL);
- nenhum trecho > 2,5 s sem palavra nova ou troca de cena (fora o fecho);
- texto na tela: nenhum travessão, nenhum nome de modelo.
"""
import json, re, sys, unicodedata
from pathlib import Path
from PIL import ImageFont

AQUI = Path(__file__).resolve().parent.parent
BRUTO = (AQUI / 'src' / 'tempos.json').read_text(encoding='utf-8')
T = json.loads(BRUTO)
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))


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
if plano != fala:
    k = next((i for i, (a, b) in enumerate(zip(plano, fala)) if a != b), min(len(plano), len(fala)))
    pare(f"src/tempos.json foi feito para outra fala (campo \"fala\", linha {onde('fala')}): na palavra {k + 1} o plano tem "
         f"\"{plano[k] if k < len(plano) else '(fim)'}\" e src/palavras.json tem \"{fala[k] if k < len(fala) else '(fim)'}\".\n"
         f"Refaça o plano sobre a fala nova: \"cenas\" (linha {onde('cenas')}), \"blocos\" (linha {onde('blocos')}), \"flashes\", \"marcas\", \"texto\", \"acordes\", \"escurece_q\" e \"duracao_q\" em src/tempos.json e as telas em src/cenas.tsx (modelos/sofistmotion01/sofistmotion01.md, seção 9),\n"
         f"e cole no campo \"fala\" o texto da fala nova: {' '.join(p['text'] for p in PS)}")
n = len(PS)
fora = []
for b in T['blocos']:
    fora += [f"bloco {b['id']} (linha {onde(b['id'])}): id {i}" for l in b['linhas'] for i in l['ids'] if not 0 <= i < n]
    if b['cena'] not in {c['id'] for c in T['cenas']}:
        fora.append(f"bloco {b['id']} (linha {onde(b['id'])}): a cena {b['cena']} não existe em \"cenas\"")
for nome, (i, palavra) in (T.get('marcas') or {}).items():
    if not 0 <= i < n:
        fora.append(f"marca \"{nome}\" (linha {onde(nome)}): id {i}")
    elif limpa(PS[i]['text']) != limpa(palavra):
        fora.append(f"marca \"{nome}\" (linha {onde(nome)}): a palavra {i} é \"{PS[i]['text']}\", não \"{palavra}\"")
if fora:
    pare(f"a fala tem {n} palavras (ids 0 a {n - 1}) e o plano aponta para o que não existe:\n" + '\n'.join(fora))
if T['duracao_q'] / T['fps'] < PS[-1]['end']:
    pare(f"\"duracao_q\" (linha {onde('duracao_q')}) = {T['duracao_q']} corta a fala, que acaba em {PS[-1]['end']:.2f} s")

# ---------------------------------------------------------------- 2. tempo, posição e zona segura
FPS = T['fps']
FONTE = str(AQUI / 'scripts' / 'Inter-Bold.ttf')
cenas = {c['id']: c for c in T['cenas']}
FECHO = T['cenas'][-1]['id']  # a última cena é o fecho: o bloco de 1,5 s e o "sem evento" não valem nela
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
    if (ate - pri) / FPS < 1.5 and b['cena'] != FECHO: erros.append(f"{b['id']}: bloco {(ate - pri) / FPS:.2f} s (< 1,5): junte com o bloco vizinho")
    if len(b['linhas']) > 4: erros.append(f"{b['id']}: {len(b['linhas'])} linhas")
    if ate > c['ate_q'] or de < c['de_q']: erros.append(f"{b['id']}: atravessa a troca da cena {c['id']}")
    for l in b['linhas']:
        s = ' '.join(txt(i) for i in l['ids']); fs = l['fs']
        w = largura(s, fs); x0 = 540 - w / 2; x1 = 540 + w / 2
        y0 = l['y'] - fs * 0.62; y1 = l['y'] + fs * 0.62
        if x0 < 60 or x1 > 940: erros.append(f"{b['id']}: '{s}' x {x0:.0f}-{x1:.0f} fora da zona: quebre a linha ou diminua o fs")
        if y0 < 250 or y1 > 1500: erros.append(f"{b['id']}: '{s}' y {y0:.0f}-{y1:.0f} fora da zona")
        if '—' in s: erros.append(f"{b['id']}: travessão em '{s}'")
        for i in l['ids']:
            vezes[i] += 1
            n = max(de, q(PS[i]['start']))
            d = n - PS[i]['start'] * FPS
            if abs(d) > 2: erros.append(f"{b['id']}: '{txt(i)}' nasce {n / FPS:.2f} s, dita {PS[i]['start']:.2f} ({d:+.1f} q): o bloco começa tarde demais")
            if (ate - n) / FPS < 0.4 - 1e-6: erros.append(f"{b['id']}: '{txt(i)}' fica {(ate - n) / FPS:.2f} s (< 0,4): estique o bloco ou passe a palavra para o bloco seguinte")
            nasc.append(n)
for i, v in enumerate(vezes):
    if v != 1: erros.append(f"palavra {i} '{PS[i]['text']}' aparece {v}x")
# eventos: palavra nova ou troca de cena; fecho (C10) fora
ev = sorted(set(nasc + [c['de_q'] for c in T['cenas']]))
for a, b2 in zip(ev, ev[1:]):
    if b2 <= cenas[FECHO]['de_q'] and (b2 - a) / FPS > 2.5: erros.append(f"{a / FPS:.2f}-{b2 / FPS:.2f} s sem evento novo")
todo = ' '.join(txt(i) for i in range(len(PS))).lower()
for nome in ('sofistmotion', 'modelodinamico', 'superpodcast'):
    if nome in todo: erros.append(f"nome de modelo no texto: {nome}")
print(f"{len(erros)} erros")
for e in erros: print('  ' + e)
sys.exit(1 if erros else 0)
