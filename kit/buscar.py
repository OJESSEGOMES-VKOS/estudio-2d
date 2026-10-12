"""Busca e baixa imagens com licença aberta (Wikimedia Commons e Openverse, sem chave) e anota a origem.
uso: .venv/Scripts/python buscar.py "<termo>" <pasta_saida> [--n 8] [--fonte commons|openverse|todas] [--min 800]
saídas: <pasta>/<termo>_NN.<ext>, <pasta>/ORIGEM.md (uma linha por arquivo) e <pasta>/<termo>_folha.jpg
pra escolher de olho. Arquivo já baixado não repete."""
import argparse, re, sys
from pathlib import Path
import requests
from PIL import Image, ImageDraw, ImageFont

UA = {'User-Agent': 'VKOS-estudio/1.0 (vkoshub@gmail.com) requests'}


def commons(termo, n, minimo):
    r = requests.get('https://commons.wikimedia.org/w/api.php', headers=UA, timeout=30, params={
        'action': 'query', 'format': 'json', 'generator': 'search', 'gsrnamespace': 6, 'gsrlimit': n * 3,
        'gsrsearch': f'{termo} filetype:bitmap', 'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata',
        'iiurlwidth': 2400})
    paginas = sorted(r.json().get('query', {}).get('pages', {}).values(), key=lambda p: p.get('index', 0))
    for p in paginas:
        ii = (p.get('imageinfo') or [{}])[0]
        if min(ii.get('width', 0), ii.get('height', 0)) < minimo:
            continue
        meta = ii.get('extmetadata', {})
        limpo = lambda k: re.sub(r'<[^>]+>', '', meta.get(k, {}).get('value', '')).strip()
        yield {'url': ii.get('thumburl') or ii['url'], 'pagina': ii.get('descriptionurl', ''),
               'autor': limpo('Artist') or '?', 'licenca': limpo('LicenseShortName') or '?', 'fonte': 'Wikimedia Commons'}


def openverse(termo, n, minimo):
    r = requests.get('https://api.openverse.org/v1/images/', headers=UA, timeout=30,
                     params={'q': termo, 'page_size': n * 3, 'license_type': 'commercial', 'mature': 'false'})
    for it in r.json().get('results', []):
        if min(it.get('width') or 0, it.get('height') or 0) < minimo:
            continue
        yield {'url': it['url'], 'pagina': it.get('foreign_landing_url', ''), 'autor': it.get('creator') or '?',
               'licenca': f"{it.get('license', '?').upper()} {it.get('license_version', '')}".strip(),
               'fonte': f"Openverse/{it.get('source', '?')}"}


def folha(arqs, destino):
    if not arqs:
        return
    fonte = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 18)
    ims = []
    for a in arqs:
        im = Image.open(a).convert('RGB')
        im.thumbnail((320, 320))
        cel = Image.new('RGB', (320, 340), 'black')
        cel.paste(im, ((320 - im.width) // 2, (320 - im.height) // 2))
        ImageDraw.Draw(cel).text((4, 318), a.name, font=fonte, fill='yellow')
        ims.append(cel)
    col = 4
    f = Image.new('RGB', (col * 320, -(-len(ims) // col) * 340), 'black')
    for i, im in enumerate(ims):
        f.paste(im, ((i % col) * 320, (i // col) * 340))
    f.save(destino, quality=85)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('termo')
    ap.add_argument('saida')
    ap.add_argument('--n', type=int, default=8)
    ap.add_argument('--fonte', default='todas', choices=['commons', 'openverse', 'todas'])
    ap.add_argument('--min', type=int, default=800, help='lado menor mínimo em px')
    a = ap.parse_args()
    pasta = Path(a.saida)
    pasta.mkdir(parents=True, exist_ok=True)
    base = re.sub(r'[^a-z0-9]+', '-', a.termo.lower()).strip('-')
    fontes = {'commons': [commons], 'openverse': [openverse], 'todas': [commons, openverse]}[a.fonte]
    origem = pasta / 'ORIGEM.md'
    if not origem.exists():
        origem.write_text('# Origem das imagens\n\n| Arquivo | Fonte | Autor | Licença | Página |\n|---|---|---|---|---|\n',
                          encoding='utf-8')
    feitos, k, vistos = [], 0, set()
    for fn in fontes:
        try:
            achados = list(fn(a.termo, a.n, a.min))
        except Exception as e:
            print(f'{fn.__name__}: falhou ({e})', file=sys.stderr)
            continue
        for it in achados[:a.n]:
            chave = re.sub(r'\W', '', Path(it['url'].split('?')[0]).name.lower())[-40:]
            if chave in vistos:  # a mesma foto vinda das duas fontes
                continue
            vistos.add(chave)
            k += 1
            ext = Path(it['url'].split('?')[0]).suffix.lower()
            ext = ext if ext in ('.jpg', '.jpeg', '.png', '.webp') else '.jpg'
            arq = pasta / f'{base}_{k:02d}{ext}'
            if not arq.exists():
                try:
                    r = requests.get(it['url'], headers=UA, timeout=60)
                    r.raise_for_status()
                    arq.write_bytes(r.content)
                    Image.open(arq).verify()
                except Exception as e:
                    print(f'pulei {it["url"]}: {e}', file=sys.stderr)
                    arq.unlink(missing_ok=True)
                    continue
                with origem.open('a', encoding='utf-8') as f:
                    autor = it['autor'].replace('|', '/').replace('\n', ' ')[:80]
                    f.write(f"| {arq.name} | {it['fonte']} | {autor} | {it['licenca']} | {it['pagina']} |\n")
            feitos.append(arq)
    folha(feitos, pasta / f'{base}_folha.jpg')
    print(len(feitos), 'imagens em', pasta)


if __name__ == '__main__':
    main()
