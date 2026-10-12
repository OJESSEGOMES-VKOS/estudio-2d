"""Folha de conferência: em cima o nosso quadro (tirado do mp4 final), embaixo o quadro da referência ou do exemplo aprovado
com o mesmo recurso.  uso: python scripts/lado_a_lado.py   -> conferencia/lado-a-lado.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

AQUI = Path(__file__).resolve().parent.parent / 'conferencia'
PARES = [
    ('final_1.00.png', 'ref/ex_2.3.png', 'abertura: frase-bloco no fundo vinho (exemplo aprovado 2,3)'),
    ('final_2.70.png', 'ref/ref1_4.2.png', 'frase-bloco montada, última palavra em serifa vermelha (ref1 4,2)'),
    ('final_6.50.png', 'ref/ref1_9.3.png', 'letreiro gigante atrás da pessoa, fundo frio (ref1 9,3)'),
    ('final_9.00.png', 'ref/ex_4.1.png', 'legenda base de uma palavra no peito (exemplo 4,1)'),
    ('final_12.30.png', 'ref/ref1_18.9.png', 'tela creme de respiro, serifa itálica na palavra de peso (ref1 18,9)'),
    ('final_14.30.png', 'ref/ex_9.5.png', 'preto e branco no clímax, vermelho único ponto de cor (exemplo 9,5)'),
    ('final_18.50.png', 'ref/ref3_6.8.png', 'palavra-chave em vermelho itálico na legenda (ref3 6,8)'),
    ('final_22.50.png', 'ref/ex_16.67.png', 'frase-bloco da virada (exemplo 16,67)'),
    ('final_30.30.png', 'ref/ex_18.0.png', 'fecho no preto com a serifa vermelha (exemplo 18,0)'),
]
W, H, T = 300, 533, 64
folha = Image.new('RGB', (len(PARES) * W, 2 * H + T), 'white')
d = ImageDraw.Draw(folha)
f = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 15)
for i, (a, b, rot) in enumerate(PARES):
    folha.paste(Image.open(AQUI / a).convert('RGB').resize((W, H)), (i * W, 0))
    folha.paste(Image.open(AQUI / b).convert('RGB').resize((W, H)), (i * W, H + T))
    linhas, at = [], ''
    for p in rot.split():
        if d.textlength(at + ' ' + p, font=f) > W - 12:
            linhas.append(at)
            at = p
        else:
            at = (at + ' ' + p).strip()
    linhas.append(at)
    for k, l in enumerate(linhas[:3]):
        d.text((i * W + 6, H + 4 + k * 19), l, font=f, fill='black')
d.text((4, 4), 'NOSSO', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
d.text((4, H + T + 4), 'REFERÊNCIA', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
folha.save(AQUI / 'lado-a-lado.png')
print(AQUI / 'lado-a-lado.png')
