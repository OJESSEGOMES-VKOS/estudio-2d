"""Efeito sonoro e trilha pelo ElevenLabs (mesma chave do voz.py, em kit/.env).
uso:
  .venv/Scripts/python audio_ia.py efeito "<descrição em inglês>" <saida.mp3> [--dur 2.0] [--influencia 0.6] [--loop]
  .venv/Scripts/python audio_ia.py trilha "<descrição em inglês>" <saida.mp3> --dur 95
  .venv/Scripts/python audio_ia.py plano <plano.json> <saida.mp3>   (trilha em seções com duração exata)
  .venv/Scripts/python audio_ia.py plano-rascunho "<descrição>" <plano.json> --dur 95   (grátis: o ElevenLabs propõe as seções)
Cada geração fica anotada em SONS.md na pasta da saída, com o pedido e o custo em caracteres."""
import argparse, json, sys
from datetime import date
from pathlib import Path
import requests
from voz import API, chave


def gasto(h):
    return requests.get(f'{API}/user/subscription', headers=h, timeout=30).json().get('character_count', 0)


def anota(saida: Path, tipo: str, pedido: str, custo: int):
    log = saida.parent / 'SONS.md'
    novo = not log.exists()
    with log.open('a', encoding='utf-8') as f:
        if novo:
            f.write('# Sons gerados (ElevenLabs)\n\n| Arquivo | Tipo | Pedido | Custo | Data |\n|---|---|---|---|---|\n')
        f.write(f'| {saida.name} | {tipo} | {pedido.replace("|", "/")[:300]} | {custo} | {date.today()} |\n')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('modo', choices=['efeito', 'trilha', 'plano', 'plano-rascunho'])
    ap.add_argument('pedido')
    ap.add_argument('saida')
    ap.add_argument('--dur', type=float)
    ap.add_argument('--influencia', type=float, default=0.6)
    ap.add_argument('--loop', action='store_true')
    ap.add_argument('--modelo', default='music_v2_5')
    a = ap.parse_args()
    h = {'xi-api-key': chave()}
    saida = Path(a.saida)
    saida.parent.mkdir(parents=True, exist_ok=True)
    antes = gasto(h)
    if a.modo == 'efeito':
        corpo = {'text': a.pedido, 'prompt_influence': a.influencia, 'model_id': 'eleven_text_to_sound_v2'}
        if a.dur:
            corpo['duration_seconds'] = a.dur
        if a.loop:
            corpo['loop'] = True
        r = requests.post(f'{API}/sound-generation?output_format=mp3_44100_128', headers=h, json=corpo, timeout=180)
    elif a.modo == 'plano-rascunho':
        r = requests.post(f'{API}/music/plan', headers=h, timeout=180,
                          json={'prompt': a.pedido, 'music_length_ms': int((a.dur or 60) * 1000), 'model_id': a.modelo})
        if r.status_code != 200:
            sys.exit(f'ElevenLabs recusou: {r.status_code} {r.text[:500]}')
        saida.write_text(json.dumps(r.json(), ensure_ascii=False, indent=1), encoding='utf-8')
        print('plano salvo em', saida)
        return
    else:
        corpo = {'model_id': a.modelo}
        if a.modo == 'plano':
            corpo['composition_plan'] = json.loads(Path(a.pedido).read_text(encoding='utf-8'))
        else:
            corpo.update(prompt=a.pedido, music_length_ms=int((a.dur or 60) * 1000), force_instrumental=True)
        r = requests.post(f'{API}/music?output_format=mp3_44100_128', headers=h, json=corpo, timeout=600)
    if r.status_code != 200:
        sys.exit(f'ElevenLabs recusou: {r.status_code} {r.text[:500]}')
    saida.write_bytes(r.content)
    custo = gasto(h) - antes
    anota(saida, a.modo, a.pedido if a.modo != 'plano' else Path(a.pedido).name, custo)
    print(f'{saida.name}: {len(r.content) / 1024:.0f} KB, custo {custo} caracteres')


if __name__ == '__main__':
    main()
