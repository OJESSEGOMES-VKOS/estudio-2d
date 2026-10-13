# ilustrations01

Modelo de **metáfora animada no preto**: Reels 9:16 curtos, sem rosto, em que uma cena mínima de vetor (bonecos, objetos,
um semáforo, uma barra fixa) prova uma frase sobre comportamento sem precisar explicar. Montado medindo de ponta a ponta 4
referências que o Jessé escolheu (decupagens em `analise/refN_decupagem.md`, quadros cheios em `analise/refN_q/`). Tudo o
que ele ensinar dizendo "ilustrations01" entra **só aqui**.

| | Criador | Tema | Duração | Cortes | Fala | Forma |
|---|---|---|---|---|---|---|
| ref1 | @profithuman | Motivation x Discipline (barra fixa) | 12,1 s | 0 | nenhuma, só música | A. Duelo |
| ref2 | @valueanimate | Overthinker x Doer (arco e flecha) | 8,6 s | 0 | nenhuma, efeito por tiro e música no acerto | A. Duelo |
| ref3 | @valueanimate | 93% / 6% / 1% of people (boliche) | 9,9 s | 0 | narração motivacional por baixo | B. Escada de porcentagem |
| ref4 | @valueanimate | I wish I had... (semáforo) | 27,1 s | 0 (1 deslize de câmera) | uma fala por personagem | C. Corrente com virada |

Rosto: 0% nas quatro. Medido em 720x1280; neste modelo os números vêm em **% do quadro**, e em px para 1080x1920 quando
ajuda a construir.

## 1. A ideia central

**A mesma ação, repetida em compasso, por personagens que reagem diferente, até a diferença virar resultado.** A tela não
explica nada: põe lado a lado (ou em fila) quem desiste e quem insiste, quem quer e quem tem, e deixa o espectador ver a
conta fechar. A cor é o juiz: tudo é branco e cinza até alguém ganhar (verde, azul aceso) ou errar (vermelho).

Três coisas fazem o formato:
1. **Plano único.** Nada de corte. A cena está montada no quadro 0 (ou entra no 1º segundo) e a história acontece dentro dela.
2. **Ciclo.** Uma ação curta se repete num compasso fixo (barra a cada 1,2 s, tiro a cada 1,4 s, arremesso a cada 1,2 s,
   chegada a cada 4 a 5 s). O compasso é o relógio da história.
3. **Silêncio visual.** Fundo preto puro, objetos pequenos, letra pequena. O vazio é o que faz o destaque aceso gritar.

## 2. A estrutura da história

Que ideia esse formato conta: **comparação de comportamento com um resultado que dá razão a um lado**, ou **ironia de
perspectiva** (o que você despreza é o sonho de alguém). Não serve pra lista, tutorial nem notícia. Serve pra uma tese de
uma frase sobre atitude: constância, coragem de tentar, gratidão, foco.

### As três formas medidas

| | **A. Duelo** (ref1, ref2) | **B. Escada de porcentagem** (ref3) | **C. Corrente com virada** (ref4) |
|---|---|---|---|
| Quem | 2 personagens iguais lado a lado, cada um com um nome de comportamento | 3 fileiras iguais empilhadas, cada uma com uma fatia ("93% / 6% / 1% OF PEOPLE") | 5 a 6 personagens que chegam um depois do outro |
| O que fazem | A mesma ação no mesmo palco | A mesma ação; a diferença é quantas vezes tentam | Cada um diz o que queria ter; o que quer é o que o da frente tem |
| Como a diferença aparece | Um começa forte e para (ref1) ou nunca age (ref2); o outro segue no compasso | A de cima nunca se mexe, a do meio tenta 1 vez, a de baixo erra 4 e acerta na 5ª | Cada chegada desce um degrau (helicóptero, esportivo, SUV, sedã, a pé, cadeira de rodas) |
| A virada | O resultado: o cinza desiste (ref1, 60 a 70%) ou a flecha acerta (ref2, 65%) | O strike verde (64%) | A última fala inverte a corrente (76%) |
| Fecho | Segura o resultado 3 a 4 s, sem texto | Segura 3,3 s, sem texto | Apagão e moral escrita em 2 linhas, segurada 3,4 s |
| Texto | Só os nomes, fixos | Só as fatias, fixas | Uma frase entre aspas por personagem + a moral |
| Duração | 8 a 12 s | ~10 s | ~27 s |

### O esqueleto comum (checagem, não fôrma)

1. **0 a 1 s, a premissa na tela.** Personagens e nomes já postos (A e B) ou o 1º personagem entrando (C). Nada de título.
2. **O ciclo começa** já no 1º segundo e segue no mesmo compasso.
3. **A divergência**: um lado desacelera, para, ou nunca começa; os erros ficam na tela (bolas vermelhas, flechas cravadas).
4. **A virada entre 60 e 76% da duração**, sempre um evento de cor (verde, desistência do cinza, a frase que inverte).
5. **Segura 3 a 4 s** pra leitura e pro loop, ou fecha com a moral escrita.

Regra que vale nas 4: **o erro mostra avanço ou custo, nunca é só fracasso**. Na ref2 cada flecha crava mais longe que a
anterior; na ref3 as bolas vermelhas ficam na tela como prova das tentativas.

## 3. A receita visual medida

### Quadro e zonas (1080x1920)

| Zona | y (% da altura) | O que vai |
|---|---|---|
| Alto | 15 a 27% | nomes/rótulos do duelo (ref1 em 25%, ref2 em 15%) ou o objeto do desejo passando (helicóptero, 19 a 34%) |
| Frase falada | 31 a 37% | a frase entre aspas da forma C, centrada |
| Ação | 38 a 75% | personagens, barra, chão, arcos, fileiras |
| Reflexo | 61 a 86% | quando há chão (ref1 e ref4) |
| Rótulo de baixo | ~79% | nome embaixo do objeto (ref2) |
| Marca d'água | 89,5 a 92,5%, centro | marca do perfil, pequena |

Tudo centrado no eixo vertical do quadro ou em pares simétricos (centros em x 31/68% na ref1, 33/66% na ref2). Fileiras
empilhadas com passo igual (22% da altura na ref3).

### Fundo e chão

- Fundo `#000000` puro, sem textura, sem vinheta.
- Chão não é desenhado: existe só pela posição dos objetos e pelo **reflexo** (ref1, ref4). Reflexo = cópia espelhada sob a
  linha do chão, borrada (~6 a 10 px a 1080), com 15 a 25% da luz do original, sumindo em ~9% da altura. Nas refs 2 e 3
  não há reflexo: usar quando houver personagem apoiado no chão.

### Objetos e personagens

- Vetor com **sombreado suave de volume** (degradê, brilho de lataria, sombra interna), não traço chapado de contorno.
- Personagem humano: palito branco de cabeça redonda e sem rosto (ref4) ou manequim sem rosto de costas (ref1). Mãos sem
  corpo também servem (ref3).
- Tamanho: cada personagem/objeto principal ocupa **7 a 21% da largura** sozinho (palito 7%, arco 24%, carro 41 a 46%,
  boneco da barra 19 a 21%). Muito vazio em volta.
- Objetos repetidos são **idênticos** (dois arcos iguais, três mãos iguais): a única diferença é o comportamento.

### Paleta medida (a identidade deste modelo, seção 8)

| Papel | Hex | Visto em |
|---|---|---|
| Palco | `#000000` | todas |
| Branco giz | `#FCFCFC` | textos, bonecos, mãos, pinos, arcos |
| Cinza objeto | `#2C2C2C`, `#363636`, `#6A6A6A`, `#9B9B9B` | carros, helicóptero, boneco que falha, barras |
| Vermelho erro/pare | `#FD0000` (semáforo `#FF0000`) | bola e flecha que erram, semáforo fechado |
| Verde acerto/siga | `#00FB10` a `#04E509`, luz `#88FF8C` (semáforo `#00FF55`) | flecha no alvo, strike, semáforo aberto |
| Azul aceso (quem persiste) | miolo `#08A1DF`, luz `#37CAFB`, borda `#77EDFE` | o "Discipline" da ref1 |
| Âmbar transição | `#FDF201` | semáforo amarelo |
| Halo | a cor viva a ~10 a 25% (`#210000`, `#033904`, `#07203A`) | em volta de tudo que está aceso |
| Marca d'água | `#343434` a `#363636` | rodapé |

Cor viva é **evento**, não decoração: aparece só quando alguém ganha, erra ou quando um sinal muda. Uma cena tem no máximo
duas cores vivas ao mesmo tempo (vermelho do erro + verde do acerto, ref3).

### Brilho (halo)

Todo objeto aceso emite luz: contorno mais claro, miolo saturado e uma névoa redonda e fraca de **25 a 47% da altura do
quadro** em volta (semáforo 24%, alvo verde 26%, boneco azul 47%). O halo acende o que está perto (a barra fica ciano perto
do boneco azul). Na ref3 o vencedor já tem um brilho branco suave atrás do rótulo "1%" desde o quadro 0.

### Texto

| | Medida |
|---|---|
| Fonte | geométrica de traço fino a médio, terminais arredondados, **caixa alta**, espaçamento entre letras largo (~0,1 em). Refs 2 a 4. (A ref1 usa grotesca tipo Arial em caixa mista: assinatura dela) |
| Tamanho | altura da letra **1,25 a 1,4% da altura** do quadro (24 a 27 px a 1920, corpo ~36 px). Rótulo de duelo até 2% |
| Cor | branco `#FCFCFC`, sem contorno, sem sombra, sem caixa de fundo |
| Posição | centrado no quadro (frase, fatia, moral) ou centrado no objeto que nomeia (duelo) |
| Quantidade | um texto falado por vez. Rótulos fixos podem conviver com ele |
| Frase falada | entre aspas tipográficas (“ ”), de 4 a 7 palavras |
| Entrada | **digitação com a letra crescendo**, da esquerda pra direita, cada letra nasce pequena e chega ao tamanho cheio; frase inteira em 0,3 a 0,9 s |
| Saída | some em 0,1 s, 0,4 s antes da próxima |
| Moral | 2 linhas centradas, entrelinha 2,4% da altura, digitada linha a linha (0,4 s cada), no preto vazio |
| Rótulos fixos | já na tela no quadro 0, parados até o fim (ou acendem com a cena, ref2) |

A narração **não vira legenda** (ref3). O texto na tela é rótulo, fala de personagem ou moral; nunca transcrição corrida.

### Movimento

| O quê | Como (medido) |
|---|---|
| Câmera | parada. Única exceção: um deslize lateral de ~1 s pra levar a uma 2ª cena (ref4, 19,5 a 20,5 s): tudo corre junto pra um lado, o que sai acelera, o que entra freia |
| Chegada de personagem | entra pela borda e freia longo até parar: 1,9 a 2,7 s de desaceleração |
| Saída | arranca devagar e acelera (2 s) |
| Ciclo de ação | compasso fixo de 1,2 a 1,4 s (barra, tiro, arremesso); quem persiste nunca sai do compasso |
| Quem desiste | começa **mais rápido** que o constante e vai alongando (0,75 → 0,8 → 0,95 → 1,35 → 1,7 s), trava e para de vez (ref1) |
| Quem não age | se mexe sem resultado (mira girando, ref2) ou fica totalmente parado (ref3, o 93%) |
| Ação rápida | flecha e bola cruzam em 0,1 a 0,15 s: quase um corte |
| Mudança de cor | instantânea no impacto (branco → vermelho ou verde) |
| Abertura/fecho | sem nada (refs 1, 3, 4) ou fusão do preto de 0,3 a 0,4 s nas duas pontas pra loop (ref2) |

### Ritmo

- Um evento a cada 1,2 a 1,4 s nas formas A e B; um personagem novo a cada 4 a 5 s na forma C.
- Depois da virada, **nada novo**: 3 a 4 s de cena parada (A, B) ou a moral (C).
- Maior trecho sem evento novo: o fecho (3,3 a 3,7 s).

## 4. Som

- **Forma A sem fala**: ou música o tempo todo com uma parte mais forte que entra **na virada** (ref1, de -20 para -7 dB
  exatamente quando o cinza trava), ou silêncio com um efeito curto em cada ação e a música entrando só **depois do acerto**
  (ref2, 0,6 s depois).
- **Forma B**: narração contínua com música por baixo; a imagem ilustra a tese, não as palavras (ref3).
- **Forma C**: uma voz por personagem (o tom medido muda a cada fala), volume baixando quando a cena esvazia (ref4, -30 dB
  em 17 a 20 s), trilha subindo na moral (-13 dB).
- O som das referências foi medido, não ouvido: o tipo de cada efeito fica para calibrar no 1º vídeo (seção 12).

## 5. Os gatilhos: o que na fala/tese chama cada recurso

| Quando a tese/fala... | A tela faz | Prova |
|---|---|---|
| opõe dois comportamentos ("motivação x disciplina") | forma A: dois personagens idênticos, o nome de cada um em cima ou embaixo | ref1 0 s, ref2 0 s |
| diz que poucos chegam lá | forma B: fileiras com a porcentagem, a de cima parada | ref3 0 s |
| compara o que cada um quer | forma C: personagem chega e fala o desejo; o desejo é o que está na frente dele | ref4 2,1 / 6,3 / 11,4 / 15,9 s |
| fala de constância | o personagem certo num compasso cravado, com cor acesa e halo | ref1 |
| fala de "começar forte e largar" | o personagem cinza começa mais rápido e vai desacelerando até parar | ref1 0,35 a 8,4 s |
| fala de errar e tentar de novo | cada erro fica vermelho na tela e chega mais longe que o anterior | ref2 1,3 / 2,7 / 4,1 s; ref3 |
| fala de pensar demais / adiar | movimento sem resultado (mirar sem atirar) | ref2 |
| chega na frase de virada | evento de cor (verde, desistência) + a música muda de parte | ref1 7,6 s, ref2 5,5 s, ref3 6,3 s |
| muda de ato | um sinal muda (semáforo vermelho → amarelo → verde) e a cena esvazia | ref4 14,9 a 18,7 s |
| inverte a perspectiva | deslize de câmera pra uma cena vazia com um personagem só | ref4 19,5 s |
| fecha com a lição | apagão e moral em 2 linhas, segurada 3 s ou mais | ref4 22,7 s |
| não diz nada novo | a cena segue no ciclo, sem texto novo | todas |

## 6. O que é assinatura dos criadores (não vira regra)

- Logo "VA", "@valueanimate" impresso em pinos, carros e helicóptero e o "@" translúcido que aparece no meio do vídeo
  (marca anti-cópia).
- Logo "D" colorido e "@profithuman" (ref1), a fonte tipo Arial em caixa mista da ref1.
- Os objetos específicos: Lamborghini, G-Wagon, helicóptero, boliche, barra fixa, a palavra "SUCCESS" no alvo.
- O inglês, o discurso motivacional de terceiro da ref3.
- A moral da ref4 ("Chasing someone else's life...").

Servem de exemplo de **tipo** de metáfora; a cena de cada vídeo nasce da tese dele.

## 7. Materiais: o que o modelo faz e o que pede

**Faz sozinho:** cenário, personagens e objetos em vetor; rótulos, frases e moral; halo e reflexo; trilha e efeitos
(banco livre ou `kit/audio_ia.py`); vozes de personagem por `kit/voz.py` quando o dono aprovar o gasto.

**Pede ao criador:** a tese em uma frase; a voz (a dele, ou o ok pra vozes geradas); o @ da marca d'água. O que faltar vira
`materiais/ilustrations01/<AAAA-MM-DD-tema>/PEDIDO.md`, nunca um buraco no vídeo.

## 8. A identidade visual própria do modelo

Tirada das referências, não da paleta do dono nem do cliente:

- **Palco preto** `#000000` e **branco giz** `#FCFCFC`; objetos em **cinza** `#363636` a `#9B9B9B`.
- **Código de cor fixo**: vermelho `#FD0000` = errou/pare; verde `#00FB10` = acertou/siga; azul aceso `#08A1DF` (luz
  `#37CAFB`) = quem persiste; âmbar `#FDF201` = transição. Cor viva só como evento, sempre com halo.
- **Letra**: geométrica arredondada em caixa alta, espaçada, pequena (1,3% da altura). Na casa: **Quicksand** (Google Fonts,
  tem acento) peso 500 a 600 é a mais próxima disponível; confirmar no 1º vídeo pondo o quadro lado a lado com
  `analise/ref4_q/7.25.png`.
- **Aspas tipográficas** em toda fala de personagem.
- **Reflexo** sob quem pisa no chão.
- **Marca d'água** do perfil que publica: centro, y 89,5 a 92,5%, ~6,5% da largura, cinza `#363636`. O conteúdo é do perfil;
  só a posição e o tom são do modelo.

## 9. Como produzir com o que a casa tem

- **Remotion + SVG desenhado no código.** Precedente direto: `modelos/youtubedark01/aplicacoes/2026-10-06-youtubedark-hoje/src/` (boneco e cenários
  vetoriais animados, `Boneco.tsx`, `Cenarios.tsx`). Peças a montar como componentes:
  - `Palco`: fundo preto 1080x1920, linha de chão invisível, marca d'água.
  - `Reflexo`: o filho espelhado (`scaleY(-1)`), `blur`, opacidade 0,15 a 0,25 e máscara em degradê de ~9% da altura.
  - `Halo`: círculo com `radial-gradient` da cor viva a 10 a 25%, raio 25 a 47% da altura.
  - `FraseDigitada`: letras separadas, cada uma com `scale` 0,3 → 1 e opacidade 0 → 1, atraso de 15 a 30 ms por letra.
  - `Rotulo`: texto fixo centrado no objeto.
  - `ciclo(t, periodo)`: função que devolve a fase da ação; o personagem que desiste usa período crescente.
  - `Chegada` / `Saida`: posição com desaceleração longa (1,9 a 2,7 s) e aceleração (2 s).
  - `DeslizeCamera`: um grupo inteiro anda de lado em ~1 s.
- Sombreado de volume com `linearGradient`/`radialGradient` do SVG, nunca imagem raster no personagem (precisa animar).
- **Kit** (`kit/`): `gerar.py` só pra referência de desenho de um objeto difícil (gerar, olhar e
  redesenhar em SVG); `audio_ia.py efeito` pros efeitos de ação (tiro, impacto) e `trilha`/`plano` pra música com a parte
  forte entrando no segundo da virada; `voz.py` pra vozes de personagem.
- Conferência por medição, como nas decupagens: tirar quadros cheios do render com ffmpeg e medir cor, posição e o topo do
  personagem quadro a quadro (os picos do ciclo).

## 10. O que pedir ao criador (antes de começar)

1. A **tese em uma frase** (ex.: "quem espera ter vontade não começa"). Se não tiver, a gente tira da gravação dele.
2. A **forma** (A, B ou C) ou o ok pra proposta: o modelo propõe 3 metáforas de uma linha, ele escolhe uma.
3. A **voz**: a dele narrando, ou vozes geradas por personagem (com gasto aprovado).
4. O **@** da marca d'água.

## 11. Conferência antes de entregar

- [ ] Nenhum corte seco. No máximo um deslize de câmera.
- [ ] Fundo `#000000` medido no render; cor viva só nos eventos; halo em tudo que está aceso.
- [ ] Quadro do render lado a lado com o quadro da referência da mesma forma: zonas, tamanhos e letra batem (seção 3).
- [ ] Letra entre 1,25 e 2% da altura; um texto falado por vez; aspas tipográficas nas falas.
- [ ] Tempo de leitura: cada frase fica pelo menos 1 s + 3 palavras/s depois de terminar de digitar.
- [ ] O ciclo do personagem constante não sai do compasso nenhuma vez (medir picos como na decupagem).
- [ ] A virada cai entre 60 e 76% da duração e é um evento de cor; a música muda junto.
- [ ] Depois da virada, 3 s ou mais sem nada novo (ou a moral).
- [ ] Nada importante abaixo de 80% da altura nem colado na borda direita (botões do Reels); a marca d'água pode ficar a 90%.
- [ ] Peça só aparece depois da entrada (`t >= t0`), nada visível no quadro 0 que devia entrar depois.
- [ ] Texto público passou pelo `/humanizer`; fala do dono na tela com as palavras como ele disse.
- [ ] Nada dos criadores originais: sem "VA", sem @ deles, sem as cenas deles copiadas.

## 12. Como aplicar no vídeo-teste comum

O dono grava **um vídeo de ~30 s falando para a câmera** (o roteiro está em `../../teste-comum/ROTEIRO.md`), editado em todos os modelos. Este modelo é 0% rosto, então:

1. **Só a voz dele entra, como narração contínua** (o jeito da ref3). O rosto não aparece em nenhum quadro.
2. **A tese da fala vira UMA metáfora** em plano único. Primeiro transcrever (whisper, conferindo trecho rápido), achar a
   frase-tese e a frase de virada dele, e escolher a forma:
   - fala que opõe dois jeitos de agir → **A (duelo)**;
   - fala com número ou "a maioria / poucos" → **B (escada)**;
   - fala com vários exemplos ou passos → **C (corrente)**, que é a que segura a fala mais longa: **um personagem por ideia** dele
     (4 a 6 chegadas, uma a cada 5 a 7 s).
3. **As palavras dele viram os textos da tela**: os nomes do duelo/fatias saem das palavras que ele usa; na forma C cada
   personagem "diz" um trecho curto da fala dele (4 a 7 palavras, literal, entre aspas), digitado no instante em que a voz
   diz aquilo. Nada de legenda corrida.
4. **A virada da animação cai na frase de virada dele**, onde ela estiver (o alvo é 60 a 76% do vídeo; se a virada da fala
   cair fora disso, vale a fala). Se a fala não tiver virada, a frase mais forte faz o papel.
5. **A última frase dele vira a moral** em 2 linhas no preto, segurada 3 s ou mais.
6. **~30 s é perto da maior referência (27 s)**: o ciclo continua durante as pausas dele, e a história pode usar **um**
   deslize de câmera para uma 2ª cena (o recurso da ref4), nunca corte.
7. **Som**: voz dele limpa na frente; trilha ~16 dB abaixo da voz (alvo medido na casa), com a parte mais forte entrando na
   virada; um efeito curto em cada ação do ciclo.

A fala entra inteira: ~30 s já é a duração nativa do estilo, e o site compara todos os modelos sobre a mesma gravação.

## 13. Aplicações

| Vídeo | Forma | Saída |
|---|---|---|
| Vitrine dos modelos (2026-10-12), a fala comum de 30 s, só a voz | C, corrente com virada: bonecos idênticos chegam com a mesma tela crua e cada um sai editado de um jeito; virada verde em "outros modelos de edição" (72%); moral COMENTA “EDIÇÃO” | `modelos/ilustrations01/exemplos/vitrine-ilustrations01.mp4` (hardlink em `exemplos/`); projeto e notas no `LEIA.md` de lá |

Aprendido no 1º vídeo (vale pros próximos):
- **Fonte**: a das frases das refs é a **Didact Gothic** (I com serifa, O redondo), não a Quicksand. Corpo 34 px a 1920
  (maiúscula ~24 px; na ref4 medida 22 a 23 px), espaçamento 0,1 em, peso único.
- Componentes prontos em `moldes/ilustrations01/src/Reel.tsx`: `Digitado` (digitação com a
  letra crescendo), `Palito` (andar com a fase presa à distância, freio longo, olhar pra cima), `Tela` (varredura que
  edita), reflexo (cópia espelhada + desfoque 4 px + máscara de 173 px), `Halo`, chegada `posX` com freio de potência 1,8.
- Som sintetizado (`scripts/som.py`): pulso a cada 0,73 s ancorado para cair um tempo na virada; trilha -16 dB da voz
  antes da virada e ~-9 dB depois; um efeito por ação do ciclo. Checador de frases em `scripts/checar.mjs`.

## 14. Em aberto

- O som das 4 referências foi medido, não ouvido: efeitos, vozes da ref4 e o resto da narração da ref3 (só ~3 s
  transcritos) ficam para calibrar no 1º vídeo.
- Fonte: resolvida no 1º vídeo (Didact Gothic, ver Aplicações).
- Componentes da seção 9 nasceram no 1º vídeo (ver Aplicações); ainda moram no projeto dele, não numa pasta comum.
