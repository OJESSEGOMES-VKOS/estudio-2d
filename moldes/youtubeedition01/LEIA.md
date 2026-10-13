# Molde youtubeedition01

O **youtubeedition01** é o vídeo de YouTube com a pessoa falando, em 9:16 para o Instagram
(`../../modelos/youtubeedition01/MODELO.md`, refs S, D, J, M): sem legenda corrida, a câmera vira uma janela que dá
punch-in, abre, encolhe girando até um cartão no canto e volta; nos trechos de explicação entra o gelo `#F8F8F8` com
grades de vídeos reais; texto grande em Inter Tight 900/800/700, branco na frente da pessoa e tinta atrás dela (a
pessoa recortada passa na frente do letreiro), um acento só, amarelo `#FCDC00`. Este molde é o código do vídeo da
vitrine aprovado, autocontido no estúdio.

## Entrada

| Arquivo | Uso | De onde vem |
|---|---|---|
| `public/fala.mp4`, `public/voz.wav`, `src/palavras.json`, `src/rosto.json` | a gravação, a voz limpa, as palavras com tempo e o rosto a cada 0,25 s (a câmera segue o rosto suavizado em `src/tempos.ts`) | `tools/novo-video.py` |
| `public/pessoa.webm` | a mesma gravação com transparência (VP9 com alfa), para o texto `ATRAS` passar atrás da cabeça | `scripts/recorte.py` (abaixo). Sem `ATRAS` no plano, não precisa |
| `public/ex/<modelo>.mp4`, `public/ex/cheio_<modelo>.mp4` | vídeos **seus**, já prontos em outros modelos: 540x960 para a grade e 2 s em 1080x1920 para a montagem | ffmpeg (abaixo). Sem `GRADES`/`MONTAGEM` no plano, não precisa |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, só com `previas: true` | `tools/previa.py` a partir de um vídeo seu pronto |
| `public/avatar.jpg` | opcional: a foto ao lado do @ na tela de reels | a sua foto de perfil; sem ela, só o @ |
| `public/trilha.wav` | opcional: a trilha | `scripts/trilha.py` |

Se o plano pede um arquivo que não está em `public/`, o molde para ao carregar e diz qual falta e o comando para
fazer. O `node_modules` é uma junção para `../../node_modules` (nunca `npm install` aqui).

## Composição e props

- `VitrineYoutubeEdition01` (`src/Root.tsx`), 1080x1920, 30 qps. A duração sai da fala: 0,7 s depois da última palavra
  (`DURACAO_Q` em `src/plano.ts`; na vitrine, 910 quadros).
- `src/plano.ts` é **o plano**: tudo o que está preso à fala (tempos, chaves da câmera, textos, quais vídeos entram).
  `src/Video.tsx` (o desenho) e `src/Camera.tsx` (a câmera em janela) são o modelo e ficam iguais.
- Props: `previas` (false), `nomesPrevias` ([string, string], padrão `['modelodinamico01', 'modelopadrao01']`),
  `arroba` (vazio: a tela de reels sai sem @ e sem foto). As props da vitrine aprovada estão em `props-vitrine.json`.
- A composição não toca som: a voz e a trilha entram no `scripts/mixar.sh`.

## Vídeo novo

Da raiz do estúdio: `.venv/Scripts/python.exe tools/novo-video.py youtubeedition01 <gravacao.mp4> <AAAA-MM-DD-tema>`.
Depois, de dentro de `videos/<AAAA-MM-DD-tema>/`:

1. **Refazer `src/plano.ts` sobre o `src/palavras.json` novo**, seguindo o MODELO e o `REGRAS.md`. Enquanto o plano for
   o da vitrine, o vídeo para ao carregar com a mensagem `src/plano.ts espera "100%" na palavra 4, e a fala tem ...`.
   - `T` (linha 35): cada tempo é `w(índice, 'palavra')` (o início da palavra, conferido sem contar maiúscula, acento e
     pontuação) ou `em(segundos, índice, 'palavra')` para um tempo livre ancorado numa palavra.
   - `chaves` (linha 61): a câmera, `[t, pose, transição, gira?]`; transição 0 é corte seco.
   - As partes, cada uma desliga com `[]` ou `null` sem mexer no desenho: `ATRAS` (palavra atrás da pessoa),
     `FRASES` (frase na frente), `TITULOS` (título de capítulo), `GRADE` + `GRADES` (a grade de vídeos), `MONTAGEM`,
     `REEL` (tela de reels; a pose `POSE.reel` fica nas chaves), `ESTE` (contorno no cartão), `PREVIAS`, `CTA`.
2. Conferir: `node scripts/checar.mjs` (tem que terminar em `sem problemas`; abaixo).
3. Mídia que o plano pedir:
   - pessoa recortada (para `ATRAS`): `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recorte.py`
     (RVM em `../../tools/modelos/rvm_mobilenetv3_fp32.onnx`, ~4,5 min para 30 s na CPU);
   - grade e montagem, de vídeos seus prontos: `ffmpeg -i <video>.mp4 -an -vf scale=540:960 public/ex/<modelo>.mp4` e
     `ffmpeg -ss <recorte> -t 2.0 -i <video>.mp4 -an public/ex/cheio_<modelo>.mp4` (`recorte` é o da `MONTAGEM`);
   - prévias (só se for usar `previas: true`), da raiz: `.venv/Scripts/python.exe tools/previa.py <video.mp4> videos/<pasta> 1`
     e o mesmo com `2`.
4. Olhar os quadros: `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 14 27.6` (em `conferencia/`;
   `ESCALA=1` para tamanho cheio, `PROPS=<arquivo.json>` para as mesmas props do render, `--previas` liga as prévias).
5. Render sem som, com os padrões do modelo:
   ```
   QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineYoutubeEdition01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2
   ```
   Com o @ e as prévias (só depois de fazer as prévias): `--props='{"arroba":"seu.arroba","previas":true,"nomesPrevias":["<modelo 1>","<modelo 2>"]}'`.
6. Mixagem, só a voz (o padrão): `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4`. Com trilha: o `checar.mjs`
   imprime o comando do `scripts/trilha.py` com os toques deste plano; rode-o e depois
   `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4 public/trilha.wav` (trilha -3,5 dB com ducking, ~16 dB abaixo
   da voz). As duas saem com o tamanho do vídeo, em -14 LUFS / -1 dBTP.

## Checador

`node scripts/checar.mjs` lê o `src/plano.ts` de verdade (sai 1 se reprovar, e apaga o temporário em `../../.tmp`):
o plano é desta fala; com e sem prévias, o texto falado (`ATRAS` e `FRASES` juntos quando se sobrepõem, e o `CTA`)
fica >= 1,5 s e >= 1 s + 3 palavras/s, cada palavra >= 0,4 s, no máximo 4 linhas; títulos e rótulos (nomes) >= 1,33 s;
nada atravessa um corte seco; a duração cobre a fala. Não há legenda corrida neste modelo e as posições são as do
desenho, por isso a zona segura não é medida (na vitrine o `100%` atrás da cabeça fica em y 118, acima da zona, por
decisão do modelo). Na vitrine: `sem problemas`.

## O vídeo de origem (a vitrine)

Preso à fala da vitrine ("Esse vídeo está sendo 100% editado pelo Claude...", 30,33 s), tudo em `src/plano.ts`:
**100%** atrás da cabeça + EDITADO PELO / **CLAUDE**, a grade com seis modelos, a montagem de quatro, a tela de reels,
YOUTUBE / EDITION01, as prévias, o callback da grade com o contorno no cartão e "comenta / **EDIÇÃO** / aqui embaixo".
O plano frase a frase, com o código do catálogo e o gatilho de cada frase, está em `plano.md`.

Para refazer a vitrine igual: `--props=props-vitrine.json` no render, a trilha com
`scripts/trilha.py --sopros 5.24 11.75 21.91 --toques 1.2 13.24 27.35` e `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4 public/trilha.wav`.
Folhas: `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ... [--cols 6]`; `scripts/lado_a_lado.py`
precisa de `conferencia/ref/` (quadros das referências, que não vêm na distribuição).

## Histórico

A 1ª aplicação do modelo foi recusada ("parece que você criou outro") e a paleta do Jessé foi recusada neste modelo;
dela ficou só o encanamento da câmera. Este visual (vitrine de 2026-10-10) foi escrito do zero sobre os quadros das
refs. Diferenças das refs: 9:16 (lado a lado virou em cima/embaixo), nome do modelo na frente da pessoa (atrás a cabeça
cobria o texto), sem gravação de tela nem print, CTA de comentário com palavra-chave gigante. Em 2026-10-13 o plano
saiu do desenho para `src/plano.ts` (cada parte desligável, conferida contra a fala), sem mudar um pixel da vitrine.
