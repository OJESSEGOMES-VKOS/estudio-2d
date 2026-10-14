# anunciocanvas01: anúncio em motion no canvas infinito

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (42 s, só a voz). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo, com o segundo
escrito) e o `mapa.json` (luz e trocas medidas a cada 0,25 s). Antes de editar, assista ao vídeo inteiro uma vez.

**A marca do vídeo aprovado é só exemplo.** Ele é um anúncio de um app de agenda para salão, com o nome "marcai", telas
de app, um estúdio, nomes de profissionais e preços. Tudo isso é adereço daquele vídeo, para mostrar como o modelo se
comporta. Num vídeo novo, a marca, o logo, as cores, as telas, os nomes, os números e a oferta vêm de quem pede o
anúncio. Nada disso se inventa e nada do aprovado se reaproveita.

---

## 1. A cara do modelo

É um **anúncio**, não um documentário: narração de venda, sem apresentador, cada frase vira peças soltas num canvas
infinito e uma câmera contínua passeia entre elas, sem nenhum corte.
- **Uma ideia por vez, sem enfeite.** Muito espaço vazio em volta da frase da vez (0 s, 13 s, 23 s).
- **Nada de grade nem de estações.** Cada peça (frase, pílula, balão, celular, cartão, número) mora num ponto
  próprio do canvas e aparece no tempo da palavra.
- **Câmera fluida, quase aleatória e bem suave**, como keyframes de After Effects com easy ease: desacelera enquanto a
  frase é lida e acelera entre as frases, mas nunca para.
- **O clima é o ambiente inteiro:** o fundo liso muda de cor com a frase. Escuro com mancha da cor da marca, azul na
  noite (3 s), vermelho na dor (8 s a 12 s), claro nas frases leves (5 s, 15 s, 33 s).
- **Fecho com a marca se montando** e a frase de assinatura, que fica até o fim (40 s a 41 s).

## 2. Os números do modelo (o `parece.py` confere)

| Item | Valor | O que é |
|---|---|---|
| Brilho | 19 (de 0 a 255) | Escuro, com frases claras curtas |
| Contraste | 35 | Fundos lisos, sem textura |
| Saturação | 146 | A cor da marca e o vermelho bem vivos |
| Temperatura | -8 | Fria (no aprovado, violeta e azul) |
| Tom | +6 | Puxado para o magenta da marca aprovada |
| Trocas | cerca de 34 por minuto | Cada chicote e cada troca de fundo conta como troca |

Com outra cor de marca, a temperatura, o tom e a saturação mudam. O `parece.py` só avisa na saturação. Brilho e
contraste têm que ficar perto destes.

## 3. Cenas e ritmo (a câmera)

- **Um keyframe de câmera por frase, no meio dela.** A câmera vai por um caminho Hermite com tangente pelos vizinhos
  (o "auto bezier"). No keyframe a velocidade cai para a fração `ease` dele: é o easy ease.
- **Cada passagem de uma frase para a outra sorteia um de três tipos** (sorteio fixo, o filme sai sempre igual):

| Tipo | Chance | Passo | Como anda | No aprovado |
|---|---|---|---|---|
| **Fluxo** | 40% | 460 a 700 px | desliza contínua, ease 35% no keyframe; as peças passam pelo quadro | (2 s, 27 s) |
| **Curva** | 30% | 1000 a 1300 px | keyframe extra no meio do vão, desviado 30% do passo para um lado e recuando 120; a frase seguinte assenta mais (ease 12%) | (22 s, 40 s) |
| **Chicote** | 30% | 1600 a 1900 px | segura (ease 0) até a fala acabar e salta no vão entre as frases em no mínimo 0,28 s, com borrão pela velocidade acima de 2600 px/s, até 20 px | (14 s, 17 s, 20 s) |

- **Regras do sorteio:** nunca o mesmo tipo 3 vezes seguidas; a virada (o produto aparece) é sempre chicote; a
  passagem para o fecho é sempre curva. A regra dos 3 seguidos nunca troca a virada nem o fecho (`const VIRADA` no
  `src/Canvas.tsx`).
- **O rumo vira aos poucos:** até ±43 graus por frase (±69 no chicote).
- **Por cima, um wiggle macio** de senos que nunca se repetem juntos: deriva de 14 px em x e 11 px em y, respiro de
  distância de 30 px, giro de 0,6 grau, inclinação 3D de 2,4 e 3 graus (é o que faz a paralaxe aparecer). Distância
  da câmera em volta de 1080 (±110), giro por frase até ±3,5 graus.
- **Tudo legível:** a viagem cabe no silêncio entre as falas. A câmera chega até 0,02 s depois da 1ª palavra da frase
  nova e a frase velha segura o quadro até lá. Cada frase tem que aparecer inteira enquanto é dita.
- **Onde fica o keyframe:** o de cada frase fica no meio dela (`TK`, média entre o início da 1ª palavra e o fim da
  última). O do fecho fica 0,6 s depois do fim da fala (no máximo 0,6 s antes do fim do vídeo): a câmera chega no
  fecho enquanto ele é dito e assenta nele.
- **Vão zero (fala corrida, sem silêncio entre as frases).** Não há silêncio para esconder a viagem, e o código faz:
  - **curva:** o keyframe extra do desvio fica no fim da frase velha (no máximo 0,1 s antes dela acabar), nunca no meio
    dela;
  - **chicote:** a câmera segura até, no máximo, 0,3 s antes da frase nova, mas nunca antes de a última palavra da frase
    velha ter nascido há 0,25 s. A viagem começa com a frase velha já toda escrita e chega pelo menos 0,28 s depois; a
    1ª palavra da frase nova nasce no meio do salto, com o borrão, e assenta na chegada;
  - **saída:** ver §4.
  Com vão de 0,16 s ou mais (todo o aprovado), o código faz exatamente o que fazia antes.
- **Frase longa (mais de 2,5 s).** A câmera não para no keyframe: no começo da frase ela ainda não chegou, no fim ela
  já passou. Peças presas ao keyframe escorregam pelo quadro e, numa frase longa, saem pela borda enquanto ainda são
  lidas. A regra de composição:
  - o que nasce **no começo** da frase fica do lado **de onde a câmera vem** (a frase anterior); o que nasce **no fim**
    fica do lado **para onde ela vai** (a frase seguinte). O fecho inteiro nasce com a câmera chegando: fica do lado de
    onde ela vem;
  - frase longa em fala corrida (vão menor que 0,15 s depois dela) se divide em duas frases em `FRASES`, cada uma com o
    seu keyframe, desde que cada metade dure pelo menos 1,5 s (§5);
  - confira no quadro logo antes do fim da última palavra de cada frase (§9, passo 5): nada lido pode estar cortado.

## 4. Os elementos

- **Cada elemento fica em volta do keyframe da sua frase**, deslocado em px de tela (x de -300 a 320, y de -520 a 460
  no aprovado), numa profundidade própria (z; o que fica atrás de -150 desfoca até 8 px) e com leve giro (até ±6 graus).
  Chega pelo lado para onde a câmera vai, passa pelo centro enquanto é lido e fica para trás.
- **Entrada:** mola (amortecimento 15, rigidez 150) com escala 0,7 → 1, opacidade e desfoque de 22 px que some.
- **O que conta como peça:** cada `<El>` da `Coreografia` é uma peça. Uma linha de texto (`<L>`) conta: "Sua agenda",
  "ainda vive no meio das" e a pílula "mensagens?" são três peças. O limite de 4 ou 5 peças por frase inclui as linhas.
- **Saída:** o elemento desfoca até 18 px e some em 0,6 s, começando 0,45 s depois de a frase acabar (no chicote e na curva,
  com vão de 0,16 s ou mais, a câmera já levou o grupo embora antes disso; no fluxo, que é passo curto, a frase velha
  ainda some por uns 0,2 s, borrada, como no aprovado). Em fala corrida a saída começa no máximo 0,05 s depois de a
  frase nova nascer e dura menos (0,3 s com vão zero). O fecho fica até o fim.
- **A frase velha nunca fica sobre a nova.** A saída e a viagem da câmera garantem isso no tempo. No espaço, quem
  garante é a composição: as peças da frase nova não nascem no lugar de tela onde a velha ainda está sumindo.
- **Fundo no tempo:** cor lisa com uma mancha elíptica suave (75% x 48%) que anda um pouco. Dissolve de 0,5 s
  começando 0,35 s antes da 1ª palavra da frase; em fala corrida (vão menor que 0,15 s) o código começa na 1ª palavra,
  para a frase velha não perder o fundo enquanto ainda é lida. Os quatro tons do aprovado:

| Tom | Base | Mancha | No aprovado |
|---|---|---|---|
| marca | `#07060B` | cor da marca a 34% | (0 s, 13 s, 18 s) |
| noite | `#05060D` | azul `rgba(70,90,255,0.26)` | (3 s a 4 s) |
| dor | `#0B0506` | vermelho `rgba(255,42,42,0.26)` | (8 s a 12 s) |
| claro | `#F6F4FA` | cor da marca a 24% | (5 s a 7 s, 15 s, 21 s, 25 s, 33 s) |

- **O repertório de peças** (em `src/ui.tsx` e no topo de `src/Canvas.tsx`):
  - balões de mensagem, de entrada e de saída, com hora e checks (1 s a 7 s);
  - hora grande fina com a lua (Sora 300, 210 px, 4 s);
  - cartão de data que fica cinza na negação (10 s);
  - relógio com o arco vermelho que corre e o objeto parado no meio (12 s);
  - **glitch vermelho** na palavra de dor, caixa alta (10 s "NÃO APARECE", 12 s "NINGUÉM PAGA.");
  - **risco vermelho** que corre da esquerda para a direita sobre o que deu errado (8 s);
  - **ícone de vidro** na cor da marca, que entra girando com mola (14 s, 22 s);
  - campo de link que se digita sozinho (15 s);
  - **celular inclinado com a tela do produto**, que sobe com mola e balança devagar (16 s a 22 s);
  - **pílulas** sólidas que se acumulam ao lado do celular, uma por palavra (18 s a 20 s);
  - notificações empilhadas (24 s);
  - cartão de valor com check (26 s);
  - painel inclinado em perspectiva com brilho na borda (28 s a 29 s);
  - **número que conta** com 12 pontos que acendem em volta (30 s a 32 s);
  - objeto que age (a tesoura que corta, 33 s);
  - **neons coloridos**, um por público, cada um num ponto (35 s a 36 s);
  - botão que destrava com cadeado e o selo da oferta (38 s a 39 s);
  - **marca se montando**, letra a letra (40 s a 41 s).
- **Menos é mais:** no máximo 4 ou 5 peças por frase, e o gancho com no máximo 4 balões. Anel fino e brilho são o
  único adorno. Sem trilho, partículas, selos soltos no fundo ou bordas esfumadas.
- **Representa o ato que a fala diz**, no instante da palavra: "chega na hora" ganha marca-texto (21 s), "corte" faz a
  tesoura cortar (33 s), "não aparece" apaga a data (10 s).
- **Tela de produto é real.** Os prints do produto de quem pede o anúncio, o mais perto possível de uma gravação de
  tela. Sem eles, o molde desenha uma tela genérica no lugar (`TelaGenerica`), nunca uma tela inventada com dados.

## 5. O texto na tela

- **Fontes:** Sora em tudo (300, 400, 500, 600, 700, 800). A Caveat (manuscrita) está carregada para um comentário com
  seta, quando a fala pedir. Espaçamento -0,025em, e -0,045em acima de 90 px.
- **Cada frase é montada em 2 a 3 linhas de tamanhos misturados:** a linha de ligação fina e pequena (Sora 400, 52 a
  64 px), a palavra de peso grande (Sora 800, 96 a 130 px). Exemplos: "Sua agenda" 124 px 800 e "ainda vive no meio
  das" 56 px 400 (1 s); "em outro lugar." 104 px 800 (7 s); "Um dia antes," 104 px 800 (23 s).
- **Cor do texto:** no escuro, forte em `#FFFFFF` e fino em `#E4DEF2` ou `#CFC8DD`; no claro, forte em `#16121F` e
  fino em `#5E5770` ou `#4A4458` (valores do aprovado, todos na paleta `C`). Palavra-chave na cor da marca ou com brilho dela ("link" 16 s, "sozinho." 24 s).
- **Cada palavra nasce no início dela** (±2 quadros), de um desfoque com deslize curto (curva `0.16, 1, 0.3, 1`).
  Toda palavra dita aparece, uma vez só, em ordem, escrita como foi dita.
- **Pílula de destaque** só no termo protagonista ("mensagens?", 2 s).
- **Tempo de leitura:** cada frase fica pelo menos 1,5 s e cada palavra pelo menos 0,4 s depois de nascer. No máximo 4
  linhas por frase.
- **Frases curtas coladas se juntam.** Se a fala tem frases curtas seguidas (menos de 1,5 s cada, como "Marcaí." e
  "Marcou, tá marcado."), elas viram uma frase só em `FRASES`, com um keyframe só. Nenhuma frase de `FRASES` dura menos
  de 1,5 s.
- **Cor do texto fino vem da paleta:** `C.fino` e `C.fino2` no escuro, `C.finoC` e `C.finoC2` no claro (as constantes
  `SUB`, `SUBC`, `FINO` e `FINOC` no topo da `Coreografia`). No aprovado elas puxam para o violeta: com outra cor de
  marca, troque-as em `src/tema.ts` por cinzas puxados para a cor nova.
- **Nunca escreva o nome do modelo na tela.** Nunca travessão.

## 6. Transições e fecho

- **Não há corte, borrão de cena nem íris.** A transição é a própria viagem da câmera (fluxo, curva ou chicote) mais a
  troca de cor do fundo.
- **Virada:** a frase em que o produto aparece entra sempre por chicote, com o ícone de vidro e a marca se montando
  (13 s a 14 s).
- **Fecho:** a marca (ícone e nome) se monta, a frase de assinatura entra embaixo e, 0,2 s depois do fim da fala, a
  oferta em Sora 600 42 px na cor clara da marca. Tudo fica até o fim (40 s a 41 s). O vídeo dura a fala mais 2,35 s.
  - **A assinatura é a última frase dita**, escrita como foi dita.
  - **O nome de quem anuncia aparece no fecho mesmo que não seja dito nele:** como logo real dele ou, sem logo, como
    texto no `<Wordmark>`.
  - **Sem oferta na fala, sem linha de oferta.** A linha embaixo da assinatura só existe se a fala disse a oferta.
- **A marca é de quem anuncia.** `Simbolo`, o `Wordmark` com o "ı" e o `Simbolo` dentro da `Notif` (em `src/ui.tsx`)
  são a marca do anúncio aprovado. Num anúncio novo entram o logo e o nome de quem anuncia (sem o "ı" se o nome não
  tiver). Nunca imite o logo de terceiro: marca citada na fala que não é de quem anuncia vira só texto, sem logo nem
  ícone que lembre o dela.

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Som no render | **ligado** (toca `public/som.m4a`; sem ele, só a narração) | Prop `voz: false` |
| Música e efeitos sonoros | desligados (o aprovado é só a voz) | Mixe voz, trilha (cerca de 16 dB abaixo) e efeitos fora e grave `public/som.m4a` |
| Telas do produto | tela genérica | `public/reserva.png`, `public/confirmado.png` (1170x2532) e `public/painel.png` (2160x1440) |
| Cor da marca | a de quem pede o anúncio | Paleta `C` em `src/tema.ts` (o resto lê dela) |
| Sorteio das passagens | fixo | Mude as sementes de `rnd(...)` em `TIPOS` e `montar` no `src/Canvas.tsx` |

## 8. Zona segura e material

- Todo texto lido fica em x 60 a 940 e y 250 a 1500 (1080x1920) enquanto é lido. Peças desfocadas e de fundo podem passar.
- A zona segura é assimétrica de propósito: a coluna de botões do Instagram ocupa os 140 px da direita, por isso nenhum texto passa de x 940.
- **Narração:** gravada por quem pede o anúncio ou gerada com o ok dele. O roteiro passa pelo `/humanizer` e mora em
  `roteiro.txt`.
- **Logo, marca, prints, preços, nomes, prazos, números:** só os reais de quem pede o anúncio. Faltou, vira pedido. O
  resto do vídeo segue.

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo" (`videos/<AAAA-MM-DD-tema>/`).

1. **A narração vira vídeo** (o `novo-video.py` pede um vídeo): se você tem só o áudio,
   `ffmpeg -f lavfi -i color=c=black:s=1080x1920:r=30 -i narracao.wav -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac narracao.mp4`.
2. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py anunciocanvas01 <narracao.mp4> <AAAA-MM-DD-tema>`.
   Isso copia o molde, grava `public/voz.wav` e transcreve a fala em `src/palavras.json` (a gravação de vídeo e o
   `rosto.json` não vêm: o modelo não tem rosto). O que vem do aprovado e você apaga da pasta do vídeo:
   `public/som.m4a` (o mix do aprovado; sem apagar, o render toca a voz velha) e `public/reserva.png`,
   `public/confirmado.png` e `public/painel.png` (as telas do aprovado). Troque o `roteiro.txt` pelo texto novo.
   Narração gerada: `kit/.venv/Scripts/python.exe kit/voz.py videos/<v>/roteiro.txt videos/<v>/public/voz.mp3 --voz <voice_id>`
   e copie `public/voz.palavras.json` por cima de `src/palavras.json`.
   Nome que a transcrição errar (ex.: "Cloud" no lugar de "Claude") se corrige já aqui: `--trocar Cloud=Claude` (pode repetir).
3. **Identidade de quem pede, num lugar só:** a paleta `C` em `src/tema.ts`. Dela saem a cor da marca, o texto fino,
   o volume do ícone de vidro e do símbolo e as manchas do fundo (`AMB` lê `C.v` e `C.vBrilho`). O vermelho `#FF2A2A`
   e os tons `dor` e `noite` continuam fixos. Ponha os prints reais em `public/` e troque a marca (§6).
4. **Monte O PLANO em `src/Canvas.tsx`** (na pasta do vídeo). O molde para de propósito enquanto o plano não bater com
   a fala nova e diz a palavra que difere.
   - `const FALA`: o texto da fala nova.
   - `const FRASES`: `[1ª palavra, última palavra, tom]` com tom `marca`, `dor`, `noite` ou `claro`. As frases
     cobrem a fala inteira, em ordem (curtas coladas se juntam, longas em fala corrida se dividem: §3 e §5).
   - `const VIRADA` (logo abaixo de `FRASES`): o índice da frase em que o produto aparece (5 no aprovado). Nem a
     primeira nem o fecho.
   - A `Coreografia`: um grupo por frase, `<El k={frase} x={...} y={...} z={...} rot={...}>`. Cada linha escrita é
     `<L de={segundos} txt="..." tam={px} cor={...} peso={...} />`, com as palavras como foram ditas, e os instantes
     vêm de `w('palavra', n)` e `wf('palavra', n)`. O fecho leva `fica`. O wordmark é a prop `texto` do `<Wordmark>`.
5. **Confira:** não há checador separado. A conferência do plano contra a fala roda ao carregar. Para cada frase,
   olhe um quadro logo depois da 1ª palavra e um logo antes da viagem seguinte: os dois têm que mostrar todo o texto
   dito, dentro da zona segura.
6. **Som:** sem música, o render toca `public/voz.wav`. Com música, mixe voz, trilha e efeitos fora e grave
   `public/som.m4a` antes do render.
7. **Olhe quadros** (na pasta do vídeo), escolhendo o meio e as pontas de cada frase e cada troca (em fala corrida,
   0,05 s antes e 0,1 s e 0,25 s depois do início de cada frase):
   `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs conferencia/q 1.3 2.6 5.45 5.6`
   (os tempos em segundos; grava um PNG por tempo e imprime o sha256 de cada um). Para ver todos juntos, monte a folha:
   copie os PNGs em ordem para `conferencia/q/s_00.png`, `s_01.png`... e rode
   `ffmpeg -i conferencia/q/s_%02d.png -vf "scale=270:-1,tile=6x3" -frames:v 1 conferencia/folha.jpg`.
   A folha do vídeo inteiro contra o aprovado é a do `parece.py` (passo 10).
8. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts Anuncio out/video.mp4 --codec=h264 --crf=16 --concurrency=2`.
9. **Mixe:** `sh scripts/finalizar.sh out/video.mp4 out/final.mp4` (na pasta do vídeo). Normaliza em -14 LUFS e pico
   -1 dBTP.
10. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 anunciocanvas01`.
    Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
    em cima e o seu embaixo. Se a diferença salta aos olhos, ainda não está pronto.

## 10. O plano do vídeo aprovado (para comparar)

| Tempo | Fala | Passagem / fundo | Na tela |
|---|---|---|---|
| 0 s | Sua agenda ainda vive no meio das mensagens? | início, marca | "Sua agenda" grande, "ainda vive no meio das" fino, pílula "mensagens?", dois balões ao fundo |
| 3 s | O cliente pede horário às onze da noite. | noite | "O cliente pede horário", balão de mensagem, 23:47 com a lua, "às onze da noite." |
| 5 s | Você responde de manhã, e ele já marcou em outro lugar. | claro | balão de resposta, balão "já marquei em outro lugar", "em outro lugar." grande |
| 8 s | Outro confirma e, no dia, não aparece. | dor | resposta riscada de vermelho, cartão de data que fica cinza, glitch "NÃO APARECE" |
| 11 s | É uma hora parada que ninguém paga. | dor | relógio com o arco vermelho, glitch "NINGUÉM PAGA." |
| 13 s | Agora tem o Marcaí. | chicote (virada), marca | "Agora tem o", ícone de vidro girando, a marca se escrevendo |
| 15 s | Você manda o seu link e o cliente marca sozinho. | claro | "link" na cor da marca, campo que se digita, celular com a tela, "marca sozinho." |
| 18 s | Escolhe o serviço, o horário e paga o sinal no Pix. | chicote, marca | celular grande e as pílulas "serviço", "horário", "sinal no Pix" se acumulando |
| 20 s | A confirmação chega na hora. | chicote, claro | ícone de check, celular confirmado, "chega na hora." com marca-texto |
| 23 s | Um dia antes, o lembrete vai sozinho. | marca | "Um dia antes," grande, duas notificações empilhadas, "sozinho." com brilho |
| 25 s | E quem já pagou o sinal não esquece. | claro | cartão "Sinal pago" com check, "não esquece." com marca-texto |
| 27 s | De manhã, você abre o painel e vê o dia inteiro. | marca | "painel" com brilho, painel inclinado, "e vê o dia inteiro." |
| 30 s | Doze atendimentos, todos confirmados. | marca | o 12 contando com os pontos acendendo, "todos confirmados." |
| 32 s | Sem parar o corte pra responder mensagem. | claro | tesoura que corta, "Sem parar o corte", "pra responder mensagem." riscado |
| 35 s | Pra salão, barbearia e estúdio de estética. | marca | três neons, cada um com sua cor e ícone, em pontos diferentes |
| 37 s | Teste grátis por catorze dias. | marca | botão que destrava "Teste grátis" e o selo "por 14 dias" |
| 40 s | Marcaí. Marcou, tá marcado. | curva (fecho), marca | ícone e marca, "Marcou, tá marcado.", a oferta embaixo, até o fim |
