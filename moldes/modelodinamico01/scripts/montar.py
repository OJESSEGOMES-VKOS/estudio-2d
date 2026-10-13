"""junta as fotos de conferência numa folha: python d1/montar.py saida.png q1.png q2.png ..."""
import sys
from PIL import Image, ImageDraw, ImageFont
out, fs = sys.argv[1], sys.argv[2:]
W, H, col = 324, 576, 5
lin = (len(fs) + col - 1) // col
folha = Image.new('RGB', (col * W, lin * H), 'black')
fonte = ImageFont.load_default(size=20)  # fonte embutida no Pillow: funciona em Windows, macOS e Linux
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB').resize((W, H))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 70, 26], fill='black')
    d.text((4, 2), f.split('_')[-1][:-4], font=fonte, fill='yellow')
    folha.paste(im, ((i % col) * W, (i // col) * H))
folha.save(out)
