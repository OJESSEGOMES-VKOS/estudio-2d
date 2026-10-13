# anunciocanvas01: anúncio em motion no canvas infinito

Criado em 2026-10-10, a pedido do Jessé: **o anúncio em motion do `anunciomotion01` posto no canvas infinito do `estilomestre02`/`03`**. É um anúncio que usa o canvas, não um documentário em motion. O estilomestre continua sendo o documentário de narrativa; este modelo prova que a câmera do canvas serve a outro gênero.

O modelo nasceu sem referências de terceiros: a base eram os dois modelos da casa.

## v2 (2026-10-10): a v1 foi recusada por "muito poluída"

O Jessé mandou 2 referências (`referencias/`; folhas em `analise/`):
- **ref1** (`SaveClip…`, 16:9, 20 s): anúncio de pacote de edição (Cortex). Preto e dourado, um objeto herói por vez (notebook, celulares, pasta 3D), anéis concêntricos finos. Na palavra de dor o ambiente inteiro vira vermelho.
- **ref2** (`snapgram…`, 9:16, 26 s): fundo branco, uma cor de destaque (verde), muito espaço vazio.
  - Texto pequeno, com uma palavra em serifada itálica na cor.
  - Ícones que se acumulam: hexágonos em árvore, pílulas que se empilham.
  - Moldura de visor nos cantos.

**As duas fazem o oposto do que a v1 fez.** Viram regra e **valem acima das seções 1 a 3 abaixo**, onde contradizem:

1. **Uma ideia por quadro.** As estações ficam longe (2000 px de lado, 2700 por linha) e a vizinha nunca divide a tela. A câmera fica mais afastada (1180) para a cena ter ar em volta.
2. **A viagem é um chicote:** 2 a 3 quadros de borrão de movimento (blur pela velocidade da câmera), sigma 0,06 + dist/90000 s. Entre um chicote e outro a câmera quase para, com a órbita pela metade.
3. **O chicote cai junto com a 1ª palavra da cena que chega.** As cenas animam na palavra; chegar antes é chegar numa estação vazia. A cena que sai segura o quadro até lá.
4. **Nada de enfeite.** Saíram o trilho, as partículas, as mensagens e selos soltos no fundo, as luzes por estação e a borda esfumada. A cena do gancho foi de 9 para 4 balões.
5. **O clima é o ambiente inteiro:** fundo liso com uma mancha suave da cor do momento. Fica claro nas cenas claras, escuro e violeta na marca, vermelho na dor, azul na noite. A cor troca dentro do chicote, misturando as duas estações mais perto da câmera. A ilha clara saiu.

## v3 (2026-10-10): a v2 ficou "robótica e previsível"

O Jessé pediu movimento fluido, quase aleatório e bem suave. Os itens 2 e 3 da v2 foram trocados (código em `modelos/anunciocanvas01/aplicacoes/2026-10-10-anuncio-canvas-marcai/src/`; a v2 ficou em `versoes/v2/`):

1. **Nada de grade.** Cada estação nasce numa direção sorteada a partir da anterior: 1900 a 2300 px de distância, profundidade entre -350 e +350, giro de até 7 graus. O sorteio é fixo, então o filme sai sempre igual. Os 3 atos só puxam o rumo geral (dor para a direita, virada para baixo, produto de volta, fecho descendo) e nenhuma estação fica a menos de 1800 px de outra.
2. **A viagem volta a ser longa e macia**, cada uma com a sua duração: sigma 0,26 + até 0,16 sorteado + dist/25000 s. Ela faz **curva**: um desvio lateral (até 35% da distância, para um lado ou para o outro) e de profundidade, que cresce antes do meio e volta depois.
3. **Entre as viagens a câmera não para: flutua.** A deriva vem de senos de períodos que nunca se repetem juntos, em x, y, z, inclinação e giro. Ninguém consegue prever o próximo movimento.
4. **O borrão virou só um véu** no pico da viagem (no máximo 7 px). O chicote saiu.
5. **Fica da v2:** uma ideia por quadro, nada de enfeite, o ambiente que muda de cor e a chegada junto com a 1ª palavra da cena (agora com até 0,02 s de antecedência).

## v4 (2026-10-10): "algumas coisas não estão dando pra ler"

Conferi o início e o fim de cada uma das 18 cenas (`conferencia/leitura-v4*.png` no projeto). O texto saía pela lateral no fim das cenas porque a viagem tem uma cauda longa: a curva de erf já anda 2 sigma antes do meio. Regras:

1. **A viagem inteira cabe no silêncio entre as falas.** A câmera só sai 0,15 s antes de a última palavra da cena terminar e já chegou 0,1 s depois da 1ª palavra da próxima. Sigma = vão / 4 (os ±2 sigma visíveis dentro do vão), nunca abaixo de 0,1 s e nunca acima do sorteio da v3. Fala sem pausa vira viagem rápida; o texto não é cortado.
2. **A curva fica dentro da viagem:** os dois degraus do desvio a ±0,6 sigma, com largura 0,6 sigma.
3. **Deriva menor:** 18/14 px em x/y (era 38/30), giro de deriva 0,6 grau e giro das estações até 3 graus (era 7). O texto de canto fica no quadro.
4. **Conferência obrigatória neste modelo:** para cada cena, um quadro logo depois da 1ª palavra e um logo antes da viagem seguinte. Os dois têm que mostrar todo o texto dito.

## v5 (2026-10-10): sem estações, a estrutura que vale

A v4 ainda tinha "aquele negócio seco" entre as cenas e dava a impressão de "uma página super grande com cada cena num pedaço e a câmera indo de um pro outro, numa grid". A v5 trocou a estrutura (`src/Canvas.tsx`; o `Anuncio.tsx` com estações ficou só como histórico em `versoes/v4/`). **Os itens das v1 a v4 sobre estação, viagem e chicote deixam de valer. Ficam:** uma ideia por vez, nada de enfeite, fundo que muda de cor e conferência de leitura.

1. **Não existe cena nem estação.** Cada elemento (frase, pílula, balão, celular, cartão, número) é um objeto solto no canvas, com lugar próprio (x, y em px de tela em volta do ponto da frase), profundidade própria (z; o que fica atrás desfoca) e um leve giro. Ele aparece no tempo da palavra e tem a entrada dele (desfoque com deslize, mola).
2. **A câmera é um caminho de keyframes, um por frase, no meio dela.** A interpolação é Hermite com tangente pelos vizinhos (o "auto bezier" do After Effects), e no keyframe a velocidade cai para 35%: é o **easy ease**. A câmera desacelera enquanto a frase é lida e acelera entre as frases, mas nunca para.
3. **O rumo vira aos poucos:** sorteio fixo de até ±43 graus por frase, passos de 460 a 700 px. Por cima, como o wiggle do After Effects, senos de períodos que não se repetem juntos: deriva de 14/11 px em x/y, respiro de distância, giro e inclinação 3D lenta, que fazem a paralaxe aparecer.
4. **Os elementos de uma frase ficam em volta do keyframe dela.** Chegam pelo lado para onde a câmera vai, passam pelo centro enquanto são lidos e ficam para trás.
5. **Saída:** entre 0,45 e 1,05 s depois da frase acabar, o elemento desfoca e some. Assim a frase velha não fica sobre a nova nem sobre um fundo de outra cor. O fecho (marca) fica até o fim.
6. **O fundo muda de cor no tempo:** dissolve de 0,5 s começando 0,35 s antes da 1ª palavra da frase.
7. **Escrever o anúncio direto em elementos.** A v5 reescreveu as 18 cenas do anunciomotion01 como uma coreografia de elementos (`Coreografia` no Canvas.tsx), aproveitando as peças do `ui.tsx`.

## v6 (2026-10-10): a mistura

Pedido do Jessé: "se você mesclar uma aleatoriedade entre esse (v5), o v4, o v3 e o v2, vamos conseguir o resultado que estou dizendo". A base continua a v5 (elementos soltos, câmera em keyframes). O que muda é que cada passagem de uma frase para a outra sorteia, com sorteio fixo, um de três tipos (`TIPOS` no Canvas.tsx):

| Tipo | Vem de | Passo | Como anda |
|---|---|---|---|
| **fluxo** | v5 | 460-700 px | desliza contínua, easy ease 35% no keyframe da frase; os elementos passam pelo quadro |
| **curva** | v3/v4 | 1000-1300 px | keyframe extra no meio do vão, desviado 30% do passo para um lado (o arco), recuando um pouco. A frase seguinte assenta mais (easy ease 12%), com cara de chegar numa composição |
| **chicote** | v2 | 1600-1900 px | a câmera segura (ease 0) até a fala acabar e salta no vão entre as frases em no mínimo 0,28 s, com borrão pela velocidade (acima de 2600 px/s, até 20 px). Rumo vira mais (até ±69 graus) |

Regras do sorteio:
- 40% fluxo, 30% curva, 30% chicote;
- nunca o mesmo tipo 3 vezes seguidas;
- a virada do anúncio (o produto aparece) é sempre chicote; a passagem para o fecho é sempre curva.

Ainda das referências, para as próximas cenas escritas direto neste modelo:
- texto menor;
- uma palavra em serifada itálica na cor da marca;
- elementos que se acumulam no quadro em vez de trocar;
- anel fino e glow como único adorno.

As cenas do Marcaí vieram prontas do anunciomotion01 e ainda são mais cheias que isso.

- **Implementação de referência:** `modelos/anunciocanvas01/aplicacoes/2026-10-10-anuncio-canvas-marcai/`. O motor do canvas está em `src/Mundo.tsx` e a montagem em `src/Anuncio.tsx`.

## 1. A ideia central

- **Do `anunciomotion01` vem tudo do anúncio:**
  - não há apresentador: a narração de venda conduz e cada frase vira um objeto na tela, preso à palavra;
  - os três atos (dor, virada e produto, chamada);
  - o repertório de cenas: pílula, risco vermelho, glitch, celular com o app, notificações empilhadas, número que conta, botão que destrava, marca se montando;
  - a paleta: uma cor de marca com brilho, vermelho só na dor.
- **Do `estilomestre03` vem a câmera:**
  - um mundo 3D só, sem corte nenhum;
  - cada cena é uma estação; a câmera nunca para e acompanha o elemento da vez;
  - órbita, inclinação na curva e respiro de mão;
  - nada aparece nem some por horário: o que entrou fica, e a estação some pela distância.
- **O que é deste modelo (e o separa do documentário):** a tabela abaixo.

| | Documentário (estilomestre) | Anúncio (este) |
|---|---|---|
| Tempo por estação | ~6 s | 1 a 3 s (uma cena do anúncio por estação) |
| Distância entre estações | 1500 px de lado, 2250 por linha | ~1180 de lado, ~1750 por linha: na viagem sempre tem um pedaço da cena que sai e da que chega no quadro (tela vazia mata anúncio) |
| Viagem | 0,28 + dist/10000 s | 0,2 + dist/13000 s (mais curta e mais rápida) |
| O que liga as estações | fio vermelho de investigação | **trilho da marca**: linha de luz em arco com um pulso branco correndo na ponta. Vermelho nas cenas de dor, cor da marca depois da virada |
| Fundo | painéis de foto assados, multidão | o escuro é o próprio mundo (parede com manchas da cor da marca e listras diagonais) + uma luz por estação lá atrás (fria na noite, vermelha na dor, da marca no produto) |
| Respiro claro | não tem | **ilha clara**: a cena clara vira uma placa de luz com cantos arredondados e bordas esfumadas, flutuando no canvas escuro |
| Cenário entre as camadas | fotos reais nas bordas | pedaços do mundo do produto soltos no fundo, nas bordas e desfocados: na dor, mensagens perdidas; depois da virada, o selo da marca |
| Ar | poeira e brasas | partículas de luz na cor da marca |

## 2. A geografia é o roteiro

Os três atos do anúncio viram a forma do caminho no canvas:

1. **Linha 1, a dor:** da esquerda para a direita, com luz fria e vermelha e o trilho vermelho.
2. **O mergulho na virada:** uma descida vertical até a cena da marca, com o trilho já na cor da marca. É a única viagem vertical antes do produto e marca a troca de clima.
3. **Linhas 2 e 3, o produto:** em zigue-zague, com luz da cor da marca e ilhas claras alternando com cenas escuras (a proporção ~70/30 do anunciomotion01).
4. **Linha 4, o fecho:** nichos, botão e a marca se montando por último.

## 3. Regras de montagem

1. **Uma cena do anúncio é uma estação.** A cena continua escrita como no anunciomotion01: um quadro 1080x1920 com as animações presas às palavras (`seq`, `w`).
2. **A cena escura não desenha fundo.** O `Fundo` só pinta a cena clara (a ilha). A luz e o escuro vêm do mundo.
3. **Nada de faixa de tela cheia.** Degradês de borda a borda (o escurecido em cima e embaixo do tour do app, o rodapé do painel) viram retângulo no canvas. Ou saem, ou viram degradê redondo atrás do texto.
4. **Borda esfumada retangular em toda estação** (`Borda`). Uma elipse comeria o texto do topo e do rodapé, que o anúncio usa.
5. **A camada da cena fica nítida (z 0).** A luz fica a z -700 e o cenário entre -460 e -700, com desfoque pela distância. Isso dá a paralaxe.
6. **Transições do anunciomotion01 não entram** (corte seco, borrão, íris): a viagem é a transição. O ritmo vem da troca de cena a cada 1 a 3 s e do pulso do trilho.

## 4. Som

- O primeiro vídeo usou a mixagem pronta do anúncio original: mesma voz, trilha e efeitos, e as cenas começam nos mesmos tempos.
- Próximo passo, quando valer: trocar o whoosh de transição pelo sopro feito sob medida para cada viagem, como no estilomestre03 (`tools/horarios.py`).

## 5. Desempenho (medido)

- 20 quadros de conferência em escala 0,4: 160 s, contando a abertura do navegador a cada quadro.
- Render final com `--concurrency=2`: a v1 levou 12 min 14 s; a v2 levou 1 min 53 s. A diferença vem das máscaras de borda, das camadas desfocadas e das partículas que saíram. Tela limpa também é render rápido.
- Só 2 ou 3 estações são desenhadas por quadro (as outras ficam longe demais e nem entram).

## 6. Material

- **Do anunciomotion01:** narração, prints reais do produto e logo da marca. Nunca inventar tela, número de cliente ou taxa.
- **Roteiro:** passa pelo /humanizer.

## 7. Aplicações

| Data | Vídeo | Notas |
|---|---|---|
| 2026-10-10 | `modelos/anunciocanvas01/exemplos/marcai-anuncio-canvas.mp4` (44,4 s) | v1: o anúncio do Marcaí (produto fictício), mesmas 18 cenas e voz do anunciomotion01, em 18 estações. **Recusada: muito poluída.** Código em `versoes/v1/` |
| 2026-10-10 | `modelos/anunciocanvas01/exemplos/marcai-anuncio-canvas-v2.mp4` (44,4 s) | v2: uma ideia por quadro, chicote com borrão, ambiente que muda de cor, sem enfeite. Recusada: robótica e previsível. Código em `versoes/v2/` |
| 2026-10-10 | `modelos/anunciocanvas01/exemplos/marcai-anuncio-canvas-v3.mp4` (44,4 s) | v3: estações espalhadas, viagens em curva com duração própria, câmera que flutua. Render de 1 min 38 s. Pedido de ajuste: texto que não dava pra ler. Código em `versoes/v3/` |
| 2026-10-10 | `modelos/anunciocanvas01/exemplos/marcai-anuncio-canvas-v4.mp4` (44,4 s) | v4: viagem dentro do silêncio entre as falas, deriva e giro menores; conferido o início e o fim das 18 cenas. Pedido de ajuste: transição seca e cara de grid. Código em `versoes/v4/` |
| 2026-10-10 | `modelos/anunciocanvas01/exemplos/marcai-anuncio-canvas-v5.mp4` (44,4 s) | v5: sem estações; elementos soltos no canvas; câmera em keyframes com auto bezier e easy ease, rumo que vira aos poucos e wiggle macio. Render de 1 min 25 s. Pedido: mesclar com v4, v3 e v2. Código em `versoes/v5/` |
| 2026-10-10 | `modelos/anunciocanvas01/exemplos/marcai-anuncio-canvas-v6.mp4` (44,4 s) | v6: a base da v5 com passagens sorteadas entre fluxo, curva e chicote. Aguardando o olho do Jessé |
