"""Confere os tempos de leitura direto do src/Reel.tsx (MODELO §13 e §14) e grava conferencia/tempos.json.
- cada bloco: da 1ª palavra na tela até sumir, contra 1 s + 3 palavras/s;
- palavra-chave completa >= 0,8 s; terço inferior contra 1 s + 3 palavras/s;
- nenhum bloco atravessa corte seco (lista PLANOS).
uso: python scripts/tempos.py
"""
import json
import re
from pathlib import Path

AQUI = Path(__file__).resolve().parent.parent
SRC = (AQUI / 'src' / 'Reel.tsx').read_text(encoding='utf-8')
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
DUR = float(re.search(r'export const DURACAO = ([\d.]+)', SRC).group(1))
num = lambda s: DUR if s == 'DURACAO' else float(s)

planos = [num(a) for a in re.findall(r"\{id: 'P\d+', de: ([\d.]+),", SRC)]
cortes = planos[1:]

corpo = SRC[SRC.index('const blocos ='):SRC.index('/* ---------------------------------------------------------------- terço inferior')]
saida, ruins = [], 0
for m in re.finditer(r"\{de: ([\d.]+), ate: ([\d.A-Z]+), tema: '(\w+)'(.*?)\]\},", corpo, re.S):
    de, ate, linhas = num(m.group(1)), num(m.group(2)), m.group(4)
    ids, kws = [], []
    for l in re.finditer(r"\{tipo: '(\w)', (ids: (rg\((\d+), (\d+)\)|\[([\d, ]+)\])|id: (\d+))(.*?)\}", linhas):
        if l.group(1) == 'k':
            k = int(l.group(7))
            ids.append(k)
            tx = re.search(r"texto: '([^']+)'", l.group(0))
            kws.append((k, tx.group(1) if tx else PS[k]['text']))
        elif l.group(4):
            ids += list(range(int(l.group(4)), int(l.group(5)) + 1))
        else:
            ids += [int(x) for x in l.group(6).split(',')]
    t0 = min(max(PS[i]['start'], de) for i in ids)
    n = len(ids)
    tem = ate - t0
    pede = 1 + n / 3
    cruza = [c for c in cortes if de < c < ate - 1e-6]
    kw = []
    for k, tx in kws:
        ent = max(PS[k]['start'], de)
        letras = len(tx)
        dur = min(0.47, max(0.33, letras * 0.035))
        kw.append({'palavra': tx, 'completa_em': round(ent + dur, 2), 'fica': round(ate - ent - dur, 2), 'ok': ate - ent - dur >= 0.8 - 1e-6})
    texto = ' '.join(PS[i]['text'] for i in sorted(ids))
    for k, tx in kws:
        if tx != PS[k]['text']:
            texto = texto.replace(PS[k]['text'], tx); n = len(tx.split()) + n - 1; pede = 1 + n / 3
    ok = tem >= pede - 1e-6
    ruins += not ok
    saida.append({'de': de, 'ate': ate, 'texto': texto, 'palavras': n, 'na_tela': round(tem, 2), 'pede': round(pede, 2), 'ok_leitura': ok, 'cruza_corte': cruza, 'palavra_chave': kw})

tercos = []
for m in re.finditer(r"\{de: ([\d.]+), ate: ([\d.]+), l1: '([^']+)', l2: '([^']+)'", SRC):
    de, ate = float(m.group(1)), float(m.group(2))
    n = len((m.group(3) + ' ' + m.group(4)).split())
    tercos.append({'texto': m.group(3) + ' / ' + m.group(4), 'na_tela': round(ate - de, 2), 'pede': round(1 + n / 3, 2), 'ok': ate - de >= 1 + n / 3 - 1e-6})

(AQUI / 'conferencia').mkdir(exist_ok=True)
json.dump({'cortes': cortes, 'blocos': saida, 'tercos': tercos}, open(AQUI / 'conferencia' / 'tempos.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for b in saida:
    k = ' '.join(f"[{x['palavra']} fica {x['fica']}s {'ok' if x['ok'] else 'CURTA'}]" for x in b['palavra_chave'])
    print(f"{b['de']:6.2f}-{b['ate']:6.2f} {'ok ' if b['ok_leitura'] else 'CURTO'} {b['na_tela']:.2f}/{b['pede']:.2f}s {'CRUZA ' + str(b['cruza_corte']) if b['cruza_corte'] else ''} {k}  {b['texto']}")
for t in tercos:
    print('terço', t)
print(f'{ruins} de {len(saida)} blocos abaixo de 1 s + 3 palavras/s')
