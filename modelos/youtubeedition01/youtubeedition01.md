# youtubeedition01: vídeo de YouTube com a pessoa falando, onde a tela responde à fala

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (30,2 s, 9:16, com a voz). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo) e o `mapa.json`
(rosto, luz e cortes medidos a cada 0,25 s). Antes de editar, assista ao vídeo inteiro uma vez.

O modelo nasceu para o vídeo longo de YouTube em 16:9. O aprovado é a adaptação vertical, que está validada como está.
As regras valem para os dois formatos; onde muda, está escrito.

---

## 1. A cara do modelo

Não é uma receita de enfeite: é uma **gramática de decisão**. A tela responde à fala no mesmo segundo, e cada tipo de
frase tem o seu tipo de resposta.
- **A câmera vira uma janela:** dá punch-in, abre, encolhe girando até um cartão no canto e volta (0 s, 1 s, 5 s, 10 s).
- **Explicação em tela de gelo** `#F8F8F8` com a coisa real em cima: grades de vídeos de verdade tocando, com o rosto
  no cartão do canto (6 s, 22 s). Sem vídeos do criador, a mesma tela vira a conta no gelo (seção 5).
- **Tipografia grande sobre a pessoa**, em Inter Tight preta: a palavra atrás da cabeça, em tinta, com a pessoa
  recortada passando na frente ("100%", 1 s a 3 s), e a frase na frente, sobre a camiseta (2 s a 3 s).
- **Um acento só, amarelo** `#FCDC00` ("CLAUDE", 3 s; "EDIÇÃO", 27 s).
- **Sem legenda corrida.** Só palavra-chave, título e frase de efeito.
- **O rosto quase nunca some:** quando a tela entra, ele vai para o cartão no canto (com rosto 97% do tempo).

## 2. Os números do modelo (o `parece.py` confere)

O vídeo inteiro mede como está na coluna "inteiro" (`assinatura.json`). Vídeo com menos de 70% do aprovado (menos de
21 s) é comparado com os trechos do mesmo tamanho do aprovado: passa se cabe entre o menor e o maior valor que algum
trecho mostra, mais a tolerância. As faixas abaixo são as que o `parece.py` usa para 10 e 15 s.

| Item | Inteiro | Trechos de 10 s | Trechos de 15 s | Tolerância | O que é |
|---|---|---|---|---|---|
| Brilho (0 a 255) | 91 | 87 a 138 | 91 a 132 | 14 | Claro: gravação de dia e telas de gelo |
| Contraste | 220 | 168 a 237 | 169 a 237 | 18% | Branco aceso e tinta preta |
| Saturação | 65 | 54 a 71 | 56 a 67 | 30% (só avisa) | Cor natural, sem filtro: saturação alta que vem da roupa ou do cenário se aceita, não se corrige |
| Temperatura | +3,2 (o `referencia.mp4` mede +2,5) | +1,9 a +2,9 | +2,1 a +2,5 | 3,5 | Levemente quente, da luz da gravação |
| Rosto no plano aberto | 26% da altura | 15% a 27% | 20% a 27% | 18% | (1 s) |
| Rosto no plano fechado | 31% da altura | 29% a 35% | 30% a 34% | 18% | (0 s, 10 s) |
| Altura do rosto | centro a 36% do topo | 36% a 68% | 36% a 66% | 5 pontos | Cabeça no terço de cima; o fim da faixa é o cartão do canto |
| Lado do rosto | centro a 50% da largura | 50% a 52% | 50% a 51% | não confere | Centrado |
| Cabeça cortada pelo topo | 5% do tempo | 0% a 13% | 0% a 8% | 12 pontos a mais | Quase nunca: o plano tem folga |
| Tempo com rosto | 97% | 93% a 100% | 95% a 100% | não confere | Cheio ou no cartão |
| Cortes por minuto | 22 | 18 a 36 | 16 a 36 | 50% (só avisa) | Contando giros e trocas de janela |

Os trechos vêm do `referencia.mp4`. Onde o vídeo aprovado completo (`exemplos/`) existe, o `parece.py` mede nele, e as
faixas mudam pouco (temperatura de +2,7 a +3,6 em 10 s).

## 3. Câmera e ritmo

**As poses da janela** (1080x1920):

| Pose | Como é | Uso |
|---|---|---|
| Cheio | a gravação inteira, rosto em y 35% | O plano aberto; recebe a palavra atrás da cabeça (1 s) |
| Punch-in | zoom 1,12 a 1,2, rosto em y 30% a 36% | A frase-chave, a troca de ideia, esconder um corte (0 s, 3,5 s, 10,7 s, 20 s) |
| Cartão | 370 x 500 px no canto de baixo à direita (x 652, y 1300), canto 34 px, sombra suave, zoom 1,5 | Rosto no canto sobre a tela de gelo (5 s a 8 s, 22 s a 24 s) |
| Reels | 730 x 1298 px em x 175, y 200, canto 44 px, sombra | O próprio plano dentro de uma tela de reels genérica (12 s) |
| Baixo | metade de baixo, a partir de y 880 | Com as prévias em cima (15 s a 19 s) |

- **Transições da janela:** corte seco (0) ou mistura suave de 0,32 a 0,4 s. A entrada do cartão gira até -14 graus e
  borra até 9 px no meio do caminho, e volta reto (5,2 s, 21,9 s).
- A câmera segue o rosto suavizado (`src/tempos.ts`), sem mostrar borda.
- **Ritmo:** no primeiro minuto, um visual novo a cada 3 a 5 s, de 8 a 9 recursos diferentes. No corpo, 7 a 16 trocas
  por minuto, contando zoom interno. Tela longa nunca parada mais de 6 s. Rosto puro pode durar 14 a 36 s quando a fala
  é opinião. O fim desacelera.
- **Vídeo curto (10 a 15 s):** o ritmo é o de um trecho do aprovado, de 16 a 36 cortes por minuto, o que dá de 4 a 6
  trocas de janela em 10 s (o aprovado faz 5 em 0 a 10 s: punch-in, cheio, punch-in, giro até o cartão, montagem). Não
  precisa de título de capítulo nem de chamada: a espinha só existe com capítulo, e a chamada só entra se a fala pede
  ("comenta", "link"). Sem elas, a estrutura é gancho com a palavra atrás e a frase na frente, uma tela de gelo (grade,
  montagem ou conta) no meio e um punch-in na conclusão. O fim segura 0,7 s depois da última palavra, no rosto.
- **Grave com folga:** plano médio com espaço acima da cabeça (o punch-in vai até 1,4x e a palavra atrás precisa de
  parede livre). Microfone na frente do queixo estraga o recorte da palavra atrás.

## 4. O que a tela faz em cada frase (a gramática)

Cada frase do plano recebe uma função, e a função escolhe a resposta.

**Mostrar o que é dito**
| Frase | A tela |
|---|---|
| Dêitico ("olha isso", "aqui", "isso aqui") | A coisa real, no mesmo segundo |
| Passo de tutorial (clique, cole, abra) | A gravação daquele passo, ampliada no campo em uso, cursor visível, rosto no canto livre |
| Ferramenta citada pela 1ª vez | A interface dela antes do primeiro clique |
| Leitura em voz alta | Grifo acompanhando a linha lida |
| Prompt citado | Legível: caixa com moldura amarela e o resto escurecido, ou digitado num fundo de gelo |

**Provar o que é afirmado**
| Frase | A tela |
|---|---|
| Número de resultado com prova | Zoom até o número no painel onde ele mora |
| Afirmação de mercado | Página com grifo na frase exata |
| Algo do próprio criador (produto, canal, trabalho) | A coisa real dele. No aprovado, os próprios vídeos dele tocando na grade (6 s, 22 s) |
| Nome de pessoa ou conta | Print do perfil, rosto no canto, círculo no nome |

**Explicar o que é abstrato**
| Frase | A tela |
|---|---|
| Conceito novo | Uma palavra e um ícone no gelo; se volta, volta a mesma animação |
| Metáfora | A metáfora desenhada literal, em tela cheia |
| Processo | Fluxo da esquerda para a direita, linha tracejada |
| Comparação | Dois lados ou duas linhas |
| Conta | Itens entrando um a um quando ditos (`LISTA`, a conta no gelo da seção 5) |
| Negação ("não consegue") | O ícone riscado em vermelho `#FC0000` |

**Listar e organizar**
| Frase | A tela |
|---|---|
| Lista de exemplos curtos | Montagem de cortes secos de 0,3 s (vertical) a 1 s (16:9), um por palavra ("editar qualquer tipo de vídeo", 8,3 s a 9,5 s). Sem os vídeos do criador, a conta no gelo |
| Lista de nomes de ferramentas | Um logo por nome, na ordem falada |
| Anúncio de capítulo ou fase | A espinha (abaixo) |
| Callback ("lembra do...") | O mesmo material de antes, igual (a grade volta em 22 s) |

**Dar peso e respiro**
| Frase | A tela |
|---|---|
| Opinião, conselho, emoção | Rosto puro, nada por cima |
| Frase-chave, conclusão | Punch-in (10,7 s, 20 s) |
| Frase de efeito | Frase grande junto com o punch-in, só nesses momentos |
| Página ou rede citada | O plano encolhe para dentro de uma tela de reels genérica, sem logo, com coração, balão e avião à direita e o @ embaixo (12 s) |

**Chamar para a ação**
| Frase | A tela |
|---|---|
| Comentário | Degradê escuro na base, o comando em branco e a palavra entre aspas gigante em amarelo (27 s) |
| Link na descrição | Frase sobre o rosto, embaixo, com degradê, ou faixa com seta para baixo |
| Produto ou curso | Um card por item; preço antigo vazado, preço novo em amarelo |

**Quando não pôr nada:** número de passagem fica na boca (só ganha tela com prova, quando é o ponto da frase ou na
1ª vez). Marca citada como analogia não ganha logo. Opinião não ganha gráfico. Na dúvida: *esta frase é crucial para
entender?* Se não, rosto.

**A espinha (um mapa de onde estamos):** todo vídeo longo tem uma, escolhida no plano, que volta igual a cada
capítulo: degraus de fase (processo em etapas), placar com quadro que acumula (lista de N itens), lista com relógio
(desafio com prazo), título de capítulo grande no A-roll (método, vídeo curto), hub de passos no fecho. Uma por vídeo.
No aprovado, a espinha é o título de capítulo.

**Estrutura do vídeo longo:** gancho com prova na tela antes dos 25 s, um laço aberto pago no fim, conteúdo começando
entre 24 s e 1 min, chamada do meio só depois de entregar valor, fecho com recapitulação e a chamada final.

## 5. Texto na tela

**Fonte: Inter Tight**, uma família só. 900 nas palavras-título e na palavra-chave, 800 no complemento e nos rótulos,
700 na frase de ação. Caixa alta com entreletra apertada (-0,03 a -0,045 em); caixa baixa só na chamada.

| Peça | Medidas (1080x1920) | Cor | No aprovado |
|---|---|---|---|
| **Atrás da pessoa** | 900, 250 px, entrelinha 0,86, topo y 118, centrada | tinta `#0A0A0A` a 93%, a pessoa recortada passa na frente | "100%" (1,2 s a 3,5 s) |
| **Na frente, sobre a camiseta** | topo y 1215, centrada: linha 1 em 800, 88 px, branca; linha 2 em 900, 196 px, amarela | branco `#FCFCFC` e amarelo `#FCDC00`, sombra suave | "EDITADO PELO / CLAUDE" (1,7 s a 3,5 s) |
| **Conta no gelo** | um cartão branco `#FFFFFF` por item, empilhados de x 55 a 1025 e de y 90 a 1248 (a área da grade), 20 px entre eles, canto 30 px, sombra suave; altura = (1158 - 20 x (itens - 1)) / itens (372 px com 3 itens); dentro, a 56 px da borda: ponto amarelo de 40 px, a palavra em 900, caixa alta, entreletra -0,045 em, e o número do item (01, 02...) em 800, 44 px, cinza, à direita; a fonte é a menor entre 172 px, metade da altura do cartão e o que faz a palavra mais longa caber (150 px para "LEGENDA") | fundo gelo, vagas `#EDEDED` antes de cada item entrar, palavra em tinta | não usada no aprovado |
| **Título de capítulo** | 900, 176 px, entrelinha 0,88, caixa alta, topo y 1150, centrado; fio amarelo de 640 x 6 px embaixo, que se desenha em 0,35 s | branco com sombra | 13,2 s a 14,8 s |
| **Rótulo de miniatura** | 800, 23 px, caixa alta, centrado embaixo de cada vídeo | tinta | os nomes na grade (6 s) |
| **Chamada** | topo y 1268, centrada: o comando em 700, 70 px, branco; a palavra entre aspas em 900, 248 px, amarela; o resto em 700, 70 px; seta branca de 70 px balançando | degradê preto de 900 px na base (0 a 78%) | "comenta / EDIÇÃO / aqui embaixo" (26,8 s até o fim) |

- **Sem parede livre** (rosto acima de 27% da altura no plano cheio): a palavra atrás desce para 200 px ou vira só a
  frase na frente.
- **Tempo de leitura x ritmo:** se o tempo de leitura de uma frase empurra a próxima troca, a troca pode cair no meio
  da frase seguinte, numa palavra de apoio.
- **Entrada:** cada palavra nasce na hora em que é dita, do borrão (14 px) para nítida em 0,2 s, subindo um pouco e
  crescendo de 94% a 100%. Linhas de título entram 0,08 s uma depois da outra. Cartões entram com borrão de movimento.
- **Frase na frente quando a fala inverte a ordem:** a frase segue a fala, nunca a ordem do aprovado. Se a palavra que vai
  atrás é dita depois do começo da frase da frente ("editado 100% pelo Claude", com "100%" atrás), a linha 1 começa na
  palavra seguinte à de trás ("PELO") e a linha de trás entra na hora dela; palavra dita antes da de trás ("editado") fica
  na boca. Cada palavra entra quando é dita, então a linha 1 nunca mostra palavra que ainda não foi falada. A linha 2
  tem 196 px: um nome que não cabe em uma linha (mais de uns 8 caracteres largos, como "CLAUDE CODE") fica só com a
  parte principal ("CLAUDE"), e o resto fica na boca.
- **A conta no gelo:** a resposta para a frase de conta ("cada corte, cada legenda, cada tela") e o plano B da montagem
  e da grade quando o criador não tem vídeos prontos. De 1 a 5 itens, uma palavra curta por item, exatamente como dita.
  Liga com `LISTA = {de, ate, itens: [['palavra', T.x], ...]}` e a chave `[de, POSE.cartao, 0.38, true]`; o rosto fica no
  cartão até `ate`. As vagas aparecem no giro e cada cartão entra na hora da palavra, com o borrão de movimento das
  miniaturas; a tela aproxima até 104% até sair.
- **Só a palavra mais forte do trecho vai atrás da pessoa**, e no vertical só uma palavra curta, no plano aberto (a
  parede acima da cabeça tem uns 180 px). Nome comprido vai na frente.
- **O texto confere com a fala:** número, nome e grafia exatamente como foram ditos.
- **Tempo de leitura:** texto falado pelo menos 1,5 s e 1 s + 3 palavras/s, cada palavra pelo menos 0,4 s, títulos e
  rótulos pelo menos 1,33 s, no máximo 4 linhas. Na conta, cada item fica pelo menos 1 s + 3 palavras/s depois de
  entrar, e a conta inteira 1 s + 3 palavras/s do total. Se um corte encurta o texto, tira-se o corte, não se acelera o texto.
- **Nada atravessa um corte seco** e nada aparece antes da sua entrada.
- **Nunca escreva o nome do modelo na tela.** Quando a fala diz "um desses modelos", o título de capítulo é uma palavra
  dita, nunca o nome do modelo. O rótulo embaixo de cada vídeo da grade e das prévias pode dizer o que cada vídeo é.
- **Legenda corrida:** o 16:9 de YouTube não tem. No 9:16 dinâmico, a legenda corrida é opcional e o padrão é oferecer
  ao usuário: se ele quiser, entra discreta na altura do peito, dentro da zona segura, sem disputar com o texto grande.
  O molde ainda não desenha essa legenda; ela precisa ser montada no mesmo estilo (Inter Tight 700, branca, sombra).

## 6. Identidade "Gelo, tinta e amarelo"

É a identidade própria do modelo e vale sempre que o criador não tiver um perfil com marca própria. Nunca as cores de
quem edita.

| Papel | Cor |
|---|---|
| Fundo das explicações | gelo `#F8F8F8` |
| Texto sobre o gelo e atrás da pessoa | tinta `#0A0A0A` |
| Texto na frente da pessoa | branco `#FCFCFC`, sombra `0 4px 18px` preta a 55% |
| O único acento (palavra-chave, fio, contorno, seta) | amarelo `#FCDC00` |
| Ruim | vermelho `#FC0000` |
| Rótulo secundário | cinza `#7A7A7A` |

- **Cartões:** canto 22 a 34 px, sombra suave, sem borda.
- **Grade de vídeos:** miniaturas 9:16 de 310 x 551 px, 3 por linha a partir de x 55, 20 px entre elas, primeira linha
  em y 90, segunda em y 697. Começa com dois lado a lado (5,2 s), vira a grade de 6 na palavra "vários" (5,8 s) e
  aproxima (6,3 s).
- **"Este aqui":** contorno amarelo no cartão do rosto, com o rótulo do vídeo embaixo (23,4 s).
- **O elemento que costura:** o fio amarelo (debaixo do título, contorno do cartão, seta da chamada).

## 7. Som

- Voz sempre na frente. -14 LUFS, pico -1 dBTP.
- **Música é opcional, desligada por padrão.** Quando ligada: piano elétrico macio em Fá maior a 96 bpm, baixo redondo,
  bumbo leve, cerca de 16 dB abaixo da voz com ducking; um sopro em cada giro do cartão e na tela de reels, um toque curto
  em cada título e na palavra da chamada.

## 8. Materiais: o que o modelo faz e o que ele pede

- **O sistema faz:** câmera, punch-in, textos, telas de gelo, diagramas, ícones, montagem, grifo e zoom sobre gravações.
- **O sistema busca:** logo oficial, página pública que prova uma afirmação geral (fonte no `ORIGEM.md`).
- **O criador fornece:** gravação de tela dele, painel e número dele, print do que ele citou, link do vídeo comentado,
  os vídeos prontos dele (para grade e montagem), a foto de perfil (opcional, ao lado do @). O que faltar vira o
  `PEDIDO.md` na pasta do vídeo, com a hora, a frase, o que é preciso e um plano B honesto. O vídeo não espera.
- **Sem vídeos do criador:** grade, montagem, prévias e o contorno com rótulo ficam desligados, e a frase que pedia a
  grade ou a montagem vira a conta no gelo (seção 5), com o pedido no `PEDIDO.md`.
- **Nunca fabricar prova.** Sem o print real, o número fica na boca ou como afirmação do criador. Interface recriada é
  sempre ilustração assumida, com marca genérica.
- Dado pessoal desfocado antes de montar. Vídeo de terceiro só com o link e o "pode usar" do criador, curto, com fonte.
  Pessoa real nunca gerada por IA.
- **O modelo aprende o criador com o uso** (`perfis/<criador>/PERFIL.md`): o perfil ajusta pesos, marca e peças fixas,
  mas nunca desliga tempo de leitura, prova verdadeira e conferência. Pedido em 1 vídeo vale só nele; repetido em 2, ou
  dito como "sempre/nunca", vai para o perfil.

## 9. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão no código | Como mudar |
|---|---|---|
| Música | desligada | `scripts/trilha.py` com os sopros e toques e o 3º argumento `public/trilha.wav` no `mixar.sh` |
| Prévias | desligadas (`previas: false`), sem nomes (`nomesPrevias: ["", ""]`) | `--props='{"previas":true,"nomesPrevias":["<nome real 1>","<nome real 2>"]}'` e a mídia das prévias |
| @ na tela de reels | vazio (sem @ e sem foto) | `--props='{"arroba":"<arroba real de quem fala>"}'`; foto em `public/avatar.jpg` |
| Palavra atrás, frase, título, grade, montagem, reels, contorno, prévias, chamada | ligados no plano do aprovado | Cada lista em `src/plano.ts` desliga com `[]` ou `null` |
| Conta no gelo (`LISTA`) | desligada (`null`) no aprovado | `LISTA = {de, ate, itens}` (seção 5) |
| Legenda corrida (9:16) | não existe no molde | Montar à parte, se o usuário quiser (seção 5) |

O aprovado saiu com prévias, os nomes delas e o @ real de quem fala (`props-vitrine.json`, que ele precisa para sair
igual). O `referencia.mp4` guarda só a voz.

## 10. Zona segura e rosto

- Todo texto de leitura fica em x 60–940 e y 250–1500 (1080x1920). A exceção do modelo é a palavra atrás da cabeça,
  que mora na parede acima dela (topo y 118). Grades, prévias e telas podem passar disso.
- A zona segura é assimétrica de propósito: a coluna de botões do Instagram ocupa os 140 px da direita, por isso nenhum texto passa de x 940.
- O cartão do rosto nunca cobre o que está sendo mostrado.
- Nome e @ na tela, só os reais de quem fala, ou nenhum.

---

## 11. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo" (`videos/<v>/`).

1. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py youtubeedition01 <gravacao.mp4> <AAAA-MM-DD-tema>`.
   Isso cria `videos/<AAAA-MM-DD-tema>/`, transcreve a fala (`src/palavras.json`), mede o rosto (`src/rosto.json`) e
   adapta a gravação ao modelo. Confira de ouvido o trecho rápido (o reconhecimento inventa palavra em fala rápida).
   Nome que a transcrição errar (ex.: "Cloud" no lugar de "Claude") se corrige já aqui: `--trocar Cloud=Claude` (pode repetir).
2. **Escreva o `plano.md`** na pasta do vídeo, uma linha por frase sobre a fala real: hora, função (seção 4), resposta
   da tela, quem fornece e o texto. Escolha a espinha. Liste o que pedir ao criador no `PEDIDO.md`.
3. **Monte O PLANO** em `src/plano.ts` (na pasta do vídeo). Ele chega com o plano do aprovado. Enquanto for o plano
   antigo, o vídeo para ao carregar e diz qual palavra não bate. Depois de refazer os tempos, ele também para se ainda
   sobrar parte do aprovado com outra fala (o nome do modelo ou os nomes dos vídeos do criador do aprovado) e diz o que
   mudar. Sem vídeos prontos do criador, desligue exatamente: `TITULOS = []` (ou um título com palavra dita),
   `GRADE = []`, `GRADES = []`, `MONTAGEM = null`, `ESTE = null`, `PREVIAS = null`, e `REEL = null` e `CTA = null`
   quando a fala não cita rede nem pede comentário. O que fica é `ATRAS`, `FRASES`, `LISTA` e as `chaves`.
   - `T`: cada tempo é `w(índice, 'palavra')` (o início da palavra) ou `em(segundos, índice, 'palavra')`.
   - `chaves`: a câmera, `[t, pose, transição, gira?]`, com `POSE.cheio`, `POSE.punch(zoom, fy)`, `POSE.cartao`,
     `POSE.reel`, `POSE.baixo()`; transição 0 é corte seco.
   - As partes: `ATRAS`, `FRASES`, `TITULOS`, `GRADE` e `GRADES`, `MONTAGEM`, `REEL`, `ESTE`, `PREVIAS`, `LISTA`, `CTA`.
     Cada uma desliga com `[]` ou `null`. `TITULOS` nunca leva o nome do modelo.
4. **Confira as regras:** `node scripts/checar.mjs` (na pasta do vídeo) até terminar em `sem problemas`. Ele confere
   que o plano é desta fala, tempo de leitura com e sem prévias (a conta também), linhas, nada atravessando corte, o
   rosto no cartão durante a conta e a duração.
5. **Mídia que o plano pedir** (na pasta do vídeo):
   - pessoa recortada, para `ATRAS`: `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recorte.py`
     (grava `public/pessoa.webm`; uns 4,5 min para 30 s na CPU);
   - grade e montagem, de vídeos seus prontos: `ffmpeg -i <video>.mp4 -an -vf scale=540:960 public/ex/<nome>.mp4` e
     `ffmpeg -ss <recorte> -t 2.0 -i <video>.mp4 -an public/ex/cheio_<nome>.mp4`.
6. **Som (só se for usar música):** o `checar.mjs` imprime o comando com os sopros e toques deste plano, no formato
   `../../.venv/Scripts/python.exe scripts/trilha.py --sopros <s> --toques <s>` (na pasta do vídeo).
7. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 14 27.6` (na pasta do vídeo;
   `--previas` liga as prévias, com os rótulos vindos de `nomesPrevias` nas props, `PROPS=<arquivo.json>` usa as props do render). Folha:
   `../../.venv/Scripts/python.exe scripts/montar.py conferencia/folha.png conferencia/q_*.png --cols 6`.
8. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineYoutubeEdition01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2`
   Com @ e prévias: `--props='{"arroba":"<arroba real>","previas":true,"nomesPrevias":["modeloA","modeloB"]}'`.
9. **Mixe** (na pasta do vídeo): `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (só a voz). Com música:
   `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4 public/trilha.wav`.
10. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 youtubeedition01`.
    Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
    em cima e o seu embaixo. Se a diferença salta aos olhos, ainda não está pronto.

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<v> 1` (e o mesmo com `2`).

## 12. O plano do vídeo aprovado (para comparar)

| Tempo | Fala | Câmera / transição | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo | punch-in 1,15 | rosto puro |
| 1,2 s | 100% editado pelo Claude. | corte seco, cheio | "100%" atrás da cabeça em tinta; "EDITADO PELO" branco e "CLAUDE" amarelo na camiseta |
| 3,5 s | Ele foi criado justamente para te mostrar | corte seco, punch-in 1,12 | rosto puro |
| 5,2 s | a diferença entre vários modelos que eu criei e melhorei | o plano gira até o cartão (0,38 s), gelo | dois vídeos lado a lado; em "vários" a grade de 6 com rótulos; aproxima em 6,3 s |
| 8,3 s | para editar qualquer tipo de vídeo | corte seco, montagem | 4 vídeos cheios por corte seco, 0,3 s cada |
| 9,5 s | usando o Claude. | corte seco, cheio | rosto puro |
| 10,7 s | Inclusive, se você estiver | punch-in 1,2 | rosto puro |
| 11,75 s | no Instagram agora, você está vendo apenas | o plano encolhe para a tela de reels (0,4 s) | tela de reels no gelo, com o @ real embaixo |
| 13,2 s | um desses modelos. | corte seco, punch-in 1,12 | título de capítulo com o fio amarelo (num vídeo novo, nunca o nome do modelo) |
| 14,8 s | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | a câmera desce para a metade de baixo (0,32 s) | duas prévias de 400 x 711 px em y 66 (x 100 e 580), com rótulo |
| 20 s | Mas se você quiser realmente ver | punch-in 1,2 | rosto puro |
| 21,9 s | outros modelos de edição como esse | gira até o cartão, gelo | a grade volta igual (callback); em 23,4 s contorno amarelo no cartão do rosto |
| 24,8 s | a como usar isso nos seus vídeos, | cheio | rosto puro |
| 26,8 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | punch-in 1,15 | degradê na base; "comenta" / "EDIÇÃO" amarelo / "aqui embaixo" e a seta, até o fim (0,7 s depois da última palavra) |
