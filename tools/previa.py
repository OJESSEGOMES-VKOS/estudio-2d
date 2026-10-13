"""Faz uma prévia acelerada (o clipe que alguns moldes mostram em cima, com `previas: true`).

uso (da raiz do estúdio, venv do estúdio):
  .venv/Scripts/python.exe tools/previa.py <video.mp4> <pasta-do-video-novo> <1|2> [--de 0] [--ate 18.5] [--vel 3]
faz: pega o trecho [de, ate] de um vídeo SEU já pronto (de outro modelo, por exemplo), acelera `vel` vezes, tira o som e
grava `public/previa<n>.mp4` na pasta do vídeo novo, no formato que os moldes esperam (540x960, 30 q/s, ~6 s).
Nunca use vídeo de terceiro como prévia.
"""
import argparse, shutil, subprocess, sys
sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')  # acentos no terminal do Windows
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument('video')
ap.add_argument('pasta')
ap.add_argument('n', choices=['1', '2'])
ap.add_argument('--de', type=float, default=0.0)
ap.add_argument('--ate', type=float, default=None, help='fim do trecho em segundos (padrão: de + 6 x vel)')
ap.add_argument('--vel', type=float, default=3.0)
a = ap.parse_args()

if not shutil.which('ffmpeg'):
    sys.exit('Falta o ffmpeg no PATH.')
origem = Path(a.video)
if not origem.is_file():
    sys.exit(f'não achei o vídeo {origem}')
publico = Path(a.pasta) / 'public'
if not publico.is_dir():
    sys.exit(f'{publico} não existe: a pasta tem de ser a de um vídeo criado pelo novo-video.py')
ate = a.ate if a.ate is not None else a.de + 6 * a.vel
if ate <= a.de:
    sys.exit('--ate tem de ser maior que --de')

saida = publico / f'previa{a.n}.mp4'
filtro = (f'setpts=PTS/{a.vel},fps=30,'
          'scale=540:960:force_original_aspect_ratio=increase,crop=540:960,setsar=1')
cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', f'{a.de}', '-to', f'{ate}', '-i', str(origem), '-an', '-vf', filtro,
       '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(saida)]
subprocess.run(cmd, check=True)
print(f'pronto: {saida} ({(ate - a.de) / a.vel:.1f} s)')
