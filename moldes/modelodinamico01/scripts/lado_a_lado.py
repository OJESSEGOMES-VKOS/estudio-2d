"""Folha de conferência: em cima o nosso quadro, embaixo o quadro da referência do mesmo modo.
uso: python scripts/lado_a_lado.py   -> conferencia/lado-a-lado.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
AQUI = Path(__file__).resolve().parent.parent / 'conferencia'
PARES = [
    ('final_2.70.png', 'ref/ref1_5.5.png', 'M2 gancho: o Reel no celular + 100% + Claude'),
    ('final_4.50.png', 'ref/ref1_6.0.png', 'M3 dividido, etiqueta mono'),
    ('final_7.50.png', 'ref/ref2_5.0.png', 'M1 palco: título, card, rosto'),
    ('final_12.30.png', 'ref/ref1_3.0.png', 'M2 celular com o Reel'),
    ('final_13.80.png', 'ref/ref2_1.5.png', 'M1 palco: nome do modelo no título'),
    ('q_17.00_previas.png', 'ref/ref1_22.0.png', 'M3 prévias em cima (mp4 provisório)'),
    ('final_20.50.png', 'ref/ref2_17.5.png', 'M4 rosto cheio na virada'),
    ('final_25.80.png', 'ref/ref1_10.5.png', 'M1 prompt com /comando'),
    ('final_28.40.png', 'ref/ref3_8.5.png', 'M2 legenda em cima, card embaixo'),
]
W, H, T = 300, 533, 64
folha = Image.new('RGB', (len(PARES) * W, 2 * H + T), 'white')
d = ImageDraw.Draw(folha)
f = ImageFont.load_default(size=15)  # fonte embutida no Pillow: funciona em Windows, macOS e Linux
for i, (a, b, rot) in enumerate(PARES):
    folha.paste(Image.open(AQUI / a).convert('RGB').resize((W, H)), (i * W, 0))
    folha.paste(Image.open(AQUI / b).convert('RGB').resize((W, H)), (i * W, H + T))
    palavras, linhas, at = rot.split(), [], ''
    for p in palavras:
        if d.textlength(at + ' ' + p, font=f) > W - 12:
            linhas.append(at); at = p
        else:
            at = (at + ' ' + p).strip()
    linhas.append(at)
    for k, l in enumerate(linhas[:3]):
        d.text((i * W + 6, H + 4 + k * 19), l, font=f, fill='black')
d.text((4, 4), 'NOSSO', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
d.text((4, H + T + 4), 'REFERÊNCIA', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
folha.save(AQUI / 'lado-a-lado.png')
print(AQUI / 'lado-a-lado.png')
