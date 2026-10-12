# Molde youtubeedition01

O **youtubeedition01** é o vídeo de YouTube com a pessoa falando, em 9:16 para o Instagram
(`../../modelos/youtubeedition01/MODELO.md`, refs S, D, J, M): sem legenda corrida, a câmera vira uma janela que dá
punch-in, abre, encolhe girando até um cartão no canto e volta; nos trechos de explicação entra o gelo `#F8F8F8` com
grades de vídeos reais; texto grande em Inter Tight 900/800/700, branco na frente da pessoa e tinta atrás dela (a
pessoa recortada passa na frente do letreiro), um acento só, amarelo `#FCDC00`. Este molde é o código do vídeo da
vitrine aprovado, autocontido no estúdio.

## Entrada

| Arquivo | Uso |
|---|---|
| `public/fala.mp4` | a gravação, A-roll da câmera (`src/Camera.tsx`) |
| `public/pessoa.webm` | a mesma gravação com transparência (VP9 com alfa), para o texto passar atrás da cabeça. Sai do `scripts/recorte.py` |
| `public/voz.wav` | a voz limpa (entra na mixagem) |
| `src/palavras.json`, `src/rosto.json` | palavras com tempo e rosto a cada 0,25 s (a câmera segue o rosto suavizado em `src/tempos.ts`) |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, com `previas: true` (9:16, já em 3x, sem som, ~6 s) |
| `public/ex/<modelo>.mp4`, `public/ex/cheio_<modelo>.mp4` | edições reais dele em outros modelos: 540x960 para a grade e 1080x1920 (8,0-10,0 s) para a montagem |
| `public/avatar.jpg` | a foto da tela de reels genérica |
| `public/trilha.wav` | a trilha, sai do `scripts/trilha.py` |

O `node_modules` é uma junção para `../../node_modules` (nunca `npm install` aqui).

## Composição e props

- `VitrineYoutubeEdition01` (`src/Root.tsx`), 1080x1920, 30 qps, 910 quadros (`QUADROS` em `src/tempos.ts`).
  O visual está em `src/Video.tsx`; a câmera em janela em `src/Camera.tsx`.
- Props: `{previas: boolean, nomesPrevias: [string, string]}` (padrão `previas: false`,
  `['modelodinamico01', 'modelopadrao01']`).
- A composição não toca som: a voz e a trilha entram no `scripts/mixar.sh`.

## Gerar, mixar e renderizar (de dentro de `moldes/youtubeedition01/` ou da cópia em `videos/<v>/`)

Um processo pesado por vez; render e recorte pela trava (TEMP vai para `../../.tmp`).

1. Pessoa recortada: `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recorte.py [saída]`
   grava `public/pessoa.webm` (RVM em `../../tools/modelos/rvm_mobilenetv3_fp32.onnx`, CPU, ~4,5 min para 30 s).
2. Vídeos da grade e da montagem (ffmpeg, a partir dos vídeos prontos de cada modelo):
   `ffmpeg -i <video>.mp4 -an -vf scale=540:960 public/ex/<modelo>.mp4` e
   `ffmpeg -ss 8.0 -t 2.0 -i <video>.mp4 -an public/ex/cheio_<modelo>.mp4`.
3. Trilha: `../../.venv/Scripts/python.exe scripts/trilha.py` grava `public/trilha.wav` (`SAIDA=<pasta>` grava em outra
   pasta). Duração (`D = 910 / 30`) e os toques estão presos aos tempos da fala.
4. Render sem som:
   ```
   QUEM=youtubeedition01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineYoutubeEdition01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"previas":true,"nomesPrevias":["<modelo da previa1>","<modelo da previa2>"]}'
   ```
5. Mixagem: `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` (voz de `public/voz.wav`, trilha
   -3,5 dB com ducking, ~16 dB abaixo da voz; loudnorm -14 LUFS / -1 dBTP em duas passadas).
6. Stills: `QUEM=youtubeedition01 sh ../../tools/com-trava.sh npx remotion still src/index.ts VitrineYoutubeEdition01 ../../.tmp/q.png --frame=510 --props='{"previas":true,"nomesPrevias":["a","b"]}'`.
   Em lote: `node scripts/quadros.mjs [--previas] 1 14 27.6` (`ESCALA=1` para tamanho cheio, em `conferencia/`).
   Folhas: `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ... [--cols 6]`; `scripts/lado_a_lado.py`
   precisa de `conferencia/ref/`.

## Checador

`../../.venv/Scripts/python.exe scripts/tempos.py`: lê o objeto `T` de `src/Video.tsx` e confere cada bloco de texto
contra 1 s + 3 palavras/s e se algum atravessa corte seco (grava `conferencia/tempos.json`). Na vitrine os 8 blocos
passam (`OK` em todos).

## O que é específico do vídeo de origem (refazer num vídeo novo)

Preso à fala da vitrine ("Esse vídeo está sendo 100% editado pelo Claude...", 30,33 s):
- O objeto `T` em `src/Video.tsx` (cada tempo amarrado a uma palavra: "100%" em 1,20, o giro do cartão em 5,24, a
  montagem em 8,26, a tela de reels em 11,75, o nome em 13,24, prévias 14,84-19,99, callback da grade em 21,91, CTA em
  26,75) e as `chaves` da câmera que usam esses tempos.
- Os textos: **100%** atrás da cabeça + EDITADO PELO / **CLAUDE**, YOUTUBE / EDITION01, o rótulo youtubeedition01 no
  cartão, "comenta / **EDIÇÃO** / aqui embaixo".
- Quais modelos entram na grade e na montagem (`public/ex/`), a tela de reels (@ojessegomes, `avatar.jpg`).
- `QUADROS = 910`, a lista `CORTES` e `BLOCOS` do `scripts/tempos.py`, os toques da trilha (1,20; 5,24; 11,75; 13,24;
  21,91; 27,35).
- O plano frase a frase completo, com o código do catálogo e o gatilho de cada frase, está em `plano.md`.

O que se aproveita igual: a câmera em janela com giro e cartão (`Camera.tsx`), a suavização do rosto (`tempos.ts`), a
grade em gelo, a montagem, a tela de prévias (`PreviasEmCima`: câmera desce para a metade de baixo, duas prévias
400x711 no gelo com o nome embaixo), a identidade (gelo, tinta, branco, amarelo, Inter Tight), a mixagem e o checador.

## Histórico

A 1ª aplicação do modelo foi recusada ("parece que você criou outro") e a paleta do Jessé foi recusada neste modelo;
dela ficou só o encanamento da câmera. Este visual (vitrine de 2026-10-10) foi escrito do zero sobre os quadros das
refs. Diferenças das refs: 9:16 (lado a lado virou em cima/embaixo), nome do modelo na frente da pessoa (atrás a cabeça
cobria o texto), sem gravação de tela nem print, CTA de comentário com palavra-chave gigante.
