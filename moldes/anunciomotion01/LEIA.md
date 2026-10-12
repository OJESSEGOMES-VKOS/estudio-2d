# Molde anunciomotion01

O **anunciomotion01** é o anúncio em motion sem apresentador (`../../modelos/anunciomotion01/MODELO.md`): a narração
conduz e a tela encena cada frase com objetos de vidro e neon (play nos anéis, placas inclinadas com telas desenhadas,
ícone herói com órbita, celular flutuando, pílulas de contorno brilhante, interruptor que destrava), alternando fundo
escuro listrado e respiro claro. Câmera viva e três transições (corte seco com batida de zoom, borrão, íris). Cor menta
`#3CF2A4` das refs (vermelho só para o ruim), uma fonte, Sora, com linhas Regular 60 e ExtraBold 80 misturadas; toda a
fala vira legenda numa altura só. Trilha eletrônica e efeitos sintetizados. Este molde é o código do vídeo da vitrine
(2026-10-10), que partiu do anúncio aprovado do Marcaí sem nada da marca dele, autocontido no estúdio.

## Entrada

Molde de narração: não usa `public/fala.mp4` nem `src/rosto.json`.

| Arquivo | Uso |
|---|---|
| `public/voz.wav` | a voz (a composição toca) |
| `src/palavras.json` | palavras com tempo (cada palavra nasce no `start` dela) |
| `src/tempos.json` | `fps`, `duracao_q`, as cenas S1-S10 (quadros, fundo `escuro`/`claro`, entrada `corte`/`borrao`/`iris`), a janela das prévias e os blocos de legenda (ids por linha, `fs`, `peso`, `y`, `marca`, `tipo` contador/pílula); `texto` troca a grafia de uma palavra |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, com `previas: true` |
| `public/trilha.wav`, `public/efeitos.wav` | saem do `scripts/som.py` |
| `scripts/Sora.ttf` | a Sora variável (OFL), só para o checador medir a largura das linhas |

O `node_modules` é uma junção para `../../node_modules` (nunca `npm install` aqui).

## Composição e props

- `VitrineAnuncioMotion01` (`src/Root.tsx`), 1080x1920, 30 qps, 930 quadros (31,0 s).
- `src/tema.ts` (cores, Sora, tempos), `src/ui.tsx` (fundos, palavra que nasce do desfoque, pílula, anéis, partículas,
  ícone de vidro, glifos), `src/texto.tsx` (legenda, contador "100%", pílulas), `src/cenas.tsx` (as 10 telas e as
  prévias), `src/Reel.tsx` (câmera, transições e áudio).
- Props: `previas` (false), `nomesPrevias` ([string, string], padrão `['profissional01', 'sofistmotion01']`),
  `musica` (false), `efeitos` (false). A composição toca `voz.wav` sempre e trilha/efeitos quando ligados, então o
  render já sai mixado; o `finalizar.sh` só normaliza.
- Prévias (S7, 15,67-20,00 s): duas placas 330x587 (centros x 290 e 710, y 267-853) voam dos lados, nome embaixo em
  Sora 700 34 px. Com `previas: false` fica só o ícone de avanço rápido.

## Gerar, mixar e renderizar (de dentro de `moldes/anunciomotion01/` ou da cópia em `videos/<v>/`)

```sh
../../.venv/Scripts/python.exe scripts/conferir.py      # o checador: tem que sair "0 erros"
../../.venv/Scripts/python.exe scripts/som.py           # public/trilha.wav e public/efeitos.wav (SAIDA=<pasta> grava fora)
QUEM=anunciomotion01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineAnuncioMotion01 out/bruto.mp4 \
  --codec=h264 --crf=16 --concurrency=2 --props='{"previas":true,"nomesPrevias":["<previa1>","<previa2>"],"musica":true,"efeitos":true}'
sh scripts/finalizar.sh out/bruto.mp4 out/final.mp4     # loudnorm -14 LUFS / -1 dBTP em duas passadas, vídeo copiado
```

- `som.py` lê os tempos de `src/tempos.json` e a voz de `public/voz.wav` e acerta a trilha 16 dB abaixo da voz
  (medido: voz -14,5, trilha -30,5, efeitos -28,6 LUFS).
- Stills: `QUEM=anunciomotion01 sh ../../tools/com-trava.sh npx remotion still src/index.ts VitrineAnuncioMotion01 ../../.tmp/q.png --frame=510 --props='{"previas":true,"nomesPrevias":["a","b"]}'`.
  Em lote: `node scripts/quadros.mjs [--previas] [--pasta=conferencia/x] 1 14.7`.
- Folhas do mp4 final: `../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4` grava
  `conferencia/folha-1qps.png` e `conferencia/lado-a-lado.png` (contra as refs de `../../modelos/anunciomotion01/referencias/`
  e o anúncio do Marcaí em `../../modelos/anunciomotion01/exemplos/marcai-anuncio.mp4`). Folha avulsa:
  `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ... --cols 6`.

## Checador

`../../.venv/Scripts/python.exe scripts/conferir.py` (sai 1 se algo falhar): toda palavra aparece uma vez só, nasce no
start (±2 quadros) e fica >= 0,4 s; bloco >= 1,5 s, máx. 4 linhas, dentro da cena; zona segura 9:16 y 250-1500,
x 60-940 (largura medida com `scripts/Sora.ttf` no peso de cada linha); legenda em no máximo 2 alturas; pílulas do
mesmo tamanho; nenhum trecho > 2,5 s sem evento; nenhum travessão e nenhum nome de modelo no texto. Na vitrine:
`0 erros | alturas da legenda [1170] | pílulas [84]`.

## O que é específico do vídeo de origem (refazer num vídeo novo)

Preso à fala da vitrine ("Esse vídeo está sendo 100% editado pelo Claude...", 31,0 s):
- `src/tempos.json` inteiro (as 10 cenas, as entradas, os blocos com os ids das palavras desta fala).
- `src/cenas.tsx`, o que cada tela encena: S1 play que vira o contador 0→100%, S2 editor numa placa com um clipe por
  palavra, S3 três placas e "melhorei" com check, S4 ícone herói em "qualquer tipo de vídeo", S5 celular com o coração em
  "Instagram", S6 seis telinhas e "apenas um" que cresce, S7 avanço rápido com prévias, setas em "aqui" e riscos em
  "aceleradas", S8 pílulas "outros modelos" / "de edição", S9 interruptor OFF→ON em "usar", S10 comenta + pílula
  **"EDIÇÃO"** nos anéis com a seta em "embaixo".
- `scripts/som.py`: cada efeito preso a uma palavra pelo índice (`ini(84)` = "EDIÇÃO") ou a uma cena.

O que se aproveita igual: `tema.ts`, `ui.tsx`, `texto.tsx`, a câmera e as transições do `Reel.tsx`, as prévias em
placas, a forma do `tempos.json`, a trilha gerada pelos tempos, a finalização e o checador. O vídeo novo escreve um
`tempos.json` novo e escolhe as telas do repertório (MODELO §4) para cada frase.

## Histórico

Partiu do anúncio aprovado do Marcaí (ui, transições, câmera e tema), sem símbolo, wordmark, prints, notificações nem
locução dele; a estrutura de tempos num JSON, o conferir, o som e a finalização vieram do sofistmotion01. Diferenças das
refs: menta das refs em vez do violeta do Marcaí, sem o arco dor → produto → chamada completo (a fala não tem dor),
sem prints reais, toda a fala na tela (lição de 2026-10-12), sem a manuscrita (Caveat). O nome do modelo não aparece.
