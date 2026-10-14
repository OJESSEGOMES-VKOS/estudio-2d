"""Folha de conferência a partir do mp4 final: 1 quadro por segundo, com o segundo escrito.
uso (na pasta do vídeo): ../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4
 -> conferencia/folha-1qps.png
O lado a lado com o aprovado é o tools/parece.py que grava (sofistmotion01.md, seção 9, passo 10).
"""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
AQUI = Path(__file__).resolve().parent.parent
V = sys.argv[1] if len(sys.argv) > 1 else str(AQUI / 'out' / 'final.mp4')
if not Path(V).is_file():
    sys.exit(f'não achei o vídeo {V}: passe o caminho do mp4 final (ex.: out/final.mp4)')
C = AQUI / 'conferencia'
(C / 'final').mkdir(parents=True, exist_ok=True)
fo = ImageFont.load_default(size=18)  # fonte embutida no Pillow: funciona em Windows, macOS e Linux
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', V],
                           check=True, capture_output=True, text=True).stdout.strip())

def quadro(t):
    out = C / 'final' / f'final_{t:05.2f}.png'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', f'{t}', '-i', V, '-frames:v', '1', str(out)], check=True)
    return out

ts = [i + 0.5 for i in range(int(dur) + 1) if i + 0.5 < dur]
w, h, cols = 216, 384, 8
rows = (len(ts) + cols - 1) // cols
F = Image.new('RGB', (cols * w, rows * h), 'black'); d = ImageDraw.Draw(F)
for k, t in enumerate(ts):
    x, y = (k % cols) * w, (k // cols) * h
    F.paste(Image.open(quadro(t)).convert('RGB').resize((w, h)), (x, y))
    d.text((x + 4, y + 4), f'{t:.1f}s', font=fo, fill='yellow', stroke_width=2, stroke_fill='black')
F.save(C / 'folha-1qps.png')
print(C / 'folha-1qps.png', f'({len(ts)} quadros, {dur:.1f} s)')
