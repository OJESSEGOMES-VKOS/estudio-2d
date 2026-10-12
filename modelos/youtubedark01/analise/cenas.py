"""Uma folha por vídeo com 1 quadro do meio de cada cena (corte detectado) + o ritmo medido + o roteiro limpo da legenda.
uso: python cenas.py <video.mp4> <prefixo> [limiar=0.30]
saídas: <prefixo>_cenas_NN.png, <prefixo>_cortes.txt, <prefixo>_roteiro.txt (se houver .en.vtt ao lado)
"""
import re, subprocess, sys, tempfile
from pathlib import Path
from statistics import median
from PIL import Image, ImageDraw, ImageFont

video, pref = Path(sys.argv[1]), sys.argv[2]
lim = float(sys.argv[3]) if len(sys.argv) > 3 else 0.30

dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(video)],
                           capture_output=True, text=True).stdout)
log = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(video), '-vf', f"select='gt(scene,{lim})',showinfo", '-an', '-f', 'null', '-'],
                     capture_output=True, text=True).stderr
cortes = [0.0] + [float(m) for m in re.findall(r'pts_time:([\d.]+)', log)] + [dur]
cenas = [(a, b) for a, b in zip(cortes, cortes[1:]) if b - a > 0.08]
dd = [b - a for a, b in cenas]
with open(f'{pref}_cortes.txt', 'w', encoding='utf-8') as f:
    f.write(f'duracao {dur:.1f}s | cenas {len(cenas)} | media {dur / len(cenas):.2f}s | mediana {median(dd):.2f}s | '
            f'<1s {sum(d < 1 for d in dd)} | >6s {sum(d > 6 for d in dd)}\n')
    for i, (a, b) in enumerate(cenas):
        f.write(f'{i:03d} {a:7.2f} {b - a:5.2f}\n')

tmp = Path(tempfile.mkdtemp())
fonte = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 16)
ims = []
for i, (a, b) in enumerate(cenas):
    o = tmp / f'{i:04d}.png'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', f'{(a + b) / 2:.2f}', '-i', str(video), '-frames:v', '1',
                    '-vf', 'scale=-2:180', str(o)], check=True)
    if not o.exists():  # quadro do meio ilegível: tenta o começo da cena
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', f'{a:.2f}', '-i', str(video), '-frames:v', '1',
                        '-vf', 'scale=-2:180', str(o)], check=True)
    if not o.exists():
        continue
    im = Image.open(o).convert('RGB')
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 112, 20], fill='black')
    d.text((3, 1), f'{a:6.1f} +{b - a:.1f}', font=fonte, fill='yellow')
    ims.append(im)
w, h = ims[0].size
col = 6 if w > h else 12
por = col * 5
for p in range(0, len(ims), por):
    folha = Image.new('RGB', (col * w, 5 * h), 'black')
    for j, im in enumerate(ims[p:p + por]):
        folha.paste(im.resize((w, h)), ((j % col) * w, (j // col) * h))
    folha.save(f'{pref}_cenas_{p // por + 1:02d}.png')

vtt = video.with_suffix('.en.vtt')
if vtt.exists():
    linhas, ult = [], ''
    for bloco in vtt.read_text(encoding='utf-8').split('\n\n'):
        m = re.search(r'(\d+):(\d+):([\d.]+) -->', bloco)
        if not m:
            continue
        t = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])
        txt = [re.sub(r'<[^>]+>', '', l).strip() for l in bloco.split('\n')[1:] if '-->' not in l]
        txt = [l for l in txt if l]
        if not txt or txt[-1] == ult:
            continue
        ult = txt[-1]
        linhas.append(f'[{t:6.1f}] {ult}')
    Path(f'{pref}_roteiro.txt').write_text('\n'.join(linhas), encoding='utf-8')
print(open(f'{pref}_cortes.txt', encoding='utf-8').readline().strip())
