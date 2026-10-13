"""modelodinamico01: rastreia o rosto em public/fala.mp4 (YuNet) e grava a mediana do centro dos olhos, da largura do
rosto e do queixo em src/rosto_med.json (o enquadramento dos cards de rosto sai daqui), com a marca da fala de
src/palavras.json (o molde confere ao carregar). Rodar de novo a cada gravação nova.
uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/rosto.py [--saida arquivo.json]
"""
import json, subprocess, sys
from pathlib import Path

import cv2
import numpy as np

AQUI = Path(__file__).resolve().parent.parent
MODELO = AQUI.parents[1] / 'tools' / 'modelos' / 'face_detection_yunet_2023mar.onnx'  # <estúdio>/tools/modelos
W, H, PASSO = 360, 640, 6

cano = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', str(AQUI / 'public' / 'fala.mp4'),
                         '-vf', f'fps=30,scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
det = cv2.FaceDetectorYN.create(str(MODELO), '', (W, H), 0.6, 0.3, 50)
am, f = [], 0
while True:
    buf = cano.stdout.read(W * H * 3)
    if len(buf) < W * H * 3:
        break
    if f % PASSO == 0:
        _, faces = det.detect(np.frombuffer(buf, np.uint8).reshape(H, W, 3))
        if faces is not None and len(faces):
            x, y, w, h, ex1, ey1, ex2, ey2 = faces[np.argmax(faces[:, 2])][:8]
            k = 1080 / W
            am.append(((ex1 + ex2) / 2 * k, (ey1 + ey2) / 2 * k, w * k, (y + h) * k))
    f += 1
if not am:
    sys.exit('nenhum rosto achado em public/fala.mp4: este molde precisa da pessoa na gravação.')
a = np.array(am)
r = dict(zip(('cx', 'olhos', 'largura', 'queixo'), [round(float(v), 1) for v in np.median(a, 0)]))
r['amostras'] = len(am)
r['quadros'] = f  # quadros de public/fala.mp4 (o vídeo segura o penúltimo no fim, src/ui.tsx)
# de qual fala é este rosto (src/tema.ts confere ao carregar: gravação nova pede rodar este script de novo)
_pal = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
r['fala'] = {'palavras': len(_pal), 'fim': _pal[-1]['end'] if _pal else 0}
saida = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'src' / 'rosto_med.json'
saida.write_text(json.dumps(r, indent=1), encoding='utf-8')
print(r, 'p10/p90 olhos', np.percentile(a[:, 1], [10, 90]).round(), 'cx', np.percentile(a[:, 0], [10, 90]).round())
