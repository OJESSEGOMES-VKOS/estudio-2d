"""Folha de quadros em tempos escolhidos. uso: python tira.py <video> <saida.png> <t1> <t2> ... (ou ini:fim:passo)"""
import subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
v, out = sys.argv[1], sys.argv[2]
ts = []
for a in sys.argv[3:]:
    if ':' in a:
        i, f, p = map(float, a.split(':')); t = i
        while t <= f + 1e-6: ts.append(round(t, 2)); t += p
    else: ts.append(float(a))
tmp = Path(tempfile.mkdtemp()); fonte = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 18)
W, H, cols = 270, 480, 6
ims = []
for k, t in enumerate(ts):
    o = tmp / f'{k}.png'
    subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t), '-i', v, '-frames:v', '1', '-vf', f'scale={W}:{H}', '-y', str(o)])
    im = Image.open(o).convert('RGB') if o.exists() else Image.new('RGB', (W, H))
    ImageDraw.Draw(im).text((4, 2), f'{t:.2f}', fill='yellow', font=fonte, stroke_width=2, stroke_fill='black'); ims.append(im)
rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (W * cols, H * rows))
for k, im in enumerate(ims): S.paste(im, ((k % cols) * W, (k // cols) * H))
S.save(out)
