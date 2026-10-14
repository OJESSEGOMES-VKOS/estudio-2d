# pregacaodinamica01: corte de pregação dinâmica

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (30 s, 9:16, com a voz). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo) e o `mapa.json`
(rosto, luz e cortes medidos a cada 0,25 s). Antes de editar, assista ao vídeo inteiro uma vez.

---

## 0. Do seu jeito (o aluno preenche, se quiser)

Escreva aqui, com as suas palavras, o que vale para todos os seus vídeos neste modelo. Pode ir somando com o tempo.

- Meu nome e @ (só onde o modelo mostra):
- Minha foto de perfil (nome do arquivo na pasta do estúdio):
- Chamada do fim (o que peço para a pessoa fazer):
- Gosto de:
- Não quero:

**Para o Claude:** leia esta seção antes de tudo e siga o que está nela. Ela decide o conteúdo e as opções da seção 7,
mas não muda a cara do modelo (cores, fontes, posições, ritmo). Se um pedido daqui mudar a cara, avise antes de fazer.
Quando a pessoa corrigir algo num vídeo e a correção valer para os próximos, ofereça anotar aqui, nas palavras dela.

---

## 1. A cara do modelo

A fala é a estrela: **a voz e o rosto de quem fala mandam**, a edição só amplifica.
- **Quase todo o vídeo é a pessoa com uma legenda corrida no peito**, as palavras nascendo junto com a voz (3 s a 11 s).
- **A cada 5 a 10 s, um momento de ênfase** na frase mais forte, e nada de enfeite fora desses picos:
  - a **frase-bloco que se monta** em tamanhos misturados, com a última palavra em serifa itálica vermelha (0 s a 2 s,
    20 s a 22 s);
  - o **letreiro gigante atrás da pessoa**, com ela na frente (6 s a 8 s);
  - a **tela de destaque creme** com a frase protagonista (13 s).
- **Abre direto na frase mais forte**, já em frase-bloco. Nada de vinheta no início (0 s).
- **Fecha no preto**; quando a fala tem o comando, ele fica fixo: Comenta “edição” (27 s a 29 s).
- **Sem preto e branco. Sem tingir o fundo** (opção desligada).

## 2. Os números do modelo (o `parece.py` confere)

| Item | Valor | O que é |
|---|---|---|
| Brilho | 86 (de 0 a 255) | Médio-escuro |
| Contraste | 161 | |
| Saturação | 68 | Cor natural da gravação |
| Temperatura | +2,9 | Levemente quente |
| Rosto no plano aberto | 28% da altura do quadro | (0 s) |
| Rosto no plano fechado | 32% da altura do quadro | (8 s) |
| Altura do rosto | centro a 35% do topo | Cabeça no terço de cima |
| Rosto no centro horizontal | 50% | |
| Cabeça cortada pelo topo | 0% do tempo | Nunca |
| Tempo com rosto na tela | 88% | |
| Cortes | cerca de 10 por minuto | Planos longos (2 a 6 s, ou mais) |

## 3. Câmera e ritmo

- **Corte seco** entre planos, sempre na troca de frase, 2 quadros antes da palavra.
- **Troca de enquadramento** entre aberto e próximo, de zoom 1,0 a 1,18, e **zoom lento contínuo** dentro do plano (1,2%
  por segundo). No vídeo aprovado: 1,0 na abertura (0 s), 1,1 em "Ele foi criado" (3 s), 1,18 em "para editar" (8 s),
  1,06 em "Inclusive" (11 s), 1,14 sem prévias em "aqui em cima" (17 s), 1,04 na virada (20 s), 1,16 depois dela (23 s),
  1,0 no fecho (27 s).
- Com zoom alto, o queixo desce. O queixo nunca pode encostar na legenda ou no bloco: se encostar, baixa o zoom.
- **Chicote borrado** para entrar e para sair de uma frase-bloco: o bloco desliza 18 px e borra (22 px) em 2 quadros, junto com o corte.
- **Dissolve rápido** de 6 quadros para entrar na tela creme (13 s) e para o preto do fecho (28 s).
- **Abertura:** a frase mais forte do trecho, nos primeiros 1 a 2 s.

## 4. Os momentos de ênfase (a assinatura)

**Fontes e cores:** Inter (800 e 900) para tudo; Instrument Serif itálica só para a palavra de peso. Branco quente
`#F3EDE4` na base; vermelho vivo `#FF2424` como a única cor de ênfase.

**Frase-bloco que se monta** (0 s a 2 s, 20 s a 22 s):
- A frase da tese fica na tela e cresce palavra por palavra, com **tamanhos misturados**: ligação menor (Inter 900, 80 a
  96 px), palavras de peso grandes (110 a 150 px), e a **última palavra em Instrument Serif itálica vermelha, a maior**
  (190 a 250 px) ("*Claude.*", 2 s; "*modelos*", 22 s).
- Cada palavra sobe desfocada (10 a 14 px de desfoque) em cerca de 4 quadros, junto com a voz.
- Fica logo abaixo do queixo, na largura de 940 px. Sai em chicote borrado junto com o corte.
- **No máximo 4 linhas**, e cada degrau de tamanho conta como linha: nada de empilhar palavra pequena "subindo" ao lado
  da grande.
- A frase-bloco também marca a **virada** (a frase que muda o rumo: "mas", "só que", "e aí") (20 s).

**Letreiro gigante atrás da pessoa** (6 s a 8 s):
- **Mostra parte da frase que está sendo dita**, e essas palavras saem da legenda. Nunca repete atrás uma palavra que já
  está na legenda ("MODELOS").
- Inter 900, 176 px, letras apertadas (-0,05 em), em MAIÚSCULA, no topo da zona segura (y 260), com deriva curta e sem
  rolar para fora do quadro. Entra letra por letra, cada uma subindo 40 px de um desfoque de 12 px.
- A pessoa fica **na frente** (recorte com transparência). Cor vermelha `#FF2424` para ler na parede clara (com o fundo
  tingido ligado, verde-água claro `#BFE8E0`).
- Fica na tela pelo menos 1,5 s.
- **Escolha uma palavra cuja saída não deixe a legenda estranha.** Numa enumeração ("cada corte, cada legenda"), tirar
  "corte" deixa "Cada cada legenda": prefira o termo protagonista fora da enumeração, ou não use letreiro ali.

**Tela de destaque creme** (13 s):
- **Só para a fala protagonista** ("você está vendo apenas um desses modelos."). Fala coadjuvante ("Inclusive, se você
  estiver no Instagram agora") fica na legenda.
- Fundo creme chapado `#EDE3D3`. Texto **tinta escura `#1A1512`** (Inter 800, 96 px), a palavra de peso em **vermelho
  escuro `#C8141B`**, Instrument Serif itálica, 250 px. Topo em y 640. Até 4 linhas, palavra por palavra.
- **Texto branco sobre fundo claro é proibido.**
- Entra em dissolve de 6 quadros. Nenhuma página da legenda fica sobre o creme.

**Outros momentos do modelo** (use quando a fala pede, sempre com o mesmo jogo de sans branca, serifa itálica e vermelho):
- **Palavra-chave em vermelho itálico** dentro de um bloco.
- **Repetição espalhada:** quando a pessoa repete uma palavra, ela aparece várias vezes, pequena e branca, com uma grande
  em vermelho no centro.
- **Sílabas empilhadas:** palavra longa dita devagar entra sílaba por sílaba, empilhada, enorme.
- **Telas criadas** mantêm o texto e ganham uma ilustração minimalista em traço fino, de uma cor, com a peça-chave em
  vermelho.
- **B-roll com a voz por cima** só se o dono mandar os arquivos de B-roll junto com o vídeo. Sem eles, esse trecho vira
  as telas da casa (tela creme com a frase, ilustração em traço). Nunca baixe nem gere B-roll por conta própria.
- **Versão em boneco de brinquedo da pessoa** (mesma pose, em corte seco, na abertura) só com imagem que o dono aprovar.
- "Caprichar nas palavras-destaque" é pedido avulso de um vídeo, não regra.

**Sempre:** **destaque só no termo protagonista** (o assunto: "modelos", "Claude", "edição"), nunca advérbio, verbo
solto ou fala coadjuvante. A legenda é exatamente o que foi dito: nunca invente versículo, nome de igreja ou citação.
**Nunca escreva o nome do modelo na tela.**

## 5. A legenda (conta a história)

- **Toda palavra dita aparece na tela, uma vez só, em ordem.** Nada de trecho falado enquanto um bloco segura a tela sem
  estar escrito. Palavra de um bloco ou do letreiro não se repete na legenda.
- **Inter 800, 60 px, branco quente `#F3EDE4`**, letras apertadas (-0,035 em), entrelinha 1,16, sombra suave de 2
  camadas (`0 2px 4px rgba(0,0,0,.65)` e `0 4px 22px rgba(0,0,0,.6)`), sem caixa. **Sem palavra colorida na legenda.**
- **Surgimento suave e sutil:** cada palavra nasce junto com a voz num fade de cerca de 5 quadros com 10 px de subida.
- **Páginas de até 2 linhas.** Cada página fica pelo menos 1,5 s e cada palavra pelo menos 0,4 s depois de nascer. Fala
  rápida vira página maior; **nenhum pedaço pisca.**
- **Posição fixa, na altura de leitura:** no peito, logo abaixo do queixo medido, centrada na zona segura (x 500). No
  vídeo aprovado, o topo em **y 1060**, a mesma no vídeo inteiro. A legenda **não persegue** o enquadramento e **nunca é
  rebaixada ao pé do quadro**.
- **2ª posição só com as prévias:** topo em y 1352, logo abaixo delas.
- O tamanho da legenda é escolha por vídeo (o dono pode pedir maior ou menor); o padrão é o do vídeo aprovado.

## 6. Som, prévias e fecho

- **Som padrão:** a voz, golpes graves nas ênfases (frase-bloco, letreiro, tela creme, virada, fecho) e um whoosh leve em
  cada corte de base.
- A cama escura é opcional e vem desligada. Quando ligada, fica cerca de 16 dB abaixo da voz, com ducking. Final em
  -14 LUFS e pico de -1 dBTP.
- **Prévias (opcional, só se a fala fala delas):** dois clipes de vídeos seus acelerados 3 vezes, 300x533, no alto da zona
  (x 185 a 815, y 260 a 793), cada um com o nome do modelo numa etiqueta (Inter, 34 px), sobre o próprio vídeo desfocado e
  escurecido; a câmera desce 380 px para o rosto ficar entre as prévias e a legenda (14 s a 19 s). Nunca use vídeo de
  terceiro.
- **Fecho** (27 s a 29 s): fixo só o comando, "Comenta" (Inter 800, 92 px) e a palavra entre aspas, “*edição*” (Instrument
  Serif itálica vermelha, 180 px, com um traço de pincel que se desenha por baixo), abaixo da legenda (topo em y 1222).
  O resto da fala segue na legenda. A imagem dissolve para o preto 2 quadros antes das últimas palavras e segura 0,73 s
  depois da última.
- **Sem o comando dito na fala, não há Comenta:** `cta = null`, e o fecho dissolve para o preto depois da última palavra
  (`fecho` = fim da última palavra + cerca de 0,5 s). Se o último trecho é a tela creme, o fecho também vem depois da
  última palavra: o preto fica por cima do creme e apagaria o texto dele.
- **A palavra de peso da tela creme é o termo protagonista.** Se a frase termina em verbo, ponha o vermelho no termo
  protagonista, mesmo no meio, ou use o verbo só quando ele é o próprio assunto ("editou." num vídeo sobre edição).
- **Fala rápida antes da tela creme:** se a última página da legenda antes dela não fecha 0,4 s por palavra, leve a frase
  inteira para o creme.

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Golpes de som nas ênfases | **ligados** | Sem os efeitos: refaça o PLANO DO SOM de `scripts/som.py` vazio |
| Cama escura (música) | desligada | `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` |
| Fundo tingido (vinho ou azul petróleo) | desligado | Prop `fundoCor: true` |
| Preto e branco e flash negativo | desligados (não fazem parte do modelo) | só se o dono pedir |
| Letreiro atrás da pessoa | **ligado** | `LETREIRO = null` em `src/Corte.tsx` |
| Prévias | desligadas | Prop `previas: true` e `nomesPrevias: ["modeloA","modeloB"]` |

Os padrões vêm do `src/Root.tsx`: `{previas: false, nomesPrevias: ['modelodinamico01', 'storypodcast01'], fundoCor:
false}`. O render sai **sem som**; a voz entra no `mixar.sh`.

## 8. Zona segura, rosto e formato

- Todo texto (legenda, frase-bloco, tela creme, letreiro, fecho, etiquetas das prévias) fica em x 60–940 e y 250–1500
  (1080x1920). O centro do texto centralizado é x 500, o da zona, não o do quadro.
- A zona segura é assimétrica de propósito: a coluna de botões do Instagram ocupa os 140 px da direita, por isso nenhum texto passa de x 940.
- Nenhum texto cobre o rosto: legenda e blocos moram abaixo do queixo medido (`src/rosto.json`).
- No máximo 4 linhas em qualquer bloco; 2 por página de legenda.
- Nome e @ na tela, só os reais de quem fala, ou nenhum.

**O modelo vale para 9:16 e 16:9.** No horizontal:
- a pessoa fica num terço ou no centro; frase-bloco e palavras gigantes ocupam o lado livre, alinhadas à borda; o
  letreiro vira faixa atrás da pessoa;
- com a pessoa no centro, a legenda vai em pares, um pedaço à esquerda e o seguinte à direita, **na altura da cabeça**,
  em **lugar fixo** fora do alcance do rosto no vídeo inteiro, já contando o zoom (por exemplo, a esquerda termina em
  x 560 e a direita começa em x 1400, y 400 de 1080);
- pedaço que ficaria menos de 0,55 s não fecha o grupo: os seguintes entram juntos no mesmo lado, lado a lado e abaixo,
  no mesmo tamanho e fonte; **no máximo 2 linhas por lado**, e a 3ª e a 4ª vão para o lado oposto.

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo".

1. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py pregacaodinamica01 <gravacao.mp4> <AAAA-MM-DD-tema>`.
   Isso cria `videos/<AAAA-MM-DD-tema>/`, transcreve a fala (`src/palavras.json`), mede o rosto (`src/rosto.json`) e adapta
   a gravação ao modelo. O molde para ao carregar e diz qual lista do plano refazer.
   Nome que a transcrição errar (ex.: "Cloud" no lugar de "Claude") se corrige já aqui: `--trocar Cloud=Claude` (pode repetir).
2. **Escreva o `plano.md`** na pasta do vídeo, frase a frase sobre `src/palavras.json`: a frase mais forte (abertura), a
   palavra do letreiro, a fala protagonista (tela creme), a virada e o comando do fecho.
3. **Monte O PLANO** em `src/Corte.tsx` (na pasta do vídeo), nesta ordem:
   - `T`: cada trecho numa palavra, `w('palavra', n)` (início da n-ésima vez que ela é dita), `c()` = 2 quadros antes.
     Trechos, nesta ordem no tempo: `bloco1` (abertura em frase-bloco, obrigatório), `base1` (legenda, obrigatório),
     `base2`, `base3`, `destaque` (tela creme), `previas`, `base3b`, `bloco2` (a virada), `base4`, `cta` (Comenta),
     `fecho` (dissolve para o preto). Trecho que a fala não tem: `null`. Reponha cada trecho no lugar certo da fala nova
     antes de pensar em desligar: eles são a cara do modelo.
   - `ENQ`: o zoom de cada trecho (1,0 a 1,18).
   - `LETREIRO`: `{palavra, texto}`, a palavra-tema dita que vira o letreiro, ou `null`. Ponha o `fecho` pelo menos 1,5 s
     depois dela.
   - `LEG_Y_PLANO`: troque `1060` por `null` e a legenda vai sozinha para logo abaixo do queixo medido.
   - `PEDACOS`: as páginas da legenda, `[índice da 1ª palavra, 'texto / 2ª linha', até?]`, com o texto da fala. O 4º campo
     (`'vitrine'`) é só do vídeo aprovado: não use.
   - `BLOCOS`: os textos de cada frase-bloco, da tela creme e do Comenta (`{txt, tam, serif?, vermelho?, quebra?,
     pincel?}`); o `top` da frase-bloco é `topoBloco(zoom do trecho)`.
   - `FOLGA`: quanto o vídeo segue depois da última palavra (padrão 0,73 s).
4. **Recorte a pessoa** (se houver letreiro ou fundo tingido), na pasta do vídeo e pela trava porque é pesado:
   `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recorte.py`. Grava `public/pessoa.webm`.
5. **Confira as regras:** `node scripts/cobertura.mjs` (na pasta do vídeo; ele pega a trava sozinho, **não** rode dentro do
   `com-trava.sh`) até zerar. Ele confere toda palavra escrita enquanto é dita, página de 1,5 s e palavra de 0,4 s, nada
   repetido, no máximo 2 posições de legenda, até 4 linhas, queixo fora da legenda e dos blocos, nada sobre a tela creme
   e, pixel a pixel, a zona segura; e diz o `top` ou o zoom que resolve.
6. **Som:** refaça o PLANO DO SOM de `scripts/som.py` com os mesmos trechos de `T` e rode
   `../../.venv/Scripts/python.exe scripts/som.py` (na pasta do vídeo). Sai `public/efeitos.wav` e `public/trilha.wav`.
7. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10` (na pasta do vídeo).
8. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrinePregacao out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2`
9. **Mixe:** `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (na pasta do vídeo; voz e golpes). Sai em -14 LUFS.
10. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 pregacaodinamica01`.
    Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
    em cima e o seu embaixo. Se a diferença salta aos olhos, ainda não está pronto.

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<v> 1` (e `2`), a janela em
`T.previas` e o render com `--props='{"previas":true,"nomesPrevias":["modeloA","modeloB"]}'`.

## 10. O plano do vídeo aprovado (para comparar)

| Tempo | Fala | Câmera / transição | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. | aberto 1,0 | frase-bloco: "Esse vídeo está sendo / **100%** editado / pelo / *Claude.*" vermelha |
| 3 s | Ele foi criado justamente para te mostrar a diferença entre vários modelos que eu criei e melhorei | corte seco, 1,1 | legenda no peito; letreiro MODELOS vermelho atrás da cabeça (6 s a 8 s) |
| 8 s | para editar qualquer tipo de vídeo usando o Claude. | corte seco, 1,18 | legenda |
| 10,6 s | Inclusive, se você estiver no Instagram agora, | corte seco, 1,06 | legenda (fala coadjuvante) |
| 12,6 s | você está vendo apenas um desses modelos. | dissolve para a tela creme | "você está vendo / apenas um desses / *modelos.*" em tinta e vermelho escuro |
| 14,4 s | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | corte, prévias (câmera desce) | duas prévias com etiqueta do modelo; legenda na 2ª posição |
| 19,9 s | Mas se você quiser realmente ver outros modelos de edição | corte seco, 1,04 (a virada) | frase-bloco de 4 linhas, "*modelos*" vermelha |
| 23,2 s | como esse e aprender a como usar isso nos seus vídeos, | corte, 1,16 | legenda |
| 26,7 s | comenta edição | corte, aberto 1,0 | "Comenta" e “*edição*” vermelha com pincel, fixos |
| 27,9 s | aqui embaixo que eu vou te mandar na sua DM agora. | dissolve para o preto (28,2 s) | legenda no preto, o comando segue fixo |

No vídeo aprovado as prévias estão ligadas. Os nomes de modelo nas etiquetas das prévias são daquele vídeo.
