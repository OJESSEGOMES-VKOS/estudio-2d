# ilustrations01: metáfora animada no preto

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (30 s, só a voz). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo, com o segundo
escrito) e o `mapa.json` (luz medida a cada 0,25 s; nenhum corte). Antes de editar, assista ao vídeo inteiro uma vez.

---

## 1. A cara do modelo

Sem rosto. Uma cena mínima de vetor no preto prova a tese da fala sem explicar nada.
- **Plano único, câmera parada, nenhum corte** do 0 s ao 30 s.
- **Bonecos palito brancos idênticos** com reflexo no chão invisível. A única diferença entre eles é o que fazem
  (0 s a 26 s).
- **A mesma ação repetida em compasso** até a diferença virar resultado: no aprovado, cada boneco chega, para e a tela
  que ele segura é editada (2 s, 5 s, 7 s, 9 s).
- **A cor é o juiz.** Tudo é branco e cinza até a virada; na virada, verde aceso com halo (22 s).
- **Uma frase curta por vez**, entre aspas, digitada em caixa alta pequena (1 s, 5 s, 9 s, 13 s, 22 s).
- **Fecho com apagão e a moral** em 2 linhas no preto (27 s a 29 s).
- **Silêncio visual:** preto puro, objetos pequenos, letra pequena. O vazio é o que faz o aceso gritar.

## 2. Os números do modelo (o `parece.py` confere)

| Item | Valor | O que é |
|---|---|---|
| Brilho | 6,6 (de 0 a 255) | Quase tudo preto |
| Contraste | 9 | Pouca área clara no quadro |
| Saturação | 5 | Sem cor, até a virada |
| Temperatura | 0 | Neutra |
| Cortes | 0 por minuto | Plano único |
| Virada (referência, o `parece.py` não mede) | entre 60% e 76% da duração | (22 s, 72%) |

## 3. A história, as cenas e o ritmo

**O que este formato conta:** uma comparação de comportamento com um resultado que dá razão a um lado, ou uma ironia de
perspectiva. Serve para uma tese de uma frase sobre atitude (constância, coragem de tentar, foco). Não serve para lista,
tutorial ou notícia.

**As três formas** (escolha pela fala):

| | **A. Duelo** | **B. Escada de porcentagem** | **C. Corrente com virada** (a do aprovado) |
|---|---|---|---|
| Quando | a fala opõe dois jeitos de agir | a fala tem número ou "a maioria / poucos" | a fala tem várias ideias ou passos em sequência |
| Quem | 2 personagens iguais lado a lado (centros em x 31% e 68%), nome de cada um em cima | 3 fileiras iguais empilhadas (passo de 22% da altura), cada uma com a sua fatia | 4 a 6 personagens que chegam um depois do outro |
| A diferença | um começa forte e para, ou nunca age; o outro segue no compasso | a de cima nunca se mexe, a do meio tenta 1 vez, a de baixo erra e acerta | cada chegada mostra uma ideia da fala |
| Virada | o cinza desiste ou o acerto acende | o acerto verde | o evento de cor na frase de virada |
| Fecho | segura o resultado 3 a 4 s, sem texto | segura 3 s, sem texto | apagão e moral em 2 linhas, segurada 3 s ou mais |
| Duração | 8 a 12 s | cerca de 10 s | 25 a 30 s |

**Fala curta (8 a 12 s) com ideias em sequência:** forma C compacta, 3 a 4 personagens, um a cada cerca de 2 s. Sem
comando na fala, não há apagão nem moral: segure o resultado na tela com a última frase até o fim.

**O esqueleto comum:**
1. **0 a 1 s, a premissa na tela.** Personagens já postos (A e B) ou o 1º entrando (C, já em movimento no quadro 0).
   Nada de título.
2. **O ciclo começa no 1º segundo** e segue no mesmo compasso: uma ação a cada 1,2 a 1,4 s (A e B), um personagem novo
   a cada 2 a 5 s (C; no aprovado, a cada cerca de 2,3 s nos primeiros 10 s).
3. **A divergência:** um lado desacelera, para ou nunca começa. Quem desiste começa **mais rápido** e vai alongando o
   ciclo (0,75 → 0,8 → 0,95 → 1,35 → 1,7 s) até parar. Os erros ficam na tela, e cada erro mostra avanço ou custo
   (a próxima tentativa chega mais longe), nunca só fracasso.
4. **A virada entre 60 e 76% da duração**, sempre um evento de cor. Se a frase de virada da fala cair fora disso, vale a
   fala.
5. **Depois da virada, nada novo** por 3 a 4 s, ou a moral.

**Movimento:**
- **Câmera parada.** Única exceção permitida: um deslize lateral de cerca de 1 s para levar a uma 2ª cena (tudo corre
  junto para um lado, o que sai acelera, o que entra freia). Nunca corte.
- **Chegada:** entra pela borda (x -70 no aprovado) e freia longo até parar, em 2,0 a 2,4 s (curva de freio de potência
  1,8). Os passos acompanham a distância (62 px por meia passada) (1 s, 3 s, 5 s, 8 s, 20 s).
- **Saída:** arranca devagar e acelera em cerca de 2 s.
- **Ação rápida** (flecha, bola, varredura): cruza em 0,1 a 0,3 s. No aprovado, a varredura de edição dura 0,28 s.
- **Mudança de cor:** instantânea no impacto.
- Peça nenhuma aparece antes da sua entrada.

## 4. O palco e os personagens

| Peça | Medida |
|---|---|
| Fundo | `#000000` puro, sem textura, sem vinheta |
| Chão | invisível, em y 1190 (62%). Existe só pelo reflexo |
| Reflexo | cópia espelhada sob o chão, desfoque de 4 a 6 px, cerca de 20% da luz, sumindo em 173 px (9% da altura) |
| Boneco palito | branco giz `#FCFCFC` com volume suave (degradê de `#FFFFFF` a `#D9D9D9`, contorno `#A9A9A9`), cabeça redonda de raio 19, membros de 14 px com ponta redonda, um ponto de olho `#151515` para mostrar para onde olha. Altura 205 px (10,7%), largura cerca de 7% |
| Objeto que ele segura (aprovado) | tela 9:16 de 100x178 acima da cabeça (topo em y cerca de 775). Crua: cinza `#363636`/`#2C2C2C` com ▶ `#6A6A6A`. Editada: preto com borda branca acesa |
| Posições finais (aprovado) | x 810, 660, 510, 360 e 210, da direita para a esquerda, na ordem de chegada |
| Tamanho dos objetos | cada personagem ou objeto principal ocupa de 7 a 21% da largura, com muito vazio em volta |

- **Vetor com sombreado suave de volume** (degradês do SVG), nunca traço chapado nem imagem raster no personagem.
- **Objetos repetidos são idênticos.** Pessoa real nunca; o personagem é palito sem rosto, manequim sem rosto ou só as
  mãos.

**Paleta (a identidade do modelo):**

| Papel | Hex |
|---|---|
| Palco | `#000000` |
| Branco giz (texto, bonecos) | `#FCFCFC` |
| Cinzas de objeto | `#2C2C2C`, `#363636`, `#6A6A6A`, `#9B9B9B` |
| Verde acerto / siga | `#00FB10`, luz `#88FF8C`, halo `#033904` |
| Vermelho erro / pare | `#FD0000` |
| Azul aceso (quem persiste) | `#08A1DF`, luz `#37CAFB`, borda `#77EDFE` |
| Âmbar transição | `#FDF201` |

- **Cor viva é evento, não decoração.** No máximo duas cores vivas ao mesmo tempo.
- **Halo:** tudo que está aceso emite uma névoa redonda da sua cor (raio 240 px no branco, 300 px no verde no aprovado;
  de 25 a 47% da altura no máximo). Quem é "o escolhido" ganha halo branco fraco (13 s).

## 5. O texto na tela

- **Uma fonte, um peso: Didact Gothic 400**, caixa alta, corpo 34 px (maiúscula de cerca de 24 px, 1,25% da altura),
  espaçamento 0,1em, branco `#FCFCFC`, sem contorno, sem sombra, sem caixa.
- **Frase de personagem:** centrada em y 600 (31%), entre aspas tipográficas (“ ”), de 4 a 7 palavras, as palavras como
  foram ditas (“100% EDITADO PELO CLAUDE”, 2 s).
- **Entrada:** digitação com a letra crescendo, da esquerda para a direita. Cada letra nasce em escala 0,3 e chega a 1
  em 0,09 s; a frase inteira leva de 0,35 a 0,6 s. Entra no início de uma palavra (±2 quadros).
- **Saída:** some em 0,1 s, 0,4 s antes da próxima. Uma frase falada por vez.
- **Tempo de leitura:** cada frase fica pelo menos 1 s + 3 palavras por segundo depois de digitada, e pelo menos 1,5 s
  no total.
- **Moral:** 2 linhas centradas em y 883 (46%), entrelinha de 2,4% da altura, digitadas linha a linha no tempo da fala,
  no preto vazio (27 s, 28 s). Segura 3 s ou mais, até o fim.
- **Rótulos fixos** (nomes do duelo, fatias da escada) já na tela no quadro 0, centrados no objeto, até 2% da altura.
- **A narração não vira legenda corrida.** O texto é rótulo, fala de personagem ou moral.
- **Nunca escreva o nome do modelo na tela.** A única exceção são as etiquetas das prévias, que nomeiam os vídeos
  mostrados. Nunca travessão.

## 6. Transições e fecho

- **Não há transição.** A história anda dentro do plano único.
- **Virada:** no aprovado, em "outros", as telas acendem verde ao mesmo tempo com halo, e a música (se ligada) entra na
  parte forte (22 s). Depois, a tela do último acende verde em "usar isso nos seus vídeos" (25 s).
- **Apagão:** cena e frase somem juntas em 0,15 s (26,55 s).
- **Moral:** só o comando fica, com a palavra entre aspas: COMENTA “EDIÇÃO” e, embaixo, AQUI EMBAIXO (27 s a 29 s).

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Efeitos sonoros do modelo (passo, varredura, impacto, baque, digitação) | **ligados** | `scripts/som.py` e `public/efeitos.wav` no `mixar.sh`; para tirar, prop `efeitos: false` e mixar sem ele |
| Trilha sintetizada (pulso a cada 0,73 s, parte forte na virada) | desligada | `scripts/som.py`, prop `musica: true` e `public/trilha.wav` no `mixar.sh` |
| Prévias de dois vídeos (16 s a 19 s) | desligadas | `tools/previa.py`, props `previas: true, nomesPrevias: [...]` |
| O escolhido que acende branco | ligado | `"apenasUm": null` |
| Virada verde | ligada | `"virada": null` (nada fica verde, a trilha fica calma) |
| Apagão antes da moral | ligado | `"apagao": null` |
| Moral | ligada | `"moral": []` |

Prévia só de vídeo seu, nunca de terceiro.

## 8. Zona segura e material

- Todo texto fica em x 60–940 e y 250–1500 (1080x1920). Nada importante abaixo de 80% da altura nem colado na borda
  direita.
- A zona segura é assimétrica de propósito: a coluna de botões do Instagram ocupa os 140 px da direita, por isso nenhum texto passa de x 940.
- **O modelo faz sozinho:** cenário, personagens e objetos em vetor, frases, moral, halo, reflexo, trilha e efeitos.
- **Pede a quem faz o vídeo:** a tese em uma frase (ou a gravação de onde ela sai), a voz (a dele, ou o ok para voz
  gerada). O que faltar vira pedido; nunca um buraco no vídeo.
- Marca d'água: só o @ real de quem publica, e só se ele der. Sem ele, não entra.

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo" (`videos/<AAAA-MM-DD-tema>/`).

1. **A narração vira vídeo** (o `novo-video.py` pede um vídeo): se você tem só o áudio,
   `ffmpeg -f lavfi -i color=c=black:s=1080x1920:r=30 -i narracao.wav -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac narracao.mp4`.
   Se a gravação tem rosto, use-a direto: só a voz entra.
2. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py ilustrations01 <narracao.mp4> <AAAA-MM-DD-tema>`.
   Isso copia o molde, grava `public/voz.wav` e transcreve a fala em `src/palavras.json`.
   Nome que a transcrição errar (ex.: "Cloud" no lugar de "Claude") se corrige já aqui: `--trocar Cloud=Claude` (pode repetir).
3. **Escolha a metáfora:** ache a frase-tese e a frase de virada, escolha a forma (A, B ou C) e escreva o `plano.md`
   na pasta do vídeo, frase a frase. Na forma C, um personagem por ideia da fala.
4. **Monte O PLANO em `src/plano.json`** (na pasta do vídeo). O molde para de propósito enquanto o plano não bater com a
   fala nova e diz a palavra que difere. Um tempo é `segundos`, `[índice, "palavra"]` ou `[índice, "palavra", ±segundos]`.
   - `"fala"`: o texto da fala nova. `"cauda"`: segundos depois da última palavra (0,7 no aprovado). Aumente a cauda
     quando a última frase não fecha o tempo de leitura (1 s + 3 palavras/s).
   - `"apenasUm"`, `"previas"` (`ergue`, `sobe`, `desce`), `"virada"` (60 a 76% da duração) e `"apagao"`. `null` desliga.
   - `"chegadas"`: cada uma com `x0`, `x1`, `t0`, `d` (duração do freio), `edita` (instante da varredura) e,
     se for o caso, `previa` (0 esquerda, 1 direita), `destaque` ou `voce`. `voce`: fica crua até `edita` e acende
     verde nela, sem esperar a virada (é "você" na fala). `destaque`: o personagem que acende branco no `apenasUm`.
   - Sem "só um" ou "um desses" na fala, `"apenasUm": null`.
   - `"frases"`: `txt` (entre aspas tipográficas, caixa alta, até 7 palavras), `de`, `dig` (tempo de digitar) e `ate`.
   - `"moral"`: as 2 linhas, cada uma com `txt`, `de` e `dig`.
   - Forma A ou B, ou objeto diferente da tela segurada: desenhe a cena nova em `src/Reel.tsx` com as mesmas peças
     (palco, reflexo, halo, digitação, freio).
5. **Confira as regras:** `node scripts/checar.mjs` (na pasta do vídeo) até terminar em `sem problemas`. Ele confere o
   plano contra a fala, o tempo de leitura, uma frase por vez com 0,4 s de vão, a entrada na palavra, as aspas, até 7
   palavras numa linha, a zona segura, travessão, nome do modelo, a virada entre 60 e 76% e a moral de 3 s.
6. **Som:** `../../.venv/Scripts/python.exe scripts/som.py` (na pasta do vídeo). Grava `public/trilha.wav` e
   `public/efeitos.wav` a partir do plano (ganhos opcionais: `scripts/som.py -6 -8`, trilha e efeitos em dB).
7. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10 15 22 28` (na pasta do
   vídeo). `--previas` liga as prévias; `PROPS=<arquivo.json>` usa as props do render.
8. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineIlustrations01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2`.
   Com prévias: `--props='{"previas":true,"nomesPrevias":["<modelo1>","<modelo2>"]}'`.
9. **Mixe** (na pasta do vídeo), com os efeitos do padrão:
   `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4 public/efeitos.wav`. Com trilha:
   `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4 public/trilha.wav public/efeitos.wav`. Só a voz: sem os dois
   últimos argumentos. Sai em -14 LUFS e pico -1 dBTP, com a trilha cerca de 16 dB abaixo da voz antes da virada.
10. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 ilustrations01`.
    Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
    em cima e o seu embaixo. Folha de 1 quadro por segundo do seu:
    `../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4` (na pasta do vídeo).

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<v> 1` (e `2`).

## 10. O plano do vídeo aprovado (para comparar)

Forma C, corrente com virada: bonecos idênticos (os modelos) chegam um depois do outro, cada um com a mesma tela crua
acima da cabeça; quando param, uma varredura edita a tela, cada uma de um jeito. Por último chega "você", com a tela
ainda crua. Plano único, sem transição.

| Tempo | Fala | A cena | Texto na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. | o 1º boneco já entra andando e freia até x 810 | “100% EDITADO PELO CLAUDE” (1,2 s a 4,6 s) |
| 2,5 s | Claude | varredura: a tela crua do 1º vira a dele (um palito no preto) | |
| 3 s | Ele foi criado justamente para te mostrar | o 2º entra e freia até x 660 | |
| 5 s | a diferença entre vários modelos que eu criei | varredura no 2º (close e legenda); o 3º entra até x 510 | “A DIFERENÇA ENTRE VÁRIOS MODELOS” (5 s a 8,1 s) |
| 7,6 s | e melhorei | varredura no 3º | |
| 8 s | para editar qualquer tipo de vídeo usando o Claude. | o 4º entra até x 360; varredura nele em "Claude" (9,8 s) | “QUALQUER TIPO DE VÍDEO” (8,5 s a 12,7 s) |
| 11 s | Inclusive, se você estiver no Instagram agora, | fila parada, as telas tocam | |
| 13 s | você está vendo apenas um desses modelos. | o 1º ganha halo branco, as outras telas apagam para cinza | “APENAS UM DESSES MODELOS” (13,1 s a 15,8 s) |
| 15,7 s | Eu posso até colocar duas | o 2º e o 3º erguem mais os braços, todos olham para cima | |
| 16 s | prévias rápidas aqui em cima, aceleradas em três vezes. | as telas do 3º e do 2º sobem e crescem no alto (centros em x 335 e 745), tocando as prévias com as etiquetas | só as etiquetas das prévias |
| 20 s | Mas se você quiser realmente ver | as telas descem para as mãos; chega o último ("você"), tela crua, até x 210 | |
| 22 s | outros modelos de edição como esse | **virada (72%)**: as 4 telas acendem verde com halo | “OUTROS MODELOS DE EDIÇÃO COMO ESSE” (21,9 s a 26,55 s) |
| 25 s | e aprender a como usar isso nos seus vídeos, | varredura verde na tela do último | |
| 26,55 s | (pausa) | apagão de 0,15 s | |
| 27 s | comenta edição | moral, linha 1 | COMENTA “EDIÇÃO” |
| 28 s | aqui embaixo que eu vou te mandar na sua DM agora. | moral, linha 2, até o fim (30,3 s) | AQUI EMBAIXO |
