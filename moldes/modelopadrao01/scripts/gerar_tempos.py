"""modelopadrao01: lê a entrada padrão (src/palavras.json [{text,start,end}], public/voz.wav, public/fala.mp4) e gera
src/tempos.json (o plano do vídeo: blocos A/B e o tempo de cada tela).
Todo evento nasce de uma palavra dita; toda tela sai JUNTO com o corte da frase seguinte (sem cortina aberta).
A gravação é um take só (sem decupagem): os "blocos" são os cortes de enquadramento A/B que o modelo usa,
2 quadros antes da palavra que abre a frase.
uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/gerar_tempos.py
"""
import json, subprocess, wave
from pathlib import Path

AQUI = Path(__file__).resolve().parent.parent
BRUTAS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
W = [{'texto': p['text'], 'de': round(p['start'], 3), 'ate': round(p['end'], 3)} for p in BRUTAS]
with wave.open(str(AQUI / 'public' / 'voz.wav')) as v:
    DURACAO = round(v.getnframes() / v.getframerate(), 2)  # áudio da fala
# o vídeo pode acabar antes do áudio: depois dele fica o último quadro congelado
VIDEO_FIM = round(float(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=duration',
                                        '-of', 'csv=p=0', str(AQUI / 'public' / 'fala.mp4')], capture_output=True, text=True).stdout), 2)


def limpa(s):
    return s.lower().strip('.,!?')


def w(texto, n=1):
    """início da n-ésima ocorrência exata da palavra"""
    achadas = [p for p in W if limpa(p['texto']) == texto.lower()]
    return achadas[n - 1]['de']


Q = 2 / 30  # corte 2 quadros antes da palavra
corte = lambda texto, n=1: round(w(texto, n) - Q, 3)

BLOCOS = [0.0, corte('ele'), w('a'), corte('inclusive'), w('posso'), corte('mas'), corte('e', 2), corte('comenta')]
T = dict(
    _leia='Gerado por scripts/gerar_tempos.py a partir de src/palavras.json. Não editar à mão.',
    fps=30,
    duracao=DURACAO,
    video_fim=VIDEO_FIM,
    blocos=BLOCOS,
    # gancho(A), Ele(B, no editor), a diferença(dividido), Inclusive(celular), posso(B), Mas(A), e aprender(dividido), comenta(B)
    planos=['A', 'B', 'A', 'A', 'B', 'A', 'A', 'B'],
    # 1. abre limpo (só ele e a legenda); em "pelo Claude" o vídeo entra no editor e o Claude edita ESTE vídeo.
    #    Claude -> a lâmina corta o clipe; criado -> a faixa de legenda nasce; mostrar -> uma tela se monta na prévia.
    #    Em "a diferença" o vídeo cresce direto para a tela dividida.
    editor=dict(de=round(w('pelo') - 0.15, 3), corte=w('claude'), legenda=w('criado'), tela=w('mostrar'), devolve=w('a')),
    # 2. "a diferença entre vários modelos que eu criei e melhorei para editar qualquer tipo de vídeo usando o Claude":
    #    os cartões dos modelos entram até "modelos", ✓ em "criei", barra enche em "melhorei", formatos do vídeo em
    #    "qualquer / tipo / vídeo", tudo entra no Claude em "Claude". Sai junto com o corte de "Inclusive".
    modelos=dict(de=w('a'), diferenca=w('diferença'), modelos=w('modelos'), criei=w('criei'), melhorei=w('melhorei'),
                 editar=w('editar'), formatos=[w('qualquer'), w('tipo'), w('vídeo', 2)], claude=w('claude', 2),
                 sai=corte('inclusive')),
    # 3. "se você estiver no Instagram agora, você está vendo apenas um desses modelos": o vídeo vira um Reel no
    #    celular; os outros modelos aparecem atrás em "desses"; o NOME do modelo em "um". Devolve o rosto em "posso".
    celular=dict(de=corte('inclusive'), instagram=w('instagram'), nome=w('um'), desses=w('desses'), devolve=w('posso')),
    # 4. "duas prévias rápidas aqui em cima, aceleradas em três vezes" (só com previas=true): dividido, as duas
    #    prévias em cima; "3x" em "aceleradas". Sai junto com o corte do "Mas".
    previas=dict(de=round(w('duas') - 0.15, 3), x3=w('aceleradas'), sai=corte('mas')),
    # 5. "ver outros modelos de edição como esse": a etiqueta na coluna ao lado do rosto
    outros=dict(de=w('outros'), sai=round(corte('e', 2) - 0.36, 3)),
    zooms=[],
    # 6. "e aprender a como usar isso nos seus vídeos": a caixa do Claude com as palavras dele
    prompt=dict(de=corte('e', 2), palavras=[w('aprender'), w('a', 2), w('como', 2), w('usar'), w('isso'), w('nos'), w('seus'), w('vídeos')],
                sai=corte('comenta')),
    # 7. "comenta EDIÇÃO aqui embaixo que eu vou te mandar na sua DM agora": o campo de comentário embaixo com EDIÇÃO;
    #    a DM chega em cima em "mandar"
    fecho=dict(comenta=w('comenta'), edicao=w('edição', 2), aqui=w('aqui', 2), embaixo=w('embaixo'), mandar=w('mandar'), dm=w('dm')),
    silencio=dict(de=round(corte('mas') - 0.05, 3), ate=round(corte('mas') + 0.5, 3)),
)
(AQUI / 'src' / 'tempos.json').write_text(json.dumps(T, ensure_ascii=False, indent=1), encoding='utf-8')
print('blocos', BLOCOS)
for k, v in T.items():
    if isinstance(v, dict):
        print(k, v)
