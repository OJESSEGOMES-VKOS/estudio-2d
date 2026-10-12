# ref2: Overthinker x Doer (arco e flecha)

Quadros cheios em `ref2_q/` (0.30, 1.80, 4.40, 5.80, 8.40). Barras e flechas medidas a 5 qps (segmentos claros por linha
e pixels vermelhos/verdes); disparo conferido a 15 qps. Vídeo em 720x1280.

## 1. Ficha

| | |
|---|---|
| Formato | 9:16, 720x1280, 30 qps |
| Duração | 8,59 s |
| Idioma | sem fala |
| Assunto | quem pensa demais nunca atira; quem faz erra, chega cada vez mais perto e acerta |
| Quem fala | ninguém. Três rótulos fixos |
| Rosto | 0% (não há pessoa, só os arcos) |
| Cortes | nenhum: 1 plano |
| Trilha | não no começo: chão -44,7 dB (silêncio) com um efeito a cada disparo; música só depois do acerto |
| Criador | @valueanimate (logo "VA") |

## 2. Linha do tempo

| Hora | Tela | Fala | Gatilho |
|---|---|---|---|
| 0,0 a 0,4 | Tudo acende do preto (fusão de 0,4 s): alvo "SUCCESS" no alto, 3 fileiras de barras correndo, 2 arcos com flecha, rótulos | sem fala | Abertura: o problema inteiro na tela |
| 0,4 a 1,3 | "Overthinker" gira o arco pra lá e pra cá (mirando). "Doer" puxa | sem fala | |
| 1,3 | Doer atira. Flecha branca voa em ~0,1 s e **crava na fileira de baixo**, fica **vermelha** e é levada pela barra pra esquerda (até 2,5 s) | | Efeito sonoro (-21 dB) no disparo |
| 1,4 a 2,7 | Overthinker segue mirando. Doer recarrega | | |
| 2,7 | 2º tiro: passa a fileira de baixo e crava na do **meio** (vermelha, levada pra direita até 3,4 s) | | Efeito sonoro |
| 4,1 | 3º tiro: passa duas fileiras e crava na **de cima** (vermelha, levada pra esquerda até 5,0 s) | | Efeito sonoro |
| 5,5 a 5,6 | 4º tiro: passa as três e **acerta o centro do alvo**. Flecha e alvo ficam **verdes**, halo verde acende | | Efeito sonoro. A virada em 65% do vídeo |
| 5,6 a 7,3 | "@valueanimate" translúcido ao lado do alvo | | Marca anti-cópia |
| 6,1 a 8,2 | Música entra forte (-9 a -15 dB). Flecha verde fica no alvo; Overthinker continua mirando sem atirar | | A música só chega depois do acerto |
| 8,2 a 8,59 | Tudo apaga pro preto (0,3 s) com os dois arcos já de volta à posição inicial | | Fecho em loop |

## 3. Receita visual medida

**Layout (de cima pra baixo).**

| Peça | y (% da altura) | x | Tamanho |
|---|---|---|---|
| Rótulo "SUCCESS" | 15,4 a 16,7% | centro | letra 18 px (1,4%), largura 16% |
| Alvo (disco com anéis, visto de cima em perspectiva) | 18,4 a 24,1% | centro (40,7 a 59,2%) | 18,6% da largura, 5,8% da altura |
| Fileira de barras 1 | 37,5% | quadro todo | traço de 5 px |
| Fileira 2 | 44,4% | | 6 px |
| Fileira 3 | 51,3% | | 9 px (mais perto, mais grossa) |
| Arcos | 65,4 a 74,8% | centros em x 33% e 66% | 23,8% da largura, 9,3% da altura cada |
| Rótulos "OVERTHINKER" e "DOER" | 78,9 a 80,2% | centrados embaixo de cada arco | letra 17 px (1,3%) |
| Logo "VA" | 89,9 a 92,3% | centro | 6,5% da largura |

**Tipografia.** Caixa alta, geométrica de traço fino a médio, espaçamento entre letras largo, branco `#FCFCFC`, sem
contorno. Altura de letra 17 a 18 px (1,3 a 1,4% da altura). Acendem com a cena e apagam com ela.

**Paleta medida.**

| Cor | Hex | Onde |
|---|---|---|
| Fundo | `#000000` | |
| Branco | `#FCFCFC` / `#FEFEFE` | rótulos, alvo, arcos, flecha em voo |
| Cinzas | `#E9E9E5` a `#565555` | barras (degradê de luz no comprimento) |
| Vermelho erro | `#CC030E` / `#CA0E1C` | flecha que cravou numa barra |
| Verde acerto | `#04E509`, `#05B205`, luz `#88FF8C` | flecha no alvo, anéis do alvo (`#E3FDE4`) |
| Halo verde | `#071307` a `#033904` | névoa de ~30% da largura e 26% da altura em volta do alvo |
| Halo branco | `#121212` a `#212120` | brilho fraco atrás do alvo desde o começo |
| Logo | `#343436` | rodapé |

**Elementos gráficos.**
- Barras: segmentos de 234 px (32,5% da largura) com vãos de 121 px (17%), cinza claro com degradê, as pontas somem perto
  das bordas do quadro (x < 8% e x > 92%).
- Arcos recurvos brancos com sombreado suave, corda fina, flecha branca apontada pra cima.
- Alvo: disco grosso branco com anéis pretos, em perspectiva (elipse), halo branco suave atrás.
- Sem reflexo no chão.

**Movimento.**
- Fileiras andam sem parar, **cada uma num sentido**: de cima pra esquerda a ~390 px/s (54% da largura por segundo), a do
  meio pra direita a ~450 px/s, a de baixo pra esquerda a ~250 px/s. A do meio acelera depois de 6 s.
- Disparos a cada **1,4 s** (1,3 / 2,7 / 4,1 / 5,5). A flecha cruza a tela em ~0,1 s (2 a 3 quadros): é quase um corte.
- Flecha que erra **crava e vira vermelha** no impacto e segue com a barra até sair pela borda.
- Overthinker: o arco gira devagar de um lado pro outro, sem parar e sem soltar, o vídeo inteiro.
- Câmera parada.

**Transições.** Só a fusão do preto no começo (0,4 s) e pro preto no fim (0,3 s).

**Ritmo.** Um evento a cada 1,4 s até o acerto; depois 3 s parados com música.

**Som.** Silêncio de fundo (-45 dB). Cada tiro tem um efeito curto (pico -20 a -23 dB caindo em ~0,6 s). Música forte só
a partir de 6,1 s, 0,6 s depois do acerto. O começo traz o rabo da música (-24 dB caindo), sinal de emenda de loop.

## 4. Gatilhos

- **Dois jeitos de agir** → dois objetos iguais lado a lado com o nome embaixo.
- **"Errar faz parte"** → cada erro crava mais longe que o anterior (fileira 3, depois 2, depois 1): o erro mostra avanço.
- **Erro** → vermelho no instante do impacto. **Acerto** → verde com halo.
- **Quem não age** → movimento sem resultado (mira girando), nunca parado.
- **A virada** → silêncio até o acerto, música depois.

## 5. Assinatura do criador (não vira regra)

Logo "VA", "@valueanimate", a palavra "SUCCESS" no alvo, o inglês.

## 6. Materiais

Nada do criador. Arcos, flechas, barras e alvo desenhados em vetor. Efeito de disparo e trilha: banco livre ou gerados.

## 7. O que não deu pra ver

O tipo exato do efeito sonoro (corda, zunido, impacto) não foi ouvido, só medido. Não dá pra afirmar se o vídeo foi pensado
para loop perfeito, mas o começo e o fim batem (arcos na mesma posição, fusão nas duas pontas).
