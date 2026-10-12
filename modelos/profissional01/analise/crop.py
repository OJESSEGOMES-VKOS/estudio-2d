"""Recortes em tamanho real de uma faixa, quadro a quadro. uso: python crop.py <video> <saida> <ini> <fim> <passo> <y0> <y1>"""
import subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
v, out, a, b, p, y0, y1 = sys.argv[1], sys.argv[2], *map(float, sys.argv[3:8])
tmp = Path(tempfile.mkdtemp()); f = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 16)
ims = []; t = a
while t <= b + 1e-6:
    o = tmp / f'{len(ims)}.png'
    subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.3f}', '-i', v, '-frames:v', '1', '-y', str(o)])
    im = Image.open(o).convert('RGB'); im = im.crop((0, int(y0), im.width, int(y1)))
    ImageDraw.Draw(im).text((4, 2), f'{t:.2f}', fill='yellow', font=f, stroke_width=2, stroke_fill='black'); ims.append(im); t += p
W, H = ims[0].size; cols = 2
S = Image.new('RGB', (W * cols, H * ((len(ims) + cols - 1) // cols)))
for k, im in enumerate(ims): S.paste(im, ((k % cols) * W, (k // cols) * H))
S.save(out)
