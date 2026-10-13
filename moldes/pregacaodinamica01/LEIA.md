# Molde: pregacaodinamica01

Corte 9:16 no estilo de pregação dinâmica: frase-bloco que se monta com tamanhos misturados e sai em chicote borrado,
palavra de peso em Instrument Serif itálica vermelha (`#FF2424`), letreiro gigante atrás da pessoa recortada (RVM), tela
creme de destaque só na fala protagonista (`#EDE3D3`, tinta `#1A1512`, vermelho escuro `#C8141B`), legenda corrida em
Inter 800 60 px no peito (y 1060; 2ª posição y 1352 só nas prévias), zoom lento dentro de cada plano, fecho no preto,
golpes de som só nas ênfases (cama escura como música opcional). Sem P&B, sem nome do modelo na tela; cor do fundo
(vinho / azul petróleo) é opção desligada. Texto só em x 60–940, y 250–1500. As regras estão em
`../../modelos/pregacaodinamica01/MODELO.md`; este molde é o código do último vídeo feito no modelo (a vitrine, revisão 4).

## Entrada (contrato padrão)
| Arquivo | Uso |
|---|---|
| `public/fala.mp4` | o vídeo (planos, desfoque das prévias) |
| `public/voz.wav` | a voz, que entra só na mixagem |
| `src/palavras.json` | `[{text,start,end}]`; `src/Corte.tsx` converte para `P.palavras [{texto,de,ate}]`; a duração do vídeo é a última palavra + `FOLGA` (0,73 s), em quadros inteiros arredondados para baixo (`QUADROS`): a composição, o checador e o `scripts/som.py` usam essa mesma conta |
| `src/rosto.json` | `[[t,cx,cy,h]]`; `src/Corte.tsx` tira a mediana (`R = {cx, cy, queixo}` em px), que posiciona blocos e legenda |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, só com `previas: true` (feitas com `../../tools/previa.py`) |

Gerado pelo molde: `public/pessoa.webm` (a pessoa recortada com transparência, por `scripts/recorte.py`; o letreiro e o
`fundoCor` precisam dele) e `public/trilha.wav` + `public/efeitos.wav` (por `scripts/som.py`). Se faltar um desses
arquivos, o render para dizendo qual comando roda.

## Composição
`VitrinePregacao` (1080x1920, 30 qps, `DURACAO` em `src/Corte.tsx`). O id ficou o da vitrine para não mudar o vídeo
aprovado; num vídeo novo ele continua o mesmo. Props
`{previas: boolean, nomesPrevias: [string, string], fundoCor?: boolean, soTexto?: boolean}`, padrão
`{previas: false, nomesPrevias: ['modelodinamico01', 'storypodcast01'], fundoCor: false}`. `soTexto` renderiza só os
textos em fundo transparente (usado pelo checador). O render sai **sem som**; voz e som entram no `mixar.sh`.

Em `src/Corte.tsx`: `T` (os cortes, presos às palavras), `LETREIRO`, `PEDACOS` (páginas da legenda), `BLOCOS`,
`PreviasEmCima` (câmera desce 380 px, prévias 300x533 no alto da zona), `ZONA`, `LEG_Y_PLANO` (`LEG_Y`)/`LEG_Y2`.
Camadas: vídeo, prévias, tela creme e o texto dela, preto do fecho, os outros blocos e a legenda. O texto da tela creme some
com ela quando o preto dissolve por cima; a legenda que ainda está na tela quando o creme entra fica por baixo dele.

## Como gerar (de dentro de `moldes/pregacaodinamica01/` ou `videos/<v>/`)
1. Recorte: `QUEM=pregacaodinamica01 sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recorte.py` →
   `public/pessoa.webm` (RVM em `../../tools/modelos/rvm_mobilenetv3_fp32.onnx`; ~3 min na CPU, é pesado, vai pela
   trava). `--saida <arquivo.webm>` e `--quadros N` servem para teste.
2. Som: `../../.venv/Scripts/python.exe scripts/som.py` → `public/trilha.wav` (cama + golpes) e `public/efeitos.wav`
   (só os golpes). `--saida` grava em outro lugar.
3. Checador: `node scripts/cobertura.mjs` (abaixo).
4. Render (padrão do modelo: sem prévias, sem cor no fundo):
   ```
   QUEM=pregacaodinamica01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrinePregacao out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2
   ```
   Com prévias (só depois de fazer `public/previa1.mp4` e `previa2.mp4`): acrescente
   `--props='{"previas":true,"nomesPrevias":["<modelo da prévia 1>","<modelo da prévia 2>"]}'`. A vitrine saiu assim,
   com `["modelodinamico01","storypodcast01"]`.
5. Mixar: `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (padrão: voz + golpes, música desligada) ou, com a
   música, `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` (trilha +2 dB com ducking, ~16 dB
   abaixo da voz; foi assim na vitrine). Loudnorm -14 LUFS / -1 dBTP em duas passadas; a saída tem a duração do vídeo.

## Checador
`node scripts/cobertura.mjs` (sai com código 1 se algo falhar, e diz o que mexer). Ele pega a trava do estúdio sozinho,
então **não** rode dentro do `com-trava.sh`. Confere: toda palavra escrita na tela enquanto é dita, pedaço ≥ 1,5 s e
palavra ≥ 0,4 s, nenhuma palavra repetida, no máximo 2 posições de legenda, legenda das prévias abaixo do queixo descido
(só se o plano tem a janela das prévias), bloco com até 4 linhas, legenda e blocos abaixo do queixo medido (com o zoom
máximo de cada trecho quando não estão), nenhuma página sobre a tela creme e, renderizando só os textos a cada 0,1 s
(sem prévias e, se houver a janela, com prévias), nenhum pixel fora da zona segura (a conta de pixels roda no
`../../.venv`); bloco que passa do pé ganha o `top` que cabe ou o zoom que abre o plano. Se o plano não bate com a
fala ou os trechos estão fora de ordem, para logo e diz qual lista refazer e em que linha. Na vitrine: tudo zero,
posições 1060 e 1352.

Quadros (uma chamada para a lista toda, pela trava): `QUEM=pregacaodinamica01 sh ../../tools/com-trava.sh node scripts/quadros.mjs [--previas] 1 13 28` (`ESCALA=1` para tamanho cheio);
`../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ...`; `scripts/lado_a_lado.py` precisa de
`conferencia/ref/` com quadros de `../../modelos/pregacaodinamica01/referencias/` (as referências não vão para a
distribuição: sem elas, a conferência é a folha de quadros contra a receita medida do MODELO.md).

## Vídeo novo
O `../../tools/novo-video.py pregacaodinamica01 <gravação> <AAAA-MM-DD-tema>` copia este molde com a fala nova. O plano
continua o da vitrine e **para ao carregar** com a mensagem do que refazer (lista, arquivo e linha). Refaça, nesta ordem:

1. **`T`** (`src/Corte.tsx`, `const T`): cada trecho numa palavra da fala nova, `w('palavra', n)` = a n-ésima vez que ela
   é dita, `c()` = 2 quadros antes. Os trechos do modelo são a identidade dele: reponha cada um no lugar certo da fala
   nova (MODELO §3, §4 e §6) antes de pensar em desligar. **Os trechos ligados ficam em ordem no tempo, na ordem da
   lista** (bloco1, base1, base2, base3, destaque, previas, base3b, bloco2, base4, cta, fecho): o fim de cada trecho é o
   próximo ligado. Fora de ordem, o molde para e diz qual trecho mover; se a fala nova pede outra ordem, desligue o
   trecho que sobrou.
   - `bloco1` (abertura: a frase mais forte em frase-bloco) e `base1` (começo da legenda corrida) são obrigatórios.
   - `destaque`: a tela creme na fala protagonista. Entra em dissolve; se for o último trecho, não sai: o preto do
     `fecho` dissolve por cima dela e do texto dela. Nenhuma página da legenda fica sobre o creme: a que vem antes termina
     no `T.destaque` (3º campo da página) e o checador acusa a que entra nele.
   - `bloco2` (a **virada**: a frase-bloco da frase de virada, com chicote) e `base4` (a legenda que volta depois dela).
     Fala curta também tem virada: ponha-a na frase que muda o rumo ("mas", "só que", "e aí").
   - `cta`: o comando fixo Comenta “PALAVRA” (só se a fala pede comentário); `fecho`: o dissolve para o preto, 2 quadros
     antes das últimas palavras (o resto da fala segue na legenda até o fim).
   - `previas`, `base3b`: a janela das prévias e a troca de enquadramento dela.
   - **Desligar** um trecho que a fala nova não tem: `null` (ex.: `previas: null, base3b: null` sem prévias;
     `cta: null` sem chamada). O tempo dele passa para o próximo trecho ligado; nada quebra.
   - Os zooms de cada trecho estão em `ENQ` (1,0 a 1,18). Com o queixo mais baixo que o da vitrine, zoom
     alto põe o queixo na legenda ou no bloco: o checador diz o zoom máximo de cada trecho.
2. **`LETREIRO`**: a palavra-tema dita que vira o letreiro atrás da pessoa e sai da legenda; `null` desliga
   (aí o `pessoa.webm` só é preciso com `fundoCor`). Ele fica da palavra até o próximo trecho de `T` e precisa de 1,5 s
   na tela; perto do fim, o próximo trecho é o `fecho` (o preto): ponha o fecho pelo menos 1,5 s depois da palavra do
   letreiro (ou `fecho: null`). Palavra do letreiro dita depois do fecho faz o molde parar.
3. **`LEG_Y_PLANO`**: o molde vem com `1060`, a posição fixa da vitrine. Num vídeo novo, troque por `null` e a legenda vai sozinha para logo abaixo do queixo medido
   (`src/rosto.json`, com o maior zoom dos trechos em que há legenda; o checador mostra a conta). A vitrine fixa 1060.
4. **`PEDACOS`**: as páginas da legenda, `[índice da 1ª palavra, 'texto / 2ª linha', até?]`. O texto tem de
   ser o da fala (maiúscula, acento e pontuação não contam). Palavras de um bloco ou do letreiro não entram aqui. O 4º
   campo (`'vitrine'`) é só da página aprovada da vitrine; num vídeo novo, não use.
5. **`BLOCOS`**: os textos de cada frase-bloco, da tela creme e do Comenta. O bloco acha a 1ª palavra pelo
   próprio texto, perto do início dele (até 1 s), então pode andar uns quadros sem perder palavra. O `top` da frase-bloco
   é `topoBloco(zoom do trecho)`: logo abaixo do queixo. Num close o bloco desce e pode passar de y 1500; o checador
   diz o `top` que cabe e, se o queixo não deixa, o zoom do trecho em `ENQ` que abre o plano (o destaque não encolhe,
   REGRAS §4).
6. **`FOLGA`**: quanto o vídeo segue depois da última palavra (o `scripts/som.py` lê daqui).
7. **Som**: refaça o PLANO DO SOM de `scripts/som.py` com os mesmos trechos de `T` e rode o `som.py`.
8. **Recorte** (se houver letreiro ou `fundoCor`): `scripts/recorte.py`, pela trava (passo 1 de "Como gerar").
9. **Prévias** (opcional, só se a fala fala delas): `../../.venv/Scripts/python.exe ../../tools/previa.py
   <um vídeo seu pronto.mp4> . 1 --de 0` e o mesmo com `2`; depois renderize com `"previas": true`. Sem elas, deixe
   `previas: false` (o padrão) e, se a fala não as cita, `T.previas: null`.
10. **Checador** até zerar: `node scripts/cobertura.mjs`. Ele diz o que mexer (juntar página curta, segurar mais, mover
   bloco, baixar zoom). Depois, a folha de quadros (`scripts/quadros.mjs` + `montar.py`).
11. **Render e mixagem** como em "Como gerar" (passos 4 e 5): sem `--props`, o render sai com os padrões do modelo.

## O que é específico do vídeo de origem (refazer num vídeo novo)
- `T`, `LETREIRO`, `PEDACOS`, `BLOCOS` e `FOLGA` de `src/Corte.tsx` estão presos às palavras da vitrine.
- Os golpes de `scripts/som.py` repetem os cortes e ênfases desse plano.
- O plano da vitrine:

| De (s) | Fala | Na tela |
|---|---|---|
| 0,00 | Esse vídeo está sendo 100% editado pelo Claude. | frase-bloco de 3 linhas, *Claude.* vermelha |
| 3,02 | Ele foi criado justamente para te mostrar a diferença entre vários modelos que eu criei e melhorei | legenda; letreiro MODELOS atrás da cabeça (6,06 a 8,04) |
| 8,04 | para editar qualquer tipo de vídeo usando o Claude. | legenda |
| 10,64 | Inclusive, se você estiver no Instagram agora, | legenda |
| 12,58 | você está vendo apenas um desses modelos. | tela de destaque creme, 3 linhas |
| 14,44 | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | legenda (2ª posição com prévias); prévias em cima até 19,93 |
| 19,93 | Mas se você quiser realmente ver outros modelos de edição | frase-bloco de 4 linhas, *modelos* vermelha |
| 23,25 | como esse e aprender a como usar isso nos seus vídeos, | legenda |
| 26,69 | comenta edição | Comenta “*edição*” fixo até o fim |
| 27,85 | aqui embaixo que eu vou te mandar na sua DM agora. | legenda; dissolve para o preto em 28,21 |

## Origem
Copiado da vitrine dos modelos (revisão 4, 2026-10-12), que partiu do corte 9:16 aprovado do modelo (2026-10-06). Ao
entrar no estúdio, o molde passou a ler a entrada padrão (a mediana do rosto saiu do `preparar.py`, apagado, e passou a
ser calculada no `Corte.tsx`, com os mesmos valores), o recorte usa o RVM de `../../tools/modelos/`, o checador usa a
trava e o Python do estúdio, e a duração da trilha é medida de `public/voz.wav`. 2026-10-13 (teste do estúdio aberto):
plano que não bate com a fala para com mensagem em português, texto comparado sem maiúscula/acento/pontuação, trechos
opcionais desligam com `null`, bloco acha a 1ª palavra pelo texto, música opcional no `mixar.sh` (golpes em
`efeitos.wav`), duração a partir das palavras; os quadros da vitrine saem iguais (mesmo hash).
2026-10-13 (retestes com fala nova): `LEG_Y_PLANO = null` põe a legenda sozinha abaixo do queixo medido; os trechos de `T`
fora de ordem e o letreiro depois do fecho param com mensagem; a duração tem uma fonte só (`FOLGA` + `QUADROS`, também no
`som.py`); o texto da tela creme some com ela sob o preto do fecho e a legenda que ainda está na tela quando o creme
entra fica por baixo dele (a página da vitrine leva `'vitrine'` e sai como foi aprovada); o checador mede queixo x
legenda e x blocos e diz o `top` ou o zoom de `ENQ` que resolve; o `mixar.sh` para se o som for de outra fala; o
`recorte.py` usa só o provedor do onnxruntime que existe. Os quadros da vitrine saem iguais (mesmo hash).
