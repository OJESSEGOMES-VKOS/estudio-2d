"""Folha de conferência: em cima o nosso quadro, embaixo o quadro da referência (ou do exemplo aprovado) do mesmo recurso.
uso: python scripts/lado_a_lado.py   -> conferencia/lado-a-lado.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
AQUI = Path(__file__).resolve().parent.parent / 'conferencia'
PARES = [
    ('final_1.00.png', 'ref/ex_1.6.png', 'abertura: bloco de 3 vozes no peito (exemplo aprovado)'),
    ('final_2.60.png', 'ref/ref2_3.0.png', 'número no círculo vermelho (ref2 3,0)'),
    ('final_6.50.png', 'ref/ref1_3.0.png', 'palavra vermelha atrás do bloco, como carimbo (ref1 3,0)'),
    ('final_10.00.png', 'ref/ref1_31.5.png', 'condensada vermelha enorme + sans (ref1 31,5)'),
    ('final_11.50.png', 'ref/ref1_16.6.png', 'VHS verde com linhas (ref1 16,6)'),
    ('final_13.80.png', 'ref/ref3_4.6.png', 'nome do modelo em vermelho com brilho (ref3 4,6)'),
    ('q_17.00_previas.png', 'ref/ref2_7.5.png', 'prévias: dividido em cima e embaixo com degradê (ref2 7,5)'),
    ('final_21.30.png', 'ref/ref3_37.5.png', 'tela de respiro (ref3 37,5)'),
    ('final_28.40.png', 'ref/ref1_84.png', 'fecho Comente NOME em VHS (ref1 84)'),
]
W, H, T = 300, 533, 64
folha = Image.new('RGB', (len(PARES) * W, 2 * H + T), 'white')
d = ImageDraw.Draw(folha)
f = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 15)
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
