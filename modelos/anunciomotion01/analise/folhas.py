"""Folhas de contato com o tempo em cada quadro.
uso: python folhas.py <video> <prefixo> [fps=2] [de=0] [ate=fim] [colunas=8] [largura=240]
"""
import subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

video, pref = sys.argv[1], sys.argv[2]
fps = float(sys.argv[3]) if len(sys.argv) > 3 else 2
de = float(sys.argv[4]) if len(sys.argv) > 4 else 0
ate = float(sys.argv[5]) if len(sys.argv) > 5 else None
col = int(sys.argv[6]) if len(sys.argv) > 6 else 8
lar = int(sys.argv[7]) if len(sys.argv) > 7 else 240
lin = 4

tmp = Path(tempfile.mkdtemp())
cmd = ['ffmpeg', '-loglevel', 'error', '-ss', str(de), '-i', video]
if ate is not None:
    cmd += ['-t', str(ate - de)]
cmd += ['-vf', f'fps={fps},scale={lar}:-2', str(tmp / '%05d.png')]
subprocess.run(cmd, check=True)
fs = sorted(tmp.glob('*.png'))
fonte = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 17)
w, h = Image.open(fs[0]).size
por = col * lin
for p in range(0, len(fs), por):
    folha = Image.new('RGB', (col * w, lin * h), 'black')
    for j, f in enumerate(fs[p:p + por]):
        im = Image.open(f).convert('RGB')
        d = ImageDraw.Draw(im)
        t = de + (p + j) / fps
        d.rectangle([0, 0, 62, 22], fill='black')
        d.text((4, 2), f'{t:5.2f}', font=fonte, fill='yellow')
        folha.paste(im, ((j % col) * w, (j // col) * h))
    folha.save(f'{pref}_{p // por + 1:02d}.png')
print(len(fs), 'quadros')
