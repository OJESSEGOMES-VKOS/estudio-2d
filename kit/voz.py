"""Narração pelo ElevenLabs, com o tempo de cada palavra (dispensa o Whisper).
uso: .venv/Scripts/python voz.py <texto.txt> <saida.mp3> --voz <voice_id> [--dono <public_owner_id>]
                                 [--modelo eleven_v3] [--estabilidade 0.5] [--velocidade 1.0]
     .venv/Scripts/python voz.py --saldo
saídas: <saida>.mp3 e <saida>.palavras.json ([{"w": "palavra", "s": início, "e": fim}, ...])
- A chave vem de ELEVENLABS_API_KEY ou do kit/.env.
- Voz da biblioteca pública: passar --dono (public_owner_id) que ela entra em "My voices" na 1ª vez.
- Voz de pessoa real (clone) só com autorização escrita da própria pessoa."""
import argparse, base64, json, os, re, sys
from pathlib import Path
import requests

AQUI = Path(__file__).parent
API = 'https://api.elevenlabs.io/v1'


def chave():
    k = os.environ.get('ELEVENLABS_API_KEY', '').strip()
    env = AQUI / '.env'
    if not k and env.exists():
        for l in env.read_text(encoding='utf-8').splitlines():
            if l.strip().startswith('ELEVENLABS_API_KEY='):
                k = l.split('=', 1)[1].strip().strip('"\'')
    if not k:
        sys.exit('Falta a chave do ElevenLabs em kit/.env (ELEVENLABS_API_KEY=...).')
    return k


def garantir_voz(k, voz, dono):
    cab = {'xi-api-key': k}
    if requests.get(f'{API}/voices/{voz}', headers=cab, timeout=30).status_code == 200:
        return
    if not dono:
        sys.exit('Voz fora da conta: passar --dono <public_owner_id> pra adicionar da biblioteca.')
    r = requests.post(f'{API}/voices/add/{dono}/{voz}', headers=cab, timeout=60, json={'new_name': f'vkos-{voz[:6]}'})
    if r.status_code != 200:
        sys.exit(f'Não consegui adicionar a voz: {r.status_code} {r.text[:300]}')


def palavras(al):
    """Junta os caracteres alinhados em palavras com início e fim. Marcação de emoção ([serious]) não vira palavra."""
    out, atual, ini, fim, tag = [], '', None, None, False
    for c, s, e in zip(al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']):
        if c == '[' or tag:
            tag = c != ']'
            continue
        if c.isspace():
            if atual:
                out.append({'w': atual, 's': round(ini, 3), 'e': round(fim, 3)})
            atual, ini = '', None
            continue
        if ini is None:
            ini = s
        atual += c
        fim = e
    if atual:
        out.append({'w': atual, 's': round(ini, 3), 'e': round(fim, 3)})
    return [p for p in out if re.search(r'\w', p['w'])]  # tira marcação solta tipo [pausa]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('texto', nargs='?')
    ap.add_argument('saida', nargs='?')
    ap.add_argument('--voz')
    ap.add_argument('--dono')
    ap.add_argument('--modelo', default='eleven_v3')
    ap.add_argument('--estabilidade', type=float, default=0.5)
    ap.add_argument('--similaridade', type=float, default=0.8)
    ap.add_argument('--estilo', type=float, default=0.0)
    ap.add_argument('--velocidade', type=float, default=1.0)
    ap.add_argument('--saldo', action='store_true')
    a = ap.parse_args()
    k = chave()
    if a.saldo:
        d = requests.get(f'{API}/user/subscription', headers={'xi-api-key': k}, timeout=30).json()
        print(f"plano {d.get('tier')}: {d.get('character_count')} de {d.get('character_limit')} caracteres usados")
        return
    if not (a.texto and a.saida and a.voz):
        ap.error('faltou texto, saída ou --voz')
    texto = Path(a.texto).read_text(encoding='utf-8').strip() if Path(a.texto).exists() else a.texto
    garantir_voz(k, a.voz, a.dono)
    corpo = {'text': texto, 'model_id': a.modelo, 'language_code': 'pt',
             'voice_settings': {'stability': a.estabilidade, 'similarity_boost': a.similaridade,
                                'style': a.estilo, 'speed': a.velocidade, 'use_speaker_boost': True}}
    r = requests.post(f'{API}/text-to-speech/{a.voz}/with-timestamps?output_format=mp3_44100_128',
                      headers={'xi-api-key': k}, json=corpo, timeout=300)
    if r.status_code != 200:
        sys.exit(f'ElevenLabs recusou: {r.status_code} {r.text[:400]}')
    d = r.json()
    saida = Path(a.saida)
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_bytes(base64.b64decode(d['audio_base64']))
    al = d.get('alignment') or d.get('normalized_alignment')
    ws = palavras(al) if al else []
    saida.with_suffix('.palavras.json').write_text(json.dumps(ws, ensure_ascii=False, indent=0), encoding='utf-8')
    dur = ws[-1]['e'] if ws else 0
    print(f'{saida.name}: {len(ws)} palavras, {dur:.1f}s, {len(ws) / dur if dur else 0:.2f} palavras/s')


if __name__ == '__main__':
    main()
