"""Prepara a base de um vídeo para qualquer molde: o mesmo passo que a vitrine fez à mão.

uso (venv do estúdio):
  .venv/Scripts/python.exe tools/preparar.py <gravacao.mp4> videos/<AAAA-MM-DD-tema> [--idioma pt] [--trocar Cloud=Claude ...] [--sem-voz]
saída em videos/<...>/base/:
  fala.mp4       vídeo com a rotação aplicada, 30 qps, H.264 (o que o Remotion lê)
  voz.wav        voz limpa (passa-alta, redução de ruído, compressor, limitador), 48 kHz estéreo
  palavras.json  [{text,start,end}] (Whisper large-v3 + align.py), com "%" colado no número e as trocas pedidas
  rosto.json     [[t, cx, cy, h]] a cada 0,25 s, em fração do quadro (YuNet); vazio se não houver rosto
Tudo temporário fica em <estúdio>/.tmp.
"""
import argparse, json, os, subprocess, sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parent
TMP = RAIZ / '.tmp'
TMP.mkdir(exist_ok=True)
os.environ['TEMP'] = os.environ['TMP'] = str(TMP)

ap = argparse.ArgumentParser()
ap.add_argument('entrada')
ap.add_argument('pasta')
ap.add_argument('--idioma', default='pt')
ap.add_argument('--trocar', nargs='*', default=[], help='palavra=certa, ex.: Cloud=Claude')
ap.add_argument('--sem-voz', action='store_true', help='vídeo sem fala (pula transcrição)')
a = ap.parse_args()

base = Path(a.pasta).resolve() / 'base'
base.mkdir(parents=True, exist_ok=True)
ff = ['ffmpeg', '-loglevel', 'error', '-y']

print('1/4 vídeo')
subprocess.run(ff + ['-i', a.entrada, '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '30',
                     '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', str(base / 'fala.mp4')], check=True)

print('2/4 voz')
subprocess.run(ff + ['-i', str(base / 'fala.mp4'), '-vn', '-af',
                     'highpass=f=70,afftdn=nr=10:nf=-40,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=120:makeup=2,alimiter=limit=0.95',
                     '-ar', '48000', '-ac', '2', str(base / 'voz.wav')], check=True)

if not a.sem_voz:
    print('3/4 palavras (Whisper large-v3 + alinhamento)')
    w = TMP / f'whisper-{base.parent.name}'
    subprocess.run([sys.executable, str(AQUI / 'transcribe.py'), str(base / 'fala.mp4'), str(w), '--model', 'large-v3',
                    '--language', a.idioma], check=True)
    subprocess.run([sys.executable, str(AQUI / 'align.py'), str(base / 'fala.mp4'), str(w / 'transcript.json')], check=True)
    trocas = dict(t.split('=', 1) for t in a.trocar)
    out = []
    for x in json.loads((w / 'transcript.json').read_text(encoding='utf-8'))['words']:
        p = dict(text=x['text'].strip(), start=round(x['start'], 3), end=round(x['end'], 3))
        if p['text'] == '%' and out:
            out[-1]['text'] += '%'; out[-1]['end'] = p['end']; continue
        for errado, certo in trocas.items():
            p['text'] = p['text'].replace(errado, certo)
        out.append(p)
    (base / 'palavras.json').write_text(json.dumps(out, ensure_ascii=False, indent=0), encoding='utf-8')
    print('   ', len(out), 'palavras:', ' '.join(x['text'] for x in out)[:300])

print('4/4 rosto')
import cv2, numpy as np
info = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0',
                       str(base / 'fala.mp4')], capture_output=True, text=True).stdout.strip().split(',')
W0, H0 = int(info[0]), int(info[1])
W, H = (360, 640) if H0 > W0 else (640, 360)
raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', str(base / 'fala.mp4'), '-vf', f'fps=4,scale={W}:{H}', '-f', 'rawvideo',
                      '-pix_fmt', 'bgr24', '-'], capture_output=True).stdout
qs = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
det = cv2.FaceDetectorYN.create(str(AQUI / 'modelos/face_detection_yunet_2023mar.onnx'), '', (W, H), 0.6)
rost, ult, achou = [], None, 0
for i, q in enumerate(qs):
    _, f = det.detect(np.ascontiguousarray(q))
    if f is not None and len(f):
        x, y, w_, h = map(float, max(f, key=lambda r: r[2] * r[3])[:4])
        ult = [round((x + w_ / 2) / W, 4), round((y + h / 2) / H, 4), round(h / H, 4)]; achou += 1
    rost.append([round(i / 4, 2)] + (ult or [0.5, 0.3, 0.0]))
(base / 'rosto.json').write_text(json.dumps(rost if achou else []), encoding='utf-8')
print(f'    rosto em {achou}/{len(qs)} amostras; {W0}x{H0}')
print('pronto:', base)
