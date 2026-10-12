"""Folha de quadros com o tempo no canto.  python scripts/montar.py saida.png q1.png q2.png ... [--cols 6]"""
import sys
from PIL import Image, ImageDraw, ImageFont
a = sys.argv[1:]
cols = 6
if '--cols' in a:
    i = a.index('--cols'); cols = int(a[i + 1]); del a[i:i + 2]
saida, fs = a[0], a[1:]
W, H = 270, 480
rows = (len(fs) + cols - 1) // cols
folha = Image.new('RGB', (cols * W, rows * H), 'black')
d = ImageDraw.Draw(folha)
fo = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 18)
for k, f in enumerate(fs):
    x, y = (k % cols) * W, (k // cols) * H
    folha.paste(Image.open(f).convert('RGB').resize((W, H)), (x, y))
    rot = f.replace(chr(92), '/').split('/')[-1].replace('q_', '').replace('final_', '').replace('.png', '')
    d.text((x + 4, y + 4), rot, font=fo, fill='yellow', stroke_width=2, stroke_fill='black')
folha.save(saida)
print(saida)
