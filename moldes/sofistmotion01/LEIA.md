# Molde sofistmotion01

O **sofistmotion01** é o motion sofisticado narrado, sem rosto (`../../modelos/sofistmotion01/MODELO.md`): cada frase
vira uma tela desenhada em código, com tipografia que se monta palavra por palavra no tempo da fala, um objeto que
ilustra a palavra (anéis neon, cartões, notebook e celular em CSS 3D, roleta, pasta de vidro, túnel dourado) e uma
câmera que nunca para. Registro **Ouro na Noite** (preto, ouro/laranja com brilho), 9:16 com o objeto em cima
(y 250-1050) e o texto embaixo (1ª linha em y 1210) ou o texto sozinho no centro, Inter 700/500. Trilha e efeitos
sintetizados a partir dos tempos. Nenhuma imagem gerada, nada de terceiros. Este molde é o código do 1º vídeo do
modelo (vitrine de 2026-10-10), autocontido no estúdio.

## Entrada

Molde de narração: não usa `public/fala.mp4` nem `src/rosto.json`.

| Arquivo | Uso | De onde vem |
|---|---|---|
| `public/voz.wav`, `src/palavras.json` | a voz (a composição toca) e as palavras com tempo (cada palavra nasce no `start` dela) | `tools/novo-video.py` com a gravação da narração (em vídeo; só áudio, veja "Vídeo novo") |
| `src/tempos.json` | **o plano, todos os tempos num arquivo**: a fala para a qual foi feito, `duracao_q`, cenas, flashes, prévias, marcas, acordes e os blocos de texto (ids das palavras por linha, `fs`, `y`, `tipo`); `texto` troca a grafia de uma palavra | à mão, sobre a fala |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, só com `previas: true` | `tools/previa.py` a partir de um vídeo seu pronto |
| `public/trilha.wav`, `public/efeitos.wav` | opcionais, com `musica`/`efeitos` | `scripts/som.py` |

Se uma prop ligada pede um arquivo que não está em `public/`, o molde para ao carregar e diz o comando para fazer.
O `node_modules` é uma junção para `../../node_modules` (nunca `npm install` aqui).

## Composição e props

- `VitrineSofistMotion01` (`src/Root.tsx`), 1080x1920, 30 qps, `duracao_q` quadros (951 na vitrine, 31,70 s, com ~2 s
  de cauda da trilha).
- `src/base.tsx` (cores, Inter, entrada desfoque→foco, bloco de texto, flash, poeira, névoa, fachos, setas a lápis),
  `src/objetos.tsx` (os objetos), `src/cenas.tsx` (as 10 telas C1-C10 e `PreviasNoAlto`), `src/Reel.tsx`. Cada tela
  conta o tempo a partir do começo da cena dela no plano e pega os instantes das palavras nas `"marcas"`.
- Props: `previas` (false), `nomesPrevias` ([string, string], padrão `['superpodcast01', 'modelodinamico03']`),
  `musica` (false), `efeitos` (true: os efeitos sonoros do modelo, de `scripts/som.py`). A composição toca `voz.wav` sempre e trilha/efeitos quando ligados, então o
  render já sai mixado; o `finalizar.sh` só normaliza.
- Prévias (C7; na vitrine 15,67-20,00 s): dois cartões de vidro com borda neon voam dos lados e pousam no alto
  (330x587, centros x 330 e 750), nome embaixo de cada um (Inter 700, 34 px, y 880), setas a lápis na marca `setas` e
  selo 1x→3x na marca `tres`. Com `previas: false` fica só o túnel.
- Partes que se desligam no `src/tempos.json`, sem mexer no desenho: sem `"previas"` não há prévias; sem
  `"escurece_q"` não vai ao preto no fim; linha sem `"tipo"` é texto comum (`"gigante"`: nasce da palavra gigante da
  C1, com `"gigante"` = os ids que deslizam; `"contador"`: 0→100%; `"assinatura"`: a palavra em ouro do fecho; e
  `"contorno"`); sem `"virada"` o pulso da trilha não sobe; marca que o plano não tem, efeito sonoro dela não toca.

## Vídeo novo

Da raiz do estúdio: `.venv/Scripts/python.exe tools/novo-video.py sofistmotion01 <narracao.mp4> <AAAA-MM-DD-tema>`
(a narração gravada, ou gerada pelo `kit/voz.py`; o `novo-video.py` ainda não aceita áudio puro, então ponha o
áudio num vídeo preto antes: `ffmpeg -f lavfi -i color=c=black:s=1080x1920:r=30 -i narracao.wav -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac narracao.mp4`). Depois, de dentro de `videos/<AAAA-MM-DD-tema>/`:

1. **Refazer o `src/tempos.json` sobre o `src/palavras.json` novo**, seguindo o MODELO e o `REGRAS.md`. Enquanto o
   plano for o da vitrine, o vídeo para ao carregar com `O plano não bate com a fala` e o conferidor diz a linha.
   - `"fala"` (linha 2): o texto da fala nova (o conferidor imprime pronto para colar; maiúscula, acento e pontuação não
     contam). `"duracao_q"` (linha 4, ao menos o fim da última palavra), `"escurece_q"` (linha 5), `"virada"` (linha 6)
     e `"acordes"` (linha 7: segundos ou id de cena; o último é o acorde do fecho).
   - `"cenas"` (linha 8): cada `id` é uma tela de `src/cenas.tsx` (C1-C10, o repertório T1-T20 do MODELO); a última
     cena é o fecho. Tela nova: desenhe em `src/cenas.tsx` e ponha no `Reel.tsx`.
   - `"flashes"` (linha 20), `"previas"` (linha 28), `"marcas"` (linha 29: `"nome": [índice, "palavra"]`, os instantes
     que as telas e o `som.py` usam), `"texto"` e `"blocos"` (linha 53).
2. Conferir: `../../.venv/Scripts/python.exe scripts/conferir.py` (tem que sair `0 erros`; abaixo).
3. Opcionais: `../../.venv/Scripts/python.exe scripts/som.py` (trilha e efeitos, gravados a partir do plano) e, para
   `previas: true`, da raiz: `.venv/Scripts/python.exe tools/previa.py <video.mp4> videos/<pasta> 1` e o mesmo com `2`.
4. Olhar os quadros: `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 14.7` (em `conferencia/q/`;
   `ESCALA=1` tamanho cheio, `PROPS=<arquivo.json>` as props do render, `--previas` liga as prévias).
5. Render com os padrões (só a voz):
   ```sh
   QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineSofistMotion01 out/bruto.mp4 --codec=h264 --crf=16 --concurrency=2
   ```
   Com trilha e efeitos (depois do `som.py`): `--props='{"musica":true,"efeitos":true}'`; com prévias (depois do
   `previa.py`): acrescente `"previas":true,"nomesPrevias":["<previa1>","<previa2>"]`.
6. `sh scripts/finalizar.sh out/bruto.mp4 out/final.mp4` (loudnorm -14 LUFS / -1 dBTP em duas passadas, vídeo copiado;
   o som já está no render, do tamanho do vídeo).

## Checador

`../../.venv/Scripts/python.exe scripts/conferir.py` (sai 1 se algo falhar, não grava nada). Primeiro, o plano é desta
fala (`"fala"` igual às palavras, ids existentes, cada marca na palavra que diz, duração que cobre a fala); se não for,
para dizendo a palavra que difere, as linhas do `src/tempos.json` a refazer e o texto da fala nova. Depois: toda
palavra da fala aparece uma vez só, nasce no start dela (±2 quadros) e fica >= 0,4 s; bloco >= 1,5 s (menos no fecho,
a última cena, onde a assinatura entra no fim da fala), máx. 4 linhas, sem atravessar a troca de cena; zona segura 9:16
y 250-1500, x 60-940 (largura medida com `scripts/Inter-Bold.ttf`, a mesma Inter do vídeo, OFL); nenhum trecho > 2,5 s
sem palavra nova ou troca; nenhum travessão e nenhum nome de modelo no texto. Na vitrine: `0 erros`.

## O vídeo de origem (a vitrine)

Preso à fala da vitrine ("Esse vídeo está sendo 100% editado pelo Claude...", 31,70 s); plano frase a frase em
`plano.md`:
- `src/tempos.json` inteiro: as 10 cenas e seus quadros, os flashes, a janela das prévias, as marcas, os acordes e os
  blocos com os ids das palavras desta fala.
- `src/cenas.tsx`, o que cada tela mostra para esta fala: C1 "Esse vídeo" gigante + contador 0→100%, C2 notebook com
  linha do tempo em "criado", C3 anéis com um cartão por palavra até "melhorei", C4 roleta em "qualquer tipo de
  vídeo", C5 celular com Reels em "Instagram", C6 corte vermelho em "apenas um", C7 portas, túnel e prévias, C8 contorno
  neon em "outros modelos de edição", C9 pasta de vidro em "aprender", C10 comenta **"EDIÇÃO"** em ouro que assenta em
  branco, com a legenda embaixo e a seta para baixo.
- Os destaques: "100%" (contador), "outros modelos de edição" (contorno neon), "EDIÇÃO" (assinatura T20); "Claude" e
  "modelos" só em ouro.

Para refazer a vitrine igual: `--props='{"previas":true,"nomesPrevias":["superpodcast01","modelodinamico03"],"musica":true,"efeitos":true}'`.
Folhas do mp4 final: `../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4` grava
`conferencia/folha-1qps.png` e `conferencia/lado-a-lado.png` (este precisa dos quadros das referências, que não vêm na
distribuição). Folha avulsa: `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ... --cols 6`.

## Histórico

1º vídeo do modelo; os componentes nasceram aqui. Áudio não foi apertado (a fala já está a 3,25 palavras/s). Diferenças
das refs: Ouro em 9:16 (as refs só têm 16:9), toda palavra dita na tela (lição de 2026-10-12) e por isso tipografia
menor que as palavras de impacto da ref1, notebook e celular em CSS 3D sem marca, cartões de "modelo" abstratos,
roleta sem rótulos, fecho com chamada "comenta EDIÇÃO" no lugar do logo. O nome do modelo não aparece em lugar nenhum.
