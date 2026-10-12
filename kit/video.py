"""Gera um clipe curto de vídeo a partir de uma imagem (imagem → vídeo) pela kie.ai e grava na pasta do vídeo,
com o prompt anotado no GERADAS.md. Motor padrão: Grok Imagine (o mais barato medido), 480p, 6 s.
uso: .venv/Scripts/python video.py <imagem.png> "<movimento, em inglês>" <saida.mp4> [--duracao 6] [--resolucao 480p]
                                   [--formato 9:16]
- Só cenário, objeto e atmosfera: nunca pessoa real, nunca no lugar de um fato que aconteceu.
- Mostra o gasto da geração (créditos antes e depois).
Docs (2026-10-08): docs.kie.ai/market/grok-imagine/image-to-video."""
import argparse, json, time
from pathlib import Path
import requests
from gerar import API, checar, chave, creditos, subir

MODELO = 'grok-imagine/image-to-video'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('imagem')
    ap.add_argument('movimento')
    ap.add_argument('saida')
    ap.add_argument('--duracao', type=int, default=6)
    ap.add_argument('--resolucao', default='480p', choices=['480p', '720p', '1080p'])
    ap.add_argument('--formato', default='9:16')
    ap.add_argument('--modo', default='normal', choices=['normal', 'fun'])
    a = ap.parse_args()
    k = chave()
    antes = creditos(k)
    url = subir(k, Path(a.imagem))
    cab = {'Authorization': f'Bearer {k}', 'Content-Type': 'application/json'}
    entrada = {'image_urls': [url], 'prompt': a.movimento, 'duration': a.duracao, 'resolution': a.resolucao,
               'mode': a.modo, 'aspect_ratio': a.formato}
    tarefa = checar(requests.post(f'{API}/api/v1/jobs/createTask', headers=cab, timeout=60,
                                  json={'model': MODELO, 'input': entrada}), 'criar tarefa')['taskId']
    inicio = time.time()
    while True:
        time.sleep(5)
        d = checar(requests.get(f'{API}/api/v1/jobs/recordInfo', headers=cab, params={'taskId': tarefa}, timeout=30), 'consultar tarefa')
        if d.get('state') == 'success':
            break
        if d.get('state') == 'fail':
            raise SystemExit(f'A geração falhou ({d.get("failCode")}): {d.get("failMsg")}')
        if time.time() - inicio > 900:
            raise SystemExit(f'Passou de 15 min. Tarefa {tarefa}: consultar depois.')
    urls = json.loads(d.get('resultJson') or '{}').get('resultUrls', [])
    if not urls:
        raise SystemExit(f'Terminou sem vídeo. Tarefa {tarefa}.')
    saida = Path(a.saida).resolve()
    saida.parent.mkdir(parents=True, exist_ok=True)
    r = requests.get(urls[0], timeout=300)
    r.raise_for_status()
    saida.write_bytes(r.content)
    gasto = antes - creditos(k)
    reg = saida.parent / 'GERADAS.md'
    if not reg.exists():
        reg.write_text('# Imagens geradas\n\n| Arquivo | Motor | Formato | Tarefa | Prompt |\n|---|---|---|---|---|\n', encoding='utf-8')
    with reg.open('a', encoding='utf-8') as f:
        f.write(f"| {saida.name} | {MODELO} {a.resolucao} {a.duracao}s (de {Path(a.imagem).name}, {gasto:g} créditos) | {a.formato} | {tarefa} | {a.movimento.replace('|', '/')} |\n")
    print(f'{saida.name}: {round(time.time() - inicio)}s, {gasto:g} créditos')


if __name__ == '__main__':
    main()
