"""Corrige uma palavra que o Whisper errou num vídeo já criado, sem rodar o Whisper de novo.

uso (da raiz do estúdio, venv do estúdio):
  .venv/Scripts/python.exe tools/trocar.py videos/<AAAA-MM-DD-tema> Claudio=Claude [Cloud=Claude ...]
faz: troca a palavra INTEIRA (a pontuação colada fica) em base/palavras.json e src/palavras.json, e mostra cada troca.
Os tempos não mudam. Depois, rode de novo o conferidor do molde.
"""
import json, re, sys
sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')  # acentos no terminal do Windows
from pathlib import Path

if len(sys.argv) < 3 or any('=' not in x for x in sys.argv[2:]):
    sys.exit(__doc__)
pasta = Path(sys.argv[1])
trocas = dict(x.split('=', 1) for x in sys.argv[2:])
arquivos = [f for f in (pasta / 'base' / 'palavras.json', pasta / 'src' / 'palavras.json') if f.is_file()]
if not arquivos:
    sys.exit(f'não achei base/palavras.json nem src/palavras.json em {pasta}')

for f in arquivos:
    palavras = json.loads(f.read_text(encoding='utf-8'))
    n = 0
    for i, x in enumerate(palavras):
        chave = 'text' if 'text' in x else 'texto'
        novo = x[chave]
        for errado, certo in trocas.items():
            novo = re.sub(r'(?<![\w])' + re.escape(errado) + r'(?![\w])', certo, novo)
        if novo != x[chave]:
            print(f'{f.parent.name}/{f.name} palavra {i}: {x[chave]} -> {novo}')
            x[chave] = novo; n += 1
    f.write_text(json.dumps(palavras, ensure_ascii=False, indent=0), encoding='utf-8')
    print(f'{f}: {n} troca(s)')
