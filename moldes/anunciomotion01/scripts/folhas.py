"""Folhas de conferência do mp4 final: conferencia/folha-1qps.png e conferencia/lado-a-lado.png
(em cima o nosso quadro; embaixo o quadro da referência do modelo ou do anúncio aprovado com o mesmo recurso).
uso: ../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4"""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
AQUI = Path(__file__).resolve().parent.parent
V = sys.argv[1] if len(sys.argv) > 1 else str(AQUI / 'out' / 'vitrine-anunciomotion01.mp4')
RAIZ = AQUI.parents[1]  # raiz do estúdio
REF = RAIZ / 'modelos/anunciomotion01/referencias'
R = {'ref1': next(REF.glob('*W8E.mp4')), 'ref4': next(REF.glob('*nw.mp4')), 'marcai': RAIZ / 'modelos/anunciomotion01/exemplos/marcai-anuncio.mp4'}
for p in REF.glob('*.mp4'):
    if 'y9o' in p.name or 'Iymnw' in p.name: R['ref4'] = p
C = AQUI / 'conferencia'; (C / 'final').mkdir(parents=True, exist_ok=True)
fo = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 18)
def quadro(v, t, nome):
    out = C / 'final' / f'{nome}_{t:05.2f}.png'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', f'{t}', '-i', str(v), '-frames:v', '1', str(out)], check=True)
    return out
ts = [i + 0.5 for i in range(31)]
w, h, cols = 216, 384, 8
F = Image.new('RGB', (cols * w, ((len(ts) + cols - 1) // cols) * h), 'black'); d = ImageDraw.Draw(F)
for k, t in enumerate(ts):
    x, y = (k % cols) * w, (k // cols) * h
    F.paste(Image.open(quadro(V, t, 'final')).convert('RGB').resize((w, h)), (x, y))
    d.text((x + 4, y + 4), f'{t:.1f}s', font=fo, fill='yellow', stroke_width=2, stroke_fill='black')
F.save(C / 'folha-1qps.png')
PARES = [(2.6, 'marcai', 30.4, 'número que conta com anéis'), (4.2, 'marcai', 21.6, 'respiro claro, placa inclinada'),
         (7.9, 'ref1', 4.0, 'ícone de vidro com brilho'), (9.5, 'marcai', 14.4, 'ícone herói girando, anéis'),
         (12.4, 'marcai', 17.2, 'celular inclinado flutuando'), (14.4, 'ref1', 2.67, 'respiro claro, frase 2 linhas'),
         (19.5, 'ref1', 14.0, 'placa inclinada com tela'), (23.3, 'ref1', 1.33, 'pílula de contorno brilhante'),
         (26.5, 'marcai', 38.8, 'botão que destrava'), (29.5, 'marcai', 41.6, 'fecho com anéis')]
W2, H2, TT = 300, 533, 44
L = Image.new('RGB', (len(PARES) * W2, H2 * 2 + TT), 'white'); d = ImageDraw.Draw(L)
for i, (t, r, tr, rot) in enumerate(PARES):
    L.paste(Image.open(quadro(V, t, 'final')).convert('RGB').resize((W2, H2)), (i * W2, 0))
    L.paste(Image.open(quadro(R[r], tr, r)).convert('RGB').resize((W2, H2)), (i * W2, H2 + TT))
    d.text((i * W2 + 6, H2 + 4), f'{rot}', font=fo, fill='black'); d.text((i * W2 + 6, H2 + 23), f'{r} {tr}s', font=fo, fill='gray')
L.save(C / 'lado-a-lado.png'); print('ok')
