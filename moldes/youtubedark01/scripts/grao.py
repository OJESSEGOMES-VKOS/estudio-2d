"""Grão de filme do youtubedark01: grava public/grao/g0.png a g7.png (540x960, ruído cinza escuro, um por quadro em
ciclo), no mesmo jeito das texturas do curta aprovado (média ~7, 30% preto). Sem os arquivos o vídeo sai sem grão.
uso: ../../.venv/Scripts/python.exe scripts/grao.py
"""
from pathlib import Path

import numpy as np
from PIL import Image

PASTA = Path(__file__).resolve().parent.parent / 'public' / 'grao'
PASTA.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(8)
for k in range(8):
    g = np.clip(rng.normal(6, 10, (960, 540)), 0, 255).astype(np.uint8)
    Image.fromarray(np.dstack([g, g, g])).save(PASTA / f'g{k}.png')
print('pronto:', PASTA, '(8 texturas)')
