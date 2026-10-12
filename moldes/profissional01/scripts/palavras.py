"""src/palavras.json (entrada padrão [{text,start,end}], Whisper large-v3 + align.py) -> src/palavras_voz.json no formato
do profissional01 ({duracao, palavras:[{texto,de,ate}]})

Igual ao um vídeo de cliente: ancora o começo de cada palavra no ataque da voz (MODELO §8).
uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/palavras.py [--saida arquivo.json]
"""
import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

AQUI = Path(__file__).resolve().parent.parent
VOZ = AQUI / 'public' / 'voz.wav'
W = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
saida = [{'texto': w['text'].strip(), 'de': round(w['start'], 2), 'ate': round(w['end'], 2)} for w in W]

SR, J = 16000, 320
pcm = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', str(VOZ), '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                     capture_output=True).stdout
a = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
n = len(a) // J
db = 20 * np.log10(np.sqrt((a[:n * J].reshape(n, J) ** 2).mean(1)) + 1e-9)
voz = db > np.percentile(db, 10) + 8
movidas = 0
for p in saida:
    k0 = int(p['de'] * SR / J)
    k = k0
    while k < min(n, k0 + 35) and not voz[k]:
        k += 1
    if k < min(n, k0 + 35) and k != k0:
        p['de'] = round(min(k * J / SR, p['ate'] - 0.04), 2)
        movidas += 1

with wave.open(str(VOZ)) as v:
    dur = round(v.getnframes() / v.getframerate(), 2)
destino = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'src' / 'palavras_voz.json'
destino.write_text(json.dumps({'duracao': dur, 'palavras': saida}, ensure_ascii=False, indent=1), encoding='utf-8')
print(len(saida), 'palavras;', movidas, 'ancoradas no ataque;', dur, 's')
