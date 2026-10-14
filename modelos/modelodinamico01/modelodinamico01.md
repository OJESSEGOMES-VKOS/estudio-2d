# modelodinamico01: a tela encena a frase

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (30 s, com a voz). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo) e o `mapa.json`
(rosto, luz e cortes medidos a cada 0,25 s). Antes de editar, assista ao vídeo inteiro uma vez. O mesmo vídeo em qualidade cheia está no `original.mp4`, para ler letra pequena e detalhe de tela.

**A referência mostra o jeito do modelo, não um roteiro para copiar.** Siga a cara, os números e as regras; as telas, os textos e os cortes do vídeo novo nascem da fala nova. Não repita as cenas do aprovado só porque estão lá.

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

Uma pessoa falando, e a tela **encena cada frase com interface de verdade**: janela do Claude Code, campo de prompt,
pasta e arquivo entrando, celular com o próprio Reel, caixa de comentário digitando. Nada de ícone genérico nem selo.
- **Fundo creme `#F1ECE3` com grade fina** a cada 60 px (0 s a 13 s, 21 s a 29 s).
- **Quatro modos de tela** que se alternam com **corte seco**: palco, tela cheia de motion, dividido e rosto cheio.
- **Uma frase, um card.** Dentro do card acontece uma microação a cada 0,5 a 1 s: digitar, cursor clicar, pasta entrar,
  item ganhar ✓ (5 s a 7 s).
- **A legenda é a espinha:** sempre na tela, sempre no lugar do modo, poucas palavras, a palavra-chave em serifa itálica
  terracota (1 s, 10 s).
- **Fecho com a interface do pedido:** a caixa de comentário digita a palavra e publica, e a DM chega (27 s a 29 s).
- **Só efeitos sonoros, sutis**, sem música.

## 2. Os números do modelo (o `parece.py` confere)

| Item | Valor | O que é |
|---|---|---|
| Brilho | 175 (de 0 a 255) | Vídeo claro: o creme domina |
| Contraste | 221 | Preto da tinta contra o creme |
| Saturação | 30 | Pouca cor; o terracota é o único acento |
| Temperatura | +3,7 | Levemente quente (o creme) |
| Rosto no plano aberto | 22% da altura do quadro | Rosto pequeno, dentro de card (5 s) |
| Rosto no plano fechado | 27% da altura do quadro | Dividido e rosto cheio (3 s, 20 s) |
| Altura do rosto | centro a 67% do topo | O rosto mora na metade de baixo: vem do palco e do dividido |
| Tempo por modo | palco 42%, motion 27%, dividido 26%, rosto cheio 5% | Tabela da seção 3 |
| Rosto no centro horizontal | 50% | |
| Cabeça cortada pelo topo | 0% do tempo | Nunca |
| Tempo com rosto na tela | 88% | O rosto quase nunca sai |
| Cortes | cerca de 24 por minuto | Um corte a cada 2,5 s, em média |

## 3. Os quatro modos de tela e o ritmo

Quadro de 1080x1920, 30 quadros por segundo.

**Quanto tempo cada modo fica na tela** (medido no vídeo aprovado; a altura do rosto que o `parece.py` cobra sai dessa
mistura):

| Modo | Tempo no aprovado | Rosto: tamanho (altura do quadro) | Rosto: centro (do topo) |
|---|---|---|---|
| M1 Palco | 42% (12,8 s em 3 cenas) | 22% a 23% | 85% |
| M2 Motion | 27% (8,3 s em 3 cenas) | sem câmera aberta; o rosto do celular: 15% a 17% | 29% |
| M3 Dividido | 26% (7,8 s em 2 cenas) | 26% a 28% | 63% |
| M4 Rosto cheio | 5% (1,5 s em 1 cena) | 34% | 36% |

- O palco é o modo principal: perto da metade do vídeo. O rosto cheio é raro: no máximo 1,5 s a cada 30 s e nunca mais
  de 10% do vídeo. Ele leva o rosto para o alto do quadro; mais que isso, o `parece.py` reprova a altura do rosto.
- **Ordem típica:** motion no gancho, dividido, palco (a maior parte), motion ou rosto cheio de virada, palco, motion no
  fecho. Num vídeo de 10 s: motion 2 a 3 s, dividido cerca de 2 s, palco 4 a 5 s e no máximo 1 s de rosto cheio.
- O tamanho do rosto em cada modo vem do código (o dividido se ajusta ao rosto medido em `src/rosto_med.json`). Não mude
  as escalas: rosto de outro tamanho ou em outra altura vem da gravação ou da mistura de modos.

**M1 Palco** (5 s a 10 s, 13 s, 21 s a 26 s). O rosto nunca sai; a explicação acontece em cima.
- Fundo creme com grade.
- **Título no topo:** linha 1 em Instrument Serif itálica, 112 px, terracota `#D97757`; linha 2 em Geist 500, 96 px,
  preta `#161412`, letras apertadas (-0,035 em); embaixo, um traço de pincel terracota de 460 px de largura e 7 px de
  espessura que se desenha em 0,4 s. Entra da direita com desfoque em 0,28 s. **O título fica a seção inteira** e só
  troca quando o assunto troca ("a diferença / entre modelos" de 5 s a 10 s; "nos seus vídeos" de 24 s a 26 s).
- **Num vídeo novo o título tem 1 linha** (só `serif`, sem `sans`), topo em y 255, até 14 letras (a serifa de 112 px passa de x 940 com mais que isso). O título de
  2 linhas do aprovado começa em y 205, fora da zona segura, e mais baixo ele bate no card: não use.
- **Card no meio:** x 57 a 1023, y 453 a 1158 (966x705), raio 18, sombra macia. Papel `#FBF8F2` ou escuro `#161616`
  (app). Entra subindo 60 px com mola.
- **Legenda logo abaixo do card:** Geist 700, 54 px, preta, centrada, topo em y 1195 (2 linhas cabem antes do card do
  rosto).
- **Rosto num card embaixo:** x 109, topo em y 1330, 862x640, raio 36, sangrando para fora da base do quadro.

**M2 Tela cheia de motion** (0 s a 2 s, 11 s a 12 s, 27 s a 29 s). Sem câmera aberta.
- Fundo creme com grade. Um visual grande: o celular com o próprio Reel (500x1040, raio 80, 0 s), o celular no Reels
  (570x1170, raio 86, 11 s), a folha de comentários (27 s).
- **Legenda grande:** Geist 800, 84 px, preta, letras apertadas (-0,03 em), topo em y 1290, até 2 linhas (termina antes
  de y 1500). O visual do motion fica entre y 150 e 1270: o celular no Reels da cena aprovada desce até y 1352; num vídeo
  novo, use-o com 520x1060. No fecho a legenda sobe para o topo, em y 250 (27 s).

**M3 Dividido** (3 s a 4 s, e as prévias de 15 s a 19 s).
- Divisa em y 858. Em cima, o creme com um visual num card (janela do Claude Code 860x660, raio 26, 3 s). Embaixo, o
  rosto.
- **Legenda em etiqueta:** Geist Mono 500, 40 px, MAIÚSCULA, branca, numa caixa `#1F1F1F` de raio 8, centrada sobre a
  divisa (topo em y 824) ("ELE FOI", 3 s).

**M4 Rosto cheio** (20 s). Para a virada de impacto, curta: até 1,5 s.
- O rosto ocupa a tela, com um punch-in leve (20 s).
- **Legenda no peito:** Geist 700, 78 px, branca, com sombra (`0 4px 18px rgba(0,0,0,.45)`), topo em y 1200. A
  palavra-chave em Instrument Serif itálica, terracota claro `#F3A585`, 1,3 vezes maior ("Mas se", 20 s).

**Ritmo.**
- Troca de modo por frase: cada cena dura de 2 a 5 s. O rosto cheio de virada dura 1 a 1,5 s.
- **Frase de virada longa** (mais de 1,5 s): o rosto cheio pega só as primeiras palavras, até 1,5 s ("Mas se"), e um
  corte seco, 2 quadros antes da palavra seguinte, leva o resto da frase para o palco ou o dividido. Em `base()` são duas
  cenas: `['mas', 'rosto', corte(w('mas'))]` e `['outros', 'palco', corte(w('ver'))]`.
- Frase longa em qualquer modo segue a mesma regra: passou de 5 s, quebre num corte entre duas palavras.
- **Corte seco entre modos, 2 quadros antes da palavra que abre a frase.** Zero quadro de transição. Toda a animação mora
  dentro da cena.
- Dentro do palco, o card troca de conteúdo no lugar com **chicote**: o novo entra da direita com desfoque em 0,24 s e o
  velho sai para a esquerda em 0,2 s (8 s).
- Elemento que entra num card desliza de fora em cerca de 8 quadros, ou surge com um "pop" de mola (escala 0,6 para 1).
- Entrada de elemento: 6 a 10 quadros. Saída rápida, com leve passada.

## 4. Os elementos que se repetem (a assinatura)

- **O próprio Reel dentro de um celular** ("esse vídeo"), com um selo branco ao lado que conta até "100%" (400x200,
  raio 30, 1 s).
- **Janela do Claude Code** criando a pasta e os arquivos, linha a linha (3 s a 4 s).
- **Lista de pastas que entram uma a uma e ganham ✓**, em Geist Mono 500, 32 px, com uma barra terracota de seleção que
  desce (5 s a 7 s).
- **Grade de miniaturas dos formatos** (reel 9:16, youtube 16:9, podcast, pregação), trocada com chicote (8 s a 10 s).
- **Celular no Reels:** toque com anel branco e coração que cresce (11 s a 12 s).
- **Caixa de seleção com alças** estilo Figma (borda azul `#3B82F6` de 4 px, alças brancas de 14 px), em volta de um
  nome ou da palavra do pedido (13 s, 28 s).
- **Catálogo de miniaturas** com o cursor andando e clicando (cursor com rótulo, Geist 700, 24 px) (22 s a 23 s).
- **Campo de prompt do Claude** digitando o comando, o arquivo entrando e o botão virando verde `#2FB765` (24 s a 26 s).
- **Interface do Instagram:** folha de comentários (raio 44 em cima, título "Comentários" Geist 700, 34 px), comentário
  fixado, campo "Adicione um comentário" e a DM chegando em banner no topo (27 s a 29 s). Botão azul `#0095F6`.
- **Só o @ e a foto reais de quem fala** aparecem nas telas de Instagram (props `arroba` e `foto`). Sem eles, o elemento
  some. Nunca nome de exemplo.
- **Nunca escreva o nome do modelo na tela** num vídeo novo. A fala pode dizer "um desses modelos"; o nome escrito não
  entra.
- O texto de tela mostra o que está sendo dito. Número e frase exatamente como foram falados.

## 5. A legenda (conta a história)

- **Toda palavra dita aparece na tela, uma vez só, em ordem.**
- Entra palavra por palavra (cada uma sobe 14 px e acende em 0,14 s), acumulando até o pedaço fechar.
- O código corta a fala em grupos de até 3 palavras (numa pontuação, numa pausa maior que 0,3 s ou num corte) e, num
  vídeo novo, junta grupos vizinhos até o pedaço durar 1,5 s. **Nunca atravessa um corte.**
- **Fala sem pausa:** corte só depois de uma palavra com mais de 0,46 s. Se o rosto cheio, a cena mínima e o tempo de
  leitura não couberem juntos, o tempo de leitura vence: tire o rosto cheio e dê o tempo dele ao palco.
- **A junção é gulosa:** se o último pedaço de uma cena ficar curto, mova o corte de entrada da cena, não o de saída.
- **A última cena** tem de começar a mostrar a legenda pelo menos 1,5 s antes do fim (o vídeo acaba 0,73 s depois da
  última palavra).
- **Até 2 linhas por pedaço.** A junção para quando o próximo grupo faria 3 linhas no lugar do modo. Com fala rápida, o
  pedaço que parou cheio (2 linhas) precisa de só 1 s na tela.
- **Tempo de leitura:** cada pedaço fica pelo menos 1,5 s (o cheio, 1 s) e cada palavra pelo menos 0,4 s depois de nascer
  (no pedaço cheio as palavras não têm esse mínimo). Num vídeo novo, ponha `MIN_PEDACO = 1.5` em `src/Legenda.tsx`. Nada
  pisca.
- O conferidor acusou pedaço curto no fim de uma cena? A cena acaba cedo: leve o corte para a próxima pausa da fala.
- **Palavra-chave** (o termo protagonista: número, nome da ferramenta, a palavra do pedido): Instrument Serif itálica,
  terracota `#D97757` sobre o creme ou `#F3A585` sobre o rosto, 1,25 a 1,3 vezes maior ("100%", 1 s; "Claude", 10 s).
  No dividido não há chave: tudo em mono maiúscula.
- **A palavra que a pessoa vai comentar** sai em MAIÚSCULA e com a caixa de seleção com alças ("EDIÇÃO", 27 s).
- Sem pílula sobre o creme: texto preto direto. Etiqueta só no dividido.
- **Posição num vídeo novo:** uma por modo, sempre a mesma (palco y 1195, motion y 1290, dividido y 824, rosto y 1200;
  fecho y 250), todas dentro da zona segura com 2 linhas.

## 6. Fecho e som

- **O fecho só entra se a fala pede um comentário** ("comenta..."). Sem pedido, o vídeo termina na última cena e
  `CAIXA_ALTA` e `SELECAO` ficam vazios.
- **Fecho:** a folha de comentários sobe, a palavra do pedido é digitada no campo, publicada e fica selecionada; a DM
  chega em banner no topo. A legenda vai para o topo, em y 250 (27 s a 29 s).
- **Som:** só efeitos, sutis, que dão vida sem poluir. **Sem música.**
  - Elemento que surge leva um **"popup" grave** (corpo grave que sobe um pouco e um estalo macio), nunca swoosh.
  - Corte entre modos: o mesmo popup, mais baixo quando o corte vai para o rosto.
  - Clique, tecla, item que entra e ✓ ganham o som deles, no quadro do evento visual.
  - Mixagem: efeitos 10 dB abaixo, cerca de 16 LU sob a voz; final em -14 LUFS e pico de -1 dBTP.
- **Prévias (opcional):** o modo dividido com dois clipes de vídeos seus acelerados 3 vezes em cima, cada um com o nome
  do modelo numa etiqueta e o selo "3x" (15 s a 19 s). Nunca use vídeo de terceiro. Sem prévias, o molde põe esse trecho no
  rosto cheio, longo demais para um vídeo novo: sem prévias, troque o modo dessa cena em `base()` para palco ou dividido
  com um visual do que a fala diz.

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Voz no render | **ligada** | Prop `voz: false` |
| Efeitos sonoros do modelo (popup grave, clique, tecla) | **ligados** | Sem o 3º argumento no `mixar.sh` sai só a voz |
| Música | desligada (o modelo não tem) | não há opção |
| @ nas telas de Instagram | vazio (escondido) | Prop `arroba: "seu.arroba"` (sem o @), só o real de quem fala |
| Foto do perfil | vazia (escondida) | Prop `foto: "foto.jpg"` (arquivo em `public/`) |
| Prévias | desligadas | Prop `previas: true`, `nomesPrevias: ["modeloA","modeloB"]` e `som.py --previas` |

Os padrões vêm do `src/Root.tsx`: `{voz: true, previas: false, nomesPrevias: ['modelopadrao01', 'youtubeedition01'],
arroba: '', foto: ''}`.

## 8. Zona segura e rosto

- Todo texto fica em x 60 a 940 e y 250 a 1500 (1080x1920). A zona é assimétrica de propósito: a coluna de botões do
  Instagram ocupa os 140 px da direita. Por isso a legenda centra em x 500, não em 540. O molde guarda os números do aprovado; num vídeo novo,
  `LUGAR` em `src/Legenda.tsx` fica assim (fonte e chave não mudam):
  `motion: {topo: 1290, topoAlto: 250, esq: 60, dir: 140}`, `palco: {topo: 1195, esq: 60, dir: 140}`,
  `dividido: {topo: DIVISA - 34, esq: 60, dir: 140}`, `rosto: {topo: 1200, esq: 60, dir: 140}`.
- Título do palco: 1 linha, topo em y 255.
- Nenhum texto cobre o rosto. O rosto mora nos cards de baixo ou no rosto cheio.
- No máximo 2 linhas por pedaço de legenda e 1 linha no título.
- Nome e @ na tela, só os reais de quem fala, ou nenhum.

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo".

1. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py modelodinamico01 <gravacao.mp4> <AAAA-MM-DD-tema>`.
   Isso cria `videos/<AAAA-MM-DD-tema>/`, transcreve a fala (`src/palavras.json`), mede o rosto (`src/rosto.json`) e adapta
   a gravação ao modelo. Nome que a transcrição erra se corrige já aqui: `--trocar Cloud=Claude` (pode repetir). Ao carregar, o molde para de propósito: primeiro pede o rosto novo, depois diz qual palavra do
   plano a fala nova não tem.
2. **Meça o rosto médio:** `../../.venv/Scripts/python.exe scripts/rosto.py` (na pasta do vídeo). Grava
   `src/rosto_med.json`.
3. **Escreva o `plano.md`** na pasta do vídeo, frase a frase sobre `src/palavras.json`: o modo de cada frase, o que a tela
   encena (a interface de verdade daquele ato), o título de cada seção e as palavras-chave. Siga a gramática da seção 10.
4. **Monte o plano no código** (na pasta do vídeo). Toda palavra é presa à fala por `w('palavra', n)` (o início da
   n-ésima vez que ela é dita) ou `iw` (o índice):
   - `base()` em `src/tema.ts`: uma cena por frase, `[id, modo, corte(w('palavra que abre a frase'))]`. Modos:
     `'palco'`, `'motion'`, `'dividido'`, `'rosto'`. O 4º item `true` põe a legenda do motion no topo (fecho).
   - As cenas em `src/Cenas.tsx` (`CENA_COMP`): uma por id. Os textos de tela da cena aprovada (lista de pastas, nomes de
     arquivo, comentário fixado) são daquele vídeo: troque pelo que a fala nova diz.
   - **Para remover uma cena:** tire a linha dela de `base()` e a entrada dela de `CENA_COMP`; tire os eventos dela de
     `scripts/som.py`; tire de `CHAVE`, `CAIXA_ALTA` e `SELECAO` as palavras que eram dela. O componente pode ficar no
     arquivo: o conferidor só cobra palavras e títulos das cenas que `base()` usa. A primeira cena de `base()` começa em 0.
   - Antes de fechar `base()`, some o tempo de cada modo e compare com a tabela da seção 3.
   - Em `src/Legenda.tsx`: `CHAVE` (palavras-chave), `CAIXA_ALTA` (a palavra do pedido), `SELECAO` (a que ganha alças),
     `MIN_PEDACO = 1.5` e `LUGAR` com os números da seção 8.
5. **Confira as regras:** `node scripts/cobertura.mjs` (na pasta do vídeo) até sair `APROVADO`. Ele confere se as palavras
   do plano existem na fala, se toda palavra dita aparece na legenda, o tempo de leitura, repetição, até 2 linhas, um
   lugar por modo e a zona segura, com e sem prévias, e diz o arquivo e a linha.
6. **Som:** refaça os eventos de `scripts/som.py` com as mesmas palavras das cenas e rode
   `../../.venv/Scripts/python.exe scripts/som.py` (na pasta do vídeo). Sai `public/sfx.wav`.
7. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10` (na pasta do vídeo). Com o
   seu perfil: `--props '{"arroba":"seu.arroba","foto":"foto.jpg"}'`. Os quadros saem em `conferencia/`.
8. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineDinamico01 out/so-voz.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"arroba":"seu.arroba","foto":"foto.jpg"}'`
   (tire `arroba` e `foto` se a pessoa não deu os dela).
9. **Mixe:** `sh scripts/mixar.sh out/so-voz.mp4 out/final.mp4 public/sfx.wav` (na pasta do vídeo). Sai em -14 LUFS.
10. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 modelodinamico01`.
    Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
    em cima e o seu embaixo. Se a diferença salta aos olhos, ainda não está pronto.

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<v> 1` (e `2`; `--de`/`--ate`
escolhem o trecho), depois `../../.venv/Scripts/python.exe scripts/som.py --previas` (na pasta do vídeo), o render com
`--props='{"previas":true,"nomesPrevias":["modeloA","modeloB"]}'` e a mixagem com `public/sfx_previas.wav`.

## 10. O plano do vídeo aprovado (para comparar)

| Tempo | Fala | Modo / corte | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. | M2 motion | o próprio Reel no celular; selo "100%" conta e salta (1 s); legenda grande com "100%" e "Claude" em serifa |
| 3 s | Ele foi criado justamente para te mostrar a | corte seco, M3 dividido | janela do Claude Code criando a pasta do vídeo e os arquivos; etiqueta mono "ELE FOI", "JUSTAMENTE PARA" |
| 5 s | diferença entre vários modelos que eu criei e melhorei | corte seco, M1 palco | título "a diferença / entre modelos"; as pastas dos modelos entram uma a uma e ganham ✓ |
| 8 s | para editar qualquer tipo de vídeo usando o Claude. | chicote dentro do card | grade com reel 9:16, youtube 16:9, podcast e pregação; "Claude" em serifa (10 s) |
| 10,6 s | Inclusive, se você estiver no Instagram agora, | corte seco, M2 motion | celular no Reels, toque e coração (12 s) |
| 12,5 s | você está vendo apenas um desses modelos. | corte seco, M1 palco | título com o nome do modelo e a caixa de seleção com alças no reel do meio |
| 14,4 s | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | corte seco, M3 dividido com prévias | dois clipes com etiqueta do modelo e selo "3x"; etiqueta mono "COLOCAR DUAS PRÉVIAS", "ACELERADAS" |
| 19,9 s | Mas se você quiser realmente | corte seco, M4 rosto cheio | punch-in no rosto; "Mas se" no peito |
| 21,4 s | ver outros modelos de edição como esse | corte seco, M1 palco | título "outros modelos / de edição"; catálogo de miniaturas, cursor clica numa |
| 24,1 s | e aprender a como usar isso nos seus vídeos, | chicote, título troca | título "nos seus vídeos"; prompt do Claude digitando o comando, o arquivo entra, botão verde |
| 26,7 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | corte seco, M2 motion, legenda no topo | folha de comentários, "EDIÇÃO" digitado, publicado e selecionado; a DM chega (29 s) |

No vídeo aprovado as prévias estão ligadas e o @ e a foto são os reais de quem fala. Os nomes de pasta, de arquivo e o
nome do modelo escritos na tela são daquele vídeo; num vídeo novo, a tela mostra o que a fala nova diz.
