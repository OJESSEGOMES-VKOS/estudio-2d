# Molde ilustrations01

O **ilustrations01** é a metáfora em vetor no preto, sem rosto (`../../modelos/ilustrations01/MODELO.md`): a fala vira
uma história contínua de bonecos palito brancos com reflexo no chão, câmera parada, fundo `#000000`, nenhum corte. Uma
frase curta por vez entre aspas tipográficas, digitada em caixa alta pequena na Didact Gothic (a letra das refs), em
y 31%; cor viva só nos eventos (brilho branco em quem vence, verde `#00FB10` com halo na virada). Fecha com apagão e a
moral em 2 linhas. Trilha e efeitos sintetizados, com a parte forte entrando na virada. Este molde é o código do 1º
vídeo do modelo (vitrine de 2026-10-10), autocontido no estúdio.

## Entrada

Molde de narração: não usa `public/fala.mp4` nem `src/rosto.json`.

| Arquivo | Uso | De onde vem |
|---|---|---|
| `public/voz.wav`, `src/palavras.json` | a voz (a composição toca; também entra na mixagem) e as palavras com tempo | `tools/novo-video.py` com a gravação da narração (em vídeo; só áudio, veja "Vídeo novo") |
| `src/plano.json` | **o plano**: a fala para a qual foi feito, a cauda depois da última palavra, quem chega e quando, as edições, as prévias, a virada, o apagão, as frases e a moral | à mão, sobre a fala |
| `public/previa1.mp4` (esquerda), `public/previa2.mp4` (direita) | opcionais, só com `previas: true` | `tools/previa.py` a partir de um vídeo seu pronto |
| `public/trilha.wav`, `public/efeitos.wav` | opcionais, com `musica`/`efeitos` (níveis já relativos à voz) | `scripts/som.py` |

Se uma prop ligada pede um arquivo que não está em `public/`, o molde para ao carregar e diz o comando para fazer.
O `node_modules` é uma junção para `../../node_modules` (nunca `npm install` aqui).

## Composição e props

- `VitrineIlustrations01` (`src/Root.tsx`), 1080x1920, 30 qps. A duração sai da fala: `cauda` s depois da última
  palavra (na vitrine 0,7 s, `DURACAO` = 30,33 s). O desenho todo está em `src/Reel.tsx`; a história, em `src/plano.json`.
- Props: `previas` (false), `nomesPrevias` ([string, string], padrão `['storypodcast01', 'youtubeedition01']`),
  `musica` (false), `efeitos` (true: os efeitos sonoros do modelo, de `scripts/som.py`). A composição toca `voz.wav` sempre e trilha/efeitos quando ligados.
- Um tempo do plano é `segundos`, `[índice, "palavra"]` (o início dela, conferido sem contar maiúscula, acento e
  pontuação) ou `[índice, "palavra", +/- segundos]`.
- Partes que se desligam no `src/plano.json`, sem mexer no desenho: `"apenasUm": null` (ninguém acende branco),
  `"previas": null` (as telas não sobem, ninguém olha pra cima), `"virada": null` (nada fica verde, a trilha fica só na
  parte calma), `"apagao": null` (sem apagão), `"moral": []`, `"edita": null` numa chegada (a tela dela fica crua).
  Numa chegada, `"previa": 0|1` marca a tela que vira a prévia da esquerda/direita, `"destaque"` a que acende no
  `apenasUm` e `"voce"` a última, que só fica verde quando edita.

## Vídeo novo

Da raiz do estúdio: `.venv/Scripts/python.exe tools/novo-video.py ilustrations01 <narracao.mp4> <AAAA-MM-DD-tema>`
(a narração gravada, ou gerada pelo `kit/voz.py`; o `novo-video.py` ainda não aceita áudio puro, então ponha o
áudio num vídeo preto antes: `ffmpeg -f lavfi -i color=c=black:s=1080x1920:r=30 -i narracao.wav -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac narracao.mp4`). Depois, de dentro de `videos/<AAAA-MM-DD-tema>/`:

1. **Refazer a história no `src/plano.json` sobre o `src/palavras.json` novo** (forma A, B ou C do MODELO; o
   `REGRAS.md`). Enquanto o plano for o da vitrine, o vídeo para ao carregar com `O plano não bate com a fala`.
   - `"fala"` (linha 2): o texto da fala nova (maiúscula, acento e pontuação não contam); `"cauda"` (linha 3).
   - `"apenasUm"` (linha 4), `"previas"` (linha 5), `"virada"` (linha 6, alvo 60 a 76% da duração), `"apagao"` (linha 7).
   - `"chegadas"` (linha 8): uma chegada a cada ~2,3 s nos primeiros segundos, para a fila estar completa no destaque.
   - `"frases"` (linha 15, uma por vez, no máximo 7 palavras entre aspas tipográficas) e `"moral"` (linha 22).
   - O conteúdo de cada tela editada (`Conteudo` em `src/Reel.tsx`: a mesma pessoa enquadrada de jeitos diferentes,
     um por posição na fila) só muda se a metáfora pedir.
2. Conferir: `node scripts/checar.mjs` (tem que terminar em `sem problemas`; abaixo).
3. Opcionais: `../../.venv/Scripts/python.exe scripts/som.py` (trilha e efeitos, do mesmo plano; aceita ganhos:
   `scripts/som.py -6 -8`, trilha e efeitos em dB, os padrões) e, para `previas: true`, da raiz:
   `.venv/Scripts/python.exe tools/previa.py <video.mp4> videos/<pasta> 1` e o mesmo com `2`.
4. Olhar os quadros: `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 2.6 17.5` (em `conferencia/`;
   `PROPS=<arquivo.json>` as props do render, `--previas` liga as prévias).
5. Render com os padrões (só a voz):
   ```sh
   QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineIlustrations01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2
   ```
6. Mixagem, só a voz (o padrão): `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4`. Com trilha e efeitos (depois
   do `som.py`): `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4 public/trilha.wav public/efeitos.wav` (trilha
   ~16 dB abaixo da voz antes da virada). Sai em -14 LUFS / -1 dBTP, do tamanho do vídeo (a voz é completada com
   silêncio).

## Checador

`node scripts/checar.mjs` (sai 1 se reprovar; o temporário vai para `../../.tmp` e é apagado mesmo com erro). Antes de
tudo, o plano é desta fala (senão para dizendo a palavra que difere e o que refazer). Depois: cada frase fica >= 1 s +
3 palavras/s depois de digitada (o que já dá mais de 0,4 s a cada palavra) e >= 1,5 s no total, uma frase por vez com
0,4 s de vão, entrada no início de uma palavra (±2 quadros), aspas tipográficas, no máximo 7 palavras numa linha só,
largura estimada dentro de x 60-940, sem travessão e sem o nome do modelo, virada entre 60 e 76% da duração, moral
segurando >= 3 s e duração cobrindo a fala. Só confere as partes que o plano tem. Na vitrine: `sem problemas`.

## O vídeo de origem (a vitrine)

A história inteira está presa à fala da vitrine ("Esse vídeo está sendo 100% editado pelo Claude...", 30,33 s), em
`src/plano.json`; o detalhe frase a frase está no `plano.md`: as varreduras em "Claude", "diferença", "melhorei" e
"Claude", o brilho no "um desses modelos", a subida das prévias, a chegada do boneco "você" no "Mas se você quiser", a
virada em "outros" (21,91 s = 72%), a tela verde do último em "usar isso nos seus vídeos", o apagão e as frases
“100% EDITADO PELO CLAUDE” ... COMENTA “EDIÇÃO” / AQUI EMBAIXO.

Para refazer a vitrine igual: `--props=props-final.json` no render (prévias, música e efeitos ligados) e a mixagem com
`public/trilha.wav public/efeitos.wav`. Folhas do mp4 final: `../../.venv/Scripts/python.exe scripts/folhas.py [out/final.mp4]`
grava `conferencia/folha-1s.png` e `conferencia/lado-a-lado.png` (este precisa dos quadros das referências, que não vêm
na distribuição).

O que se aproveita igual: o boneco, o andar com freio, o reflexo, a tela segurada acima da cabeça e a varredura de
edição, a frase digitada, o brilho, a virada verde, o apagão com moral, as prévias que sobem das mãos, a mixagem e o
checador. Num vídeo novo a metáfora é outra.

## Histórico

1º vídeo do modelo, sem código aprovado antes. Diferenças das refs: Didact Gothic no lugar da Quicksand que o MODELO
apostava (a letra das refs tem o I com serifa), ciclo de chegada mais curto que o da ref4, um evento depois da virada,
sem marca d'água (todo texto na zona segura), olho de um ponto no boneco (para mostrar para onde ele olha), prévias
como vídeo real dentro da cena. Ponto a melhorar: 10,7-13,1 s ("Inclusive, se você estiver no Instagram agora") é o
trecho mais parado.
