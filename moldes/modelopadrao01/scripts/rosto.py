"""Rastreia o rosto na fala (YuNet, o mesmo modelo do enquadrar.py da Máquina) e grava o enquadramento:
por bloco (ver scripts/gerar_tempos.py), a mediana do centro dos olhos, da largura do rosto e do queixo.
Câmera de operador: o enquadramento é fixo dentro do trecho e só muda no corte (não fica nadando).
grava em src/rosto_med.json.
uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/rosto.py [--saida arquivo.json]
"""
import json, subprocess, sys
from pathlib import Path

import cv2
import numpy as np

AQUI = Path(__file__).resolve().parent.parent
MODELO = AQUI.parents[1] / 'tools' / 'modelos' / 'face_detection_yunet_2023mar.onnx'  # <estúdio>/tools/modelos
W, H, PASSO = 360, 640, 5  # detecta em 1/3 da resolução, 6 amostras por segundo
T = json.loads((AQUI / 'src' / 'tempos.json').read_text(encoding='utf-8'))

cano = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', str(AQUI / 'public' / 'fala.mp4'),
                         '-vf', f'fps=30,scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'],
                        stdout=subprocess.PIPE)
det = cv2.FaceDetectorYN.create(str(MODELO), '', (W, H), 0.6, 0.3, 50)
amostras, f = [], 0
while True:
    buf = cano.stdout.read(W * H * 3)
    if len(buf) < W * H * 3:
        break
    if f % PASSO == 0:
        q = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
        _, faces = det.detect(q)
        if faces is not None and len(faces):
            x, y, w, h, ex1, ey1, ex2, ey2 = faces[np.argmax(faces[:, 2])][:8]
            k = 1080 / W
            amostras.append(dict(t=f / 30, cx=float((ex1 + ex2) / 2 * k), olhos=float((ey1 + ey2) / 2 * k),
                                 largura=float(w * k), queixo=float((y + h) * k)))
    f += 1

cortes = T['blocos'] + [T['duracao']]
trechos = []
for a, b in zip(cortes, cortes[1:]):
    s = [x for x in amostras if a <= x['t'] < b]
    med = {k: round(float(np.median([x[k] for x in s])), 1) for k in ('cx', 'olhos', 'largura', 'queixo')} if s else None
    trechos.append(dict(de=a, ate=b, amostras=len(s), **(med or {})))
saida = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'src' / 'rosto_med.json'
saida.write_text(json.dumps(dict(trechos=trechos), indent=1), encoding='utf-8')
for t in trechos:
    print(t)
