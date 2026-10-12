# Plano: vitrine no ilustrations01

Modelo: `../../modelos/ilustrations01/MODELO.md` (metáfora em vetor no preto, 0% rosto). Entra só a voz
(`public/voz.wav`, 30,36 s). Saída 1080x1920, 30 qps, 30,33 s (910 quadros), um plano só, câmera parada.

## Forma: C, corrente com virada (ref4)

Por quê: a fala tem várias ideias em sequência (vários modelos, você vê só um, duas prévias, outros modelos, você) e
dura 30 s, perto da ref4 (27 s), que é a única forma medida que segura fala longa. O duelo (A) só conta "cru x editado",
e a fala não opõe dois jeitos de agir; a escada (B) pede número de "maioria / poucos", e o "100%" não é fatia.

**A metáfora: a fila do mesmo vídeo.** Bonecos palito idênticos (os modelos) chegam um depois do outro, cada um
segurando acima da cabeça a mesma tela cinza com ▶ (o vídeo cru). Quando o boneco para, uma linha de luz varre a tela e
ela sai editada, cada uma de um jeito (a mesma pessoa, enquadrada e escrita diferente). O primeiro boneco é este vídeo:
a tela dele mostra um palito no preto, sem rosto. No fim chega mais um boneco igual, com a tela ainda crua: é você.
A cor é o juiz: tudo branco e cinza até a virada; na virada todas as telas acendem verde (siga), e a do último também,
quando ele diz "nos seus vídeos".

O ciclo (o relógio da história) é a chegada + a edição: um boneco a cada ~2,3 s nos primeiros 10 s, sempre com a
varredura no instante em que a voz diz "Claude", "diferença", "melhorei" e "Claude" de novo.

## Palco (1080x1920, MODELO §3)

| Peça | Medida |
|---|---|
| Fundo | `#000000` puro, sem textura |
| Chão | invisível, y 1190 (62%); reflexo borrado de 6 px, 20% da luz, sumindo em 173 px (9%) |
| Boneco palito | branco giz `#FCFCFC`, cabeça redonda r 19, membros de 14 px com ponta redonda, um ponto de olho (como o pedestre da ref4); altura 205 px (10,7%), largura ~7% |
| Tela segurada | 9:16, 100x178, acima da cabeça (topo em y ~775); crua = cinza `#363636`/`#2C2C2C` com ▶ `#6A6A6A`; editada = preto com borda branca acesa e halo branco fraco |
| Posições finais (x do boneco) | B1 810, B2 660, B3 510, B4 360, você 210 |
| Frase falada | centrada, y 600 (31%), caixa alta, letra de 1,3% da altura, espaçamento 0,1 em, aspas tipográficas |
| Moral | 2 linhas centradas em y 46%, entrelinha 2,4% |
| Prévias | as telas de B3 e B2 sobem para o alto: 242x430, centros x 335 e 745, y 255 a 685; etiqueta com o nome em y ~720 |

Cores (MODELO §8): branco giz, cinzas de objeto, verde `#00FB10` (luz `#88FF8C`, halo `#033904`) só na virada e na
tela do último. Halo branco fraco (como o brilho do "1%" da ref3) em quem é "este vídeo". Nada de cor fora disso.
Letra: Didact Gothic (geométrica com o I de serifa, a mesma cara das frases da ref4; conferido lado a lado com a
Quicksand, ver LEIA). Uma fonte só, um peso.

## Frase a frase

| Tempo | Fala | O boneco / a cena | Texto na tela (entre aspas, literal) | Cor |
|---|---|---|---|---|
| 0,0–2,2 | "Esse vídeo está sendo 100% editado pelo Claude." | B1 já entrando pela esquerda no quadro 0, anda e freia longo (2,5 s) até x 810 | 1,20 ("100%"): “100% EDITADO PELO CLAUDE”, sai em 4,56 | branco |
| 2,52 | "Claude" | varredura: a tela crua de B1 vira a dele (palito no preto) | | branco |
| 3,08–5,18 | "Ele foi criado justamente para te mostrar..." | B2 entra e freia até x 660 | | |
| 5,24 | "diferença" | varredura em B2 (close da pessoa + legenda) | 4,96 ("a diferença"): “A DIFERENÇA ENTRE VÁRIOS MODELOS”, sai em 8,10 | |
| 5,24–7,44 | "...entre vários modelos que eu criei" | B3 entra e freia até x 510 | | |
| 7,60 | "melhorei" | varredura em B3 (pessoa pequena + palavra grande em cima) | | |
| 7,60–9,60 | "para editar qualquer tipo de vídeo" | B4 entra e freia até x 360 | 8,50 ("qualquer"): “QUALQUER TIPO DE VÍDEO”, sai em 12,70 | |
| 9,84 | "Claude." | varredura em B4 (tela dividida) | | |
| 10,7–13,1 | "Inclusive, se você estiver no Instagram agora," | fila parada; as telas tocam (legendas trocando de leve) | | |
| 13,24 | "um desses modelos" | B1 ganha halo branco; as outras telas apagam para cinza | 13,10 ("apenas"): “APENAS UM DESSES MODELOS”, sai em 15,80 | branco aceso só em B1 |
| 15,66 | "duas" | B2 e B3 erguem mais os braços; todos olham pra cima | | |
| 16,18–20,0 | "prévias rápidas aqui em cima, aceleradas em três vezes" | (com `previas`) as telas de B3 e B2 sobem e crescem no alto e tocam `previa1`/`previa2`; etiquetas com os nomes de 16,80 a 19,95 | só as etiquetas | |
| 19,99–20,50 | "Mas" | as telas descem de volta para as mãos | | |
| 19,99–21,99 | "se você quiser realmente" | chega o último boneco (você), tela crua, freia até x 210 | | |
| 21,91 | "outros modelos de edição" | **virada (72%)**: as 4 telas acendem verde ao mesmo tempo, com halo; a trilha entra na parte forte | 21,91 ("outros"): “OUTROS MODELOS DE EDIÇÃO COMO ESSE”, sai no apagão | verde |
| 25,15 | "usar isso nos seus vídeos" | varredura verde na tela do último: a sua sai editada | | verde |
| 26,55 | (pausa) | apagão: cena e frase somem juntas (0,15 s) | | |
| 26,75 | "comenta edição" | moral, linha 1 | COMENTA “EDIÇÃO” | branco |
| 27,91 | "aqui embaixo" | moral, linha 2, segura até o fim (30,33) | AQUI EMBAIXO | |

Leitura: cada frase fica ≥ 1 s + 3 palavras/s depois de digitada (T1 2,6 s; T2 2,7; T3 3,8; T4 2,35; T5 4,1; moral
3,6 s). Uma frase por vez, sai 0,4 s antes da próxima. Nenhum nome de modelo escrito fora das etiquetas das prévias.

## Som (MODELO §4 e §12)

- Voz limpa na frente.
- Trilha sintetizada (`scripts/som.py`): pulso suave a cada 0,73 s (o compasso da ref1) com pad grave, ~16 dB abaixo da
  voz; em 21,91 entra a parte forte (bumbo, baixo e arpejo, +8 dB), que sobe mais um pouco na moral.
- Efeitos curtos: passo leve de cada boneco, um "bip de varredura" em cada edição, sopro subindo/descendo nas prévias,
  impacto + acorde na virada, baque surdo no apagão, toque de digitação nas duas linhas da moral.
- Final: `loudnorm` -14 LUFS, pico ≤ -1 dBTP (`scripts/mixar.sh`).
- Props: `previas` (false), `nomesPrevias`, `musica` (false), `efeitos` (false). Este vídeo sai com tudo ligado.
