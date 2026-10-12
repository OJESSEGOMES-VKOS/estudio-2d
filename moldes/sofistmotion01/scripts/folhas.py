"""Folhas de conferência a partir do mp4 final.
uso: ../../.venv/Scripts/python.exe scripts/folhas.py out/vitrine-sofistmotion01.mp4
 -> conferencia/folha-1qps.png (1 quadro por segundo) e conferencia/lado-a-lado.png (nosso x ref1/ref2, mesmo recurso)
"""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
AQUI = Path(__file__).resolve().parent.parent
V = sys.argv[1] if len(sys.argv) > 1 else str(AQUI / 'out' / 'vitrine-sofistmotion01.mp4')
REF = AQUI.parents[1] / 'modelos' / 'sofistmotion01' / 'analise'  # raiz do estúdio/modelos
C = AQUI / 'conferencia'
(C / 'final').mkdir(parents=True, exist_ok=True)
fo = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 18)

def quadro(t):
    out = C / 'final' / f'final_{t:05.2f}.png'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', f'{t}', '-i', V, '-frames:v', '1', str(out)], check=True)
    return out

# 1 quadro por segundo
ts = [i + 0.5 for i in range(32) if i + 0.5 < 31.7]
w, h, cols = 216, 384, 8
rows = (len(ts) + cols - 1) // cols
F = Image.new('RGB', (cols * w, rows * h), 'black'); d = ImageDraw.Draw(F)
for k, t in enumerate(ts):
    x, y = (k % cols) * w, (k // cols) * h
    F.paste(Image.open(quadro(t)).convert('RGB').resize((w, h)), (x, y))
    d.text((x + 4, y + 4), f'{t:.1f}s', font=fo, fill='yellow', stroke_width=2, stroke_fill='black')
F.save(C / 'folha-1qps.png')

# lado a lado: em cima o nosso quadro, embaixo o quadro cheio da referência com o mesmo recurso
PARES = [
    (0.45, 'ref1_q/0.25.png', 'T1 palavra gigante deslizando, vaza a largura'),
    (2.6, 'conf:ref2_6.50.png', 'T3 contador com anel de progresso (ref2 6,0; aqui em ouro)'),
    (4.2, 'ref1_q/2.00.png', 'T2 objeto entrando girando + texto'),
    (7.8, 'ref1_q/7.40.png', 'T8 anéis com cartões orbitando, frase no centro'),
    (9.6, 'ref1_q/4.50.png', 'T6 roleta + fileira de cartões'),
    (13.6, 'ref1_q/2.75.png', 'T4 pico vermelho, objeto de perto'),
    (14.62, 'conf:ref1_9.20.png', 'T9 clarão de sol sobre a grade (vira portas)'),
    (19.5, 'ref1_q/9.80.png', 'T9/T10 revelação no túnel dourado, setas'),
    (23.7, 'ref1_q/6.90.png', 'T7 contorno neon + horizonte de planeta'),
    (25.6, 'ref1_q/12.30.png', 'T5 pasta de vidro dourado + clique'),
    (29.4, 'ref1_q/16.80.png', 'T20 assinatura branca com bisel, brilho marrom'),
]
W2, H2, TT = 300, 533, 60
L = Image.new('RGB', (len(PARES) * W2, H2 + TT + H2), 'white'); d = ImageDraw.Draw(L)
for i, (t, r, rot) in enumerate(PARES):
    L.paste(Image.open(quadro(t)).convert('RGB').resize((W2, H2)), (i * W2, 0))
    im = Image.open(C / 'ref' / r[5:] if r.startswith('conf:') else REF / r).convert('RGB')
    im = im.resize((W2, int(im.height * W2 / im.width)))
    fundo = Image.new('RGB', (W2, H2), 'black'); fundo.paste(im, (0, (H2 - im.height) // 2))
    L.paste(fundo, (i * W2, H2 + TT))
    linhas, at = [], ''
    for p in rot.split():
        if d.textlength(at + ' ' + p, font=fo) > W2 - 12: linhas.append(at); at = p
        else: at = (at + ' ' + p).strip()
    linhas.append(at)
    for k, l in enumerate(linhas[:3]): d.text((i * W2 + 6, H2 + 2 + k * 19), l, font=fo, fill='black')
d.text((4, 4), f'NOSSO', font=fo, fill='yellow', stroke_width=2, stroke_fill='black')
d.text((4, H2 + TT + 4), 'REFERÊNCIA', font=fo, fill='yellow', stroke_width=2, stroke_fill='black')
L.save(C / 'lado-a-lado.png')
print(C / 'folha-1qps.png', C / 'lado-a-lado.png')
