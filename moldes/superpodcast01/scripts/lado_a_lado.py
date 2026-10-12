"""Folha de conferência: em cima o nosso quadro (tirado do mp4 final), embaixo o quadro da referência (ref1/ref2) com o mesmo recurso.
uso: python scripts/lado_a_lado.py   -> conferencia/lado-a-lado.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
AQUI = Path(__file__).resolve().parent.parent / 'conferencia'
PARES = [
    ('final_2.80.png', 'ref/ref1_1.25.png', 'tese no palco: pequena + serifa gigante (ref1 1,25)'),
    ('final_4.60.png', 'ref/ref1_8.25.png', 'rosto + terço inferior mono com traço vermelho (ref1 8,25)'),
    ('final_6.40.png', 'ref/ref1_3.75.png', 'colagem no papel, uma foto por vez (ref1 3,75)'),
    ('final_9.40.png', 'ref/ref1_6.75.png', 'B-roll em tela cheia com a palavra-chave (ref1 6,75)'),
    ('final_12.60.png', 'ref/ref1_26.75.png', 'rede social: cards explodem, nome em serifa tinta (ref1 26,75)'),
    ('final_14.30.png', 'ref/ref1_33.25.png', 'nome do modelo no terço inferior da 2ª aparição (ref1 33,25)'),
    ('final_17.00.png', 'ref/ref2_21.75.png', 'tela dividida: palco em cima, close embaixo (ref2 21,75)'),
    ('final_23.80.png', 'ref/ref1_29.50.png', 'prints no papel, texto no alto (ref1 29,5)'),
    ('final_25.20.png', 'ref/ref1_13.10.png', 'frase de impacto de volta ao palco (ref1 13,1)'),
    ('final_29.90.png', 'ref/ref1_16.00.png', 'fecho: edição embaixo, pequena + serifa vermelha (ref1 16,0)'),
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
