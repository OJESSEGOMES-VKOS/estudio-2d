"""Folha de conferência: em cima o nosso quadro (tirado do mp4 final, 9:16), embaixo o quadro da referência (16:9) com o
mesmo recurso. Encanamento do lado_a_lado.py do superpodcast01, com a referência em 16:9 sem distorcer.
uso: python scripts/lado_a_lado.py   -> conferencia/lado-a-lado.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

AQUI = Path(__file__).resolve().parent.parent / 'conferencia'
PARES = [
    ('final_2.70.png', 'ref/S_01030.png', '100% atrás da cabeça, o cabelo corta a base (S 01:03 WHY NOW?)'),
    ('final_2.70.png', 'ref/S_00495.png', 'complemento na frente, branco pesado; Claude em amarelo (S 00:48)'),
    ('final_5.40.png', 'ref/S_03405.png', 'o rosto vira cartão girando com borrão (S 03:40)'),
    ('final_7.00.png', 'ref/S_05510.png', 'a coisa real na tela, rosto no cartão do canto (S 05:51)'),
    ('final_8.40.png', 'ref/D_00446.png', 'montagem: um plano por palavra (D 00:44)'),
    ('final_12.80.png', 'ref/S_03250.png', 'o próprio plano dentro da página recriada (S 03:25)'),
    ('final_14.00.png', 'ref/S_03180.png', 'nome do modelo como palavra-título (S 03:18 NICHE)'),
    ('q_16.50_previas.png', 'ref/M_1744.png', 'prévias: a tela dividida, em pé (M 17:44)'),
    ('final_24.00.png', 'ref/M_30390.png', '"como esse": o rosto em destaque sobre a tela (M 30:39)'),
    ('final_28.60.png', 'ref/J_0500.png', 'CTA: degradê escuro e frase de ação (J 04:59)'),
    ('final_28.60.png', 'ref/M_00015.png', 'palavra-chave em amarelo #FCDC00 (M 00:01)'),
]
W, H, RH, T = 360, 640, 203, 70
folha = Image.new('RGB', (len(PARES) * W, H + T + RH), 'white')
d = ImageDraw.Draw(folha)
f = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 16)
for i, (a, b, rot) in enumerate(PARES):
    folha.paste(Image.open(AQUI / a).convert('RGB').resize((W, H)), (i * W, 0))
    folha.paste(Image.open(AQUI / b).convert('RGB').resize((W, RH)), (i * W, H + T))
    palavras, linhas, at = rot.split(), [], ''
    for p in palavras:
        if d.textlength(at + ' ' + p, font=f) > W - 12:
            linhas.append(at)
            at = p
        else:
            at = (at + ' ' + p).strip()
    linhas.append(at)
    for k, l in enumerate(linhas[:3]):
        d.text((i * W + 6, H + 4 + k * 20), l, font=f, fill='black')
d.text((4, 4), 'NOSSO', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
d.text((4, H + T + 4), 'REFERÊNCIA', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
folha.save(AQUI / 'lado-a-lado.png')
print(AQUI / 'lado-a-lado.png')
