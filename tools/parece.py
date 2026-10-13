"""Parece o modelo? Confere um vídeo pronto contra a assinatura do modelo (modelos/<m>/assinatura.json) e monta o lado a
lado com o vídeo aprovado. Obrigatório antes de chamar um vídeo de pronto: reprovou, o vídeo não sai.

uso (da raiz do estúdio):  .venv/Scripts/python.exe tools/parece.py <video.mp4> <modelo> [--folha saida.jpg]
faz:  mede luz, cor, enquadramento do rosto e ritmo do vídeo e compara com o aprovado, item a item, dizendo o que mexer;
      grava a folha (padrão: ao lado do vídeo, <nome>-parece.jpg): em cima o aprovado, embaixo o seu, no 1º segundo
      e em 6 momentos do vídeo (no estúdio aberto, o aprovado vem da modelos/<m>/referencia.jpg).
sai com código 1 se algum item estiver fora da faixa. Passar aqui é o mínimo: olhe a folha.
"""
import argparse, json, os, subprocess, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')  # acentos no terminal do Windows
os.environ.setdefault('OPENCV_LOG_LEVEL', 'ERROR')
sys.path.insert(0, str(Path(__file__).resolve().parent))
from assinatura import RAIZ, aprovado, medir_video  # noqa: E402

# faixa aceita de cada item: (diferença máxima, é relativa?, o que mexer quando sai)
# só avisam: a saturação depende da roupa e do cenário; o ritmo por minuto oscila muito em vídeo curto (2 cortes em
# 15 s viram 8/min) e o detector não vê corte de zoom no mesmo plano
SO_AVISA = {'saturacao', 'cortes_min'}
FAIXA = {
    'brilho': (14, False, 'a luz do vídeo está diferente da do modelo: confira o tratamento de cor do modelo (está ligado?) e a adaptação da gravação (tools/adaptar.py)'),
    'contraste': (0.18, True, 'o contraste está diferente do modelo: confira o tratamento de cor do modelo'),
    'saturacao': (0.30, True, 'a saturação está diferente do modelo: se não vem da roupa ou do cenário, confira o tratamento de cor'),
    'temperatura': (3.5, False, 'a temperatura de cor (quente/frio) está diferente do modelo: confira o tratamento de cor do modelo'),
    'rosto_aberto': (0.18, True, 'o rosto no plano aberto tem outro tamanho que no modelo: confira a adaptação da gravação e os zooms do plano'),
    'rosto_fechado': (0.18, True, 'o rosto no plano fechado tem outro tamanho que no modelo: confira os zooms do plano'),
    'rosto_cy': (0.05, False, 'o rosto está em outra altura que no modelo: confira a adaptação da gravação e o ajuste de câmera'),
    'cabeca_cortada': (0.12, False, 'a cabeça sai do quadro mais vezes que no modelo: a câmera está subindo ou aproximando demais'),
    'cortes_min': (0.5, True, 'o ritmo de troca de imagem está diferente do modelo: confira os cortes e transições do plano'),
}


def comparar(novo: dict, ref: dict) -> list[tuple[str, float, float, bool, str]]:
    linhas = []
    for k, (lim, rel, dica) in FAIXA.items():
        if k not in ref or k not in novo:
            continue
        a, b = ref[k], novo[k]
        if k == 'cabeca_cortada':
            fora = b - a > lim  # só conta cortar MAIS que o modelo
        elif rel:
            fora = abs(b - a) > lim * max(abs(a), 1e-6)
        else:
            fora = abs(b - a) > lim
        linhas.append((k, a, b, fora, dica))
    return linhas


def folha(video: Path, m: str, saida: Path) -> None:
    """Duas faixas de 7 quadros: 0,5 s e 6 momentos espalhados; em cima o aprovado (ou a referencia.jpg), embaixo o novo."""
    def faixa(v: Path, alvo: Path, grade: str = '7x1'):
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(v)],
                                   capture_output=True, text=True).stdout.strip() or 1)
        n = int(grade[0]) * int(grade[2])
        ts = [0.5] + [dur * (i + 1) / n for i in range(n - 1)]
        sel = '+'.join(f'between(t,{t:.3f},{t + 0.04:.3f})' for t in ts)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(v), '-vf', f"select='{sel}',scale=240:-2,tile={grade}:padding=4",
                        '-frames:v', '1', '-vsync', 'vfr', str(alvo)], check=True)
    tmp = saida.with_suffix('.novo.jpg')
    ap = aprovado(m)
    # no estúdio aberto o aprovado não vem: a referência é a referencia.jpg (8 quadros em 4x2), e o novo sai igual
    faixa(video, tmp, '7x1' if ap else '4x2')
    ref = saida.with_suffix('.ref.jpg')
    if ap:
        faixa(ap, ref)
    else:
        ref = RAIZ / 'modelos' / m / 'referencia.jpg'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(ref), '-i', str(tmp), '-filter_complex',
                    '[0:v]scale=1708:-2[a];[1:v]scale=1708:-2[b];[a][b]vstack', str(saida)], check=True)
    tmp.unlink(missing_ok=True)
    if ap:
        ref.unlink(missing_ok=True)


def main() -> int:
    ap = argparse.ArgumentParser(description='Confere se o vídeo parece o modelo.')
    ap.add_argument('video'); ap.add_argument('modelo'); ap.add_argument('--folha')
    a = ap.parse_args()
    sig_arq = RAIZ / 'modelos' / a.modelo / 'assinatura.json'
    if not sig_arq.exists():
        sys.exit(f'não achei {sig_arq}: rode tools/assinatura.py {a.modelo}')
    ref = json.loads(sig_arq.read_text(encoding='utf-8'))['saida']
    v = Path(a.video)
    novo = medir_video(v, fps=4, rosto='rosto_aberto' in ref)
    print(f'{v.name} contra o aprovado do {a.modelo} ({ref["video"]}):')
    fora = 0
    for k, x, y, f, dica in comparar(novo, ref):
        aviso = f and k in SO_AVISA
        fora += f and not aviso
        print(f"  {'AVISO' if aviso else 'FORA ' if f else 'ok   '} {k:15} modelo {x:>8} | seu {y:>8}" + (f'  -> {dica}' if f else ''))
    if 'rosto_aberto' in ref and 'rosto_aberto' not in novo:
        fora += 1
        print('  FORA rosto           o modelo mostra a pessoa e o detector não achou rosto em quadros suficientes do seu vídeo')
    saida = Path(a.folha) if a.folha else v.with_name(v.stem + '-parece.jpg')
    folha(v, a.modelo, saida)
    print(f'folha lado a lado: {saida}')
    print('REPROVADO: não parece o modelo' if fora else 'parece o modelo nos números; agora olhe a folha')
    return 1 if fora else 0


if __name__ == '__main__':
    sys.exit(main())
