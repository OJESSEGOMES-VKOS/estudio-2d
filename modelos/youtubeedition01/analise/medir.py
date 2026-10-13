"""Mede um vídeo longo de YouTube de ponta a ponta.
uso: python medir.py <video.mp4> <prefixo> [passo=3] [limiar=0.30]
saídas:
  <prefixo>_cortes.txt    todos os cortes secos + ritmo por minuto
  <prefixo>_tl_NN.png     linha do tempo: 1 quadro a cada <passo> s, 20 por folha (5x4), hora marcada
  <prefixo>_rosto.txt     por quadro da linha do tempo: tem rosto grande (A-roll) ou não, e % do tamanho do rosto
  <prefixo>_roteiro.txt   roteiro com tempo, limpo da legenda (.en-orig.vtt ou .en.vtt ao lado), se houver
"""
import re, subprocess, sys
from pathlib import Path
from statistics import median
import cv2
from PIL import Image, ImageDraw, ImageFont

video, pref = Path(sys.argv[1]), sys.argv[2]
passo = float(sys.argv[3]) if len(sys.argv) > 3 else 3.0
lim = float(sys.argv[4]) if len(sys.argv) > 4 else 0.30
tmp = Path(pref + '_q')
tmp.mkdir(exist_ok=True)

dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(video)],
                           capture_output=True, text=True).stdout)

# 1. cortes secos (um passe só, em 360p pra ir rápido); reaproveita se já mediu
if Path(f'{pref}_cortes.txt').exists():
    log = ''.join(f"pts_time:{int(l.split()[1][:2]) * 60 + float(l.split()[1][3:])} " for l in open(f'{pref}_cortes.txt', encoding='utf-8').readlines()[2:] if not l.startswith('0000'))
else:
    log = subprocess.run(['ffmpeg', '-hide_banner', '-threads', '2', '-i', str(video), '-vf', f"scale=-2:360,select='gt(scene,{lim})',showinfo",
                      '-an', '-f', 'null', '-'], capture_output=True, text=True).stderr
cortes = [0.0] + [float(m) for m in re.findall(r'pts_time:([\d.]+)', log)] + [dur]
cenas = [(a, b) for a, b in zip(cortes, cortes[1:]) if b - a > 0.08]
dd = [b - a for a, b in cenas]
with open(f'{pref}_cortes.txt', 'w', encoding='utf-8') as f:
    f.write(f'duracao {dur:.1f}s | cenas {len(cenas)} | media {dur / len(cenas):.2f}s | mediana {median(dd):.2f}s | '
            f'<1s {sum(d < 1 for d in dd)} | >6s {sum(d > 6 for d in dd)} | >15s {sum(d > 15 for d in dd)}\n')
    f.write('cortes por minuto: ' + ' '.join(str(sum(m * 60 <= a < (m + 1) * 60 for a, _ in cenas)) for m in range(int(dur // 60) + 1)) + '\n')
    for i, (a, b) in enumerate(cenas):
        f.write(f'{i:04d} {int(a // 60):02d}:{a % 60:05.2f} {b - a:6.2f}\n')

# 2. quadros da linha do tempo (um passe só: fps=1/passo)
if len(list(tmp.glob('*.jpg'))) < int(dur / passo) - 1:
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-threads', '2', '-i', str(video), '-vf', f'fps=1/{passo},scale=-2:216', '-q:v', '3',
                    str(tmp / '%05d.jpg')], check=True)
quadros = sorted(tmp.glob('*.jpg'))

# 3. rosto (A-roll): YuNet (tools/modelos do estúdio); rosto com altura > 12% do quadro = pessoa falando pra câmera
YUNET = Path(__file__).resolve().parents[3] / 'tools/modelos/face_detection_yunet_2023mar.onnx'
rostos, det = [], None
for q in quadros:
    im = cv2.imread(str(q))
    if det is None:
        det = cv2.FaceDetectorYN.create(str(YUNET), '', (im.shape[1], im.shape[0]), 0.7)
    det.setInputSize((im.shape[1], im.shape[0]))
    _, fs = det.detect(im)
    h = max((float(r[3]) for r in fs), default=0) / im.shape[0] if fs is not None else 0
    rostos.append(h)
with open(f'{pref}_rosto.txt', 'w', encoding='utf-8') as f:
    grande = sum(h > 0.12 for h in rostos)
    f.write(f'quadros {len(rostos)} | com rosto grande (>12% da altura) {grande} ({100 * grande / max(1, len(rostos)):.0f}%) | '
            f'rosto pequeno {sum(0 < h <= 0.12 for h in rostos)} | sem rosto {sum(h == 0 for h in rostos)}\n')
    for i, h in enumerate(rostos):
        t = i * passo + passo / 2  # o filtro fps pega o quadro do meio do intervalo (conferido no ref2: a folha antiga ficava 1,5 s adiantada)
        f.write(f'{int(t // 60):02d}:{t % 60:04.1f} {h:.2f}\n')

# 4. folhas
fonte = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 18)
ims = []
for i, q in enumerate(quadros):
    im = Image.open(q).convert('RGB')
    if im.width != 384:
        im = im.resize((384, 216))
    d = ImageDraw.Draw(im)
    t = i * passo + passo / 2  # o filtro fps pega o quadro do meio do intervalo (conferido no ref2: a folha antiga ficava 1,5 s adiantada)
    d.rectangle([0, 0, 74, 22], fill='black')
    d.text((4, 1), f'{int(t // 60):02d}:{int(t % 60):02d}', font=fonte, fill='yellow')
    ims.append(im)
col, lin = 5, 4
for p in range(0, len(ims), col * lin):
    folha = Image.new('RGB', (col * 384, lin * 216), 'black')
    for j, im in enumerate(ims[p:p + col * lin]):
        folha.paste(im, ((j % col) * 384, (j // col) * 216))
    folha.save(f'{pref}_tl_{p // (col * lin) + 1:02d}.png')

# 5. roteiro limpo
vtt = next((v for v in [video.with_suffix('.en-orig.vtt'), video.with_suffix('.en.vtt'), video.with_suffix('.en-US.vtt')] if v.exists()), None)
if vtt:
    linhas, ult = [], ''
    for bloco in vtt.read_text(encoding='utf-8').split('\n\n'):
        m = re.search(r'(\d+):(\d+):([\d.]+) -->', bloco)
        if not m:
            continue
        t = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])
        txt = [re.sub(r'<[^>]+>', '', l).strip() for l in bloco.split('\n')[1:] if '-->' not in l]
        txt = [l for l in txt if l]
        if not txt or txt[-1] == ult:
            continue
        ult = txt[-1]
        linhas.append(f'[{int(t // 60):02d}:{t % 60:04.1f}] {ult}')
    Path(f'{pref}_roteiro.txt').write_text('\n'.join(linhas), encoding='utf-8')
for q in quadros:
    q.unlink()
tmp.rmdir()
print(open(f'{pref}_cortes.txt', encoding='utf-8').readline().strip())
print(open(f'{pref}_rosto.txt', encoding='utf-8').readline().strip())
