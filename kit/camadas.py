"""Separa uma imagem em camadas de profundidade pra câmera 2.5D (parallax de verdade).
uso: .venv/Scripts/python camadas.py <imagem ou pasta> <saida> [--modelo geral|pessoa]
saídas, por imagem, do MESMO tamanho da original (alinhadas, é só empilhar):
  <nome>_frente.png  o objeto principal com transparência
  <nome>_fundo.jpg   a cena sem o objeto, com o buraco preenchido (inpaint), pra ficar atrás
  <nome>_prova.jpg   as duas lado a lado, pra conferir de olho
O fundo preenchido não é perfeito de perto: no vídeo ele vai desfocado e escurecido, atrás da frente."""
import argparse
from pathlib import Path
import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

MODELOS = {'pessoa': 'birefnet-portrait', 'geral': 'birefnet-general'}
EXTS = {'.jpg', '.jpeg', '.png', '.webp'}
# preenchimento por IA (LaMa), o mesmo da máquina de conteúdo; sem ele, cai no inpaint do OpenCV
LAMA_ONNX = Path(__file__).resolve().parents[2] / 'maquina-de-conteudo' / 'tools' / 'modelos' / 'lama_fp32.onnx'
LAMA = None


def lama(im_bgr, m):
    """LaMa trabalha em 512x512: a imagem inteira vai reduzida e o preenchimento volta ampliado."""
    h, w = m.shape
    img = cv2.resize(im_bgr[:, :, ::-1], (512, 512), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    msk = (cv2.resize(m, (512, 512)) > 10).astype(np.float32)
    out = LAMA.run(None, {'image': img.transpose(2, 0, 1)[None], 'mask': msk[None, None]})[0][0]
    out = np.clip(out.transpose(1, 2, 0), 0, 255).astype(np.uint8)[:, :, ::-1]
    return cv2.resize(out, (w, h), interpolation=cv2.INTER_CUBIC)


def separa(arq: Path, pasta: Path, sessao):
    rgb = Image.open(arq).convert('RGB')
    cut = remove(rgb, session=sessao, post_process_mask=True)
    a = np.array(cut.getchannel('A'))
    if (a > 128).mean() < 0.01:
        print(arq.name, ': o modelo não achou objeto, pulei')
        return
    cut.save(pasta / f'{arq.stem}_frente.png')
    # buraco um pouco maior que o objeto, preenchido em resolução menor (vai desfocado no vídeo)
    m = cv2.dilate((a > 40).astype(np.uint8) * 255, np.ones((25, 25), np.uint8))
    im = np.array(rgb)[:, :, ::-1]
    h, w = m.shape
    if LAMA:
        cheio = lama(im, m)
    else:
        k = 0.5
        peq = cv2.inpaint(cv2.resize(im, (int(w * k), int(h * k))), cv2.resize(m, (int(w * k), int(h * k))), 9, cv2.INPAINT_TELEA)
        cheio = cv2.resize(peq, (w, h), interpolation=cv2.INTER_CUBIC)
    mf = cv2.GaussianBlur(m, (31, 31), 0)[:, :, None] / 255.0
    fundo = (im * (1 - mf) + cheio * mf).astype(np.uint8)
    cv2.imwrite(str(pasta / f'{arq.stem}_fundo.jpg'), fundo, [cv2.IMWRITE_JPEG_QUALITY, 92])
    prova = np.concatenate([fundo, cv2.cvtColor(np.array(cut), cv2.COLOR_RGBA2BGR)], axis=1)
    prova = cv2.resize(prova, (prova.shape[1] * 600 // prova.shape[0], 600))
    cv2.imwrite(str(pasta / f'{arq.stem}_prova.jpg'), prova, [cv2.IMWRITE_JPEG_QUALITY, 85])
    print(arq.name, '->', f'{(a > 128).mean():.0%} da imagem é frente')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('entrada')
    ap.add_argument('saida')
    ap.add_argument('--modelo', default='geral', choices=MODELOS)
    a = ap.parse_args()
    ent, pasta = Path(a.entrada), Path(a.saida)
    pasta.mkdir(parents=True, exist_ok=True)
    arqs = [p for p in sorted(ent.iterdir()) if p.suffix.lower() in EXTS] if ent.is_dir() else [ent]
    sessao = new_session(MODELOS[a.modelo])
    global LAMA
    if LAMA_ONNX.exists():
        import onnxruntime as ort
        LAMA = ort.InferenceSession(str(LAMA_ONNX), providers=['CPUExecutionProvider'])
    for arq in arqs:
        if not (pasta / f'{arq.stem}_frente.png').exists():
            separa(arq, pasta, sessao)


if __name__ == '__main__':
    main()
