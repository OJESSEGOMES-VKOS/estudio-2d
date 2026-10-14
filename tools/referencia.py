"""Referência própria do modelo: o vídeo aprovado dele (feito por nós, com a nossa gravação) em pacote leve, para o estúdio
aberto usar no lugar das referências de terceiros, que nunca vão.

uso (da raiz do estúdio):  .venv/Scripts/python.exe tools/referencia.py <modelo|todos>
grava modelos/<modelo>/referencia/:
  referencia.mp4  o vídeo aprovado em 540 px, 30 qps, com só a voz de quem fala (sem trilha nem efeitos, que podem ter
                  licença de terceiro). Quando a voz limpa não existe, sai mudo.
  mapa.json       o vídeo medido a cada 0,25 s: brilho, rosto (tamanho, lugar, cabeça cortada) e trocas de imagem,
                  mais a lista de cortes e o resumo (o mesmo da assinatura).
  folha.jpg       1 quadro por segundo, com o tempo em cima de cada um.
Rode de novo sempre que o vídeo aprovado de um modelo mudar (junto com tools/assinatura.py).
"""
import json, subprocess, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')  # acentos no terminal do Windows
sys.path.insert(0, str(Path(__file__).resolve().parent))
from assinatura import RAIZ, aprovado, enquadramento, luz_cor, medir_video, quadros, rostos  # noqa: E402
import numpy as np  # noqa: E402

FPS = 4


def pcm(arq: Path, ini: float = 0, seg: float = 40) -> np.ndarray:
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', str(ini), '-t', str(seg), '-i', str(arq), '-ac', '1', '-ar', '4000',
                          '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32)


def atraso_voz(video: Path, voz: Path) -> float | None:
    """Onde a voz limpa começa dentro do vídeo (s), pela correlação dos envelopes; None se não bate."""
    a, b = pcm(video), pcm(voz)
    if not len(a) or not len(b):
        return None
    env = lambda x: np.abs(x).reshape(-1, 40).mean(1) if len(x) >= 40 else np.abs(x)  # 100 por segundo
    ea, eb = env(a[: len(a) // 40 * 40]), env(b[: len(b) // 40 * 40])
    ea, eb = (ea - ea.mean()) / (ea.std() + 1e-6), (eb - eb.mean()) / (eb.std() + 1e-6)
    c = np.correlate(ea, eb[: min(len(eb), len(ea))], 'full')
    k = int(np.argmax(c)) - (min(len(eb), len(ea)) - 1)
    forca = c.max() / min(len(eb), len(ea))
    return round(k / 100, 2) if forca > 0.5 else None


def mapa(video: Path) -> dict:
    qs, (w, h) = quadros(video, FPS)
    g = [q.mean(2) for q in qs]
    dif = [0.0] + [float(np.abs(a - b).mean()) for a, b in zip(g, g[1:])]
    lim = max(18.0, float(np.median(dif)) * 4)
    rs = rostos(qs)
    linhas = []
    for i, q in enumerate(qs):
        r = rs[i] if rs[i] and rs[i][2] >= 0.12 else None
        linhas.append({'t': round(i / FPS, 2), 'brilho': luz_cor([q])['brilho'],
                       'rosto': None if not r else {'h': round(r[2], 3), 'cy': round(r[1], 3), 'cx': round(r[0], 3),
                                                    'cabeca_cortada': r[3] - 0.35 * r[2] < 0},
                       'troca': round(dif[i], 1)})
    resumo = medir_video(video, FPS, rosto=enquadramento(rs) is not None)
    return {'formato': f'{w}x{h}', 'passo_s': 1 / FPS, 'cortes_s': [l['t'] for l in linhas if l['troca'] > lim],
            'resumo': resumo, 'quadros': linhas}


def folha(video: Path, saida: Path, deitado: bool) -> None:
    """1 quadro por segundo em grade, com o segundo escrito em cima de cada um."""
    from PIL import Image, ImageDraw, ImageFont
    qs, _ = quadros(video, 1)
    W, H = (320, 180) if deitado else (180, 320)
    cols = 6 if deitado else 10
    lin = -(-len(qs) // cols)
    fonte = ImageFont.truetype('arialbd.ttf', 20) if Path('C:/Windows/Fonts/arialbd.ttf').exists() else ImageFont.load_default()
    img = Image.new('RGB', (cols * (W + 4) + 4, lin * (H + 4) + 4), (20, 20, 20))
    for i, q in enumerate(qs):
        f = Image.fromarray(q[..., ::-1]).resize((W, H))
        d = ImageDraw.Draw(f)
        d.rectangle((0, 0, 52, 26), fill=(0, 0, 0)); d.text((6, 3), f'{i} s', font=fonte, fill=(255, 255, 255))
        img.paste(f, (4 + (i % cols) * (W + 4), 4 + (i // cols) * (H + 4)))
    img.save(saida, quality=82)


def fazer(m: str) -> None:
    ap = aprovado(m)
    if not ap or ap.parent.name != 'exemplos':
        print(f'{m}: sem vídeo aprovado em modelos/{m}/exemplos/, pulei'); return
    pasta = RAIZ / 'modelos' / m / 'referencia'
    pasta.mkdir(exist_ok=True)
    mp4 = pasta / 'referencia.mp4'
    voz = RAIZ / 'moldes' / m / 'public' / 'voz.wav'
    atraso = atraso_voz(ap, voz) if voz.exists() else None
    w, h = map(int, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                                    '-of', 'csv=p=0', str(ap)], capture_output=True, text=True).stdout.strip().split(',')[:2])
    esc = 'scale=-2:540' if w > h else 'scale=540:-2'
    cmd = ['ffmpeg', '-v', 'error', '-y', '-i', str(ap)]
    if atraso is not None:
        cmd += ['-itsoffset', str(atraso), '-i', str(voz), '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '64k', '-ac', '1',
                '-shortest']
    else:
        cmd += ['-an']
    cmd += ['-vf', f'{esc},fps=30', '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart', str(mp4)]
    subprocess.run(cmd, check=True)
    folha(mp4, pasta / 'folha.jpg', w > h)
    mp = {'modelo': m, 'origem': 'vídeo aprovado do modelo, feito com a nossa gravação',
          'audio': 'só a voz' if atraso is not None else 'mudo', **mapa(mp4)}
    (pasta / 'mapa.json').write_text(json.dumps(mp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'{m}: {ap.name} -> referencia/ ({mp4.stat().st_size // 1024} KB, áudio: {mp["audio"]}, '
          f'{len(mp["cortes_s"])} cortes)')


if __name__ == '__main__':
    alvo = sys.argv[1] if len(sys.argv) > 1 else sys.exit(__doc__)
    ms = sorted(p.name for p in (RAIZ / 'modelos').iterdir() if p.is_dir() and not p.name.startswith('_')) if alvo == 'todos' else [alvo]
    for m in ms:
        fazer(m)
