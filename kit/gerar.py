"""Gera imagem e grava na pasta do vídeo. Motor padrão: kie.ai (Nano Banana 2.1, 1K). Reserva: Codex.
uso: .venv/Scripts/python gerar.py "<descrição>" <saida.png> [--formato 16:9] [--ref foto.png ...]
                                   [--resolucao 1K|2K|4K] [--motor kie|codex]
     .venv/Scripts/python gerar.py --creditos          (saldo da conta kie.ai)
- A chave vem da variável KIE_API_KEY ou do arquivo kit/.env (nunca do código, nunca de arquivo publicado).
- --ref manda até 10 imagens de referência (estilo, objeto, composição). Gente real NÃO vai como
  referência pra virar imagem gerada: rosto real vem de foto real recortada.
- Cada geração entra no GERADAS.md da pasta de saída (arquivo, prompt, formato, tarefa) pra refazer igual.
Docs (2026-10-07): docs.kie.ai/market/google/nanobanana-2-1 e /market/common/get-task-detail."""
import argparse, json, mimetypes, os, shutil, subprocess, sys, time
from pathlib import Path
import requests

AQUI = Path(__file__).parent
API = 'https://api.kie.ai'
UPLOAD = 'https://kieai.redpandaai.co/api/file-stream-upload'
MODELO = 'nano-banana-2-1'
FORMATOS = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9', '1:4', '4:1', '1:8', '8:1']


def chave():
    k = os.environ.get('KIE_API_KEY', '').strip()
    env = AQUI / '.env'
    if not k and env.exists():
        for linha in env.read_text(encoding='utf-8').splitlines():
            if linha.strip().startswith('KIE_API_KEY='):
                k = linha.split('=', 1)[1].strip().strip('"\'')
    if not k:
        sys.exit('Falta a chave da kie.ai: cole em kit/.env (KIE_API_KEY=...).')
    return k


def checar(r, oque):
    try:
        j = r.json()
    except ValueError:
        sys.exit(f'{oque}: resposta inválida (HTTP {r.status_code}): {r.text[:300]}')
    if j.get('code') != 200:  # a kie.ai responde HTTP 200 mesmo no erro; o código real vem aqui
        dica = {401: 'chave inválida', 402: 'sem créditos', 429: 'muitas chamadas, esperar'}.get(j.get('code'), '')
        sys.exit(f'{oque}: erro {j.get("code")} {dica} | {j.get("msg")}')
    return j.get('data')


def creditos(k):
    return checar(requests.get(f'{API}/api/v1/chat/credit', headers={'Authorization': f'Bearer {k}'}, timeout=30),
                  'créditos')


def subir(k, arq):
    with open(arq, 'rb') as f:
        r = requests.post(UPLOAD, headers={'Authorization': f'Bearer {k}'}, timeout=120,
                          data={'uploadPath': 'vkos/referencias', 'fileName': f'{int(time.time())}_{arq.name}'},
                          files={'file': (arq.name, f, mimetypes.guess_type(arq.name)[0] or 'image/png')})
    return checar(r, f'upload de {arq.name}')['downloadUrl']


def kie(descricao, formato, resolucao, refs, saida):
    k = chave()
    entrada = {'prompt': descricao, 'aspect_ratio': formato, 'resolution': resolucao, 'output_format': 'png',
               'image_input': [subir(k, Path(r)) for r in refs]}
    cab = {'Authorization': f'Bearer {k}', 'Content-Type': 'application/json'}
    tarefa = checar(requests.post(f'{API}/api/v1/jobs/createTask', headers=cab, timeout=60,
                                  json={'model': MODELO, 'input': entrada}), 'criar tarefa')['taskId']
    inicio = time.time()
    while True:
        time.sleep(3)
        d = checar(requests.get(f'{API}/api/v1/jobs/recordInfo', headers=cab, params={'taskId': tarefa},
                                timeout=30), 'consultar tarefa')
        if d.get('state') == 'success':
            break
        if d.get('state') == 'fail':
            sys.exit(f'A geração falhou ({d.get("failCode")}): {d.get("failMsg")}')
        if time.time() - inicio > 600:
            sys.exit(f'Passou de 10 min sem terminar. Tarefa {tarefa}: consultar depois.')
    urls = json.loads(d.get('resultJson') or '{}').get('resultUrls', [])
    if not urls:
        sys.exit(f'Terminou sem imagem. Tarefa {tarefa}.')
    feitos = []
    for i, u in enumerate(urls):
        destino = saida if len(urls) == 1 else saida.with_name(f'{saida.stem}_{i + 1:02d}{saida.suffix}')
        r = requests.get(u, timeout=120)
        r.raise_for_status()
        destino.write_bytes(r.content)
        feitos.append(destino)
    return feitos, tarefa, round(time.time() - inicio)


def codex(descricao, formato, saida):
    pasta = Path.home() / '.codex' / 'generated_images'
    inicio = time.time()
    r = subprocess.run([shutil.which('codex') or 'codex', 'exec', '--skip-git-repo-check', '-s', 'read-only',
                        f'Use your image generation tool to create 1 image, aspect ratio {formato}. Description: '
                        f'{descricao}. Do not edit files or run commands. Reply "ok".'],
                       capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=900)
    novos = sorted((p for p in pasta.glob('*/*.png') if p.stat().st_mtime >= inicio - 1), key=lambda p: p.stat().st_mtime)
    if not novos:
        erro = (r.stderr or r.stdout)[-400:]
        sys.exit('O login do Codex expirou: `codex login` no terminal.' if 'refresh token' in erro else f'Codex sem imagem: {erro}')
    shutil.copy2(novos[-1], saida)
    return [saida], 'codex', round(time.time() - inicio)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('descricao', nargs='?')
    ap.add_argument('saida', nargs='?')
    ap.add_argument('--formato', default='16:9', choices=FORMATOS)
    ap.add_argument('--resolucao', default='1K', choices=['1K', '2K', '4K'])
    ap.add_argument('--ref', nargs='*', default=[], help='até 10 imagens de referência')
    ap.add_argument('--motor', default='kie', choices=['kie', 'codex'])
    ap.add_argument('--creditos', action='store_true')
    a = ap.parse_args()
    if a.creditos:
        print('créditos kie.ai:', creditos(chave()))
        return
    if not (a.descricao and a.saida):
        ap.error('faltou a descrição ou o arquivo de saída')
    if len(a.ref) > 10:
        ap.error('no máximo 10 referências')
    saida = Path(a.saida).resolve()
    saida.parent.mkdir(parents=True, exist_ok=True)
    if a.motor == 'kie':
        feitos, tarefa, seg = kie(a.descricao, a.formato, a.resolucao, a.ref, saida)
    else:
        feitos, tarefa, seg = codex(a.descricao, a.formato, saida)
    reg = saida.parent / 'GERADAS.md'
    if not reg.exists():
        reg.write_text('# Imagens geradas\n\n| Arquivo | Motor | Formato | Tarefa | Prompt |\n|---|---|---|---|---|\n',
                       encoding='utf-8')
    with reg.open('a', encoding='utf-8') as f:
        for p in feitos:
            f.write(f"| {p.name} | {a.motor} {a.resolucao} | {a.formato} | {tarefa} | {a.descricao.replace('|', '/')} |\n")
    print(f'{len(feitos)} imagem(ns) em {seg}s:', *feitos, sep='\n')


if __name__ == '__main__':
    main()
