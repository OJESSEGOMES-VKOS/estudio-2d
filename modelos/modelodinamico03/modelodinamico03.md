# modelodinamico03: corte de podcast cinematográfico

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (30 s, com a voz). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo) e o `mapa.json`
(rosto, luz e cortes medidos a cada 0,25 s). Antes de editar, assista ao vídeo inteiro uma vez.

Quando o `CLAUDE.md`, o `novo-video.py` ou uma mensagem do código citarem `MODELO.md`, `LEIA.md`, `REGRAS.md` ou
`CORRECOES.md`, a resposta está neste arquivo.

---

## 1. A cara do modelo

Uma pessoa falando para a câmera, editada como trailer de filme.
- **Cor quente e escura:** âmbar e marrom, pretos fundos, vinheta e grão fino (0 s a 29 s).
- **Destaques tipográficos por cima da pessoa**, só nas palavras fortes, misturando 3 tipos de letra (6 s, 9 s).
- **Legenda serifada calma no peito**, contando a fala inteira (4 s, 11 s, 20 s).
- **Transições de textura:** desfoque, flash branco e chicote. Nunca deslize (8 s, 15 s, 24 s).
- **Fecho com o comando:** Comenta “PALAVRA” (27 s a 29 s).

## 2. Os números do modelo (o `parece.py` confere)

| Item | Valor | O que é |
|---|---|---|
| Brilho | 51 (de 0 a 255) | Vídeo escuro |
| Temperatura | +10 | Quente, puxado para o âmbar |
| Rosto no plano aberto | 30% da altura do quadro | (0 s) |
| Rosto no plano fechado | 36% da altura do quadro | (4 s) |
| Altura do rosto | centro a 33% do topo | Cabeça no terço de cima |
| Cabeça cortada pelo topo | no máximo 22% do tempo | Só nos planos fechados |
| Cortes | cerca de 4 por minuto | O plano é longo; quem dá o ritmo é o texto |

## 3. Câmera e ritmo

- **Uma câmera, dois planos:** aberto (zoom 1,0) e fechado (zoom 1,3), alternando num corte seco ou numa transição
  (aberto em 0 s, fechado em 4 s, aberto em 8 s).
- Dentro do plano, o zoom anda devagar e sem parar.
- Cada plano dura de 3 a 6 s, contando a abertura e o último plano. Num vídeo de até 15 s isso dá 2 ou 3 planos: a
  abertura (aberto), um fechado e um aberto.
- A cabeça fica no terço de cima. Uma gravação com o rosto mais baixo é corrigida pelo `adaptar.py` (passo 1 da seção
  9), não pela câmera do plano.

## 4. Os destaques (a assinatura)

- **Bloco de 2 a 3 linhas com 3 tipos de letra, bem colados:**
  - Inter Tight 800, apertada, nas palavras comuns ("a diferença entre", 6 s);
  - Playfair itálica fina na palavra de emoção ("*vários*", "*qualquer*", 6 s e 9 s);
  - Anton em caixa alta, enorme e vermelha `#E01E1E`, na palavra-chave ("MODELOS", "VÍDEO", "EDIÇÃO", 6 s, 9 s, 23 s).
- **Só o assunto vira destaque.** O destaque é sempre um substantivo ou tema ("MODELOS", "EDIÇÃO"). Advérbio, verbo solto
  ou palavra de ligação nunca vira destaque. Sem assunto no trecho, fica só a legenda.
- **Entrada:** cada palavra nasce de um desfoque forte e sobe para o lugar em 4 a 6 quadros, junto com a voz.
- **Tamanhos:** a palavra Anton de uma linha usa 250 a 260 ("VÍDEO", "EDIÇÃO"); a palavra-carimbo atrás do bloco usa 300
  ("MODELOS", 6 s); a Playfair do bloco usa 118 a 132; a Inter Tight usa 80 a 86. O molde aplica sozinho a escala 0,9.
- **Todos os destaques parecem do mesmo tamanho**, o de "MODELOS" (6 s). Para caber na largura, o destaque pode encolher
  até 85% desse tamanho, nunca menos. Se faltar espaço entre o queixo e a legenda, quem cede é o plano: a câmera sobe ou a
  legenda vai para a 2ª posição.
- **Número é contador** na Anton vermelha, do mesmo tamanho dos destaques, sem círculo (0 a 100%, 1 s). Se a fala da
  abertura diz um número, ele é sempre o contador: `contador: [índice, '100%']`, e a linha de cima termina antes dele.
  Não troque o contador por texto para o bloco caber; a câmera da abertura cuida disso.
- **Tempo do destaque:** cada bloco fica pelo menos 1,5 s na tela, e a última palavra dele nasce pelo menos 0,4 s antes
  de ele sair (o mesmo tempo de leitura da legenda). O checador reprova o que ficar mais curto.
- **Negação (opcional):** a linha negada é riscada por um traço vermelho de caneta em diagonal (`risca` no bloco).
- **Nunca escreva o nome do modelo na tela.** A fala pode dizer "um desses modelos" (13 s); o nome escrito não entra.

## 5. A legenda (conta a história)

- **Toda palavra dita aparece na tela, uma vez só.** Quando um destaque ocupa a tela, a fala seguinte entra na legenda
  logo abaixo dele.
- **Playfair fina branca**, em páginas de até 2 linhas, com as palavras nascendo junto da voz (4 s).
- **Tempo de leitura:** cada página fica pelo menos 1,5 s, e cada palavra pelo menos 0,4 s depois de nascer. Nunca uma
  palavra solta piscando.
- **A página fica até a próxima começar**, mesmo passando por um corte ou por baixo de um destaque que nasce depois
  dela. O vídeo aprovado faz assim ("Ele foi criado justamente para te mostrar" segue embaixo de "a diferença entre",
  5 s).
- **Posição:** no peito, com o topo em y 1220. Quando um destaque está na tela, ou durante as prévias, ela desliza para
  a 2ª posição, com o topo em y 1363, e volta depois. No vídeo inteiro são só essas 2 posições.

## 6. Transições, respiro e fecho

- **Desfoque:** a imagem borra inteira em 3 a 4 quadros e a próxima nasce do borrão (8 s, 20 s).
- **Flash branco** que se dissolve em 0,5 s sobre o plano novo (15 s).
- **Chicote:** borrão de movimento que vira a cena seguinte (24 s).
- **Tela de respiro:** a pessoa borrada ao fundo e só um destaque por cima ("outros modelos / de EDIÇÃO / como esse",
  22 s a 23 s). Ela nunca carrega legenda comum.
- **Fecho só existe se a fala tem um comando** ("comenta...", "segue..."). Sem comando, `FECHO_DEF = opcional(null)` e o
  último plano termina na legenda.
- **Fecho:** "Comenta" e a palavra entre aspas, “EDIÇÃO”, ficam fixos no estilo de destaque. O resto da fala vai na
  legenda abaixo (27 s a 29 s).
- **Prévias (opcional):** dois clipes de vídeos seus, acelerados 3 vezes, em cima da tela, com o nome do modelo de cada
  um (15 s a 19 s). Nunca use vídeo de terceiro.

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Tratamento quente (cor, vinheta e grão) | **ligado** | Prop `tratamento: false` |
| Efeitos sonoros do modelo (whoosh, sopro, impacto) | **ligados** | 3º argumento `-` no `mixar.sh` |
| VHS e glitch | desligados | Prop `efeitos: true` e `som.py --efeitos` |
| Música de trailer | desligada | `som.py --cama` |
| Prévias | desligadas | Prop `previas: true` |

## 8. Zona segura e rosto

- Todo texto fica em x 60–940 e y 250–1500 (1080x1920). As prévias e o vídeo podem passar disso.
- A zona segura é assimétrica de propósito: a coluna de botões do Instagram ocupa os 140 px da direita, por isso nenhum texto passa de x 940.
- Nenhum texto cobre o rosto. O texto mora abaixo do queixo medido (`src/rosto.json`).
- Nome e @ na tela, só os reais de quem fala, ou nenhum.

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo".

1. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py modelodinamico03 <gravacao.mp4> <AAAA-MM-DD-tema>`.
   Isso cria `videos/<AAAA-MM-DD-tema>/`, transcreve a fala (`src/palavras.json`), mede o rosto (`src/rosto.json`) e adapta
   a gravação ao modelo (rosto no tamanho e na altura do aprovado, mesma luz de partida). Depois confira o
   `src/palavras.json`: nome próprio que a transcrição errou (ex.: "Cloud" no lugar de "Claude") se corrige no campo
   `text`, sem mexer nos tempos, antes de montar o plano. Na dúvida sobre o que a pessoa disse, pergunte a ela.
   Nome que a transcrição errar (ex.: "Cloud" no lugar de "Claude") se corrige já aqui: `--trocar Cloud=Claude` (pode repetir).
2. **Escreva o `plano.md`** na pasta do vídeo, frase a frase sobre `src/palavras.json`: onde cortar, onde abrir e fechar,
   quais palavras viram destaque e o que vai na legenda. Siga a mesma gramática do `referencia.mp4`.
3. **Monte O PLANO** no topo de `src/Reel.tsx` (na pasta do vídeo). O molde para de propósito até o plano bater com a
   fala nova e diz qual entrada não bate.
   - `T`: os cortes, `c(índice, 'palavra')`, 2 quadros antes da palavra.
   - `CAM`: aberto 1,0 e fechado 1,3 alternando nos cortes; a última chave é `[DURACAO, ...]`.
   - `DESFOQUES`, `FLASHES`, `CHICOTES`, `RESPIROS`, `VHS`: os tempos das transições. Lista vazia desliga.
   - `ABERTURA` (bloco até o 1º corte; `contador: null` se não há número dito) e `FECHO_DEF` (comando e palavra).
     `opcional(null)` desliga.
   - `PREVIAS`: a janela das prévias, ou `opcional(null)`.
   - `BLOCOS`: os destaques (`primeira` = índice da 1ª palavra, as linhas na ordem da fala, `camera` = o plano que se
     ajusta para ele caber; o bloco que começa num corte nasce no corte: `de: T.x`).
   - `PEDACOS`: a legenda, `[índice da 1ª palavra, 'texto / 2ª linha']`, cobrindo toda palavra fora dos destaques.
4. **Confira as regras:** `node scripts/cobertura.mjs` (na pasta do vídeo) até sair `APROVADO`. Ele confere as regras
   das seções 4, 5 e 8 e diz o arquivo, a linha e o que mexer.
5. **Som:** refaça as 4 listas do PLANO DO SOM no topo de `scripts/som.py`: `DESFOQUES` (desfoques e chicotes),
   `FLASHES`, `VHS` e `IMPACTOS` (cada palavra vermelha, contador incluído). Lista vazia desliga. Depois rode
   `../../.venv/Scripts/python.exe scripts/som.py` (na pasta do vídeo).
6. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10` (na pasta do vídeo).
7. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineDinamico03 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2`
8. **Mixe:** `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (na pasta do vídeo). Sai em -14 LUFS.
9. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 modelodinamico03`.
   Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
   em cima e o seu embaixo. Se a diferença salta aos olhos, ainda não está pronto. O vídeo aprovado que ele cita pelo
   nome é o `referencia.mp4`. Em vídeo de menos de 20 s, o aviso de `cortes_min` pode ser ignorado se o plano tem 2 ou
   mais cortes: o medidor precisa de mais tempo para contar.

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<v> 1` (e `2`), a janela em
`PREVIAS` e o render com `--props='{"previas":true,"nomesPrevias":["modeloA","modeloB"]}'`.

## 10. O plano do vídeo aprovado (para comparar)

| Tempo | Fala | Câmera / transição | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. | aberto | bloco com contador 0 a 100% |
| 4 s | Ele foi criado justamente para te mostrar | corte seco, fechado | legenda |
| 5 s | a diferença entre vários modelos que eu criei e melhorei | fechado | "a diferença entre / *vários*" e MODELOS vermelho |
| 8 s | para editar | desfoque, aberto | legenda |
| 8,4 s | qualquer tipo de vídeo usando o Claude. | aberto | "*qualquer* tipo de / VÍDEO" |
| 11 s | Inclusive, se você estiver no Instagram agora, você está vendo apenas | fechado | legenda |
| 13 s | um desses modelos. | fechado | "*um desses modelos.*" |
| 15 s | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | flash branco, aberto | legenda e prévias |
| 20 s | Mas se você quiser realmente ver | desfoque | legenda |
| 22 s | outros modelos de edição como esse | tela de respiro | "outros modelos / de EDIÇÃO / como esse" |
| 24 s | e aprender a como usar isso nos seus vídeos, | chicote, aberto | legenda |
| 27 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | fecho | Comenta / “EDIÇÃO” e legenda |
