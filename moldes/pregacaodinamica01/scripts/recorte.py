"""Recorta a pessoa do vídeo (Robust Video Matting, onnx) e grava public/pessoa.webm com transparência,
pro letreiro gigante passar por trás dela e pro fundo poder ser tingido sem tingir a pessoa (pregacaodinamica01 §3.3, §3.10).
Modelo: <estúdio>/tools/modelos/rvm_mobilenetv3_fp32.onnx.
uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/recorte.py [--saida arquivo.webm] [--quadros N]
"""
import subprocess, sys
from pathlib import Path

import numpy as np
import onnxruntime as ort

AQUI = Path(__file__).resolve().parent.parent
MOD = AQUI.parents[1] / 'tools' / 'modelos'  # <estúdio>/tools/modelos
W, H = 1080, 1920
ent = AQUI / 'public' / 'fala.mp4'
sai = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'public' / 'pessoa.webm'
LIMITE = int(sys.argv[sys.argv.index('--quadros') + 1]) if '--quadros' in sys.argv else None  # só para teste

sess = ort.InferenceSession(str(MOD / 'rvm_mobilenetv3_fp32.onnx'), providers=['CUDAExecutionProvider', 'CPUExecutionProvider'])
rec = [np.zeros((1, 1, 1, 1), np.float32)] * 4
ratio = np.array([0.25], np.float32)

le = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', str(ent), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
es = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                       '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '6M', '-auto-alt-ref', '0', str(sai)], stdin=subprocess.PIPE)
f = 0
while True:
    buf = le.stdout.read(W * H * 3)
    if len(buf) < W * H * 3 or (LIMITE and f >= LIMITE):
        break
    rgb = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    src = (rgb.astype(np.float32) / 255).transpose(2, 0, 1)[None]
    fgr, pha, *rec = sess.run(None, {'src': src, 'r1i': rec[0], 'r2i': rec[1], 'r3i': rec[2], 'r4i': rec[3], 'downsample_ratio': ratio})
    a = (pha[0, 0] * 255).clip(0, 255).astype(np.uint8)
    es.stdin.write(np.dstack([rgb, a]).tobytes())
    if f % 150 == 0:
        print(f, flush=True)
    f += 1
le.kill()  # no teste com --quadros o leitor ainda tem quadros
es.stdin.close()
es.wait()
print(f, 'quadros ->', sai)
