# sofistmotion01: motion sofisticado narrado

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (30 s, só a voz). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo, com o segundo
escrito) e o `mapa.json` (luz e cortes medidos a cada 0,25 s). Antes de editar, assista ao vídeo inteiro uma vez.

---

## 1. A cara do modelo

Sem apresentador. A voz fala, a tela desenha o que foi dito, e a tela é bonita o bastante para parecer peça de estúdio.
- **Registro Ouro na Noite:** preto, ouro e laranja com brilho de neon; vermelho só no pico da tensão (13 s).
- **Cada frase vira uma tela desenhada:** tipografia que se monta palavra por palavra no tempo da fala e um objeto que
  ilustra a palavra concreta (anéis com contador 1 s, notebook 3 s, anéis com cartões 6 s, roleta 9 s, celular 11 s,
  túnel 15 s, pasta de vidro 24 s).
- **Contraste tipográfico:** Inter Bold limpa e a palavra protagonista só em contorno neon (22 s).
- **Muito ar em volta do texto** e uma família de cor só.
- **Câmera que nunca para** e trocas com flash de luz, clarão, preto seco ou mergulho (3 s, 5 s, 8 s, 15 s, 20 s).
- **Fecho com a assinatura em ouro** que assenta (27 s a 29 s).

## 2. Os números do modelo (o `parece.py` confere)

Os valores são os do `assinatura.json`. Vídeo mais curto que o aprovado é comparado com os trechos do aprovado do mesmo
tamanho, não com a média dele inteiro.

| Item | Valor | O que é |
|---|---|---|
| Brilho | 23 (de 0 a 255) | Escuro, com o ouro brilhando |
| Contraste | 106 | Neon forte sobre preto |
| Saturação | 165 | Ouro e laranja bem vivos |
| Temperatura | +6 | Quente |
| Tom | +3 | Neutro puxando para o amarelo |
| Cortes | cerca de 34 por minuto (em vídeo de até 15 s, até cerca de 50 é normal) | Uma tela nova a cada 1,5 a 5 s, com evento dentro a cada 0,3 a 0,7 s |
| Cauda | cerca de 2 s depois da última palavra | A trilha some no preto |

**Como o contraste é medido:** em cada quadro, a distância entre o claro (p95) e o escuro (p5) da luz; vale a mediana
dos quadros. Então ele só fecha se pelo menos metade das telas tiver um objeto grande e aceso (anel, roleta, celular,
pasta, túnel, assinatura). Objeto escuro ou pequeno sobre o preto derruba o número: com o vídeo reprovado em contraste,
aumente e acenda o objeto, não mexa no texto. Celular e notebook (C2, C5) são escuros sozinhos: num vídeo novo que
os use por mais de 1 a 2 s, ponha atrás deles um disco de luz quente e dois anéis neon (`AnelNeon`, r 470 e 410)
entrando junto com o objeto. O molde não traz isso porque o aprovado não usa.

## 3. Cenas e ritmo

**Duas estruturas de roteiro** (quem decide é a fala):
- **A. Anúncio de produto:** gancho de identificação, dor concreta com número, para quem, o absurdo, virada e produto,
  como funciona em verbos, o ganho, o nome. É a do aprovado, adaptada: a chamada falada vira a assinatura.
- **B. Manifesto de ideia:** afirmação forte, o porquê com o concreto, a consequência em lista, o contraste, as
  qualidades em lista, a frase-tese e a assinatura (a palavra-tese falada por último, em maiúscula). Sem chamada.

**Ritmo:**
- Uma tela a cada 1,5 a 5 s; um evento novo dentro da tela (palavra, cartão, gomo, ícone) a cada 0,3 a 0,7 s.
- Nenhum trecho de mais de 2,5 s sem palavra nova ou troca, fora a assinatura.
- **Nada parado:** a câmera aproxima, atravessa, gira ou desliza; os objetos flutuam de leve. O que está atrás ou
  dos lados fica desfocado.
- **O tempo de leitura vence o ritmo.** O fundo pode trocar rápido, mas o texto segura o tempo dele. Verbos colados se
  acumulam na mesma tela em vez de um apagar o outro.
- **Fala rápida não se aperta.** Acima de cerca de 2,7 palavras por segundo, cortar pausa só piora a leitura. Abaixo
  disso, pode tirar respiro e take repetido, sem tirar palavra que muda o sentido.

**Layout em 9:16:**
- **Objeto em cima, texto embaixo:** objeto em y 250 a 1050, texto com a 1ª linha em y 1210 e as seguintes a cada
  84 px (1294, 1378), até 3 linhas de 70 px (3 s, 9 s, 11 s, 17 s).
- **Ou texto no centro:** pilha em volta de y 850 a 1080, com o objeto em volta (anéis, 6 s; contorno neon, 22 s).
- Largura de texto até 800 px, centrada em x 540. A roleta pode vazar pela esquerda e os cartões rolar à direita
  (9 s). Objeto que cruzaria o texto ganha máscara embaixo (túnel, 15 s).

## 4. Os objetos (o repertório de telas)

| # | Tela | No aprovado | Quando a fala pede |
|---|---|---|---|
| T1 | Palavra gigante em movimento que desliza e vira a frase menor | (0 s) | a primeira frase |
| T2 | Objeto + texto: notebook ou celular em 3D entrando girando, com a tela de quem anuncia | (3 s, 11 s) | o assunto é uma tela ou produto |
| T3 | Contador que sobe junto da fala, dentro de anéis | (1 s a 2 s) | número dito, **exatamente o dito** |
| T4 | Pico vermelho: a mesma cena com a cor virada para a tensão, câmera aproximando | (13 s) | o auge da dor; no máximo 2 vezes, e a virada devolve o ouro |
| T5 | Gesto de interface: botão de contorno e cursor que clica | (24 s) | verbo de ação ("aprender", "clica", "baixa") |
| T6 | Roleta que gira um gomo por item falado + fileira de cartões rolando | (8 s a 10 s) | lista falada |
| T7 | Palavra de impacto nascendo do desfoque, com horizonte de luz subindo | (20 s a 23 s) | frase de efeito curta |
| T8 | Anéis concêntricos com cartões orbitando e a frase no centro | (5 s a 7 s) | o assunto é um objeto ou várias telas |
| T9 | Revelação: clarão, portas abrindo, túnel de molduras | (15 s) | a virada ("agora", "para de..."); uma vez por vídeo |
| T10 | Setas desenhadas a lápis apontando a coisa | (17 s a 19 s, 28 s) | dêitico ("aqui", "isso", "olha"), no mesmo segundo |
| T11 | Rótulo por verbo em placa de vidro, acumulando | | verbos em sequência |
| T12 | Relógio | | tempo, prazo, hora; o verde do ganho, no máximo 1 cena |
| T20 | Assinatura em ouro com volume e luz passando, que assenta em branco | (27 s a 29 s) | o nome, a marca ou o comando final; no manifesto sem nome, a palavra-tese da última frase, em maiúscula e sem aspas |

- **Anéis:** 5 concêntricos no centro, girando devagar, traço de ouro com núcleo quase branco.
- **Cartões:** telas verticais 9:16 de vidro escuro, borda grossa laranja `#F38934` no destacado, cantos redondos,
  um nascendo por palavra (6 s).
- **Roleta:** raio grande, metade fora do quadro, gomos laranja, creme e vermelho, um gomo por palavra (9 s).
- **Neon de verdade:** todo traço tem **núcleo quase branco** e halo colorido largo (sombras de 3, 12 e 30 px). Sem
  isso o ouro fica chapado.
- **Fundo:** preto com névoa quente, poeira dourada fina e fachos de luz. Partículas com semente fixa.
- **Tela de produto:** só a tela real de quem anuncia. Sem ela, o mockup leva um desenho abstrato, nunca um print
  inventado, número de cliente, depoimento ou logo de terceiro.

## 5. O texto na tela

- **Fonte:** Inter 700 em todo texto, espaçamento -0,02em, espaço entre palavras de 0,27 do corpo. (Inter 500 está
  carregada para nota pequena.)
- **Cores:**

| Papel | Hex |
|---|---|
| Fundo | `#000000` a `#040100` |
| Névoa quente | `#1B0E04`, `#312616` |
| Fogo (roleta, fachos, partículas) | `#F48907`, névoa `#B06419` |
| Borda do destaque | `#F38934` |
| Ouro | `#F2BE3A`, ponto alto `#F8D834` |
| Núcleo de todo neon | `#FFFEDD` |
| Tensão | `#E0030A`, fundo `#3B0000`, texto `#FFE0E8` com halo `#E13B50` |
| Texto | `#FFFFF7` |
| Creme | `#F3E3C3` |

- **Tamanhos do aprovado:** frase embaixo 70 px; frase no centro dos anéis 64 px; frase de impacto 76 px; contorno
  neon 104 px; contador 210 px; assinatura 150 px; "comenta" 72 px; legenda do fecho 54 px; etiquetas das prévias
  34 px.
- **Toda palavra dita aparece, uma vez só, em ordem.** Cada palavra nasce no início dela (±2 quadros) **do desfoque
  para o foco**: 7 quadros, desfoque de 16 px, escala 1,14 → 1 e 10 px de subida (curva `0.16, 1, 0.3, 1`).
- **Troca perto da palavra:** palavra que termina a menos de 0,4 s da troca de cena não tem tempo de ser lida. Mova
  a troca para depois dela ou passe o trecho inteiro para a cena seguinte.
- **Tempo de leitura:** bloco de pelo menos 1,5 s (menos só na assinatura do fecho), palavra de pelo menos 0,4 s depois
  de nascer, no máximo 4 linhas por bloco. O bloco que não termina num flash some num desfoque de 14 px em 4 quadros.
  Nenhum texto atravessa uma troca de cena.
- **Destaques, só no termo protagonista:**
  - **ouro** (`#F8D834` com halo) numa palavra da linha: "Claude" (2 s, 10 s), "modelos" (6 s);
  - **contador** no número dito (1 s a 2 s);
  - **contorno neon** que se escreve da esquerda para a direita em 9 quadros: "outros modelos / de edição" (22 s);
  - **assinatura** em ouro que assenta em branco: “EDIÇÃO” (27 s).
- **Tensão:** no pico vermelho o texto vira `#FFE0E8` com halo vermelho (13 s).
- **Encolhe:** um bloco pode encolher para 58% e subir para y 590 para dar lugar ao destaque ("Mas se você quiser
  realmente ver", 22 s).
- **Nunca escreva o nome do modelo na tela** (as etiquetas das prévias nomeiam os vídeos mostrados). Nunca travessão.

## 6. Transições e fecho

- **Flash de tela cheia:** sobe em 2 quadros e desce em 10 quadros (0,33 s), com a tela nova já embaixo. Branco
  (`#FFFFFF` a `#F4E6CC`, 3 s e 20 s) ou quente (`#FFF6DC` a `#B06419`, 8 s, 24 s e 27 s).
- **Clarão com portas** (sol: `#FFFFFF`, `#FFD27A`, `#F48907`, `#7A3A05`): luz no centro e duas metades abrindo.
  Reservado para a virada (15 s).
- **Atravessar:** a câmera mergulha num elemento e sai na tela seguinte (5 s).
- **Preto seco** de 5 quadros (0,17 s) como respiro antes da tela seguinte (10,5 s a 10,7 s).
- **Corte seco** para o pico vermelho (12,6 s).
- **Fecho:** "comenta" e a palavra entre aspas, “EDIÇÃO”, ficam fixos em ouro; o resto da fala vai em 2 linhas de
  legenda abaixo (y 1075 e 1145) e a seta a lápis aponta para baixo em "aqui" (27 s a 29 s). O vídeo vai ao preto entre
  os quadros 918 e 932 e a trilha some na cauda.
- **Fecho de vídeo novo:** sem chamada e sem "aqui" na fala, o fecho é só a assinatura, sem seta: tire `seta_baixo`
  das `"marcas"`. A seta só entra se a fala disser "aqui" ou "embaixo" no fecho. O resto da última frase fica fixo em
  72 px em y 740, no lugar do "comenta" do aprovado.

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Efeitos sonoros do modelo (whoosh e estalo no flash, impacto no clarão, tique por gomo e cartão, brilho na assinatura) | **ligados** | Prop `efeitos: false` |
| Trilha sintetizada (16 dB abaixo da voz, com ducking, pulso que sobe na virada) | desligada | `scripts/som.py` e prop `musica: true` |
| Prévias de dois vídeos (16 s a 19 s) | desligadas (fica só o túnel) | `tools/previa.py`, `"previas"` no plano e props `previas: true, nomesPrevias: [...]` |
| Ir ao preto no fim | **ligado** | Tire `"escurece_q"` do `src/tempos.json` |
| Pulso da trilha na virada | na cena dada | `"virada": "<id>"`; sem a chave, não sobe |
| Registro Página Branca (branco puro `#FFFFFF`, verde `#12C000`, Inter 500 + Instrument Serif Italic numa palavra só) | desligado | Não tem telas prontas no molde: desenhe em `src/cenas.tsx` e passe pelo olho do dono antes |

Um registro só no vídeo inteiro. A trilha e os efeitos entram no próprio render, então o vídeo já sai mixado. Prévia
só de vídeo seu, nunca de terceiro.

## 8. Zona segura e material

- Todo texto fica em x 60–940 e y 250–1500 (1080x1920). Os últimos 20% de baixo ficam livres de texto.
- A zona segura é assimétrica de propósito: a coluna de botões do Instagram ocupa os 140 px da direita, por isso nenhum texto passa de x 940.
- **Pede a quem faz o vídeo:** a narração limpa (microfone perto, sem eco, sem música), e na estrutura A os prints ou
  gravações reais do produto, logo, nome e os números verdadeiros. Na B, a frase-tese e a assinatura.
- Nome ou @ na assinatura, só os reais e só se derem. Depoimento só real e autorizado. O que faltar vira pedido.

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo" (`videos/<AAAA-MM-DD-tema>/`).

1. **A narração vira vídeo** (o `novo-video.py` pede um vídeo): se você tem só o áudio,
   `ffmpeg -f lavfi -i color=c=black:s=1080x1920:r=30 -i narracao.wav -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac narracao.mp4`.
   Se a gravação tem rosto, use-a direto: só a voz entra.
2. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py sofistmotion01 <narracao.mp4> <AAAA-MM-DD-tema>`.
   Isso copia o molde, grava `public/voz.wav` e transcreve a fala em `src/palavras.json`. Se a transcrição errar um
   nome, acrescente `--trocar Cloud=Claude` (errado=certo).
3. **Escreva o `plano.md`** na pasta do vídeo: cada frase, a tela do repertório (seção 4), as palavras na tela e o
   gatilho. Frase sem objeto que a ilustre fica só com tipografia (T7), nunca com enfeite.
4. **Monte O PLANO em `src/tempos.json`** (na pasta do vídeo). O molde para de propósito enquanto o plano não bater com
   a fala nova e diz o que refazer.
   - `"fala"`: o texto da fala nova (o checador imprime pronto para colar).
   - `"duracao_q"`: em quadros, o fim da última palavra mais cerca de 2 s de cauda. `"escurece_q"`: `[início, fim]` da
     ida ao preto. `"virada"` e `"acordes"` (segundos ou id de cena; o último é o do fecho).
   - `"cenas"`: cada uma com `id` (C1 a C10, telas de `src/cenas.tsx`), `de_q`, `ate_q`, `tela` (o T do repertório) e
     `entrada` (`corte`, `flash-branco`, `flash-quente`, `atravessar`, `preto-seco`, `corte-seco`, `clarao-portas`,
     `clarao-quente`). Os ids não precisam seguir a ordem (C4 pode vir antes de C3) e uma tela pode ficar de fora.
     Antes de redesenhar, reaproveite: a mesma tela serve a outra frase trocando só as marcas dela. Só redesenhe em
     `src/cenas.tsx` (e ligue no `src/Reel.tsx`) quando nenhuma tela do molde ilustrar a frase.
   - `"flashes"`: `{"q", "cor"}` com cor `branco`, `quente` ou `sol`, no quadro da troca.
   - `"previas"`: `{"de_q", "ate_q"}`, ou tire a chave.
   - `"marcas"`: `"nome": [índice, "palavra"]`, os instantes que as telas e o som usam. Cada tela pede estas:

     | Cena | Marcas que ela pede |
     |---|---|
     | C1 | `contador` (obrigatória) |
     | C2 | `editor` (obrigatória) |
     | C3 | `cartao1` a `cartao4` e `melhorei`, todas opcionais: cartão sem marca não nasce, sem `melhorei` o destaque não acende |
     | C4 | `roleta1` a `roleta4`, opcionais: um gomo por marca, então lista de 3 itens leva só 3 |
     | C5 | `coracao` (opcional: sem ela o coração não pulsa) |
     | C6 | `apenas` (obrigatória) |
     | C7 | `setas` e `tres` (obrigatórias quando há `"previas"`) |
     | C9 | `clique` (obrigatória), `icone1` a `icone4` opcionais: ícone sem marca não salta |
     | C10 | `seta_baixo` (opcional: sem ela não há seta) |

     Marca obrigatória que falta para o render com a mensagem do que pôr. Use só as cenas que o plano tem.
   - `"texto"`: troca a grafia de uma palavra (ex.: `"84": "“EDIÇÃO”"`).
   - `"blocos"`: cada um com `cena`, `pos` (`embaixo`, `centro`, `fecho`), opcionais `de_q`, `ate_q`, `estilo:
     "tensao"`, `encolhe_q`, e `linhas` com `ids`, `fs`, `y`, `ouro` e `tipo` (`gigante`, `contador`, `contorno`,
     `assinatura`).
5. **Confira as regras:** `../../.venv/Scripts/python.exe scripts/conferir.py` (na pasta do vídeo) até sair `0 erros`.
   Ele confere o plano contra a fala, toda palavra uma vez, no tempo e por 0,4 s, blocos de 1,5 s e até 4 linhas sem
   atravessar troca de cena, zona segura medida com a Inter, nenhum trecho de 2,5 s sem evento, nenhum travessão e
   nenhum nome de modelo.
6. **Som:** `../../.venv/Scripts/python.exe scripts/som.py` (na pasta do vídeo). Grava `public/trilha.wav` e
   `public/efeitos.wav` a partir do plano. Os efeitos vêm ligados, então rode sempre que o plano mudar.
7. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10 15 22 28` (na pasta do
   vídeo). Saem em `conferencia/q/`. `ESCALA=1` tamanho cheio, `--previas` liga as prévias, `PROPS=<arquivo.json>` usa
   as props do render. Olhe sempre os quadros em volta de cada troca.
8. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineSofistMotion01 out/bruto.mp4 --codec=h264 --crf=16 --concurrency=2`.
   Com trilha: `--props='{"musica":true,"efeitos":true}'`. Com prévias, acrescente
   `"previas":true,"nomesPrevias":["<modelo1>","<modelo2>"]`.
9. **Mixe:** `sh scripts/finalizar.sh out/bruto.mp4 out/final.mp4` (na pasta do vídeo). O som já sai do render; aqui
   só normaliza em -14 LUFS e pico -1 dBTP.
10. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 sofistmotion01`.
    Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
    em cima e o seu embaixo. Folha de 1 quadro por segundo do seu:
    `../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4` (na pasta do vídeo).

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<v> 1` (e `2`).

## 10. O plano do vídeo aprovado (para comparar)

| Tempo | Fala | Cena / transição | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo | C1 (T1+T3), início | "Esse vídeo" gigante desliza e vira a frase menor |
| 1 s | 100% editado pelo Claude. | C1 | anéis de ouro com o contador 0 a 100%, "editado pelo **Claude**" |
| 3 s | Ele foi criado justamente para | C2 (T2), flash branco | notebook 3D com a linha do tempo montando em "criado" |
| 4,6 s | te mostrar a diferença entre vários modelos que eu criei e melhorei | C3 (T8), atravessar | anéis com um cartão nascendo por palavra, "modelos" em ouro |
| 8,1 s | para editar qualquer tipo de vídeo usando o Claude. | C4 (T6), flash quente | roleta girando um gomo por palavra e cartões à direita |
| 10,7 s | Inclusive, se você estiver no Instagram agora, | C5 (T2), preto seco | celular com a tela de 100% e o coração em "Instagram" |
| 12,6 s | você está vendo apenas um desses modelos. | C6 (T4), corte seco | o mesmo celular em close, tudo vermelho; texto de tensão |
| 14,5 s | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | C7 (T9+T10+T3), clarão com portas | túnel de molduras; prévias pousam no alto (16 s), setas a lápis em "aqui", selo 1x → 3x em "três" |
| 20 s | Mas se você quiser realmente ver | C8 (T7), flash branco | frase de impacto no centro com horizonte de luz |
| 22 s | outros modelos de edição como esse | C8 | a frase encolhe e sobe; "outros modelos / de edição" em contorno neon |
| 24 s | e aprender a como usar isso nos seus vídeos, | C9 (T5), flash quente | pasta de vidro dourada, cursor clica em "aprender", ícones saltam um por palavra |
| 26,8 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | C10 (T20+T10), clarão quente | "comenta" e “EDIÇÃO” em ouro que assenta, legenda em 2 linhas, seta para baixo; vai ao preto, cauda até 31,7 s |
