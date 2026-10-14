"""Folhas de conferência do mp4 final: conferencia/folha-1qps.png (um quadro por segundo) e conferencia/lado-a-lado.png
(em cima o nosso quadro; embaixo o quadro do vídeo aprovado do modelo, modelos/anunciomotion01/referencia/referencia.mp4, no mesmo segundo).
Sem a referência, só a folha sai.
uso: ../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4"""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
AQUI = Path(__file__).resolve().parent.parent
V = sys.argv[1] if len(sys.argv) > 1 else str(AQUI / 'out' / 'vitrine-anunciomotion01.mp4')
RAIZ = AQUI.parents[1]  # raiz do estúdio
REF = RAIZ / 'modelos/anunciomotion01/referencia/referencia.mp4'
C = AQUI / 'conferencia'; (C / 'final').mkdir(parents=True, exist_ok=True)
fo = ImageFont.load_default(size=18)  # fonte embutida no Pillow: funciona em Windows, macOS e Linux
def dur(v):
    o = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(v)], capture_output=True, text=True, check=True).stdout
    return float(o.strip())
def quadro(v, t, nome):
    out = C / 'final' / f'{nome}_{t:05.2f}.png'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', f'{t}', '-i', str(v), '-frames:v', '1', str(out)], check=True)
    return out
ts = [i + 0.5 for i in range(int(dur(V)))]
w, h, cols = 216, 384, 8
F = Image.new('RGB', (cols * w, ((len(ts) + cols - 1) // cols) * h), 'black'); d = ImageDraw.Draw(F)
for k, t in enumerate(ts):
    x, y = (k % cols) * w, (k // cols) * h
    F.paste(Image.open(quadro(V, t, 'final')).convert('RGB').resize((w, h)), (x, y))
    d.text((x + 4, y + 4), f'{t:.1f}s', font=fo, fill='yellow', stroke_width=2, stroke_fill='black')
F.save(C / 'folha-1qps.png')
if not REF.exists():
    sys.exit(f'folha-1qps.png ok; lado a lado pulado: falta {REF}')
tr = [t for t in ts if t < dur(REF)][::3]  # um par a cada 3 s
W2, H2, TT = 300, 533, 26
L = Image.new('RGB', (len(tr) * W2, H2 * 2 + TT), 'white'); d = ImageDraw.Draw(L)
for i, t in enumerate(tr):
    L.paste(Image.open(quadro(V, t, 'final')).convert('RGB').resize((W2, H2)), (i * W2, 0))
    L.paste(Image.open(quadro(REF, t, 'referencia')).convert('RGB').resize((W2, H2)), (i * W2, H2 + TT))
    d.text((i * W2 + 6, H2 + 4), f'{t:.1f}s  nosso / aprovado', font=fo, fill='black')
L.save(C / 'lado-a-lado.png'); print('ok')
