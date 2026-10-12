"""Folha de conferência: em cima o nosso quadro, embaixo o quadro do v4 (o vídeo aprovado do modelo) no mesmo modo.
uso: python scripts/lado_a_lado.py   -> conferencia/lado-a-lado.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
AQUI = Path(__file__).resolve().parent.parent / 'conferencia'
PARES = [
    ('final_1.00.png', 'ref/v4_1.5.png', 'abre limpo: só ele e a legenda'),
    ('final_2.60.png', 'ref/v4_5.5.png', 'editor: o Claude passa a lâmina'),
    ('final_4.85.png', 'ref/v4_6.6.png', 'editor: legenda e tela nascem'),
    ('final_7.40.png', 'ref/v4_18.6.png', 'dividido: painel marfim + pílula'),
    ('final_10.30.png', 'ref/v4_31.0.png', 'tudo entra no chip do Claude'),
    ('final_13.80.png', 'ref/v4_14.0.png', 'tela cheia ilustrada (celular)'),
    ('q_16.60_previas.png', 'ref/v4_26.0.png', 'quadro com borda papel + etiqueta'),
    ('final_22.50.png', 'ref/v4_38.5.png', 'etiqueta na coluna'),
    ('final_25.50.png', 'ref/v4_20.5.png', 'caixa do Claude com as palavras'),
    ('final_28.40.png', 'ref/v4_48.5.png', 'fecho no jeito do Instagram'),
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
d.text((4, 4), 'VITRINE', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
d.text((4, H + T + 4), 'V4 (APROVADO)', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
folha.save(AQUI / 'lado-a-lado.png')
print(AQUI / 'lado-a-lado.png')
