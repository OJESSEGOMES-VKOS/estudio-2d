"""Folha de conferência: em cima o nosso quadro (tirado do mp4 final), embaixo o quadro da ref3 com o mesmo recurso.
uso: python scripts/lado_a_lado.py   -> conferencia/lado-a-lado.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
AQUI = Path(__file__).resolve().parent.parent / 'conferencia'
PARES = [
    ('final_3.60.png', 'ref/ref3_2.75.png', 'bloco lateral, 2 palavras: azul + branco (ref3 2,75)'),
    ('final_6.45.png', 'ref/ref3_1.25.png', 'bloco à esquerda, largura casada (ref3 1,25 espelhado)'),
    ('final_7.95.png', 'ref/ref3_8.75.png', 'legenda pequena, negrito no trecho de peso (ref3 8,75)'),
    ('final_9.30.png', 'ref/ref3_23.25.png', 'palavra central gigante com a pequena por cima (ref3 23,25)'),
    ('final_14.70.png', 'ref/ref3_16.75.png', 'close extremo P&B, bloco embaixo, texto colorido (ref3 16,75)'),
    ('final_14.70.png', 'ref/ref3_13.25.png', 'nome do modelo: branco + barra azul da conclusão (ref3 13,25)'),
    ('final_21.80.png', 'ref/ref3_5.75.png', 'manuscrita na palavra que qualifica (ref3 5,75)'),
    ('final_23.90.png', 'ref/ref3_19.75.png', 'central azul, pequena por cima (ref3 19,75)'),
    ('final_28.60.png', 'ref/ref3_28.25.png', 'fecho: palavra azul com brilho (ref3 28,25)'),
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
