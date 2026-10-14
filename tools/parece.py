"""Parece o modelo? Confere um vídeo pronto contra a assinatura do modelo (modelos/<m>/assinatura.json) e monta o lado a
lado com o vídeo aprovado. Obrigatório antes de chamar um vídeo de pronto: reprovou, o vídeo não sai.

uso (da raiz do estúdio):  .venv/Scripts/python.exe tools/parece.py <video.mp4> <modelo> [--folha saida.jpg]
faz:  mede luz, cor, enquadramento do rosto e ritmo do vídeo e compara com o aprovado, item a item, dizendo o que mexer;
      grava a folha (padrão: ao lado do vídeo, <nome>-parece.jpg): em cima o aprovado, embaixo o seu, no 1º segundo
      e em 6 momentos do vídeo (no estúdio aberto, o aprovado é a modelos/<m>/referencia/referencia.mp4).
sai com código 1 se algum item estiver fora da faixa. Passar aqui é o mínimo: olhe a folha.
vídeo curto (menos de 70% do aprovado): cada item é comparado com o que os trechos do mesmo tamanho do aprovado mostram
(do menor ao maior valor entre eles), porque 10 s de um modelo que alterna modos nunca têm a média do vídeo inteiro.
"""
import argparse, json, os, subprocess, sys
from fractions import Fraction
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')  # acentos no terminal do Windows
os.environ.setdefault('OPENCV_LOG_LEVEL', 'ERROR')
sys.path.insert(0, str(Path(__file__).resolve().parent))
from assinatura import RAIZ, aprovado, enquadramento, luz_cor, medir_video, quadros, ritmo, rostos  # noqa: E402

# faixa aceita de cada item: (diferença máxima, é relativa?, o que mexer quando sai)
# só avisam: a saturação depende da roupa e do cenário; o ritmo por minuto oscila muito em vídeo curto (2 cortes em
# 15 s viram 8/min) e o detector não vê corte de zoom no mesmo plano
SO_AVISA = {'saturacao', 'cortes_min'}
# modelos em que cada vídeo leva a cor da marca de quem anuncia: a cor não é a do aprovado, então brilho, contraste,
# saturação e temperatura só avisam (o resto, como ritmo, continua cobrado)
COR_PROPRIA = {'anunciomotion01', 'anunciocanvas01'}
COR = {'brilho', 'contraste', 'saturacao', 'temperatura'}
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


def bandas(ap: Path, seg: float, com_rosto: bool) -> dict:
    """Vídeo curto: o aprovado medido em janelas do mesmo tamanho (passo de 1 s); de cada item, o menor e o maior valor
    entre as janelas. Um vídeo de 10 s parece o modelo se cabe no que algum trecho de 10 s do aprovado mostra."""
    qs, _ = quadros(ap, 4)
    rs = rostos(qs) if com_rosto else None
    n = max(8, int(seg * 4))
    vals: dict = {}
    for i in range(0, max(1, len(qs) - n + 1), 4):
        m = {**luz_cor(qs[i:i + n]), 'cortes_min': ritmo(qs[i:i + n], 4)}
        if rs is not None:
            m.update(enquadramento(rs[i:i + n]) or {})
        for k, x in m.items():
            vals.setdefault(k, []).append(x)
    return {k: (min(v), max(v)) for k, v in vals.items()}


def comparar_banda(novo: dict, ref: dict, bd: dict) -> list[tuple[str, str, float, bool, str]]:
    linhas = []
    for k, (lim, rel, dica) in FAIXA.items():
        if k not in bd or k not in novo:
            continue
        lo, hi = bd[k]
        b = novo[k]
        if k == 'cabeca_cortada':
            fora = b - hi > lim
        else:
            folga = lambda x: lim * max(abs(x), 1e-6) if rel else lim
            fora = b < lo - folga(lo) or b > hi + folga(hi)
        # dentro da tolerância mas fora do que o aprovado mostra: passa, com aviso (a linha diz 'perto')
        perto = not fora and k != 'cabeca_cortada' and (b < lo or b > hi)
        linhas.append((k, f'{lo:g}..{hi:g}', b, fora, dica if not perto else 'perto'))
    return linhas


def folha(video: Path, m: str, saida: Path) -> None:
    """Duas faixas de 7 quadros: 0,5 s e 6 momentos espalhados; em cima o aprovado, embaixo o novo."""
    def faixa(v: Path, alvo: Path):
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(v)],
                                   capture_output=True, text=True).stdout.strip() or 1)
        ts = [0.5] + [dur * (i + 1) / 7 for i in range(6)]
        fps = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate',
                              '-of', 'csv=p=0', str(v)], capture_output=True, text=True).stdout.strip() or '30/1'
        q = float(Fraction(fps.split(',')[0].split()[0]))  # quadros por segundo (ex.: 30/1)
        # um quadro exato por momento (com uma janela de tempo, 2 quadros caíam no mesmo momento e o tile enchia cedo)
        sel = '+'.join(f'eq(n,{round(t * q)})' for t in ts)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(v), '-vf', f"select='{sel}',scale=240:-2,tile=7x1:padding=4",
                        '-frames:v', '1', '-vsync', 'vfr', str(alvo)], check=True)
    ap = aprovado(m)
    if not ap:
        print('  (sem vídeo aprovado nem modelos/<m>/referencia/: folha não montada)'); return
    tmp, ref = saida.with_suffix('.novo.jpg'), saida.with_suffix('.ref.jpg')
    faixa(video, tmp)
    faixa(ap, ref)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(ref), '-i', str(tmp), '-filter_complex',
                    '[0:v]scale=1708:-2[a];[1:v]scale=1708:-2[b];[a][b]vstack', str(saida)], check=True)
    tmp.unlink(missing_ok=True)
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
    ap_v = aprovado(a.modelo)
    curto = ap_v is not None and novo['segundos'] < 0.7 * ref.get('segundos', 0)
    if curto:  # vídeo curto: compara com os trechos do mesmo tamanho do aprovado, não com a média dele inteiro
        print(f'{v.name} ({novo["segundos"]} s) contra os trechos de {novo["segundos"]} s do aprovado do {a.modelo}:')
        linhas = comparar_banda(novo, ref, bandas(ap_v, novo['segundos'], 'rosto_aberto' in ref))
    else:
        print(f'{v.name} contra o aprovado do {a.modelo} ({ref["video"]}):')
        linhas = comparar(novo, ref)
    fora = 0
    for k, x, y, f, dica in linhas:
        aviso = f and (k in SO_AVISA or (a.modelo in COR_PROPRIA and k in COR))
        fora += f and not aviso
        perto = not f and dica == 'perto'
        print(f"  {'AVISO' if aviso else 'FORA ' if f else 'perto' if perto else 'ok   '} {k:15} modelo {x:>14} | seu {y:>8}"
              + (f'  -> {dica}' if f else '  -> fora do que o aprovado mostra, mas dentro da tolerância: confira na folha' if perto else ''))
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
