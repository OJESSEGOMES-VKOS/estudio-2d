"""Grade do superpodcast01 (MODELO.md §3 "Rosto" e §11 "Correção de cor"): fundo cinza-azulado escuro de estúdio
(`estudio` #131A1E), fria e neutra, pretos fundos, nada de âmbar, luz lateral dura.
Encanamento copiado do storypodcast01 da vitrine: a parede bege é mais clara que a pele, então a pessoa é recortada com
o Robust Video Matting (../../tools/modelos/rvm_mobilenetv3_fp32.onnx), o fundo vira o
`estudio` desfocado e a pessoa ganha contraste, cor esfriada e uma queda de luz forte para o lado direito.
Sai public/fala_grade.mp4 (sem som).

uso (de dentro do molde/vídeo): ../../.venv/Scripts/python.exe scripts/grade.py           (vídeo inteiro)
                                ../../.venv/Scripts/python.exe scripts/grade.py 1 13 22   (só PNGs de teste em conferencia/)
"""
import json
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

AQUI = Path(__file__).resolve().parent.parent
MOD = AQUI.parents[1] / 'tools' / 'modelos'  # raiz do estúdio/tools/modelos
W, H, FPS = 1080, 1920, 30
ENT = AQUI / 'public' / 'fala.mp4'
SAI = AQUI / 'public' / 'fala_grade.mp4'
ROSTO = json.loads((AQUI / 'src' / 'rosto.json').read_text(encoding='utf-8'))

ESTUDIO = np.array([19, 26, 30], np.float32) / 255  # #131A1E
# só os provedores que este onnxruntime tem; sem placa NVIDIA (ou sem o CUDA/cuDNN instalado) roda na CPU, sem o aviso
# longo do onnxruntime (falha de verdade continua parando o script)
ort.set_default_logger_severity(4)
sess = ort.InferenceSession(str(MOD / 'rvm_mobilenetv3_fp32.onnx'), providers=[p for p in ('CUDAExecutionProvider', 'CPUExecutionProvider') if p in ort.get_available_providers()])
print('recorte da pessoa na', 'placa de vídeo (CUDA)' if 'CUDAExecutionProvider' in sess.get_providers() else 'CPU (leva alguns minutos)', flush=True)
RATIO = np.array([0.25], np.float32)

yy = (np.arange(H, dtype=np.float32) / H)[:, None]
xx = (np.arange(W, dtype=np.float32) / W)[None, :]
# fundo: topo quase preto (como nas refs), meio com o painel
VERT = np.clip(0.35 + 0.65 * np.clip((yy - 0.02) / 0.35, 0, 1), 0, 1) * np.clip(1.15 - 0.45 * np.clip((yy - 0.55) / 0.45, 0, 1), 0, 1)
# parede lisa de estúdio: mancha de luz atrás da cabeça, do lado da luz (as refs: fundo liso, luz lateral)
PAINEL = 1 + 0.35 * np.exp(-(((xx - 0.30) / 0.35) ** 2 + ((yy - 0.30) / 0.30) ** 2))


def rosto_em(t):
    k = min(range(len(ROSTO)), key=lambda i: abs(ROSTO[i][0] - t))
    return ROSTO[k][1], ROSTO[k][2], ROSTO[k][3]


def smooth(a, b, x):
    u = np.clip((x - a) / (b - a), 0, 1)
    return u * u * (3 - 2 * u)


def grade(rgb, fgr, a, t):
    src = rgb.astype(np.float32) / 255
    cx, cy, h = rosto_em(t)
    # ---- fundo: luminância da parede, bem desfocada, vira variação de painel em petróleo
    y = src @ np.array([0.299, 0.587, 0.114], np.float32)
    small = cv2.resize(y, (W // 8, H // 8), interpolation=cv2.INTER_AREA)
    small = cv2.GaussianBlur(small, (0, 0), 6)
    yb = cv2.resize(small, (W, H), interpolation=cv2.INTER_LINEAR)
    norm = np.clip((yb - 0.35) / 0.5, 0, 1)
    fundo = ESTUDIO[None, None, :] * (0.85 + 0.5 * norm)[..., None] * (VERT * PAINEL)[..., None]
    # ---- pessoa: exposição, pretos fundos, cor esfriada e contida (nada de âmbar), luz lateral dura
    p = fgr * 0.86
    p = np.clip((p - 0.035) / 0.965, 0, 1) ** 1.18
    yp = p @ np.array([0.299, 0.587, 0.114], np.float32)
    gris = yp[..., None]
    p = gris + (p - gris) * 0.72  # tira o calor da pele e da parede refletida
    p = p * np.array([0.97, 1.0, 1.04], np.float32)  # esfria
    sh = (1 - np.clip(yp / 0.35, 0, 1))[..., None] ** 2
    p = p * (1 - 0.3 * sh)
    lado = 1 - 0.45 * smooth(cx - 0.06, cx + 0.30, xx)  # luz dura do lado esquerdo do quadro, o lado direito cai
    p = p * lado[..., None]
    a3 = a[..., None]
    out = p * a3 + fundo * (1 - a3)
    return (np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)


def main():
    testes = [float(x) for x in sys.argv[1:]]
    rec = [np.zeros((1, 1, 1, 1), np.float32)] * 4
    le = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', str(ENT), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    es = None
    if not testes:
        es = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                               '-c:v', 'libx264', '-preset', 'slow', '-crf', '13', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(SAI)], stdin=subprocess.PIPE)
    f = 0
    alvo = {round(t * FPS) for t in testes}
    while True:
        buf = le.stdout.read(W * H * 3)
        if len(buf) < W * H * 3:
            break
        rgb = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
        src = (rgb.astype(np.float32) / 255).transpose(2, 0, 1)[None]
        fgr, pha, *rec = sess.run(None, {'src': src, 'r1i': rec[0], 'r2i': rec[1], 'r3i': rec[2], 'r4i': rec[3], 'downsample_ratio': RATIO})
        if es or f in alvo:
            out = grade(rgb, fgr[0].transpose(1, 2, 0), pha[0, 0], f / FPS)
            if es:
                es.stdin.write(out.tobytes())
            else:
                (AQUI / 'conferencia').mkdir(exist_ok=True)
                cv2.imwrite(str(AQUI / 'conferencia' / f'grade_{f / FPS:.2f}.png'), cv2.cvtColor(out, cv2.COLOR_RGB2BGR))
                if f >= max(alvo):
                    break
        f += 1
        if f % 150 == 0:
            print(f, 'quadros', flush=True)
    le.kill() if testes else le.wait()
    if es:
        es.stdin.close()
        es.wait()
    print(f, 'quadros', SAI if es else 'testes')


main()
