"""Folhas de conferência tiradas do mp4 final.
- conferencia/lado-a-lado.png: em cima o nosso quadro, embaixo o quadro da referência com o mesmo tipo de cena.
- conferencia/folha-1s.png: um quadro por segundo (0 a 30 s), com o tempo.
uso: ../../.venv/Scripts/python.exe scripts/folhas.py [out/vitrine-ilustrations01.mp4]
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

AQUI = Path(__file__).resolve().parent.parent
MP4 = AQUI / (sys.argv[1] if len(sys.argv) > 1 else 'out/vitrine-ilustrations01.mp4')
CONF = AQUI / 'conferencia'
QD = CONF / 'quadros'
QD.mkdir(parents=True, exist_ok=True)


def quadro(t):
    out = QD / f'final_{t:05.2f}.png'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t}', '-i', str(MP4), '-frames:v', '1', str(out)], check=True)
    return out


PARES = [
    (0.5, 'ref4_16.75.png', 'chegada: palito branco andando, freia longo; reflexo (ref4 16,75)'),
    (3.6, 'ref4_3.25.png', 'frase entre aspas a 31%, caixa alta pequena, objeto aceso à direita (ref4 3,25)'),
    (10.5, 'ref4_7.25.png', 'a corrente enfileirada, frase acima (ref4 7,25)'),
    (14.2, 'ref3_0.30.png', '"um desses modelos": brilho branco em quem vence, os outros apagados (ref3 0,30)'),
    (17.8, 'ref1_6.00.png', 'par simétrico no alto com o nome de cada um (ref1 6,00)'),
    (22.8, 'ref2_5.80.png', 'virada: verde com halo, evento de cor (ref2 5,80)'),
    (28.8, 'ref4_25.00.png', 'apagão e moral em 2 linhas no preto (ref4 25,00)'),
]
W, H, T = 300, 533, 70
f = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 14)
folha = Image.new('RGB', (len(PARES) * W, 2 * H + T), 'white')
d = ImageDraw.Draw(folha)
for i, (t, ref, rot) in enumerate(PARES):
    folha.paste(Image.open(quadro(t)).convert('RGB').resize((W, H)), (i * W, 0))
    folha.paste(Image.open(CONF / 'ref' / ref).convert('RGB').resize((W, H)), (i * W, H + T))
    linhas, at = [], ''
    for p in f'{t:.1f} s: {rot}'.split():
        if d.textlength(at + ' ' + p, font=f) > W - 12:
            linhas.append(at)
            at = p
        else:
            at = (at + ' ' + p).strip()
    linhas.append(at)
    for k, l in enumerate(linhas[:4]):
        d.text((i * W + 6, H + 3 + k * 16), l, font=f, fill='black')
d.text((4, 4), 'NOSSO', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
d.text((4, H + T + 4), 'REFERÊNCIA', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
folha.save(CONF / 'lado-a-lado.png')
print(CONF / 'lado-a-lado.png')

# 1 quadro por segundo
tempos = list(range(0, 31))
cw, ch = 216, 384
cols = 8
linhas_n = (len(tempos) + cols - 1) // cols
f2 = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 18)
grade = Image.new('RGB', (cols * cw, linhas_n * ch), 'black')
g = ImageDraw.Draw(grade)
for k, t in enumerate(tempos):
    tq = min(t, 30.3)
    im = Image.open(quadro(tq)).convert('RGB').resize((cw, ch))
    grade.paste(im, ((k % cols) * cw, (k // cols) * ch))
    g.text(((k % cols) * cw + 6, (k // cols) * ch + 4), f'{tq:.1f}', font=f2, fill='yellow')
grade.save(CONF / 'folha-1s.png')
print(CONF / 'folha-1s.png')
