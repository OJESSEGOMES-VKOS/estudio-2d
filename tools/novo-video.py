"""Começa um vídeo novo a partir de um molde, tudo dentro do estúdio.

uso (da raiz do estúdio, venv do estúdio):
  .venv/Scripts/python.exe tools/novo-video.py <modelo> <gravacao.mp4> <AAAA-MM-DD-tema> [--idioma pt] [--trocar Cloud=Claude] [--sem-voz]
faz:
  1. copia moldes/<modelo>/ para videos/<AAAA-MM-DD-tema>/ (código, scripts, fontes; sem a mídia do vídeo de origem)
  2. liga node_modules à raiz (junção)
  3. roda tools/preparar.py na gravação e põe a base onde o contrato manda
     (public/fala.mp4, public/voz.wav, src/palavras.json, src/rosto.json)
  4. adapta a gravação ao ponto de partida do modelo (tools/adaptar.py): rosto no tamanho e na altura, luz e cor de
     partida iguais às da gravação em que o modelo foi calibrado. --sem-adaptar pula (só para comparar).
Depois: refazer o plano sobre a fala nova seguindo modelos/<modelo>/MODELO.md e REGRAS.md, rodar o checador e renderizar.
"""
import argparse, shutil, subprocess, sys
sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')  # acentos no terminal do Windows
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parent
MIDIA_ORIGEM = {'fala.mp4', 'voz.wav', 'previa1.mp4', 'previa2.mp4', 'fala_grade.mp4'}

ap = argparse.ArgumentParser()
ap.add_argument('modelo')
ap.add_argument('gravacao')
ap.add_argument('nome')
ap.add_argument('--idioma', default='pt')
ap.add_argument('--trocar', nargs='*', default=[])
ap.add_argument('--sem-voz', action='store_true')
ap.add_argument('--sem-adaptar', action='store_true')
a = ap.parse_args()

molde = RAIZ / 'moldes' / a.modelo
if not molde.is_dir():
    sys.exit(f'não existe o molde {a.modelo}; veja moldes/')
destino = RAIZ / 'videos' / a.nome
if destino.exists():
    sys.exit(f'{destino} já existe')


def ignorar(pasta, nomes):
    p = Path(pasta)
    fora = {'node_modules', 'out', 'conferencia', '.tmp', 'trabalho'}
    return [n for n in nomes if n in fora or (p.name == 'public' and n in MIDIA_ORIGEM)]


print('1/4 copiando o molde', a.modelo)
shutil.copytree(molde, destino, ignore=ignorar)

print('2/4 node_modules')
alvo = RAIZ / 'node_modules'
if sys.platform == 'win32':
    subprocess.run(['cmd', '/c', 'mklink', '/J', str(destino / 'node_modules'), str(alvo)], check=True, capture_output=True)
else:
    (destino / 'node_modules').symlink_to(alvo, target_is_directory=True)

print('3/4 preparando a gravação')
cmd = [sys.executable, str(AQUI / 'preparar.py'), a.gravacao, str(destino), '--idioma', a.idioma]
if a.trocar:
    cmd += ['--trocar', *a.trocar]
if a.sem_voz:
    cmd.append('--sem-voz')
subprocess.run(cmd, check=True)
base = destino / 'base'
(destino / 'public').mkdir(exist_ok=True)
(destino / 'src').mkdir(exist_ok=True)
for nome, para in [('fala.mp4', 'public/fala.mp4'), ('voz.wav', 'public/voz.wav'),
                   ('palavras.json', 'src/palavras.json'), ('rosto.json', 'src/rosto.json')]:
    if (base / nome).exists():
        shutil.copy2(base / nome, destino / para)
if a.sem_adaptar:
    print('4/4 adaptação pulada (--sem-adaptar)')
else:
    print('4/4 adaptando a gravação ao modelo')
    subprocess.run([sys.executable, str(AQUI / 'adaptar.py'), str(destino), a.modelo], check=True)
print('pronto:', destino)
print('próximo passo: ler modelos/%s/MODELO.md e a seção "Vídeo novo" de %s, refazer o plano no código do vídeo '
      '(src/), conferir e renderizar.' % (a.modelo, destino / 'LEIA.md'))
