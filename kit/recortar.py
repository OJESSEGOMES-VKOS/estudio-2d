"""Remove o fundo de imagens e grava PNG com transparência, recortado justo no conteúdo.
uso: .venv/Scripts/python recortar.py <imagem ou pasta> [<saida>] [--modelo pessoa|geral|leve]
  pessoa = birefnet-portrait (gente, cabelo)   geral = birefnet-general (objeto, prédio, logo)
  leve   = isnet-general-use (rápido, pra testar)
saída: <nome>_recorte.png ao lado (ou na pasta <saida>) + <nome>_prova.jpg (o recorte sobre xadrez,
pra conferir a borda de olho). Os modelos baixam sozinhos na primeira vez (~200 a 900 MB)."""
import argparse
from pathlib import Path
from PIL import Image
from rembg import new_session, remove

MODELOS = {'pessoa': 'birefnet-portrait', 'geral': 'birefnet-general', 'leve': 'isnet-general-use'}
EXTS = {'.jpg', '.jpeg', '.png', '.webp'}


def xadrez(w, h, lado=24):
    im = Image.new('RGB', (w, h), (200, 200, 200))
    for y in range(0, h, lado):
        for x in range(0, w, lado):
            if (x // lado + y // lado) % 2:
                im.paste((140, 140, 140), (x, y, x + lado, y + lado))
    return im


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('entrada')
    ap.add_argument('saida', nargs='?')
    ap.add_argument('--modelo', default='geral', choices=MODELOS)
    a = ap.parse_args()
    ent = Path(a.entrada)
    arqs = [p for p in sorted(ent.iterdir()) if p.suffix.lower() in EXTS and '_recorte' not in p.stem
            and '_prova' not in p.stem and '_folha' not in p.stem] if ent.is_dir() else [ent]
    sessao = new_session(MODELOS[a.modelo])
    for arq in arqs:
        pasta = Path(a.saida) if a.saida else arq.parent
        pasta.mkdir(parents=True, exist_ok=True)
        destino = pasta / f'{arq.stem}_recorte.png'
        if destino.exists():
            continue
        im = remove(Image.open(arq).convert('RGB'), session=sessao, post_process_mask=True)
        caixa = im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
        if not caixa:
            print(arq.name, ': nada recortado (o modelo não achou o objeto)')
            continue
        im = im.crop(caixa)
        im.save(destino)
        prova = xadrez(*im.size)
        prova.paste(im, (0, 0), im)
        prova.thumbnail((900, 900))
        prova.save(pasta / f'{arq.stem}_prova.jpg', quality=85)
        print(arq.name, '->', destino.name, im.size)


if __name__ == '__main__':
    main()
