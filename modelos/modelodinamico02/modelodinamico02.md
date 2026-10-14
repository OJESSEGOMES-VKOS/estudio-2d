# modelodinamico02: tipografia cinética com um objeto herói

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (45 s, com a voz). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo) e o `mapa.json`
(luz e cortes medidos a cada 0,25 s). Antes de editar, assista ao vídeo inteiro uma vez.

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

**Só a voz, sem rosto na tela.** A frase é escrita na tela palavra por palavra e um objeto no centro faz o que a frase
diz. Aqui **o texto é o design**: grande, em tamanhos misturados, e não uma legenda embaixo.
- **Um mundo de cor, dois fundos** que se alternam a cada tela: preto quente e laranja (0 s escuro, 1 s laranja,
  3 s escuro).
- **Palavras que nascem do desfoque**, uma por uma, junto com a voz (3 s, 13 s).
- **Tamanhos misturados no mesmo bloco:** a ligação pequena e a palavra de peso enorme ("foi ele que / **decidiu**",
  9 s; "muitas / **regras**", 25 s).
- **Palavra de efeito em letra cursiva** com rastro desfocado ("Claude Code", 2 s; "e editou.", 10 s; "calibrando",
  40 s) ou em serifa itálica ("método", 17 s).
- **Um objeto herói por tela quando a fala pede um objeto** (tela de efeito de palavra, como "Cada corte", dispensa),
  sempre em movimento: a faísca do Claude, o arquivo .mp4, o campo de prompt, a grade de
  vídeos, a barra que enche, o mostrador (2 s, 4 s, 13 s, 19 s, 37 s, 39 s).
- **Corte seco com troca de fundo**; duas telas abrem em íris (17 s, 34 s).
- **Fecho com a assinatura:** a foto de quem fala num anel e "já me segue" (42 s a 45 s).

## 2. Os números do modelo (o `parece.py` confere)

| Item | Valor | O que é |
|---|---|---|
| Brilho | 38 (de 0 a 255) | A média do escuro com o laranja |
| Contraste | 58 | |
| Saturação | 174 | Muito saturado: o laranja domina |
| Temperatura | +9 | Bem quente |
| Rosto | nenhum | O modelo não mostra rosto (só a foto pequena do fecho) |
| Cortes | cerca de 26 por minuto | Uma ideia nova a cada 1,5 a 2,5 s |

## 3. Cor, fundo e câmera

- **Fundo escuro `E`:** degradê radial de `#3A1A0E` (no centro, a 35% do topo) para `#130B08`. Texto creme `#FBEFE6`;
  a palavra de acento em laranja `#E0592A`.
- **Fundo laranja `L`:** degradê radial de `#F0743F` (a 30% do topo) para `#E0592A` e `#C9481C` nas bordas. Texto tinta
  `#1A0D08`; a palavra de acento em creme `#FBEFE6`.
- Texto pequeno (abaixo de 120 px) sai com 80% de opacidade da cor do texto.
- **Fundo nunca chapado:** sempre o degradê radial.
- **Começa no fundo escuro `E`**, como o aprovado, e **os fundos se alternam a cada tela**, na batida da palavra forte.
- **A câmera nunca para:** a tela inteira aproxima 1,5% por segundo, a partir do centro (540, 960), do começo ao fim de
  cada tela.

## 4. A tipografia (a assinatura)

- **Fontes:** Inter (500, 700, 800, 900) para quase tudo; Pinyon Script para a palavra de efeito cursiva; Instrument
  Serif itálica para a palavra de peso elegante; Geist Mono 500 para rótulos, números de régua e o @.
- **O bloco de texto** mora numa caixa a partir de x 80, com 920 de largura, centrado (ou alinhado à esquerda, como em
  "Cada corte, cada legenda", 6 s). O topo de cada bloco é escolhido por tela (de y 220 a y 800).
- **Tamanhos:** ligação de 56 a 90 px, em Inter 700, letras apertadas (-0,025 em), entrelinha 1,15. Palavra grande de
  110 a 330 px, em Inter 900, bem apertada (-0,055 em), entrelinha 0,95, 14 px abaixo dela. Cursiva e serifa em peso 400.
- **Entrada da palavra:** nasce 0,04 s antes de ser dita, com desfoque de 18 px, 40 px à direita e transparente, e fica
  nítida em 0,18 s (cerca de 5 quadros).
- **Cursiva com rastro:** atrás da palavra cursiva, uma cópia 1,7 vezes maior, desfocada (16 px) e com 32% de opacidade
  ("Claude Code", 2 s).
- **Efeitos de palavra** (entram 0,18 s depois dela, em 0,27 s):
  - `corta`: a palavra se parte ao meio na horizontal e um traço de 6 px risca por cima ("corte,", 6 s);
  - `sublinha`: um traço grosso se desenha embaixo ("legenda,", 6 s);
  - `moldura`: um retângulo se desenha em volta ("tela", 7 s);
  - `anel`: uma elipse brilhante se desenha em volta, com brilho de 18 px (destaque final, "aplicadas", 30 s).
- **Palavra que vira imagem:** "frame" com quadros reais da gravação dentro das letras (20 s a 21 s); "01" gigante só no
  contorno, 780 px (34 s).
- **Só o assunto vira palavra grande.** Ligação e advérbio ficam pequenos.
- **No máximo 4 linhas por tela.**
- **Uma linha tem um só tamanho e uma só fonte.** Quer a palavra grande e a ligação juntas? São duas linhas. Quando
  faltar linha, a ligação pode ir para a cursiva junto com a palavra de efeito, na mesma linha (*e editou.*).
- Texto de tela são as palavras ditas, na ordem. Número exatamente como foi dito ("100%", 1 s; "160+", 19 s).
- **Nunca escreva o nome do modelo na tela.**

## 5. Os heróis (o objeto que faz o que a frase diz)

- Um objeto por vez, no centro ou embaixo do bloco, sempre crescendo, girando ou se montando.
- Os que se repetem no modelo:
  - a **faísca** do Claude, branca ou laranja (2 s, 8 s, 22 s);
  - **setas convergindo** no objeto (9 s a 10 s);
  - **feixe de luz** ligando um objeto a outro (o arquivo .mp4 e a faísca, 4 s);
  - **mira de gravação** com cantos e "REC" (7 s);
  - **campo de prompt** digitando a frase, Inter 700, 70 px, creme (11 s a 14 s);
  - **pilha numerada** de pastas (17 s);
  - **grade de vídeos** que se enche até o número, com o número em Inter 900, 400 px, laranja (18 s a 19 s);
  - **órbita**: tópicos entrando um a um num arco em volta do centro, Geist Mono 32 px (23 s);
  - **fichas** creme (Inter 700, 38 px, raio 20) ligadas por linhas tracejadas a um centro (25 s a 27 s);
  - **guias** de zona segura num celular desenhado (28 s a 30 s);
  - **barra de dados** enchendo até 100%, com régua e o número em Geist Mono 60 px (35 s a 38 s);
  - **mostrador** com o ponteiro andando (39 s a 40 s).
- **O herói segue as cores do fundo da própria tela.** Ele recebe a tela (`({c})`) e pinta com `cores(c.fundo)`: no
  escuro, `acento` laranja e `fg` creme; no laranja, `acento` creme e `fg` tinta. Nunca cor fixa: herói pintado para um
  fundo some no outro.
- **O herói nasce dentro da tela dele.** A palavra que o dispara tem de ser dita naquela tela; se ela cair em outra,
  ancore no começo da tela com `naTela(c, 'palavra')` (devolve `c.de` quando a palavra não está ali).
- O herói nunca carrega outro texto: só o que a fala diz ou rótulos curtos. Nome de arquivo vem da prop `arquivo`.

## 6. Transições, som e fecho

- **Corte seco** entre telas, sempre com troca de fundo. Cada tela começa 0,06 s (2 quadros) antes da primeira palavra
  dela. Zero quadro de transição.
- **Íris:** a tela nova abre num círculo que nasce do centro (540, 960) e cresce em 0,5 s (15 quadros), com um anel creme
  de 28 px na borda (17 s, 34 s). No máximo 2 ou 3 por vídeo, nas viradas de assunto.
- **Tela mínima:** cada tela fica pelo menos 1,5 s, e cada palavra pelo menos 0,4 s depois de nascer. Num vídeo novo
  isso vence o plano da seção 10, e quem decide é o `cobertura.mjs`.
- **Onde cortar:** de preferência numa pausa da fala de cerca de 0,46 s ou mais (do `end` de uma palavra ao `start` da
  seguinte em `src/palavras.json`). Fala corrida, sem pausa assim: corte na virada de ideia, com cada tela de pelo menos
  1,5 s e cada palavra com pelo menos 0,4 s na tela; quem decide é o `cobertura.mjs`. Tela que passaria de 4 linhas se
  divide na virada de ideia seguinte.
- **Som:** efeitos curtos nas trocas de tela, presos às mesmas palavras. A música (uma cama de acordes) é opcional e vem
  desligada. A trilha abaixa sob a voz; final em -14 LUFS e pico de -1 dBTP.
- **Fecho:** "Mas se você quer / saber mais sobre isso, / já me segue / aqui." com a foto de quem fala num anel laranja
  e o @ em Geist Mono 64 px, creme, em y 1400 (42 s a 45 s). A última tela segura 1,24 s depois da última palavra.

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Voz no render | desligada no `Root.tsx` | Sempre renderize com a prop `voz: true` (o vídeo aprovado tem a voz) |
| Efeitos sonoros nas trocas de tela | **ligados** | Sem o 3º argumento no `mixar.sh` sai só a voz |
| Música (cama de acordes) | desligada | `som.py --cama` |
| @ no fecho | vazio (escondido) | Prop `arroba: "seu.arroba"` (sem o @), só o real de quem fala |
| Foto no fecho | vazia (escondida) | Prop `foto: "foto.jpg"` (arquivo em `public/`) |
| Nome da gravação no cartão .mp4 (herói `Arquivo`) | o do vídeo aprovado | Prop `arquivo: "nome_real"` ou `""` para esconder |
| Quadros dentro da palavra "frame" | os do vídeo aprovado | `FRAME_FOTOS` em `src/Cenas.tsx`: quadros da sua gravação, ou `null` para cor sólida |

Os padrões vêm do `src/Root.tsx`: `{voz: false, arroba: '', foto: '', arquivo: '20261005_103843'}`. Num vídeo novo, troque
`arquivo` pelo nome real da gravação ou deixe vazio.

## 8. Zona segura

- Todo texto fica em x 60–940 e y 250–1500 (1080x1920). A caixa do bloco começa em x 80 e tem 920 de largura: num
  vídeo novo, a palavra grande centrada não pode passar de x 940 (diminua o tamanho ou quebre a linha) e nenhum bloco
  começa acima de y 250.
- A zona segura é assimétrica de propósito (a coluna de botões do Instagram ocupa os 140 px da direita). Neste modelo a
  caixa de texto centra em x 540 e a borda direita do texto para em x 940.
- Nome e @ na tela, só os reais de quem fala, ou nenhum.

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo".

1. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py modelodinamico02 <gravacao.mp4> <AAAA-MM-DD-tema>`.
   A gravação pode ser você falando: só a voz entra. Isso cria `videos/<AAAA-MM-DD-tema>/`, a voz em `public/voz.wav` e a
   fala transcrita em `src/palavras.json`. Ao carregar, o molde para de propósito e diz a primeira palavra do plano que a
   fala nova não tem.
   Nome que a transcrição errar (ex.: "Cloud" no lugar de "Claude") se corrige já aqui: `--trocar Cloud=Claude` (pode repetir).
2. **Escreva o `plano.md`** na pasta do vídeo, frase a frase sobre `src/palavras.json`: uma tela por ideia (1,5 a 2,5 s),
   cortando nas pausas ou, na fala corrida, nas viradas de ideia (seção 6), começando no escuro e o fundo alternando, quais palavras viram grandes, cursivas ou com efeito, e o herói de cada tela.
3. **Monte o plano em `src/Cenas.tsx`** (na pasta do vídeo):
   - `CENAS`: uma entrada por tela, `{id, fundo: 'E' | 'L', topo, linhas: [{txt, tam, fonte?, peso?, acento?, efeito?}],
     heroi?, alinha?, iris?}`. As linhas são **as palavras ditas, na ordem**: o tempo de cada palavra vem da fala
     sozinho. Palavra com `~` na frente é enfeite (não dita). `fonte: 'script'` é a cursiva, `'serif'` a serifa;
     `efeito: {'palavra': 'corta' | 'sublinha' | 'moldura' | 'anel'}`.
   - Os heróis: os do vídeo aprovado foram feitos para aquele roteiro. Faça os que a fala nova pede, presos às palavras
     por `w('palavra', n)` ou `naTela(c, 'palavra')`, com as cores de `cores(c.fundo)` (seção 5). Tela sem herói: tire o
     `heroi:`.
   - `FRAME_FOTOS`: seus quadros (`ffmpeg -ss <segundo> -i base/fala.mp4 -frames:v 1 -q:v 3 public/quadros/f600.jpg`) ou
     `null`.
4. **Confira as regras:** `node scripts/cobertura.mjs` (na pasta do vídeo) até sair `APROVADO`. Ele confere as palavras dos
   heróis, tela de pelo menos 1,5 s, palavra de pelo menos 0,4 s, até 4 linhas e a zona segura, e diz o arquivo e a linha.
5. **Som:** refaça a lista `cortes` e os efeitos de `scripts/som.py` com as mesmas palavras e rode
   `../../.venv/Scripts/python.exe scripts/som.py` (na pasta do vídeo). Sai `public/trilha.wav`. `--cama` liga a música.
6. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 2 5 9` (na pasta do vídeo). Com o
   seu perfil: `--props '{"arroba":"seu.arroba","foto":"foto.jpg"}'`.
7. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts Dinamico02 out/so-voz.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"voz":true,"arroba":"seu.arroba","foto":"foto.jpg"}'`
   (tire `arroba` e `foto` se a pessoa não deu os dela).
8. **Mixe:** `sh scripts/mixar.sh out/so-voz.mp4 out/final.mp4 public/trilha.wav` (na pasta do vídeo). Sai em -14 LUFS.
9. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 modelodinamico02`.
   Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
   em cima e o seu embaixo. Se a diferença salta aos olhos, ainda não está pronto.

## 10. O plano do vídeo aprovado (para comparar)

Este é o plano do vídeo aprovado, para comparar a cara. Num vídeo novo o checador manda, mesmo que a fala seja a mesma:
este plano tem telas curtas ("editado" com 1,18 s, "vendo aqui" com 0,98 s), a tela "Cada corte" com 6 linhas e
palavras que passam da zona segura ("arquivo" a 230 px), e o `cobertura.mjs` reprova isso. Com a mesma fala, junte
"Esse vídeo foi editado 100% pelo Claude Code" e "que você está vendo aqui foi ele que decidiu e editou" em telas de até
4 linhas, cortando nas pausas ou nas viradas de ideia, e diminua a palavra grande até caber.

| Tempo | Fala | Fundo / transição | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo foi editado | escuro | "Esse vídeo foi / **editado**" |
| 1 s | 100% pelo Claude Code. | corte, laranja | "**100%**" 330 px, "pelo", "Claude Code" cursiva; faísca branca |
| 3 s | Eu só gravei e mandei o arquivo | corte, escuro | "Eu só gravei / e mandei o / **arquivo**"; o .mp4 e o feixe até a faísca |
| 5,5 s | Cada corte, cada legenda, cada tela | corte, laranja, à esquerda | "corte," partido e riscado, "legenda," sublinhada, "tela" com moldura |
| 7 s | que você está vendo aqui | corte, escuro | mira de gravação com REC; "**vendo aqui**" |
| 8 s | foi ele que decidiu e editou. | corte, laranja | "foi ele que / **decidiu** / *e editou.*"; setas convergindo na faísca |
| 10,5 s | Mas não foi simplesmente | corte, escuro | "Mas não foi / *simplesmente*" cursiva |
| 11,5 s | chegar ao Claude e (edita esse vídeo para mim) | corte, laranja | campo de prompt digitando "edita esse vídeo para m..." |
| 14,7 s | Na verdade, | corte, escuro | "Na / **verdade,**" |
| 16 s | ele está usando o método que nós desenvolvemos | íris, laranja | "*método*" serifa 260 px; pilha numerada de pastas |
| 18 s | analisando mais de 160 vídeos | corte, escuro | grade enchendo, "79" e depois "**160+**", "vídeos" |
| 20 s | frame por frame | corte, laranja | "frame" com quadros reais dentro das letras, "por", "frame" |
| 21,7 s | E através disso, nós desenvolvemos esse método | corte, escuro | órbita de tópicos em volta da faísca |
| 24,2 s | muitas regras | corte, laranja | "muitas / **regras**"; fichas ligadas por linhas tracejadas |
| 27,5 s | E aqui você está vendo apenas algumas dessas regras aplicadas | corte, escuro | celular com guias; "aplicadas" com anel brilhante |
| 31,2 s | E te falo mais | corte, laranja | "E te falo / **mais**" 320 px |
| 32,2 s | o que você está vendo é apenas um teste | corte, escuro | "**um teste**"; carimbo "TESTE #01" |
| 34,2 s | do primeiro vídeo | íris, laranja | "do / primeiro / *vídeo*"; "01" gigante em contorno |
| 35 s | sendo editado após todo o desenvolvimento desse método | corte, escuro | barra enchendo 11%, 48%, 84%, 100% |
| 38,5 s | Ou seja, eu ainda estou calibrando isso daqui. | corte, laranja | "*calibrando*" cursiva; mostrador com ponteiro |
| 41,5 s | Mas se você quer saber mais sobre isso, já me segue aqui. | corte, escuro | "**já me segue** / *aqui.*"; foto num anel e o @ |

No vídeo aprovado a foto e o @ são os reais de quem fala. Os textos de herói (nome de arquivo, tópicos, regras) são
daquele roteiro; num vídeo novo, a tela mostra o que a fala nova diz.
