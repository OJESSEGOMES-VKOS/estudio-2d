"""Faz os cards do superpodcast01 (a colagem, os celulares e os prints do papel) com o material do próprio usuário.

uso (da raiz do estúdio, venv do estúdio):
  .venv/Scripts/python.exe tools/cards.py videos/<AAAA-MM-DD-tema> [fonte@t1,t2 ...] [--fala N]
faz:
  - tira quadros 9:16 (432x768, jpg) de vídeos SEUS e grava em <pasta>/public/cards/<nome>_<t>.jpg;
  - grava <pasta>/src/cards.json, a lista que o molde lê: colagem (8 lugares), celulares (6, o 1º é o do meio) e
    prints (8). Com menos cards que lugares, eles se repetem; sem card nenhum, o molde desenha um quadro no lugar.
fontes:
  - sem fonte nenhuma: 3 quadros (20%, 50% e 80%) de cada vídeo pronto em videos/*/out/*.mp4 (menos os da própria pasta);
    se não houver vídeo pronto, 8 quadros espalhados da própria gravação (public/fala.mp4);
  - fonte@tempos: um vídeo seu e os segundos dos quadros (ex.: videos/2026-10-01-x/out/final.mp4@1.5,12,23);
  - --fala N: mais N quadros espalhados da própria gravação.
Nunca use vídeo de terceiro: os cards aparecem no vídeo como o seu trabalho.
"""
import argparse, json, shutil, subprocess, sys
sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')  # acentos no terminal do Windows
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
LUGARES = {'colagem': 8, 'celulares': 6, 'prints': 8}

ap = argparse.ArgumentParser()
ap.add_argument('pasta', help='a pasta do vídeo (videos/<AAAA-MM-DD-tema>)')
ap.add_argument('fontes', nargs='*', help='video.mp4@t1,t2,... (vídeos seus)')
ap.add_argument('--fala', type=int, default=0, help='mais N quadros da própria gravação (public/fala.mp4)')
a = ap.parse_args()

for prog in ('ffmpeg', 'ffprobe'):
    if not shutil.which(prog):
        sys.exit(f'Falta o {prog} no PATH.')
pasta = Path(a.pasta).resolve()
if not (pasta / 'public').is_dir() or not (pasta / 'src').is_dir():
    sys.exit(f'{pasta} não tem public/ e src/: a pasta tem de ser a de um vídeo criado pelo tools/novo-video.py')


def duracao(v: Path) -> float:
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(v)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        sys.exit(f'não consegui ler a duração de {v}')


def espalhados(v: Path, n: int) -> list[float]:
    d = duracao(v)
    return [round(d * (k + 1) / (n + 1), 2) for k in range(n)]


def nome_de(v: Path) -> str:
    if v.resolve() == (pasta / 'public' / 'fala.mp4').resolve():
        return 'fala'
    if v.parent.name == 'out':  # videos/<tema>/out/<arquivo>.mp4 -> <tema>, ou <tema>-<arquivo> se houver mais de um
        outros = list(v.parent.glob('*.mp4'))
        return v.parent.parent.name if len(outros) == 1 else f'{v.parent.parent.name}-{v.stem}'
    return v.stem


pedidos: list[tuple[Path, list[float]]] = []
for f in a.fontes:
    arq, _, ts = f.rpartition('@')
    if not arq:
        arq, ts = f, ''
    v = Path(arq)
    if not v.is_file():
        sys.exit(f'não achei o vídeo {v}')
    pedidos.append((v, [float(x) for x in ts.split(',') if x] or espalhados(v, 3)))
fala = pasta / 'public' / 'fala.mp4'
if a.fala:
    pedidos.append((fala, espalhados(fala, a.fala)))
if not pedidos:
    # um vídeo por pasta: o mais novo que não é o render sem som (so-video*), para não repetir o mesmo vídeo
    prontos = []
    for out in sorted((RAIZ / 'videos').glob('*/out')):
        if pasta in out.resolve().parents:
            continue
        mp4 = sorted((v for v in out.glob('*.mp4') if not v.stem.startswith('so-video')), key=lambda v: v.stat().st_mtime)
        if mp4:
            prontos.append(mp4[-1])
    pedidos = [(v, espalhados(v, 3)) for v in prontos] or [(fala, espalhados(fala, 8))]
    if not prontos:
        print('nenhum vídeo pronto em videos/*/out/: os cards saem da própria gravação')

destino = pasta / 'public' / 'cards'
if destino.exists():
    shutil.rmtree(destino)
destino.mkdir(parents=True)
nomes = []
for v, ts in pedidos:
    base = nome_de(v)
    for t in ts:
        nome = f'{base}_{t:g}'
        saida = destino / f'{nome}.jpg'
        filtro = 'scale=432:768:force_original_aspect_ratio=increase,crop=432:768,setsar=1'
        r = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t}', '-i', str(v), '-frames:v', '1', '-vf', filtro, '-q:v', '3', str(saida)], capture_output=True, text=True)
        if r.returncode or not saida.is_file():
            print(f'pulei {v.name} em {t} s (fora do vídeo?)')
            continue
        nomes.append(nome)
if not nomes:
    sys.exit('nenhum card saiu: confira os vídeos e os tempos')

# distribui: cada mundo começa de onde o anterior parou, para os cards variarem entre a colagem, os celulares e os prints
manifesto, k = {}, 0
for mundo, n in LUGARES.items():
    manifesto[mundo] = [nomes[(k + i) % len(nomes)] for i in range(n)]
    k += n
(pasta / 'src' / 'cards.json').write_text(json.dumps(manifesto, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(f'{len(nomes)} cards em {destino}; lista em {pasta / "src" / "cards.json"}')
