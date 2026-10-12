# Molde ilustrations01

O **ilustrations01** é a metáfora em vetor no preto, sem rosto (`../../modelos/ilustrations01/MODELO.md`): a fala vira
uma história contínua de bonecos palito brancos com reflexo no chão, câmera parada, fundo `#000000`, nenhum corte. Uma
frase curta por vez entre aspas tipográficas, digitada em caixa alta pequena na Didact Gothic (a letra das refs), em
y 31%; cor viva só nos eventos (brilho branco em quem vence, verde `#00FB10` com halo na virada). Fecha com apagão e a
moral em 2 linhas. Trilha e efeitos sintetizados, com a parte forte entrando na virada. Este molde é o código do 1º
vídeo do modelo (vitrine de 2026-10-10), autocontido no estúdio.

## Entrada

Molde de narração: não usa `public/fala.mp4` nem `src/rosto.json`.

| Arquivo | Uso |
|---|---|
| `public/voz.wav` | a voz (a composição toca; também entra na mixagem) |
| `src/palavras.json` | palavras com tempo: as frases entram no início de uma palavra e os eventos caem nelas |
| `public/previa1.mp4` (esquerda), `public/previa2.mp4` (direita) | opcionais, com `previas: true` |
| `public/trilha.wav`, `public/efeitos.wav` | saem do `scripts/som.py` (níveis já relativos à voz) |

O `node_modules` é uma junção para `../../node_modules` (nunca `npm install` aqui).

## Composição e props

- `VitrineIlustrations01` (`src/Root.tsx`), 1080x1920, 30 qps, `DURACAO` = 30,33 s, tudo em `src/Reel.tsx`.
- Props: `previas` (false), `nomesPrevias` ([string, string], padrão `['storypodcast01', 'youtubeedition01']`),
  `musica` (false), `efeitos` (false). A composição toca `voz.wav` sempre e trilha/efeitos quando ligados.
  `props-final.json` liga tudo (é o que a vitrine usou).
- Prévias: duas telas sobem das mãos em 16,18 s ("prévias"), cheias de 16,78 a 19,99 s com o nome embaixo de cada
  uma (16,80-19,95 s), voltam para as mãos até 20,49 s. Sem prévias, as telas não sobem e o resto é igual.

## Gerar, mixar e renderizar (de dentro de `moldes/ilustrations01/` ou da cópia em `videos/<v>/`)

```sh
../../.venv/Scripts/python.exe scripts/som.py          # public/trilha.wav e public/efeitos.wav (SAIDA=<pasta> grava fora)
node scripts/checar.mjs                                 # o checador (abaixo)
QUEM=ilustrations01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineIlustrations01 out/so-video.mp4 \
  --codec=h264 --crf=16 --concurrency=2 --props=props-final.json
sh scripts/mixar.sh out/so-video.mp4 out/final.mp4     # voz + trilha + efeitos a 0 dB, loudnorm -14 LUFS / -1 dBTP
```

- `som.py` aceita ganhos: `scripts/som.py -6 -8` (trilha e efeitos em dB, os padrões). Medido na vitrine: trilha
  ~16,5 dB abaixo da voz antes da virada, -23,4 LUFS depois.
- Stills: `QUEM=ilustrations01 sh ../../tools/com-trava.sh npx remotion still src/index.ts VitrineIlustrations01 ../../.tmp/q.png --frame=510 --props=props-final.json`.
  Em lote: `node scripts/quadros.mjs [--previas] 2.6 17.5` (em `conferencia/`).
- Folhas do mp4 final: `../../.venv/Scripts/python.exe scripts/folhas.py [out/final.mp4]` grava
  `conferencia/folha-1s.png` e `conferencia/lado-a-lado.png` (este precisa dos quadros de referência em
  `conferencia/ref/`, tirados de `../../modelos/ilustrations01/referencias/`).

## Checador

`node scripts/checar.mjs` (tem que terminar em `sem problemas`): cada frase fica >= 1 s + 3 palavras/s depois de
digitada e >= 1,5 s no total, uma frase por vez com 0,4 s de vão, entrada no início de uma palavra (±2 quadros), aspas
tipográficas, no máximo 7 palavras, sem travessão, sem o nome do modelo escrito, virada entre 60 e 76% da duração e a
moral segurando >= 3 s.

## O que é específico do vídeo de origem (refazer num vídeo novo)

A história inteira está presa à fala da vitrine ("Esse vídeo está sendo 100% editado pelo Claude...", 30,33 s); o
detalhe frase a frase está no `plano.md`. Em `src/Reel.tsx`:
- `T`: os tempos dos eventos (as varreduras em "Claude", "diferença", "melhorei" e "Claude", o brilho no "um desses
  modelos", a subida das prévias, a chegada do boneco "você" no "Mas se você quiser", a virada em "outros", 21,91 s =
  72%, a tela verde do último em "nos seus vídeos", o apagão).
- `CHEGADAS`: quantos bonecos chegam, quando e de onde (uma chegada a cada ~2,3 s nos primeiros 10 s, para a fila
  estar completa no "um desses modelos").
- `FRASES` e `MORAL`: “100% EDITADO PELO CLAUDE”, “A DIFERENÇA ENTRE VÁRIOS MODELOS”, “QUALQUER TIPO DE VÍDEO”,
  “APENAS UM DESSES MODELOS”, “OUTROS MODELOS DE EDIÇÃO COMO ESSE” e a moral COMENTA “EDIÇÃO” / AQUI EMBAIXO.
- O conteúdo de cada tela editada (`Conteudo`: a mesma pessoa enquadrada de jeitos diferentes).
- `scripts/som.py`: `D = 30.33`, a grade de batidas ancorada na virada e cada efeito preso a uma palavra
  (`w(i)` lê `palavras.json` pelo índice).

O que se aproveita igual: o boneco, o andar com freio, o reflexo, a tela segurada acima da cabeça e a varredura de
edição, a frase digitada, o brilho, a virada verde, o apagão com moral, as prévias que sobem das mãos, a mixagem e o
checador. Num vídeo novo a metáfora é outra: refazer a história (forma A, B ou C do MODELO) sobre a fala nova.

## Histórico

1º vídeo do modelo, sem código aprovado antes. Diferenças das refs: Didact Gothic no lugar da Quicksand que o MODELO
apostava (a letra das refs tem o I com serifa), ciclo de chegada mais curto que o da ref4, um evento depois da virada,
sem marca d'água (todo texto na zona segura), olho de um ponto no boneco (para mostrar para onde ele olha), prévias
como vídeo real dentro da cena. Ponto a melhorar: 10,7-13,1 s ("Inclusive, se você estiver no Instagram agora") é o
trecho mais parado.
