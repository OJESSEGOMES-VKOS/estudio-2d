# anunciomotion01: anúncio em motion sem apresentador

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (30 s, só a voz). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo, com o segundo
escrito) e o `mapa.json` (luz e cortes medidos a cada 0,25 s). Antes de editar, assista ao vídeo inteiro uma vez.

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

Ninguém aparece. A narração conduz e a tela encena cada frase com objetos de vidro e neon.
- **Fundo preto listrado com luz da cor da marca vazando**, e de vez em quando um **respiro claro** em corte seco
  (escuro em 0 s, claro em 3 s, escuro em 5 s, claro em 13 s e 25 s).
- **Objetos que fazem o que a fala diz:** play nos anéis (0 s), editor numa placa (3 s), placas inclinadas (6 s), ícone
  herói com órbita (9 s), celular flutuando (11 s), interruptor que liga (25 s).
- **Toda a fala vira texto** numa altura de partida (no máximo duas), em linhas de tamanho e peso misturados (6 s, 10 s).
- **Destaque em pílula de contorno brilhante**, escrita letra por letra (22 s, 28 s).
- **Câmera viva:** nada fica parado. Uma ideia nova a cada 0,7 a 1,5 s.
- **Fecho com o comando:** comenta e a palavra entre aspas numa pílula, sobre anéis (27 s a 29 s). Sem comando na
  fala, a pílula leva o termo protagonista da última frase.

**A cor é de cada anúncio.** O menta `#3CF2A4` do vídeo aprovado é só a cor daquele vídeo. Todo anúncio novo nasce
com identidade visual própria: as cores e a marca de quem pede o anúncio, ou uma paleta nova pensada para aquele
criativo, mais convidativa e com mais chance de conversão. Nunca as cores do negócio de quem edita. Dois anúncios
seguidos nunca saem com a mesma identidade. O que fica igual entre eles é a gramática: fundo escuro com respiros
claros, uma cor de marca com brilho, vermelho só para o ruim, uma fonte, objetos de vidro, câmera viva.

## 2. Os números do modelo (o `parece.py` confere)

| Item | Valor | O que é |
|---|---|---|
| Brilho | 22 (de 0 a 255) | Vídeo escuro, com respiros claros curtos |
| Contraste | 84 | Neon forte sobre preto |
| Saturação | 103 | Uma cor viva sobre neutros |
| Temperatura | +1 | Neutra (a cor vem da marca, não de filtro) |
| Tom (referência, o `parece.py` não mede) | -4 | Leve puxada para o verde da marca aprovada |
| Cortes | cerca de 18 por minuto | Uma tela nova a cada 1,5 a 3,5 s |
| Proporção escuro/claro (referência, o `parece.py` não mede) | cerca de 70% / 30% | Claro só em respiros |

Este modelo é de **cor própria**: cada anúncio tem a sua. Por isso o `parece.py` só avisa em brilho, contraste,
saturação e temperatura, sem reprovar. O **ritmo continua cobrado**: o `parece.py` mede os cortes por minuto e
aponta quando fogem (em vídeo curto o número oscila, por isso ele avisa), e o `scripts/conferir.py` reprova trecho de
2,5 s sem evento. Corrija o ritmo sempre que aparecer, aviso ou erro.

## 3. Cenas e ritmo

- **Três atos, quando a fala tem:** dor (escuro, vermelho, coisas riscadas), virada e produto (a cor da marca, o produto
  real, números caindo), chamada (frase curta de ação e a marca se montando no fim). Sem dor na fala, não se inventa dor
  (o vídeo aprovado não tem).
- **Cada cena dura de 1,5 a 6 s**, e dentro dela os objetos trocam a cada 0,7 a 1,5 s no tempo das palavras. Troque de
  cena só onde a fala dá 0,4 s de folga depois da última palavra do bloco; numa fala corrida, mude o objeto dentro da
  cena em vez de cortar.
  Nenhum trecho fica mais de 2,5 s sem evento novo, fora o fecho.
- **Câmera viva:** zoom lento para frente ou para trás e leve giro 3D nos objetos. Nada estático.
- **Fundo escuro:** preto `#050807`, listras diagonais finas (135°, branco 2,8%, a cada 15 px), duas luzes redondas da
  cor da marca que andam devagar (a de cima a 20%, a de baixo a 10%) nos cantos (em cima à esquerda, embaixo à direita), vinheta escura nas bordas e
  poeira de luz com pontos nítidos e desfocados.
- **Respiro claro:** `#F3FBF7` com manchas suaves da cor da marca e listras a 2,4%. Entra sempre em corte seco.
- **Profundidade:** o objeto principal nítido, os outros desfocados na frente ou atrás (6 s, 20 s).

## 4. Os objetos (o repertório de telas)

Cada frase vira um objeto. Escolha o que **representa o ato** que a fala diz, no instante da palavra.

1. **Play nos anéis que vira número** (0 s a 2 s): botão de vidro na cor da marca no centro de anéis concêntricos, e o
   número dito conta no lugar dele ("99%" em 1 s, "100%" em 2 s).
2. **Placa inclinada com tela** (3 s a 4 s): uma tela numa placa branca em perspectiva, com sombra e brilho no
   contorno, ganhando uma peça a cada palavra.
3. **Placas em leque** (6 s a 7 s): três telinhas inclinadas, a do meio na frente e nítida, com check na palavra de
   resultado.
4. **Ícone herói com órbita** (8 s a 10 s): ícone de vidro grande que entra em escala com brilho, e ícones menores
   nascem em volta dele a cada palavra.
5. **Celular flutuando** (11 s a 12 s): celular inclinado com uma tela desenhada e um ícone que pulsa na palavra.
6. **Muitas telinhas e uma que cresce** (13 s a 14 s): várias telas pequenas e a que a fala aponta cresce na frente.
7. **Avanço rápido e prévias** (15 s a 19 s): ícone de avanço rápido nos anéis; com prévias ligadas, duas placas de
   vídeo voam dos lados com o nome embaixo, setas na palavra "aqui" e riscos na palavra "aceleradas".
8. **Pílulas de destaque** (22 s a 24 s): o termo protagonista em pílulas empilhadas, sobre anéis, com telinhas
   desfocadas atrás.
9. **Interruptor que liga** (25 s a 26 s): interruptor OFF que vira ON na palavra de ação, e o resultado aparece embaixo.
10. **Fecho** (27 s a 29 s): "comenta" e a pílula com a palavra entre aspas nos anéis, seta desenhada para baixo em
    "embaixo".

Também fazem parte do modelo, quando a fala pede: palavra ruim **riscada por uma linha vermelha** da esquerda para a
direita, item por item; **símbolo de proibido** sobre o que é ruim; **dor em glitch** (caixa alta fina, tremida, rastro
vermelho, sempre no escuro); **notificações empilhadas** caindo rápido; **botão com cadeado que destrava**;
**gráfico que cresce** com o valor contando; **fluxo** com setas revelando ganhos um por um; **pirâmide** de degraus;
**fecho em neon** com uma promessa por tela; **marca se montando** no fim, parada 2 a 3 s. Tela nova se desenha em
`src/cenas.tsx` como `export const S11: React.FC<TelaProps> = ...` (o próximo número livre) e passa a valer como id de
cena no plano; o `src/Reel.tsx` acha sozinho todo export `S<n>`.

**Nunca se inventa produto.** As telas são desenhos genéricos feitos para ilustrar o que a fala diz (blocos, ícones,
barras, uma telinha de vídeo), sem nome, número, preço, cliente, taxa, selo ou logo falsos. Quando a fala mostra o
produto de verdade (app, painel, checkout, site), a tela é o print ou a gravação real que quem pede o anúncio manda, ou
um desenho fiel a ele com os textos e números verdadeiros. O que só o dono do produto tem vira pedido, e o resto do
vídeo segue com as telas genéricas.

## 5. O texto (conta a história)

- **Uma fonte, a Sora.** Linha comum em Regular 400 com 60 px; palavra de peso em ExtraBold 800 com 80 px. A frase é
  montada em linhas que alternam os dois (6 s: "te mostrar a diferença" fina, "entre vários **modelos**" forte).
  Espaçamento -0,025em (-0,045em acima de 90 px).
- **Cor:** no escuro, forte em branco `#FFFFFF` e fina em `#C9D6CF`; no claro, forte em `#0D1A14` e fina em `#4C5E55`.
  A palavra-chave da linha (`marca`) sai na cor da marca com brilho (6 s "modelos", 10 s "Claude").
- **Toda palavra dita aparece, uma vez só, em ordem.** Cada palavra nasce no início dela (±2 quadros) de um desfoque
  de 16 px com deslize de 34 px da esquerda, em 0,2 s (curva `0.16, 1, 0.3, 1`).
- **Tempo de leitura:** cada bloco fica pelo menos 1,5 s, cada palavra pelo menos 0,4 s depois de nascer. No máximo 4
  linhas por bloco. O bloco some num desfoque de 12 px nos últimos 0,1 s da cena.
- **Altura:** a primeira linha com o centro em y 1170 e as seguintes a cada 80 a 92 px (1258, 1346, 1432). No vídeo
  inteiro a legenda parte de no máximo duas alturas (o checador reprova a terceira), e o melhor é uma só: o aprovado
  usa só 1170. Centro horizontal em x 500, o meio da zona segura.
- **Pílula de destaque:** Sora 700 com 84 px, caixa de contorno brilhante do tamanho da frase, entra inclinada em 3D
  com mola e endireita, e as letras se escrevem em 0,14 s por palavra (22 s). Pílulas do mesmo vídeo têm o mesmo
  tamanho. Uma pílula fica em y 790 e a segunda em y 950 (22 s), ou sozinha em y 880 no fecho (28 s).
- **Contador:** Sora 700 com 300 px, branco com brilho da cor da marca, centro em y 760, conta de 0 ao número dito em
  0,45 s e nasce de um desfoque com escala 0,6 → 1 (1 s a 2 s). O número é sempre o dito: o molde lê o número da
  própria palavra (`"40%"` conta até 40).
- **Só o termo protagonista vira pílula** ("outros modelos / de edição", 22 s). Advérbio ou ligação nunca.
- **Nunca escreva o nome do modelo na tela.** Nunca travessão no texto.

## 6. Transições e fecho

- **Corte seco com batida de zoom:** a cena nova entra em escala 1,035 e assenta em 1 em 0,12 s. É a transição do
  escuro para o claro e de volta (3 s, 5 s, 13 s, 25 s).
- **Borrão:** em 0,22 s a cena velha incha até 1,25 e borra até 40 px, e a nova nasce do borrão vindo de 1,18
  (curva `0.83, 0, 0.17, 1`) (8 s, 11 s, 20 s).
- **Íris:** um círculo abre do centro em 0,42 s até 1250 px de raio com um anel claro da cor da marca brilhando na
  borda, enquanto a cena velha cresce e borra (15 s, 27 s).
- **Fecho:** só o comando fica fixo, "comenta" e a palavra entre aspas na pílula (“EDIÇÃO”, 28 s); o resto da fala
  segue na legenda abaixo. Sem comando na fala, as palavras de ligação antes do termo ficam numa linha fina em y 760 acima da pílula (como o
  "comenta"), e o fecho é a pílula com o termo protagonista da última frase, sobre os
  anéis, e o resto da frase segue na legenda. Nos últimos 0,4 s o vídeo vai ao preto, depois da voz (`"escurece": true`).

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Efeitos sonoros do modelo (whoosh, estalo, impacto, tiques) | **ligados** | Prop `efeitos: false` |
| Trilha eletrônica sintetizada | desligada | `scripts/som.py` e prop `musica: true` |
| Prévias de dois vídeos (15 s a 19 s) | desligadas | `tools/previa.py`, `"previas"` no plano e props `previas: true, nomesPrevias: [...]` |
| Ir ao preto no fim | **ligado** | `"escurece": false` no `src/tempos.json` |
| Pulso da trilha que sobe numa cena | ligado na cena dada | `"virada": "<id da cena>"`; sem a chave, não sobe |
| Cor da marca | a do anúncio | Uma linha em `src/tema.ts`: `export const C: Paleta = gira(PADRAO, '#RRGGBB');` (veja abaixo) |

**A cor num lugar só.** Toda cor do vídeo sai da paleta `C` de `src/tema.ts`: fundos, luzes, vidro, telas, sombras,
celular, interruptor, pílulas. `PADRAO` é o vídeo aprovado. `gira(PADRAO, cor)` leva a paleta inteira para o matiz da
cor dada, mantendo o claro e o escuro de cada tom, e põe a cor dada como cor da marca. O vermelho (o ruim) e o branco
não mudam. Para acertar um tom só, escreva a paleta à mão: `{...gira(PADRAO, cor), vClaro: '#...'}`. Cor quente (laranja, amarelo) sai mais saturada que o menta, e os números de cor do `parece.py` só avisam neste modelo.

**Como escolher a cor:** é a da marca de quem anuncia (logo, site, perfil), nunca inventada nem a do negócio de quem
edita. Sem marca definida, escolha uma cor própria para aquele anúncio, viva o bastante para brilhar no preto, e
nunca o menta `#3CF2A4` do aprovado. Confira nos quadros que não sobrou verde.

A trilha e os efeitos sonoros entram no próprio render, então o vídeo já sai mixado. Prévia só de vídeo seu, nunca de
terceiro.

## 8. Zona segura e material

- Todo texto fica em x 60–940 e y 250–1500 (1080x1920). Os objetos podem passar disso.
- A zona segura é assimétrica de propósito: a coluna de botões do Instagram ocupa os 140 px da direita, por isso nenhum texto passa de x 940.
- **Narração:** gravada por quem pede o anúncio ou gerada com o ok dele. O roteiro passa pelo `/humanizer`.
- **Prints e gravações do produto, logo e marca:** de quem pede o anúncio. Logo de terceiro (meio de pagamento,
  parceiro) só se o produto realmente integra.
- Nome, número, prova ou depoimento na tela, só os verdadeiros. Faltou, vira pedido; nunca se inventa.

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo" (`videos/<AAAA-MM-DD-tema>/`).

1. **A narração vira vídeo** (o `novo-video.py` pede um vídeo): se você tem só o áudio,
   `ffmpeg -f lavfi -i color=c=black:s=1080x1920:r=30 -i narracao.wav -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac narracao.mp4`.
2. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py anunciomotion01 <narracao.mp4> <AAAA-MM-DD-tema>`.
   Isso copia o molde, grava `public/voz.wav` e transcreve a fala em `src/palavras.json`.
   Nome que a transcrição errar (ex.: "Cloud" no lugar de "Claude") se corrige já aqui: `--trocar Cloud=Claude` (pode repetir).
3. **Defina a identidade do anúncio:** em `src/tema.ts`, troque a linha `export const C: Paleta = PADRAO;` por
   `export const C: Paleta = gira(PADRAO, '#RRGGBB');` com a cor da marca de quem anuncia (seção 7: nunca inventada;
   sem marca, uma cor própria do anúncio que não seja a do aprovado). É o único lugar: o vídeo inteiro troca. O
   vermelho `#FF2A2A` continua só para o ruim.
4. **Monte O PLANO em `src/tempos.json`** (na pasta do vídeo), sobre `src/palavras.json`. O molde para de propósito
   enquanto o plano não bater com a fala nova e diz o que refazer.
   - `"fala"`: o texto da fala nova (o checador imprime pronto para colar).
   - `"duracao_q"`: em quadros, ao menos o fim da última palavra. `"escurece"` e `"virada"`.
   - `"acordes"`: a lista de onde a trilha troca de acorde, cada item em segundos (`0.0`) ou id de cena (`"S3"`, o
     início dela). Cada item começa um acorde novo da sequência, e o último é sempre o acorde do fecho. Sem a lista, um
     acorde por cena.
   - `"cenas"`: cada uma com `id` (uma tela de `src/cenas.tsx`), `de_q`, `ate_q`, `fundo` (`escuro` ou `claro`) e
     `entrada` (`corte`, `borrao` ou `iris`). A última é o fecho. As telas S1 a S10 encenam a fala do vídeo aprovado;
     para a fala nova, redesenhe cada tela em `src/cenas.tsx` com o objeto que representa a frase (seção 4).
   - `"previas"`: `{"de_q", "ate_q"}`, ou tire a chave.
   - `"marcas"`: `"nome": [índice, "palavra"]`, os instantes que as telas (`marca("nome")`) e o som usam. O nome é
     livre. Toda marca toca um tique leve no tempo dela; os nomes do aprovado (`inicio`, `cem`, `clipe1`…, `usar`,
     `edicao`, `embaixo`) tocam o efeito próprio que está em `scripts/som.py`, e `videos` fica sem som.
   - `"texto"`: troca a grafia de uma palavra (ex.: `"84": "“EDIÇÃO”"`).
   - `"blocos"`: o texto, cada um com `cena` (e `de_q`/`ate_q` para dividir a cena) e `linhas` com `ids`, `fs`, `peso`,
     `y`, `marca` e `tipo` (`contador` ou `pilula`).
5. **Confira as regras:** `../../.venv/Scripts/python.exe scripts/conferir.py` (na pasta do vídeo) até sair `0 erros`.
   Ele confere que o plano é desta fala, que toda palavra aparece uma vez, nasce no tempo e fica 0,4 s, blocos de 1,5 s
   e até 4 linhas, zona segura, legenda em no máximo 2 alturas, pílulas do mesmo tamanho, nenhum trecho de 2,5 s sem
   evento, nenhum travessão e nenhum nome de modelo.
6. **Som:** `../../.venv/Scripts/python.exe scripts/som.py` (na pasta do vídeo). Grava
   `public/trilha.wav` e `public/efeitos.wav` a partir do plano. Os efeitos vêm ligados, então rode sempre que o plano
   mudar.
7. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10 15 20 25` (na pasta do
   vídeo). Saem em `conferencia/q/`. `--previas` liga as prévias; `PROPS=<arquivo.json>` usa as props do render.
8. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineAnuncioMotion01 out/bruto.mp4 --codec=h264 --crf=16 --concurrency=2`.
   Com trilha: `--props='{"musica":true,"efeitos":true}'`. Com prévias, acrescente
   `"previas":true,"nomesPrevias":["<modelo1>","<modelo2>"]`.
9. **Mixe:** `sh scripts/finalizar.sh out/bruto.mp4 out/final.mp4` (na pasta do vídeo). O som já sai do render; aqui
   só normaliza em -14 LUFS e pico -1 dBTP.
10. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 anunciomotion01`.
    Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
    em cima e o seu embaixo. Folha de 1 quadro por segundo do seu:
    `../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4` (na pasta do vídeo, em `conferencia/folha-1qps.png`,
    mais `conferencia/lado-a-lado.png` contra o `referencia/referencia.mp4`).

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<v> 1` (e `2`).

## 10. O plano do vídeo aprovado (para comparar)

| Tempo | Fala | Cena / transição | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo | S1, escuro | play de vidro nos anéis; "Esse vídeo está sendo" fino |
| 1 s | 100% | S1 | o play vira o contador 0 a 100%, enorme no centro |
| 2 s | editado pelo Claude. | S1 | "editado pelo **Claude**" forte, Claude na cor da marca |
| 3 s | Ele foi criado justamente para | S2, corte seco para o claro | editor numa placa inclinada, um clipe novo a cada palavra |
| 5 s | te mostrar a diferença entre vários modelos que eu criei e melhorei | S3, corte seco para o escuro | três placas em leque, a do meio na frente, check em "melhorei"; "modelos" na cor da marca |
| 8 s | para editar qualquer tipo de vídeo usando o Claude. | S4, borrão | ícone herói de play; microfone, câmera, celular e claquete nascem em volta a cada palavra |
| 11 s | Inclusive, se você estiver no Instagram agora, | S5, borrão | celular flutuando com a tela de 100% e o coração em "Instagram" |
| 13 s | você está vendo apenas um desses modelos. | S6, corte seco para o claro | seis telinhas e a de "apenas um" cresce na frente |
| 15 s | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | S7, íris | avanço rápido nos anéis; prévias voam dos lados (16 s), setas em "aqui", riscos em "aceleradas" |
| 20 s | Mas se você quiser realmente ver | S8, borrão | telinhas espalhadas em profundidade |
| 22 s | outros modelos de edição como esse e aprender | S8 | pílulas "outros modelos" e "de edição" sobre anéis |
| 25 s | a como usar isso nos seus vídeos, | S9, corte seco para o claro | interruptor OFF → ON em "usar", telinhas embaixo |
| 27 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | S10, íris | "comenta" e a pílula “EDIÇÃO” nos anéis, seta em "embaixo", legenda abaixo; vai ao preto no fim |
