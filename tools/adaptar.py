"""Adapta a gravação nova ao ponto de partida do modelo, antes de qualquer edição.

O código de cada molde foi calibrado na gravação de onde o vídeo aprovado saiu: zooms, ponto da câmera, lugar do texto e
tratamento de cor contam com o rosto daquele tamanho, naquela altura, e com aquela luz. Uma gravação com o rosto mais
baixo ou mais clara sai com a cabeça cortada e a cor errada. Este passo leva a gravação nova até a `entrada` da
assinatura do modelo (modelos/<m>/assinatura.json): mesmo tamanho e lugar do rosto, mesma luz e cor de partida.

uso (da raiz do estúdio):  .venv/Scripts/python.exe tools/adaptar.py videos/<AAAA-MM-DD-tema> <modelo>
faz:  lê base/fala.mp4 e base/rosto.json (a preparação original, que nunca muda) e grava public/fala.mp4 e src/rosto.json
      adaptados, mais adaptacao.json com o que foi feito. O tools/novo-video.py já chama este passo.
Só aproxima e corta (nunca reduz a imagem, o que mostraria a borda); o rosto pode ficar um pouco maior que o do modelo.
"""
import json, os, subprocess, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')  # acentos no terminal do Windows
os.environ.setdefault('OPENCV_LOG_LEVEL', 'ERROR')
sys.path.insert(0, str(Path(__file__).resolve().parent))
import cv2, numpy as np  # noqa: E402
from assinatura import RAIZ, medir_video  # noqa: E402


def cor_lab(lab, p: dict):
    """A transformação de cor, em Lab float (L 0-100, a/b em torno de 0): brilho e contraste no L, tom e temperatura
    deslocando a e b, saturação escalando o croma."""
    L = (lab[..., 0] * 2.55 - p['centro']) * p['kL'] + p['centro'] + p['dL']
    return np.stack([np.clip(L / 2.55, 0, 100), (lab[..., 1] + p['da']) * p['kC'], (lab[..., 2] + p['db']) * p['kC']], -1)


def ajustar_cor(qs, src: dict, ref: dict) -> dict:
    """Acha os parâmetros que levam os quadros da gravação à luz de `ref` (brilho, contraste, temperatura e tom), medindo
    com a mesma régua da assinatura (luz_cor) e corrigindo em rodadas. A saturação não entra: ela depende da roupa e do
    cenário (camiseta azul contra preta), e corrigir por ela desbotaria a pele. O contraste fica entre 0,7 e 1,3."""
    from assinatura import luz_cor
    labs = [cv2.cvtColor(q.astype(np.float32) / 255, cv2.COLOR_BGR2LAB) for q in qs]
    p = {'centro': src['brilho'], 'dL': ref['brilho'] - src['brilho'], 'kL': 1.0, 'kC': 1.0,
         'da': ref['tom'] - src['tom'], 'db': ref['temperatura'] - src['temperatura']}
    for _ in range(6):
        m = luz_cor([(np.clip(cv2.cvtColor(cor_lab(l, p).astype(np.float32), cv2.COLOR_LAB2BGR), 0, 1) * 255).astype(np.uint8) for l in labs])
        p['dL'] += ref['brilho'] - m['brilho']
        p['kL'] = float(np.clip(p['kL'] * ref['contraste'] / max(m['contraste'], 1), 0.7, 1.3))
        p['da'] += ref['tom'] - m['tom']
        p['db'] += ref['temperatura'] - m['temperatura']
    p['medido'] = m
    return p


def lut_cor(p: dict, arq: Path, n: int = 33) -> None:
    """Grava a transformação `p` como LUT 3D (.cube) para o ffmpeg aplicar no vídeo inteiro."""
    g = np.linspace(0, 1, n, dtype=np.float32)
    b_, g_, r_ = np.meshgrid(g, g, g, indexing='ij')  # .cube: o R varia mais rápido
    rgb = np.stack([r_, g_, b_], -1).reshape(-1, 1, 3)
    out = cv2.cvtColor(cor_lab(cv2.cvtColor(rgb, cv2.COLOR_RGB2LAB), p).astype(np.float32), cv2.COLOR_LAB2RGB)
    out = np.clip(out.reshape(-1, 3), 0, 1)
    with open(arq, 'w', encoding='ascii') as f:
        f.write(f'LUT_3D_SIZE {n}\n')
        f.writelines(f'{x:.5f} {y:.5f} {z:.5f}\n' for x, y, z in out)


def enquadrar(rosto: list, ref: dict) -> tuple[float, float, float]:
    """Escala s e corte (ox, oy) que põem o rosto mediano no tamanho e no lugar do rosto da entrada do modelo."""
    ok = [r for r in rosto if r and len(r) >= 4 and r[3] > 0]
    h = float(np.median([r[3] for r in ok])); cy = float(np.median([r[2] for r in ok])); cx = float(np.median([r[1] for r in ok]))
    h_ref = (ref['rosto_aberto'] + ref['rosto_fechado']) / 2
    s = max(1.0, h_ref / h)
    # o corte em y tem de caber: 0 <= oy <= 1920(s-1); se não cabe, aproxima o mínimo que faz caber
    if cy > ref['rosto_cy']:
        s = max(s, (1 - ref['rosto_cy']) / (1 - cy))
    elif cy < ref['rosto_cy']:
        s = max(s, ref['rosto_cy'] / cy)
    oy = min(max(cy * 1920 * s - ref['rosto_cy'] * 1920, 0), 1920 * (s - 1))
    ox = min(max(cx * 1080 * s - ref['rosto_cx'] * 1080, 0), 1080 * (s - 1))
    return s, ox, oy


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    pasta, m = Path(sys.argv[1]), sys.argv[2]
    arq = RAIZ / 'modelos' / m / 'assinatura.json'
    if not arq.exists():
        sys.exit(f'adaptar: o modelo {m} ainda não tem assinatura; rode tools/assinatura.py {m} (no estúdio local)')
    sig = json.loads(arq.read_text(encoding='utf-8'))
    ref = sig.get('entrada')
    base = pasta / 'base'
    rosto = json.loads((base / 'rosto.json').read_text(encoding='utf-8')) if (base / 'rosto.json').exists() else []
    if not ref or not rosto:
        print('adaptar: o modelo não parte de uma gravação de pessoa (ou não há rosto): nada a adaptar'); return
    from assinatura import quadros, luz_cor
    qs, _ = quadros(base / 'fala.mp4', fps=2)
    src = luz_cor(qs)
    s, ox, oy = enquadrar(rosto, ref)
    tmp = RAIZ / '.tmp'; tmp.mkdir(exist_ok=True)
    lut = tmp / f'adaptar-{pasta.name}.cube'
    p = ajustar_cor(qs, src, ref)
    lut_cor(p, lut)
    cor = {'contraste_x': round(p['kL'], 3), 'saturacao_x': round(p['kC'], 3), 'brilho_de': src['brilho'], 'brilho_para': ref['brilho'],
           'temperatura_de': src['temperatura'], 'temperatura_para': ref['temperatura'], 'medido_nos_quadros': p['medido']}
    W, H = round(1080 * s / 2) * 2, round(1920 * s / 2) * 2
    vf = f"lut3d=file='{lut.as_posix().replace(':', chr(92) + ':')}',scale={W}:{H}:flags=lanczos,crop=1080:1920:{ox:.0f}:{oy:.0f},setsar=1"
    saida = pasta / 'public' / 'fala.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(base / 'fala.mp4'), '-vf', vf, '-c:v', 'libx264', '-crf', '16',
                    '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'copy', str(saida)], check=True)
    lut.unlink(missing_ok=True)
    novo = [[r[0], round((r[1] * 1080 * s - ox) / 1080, 4), round((r[2] * 1920 * s - oy) / 1920, 4), round(r[3] * s, 4)] if r and len(r) >= 4 else r
            for r in rosto]
    (pasta / 'src' / 'rosto.json').write_text(json.dumps(novo), encoding='utf-8')
    feito = {'modelo': m, 'escala': round(s, 4), 'corte_x': round(ox), 'corte_y': round(oy), **cor}
    (pasta / 'adaptacao.json').write_text(json.dumps(feito, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'adaptar: rosto {"aproximado %.1f%%" % ((s - 1) * 100) if s > 1.0005 else "no tamanho"} e posto na altura do modelo; '
          f'luz {src["brilho"]} -> {ref["brilho"]}, temperatura {src["temperatura"]} -> {ref["temperatura"]}, '
          f'contraste x{cor["contraste_x"]}, saturação x{cor["saturacao_x"]}')


if __name__ == '__main__':
    main()
