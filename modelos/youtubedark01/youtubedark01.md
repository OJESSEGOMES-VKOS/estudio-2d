# youtubedark01: canal sem rosto, um bonequinho vive o que a narração diz

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (30,4 s, 9:16, narrado). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo) e o `mapa.json`
(luz e cortes medidos a cada 0,25 s). Antes de editar, assista ao vídeo inteiro uma vez. O mesmo vídeo em qualidade cheia está no `original.mp4`, para ler letra pequena e detalhe de tela.

**A referência mostra o jeito do modelo, não um roteiro para copiar.** Siga a cara, os números e as regras; as telas, os textos e os cortes do vídeo novo nascem da fala nova. Não repita as cenas do aprovado só porque estão lá.

Este modelo não tem rosto nem câmera: tem **cenas**. Ele cobre direção (roteiro e cena) além da edição.

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

Um personagem simples, sem nome, com quem qualquer pessoa se identifica, vive o que o roteiro diz. O canal não mostra
apresentador.
- **Uma ilustração parada por frase**, em corte seco no início da palavra, câmera parada (11 cenas em 30 s).
- **Fundo preto, luz dourada de cima:** focos de luz sobre a parede e o chão em linha, poeira no facho, grão de filme
  por cima (0 s a 30 s).
- **O personagem é um feijão creme** `#EDE6D6`, cabeça redonda, olhos de ponto, traço escuro (0 s, 13 s, 27 s).
- **Verde neon só no objeto-chave** da frase: a tela de edição, o cartão de vídeo, a sala de cartões (0 s, 7 s, 22 s).
- **Legenda em caixa alta, branca com contorno preto, no terço de baixo**, montada palavra por palavra (1 s, 9 s).
- **Vermelho uma vez só**, no risco ondulado sob a palavra da chamada (28 s).

O modelo tem duas famílias. Escolha uma por vídeo e não misture:

| | **A. Curta animado** | **B. Explicação ilustrada** (a do aprovado e do molde) |
|---|---|---|
| Narração | Nenhuma: música, efeitos e frases curtas na tela | Locutor do começo ao fim, calmo e firme |
| Duração | 2:30 a 3:30 | 8 a 10 min; Short de 30 a 50 s |
| Imagem | Animação de verdade: o personagem anda, cai, levanta | Uma ilustração parada por frase |
| Ritmo | Planos de 4 a 20 s com movimento dentro | Uma imagem nova a cada 2 a 6 s |
| Força | Emoção | Ensino |

## 2. Os números do modelo (o `parece.py` confere)

| Item | Valor | O que é |
|---|---|---|
| Brilho | 25 (de 0 a 255) | Muito escuro: preto com focos |
| Contraste | 137 | Focos acesos no preto |
| Saturação | 71 | Só o verde e o dourado acendem |
| Temperatura | +0,8 | Neutro, puxado de leve pelo dourado |
| Cortes | cerca de 18 por minuto | Uma cena por frase (11 em 30,4 s) |

Não há rosto para medir.

## 3. Direção de roteiro

**B. Explicação ilustrada: a lista com tese.**

| Tempo (vídeo longo) | Bloco | O que diz |
|---|---|---|
| 0 a 20 s | Gancho em pergunta ou provocação | "O que aconteceria com a sua vida se...?" |
| 20 s a 1 min | O problema como o público vive, e o erro comum | O que ele tenta e por que não dá certo |
| ~1 min | A âncora: a prova da tese (uma passagem, um dado, um caso) | Conferida na fonte, nunca inventada |
| ~1 min | A promessa da lista, com isca para o fim | "...e a quinta é a mais esquecida de todas" |
| corpo | 5 itens, 1 a 1,5 min cada | Nome numerado, prova, explicação curta, comparação do dia a dia, ação prática concreta |
| meio | Chamada: curtir, inscrever e comentar uma frase pronta | |
| fim | Recapitulação dos 5 numa frase e a tese de novo | |
| últimos 20 s | Compromisso no comentário e a despedida | |

- Frase curta, em segunda pessoa ("você"), com contrastes em par ("O problema não é o valor. O problema é o padrão.").
- O Short é o mesmo comprimido: uma definição em par em 30 a 50 s.
- Tema com citação (por exemplo bíblica): toda passagem conferida na fonte, livro, capítulo e versículo certos.

**A. Curta animado: arco de 3 atos sem fala.** Todo filme é sobre uma palavra (DISCIPLINA, DOPAMINA), e o vilão é a voz
interna que defende o contrário. Rotina presa (o mesmo dia se repetindo, uma frase de abertura no preto); o vilão fala
(uma sombra do próprio personagem, preta com contorno e olhos vermelhos, cochichando mentiras em texto vermelho); fundo
do poço sob um único foco, com a frase-tese em branco; a virada (o mesmo despertador, mas ele levanta, "DIA 1." no topo);
a luta em montagem (contador de dias subindo, recaídas, barra de motivação caindo); a lição em 2 frases sobre a única
cena quente; o fecho em loop no cenário do começo; cartela com a palavra em caixa alta e sublinhado vermelho ondulado.

## 4. As cenas (a direção de cena)

- **Uma imagem por frase, que encena a frase ao pé da letra.** "Editado" vira o personagem na mesa de edição com a barra
  chegando a 100% (0 s a 3 s); "vários modelos" vira três cartões diferentes sob três focos (3 s a 6 s); "no Instagram"
  vira ele na cama rolando o feed com luz azul no rosto (11 s); "apenas um desses" vira cinco cartões apagados e um aceso
  (13 s); "outros modelos" vira uma porta que se abre para uma sala cheia de cartões verdes (20 s a 24 s).
- **Câmera parada.** Nada de zoom nem pan. O movimento vem do corte para a próxima imagem e de pequenos acontecimentos
  dentro da cena (a barra enchendo, as prévias entrando, o risco se desenhando).
- **Corte seco no início da palavra** que abre a frase. A última cena vai até o fim do vídeo e escurece nos últimos 15
  quadros (29,9 s a 30,4 s).
- **Metáforas que se repetem:** porta aberta ou fechada (oportunidade), livro aberto brilhando (ensino), feixe de luz
  do alto (o que importa), balança (escolha), ampulheta (espera), corrente ou pedra (fardo), semente (o que cresce sem
  aparecer), caminho que bifurca (decisão), espelho (autoexame).
- **Cenários prontos no molde:** parede com chão em linha, janela com lua, cama, mesa, luminária, facho, poeira, porta,
  cartões 9:16 com "jeitos de editar" abstratos, ícones de tipo de vídeo (microfone, câmera, claquete, celular), setas,
  cadeira, livro, caixa de comentário. Cena nova se desenha no mesmo traço.
- **Paleta** (`src/base.ts`):

| Papel | Cor |
|---|---|
| Fundo | preto `#060606`, parede `#111216`, chão `#3a3b41` |
| Personagem | pele `#EDE6D6`, sombra `#D5CCBA`, traço `#26221f` |
| Móveis | `#2a2b31`, contorno `#787c87` |
| Luz | ouro `#ffc94a`, ouro claro `#ffe7a3` |
| Objeto-chave | verde neon `#3dff8a`, com brilho |
| Giz (traço de objetos e etiquetas) | `#e9e6df` |
| Apagado | `#3b3d44` |
| Vermelho (só o risco da chamada) | `#ff2b25` |

- Pessoa real nunca desenhada nem gerada como se fosse ela.

## 5. Texto na tela (a legenda conta a história)

- **Fonte única: Comic Neue 700**, caixa alta, branca `#ffffff`, contorno preto de 16% do tamanho, sombra preta curta
  embaixo.
- **Legenda:** 66 px, linhas centradas com a 1ª em y 1217 e as seguintes a cada 78 px (até 4 linhas, até y 1451). É uma
  posição só no vídeo inteiro.
- **Cada palavra entra no quadro em que é dita**, com um "pop" de 3 quadros (de 82% a 100%). O bloco dura a cena inteira
  e some no corte.
- **Toda palavra dita aparece uma vez só.** Bloco pelo menos 1,5 s, palavra pelo menos 0,4 s depois de nascer, no máximo
  4 linhas. Fala rápida junta numa frase maior. Se uma palavra curta cai no fim do bloco e não alcança os 0,4 s, corte a
  cena antes dela e junte a oração no bloco seguinte.
- **A palavra protagonista pode ir em verde neon** com brilho, quando a cena mostra a mesma coisa ("OUTROS MODELOS DE
  EDIÇÃO", 22 s).
- **A grafia de uma palavra** pode ser trocada no plano (`texto`), por exemplo para pôr aspas; o sentido nunca muda.
- **Chamada (fecho):** fixo só o comando, dentro da caixa de comentário desenhada: "COMENTA" em 64 px em y 948 e a
  palavra entre aspas, “EDIÇÃO”, em 128 px em y 1042, com o risco vermelho ondulado que se desenha embaixo dela (27 s a
  30 s). O resto da fala segue na legenda logo abaixo.
- **Fala sem chamada:** tire `"fixo"` do plano e as marcas `caixa` e `risco`. Sem chamada não há vermelho. O campo
  `"texto"` fica `{}` quando nenhuma grafia muda; ele nunca some do plano.
- Nunca escreva o nome do modelo na tela. Nenhum travessão no texto.
- **Família A:** frase curta em minúsculas na mesma fonte, branca no rodapé ou no topo; as falas do vilão em vermelho
  perto dele; letreiros de jogo ("DIA 1.", "MOTIVAÇÃO 72%") em caixa alta.

## 6. Som

- **B:** a voz na frente, calma, com pausa depois de cada contraste. A música é opção desligada por padrão (o aprovado
  saiu com ela ligada): piano esparso e cordas suaves em lá menor, um acorde por cena, cerca de 16 dB abaixo da voz com
  ducking. **Nenhum efeito no corte.** Efeitos discretos só
  em acontecimentos dentro da cena: a barra chegando a 100% (1,2 s), as prévias entrando nos quadros (15,7 s), o risco
  vermelho sob a palavra da chamada (27,4 s).
- **A:** a música manda (baixa no começo, sobe na virada, explode na montagem, respira na lição), foley (despertador,
  soco, passos, chuva) e um som grave e distorcido quando o vilão fala.
- Voz: a do dono gravada, ou gerada pelo kit de voz, mantida a mesma em todos os vídeos do canal.
- -14 LUFS, pico -1,3 dBTP.

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão no código | Como mudar |
|---|---|---|
| Efeitos sonoros do modelo | **ligados** (`efeitos: true`) | Prop `efeitos: false`. Ligado exige `public/efeitos.wav` (`scripts/som.py`) |
| Música | desligada (`musica: false`) | Prop `musica: true`, depois do `scripts/som.py` |
| Grão de filme | **ligado** se existir `public/grao/` | Não vem garantido com o molde: rode `scripts/grao.py`. Para desligar, apague `public/grao/` |
| Prévias | desligadas (`previas: false`) | Prop `previas: true` e `nomesPrevias`, com `"previas"` no plano |
| Comando fixo no fecho | ligado no plano | Tire `"fixo"` do `src/tempos.json` |
| Escurecer no fim | ligado no plano | Tire `"fade_q"` do `src/tempos.json` |

O aprovado saiu com as prévias e a música ligadas. O `referencia.mp4` guarda só a voz.

**Prévias:** dois clipes de vídeos seus, acelerados 3 vezes, dentro de dois quadros dourados na parede sob os dois
focos (x 140 a 440 e x 640 a 940, a partir de y 290, 300 px de largura, moldura dourada com brilho), com a etiqueta
de cada um em Comic Neue 700, 36 px, embaixo (15,7 s a 20 s). Sem prévias, a parede fica só com os focos. Nunca vídeo
de terceiro.

## 8. Zona segura

- Todo texto fica em x 60 a 940 e y 250 a 1500 (1080x1920), medido com o contorno incluído. A faixa é assimétrica de
  propósito: os 140 px da direita são da coluna de botões do Instagram, e o centro útil é x 500.
- **Num vídeo novo, ponha `"cx": 500` em `"legenda"`** para a legenda centrar no meio da área útil. Sem a chave ela
  centra em 540, como no aprovado (que não muda). O conferidor mede a partir do `cx`.
- Nome e @ na tela, só os reais do canal ou de quem narra, ou nenhum. Marca d'água do canal, se houver, pequena no canto
  de baixo, dentro da zona.

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo" (`videos/<v>/`).

1. **Prepare a narração.** Grave (ou gere) a voz. Gravou com rosto? O modelo usa só a voz: tire o áudio com
   `ffmpeg -i grav.mp4 -vn narracao.wav` e siga. O `novo-video.py` pede um vídeo: ponha o áudio num vídeo preto antes
   (da raiz):
   `ffmpeg -f lavfi -i color=c=black:s=1080x1920:r=30 -i narracao.wav -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac narracao.mp4`.
   O roteiro passa pelo `/humanizer` antes de gravar.
2. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py youtubedark01 narracao.mp4 <AAAA-MM-DD-tema>`. Isso
   cria `videos/<AAAA-MM-DD-tema>/` com a voz (`public/voz.wav`) e as palavras com tempo (`src/palavras.json`). Se a
   transcrição errar um nome, acrescente `--trocar Cloud=Claude` (uma troca por par).
3. **Escreva o plano** em `src/tempos.json` (na pasta do vídeo), sobre a fala nova:
   - `"fala"`: o texto da fala (o conferidor imprime pronto para colar).
   - `"duracao_q"` (pelo menos o fim da última palavra) e `"fade_q"` (opcional).
   - `"cenas"`: uma ilustração por frase, `{"id", "de_q", "ate_q", "o_que"}`, cortes no início de uma palavra, sem
     buraco, a última até `duracao_q`.
   - `"previas"` (opcional), `"marcas"` (`"nome": [índice, "palavra"]`, os instantes que as cenas usam; o nome é livre,
     mas o som só toca em três: `barra_cheia`, `barra_fim`, a palavra depois de "100%", e `risco`), `"texto"` (grafia
     trocada, `{}` se nenhuma), `"legenda"` (`fs`, `y0`, `passo`, `cx`),
     `"blocos"` (um por cena, as linhas com os índices das palavras, `"verde"` para a protagonista) e `"fixo"`.
4. **Desenhe as cenas** em `src/Cenas.tsx`: cena nova entra no mapa `CENAS`, no fim do arquivo. Reaproveite as que
   servem (S1 a S11 do aprovado; N2 grava no celular e manda o arquivo, N3 três cartões que acendem um por vez, N4 a tela
   que edita sozinha com o visto, cada uma com as marcas citadas no comentário dela). As peças prontas: `Fundo`, `Luz`,
   `Poeira`, `Cartao` (estado `apagado`, `giz`, `verde` ou `ouro`), `Icone`, `Boneco` (com `celular`) e os helpers
   `marca`, `cena` e `lerp`. O molde para ao carregar se o plano pede uma cena que não existe.
5. **Confira as regras:** `../../.venv/Scripts/python.exe scripts/conferir.py` (na pasta do vídeo) até sair `0 erros`.
   Ele confere que o plano é desta fala, palavra uma vez só e no tempo, tempo de leitura, linhas, posições, cortes no
   início da palavra, cenas sem buraco, zona segura, travessão e nome de modelo.
6. **Grão e som** (na pasta do vídeo): `../../.venv/Scripts/python.exe scripts/grao.py` (o grão não vem garantido) e
   `../../.venv/Scripts/python.exe scripts/som.py` (grava `public/efeitos.wav` e `public/trilha.wav` a partir do plano).
7. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1.5 16.5` (na pasta do vídeo;
   `--previas` liga as prévias, `PROPS=<arquivo.json>` usa as props do render). Folha:
   `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png q2.png --cols 6`.
8. **Renderize** (na pasta do vídeo). O render já sai com voz e efeitos:
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineYoutubeDark01 out/bruto.mp4 --codec=h264 --crf=16 --concurrency=2`
   Com música: `--props='{"musica":true,"efeitos":true}'`; com prévias, acrescente
   `"previas":true,"nomesPrevias":["modeloA","modeloB"]`.
9. **Finalize o som** (na pasta do vídeo): `sh scripts/finalizar.sh out/bruto.mp4 out/final.mp4` (-14 LUFS).
10. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 youtubedark01`.
    Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
    em cima e o seu embaixo. Se a diferença salta aos olhos, ainda não está pronto.

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<v> 1` (e o mesmo com `2`).

## 10. O plano do vídeo aprovado (para comparar)

| Tempo | Fala | Cena / transição | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. | S1: sentado na mesa de edição sob o foco; a barra da tela verde chega a 100% no "100%" | legenda "ESSE VÍDEO ESTÁ / SENDO 100% EDITADO / PELO CLAUDE." |
| 3,1 s | Ele foi criado justamente para te mostrar a diferença entre vários modelos | corte seco, S2: ele apresenta três cartões de edição, cada um sob um foco | legenda em 4 linhas |
| 6,7 s | que eu criei e melhorei para editar qualquer tipo de vídeo usando o Claude. | corte seco, S3: segura o cartão verde aceso; em volta, microfone, câmera, claquete e celular | legenda em 4 linhas |
| 10,7 s | Inclusive, se você estiver no Instagram agora, | corte seco, S4: na cama, de noite, rolando o feed, luz azul no rosto | legenda |
| 12,6 s | você está vendo apenas um desses modelos. | corte seco, S5: cinco cartões apagados, só um aceso sob o foco | legenda |
| 14,5 s | Eu posso até colocar duas prévias rápidas | corte seco, S6: parede com dois focos; as prévias entram nos quadros dourados em 15,7 s | legenda; prévias com etiqueta |
| 17,1 s | aqui em cima, aceleradas em três vezes. | corte seco, S7: mesma parede, ele aponta para cima, três setas verdes | legenda; prévias até 20 s |
| 20 s | Mas se você quiser realmente ver | corte seco, S8: porta fechada com luz vazando, mão na maçaneta | legenda |
| 21,9 s | outros modelos de edição como esse e aprender | corte seco, S9: porta aberta, sala cheia de cartões verdes, ele em contraluz | "OUTROS MODELOS / DE EDIÇÃO" em verde neon, o resto branco |
| 24,8 s | a como usar isso nos seus vídeos, | corte seco, S10: sentado com o livro aberto brilhando, um cartão flutuando em cima | legenda |
| 26,8 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | corte seco, S11: ele aponta para baixo, para a caixa de comentário; escurece no fim | fixo "COMENTA / “EDIÇÃO”" com o risco vermelho (27,4 s); o resto na legenda |
