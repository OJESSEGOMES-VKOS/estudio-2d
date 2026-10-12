"""Junta quadros numa folha com o nome de cada um embaixo.
uso: python scripts/montar.py saida.png [--colunas N] [--largura L] q1.png q2.png ...
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

args = sys.argv[1:]
saida = args.pop(0)
col, larg = 6, 270
while args and args[0].startswith('--'):
    k = args.pop(0)
    if k == '--colunas':
        col = int(args.pop(0))
    elif k == '--largura':
        larg = int(args.pop(0))
ims = [Image.open(p).convert('RGB') for p in args]
alt = int(larg * 16 / 9)
lin = (len(ims) + col - 1) // col
folha = Image.new('RGB', (col * larg, lin * (alt + 26)), (20, 20, 20))
d = ImageDraw.Draw(folha)
for i, (im, p) in enumerate(zip(ims, args)):
    x, y = (i % col) * larg, (i // col) * (alt + 26)
    folha.paste(im.resize((larg, alt)), (x, y))
    d.text((x + 6, y + alt + 6), Path(p).stem, fill=(255, 230, 120))
folha.save(saida)
print(saida, folha.size)
