# superpodcast01: corte de podcast documental, montado palavra por palavra

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (30,2 s, com a voz). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo) e o `mapa.json`
(rosto, luz e cortes medidos a cada 0,25 s). Antes de editar, assista ao vídeo inteiro uma vez. O mesmo vídeo em qualidade cheia está no `original.mp4`, para ler letra pequena e detalhe de tela.

**A referência mostra o jeito do modelo, não um roteiro para copiar.** Siga a cara, os números e as regras; as telas, os textos e os cortes do vídeo novo nascem da fala nova. Não repita as cenas do aprovado só porque estão lá. A velocidade, o
tamanho e a quantidade de texto e de cortes do aprovado são a régua.

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

Um trecho de conversa vira um minidocumentário: cada frase ganha a imagem do que está sendo dito.
- **Quatro mundos, trocados por corte seco:** o **palco** (set escuro sob um foco, 0 s e 24 s), o **rosto** de quem fala
  (3 s), o **papel** (colagem clara de fotos e prints, 6 s, 12 s, 22 s) e o **arquivo** (B-roll em tela cheia, 8 s,
  26 s). Mais a **tela dividida** com as prévias (15 s a 19 s).
- **A palavra-chave gigante** em serifa itálica preta, vermelha, acendendo letra por letra do borrão ("editado" 2 s,
  "diferença" 5 s, "apenas" 13 s).
- **O texto se monta no tempo da fala**, palavra por palavra, sempre no lugar final. Palavras comuns pequenas e brancas.
- **Frio e escuro:** preto de estúdio, branco aceso, um único vermelho. Nada de cor quente, nada de 2ª cor de destaque.
- **Ritmo rápido:** um corte a cada 2,3 s em média, e o texto muda a cada palavra.

## 2. Os números do modelo (o `parece.py` confere)

| Item | Valor | O que é |
|---|---|---|
| Brilho | 42 (de 0 a 255) | Escuro, com o papel claro subindo a média |
| Contraste | 128 | Pretos fundos |
| Saturação | 95 | Cor contida: só o vermelho acende |
| Temperatura | +0,2 | Neutro e frio |
| Rosto no plano aberto | 28% da altura do quadro | (3 s) |
| Rosto no plano fechado | 33% da altura do quadro | (10 s) |
| Altura do rosto | centro a 33% do topo | Cabeça no terço de cima |
| Lado do rosto | centro a 52% da largura | Um pouco à direita |
| Cabeça cortada pelo topo | 10% do tempo | Quase nunca |
| Tempo com rosto | 56% | O resto é palco, papel e arquivo |
| Cortes | cerca de 24 por minuto | 12 cortes em 30 s |

## 3. Os mundos e a câmera

| Mundo | Como é | Para quê |
|---|---|---|
| **Palco** | Plano aberto do set: mesa clara a 55–58% da altura sob um foco de cima, cadeiras e microfones, poça de luz em elipse no chão, parede quase preta (`#0A0C0C` em cima, `#19191E` no chão). O texto mora na parede escura acima da mesa | A tese da abertura, a frase de impacto, o fecho (0 s a 3 s, 24 s a 25 s) |
| **Rosto** | A gravação com a pessoa recortada sobre o estúdio frio `#131A1E`, vinheta, luz caindo de lado. Rosto um pouco à direita (x 0,45 a 0,58 da largura, y 0,30 a 0,33) | O miolo da fala, o terço inferior (3 s, 10 s, 13 s, 20 s, 27 s) |
| **Papel** | Fundo claro com vinheta forte (`#EFEAE7` no centro, `#7E7C7A` nos cantos). Fotos e prints sem moldura, espalhados, de tamanhos variados, franja fina de aberração na borda e sombra curta. Os cards são quadros dos seus vídeos | Vários exemplos, época, rede social, imprensa (5 s a 8 s, 11 s a 12 s, 22 s a 23 s) |
| **Arquivo** | B-roll em tela cheia, vinheta e bordas um pouco desfocadas | O objeto, o lugar, a ação citada (8 s a 9 s "editar", 26 s "vídeos") |
| **Dividida** | Palco em cima até 33% da altura (40% com prévias), rosto embaixo, divisa reta sem borda | A janela das prévias (14,5 s a 20 s) |

**De onde vem o palco e o B-roll:**
- **Palco por IA, o padrão:** o estúdio já traz na `public/` do molde o `palco.png` (set de podcast vazio, mesa clara
  sob um foco num estúdio preto, duas cadeiras, dois microfones, sem ninguém) e dois B-rolls (`broll_edicao.png`, um
  monitor com linha do tempo de edição, 8 s; `broll_celular.png`, um celular num tripé gravando, 26 s). Foram gerados
  por IA para o modelo, sem conteúdo de terceiros; os prompts estão em `material/GERADAS.md` do molde. O
  `novo-video.py` copia os três para o vídeo novo, então o palco do aprovado entra sozinho.
- **Os dois B-rolls** só entram se um plano de arquivo apontar para eles (`img`). Eles mostram edição e gravação: só
  servem se a fala nova falar disso.
- **Palco desenhado (plano B):** sem `public/palco.png`, o molde desenha o set no mesmo esquema (cone de luz aceso no
  miolo, poça quase branca, mesa clara a 57,4% da altura, cadeiras e microfones). Use só se não quiser a imagem.
- **Outra câmera nunca se gera por IA.** No lugar de "outro ângulo", nesta ordem: outros cortes de câmera do mesmo vídeo,
  B-roll do usuário, B-roll de terceiros com licença. Imagem ou vídeo gerado por IA no lugar de câmera é escolha do
  usuário. Pessoa real nunca gerada.

**Câmera:** corte seco entre mundos, cada corte no início da palavra que o motiva. Dentro do plano, só o papel anda (a
câmera avança até o item principal da colagem, 7 s). Um plano dura de 1,1 s a 3 s; a tela dividida segura 5,5 s.

**Zoom do rosto:** quem manda é o tamanho do rosto, não o número do zoom. A gravação adaptada já vem enquadrada, então
o `s` do plano parte dela: abra o `src/rosto.json` do vídeo (`[t, cx, cy, h]`, `h` é a altura do rosto de 0 a 1), pegue
o `h` mediano do trecho e use `s = 0,28 / h` no plano aberto e `s = 0,33 / h` no fechado (rosto com 28% e 33% da
altura). Numa gravação já adaptada isso costuma dar perto de 1,05 (se a conta der abaixo de 1,0, use assim mesmo) e 1,15; o 1,1 a 1,32 do aprovado vale só para a
gravação dele e, aplicado numa adaptada, deixa o rosto com 39%. Confira nos quadros: rosto de 28% a 33% da altura.

**Fala rápida sem corte limpo:** se a próxima palavra começa antes de a anterior completar o tempo de ler, não corte
ali. Junte os dois planos num só, ou ponha o corte até 2 quadros depois do início da palavra (o checador aceita
±2 quadros). Nunca um plano que mostre só uma palavra piscando.

## 4. Os destaques (a assinatura)

**Fontes:** Playfair Display Black Italic 900 (palavra-chave), Inter 600 / 700 (texto) e JetBrains Mono 400 (terço
inferior e etiquetas das prévias). Nenhuma outra.

**A palavra-chave gigante:**
- Ocupa 74% da largura do quadro (alvo; vale de 60% a 83%), com corpo máximo de 220 px. Palavra longa encolhe até caber.
- Centrada na horizontal. Altura: no palco y 868; no papel y 800 a 1025; no rosto y 1262 a 1322, sempre abaixo do queixo.
- Cores:

| Cor | Hex | Quando |
|---|---|---|
| Vermelho sinal | `#E0030A` | O padrão (2 de cada 3 casos) |
| Tinta | `#0B0A0F`, com brilho claro | Sobre o papel, quando o vermelho não cabe ("Instagram", 12 s) |
| Branco | `#FBFAFB` | Nome de pessoa |

- **Halo:** o vermelho brilha em 3 camadas (6, 26 e 70 px). O branco tem halo curto, só para a letra parecer acesa.
- **Entrada:** letra por letra, da esquerda para a direita, cada letra do borrão (16 px, vermelho) para nítida em 3
  quadros. A palavra inteira em 0,33 a 0,47 s, começando quando é dita (5 s "diferen…", 24 s "aprende…"). Duas palavras
  num destaque ("três vezes.", 19 s): as letras da 2ª nascem quando ela é dita.
- **Uma palavra-chave por frase** (no máximo duas). É o termo protagonista, de preferência a última palavra forte da
  frase, com o ponto dentro ("três vezes.", 19 s). Nunca advérbio nem palavra de ligação.
- **Palavras pequenas encostam nela:** a linha de cima começa na borda esquerda da palavra-chave e a de baixo termina
  na borda direita ("Esse vídeo está sendo 100%" / **editado** / "pelo", 2 s).
- **Caixa de marca:** o nome de produto dentro da frase vai numa caixa branca `#FBFAFB` com letra preta `#0B0A0F`
  Inter 700, da altura da linha ("Claude.", 10 s).
- **Número e frase exatamente como foram ditos.**
- **Nunca escreva o nome do modelo na tela.** A fala diz "um desses modelos" e a tela escreve só isso (14 s).

**Terço inferior** (opcional, na 1ª aparição do rosto, 3 s a 5 s):
- Traço vermelho de 11 x 205 px em x 151, y 960, com brilho vermelho.
- À direita, a 34 px do traço: o nome em JetBrains Mono 50 px, caixa alta, entreletra 0,06 em; embaixo o @ em 30 px.
  Branco com halo curto.
- As letras embaralham até assentar em 0,5 s. Fica até o fim do plano.
- **Só o nome e o @ reais de quem fala, dados pelo dono do vídeo.** Sem eles, o terço fica desligado. Nunca nome de
  exemplo, nunca o nome do modelo, nunca o @ de outra pessoa.

**Ainda não estão no molde** (desenhe no mesmo estilo se a fala pedir): lista numerada no palco (Inter 600, alinhada
à esquerda em x 119, o trecho que nega em vermelho), cartela de nome (silhueta e nome em vermelho dos dois lados) e
traço de caneta vermelho que se desenha sobre uma foto em 0,3 s.

## 5. A legenda (conta a história)

- **Toda palavra dita aparece na tela, uma vez só.** Nenhuma palavra cortada, reescrita ou resumida (o checador
  exige cada palavra exatamente uma vez).
- **Inter 600, 66 px, branco `#FBFAFB`** com halo curto, entreletra -0,02 em. No papel, tinta `#0B0A0F` ou petróleo
  `#09222F` com brilho claro.
- **Entrada:** cada palavra nasce no lugar final, quando é dita (±2 quadros), num fade com desfoque de 10 px em 0,15 s.
  Nada de atraso para ganhar tempo de leitura. Nenhuma palavra empurra outra: o bloco é medido antes e as palavras só
  preenchem os lugares reservados.
- **Tempo de leitura:** bloco pelo menos 1,5 s, palavra pelo menos 0,4 s depois de nascer, palavra-chave completa pelo
  menos 0,8 s, terço pelo menos 1,5 s. Se a fala é rápida demais para isso, a palavra entra no bloco seguinte ou o bloco
  junta com o vizinho do mesmo plano; nenhum pedaço fica menos que o tempo de ler. No máximo 4 linhas por bloco, 6 a 8 palavras pequenas mais a palavra-chave.
- **Posição:** no rosto, a legenda padrão fica no peito, em y 1215 e y 1298 (duas linhas centradas, 4 s, 20 s). No
  vídeo inteiro, a legenda padrão usa no máximo 2 posições. Nos outros mundos o texto vai no espaço livre: na parede do
  palco (y 742 a 1000), na faixa livre entre as fotos do papel, abaixo do queixo na metade de baixo da dividida.
- **Nenhum texto no rosto.** O texto fica abaixo do queixo medido (`src/rosto.json`).
- **Nada atravessa um corte seco.** Cada bloco acaba no corte. Numa rajada, cada plano leva só a palavra dita nele.

- **Papel numa frase longa que passa por vários planos:** o papel pode levar como palavra-chave o substantivo forte do
  trecho dele (contando no máximo 2 palavras-chave num vídeo curto). Papel sem palavra-chave perde a cara do modelo.
## 6. Transições e fecho

- **Corte seco** é a regra.
- **Vazamento de luz** marca troca de bloco, 1 a 3 por vídeo: uma onda vermelha `#BD2027` sobe ou varre na diagonal em
  2 a 3 quadros, vira âmbar `#FDD48B`, amarelo `#FEE87B` e um quadro branco, e revela o plano novo em 0,3 s. No aprovado:
  na abertura (0 s) e na virada "Mas" (20 s), cada um com uma batida.
- Nada de VHS, glitch, deslize ou cortina.
- **Fecho:** se a pessoa termina com a chamada, fixo só o comando, com a palavra entre aspas em palavra-chave gigante
  vermelha, “edição”, em y 1262 (27 s a 30 s). O resto da fala corre em linhas pequenas acima (y 1135) e abaixo
  (y 1395) dela. Sem chamada, fecha no palco com a última palavra forte dita como palavra-chave.
- A última tela segura 0,53 s depois da última palavra. Se a palavra-chave final não completa 0,8 s com isso, aumente a
  `FOLGA` até completar.
- **Prévias (opcional):** na tela dividida, dois clipes de vídeos seus acelerados 3 vezes, de 360x640 px, em y 34 e
  x 150 e 570, com o nome de cada um em JetBrains Mono 34 px embaixo (15 s a 19 s). Nunca vídeo de terceiro.

## 7. Que trecho funciona e que palavra chama o quê

Funciona: tese com exemplo concreto (cada substantivo vira imagem), conselho com passos, apresentação de alguém. Frases
curtas com a palavra forte no fim, 30 a 60 s. Não funciona: fala abstrata sem nenhum substantivo concreto por mais de
15 s, bate-bola de duas pessoas, tutorial de tela.

| Quando a fala... | A tela faz |
|---|---|
| diz a tese (1ª frase) | palco e palavra-chave gigante, já no 1º quadro (0 s) |
| fecha uma frase de impacto | volta ao palco com a palavra-chave (24 s) |
| fala de vários exemplos | colagem no papel, uma foto por palavra, a câmera avança até o item principal (6 s a 7 s) |
| fala de rede social | um card cresce no centro e explode em vários (12 s) |
| diz um objeto ou ação concreta | B-roll curto (8 s, 26 s) |
| nomeia uma marca ou produto | caixa branca dentro da frase (10 s) ou o logo em close |
| nomeia uma pessoa | corta para ela e o nome entra em serifa branca |
| lista nomes ou dá passos | um plano por nome, ou lista numerada no palco |
| a pessoa aparece pela 1ª vez | terço inferior com nome e @ reais (3 s) |
| muda de bloco | vazamento de luz (20 s) |
| pede comentário | o comando com a palavra entre aspas (27 s) |

No miolo do rosto entre duas palavras-chave, só as palavras pequenas. Nenhum selo, ícone, emoji ou seta.

**Material:** imagem de fora só com licença aberta (`kit/buscar.py`, fonte anotada no `ORIGEM.md`) ou do próprio criador.
Manchete, print de rede de terceiro e afins só como citação pequena, com a fonte visível, no tempo do comentário. O que
não der para conseguir vira `PEDIDO.md` na pasta do vídeo, com o plano B (palco, palavra-chave sobre o rosto).

## 8. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão no código | Como mudar |
|---|---|---|
| Rosto recortado no estúdio frio | **ligado** se existir `public/fala_grade.mp4` | Rode o `grade.py` (seção 10, passo 3). Sem ele, a gravação crua |
| Palco por IA | **ligado**: o `palco.png` vem no estúdio, é o padrão do modelo e o `novo-video.py` copia para o vídeo | Apague `public/palco.png` para o palco desenhado, ou troque por uma foto sua do set |
| B-roll | só onde o plano de arquivo tem `img` | `img: 'arquivo.png'` no plano. Sem `img`, a gravação em tom de arquivo |
| Batidas nos vazamentos | **ligadas** | O `mixar.sh` usa `public/efeitos.wav` se existir |
| Música (cama fria) | desligada | `mixar.sh` com `public/trilha.wav` no meio |
| Vazamentos de luz | ligados na abertura e na virada | `VAZAMENTOS` em `src/Reel.tsx` (o `scripts/trilha.py` lê de lá); `[]` desliga |
| Terço inferior | desligado (`nome: ''`, `arroba: ''`): só liga com o nome e o @ reais de quem fala | `--props='{"nome":"<nome real>","arroba":"@<arroba real>"}'` |
| Prévias | desligadas | Prop `previas: true` e `nomesPrevias`, com um plano `dividida` |

O aprovado foi feito com o palco e os B-rolls que vêm no estúdio, terço com o nome e o @ reais de quem fala e prévias ligadas.

## 9. Zona segura e rosto

- Todo texto fica em x 60–940 e y 250–1500 (1080x1920). As prévias e as imagens podem passar disso.
- A zona segura é assimétrica de propósito: a coluna de botões do Instagram ocupa os 140 px da direita, por isso nenhum texto passa de x 940.
- Nenhum texto cobre o rosto. Nos mundos que mostram a gravação (rosto, dividida, arquivo sem imagem) o checador mede
  o rosto e diz o y que tira o texto de cima dele.
- Nome e @ na tela, só os reais de quem fala, ou nenhum.

---

## 10. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo" (`videos/<v>/`). Um processo pesado
por vez.

1. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py superpodcast01 <gravacao.mp4> <AAAA-MM-DD-tema>`.
   Isso cria `videos/<AAAA-MM-DD-tema>/`, transcreve a fala (`src/palavras.json`), mede o rosto (`src/rosto.json`) e
   adapta a gravação ao modelo. Confira de ouvido o trecho rápido e corrija nomes e números.
   Nome que a transcrição errar (ex.: "Cloud" no lugar de "Claude") se corrige já aqui: `--trocar Cloud=Claude` (pode repetir).
2. **Reescreva o `plano.md`** na pasta do vídeo, uma linha por frase: tempo, fala, mundo, texto na tela, palavra-chave,
   gatilho (seção 7) e de onde vem a imagem. O que veio nele é o plano do aprovado, de outra fala.
3. **Rosto no estúdio frio** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/grade.py` grava
   `public/fala_grade.mp4`. Ele recorta a pessoa na CPU: conte uns 10 min para 30 s de fala, e antes disso ele pode
   ficar parado em "trava ocupada, esperando..." enquanto outro render usa a trava. É normal: espere, não mate o
   processo. `scripts/grade.py 1 13 22` grava só imagens de teste.
4. **Cards do papel:** `.venv/Scripts/python.exe tools/cards.py videos/<v> --fala 8` tira os cards da própria
   gravação. Sem argumento além da pasta, ele puxa 3 quadros de cada vídeo pronto em `videos/`, inclusive de outras
   pastas que não são deste vídeo: só use assim se esses vídeos forem seus e combinarem com a fala. Para escolher:
   `tools/cards.py videos/<v> videos/<outro>/out/final.mp4@1.5,12,23 --fala 4`. Grava `public/cards/` e
   `src/cards.json`. Rode sempre antes de usar o papel ou os celulares: o `src/cards.json` que vem do molde é o do
   aprovado e aponta para quadros que não existem no vídeo novo.
5. **Palco e B-roll:** decida (seção 3). Para gerar um B-roll novo por IA, só se o usuário quiser (na pasta do vídeo):
   `../../kit/.venv/Scripts/python.exe ../../kit/gerar.py "<descrição>" public/<nome>.png --formato 9:16`, anotando o
   prompt.
6. **Monte O PLANO** em `src/Reel.tsx` (na pasta do vídeo). O molde para ao carregar até o plano bater com a fala nova e
   diz a lista e a linha. Os ids são índices de `src/palavras.json` (0 = a 1ª).
   - `PLANOS`: os planos emendados de 0 a `DURACAO`, cada corte no início da 1ª palavra do plano, com `mundo`, `q`
     (`s` zoom, `ox`/`oy` onde cai o rosto) nos de rosto, `img` nos de arquivo e `papel` nos de papel (`colagem` com
     `entra`/`foco`, `celulares` com `explode`, ou `prints`). O plano `dividida` é a janela das prévias.
   - `VAZAMENTOS`: os tempos dos vazamentos; `[]` desliga.
   - `blocos`: os textos de cada plano (`tipo: 'p'` pequenas com `ids`, `y` e `al`; `tipo: 'k'` palavra-chave com `id`,
     `y` e `cor`; `caixa: 7` ou `caixa: [6, 7]` para a caixa de marca). Nenhum bloco leva `aceito`.
   - `TERCOS`: quando entra o terço (1ª aparição do rosto), ou `[]`.
   - `FOLGA`: quanto a última tela segura depois da última palavra.
7. **Confira as regras:** `node scripts/sincronia.mjs` (na pasta do vídeo) até sair 0 erros. Ele confere sincronia,
   cortes, texto que atravessa corte, palavra coberta uma vez, até 4 linhas, posições, zona segura, tempo de leitura e
   texto no rosto, e avisa mídia que falta.
8. **Som:** rode (ele lê `FOLGA` e `VAZAMENTOS` do `src/Reel.tsx`) `../../.venv/Scripts/python.exe scripts/trilha.py`
   (na pasta do vídeo). Sai `public/efeitos.wav` e `public/trilha.wav`.
9. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 14.3 29.9` (na pasta do vídeo;
   `--previas` e `--nome "<nome real>" --arroba "<@ real>"` mostram prévias e terço). Folha:
   `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png q2.png --cols 6`.
10. **Renderize** (na pasta do vídeo):
    `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineSuperPodcast01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2`
    Com terço e prévias: `--props='{"nome":"<nome real>","arroba":"@<arroba real>","previas":true,"nomesPrevias":["modeloA","modeloB"]}'`.
11. **Mixe** (na pasta do vídeo): `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (voz e batidas). Com música:
    `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` (cerca de 16 dB abaixo da voz). Sai em
    -14 LUFS, pico -1 dBTP.
12. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 superpodcast01`.
    Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
    em cima e o seu embaixo. Se a diferença salta aos olhos, ainda não está pronto.

**Vídeo curto (10 a 15 s):** 4 a 6 planos, no máximo 1 vazamento (o da abertura), 1 ou 2 palavras-chave, terço
desligado se não houver nome e @ reais, sem tela dividida nem prévias. Sem chamada no fim, fecha no palco com a última
palavra forte (seção 6). As regras de leitura e de corte não encolhem com o vídeo.

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<v> 1` (e o mesmo com `2`).

## 11. O plano do vídeo aprovado (para comparar)

| Tempo | Fala | Câmera / transição | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. | vazamento com batida; palco | "Esse vídeo está sendo 100%" / **editado** (vermelho) / "pelo Claude." na parede, y 742 a 1000 |
| 3 s | Ele foi criado justamente para te mostrar | corte seco, rosto 1,1 | terço com o nome e o @ reais de quem fala; legenda y 1215 e 1298 |
| 5,2 s | a diferença entre vários modelos que eu criei e | corte seco, papel (colagem; fotos entram em "vários", câmera avança em "criei") | **diferença** (vermelho) y 800, "entre vários modelos" e "que eu criei e" embaixo |
| 8 s | para editar qualquer tipo de vídeo | corte seco, arquivo (monitor de edição) | "para editar" / **qualquer** (vermelho) / "tipo de vídeo" |
| 9,5 s | usando o Claude. | corte seco, rosto 1,32 | "usando o" e a caixa branca **Claude.** |
| 10,6 s | Inclusive, se você estiver no Instagram agora, | corte seco, papel (um celular cresce e explode em vários no "Instagram") | "Inclusive, se você estiver no" / **Instagram** (tinta) / "agora," |
| 12,6 s | você está vendo apenas um desses modelos. | corte seco, rosto 1,18 | "você está vendo" / **apenas** (vermelho) y 1322 / "um desses modelos." |
| 14,5 s | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | corte seco, tela dividida com as prévias em cima | legenda abaixo do queixo; depois "aceleradas em" / **três vezes.** (vermelho) |
| 20 s | Mas se você quiser realmente ver | vazamento com batida; rosto 1,1 | legenda y 1215 e 1298 |
| 21,9 s | outros modelos de edição como esse | corte seco, papel (prints) | "outros modelos de" / **edição** (vermelho) y 595 / "como esse", no alto |
| 24 s | e aprender a como usar | corte seco, palco | "e" / **aprender** (vermelho) / "a como usar" |
| 25,5 s | isso nos seus vídeos, | corte seco, arquivo (celular no tripé) | legenda "isso nos seus vídeos," |
| 26,7 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | corte seco, rosto 1,1 | “**edição**” (vermelho) fixo em y 1262; "comenta" e o resto da fala em linhas pequenas em y 1135 e 1395 |
