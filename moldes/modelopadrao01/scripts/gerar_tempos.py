"""modelopadrao01: lê a entrada padrão (src/palavras.json [{text,start,end}], public/voz.wav, public/fala.mp4) e gera
src/tempos.json (o plano do vídeo: blocos A/B, o tempo de cada tela e os títulos).
Todo evento nasce de uma palavra dita; toda tela sai JUNTO com o corte da frase seguinte (sem cortina aberta).
A gravação é um take só (sem decupagem): os "blocos" são os cortes de enquadramento A/B que o modelo usa,
2 quadros antes da palavra que abre a frase.
Este arquivo É o plano: num vídeo novo, refaça o bloco "O PLANO" abaixo para a fala nova. Tela que o vídeo não usa
(editor, modelos, celular, previas, outros, prompt, fecho, silencio) vira None e some do vídeo e do som.
Se uma palavra do plano não existe na fala, o script para e diz a linha. Se public/quadro.jpg (a miniatura dos formatos)
não existe, ele é tirado de public/fala.mp4.
uso (de dentro do molde): ../../.venv/Scripts/python.exe scripts/gerar_tempos.py
"""
import json, re, subprocess, sys, unicodedata, wave
from pathlib import Path

AQUI = Path(__file__).resolve().parent.parent
BRUTAS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
if not BRUTAS:
    sys.exit('src/palavras.json está vazio: este molde precisa da fala transcrita.')
W = [{'texto': p['text'], 'de': round(p['start'], 3), 'ate': round(p['end'], 3)} for p in BRUTAS]
with wave.open(str(AQUI / 'public' / 'voz.wav')) as v:
    DURACAO = round(v.getnframes() / v.getframerate(), 2)  # áudio da fala
# o vídeo pode acabar antes do áudio: depois dele fica o último quadro congelado
VIDEO_FIM = round(float(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=duration',
                                        '-of', 'csv=p=0', str(AQUI / 'public' / 'fala.mp4')], capture_output=True, text=True).stdout), 2)
FONTE = Path(__file__).read_text(encoding='utf-8').splitlines()


def limpa(s):
    """sem maiúscula, acento e pontuação (o Whisper varia nisso)"""
    s = unicodedata.normalize('NFD', s)
    return re.sub(r'[^a-z0-9%]', '', ''.join(c for c in s if not unicodedata.combining(c)).lower())


def iw(texto, n=1):
    """índice da n-ésima vez que a palavra é dita; se a fala não tem, para e diz a linha do plano a refazer"""
    achadas = [i for i, p in enumerate(W) if limpa(p['texto']) == limpa(texto)]
    if len(achadas) >= n:
        return achadas[n - 1]
    chamada = f"('{texto}', {n})" if n > 1 else f"('{texto}')"
    linhas = [str(k + 1) for k, l in enumerate(FONTE) if chamada in l and not l.lstrip().startswith('#')]
    sys.exit(f'O plano não bate com a fala de src/palavras.json: {chamada} pede a {n}ª vez que se diz "{texto}", e a fala '
             f'{"só tem " + str(len(achadas)) if achadas else "não tem nenhuma"}.\nscripts/gerar_tempos.py:{",".join(linhas) or "?"}: '
             'refaça o bloco "O PLANO" para a fala nova (modelos/modelopadrao01/modelopadrao01.md, seção 9; tela que não serve vira None).')


def w(texto, n=1):
    """início da n-ésima ocorrência da palavra"""
    return W[iw(texto, n)]['de']


def sem_pontuacao(i):
    return W[i]['texto'].rstrip('.,!?')


Q = 2 / 30  # corte 2 quadros antes da palavra
corte = lambda texto, n=1: round(w(texto, n) - Q, 3)

# ================================================================ O PLANO (refazer num vídeo novo)
# as palavras que o Claude digita na caixa do prompt (palavra, ocorrência)
PROMPT = [('aprender', 1), ('a', 2), ('como', 2), ('usar', 1), ('isso', 1), ('nos', 1), ('seus', 1), ('vídeos', 1)]
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
    #    Obrigatórios: de, modelos, criei, melhorei, sai, nomes. Opcionais: editar (sem ele os cartões ficam até o painel
    #    sair), formatos (3 tempos) e claude (sem eles não há formatos nem chip), entradas (um tempo por cartão, na palavra
    #    dita; com elas a grade fica no meio da área).
    modelos=dict(de=w('a'), modelos=w('modelos'), criei=w('criei'), melhorei=w('melhorei'),
                 editar=w('editar'), formatos=[w('qualquer'), w('tipo'), w('vídeo', 2)], claude=w('claude', 2),
                 sai=corte('inclusive'),
                 # os nomes escritos nos cartões (o que a fala diz que existe; de 2 a 8)
                 nomes=['modelodinamico01', 'modelopadrao01', 'modelodinamico03', 'pregacaodinamica01', 'profissional01',
                        'storypodcast01', 'superpodcast01', 'youtubeedition01']),
    # 3. "se você estiver no Instagram agora, você está vendo apenas um desses modelos": o vídeo vira um Reel no
    #    celular; os outros modelos aparecem atrás em "desses"; o NOME do modelo em "um". Devolve o rosto em "posso".
    celular=dict(de=corte('inclusive'), instagram=w('instagram'), nome=w('um'), desses=w('desses'), devolve=w('posso'),
                 etiqueta='modelopadrao01'),  # o texto da etiqueta com ✓ embaixo do celular (o que a fala diz)
    # 4. "duas prévias rápidas aqui em cima, aceleradas em três vezes" (só com previas=true): dividido, as duas
    #    prévias em cima; "3x" em "aceleradas". Sai junto com o corte do "Mas".
    previas=dict(de=round(w('duas') - 0.15, 3), x3=w('aceleradas'), sai=corte('mas')),
    # 5. "ver outros modelos de edição como esse": a etiqueta na coluna ao lado do rosto
    outros=dict(de=w('outros'), sai=round(corte('e', 2) - 0.36, 3), texto='outros modelos'),
    zooms=[],
    # 6. "e aprender a como usar isso nos seus vídeos": a caixa do Claude com as palavras dele (tempos e textos)
    prompt=dict(de=corte('e', 2), palavras=[w(x, n) for x, n in PROMPT], textos=[sem_pontuacao(iw(x, n)) for x, n in PROMPT],
                sai=corte('comenta')),
    # 7. "comenta EDIÇÃO aqui embaixo que eu vou te mandar na sua DM agora": o campo de comentário embaixo com a palavra
    #    a comentar; a DM chega em cima em "mandar"
    fecho=dict(comenta=w('comenta'), edicao=w('edição', 2), palavra=sem_pontuacao(iw('edição', 2)).upper(), aqui=w('aqui', 2),
               embaixo=w('embaixo'), mandar=w('mandar'), dm=w('dm')),
    # a virada: a cama some em "Mas" (só no som)
    silencio=dict(de=round(corte('mas') - 0.05, 3), ate=round(corte('mas') + 0.5, 3)),
    # títulos no topo enquanto o rosto mora numa moldura (editor e celular): a 1ª palavra e o tamanho de cada página
    titulos=dict(editor=dict(i0=iw('pelo'), grupos=[2, 3, 2, 3]),  # "pelo Claude." "Ele foi criado" "justamente para" "te mostrar a"
                 celular=dict(i0=iw('inclusive'), grupos=[1, 3, 3, 3, 4]),
                 # palavras do título que ganham marca-texto menta (como são escritas na fala, sem a pontuação)
                 marcas=['100%', 'Claude', 'Instagram']),  # "Inclusive," "se você estiver" "no Instagram agora," "você está vendo" "apenas um desses modelos."
)
# ================================================================ fim do plano

for nome, tit in T['titulos'].items():
    if isinstance(tit, dict) and tit['i0'] + sum(tit['grupos']) > len(W):
        sys.exit(f'scripts/gerar_tempos.py: os títulos de "{nome}" passam do fim da fala ({len(W)} palavras); ajuste os grupos.')
# de qual fala é este plano (src/tema.ts confere ao carregar)
T['fala'] = dict(palavras=len(W), fim=BRUTAS[-1]['end'])
(AQUI / 'src' / 'tempos.json').write_text(json.dumps(T, ensure_ascii=False, indent=1), encoding='utf-8')
quadro = AQUI / 'public' / 'quadro.jpg'
if not quadro.exists():  # a miniatura dos formatos (tela "modelos"): um quadro da própria gravação
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(min(1.0, VIDEO_FIM / 2)), '-i', str(AQUI / 'public' / 'fala.mp4'),
                    '-frames:v', '1', '-vf', 'scale=540:-2', '-q:v', '3', str(quadro)], check=True)
    print('public/quadro.jpg tirado de public/fala.mp4')
print('blocos', BLOCOS)
for k, v in T.items():
    if isinstance(v, dict):
        print(k, v)
print('próximo: ../../.venv/Scripts/python.exe scripts/rosto.py (o enquadramento segue os blocos novos)')
