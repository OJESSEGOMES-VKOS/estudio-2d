"""Folhas de conferência a partir do mp4 final.
uso: ../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4
 -> conferencia/folha-1qps.png (1 quadro por segundo) e conferencia/lado-a-lado.png
    (em cima o nosso quadro; embaixo o curta aprovado HOJE ou a cena da referência com o mesmo recurso)
"""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
AQUI = Path(__file__).resolve().parent.parent
V = sys.argv[1] if len(sys.argv) > 1 else str(AQUI / 'out' / 'final.mp4')
AN = AQUI.parents[1] / 'modelos' / 'youtubedark01' / 'analise'  # raiz do estúdio/modelos
C = AQUI / 'conferencia'
(C / 'final').mkdir(parents=True, exist_ok=True)
fo = ImageFont.load_default(size=18)  # fonte embutida no Pillow: funciona em Windows, macOS e Linux

def quadro(t):
    out = C / 'final' / f'final_{t:05.2f}.png'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', f'{t}', '-i', V, '-frames:v', '1', str(out)], check=True)
    return out

ts = [i + 0.5 for i in range(31) if i + 0.5 < 30.4]
w, h, cols = 216, 384, 8
rows = (len(ts) + cols - 1) // cols
F = Image.new('RGB', (cols * w, rows * h), 'black'); d = ImageDraw.Draw(F)
for k, t in enumerate(ts):
    x, y = (k % cols) * w, (k // cols) * h
    F.paste(Image.open(quadro(t)).convert('RGB').resize((w, h)), (x, y))
    d.text((x + 4, y + 4), f'{t:.1f}s', font=fo, fill='yellow', stroke_width=2, stroke_fill='black')
F.save(C / 'folha-1qps.png')

def recorte(arq, caixa):  # caixa em fração (x0, y0, x1, y1) de uma folha de cenas
    im = Image.open(arq).convert('RGB'); W, H = im.size
    return im.crop((int(caixa[0] * W), int(caixa[1] * H), int(caixa[2] * W), int(caixa[3] * H)))

PARES = [
    (1.5, ('hoje', 'hoje_3.5.png'), 'aprovado: mesmo personagem, quarto escuro, um foco de luz'),
    (4.5, ('cena', AN / 'ref4_cenas_01.png', (0.167, 0.03, 0.333, 0.2)), 'ref4: o boneco apresenta objetos lado a lado, luz dourada'),
    (8.0, ('cena', AN / 'ref4_cenas_01.png', (0.0, 0.0, 0.167, 0.2)), 'ref4: verde neon no objeto-chave, preto em volta'),
    (11.5, ('hoje', 'hoje_8.5.png'), 'aprovado: cama, celular com luz azul'),
    (13.5, ('cena', AN / 'ref4_cenas_01.png', (0.5, 0.2, 0.667, 0.4)), 'ref4: um foco isolando o assunto'),
    (17.0, ('hoje', 'hoje_11.0.png'), 'aprovado: o foco de cima, chão em linha'),
    (23.5, ('cena', AN / 'ref4_cenas_01.png', (0.167, 0.6, 0.333, 0.8)), 'ref4: portão/porta com a luz do outro lado'),
    (25.5, ('cena', AN / 'ref4_cenas_01.png', (0.167, 0.4, 0.333, 0.6)), 'ref4: livro aberto brilhando'),
    (28.5, ('cena', AN / 'ref7_cenas_01.png', (0.0, 0.0, 0.25, 0.2)), 'ref7 (Short 9:16): palavra grossa branca com contorno, terço de baixo'),
]
W2, H2, TT = 300, 533, 60
L = Image.new('RGB', (len(PARES) * W2, H2 + TT + H2), 'white'); d = ImageDraw.Draw(L)
for i, (t, ref, rot) in enumerate(PARES):
    L.paste(Image.open(quadro(t)).convert('RGB').resize((W2, H2)), (i * W2, 0))
    im = Image.open(C / 'ref' / ref[1]).convert('RGB') if ref[0] == 'hoje' else recorte(ref[1], ref[2])
    k = min(W2 / im.width, H2 / im.height); im = im.resize((int(im.width * k), int(im.height * k)))
    fundo = Image.new('RGB', (W2, H2), 'black'); fundo.paste(im, ((W2 - im.width) // 2, (H2 - im.height) // 2))
    L.paste(fundo, (i * W2, H2 + TT))
    linhas, at = [], ''
    for p in rot.split():
        if d.textlength(at + ' ' + p, font=fo) > W2 - 12: linhas.append(at); at = p
        else: at = (at + ' ' + p).strip()
    linhas.append(at)
    for k2, l in enumerate(linhas[:3]): d.text((i * W2 + 6, H2 + 2 + k2 * 19), l, font=fo, fill='black')
d.text((4, 4), 'NOSSO', font=fo, fill='yellow', stroke_width=2, stroke_fill='black')
d.text((4, H2 + TT + 4), 'APROVADO / REFERÊNCIA', font=fo, fill='yellow', stroke_width=2, stroke_fill='black')
L.save(C / 'lado-a-lado.png')
print(C / 'folha-1qps.png', C / 'lado-a-lado.png')
