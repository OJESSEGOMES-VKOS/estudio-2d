"""Confere tempo de leitura (1 s + 3 palavras/s) e se algum texto atravessa corte seco. Lê o objeto T de src/Video.tsx.
uso: python scripts/tempos.py   -> conferencia/tempos.json
"""
import json
import re
from pathlib import Path

AQUI = Path(__file__).resolve().parent.parent
src = (AQUI / 'src' / 'Video.tsx').read_text(encoding='utf-8')
corpo = src[src.index('const T = {'):src.index('};', src.index('const T = {'))]
T = {k: float(v) for k, v in re.findall(r'(\w+): ([\d.]+),', corpo)}
T['fim'] = 910 / 30
CORTES = [T['punch1'], T['largo1'], T['montagem'], 8.58, 8.9, 9.22, T['largo2'], T['punch2'], T['nome'], T['previas'], T['mas'], T['largo3'], T['cta']]

# (nome, entra, sai, palavras)  sem prévias; as prévias (15,04–19,99) só existem com previas: true
BLOCOS = [
    ('100% / EDITADO PELO CLAUDE', T['punch1'], T['largo1'], 4),
    ('nomes da grade (1ª)', T['varios'] + 0.3, T['montagem'], 1),
    ('ojessegomes (tela de reels)', T['reel'] + 0.15, T['nome'], 1),
    ('YOUTUBE EDITION01', T['nome'], T['previas'], 1),
    ('nomes das prévias', T['entraPrevia'] + 0.12, T['mas'], 1),
    ('nomes da grade (callback)', T['tela2'] + 0.37, T['largo3'], 1),
    ('youtubeedition01 no cartão', T['esse'], T['largo3'], 1),
    ('comenta EDIÇÃO aqui embaixo', T['cta'], T['fim'], 4),
]
res = []
for nome, a, b, n in BLOCOS:
    precisa = 1 + n / 3
    atravessa = [c for c in CORTES if a < c < b - 1e-6]
    res.append({'texto': nome, 'entra': round(a, 2), 'sai': round(b, 2), 'dura': round(b - a, 2), 'precisa': round(precisa, 2),
                'ok_leitura': b - a >= precisa - 0.01, 'atravessa_corte': atravessa})
    print(f"{nome:38s} {a:6.2f}-{b:6.2f}  {b - a:4.2f}s / {precisa:4.2f}s  {'OK' if b - a >= precisa - 0.01 else 'CURTO'}  {'ATRAVESSA ' + str(atravessa) if atravessa else ''}")
(AQUI / 'conferencia').mkdir(exist_ok=True)
(AQUI / 'conferencia' / 'tempos.json').write_text(json.dumps({'cortes': CORTES, 'blocos': res}, ensure_ascii=False, indent=1), encoding='utf-8')
