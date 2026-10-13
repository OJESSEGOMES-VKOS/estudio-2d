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

| Arquivo | Uso | De onde vem |
|---|---|---|
| `public/voz.wav`, `src/palavras.json` | a voz (a composição toca) e as palavras com tempo (cada palavra nasce no `start` dela) | `tools/novo-video.py` com a gravação da narração (em vídeo; só áudio, veja "Vídeo novo") |
| `src/tempos.json` | **o plano**: a fala para a qual foi feito, `duracao_q`, as cenas S1-S10 (quadros, fundo `escuro`/`claro`, entrada `corte`/`borrao`/`iris`), as prévias, as marcas, os acordes e os blocos de legenda (ids por linha, `fs`, `peso`, `y`, `marca`, `tipo` contador/pílula); `texto` troca a grafia de uma palavra | à mão, sobre a fala |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, só com `previas: true` | `tools/previa.py` a partir de um vídeo seu pronto |
| `public/trilha.wav`, `public/efeitos.wav` | opcionais, com `musica`/`efeitos` | `scripts/som.py` |
| `scripts/Sora.ttf` | a Sora variável (OFL), só para o checador medir a largura das linhas | vem no molde |

Se uma prop ligada pede um arquivo que não está em `public/`, o molde para ao carregar e diz o comando para fazer.
O `node_modules` é uma junção para `../../node_modules` (nunca `npm install` aqui).

## Composição e props

- `VitrineAnuncioMotion01` (`src/Root.tsx`), 1080x1920, 30 qps, `duracao_q` quadros (930 na vitrine, 31,0 s).
- `src/tema.ts` (cores, Sora, tempos, a conferência do plano), `src/ui.tsx` (fundos, palavra que nasce do desfoque,
  pílula, anéis, partículas, ícone de vidro, glifos), `src/texto.tsx` (legenda, contador "100%", pílulas),
  `src/cenas.tsx` (as 10 telas e as prévias; cada uma conta o tempo a partir da cena dela e pega os instantes das
  palavras nas `"marcas"`), `src/Reel.tsx` (câmera, transições e áudio).
- Props: `previas` (false), `nomesPrevias` ([string, string], padrão `['profissional01', 'sofistmotion01']`),
  `musica` (false), `efeitos` (true: os efeitos sonoros do modelo, de `scripts/som.py`). A composição toca `voz.wav` sempre e trilha/efeitos quando ligados, então o
  render já sai mixado; o `finalizar.sh` só normaliza.
- Prévias (S7; na vitrine 15,67-20,00 s): duas placas 330x587 (centros x 290 e 710, y 267-853) voam dos lados, nome
  embaixo em Sora 700 34 px. Com `previas: false` fica só o ícone de avanço rápido.
- Partes que se desligam no `src/tempos.json`, sem mexer no desenho: sem `"previas"` não há prévias; sem
  `"escurece": true` não vai ao preto no fim; linha sem `"tipo"` é legenda comum (`"contador"`: 0→100%; `"pilula"`:
  destaque); sem `"virada"` o pulso da trilha não sobe; marca que o plano não tem, efeito sonoro dela não toca.

## Vídeo novo

Da raiz do estúdio: `.venv/Scripts/python.exe tools/novo-video.py anunciomotion01 <narracao.mp4> <AAAA-MM-DD-tema>`
(a narração gravada, ou gerada pelo `kit/voz.py`; o `novo-video.py` ainda não aceita áudio puro, então ponha o
áudio num vídeo preto antes: `ffmpeg -f lavfi -i color=c=black:s=1080x1920:r=30 -i narracao.wav -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac narracao.mp4`). Depois, de dentro de `videos/<AAAA-MM-DD-tema>/`:

1. **Refazer o `src/tempos.json` sobre o `src/palavras.json` novo**, seguindo o MODELO (§4, o repertório de telas) e o
   `REGRAS.md`. Enquanto o plano for o da vitrine, o vídeo para ao carregar com `O plano não bate com a fala` e o
   conferidor diz a linha.
   - `"fala"` (linha 2): o texto da fala nova (o conferidor imprime pronto para colar; maiúscula, acento e pontuação não
     contam). `"duracao_q"` (linha 4, ao menos o fim da última palavra), `"escurece"` (linha 5), `"virada"` (linha 6) e
     `"acordes"` (linha 7: segundos ou id de cena; o último é o acorde do fecho).
   - `"cenas"` (linha 8): cada `id` é uma tela de `src/cenas.tsx` (S1-S10); a última cena é o fecho. Tela nova:
     desenhe em `src/cenas.tsx` e ponha no `Quadro` do `Reel.tsx`.
   - `"previas"` (linha 20), `"marcas"` (linha 21: `"nome": [índice, "palavra"]`, os instantes que as telas e o
     `som.py` usam), `"texto"` e `"blocos"` (linha 52).
2. Conferir: `../../.venv/Scripts/python.exe scripts/conferir.py` (tem que sair `0 erros`; abaixo).
3. Opcionais: `../../.venv/Scripts/python.exe scripts/som.py` (trilha e efeitos, gravados a partir do plano) e, para
   `previas: true`, da raiz: `.venv/Scripts/python.exe tools/previa.py <video.mp4> videos/<pasta> 1` e o mesmo com `2`.
4. Olhar os quadros: `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 14.7` (em `conferencia/q/`;
   `PROPS=<arquivo.json>` as props do render, `--previas` liga as prévias).
5. Render com os padrões (só a voz):
   ```sh
   QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineAnuncioMotion01 out/bruto.mp4 --codec=h264 --crf=16 --concurrency=2
   ```
   Com trilha e efeitos (depois do `som.py`): `--props='{"musica":true,"efeitos":true}'`; com prévias (depois do
   `previa.py`): acrescente `"previas":true,"nomesPrevias":["<previa1>","<previa2>"]`.
6. `sh scripts/finalizar.sh out/bruto.mp4 out/final.mp4` (loudnorm -14 LUFS / -1 dBTP em duas passadas, vídeo copiado;
   o som já está no render, do tamanho do vídeo).

## Checador

`../../.venv/Scripts/python.exe scripts/conferir.py` (sai 1 se algo falhar, não grava nada). Primeiro, o plano é desta
fala (`"fala"` igual às palavras, ids existentes, cada marca na palavra que diz, duração que cobre a fala); se não for,
para dizendo a palavra que difere, as linhas do `src/tempos.json` a refazer e o texto da fala nova. Depois: toda
palavra aparece uma vez só, nasce no start (±2 quadros) e fica >= 0,4 s; bloco >= 1,5 s, máx. 4 linhas, dentro da
cena; zona segura 9:16 y 250-1500, x 60-940 (largura medida com `scripts/Sora.ttf` no peso de cada linha); legenda em
no máximo 2 alturas; pílulas do mesmo tamanho; nenhum trecho > 2,5 s sem evento (fora o fecho); nenhum travessão e
nenhum nome de modelo no texto. Na vitrine: `0 erros | alturas da legenda [1170] | pílulas [84]`.

## O vídeo de origem (a vitrine)

Preso à fala da vitrine ("Esse vídeo está sendo 100% editado pelo Claude...", 31,0 s):
- `src/tempos.json` inteiro (as 10 cenas, as entradas, as marcas, os acordes, os blocos com os ids desta fala).
- `src/cenas.tsx`, o que cada tela encena: S1 play que vira o contador 0→100%, S2 editor numa placa com um clipe por
  palavra, S3 três placas e "melhorei" com check, S4 ícone herói em "qualquer tipo de vídeo", S5 celular com o coração em
  "Instagram", S6 seis telinhas e "apenas um" que cresce, S7 avanço rápido com prévias, setas em "aqui" e riscos em
  "aceleradas", S8 pílulas "outros modelos" / "de edição", S9 interruptor OFF→ON em "usar", S10 comenta + pílula
  **"EDIÇÃO"** nos anéis com a seta em "embaixo".

Para refazer a vitrine igual: `--props='{"previas":true,"nomesPrevias":["profissional01","sofistmotion01"],"musica":true,"efeitos":true}'`.
Folhas do mp4 final: `../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4` grava `conferencia/folha-1qps.png`
e `conferencia/lado-a-lado.png` (este precisa das referências, que não vêm na distribuição). Folha avulsa:
`../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ... --cols 6`.

## Histórico

Partiu do anúncio aprovado do Marcaí (ui, transições, câmera e tema), sem símbolo, wordmark, prints, notificações nem
locução dele; a estrutura de tempos num JSON, o conferir, o som e a finalização vieram do sofistmotion01. Diferenças das
refs: menta das refs em vez do violeta do Marcaí, sem o arco dor → produto → chamada completo (a fala não tem dor),
sem prints reais, toda a fala na tela (lição de 2026-10-12), sem a manuscrita (Caveat). O nome do modelo não aparece.
