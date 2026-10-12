# Molde youtubedark01

O **youtubedark01**, família **B (explicação ilustrada)**, é a narração sobre ilustrações paradas em SVG
(`../../modelos/youtubedark01/MODELO.md`, §3B "Finance"): fundo preto, luz dourada de cima (focos sobre a parede e o
chão em linha), verde neon só no objeto-chave, grão de filme por cima. O personagem é o feijão creme do curta aprovado
HOJE (família A, sem voz). Uma ilustração **parada** por frase, corte seco no start da palavra, câmera parada. Legenda
da linha 9:16 (ref7): caixa alta, Comic Neue 700 branca com contorno preto, no terço de baixo, montada palavra por
palavra. Trilha de piano e cordas e efeitos só dentro da cena. Este molde é o código do vídeo da vitrine (2026-10-10),
autocontido no estúdio.

## Entrada

Molde de narração: não usa `public/fala.mp4` nem `src/rosto.json`.

| Arquivo | Uso |
|---|---|
| `public/voz.wav` | a voz (a composição toca) |
| `src/palavras.json` | palavras com tempo |
| `src/tempos.json` | `fps`, `duracao_q`, as 11 cenas (quadro de cada corte), a janela das prévias e os blocos de legenda (ids por linha); `texto` troca a grafia de uma palavra |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, com `previas: true` |
| `public/grao/g0-g7.png` | o grão de filme (do curta aprovado), um por quadro em ciclo |
| `public/trilha.wav`, `public/efeitos.wav` | saem do `scripts/som.py` |
| `scripts/ComicNeue-Bold.ttf` | a Comic Neue Bold (google/fonts, OFL), só para o checador medir a largura |

O `node_modules` é uma junção para `../../node_modules` (nunca `npm install` aqui).

## Composição e props

- `VitrineYoutubeDark01` (`src/Root.tsx`), 1080x1920, 30 qps, 912 quadros (30,40 s).
- Do curta aprovado: `src/Boneco.tsx` (o rig), `src/Poses.ts`, `src/Cenarios.tsx` (parede, janela, cama, mesa,
  luminária, facho, poeira), `src/Grao.tsx`, a paleta em `src/base.ts`. Desta vitrine: `src/Objetos.tsx` (cartões 9:16
  com "jeitos de editar" abstratos, ícones de tipo de vídeo, setas, cadeira), `src/Cenas.tsx` (S1-S11, prévias,
  legenda, comando fixo), `src/Reel.tsx`.
- Props: `previas` (false), `nomesPrevias` ([string, string], padrão `['superpodcast01', 'youtubeedition01']`),
  `musica` (false), `efeitos` (false). A composição toca `voz.wav` sempre e trilha/efeitos quando ligados, então o
  render já sai mixado; o `finalizar.sh` só normaliza.
- Prévias (15,67-20,00 s): dentro de dois quadros dourados na parede sob dois focos (x 140-440 e 640-940,
  y 290-823), etiqueta embaixo de cada um. Com `previas: false` a parede fica só com os focos.

## Gerar, mixar e renderizar (de dentro de `moldes/youtubedark01/` ou da cópia em `videos/<v>/`)

```sh
../../.venv/Scripts/python.exe scripts/conferir.py      # o checador: tem que sair "0 erros"
../../.venv/Scripts/python.exe scripts/som.py           # public/trilha.wav e public/efeitos.wav (SAIDA=<pasta> grava fora)
QUEM=youtubedark01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineYoutubeDark01 out/bruto.mp4 \
  --codec=h264 --crf=16 --concurrency=2 --props='{"previas":true,"nomesPrevias":["<previa1>","<previa2>"],"musica":true,"efeitos":true}'
sh scripts/finalizar.sh out/bruto.mp4 out/final.mp4     # loudnorm -14 LUFS, TP -1,3 (com -1 o pico saía -0,9)
```

- `som.py` lê os tempos de `src/tempos.json` e a voz de `public/voz.wav` e acerta a trilha 16 dB abaixo da voz
  (medido: voz -14,5, trilha -30,5, efeitos -29,8 LUFS). Efeitos nunca no corte (§5B).
- Stills: `QUEM=youtubedark01 sh ../../tools/com-trava.sh npx remotion still src/index.ts VitrineYoutubeDark01 ../../.tmp/q.png --frame=510 --props='{"previas":true,"nomesPrevias":["a","b"]}'`.
  Em lote: `node scripts/quadros.mjs [--previas] [--pasta=conferencia/q] 1.5 16.5`.
- Folhas do mp4 final: `../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4` grava
  `conferencia/folha-1qps.png` e `conferencia/lado-a-lado.png` (recortes de `../../modelos/youtubedark01/analise/`; os
  quadros do curta aprovado vêm de `conferencia/ref/hoje_*.png`). Folha avulsa: `scripts/montar.py`.

## Checador

`../../.venv/Scripts/python.exe scripts/conferir.py` (sai 1 se algo falhar): toda palavra aparece uma vez só (legenda +
comando fixo), nasce no start (±2 quadros) e fica >= 0,4 s; bloco >= 1,5 s, máx. 4 linhas, dentro da cena; no máximo
2 posições de texto; cada corte no start de uma palavra; zona segura 9:16 y 250-1500, x 60-940 (largura com a Comic
Neue Bold, contorno incluído); nenhum travessão e nenhum nome de modelo. Na vitrine:
`0 erros | cenas 11 | prévias 15.67-20.00 s | duração 30.40 s`.

## O que é específico do vídeo de origem (refazer num vídeo novo)

Preso à fala da vitrine ("Esse vídeo está sendo 100% editado pelo Claude...", 30,40 s):
- `src/tempos.json` inteiro (os 11 cortes e os blocos com os ids das palavras desta fala).
- `src/Cenas.tsx`, a ilustração de cada frase: S1 0,00 mesa de edição com a barra chegando a 100% em "100%"; S2 3,08
  três cartões diferentes; S3 6,73 o cartão verde e os tipos de vídeo; S4 10,70 na cama com o celular (feed genérico);
  S5 12,57 só um cartão aceso entre cinco; S6 14,50 a parede das prévias; S7 17,13 ele aponta "aqui em cima" com setas;
  S8 20,00 porta fechada com luz; S9 21,90 porta aberta, sala de cartões acesos ("OUTROS MODELOS DE EDIÇÃO" em verde);
  S10 24,77 livro aberto brilhando; S11 26,77 fecho com comenta “EDIÇÃO” fixo na caixa de comentário e o risco vermelho
  ondulado do aprovado.
- `scripts/som.py`: cada efeito preso a uma palavra pelo índice (`ini(84)` = "EDIÇÃO") ou a uma cena.

O que se aproveita igual: o boneco, as poses, os cenários, o grão, os objetos, a legenda, as prévias na parede, a
trilha gerada pelos tempos, a finalização e o checador. O vídeo novo escreve um `tempos.json` novo e desenha uma
ilustração parada por frase da fala nova.

## Histórico

Partiu do curta aprovado HOJE (original intocado). Diferenças das refs B: ilustração em código (SVG no traço do curta
aprovado), não gerada por IA, e mais simples que a ref4; o feijão creme no lugar do boneco palito; legenda em blocos de
até 4 linhas palavra por palavra (lição de 2026-10-12), não uma palavra por vez; vermelho só no risco sob "EDIÇÃO".
