# storypodcast01: corte de podcast de reflexão, com a palavra-chave gigante colorida pelo sentido

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (29,8 s, com a voz). Os tempos entre
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

Uma pessoa pensando em voz alta, e a tela escreve a fala como uma página de livro sobre o rosto.
- **Estúdio escuro e frio:** a pessoa recortada sobre um breu petróleo desfocado, pretos esmagados, pele quente, luz
  caindo de lado (0 s a 29 s). A imagem e o contraste do aprovado são a cara do modelo: ficam como estão.
- **Uma palavra gigante por frase**, em letra condensada caixa alta, colorida pelo sentido: azul quando é o que se
  busca, vermelho quando dói, branco quando é a resposta neutra ("100%" azul em 1 s, "MODELOS" branco em 6 s,
  "APENAS" vermelho em 13 s).
- **A palavra-chave se revela letra a letra fora de ordem**, do desfoque, pisca e assenta (5 s, 19 s, 27 s).
- **Texto pequeno, fino e branco** em volta dela e na legenda corrida (3 s, 11 s).
- **O momento de dor vira preto e branco**, em close extremo, e o texto continua colorido (13 s).
- **Corte seco** entre planos do mesmo rosto. Chicote de 1 quadro só na chamada (26,7 s).

## 2. Os números do modelo (o `parece.py` confere)

| Item | Valor | O que é |
|---|---|---|
| Brilho | 31 (de 0 a 255) | Vídeo muito escuro |
| Contraste | 124 | Pretos fundos, pele acesa |
| Saturação | 146 | Cor viva no texto e na pele |
| Temperatura | +0,7 | Neutro para frio. Nada de âmbar |
| Rosto no plano aberto | 36% da altura do quadro | (0 s) |
| Rosto no plano fechado | 44% da altura do quadro | (8 s) |
| Altura do rosto | centro a 33% do topo | Cabeça no terço de cima |
| Lado do rosto | centro a 49% da largura, na média | Muda de lado conforme o bloco (esquerda 0 s, direita 24 s) |
| Cabeça cortada pelo topo | 67% do tempo | Planos médios e fechados cortam o alto da cabeça |
| Cortes | cerca de 8 por minuto | 6 cortes em 29,8 s |

- **O rosto depende do plano, não só da gravação.** Por plano, o aprovado tem o rosto em 38% da altura no médio 1,45,
  46% no close 1,65 e 28% a 29% no aberto 1,0 e no médio aberto 1,1. Os 36% e 44% da tabela são a mistura dos planos
  dele, que passa cerca de 1/4 do tempo em plano aberto. Vídeo só com médio e close (comum em vídeo curto) mede rosto
  grande e cabeça cortada 100% e reprova, mesmo com a gravação certa. Por isso todo vídeo, curto ou não, tem um plano
  aberto (1,0 ou 1,1) numa virada da fala, de pelo menos 1,5 s (num vídeo de 10 s, um aberto de 1,7 s já passa).
- **A luz é do molde, não do filtro.** O brilho e o contraste certos saem do `scripts/grade.py` seguido do
  `tools/adaptar.py --desenho` (seção 9, passo 2). Nunca mude o filtro `contrast(1.04)` do `src/Reel.tsx` para
  compensar luz: se o `parece.py` acusar luz, o passo 2 não foi feito ou foi feito antes do grade.
- **O único âmbar do modelo:** um vazamento de luz laranja nos quadros 0 a 4 do vídeo (a abertura acende quente e
  apaga em 0,17 s). Faz parte do aprovado e fica. Fora dele, nada de âmbar.

## 3. Câmera e ritmo

- **Uma câmera vira vários planos**, sempre por corte seco. Os planos do aprovado:

| Plano | Zoom | Rosto em (x, y do quadro) | Uso |
|---|---|---|---|
| Médio, rosto à esquerda | 1,45 | 0,29 / 0,31 | Blocos à direita (0 s) |
| Close | 1,65 | 0,50 / 0,33 | Palavra central gigante (7 s a 10 s) |
| Aberto | 1,0 | 0,50 / 0,34 | Virada da fala (11 s) |
| Close extremo P&B | 2,3 | 0,58 / 0,40 | O trecho de custo, uma vez (13 s) |
| Médio aberto | 1,1 | 0,50 / 0,33 | Plano das prévias (14 s a 19 s) |
| Médio, rosto à direita | 1,45 | 0,72 / 0,31 | Blocos à esquerda (20 s a 26 s) |
| Médio centrado | 1,25 | 0,50 / 0,30 | Chamada (27 s) |

- **Corte só com motivo:** virada da fala, destaque que pede outro plano, P&B, prévias, chamada. Nos 9 s iniciais, no
  máximo o plano que abre e mais um (o aprovado corta uma vez, em 6,7 s). Num vídeo de até 12 s, esse único corte é o
  do plano aberto (a regra do rosto, acima): abre no médio 1,45 com o bloco, corta para o aberto numa virada. O bloco
  central gigante, sem close, vai no médio.
- O corte cai 2 quadros antes da palavra que o motiva.
- Dentro do plano a câmera fica parada. Só o close P&B avança de 0,96 para 1,0 em 9 quadros, junto com a entrada.
- O rosto vai para o lado oposto ao texto. O plano é escolhido para abrir espaço para o bloco.
- **Algo novo nasce na tela a cada 0,6 a 1,5 s:** é a palavra seguinte surgindo no tempo da fala, dentro da mesma
  página. A página inteira fica pelo menos 1,5 s (seção 5). Nunca mais de 2 s sem nada novo na tela.
- **Fim:** corte seco 0,2 s depois da última palavra.

## 4. Os destaques (a assinatura)

**Fontes: duas, mais uma variação de peso.** Poppins 400 e 600, e Anton. Nenhuma outra fonte entra (nada de manuscrita,
nada de serifada).

**Três jeitos de pôr o destaque:**
1. **Bloco lateral** (o padrão). Topo da 1ª linha em y 685 (35,7% da altura). Do lado direito, a borda direita em
   x 940; do lado esquerdo, a borda esquerda em x 70 a 76. Largura do bloco 380 a 420 px. As linhas alternam:
   pequena / PALAVRA / pequena encostada na borda oposta / PALAVRA. Fica um zigue-zague justificado ("esse vídeo está
   sendo / 100% / editado pelo / CLAUDE", 1 s a 2 s; "a / DIFERENÇA / entre vários / MODELOS", 6 s; "e / APRENDER /
   a como usar isso / nos seus vídeos", 26 s).
2. **Palavra central gigante** (no close ou no médio centrado). Bloco centrado com topo em y 1152 (60% da altura),
   largura 560 a 600 px, linha pequena em cima e embaixo ("para editar / QUALQUER / tipo de vídeo usando o Claude",
   9 s a 10 s; "outros modelos de / EDIÇÃO / como esse", 23 s).
3. **Bloco do P&B**, no canto de baixo à esquerda: x 76, topo em y 1087 (56,6%) ("você está vendo / APENAS / um desses
   modelos.", 13 s).

**A palavra-chave:**
- Anton 400, caixa alta, apertada na horizontal para 88% da largura (fica condensada).
- **Largura casada:** a palavra é escalada para ter a largura do bloco, a mesma da linha pequena de cima (6 s, 9 s).
  Quando não casa, a maiúscula tem 7% da altura do quadro (134 px). Nunca passa de 9,5% (182 px).
- 4 a 8 px de folga entre a linha pequena e a palavra grande.
- Sem caixa, sem tarja, sem contorno atrás. Só sombra suave.

**A cor é o sentido:**

| Papel | Cor | Acabamento | Quando |
|---|---|---|---|
| Azul (o que se busca) | `#0A64FC` | brilho azul em 3 camadas em volta das letras | sonho, valor, ganho, o sujeito que importa ("100%", "DIFERENÇA", "QUALQUER", "EDIÇÃO", "APRENDER") |
| Vermelho (o que dói) | `#FD1701` | chapado, sombra escura | custo, perda, limite, erro ("APENAS", 13 s) |
| Branco | degradê `#EEEDF0` em cima para `#D6CFCE` embaixo | sombra escura | a 2ª palavra forte quando a 1ª já tem cor, ou a resposta neutra ("CLAUDE", "MODELOS", "TRÊS VEZES") |

- **Duas palavras do mesmo bloco nunca têm a mesma cor:** azul e branco, ou vermelho e azul.
- **Destaque só no termo protagonista** da fala (o assunto: "outros modelos de EDIÇÃO", 23 s). Advérbio ou ligação
  nunca vira destaque nem ganha fonte diferente: "realmente" vai na legenda comum (21 s).
- **Número e palavra exatamente como foram ditos** ("100%", 1 s).
- **Nunca escreva o nome do modelo na tela.** A fala diz "um desses modelos" e a tela escreve só isso (13 s).

**Entrada da palavra-chave:** as letras nascem fora de ordem, uma a cada 0,065 s no máximo (a palavra toda em até
0,3 s), cada uma do desfoque forte para nítida em 3 quadros. Depois cerca de 30% das letras piscam (somem de 0,36 a
0,43 s e de 0,49 a 0,54 s depois da entrada) e voltam. Tudo começa junto com a palavra falada (5 s, 24 s, 27 s). A
palavra curta no fim de uma frase rápida entra inteira, sem piscar, em 0,15 s ("CLAUDE", 2,5 s).

**Saída:** pisca 3 vezes nos últimos 6 quadros e some. Se a saída cai num corte, some seco no corte.

## 5. A legenda (conta a história)

- **Toda palavra dita aparece na tela, uma vez só.** Ou no bloco de destaque, ou na legenda corrida.
- **Poppins 400, 46 px, branco giz `#F6F6F6`**, com sombra escura suave. O trecho de peso vai em Poppins 600 (em geral a
  2ª linha: "**para te mostrar**", 4 s; "**no Instagram agora**", 12 s; "**DM**", 29 s).
- Páginas de 1 ou 2 linhas, entrelinha 1,12. A 1ª linha encosta à esquerda e a 2ª à direita, em zigue-zague.
- Cada palavra nasce do desfoque (7 px) para nítida em 4 quadros, no tempo da fala.
- **Tempo de leitura:** cada página fica pelo menos 1,5 s, e cada palavra pelo menos 0,4 s depois de nascer. Fala rápida
  junta numa frase maior; nunca pica. No máximo 4 linhas por bloco.
- **Posição: só duas, fixas.** Topo da caixa em y 1050 (no peito) e y 1400 (a 2ª). A legenda vai para a 2ª só quando um
  destaque ocupa a 1ª, quando o rosto desce nas prévias (17 s, 27 s a 29 s) ou na fala sem pausa (abaixo). Nunca um lugar novo por frase, nunca no
  pé do quadro.
- **Fala sem pausa (troca de página):** na mesma posição, a página seguinte entra no mesmo quadro em que a anterior
  sai (`ate` de uma = `de` da outra, em geral `antes(i)`); as duas nunca convivem ali. Em posições diferentes (bloco ou
  legenda em 1050 saindo, legenda em 1400 entrando), a seguinte pode entrar até 0,25 s antes de a anterior sair, desde
  que as caixas não se cruzem. O `cobertura.mjs` reprova qualquer cruzamento e qualquer página com menos de 1,5 s.
- **Bloco central de 3 linhas com legenda em 1400 ao mesmo tempo:** o bloco precisa acabar 10 px acima da legenda.
  Com o topo do bloco em y 1152 e linhas pequena / PALAVRA / pequena, a maiúscula da palavra vai até 6,4% da altura
  (`cap: 0.064`, 123 px); com acento na palavra (É, Ã...) até 5,3% (`cap: 0.053`); com Q ou Ç até 5,6%. A conta do
  `cobertura.mjs`: topo + 112 px + altura da maiúscula (mais 22% dela com acento) tem de ficar em y 1390 ou acima.
- **A tela pode limpar a fala** (tira "pô", "cara", "né"; troca "tá" por "está", "pra" por "para"), mas nunca muda o
  sentido nem inventa palavra.
- **Nada atravessa um corte seco.** Todo texto some no corte. Nada aparece antes do seu tempo de entrada.

## 6. Preto e branco, transições e fecho

- **P&B no momento de dor:** só quando a fala diz um custo, uma perda, um limite ou um erro (o que vira palavra
  vermelha). Então 1 a 2 vezes por vídeo, 1,4 a 3,6 s cada, sempre num bloco com palavra vermelha e sempre no close
  extremo (12,98 s a 14,44 s). O texto não perde a cor: é quando o vermelho mais salta. Fala sem dor não tem P&B:
  nunca invente um para cumprir a gramática (tire o `pb` do plano e ponha `PB_PALAVRA = None` no `scripts/trilha.py`).
- **Entrada do P&B com clarão:** 2 quadros clareando, 1 quadro estourado, assenta escuro em cerca de 0,15 s. Saída por
  clarão de 3 quadros ou por corte seco (14,4 s).
- **Chicote de 1 quadro** na entrada da chamada (26,7 s), com um whoosh baixo 0,2 s antes.
- **Chamada (fecho):** fixo só o comando, em bloco centrado com topo em y 1050: "comenta" pequeno e a palavra entre
  aspas gigante azul, “EDIÇÃO” (27 s). O resto da fala corre na legenda da 2ª posição, y 1400 (28 s a 29 s).
  Fala sem chamada (vídeo curto que acaba numa afirmação): sem chicote e sem bloco de comando. `CHICOTE = null`,
  `CHICOTE_PALAVRA = None`, e a última frase fecha como as outras (bloco ou legenda), com o corte seco 0,2 s depois.
- **Prévias (opcional):** dois clipes de vídeos seus, acelerados 3 vezes, sem som, em cima da tela, de 340x604 px a
  partir de y 70, com o nome de cada um embaixo. A câmera desce 560 px para abrir o terço de cima e a legenda vai
  para y 1400 (15 s a 19 s). Nunca use vídeo de terceiro.
- **Montagem de apoio (opcional, só se a fala tiver metáfora ou cena):** imagens de banco aberto em tela cheia, 1 a 2 s
  cada, com uma linha de narração em caixa alta espaçada no meio do quadro. Imagem literal quando a fala cita um objeto,
  atmosférica quando é abstrata. A frase de efeito sempre volta para o rosto. Nunca cena de filme, nunca pessoa real
  gerada. O aprovado não usa.

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão no código | Como mudar |
|---|---|---|
| Fundo escuro do modelo (recorte, breu petróleo, vinheta) | **ligado** | Prop `efeitoFundo: false`. Ligado exige `public/fala_grade.mp4` (passo 2 da seção 9) |
| Efeitos sonoros do modelo (sopro no P&B, whoosh no chicote) | **ligados** | O `mixar.sh` usa `public/efeitos.wav` se existir; apague-o para sair só a voz |
| Música (pad escuro de 4 acordes) | desligada | `mixar.sh` com `public/trilha.wav` no meio (seção 9, passo 8) e prop `musica: true` só para ouvir no Studio |
| Prévias | desligadas | Prop `previas: true` e `nomesPrevias: ["modeloA","modeloB"]`, com o plano marcado `previas: true` |
| P&B | ligado onde o plano marca `pb: true` | Tire o `pb` do plano |
| Chicote na chamada | ligado | `CHICOTE = null` em `src/Reel.tsx` |

O aprovado foi feito com o fundo escuro e com as prévias ligadas, para mostrar a capacidade.

## 8. Zona segura e rosto

- Todo texto fica em x 60–940 e y 250–1500 (1080x1920). As prévias e o vídeo podem passar disso.
- A zona segura é assimétrica de propósito: a coluna de botões do Instagram ocupa os 140 px da direita, por isso nenhum texto passa de x 940.
- Nenhum texto cobre os olhos ou a boca. O texto vai do lado oposto ao rosto ou abaixo do queixo.
- Nome e @ na tela, só os reais de quem fala, ou nenhum. O modelo não tem terço inferior.

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo" (`videos/<v>/`).

1. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py storypodcast01 <gravacao.mp4> <AAAA-MM-DD-tema>`.
   Isso cria `videos/<AAAA-MM-DD-tema>/`, transcreve a fala (`src/palavras.json`), mede o rosto (`src/rosto.json`) e
   adapta a gravação ao modelo (rosto no tamanho e na altura do aprovado, mesma luz de partida). Peça uma gravação com
   luz lateral, fundo escuro e folga de resolução (4K ajuda: o close P&B é um recorte de 2,3x).
   Nome que a transcrição errar (ex.: "Cloud" no lugar de "Claude") se corrige já aqui: `--trocar Cloud=Claude` (pode repetir).
2. **Fundo escuro** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/grade.py` grava
   `public/fala_grade.mp4`. É pesado. Para testar antes, `scripts/grade.py 1 13 22` grava só imagens em `conferencia/`.
   No fim, o `grade.py` já roda sozinho o acerto de luz (`tools/adaptar.py videos/<v> storypodcast01 --desenho`); só rode à mão
   se gerar o grade com `--saida`.
   O grade tem números fixos, calibrados na gravação do aprovado (camiseta preta, papel branco na mesa); roupa,
   objeto claro e parede diferentes mudam a luz que sai dele. Este passo leva o `fala_grade.mp4` à luz do
   `fala_grade.mp4` do molde. Sem ele o vídeo sai apagado (contraste perto de 90 em vez de 124). Rode de novo sempre
   que refizer o grade.
3. **Escreva o `plano.md`** na pasta do vídeo, uma linha por frase sobre `src/palavras.json`: tempo, fala, jeito
   (bloco lateral, central, legenda), palavra-chave, cor pelo sentido, plano e P&B. Procure o arco da fala (tese,
   custo, virada, fecho) e siga a gramática do `referencia.mp4`.
4. **Monte O PLANO** em `src/Reel.tsx` (na pasta do vídeo). O molde para de propósito ao carregar até o plano bater com
   a fala nova e diz qual lista e qual palavra não batem. Os números são índices das palavras (0 = a 1ª).
   - `CORTE` e `PLANOS`: os cortes, `c(i)` = 2 quadros antes da palavra `i`, com `zoom`, `fx`, `fy` (onde o rosto cai)
     e `pb: true` no plano do custo e `previas: true` no plano das prévias.
   - `CHICOTE`: o corte da chamada, ou `null`.
   - `PECAS`: os blocos (`tipo: 'bloco'`, com `x`, `top`, `largura`, `ladoDir` e as linhas `P(...)` pequenas e
     `K('PALAVRA', i, 'azul' | 'vermelho' | 'branco', ...)`) e as legendas (`tipo: 'legenda'`, `pos: 1` ou `2`).
     Palavra-chave de duas palavras: `K('CLAUDE CODE', i, ...)` ocupa as palavras i e i+1. Ajudas de tempo: `ler(i)`
     dá à palavra i os 0,4 s de leitura (use como `ate` da página que termina nela); `antes(i)` é 3 centésimos antes da
     palavra i (use como corte ou como `de`).
     Nenhuma peça atravessa um corte.
   - `FOLGA`: o corte seco depois da última palavra (0,2 s).
5. **Confira as regras:** `node scripts/cobertura.mjs` (na pasta do vídeo) até zerar. Ele confere palavra coberta uma
   vez, tempo de leitura, até 4 linhas, legenda só em 1050 e 1400, texto sem cruzar texto, zona segura, fontes e a
   conta de cortes, e diz o que mexer.
6. **Som:** ponha em `scripts/trilha.py` o `PB_PALAVRA` (1ª palavra do plano P&B) e o `CHICOTE_PALAVRA` (1ª palavra da
   chamada), ou `None`, e rode `../../.venv/Scripts/python.exe scripts/trilha.py` (na pasta do vídeo). Sai
   `public/efeitos.wav` e `public/trilha.wav`.
7. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 13 27` (na pasta do
   vídeo). O fundo escuro vem ligado, como no render; `--sem-fundo` desliga e `--previas` liga as prévias. Monte a folha com
   `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png q2.png --cols 6`.
8. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineStoryPodcast01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2 --muted`
   Com prévias, acrescente `--props='{"previas":true,"nomesPrevias":["modeloA","modeloB"]}'`.
9. **Mixe** (na pasta do vídeo): `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (voz e efeitos). Com música:
   `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` (trilha cerca de 16 dB abaixo da voz). Sai em
   -14 LUFS, pico -1 dBTP.
10. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 storypodcast01`.
    Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
    em cima e o seu embaixo. Se a diferença salta aos olhos, ainda não está pronto.

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<v> 1` (e o mesmo com `2`), o
plano com `previas: true` e o render com as props acima.

## 10. O plano do vídeo aprovado (para comparar)

| Tempo | Fala | Câmera / transição | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. | médio 1,45, rosto à esquerda | bloco à direita: "esse vídeo está sendo / 100% (azul) / editado pelo / CLAUDE (branco)" |
| 3,1 s | Ele foi criado justamente para te mostrar | médio | legenda y 1050: "Ele foi criado justamente / **para te mostrar**" |
| 5 s | a diferença entre vários modelos | médio | bloco à direita: "a / DIFERENÇA (azul) / entre vários / MODELOS (branco)" |
| 6,7 s | que eu criei e melhorei | corte seco, close 1,65 | legenda: "que eu criei e **melhorei**" |
| 8,1 s | para editar qualquer tipo de vídeo usando o Claude. | close | central y 1152: "para editar / QUALQUER (azul) / tipo de vídeo usando o Claude" |
| 10,6 s | Inclusive, se você estiver no Instagram agora, | corte seco, aberto 1,0 | legenda: "Inclusive, se você estiver / **no Instagram agora**" |
| 13 s | você está vendo apenas um desses modelos. | corte com clarão, close extremo 2,3 em P&B | bloco embaixo à esquerda: "você está vendo / APENAS (vermelho) / um desses modelos." |
| 14,4 s | Eu posso até colocar duas prévias rápidas aqui em cima, | corte seco, médio aberto 1,1; câmera desce, prévias em cima | legenda (y 1400 com prévias): "Eu posso até colocar duas / **prévias rápidas aqui em cima**" |
| 17,9 s | aceleradas em três vezes. | idem | central: "aceleradas em / TRÊS VEZES (branco)" |
| 19,9 s | Mas se você quiser realmente ver | corte seco, médio 1,45, rosto à direita | legenda: "Mas se você quiser / realmente ver" |
| 21,9 s | outros modelos de edição como esse | idem | central: "**outros modelos de** / EDIÇÃO (azul) / como esse" |
| 24 s | e aprender a como usar isso nos seus vídeos, | idem | bloco à esquerda: "e / APRENDER (azul) / a como usar isso / nos seus vídeos" |
| 26,7 s | comenta edição | chicote de 1 quadro, médio centrado 1,25 | bloco y 1050: "comenta / “EDIÇÃO” (azul)" |
| 27,9 s | aqui embaixo que eu vou te mandar na sua DM agora. | idem; corte seco 0,2 s depois de "agora." | legenda y 1400: "aqui embaixo que eu vou / te mandar na sua **DM** agora." |
