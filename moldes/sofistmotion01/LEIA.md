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

| Arquivo | Uso |
|---|---|
| `public/voz.wav` | a voz (a composição toca) |
| `src/palavras.json` | palavras com tempo (cada palavra nasce no `start` dela) |
| `src/tempos.json` | **todos os tempos do vídeo num arquivo**: `fps`, `duracao_q`, cenas, flashes, janela das prévias e os blocos de texto (ids das palavras por linha, tamanho `fs` e altura `y`); `texto` troca a grafia de uma palavra |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, com `previas: true` |
| `public/trilha.wav`, `public/efeitos.wav` | saem do `scripts/som.py` |

O `node_modules` é uma junção para `../../node_modules` (nunca `npm install` aqui).

## Composição e props

- `VitrineSofistMotion01` (`src/Root.tsx`), 1080x1920, 30 qps, 951 quadros (31,70 s, com ~2 s de cauda da trilha).
- `src/base.tsx` (cores, Inter, entrada desfoque→foco, bloco de texto, flash, poeira, névoa, fachos, setas a lápis),
  `src/objetos.tsx` (os objetos), `src/cenas.tsx` (as 10 telas C1-C10 e `PreviasNoAlto`), `src/Reel.tsx`.
- Props: `previas` (false), `nomesPrevias` ([string, string], padrão `['superpodcast01', 'modelodinamico03']`),
  `musica` (false), `efeitos` (false). A composição toca `voz.wav` sempre e trilha/efeitos quando ligados, então o
  render já sai mixado; o `finalizar.sh` só normaliza.
- Prévias (C7, 15,67-20,00 s): dois cartões de vidro com borda neon voam dos lados e pousam no alto (330x587, centros
  x 330 e 750), nome embaixo de cada um (Inter 700, 34 px, y 880), setas a lápis em "aqui" e selo 1x→3x em "três".
  Com `previas: false` fica só o túnel.

## Gerar, mixar e renderizar (de dentro de `moldes/sofistmotion01/` ou da cópia em `videos/<v>/`)

```sh
../../.venv/Scripts/python.exe scripts/conferir.py      # o checador: tem que sair "0 erros"
../../.venv/Scripts/python.exe scripts/som.py           # public/trilha.wav e public/efeitos.wav (SAIDA=<pasta> grava fora)
QUEM=sofistmotion01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineSofistMotion01 out/bruto.mp4 \
  --codec=h264 --crf=16 --concurrency=2 --props='{"previas":true,"nomesPrevias":["<previa1>","<previa2>"],"musica":true,"efeitos":true}'
sh scripts/finalizar.sh out/bruto.mp4 out/final.mp4     # loudnorm -14 LUFS / -1 dBTP em duas passadas, vídeo copiado
```

- `som.py` lê os tempos de `src/tempos.json` e a voz de `public/voz.wav`, e acerta a trilha para ficar 16 dB abaixo
  da voz (medido na vitrine: voz -14,5, trilha -30,5, efeitos -28,5 LUFS).
- Stills: `QUEM=sofistmotion01 sh ../../tools/com-trava.sh npx remotion still src/index.ts VitrineSofistMotion01 ../../.tmp/q.png --frame=510 --props='{"previas":true,"nomesPrevias":["a","b"]}'`.
  Em lote: `node scripts/quadros.mjs [--previas] [--pasta=conferencia/x] 1 14.7` (`ESCALA=1` para tamanho cheio).
- Folhas do mp4 final: `../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4` grava
  `conferencia/folha-1qps.png` e `conferencia/lado-a-lado.png` (quadros de referência de
  `../../modelos/sofistmotion01/analise/`; os marcados `conf:` vêm de `conferencia/ref/`). Folha avulsa:
  `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ... --cols 6`.

## Checador

`../../.venv/Scripts/python.exe scripts/conferir.py` (sai 1 se algo falhar): toda palavra da fala aparece uma vez só,
nasce no start dela (±2 quadros) e fica >= 0,4 s; bloco >= 1,5 s, máx. 4 linhas, sem atravessar a troca de cena; zona
segura 9:16 y 250-1500, x 60-940 (largura medida com `scripts/Inter-Bold.ttf`, a mesma Inter do vídeo, OFL); nenhum
trecho > 2,5 s sem palavra nova ou troca; nenhum travessão e nenhum nome de modelo no texto.

## O que é específico do vídeo de origem (refazer num vídeo novo)

Preso à fala da vitrine ("Esse vídeo está sendo 100% editado pelo Claude...", 31,70 s); plano frase a frase em
`plano.md`:
- `src/tempos.json` inteiro: as 10 cenas e seus quadros, os flashes, a janela das prévias, os blocos com os ids das
  palavras desta fala.
- `src/cenas.tsx`: o que cada tela mostra para esta fala (C1 "Esse vídeo" gigante + contador 0→100%, C2 notebook com
  linha do tempo em "criado", C3 anéis com um cartão por palavra até "melhorei", C4 roleta em "qualquer tipo de
  vídeo", C5 celular com Reels em "Instagram", C6 corte vermelho em "apenas um", C7 portas, túnel e prévias, C8 contorno
  neon em "outros modelos de edição", C9 pasta de vidro em "aprender", C10 comenta **"EDIÇÃO"** em ouro que assenta em
  branco, com a legenda embaixo e a seta para baixo).
- Os destaques: "100%" (contador), "outros modelos de edição" (contorno neon), "EDIÇÃO" (assinatura T20); "Claude" e
  "modelos" só em ouro.
- `scripts/som.py`: cada efeito preso a uma palavra pelo índice (`ini(84)` = "EDIÇÃO", etc.) ou a uma cena.
- `scripts/conferir.py`: a exceção do bloco de 1,5 s na C10.

O que se aproveita igual: `base.tsx` e `objetos.tsx` (o repertório T1-T20 do MODELO), a forma do `tempos.json`, as
prévias no alto, a geração da trilha a partir dos tempos, a finalização e o checador. O vídeo novo escreve um
`tempos.json` novo e escolhe as telas do repertório para cada frase da fala nova.

## Histórico

1º vídeo do modelo; os componentes nasceram aqui. Áudio não foi apertado (a fala já está a 3,25 palavras/s). Diferenças
das refs: Ouro em 9:16 (as refs só têm 16:9), toda palavra dita na tela (lição de 2026-10-12) e por isso tipografia
menor que as palavras de impacto da ref1, notebook e celular em CSS 3D sem marca, cartões de "modelo" abstratos,
roleta sem rótulos, fecho com chamada "comenta EDIÇÃO" no lugar do logo. O nome do modelo não aparece em lugar nenhum.
