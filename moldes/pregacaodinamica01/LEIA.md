# Molde: pregacaodinamica01

Corte 9:16 no estilo de pregação dinâmica: frase-bloco que se monta com tamanhos misturados e sai em chicote borrado,
palavra de peso em Instrument Serif itálica vermelha (`#FF2424`), letreiro gigante atrás da pessoa recortada (RVM), tela
creme de destaque só na fala protagonista (`#EDE3D3`, tinta `#1A1512`, vermelho escuro `#C8141B`), legenda corrida em
Inter 800 60 px no peito (y 1060; 2ª posição y 1352 só nas prévias), zoom lento dentro de cada plano, fecho no preto,
trilha de cama escura com golpes só nas ênfases. Sem P&B, sem nome do modelo na tela; cor do fundo (vinho / azul
petróleo) é opção desligada. Texto só em x 60–940, y 250–1500. As regras estão em
`../../modelos/pregacaodinamica01/MODELO.md`; este molde é o código do último vídeo feito no modelo (a vitrine, revisão 4).

## Entrada (contrato padrão)
| Arquivo | Uso |
|---|---|
| `public/fala.mp4` | o vídeo (planos, desfoque das prévias) |
| `public/voz.wav` | a voz, que entra só na mixagem; a duração dela vira `D` em `scripts/som.py` |
| `src/palavras.json` | `[{text,start,end}]`; `src/Corte.tsx` converte para `P.palavras [{texto,de,ate}]` |
| `src/rosto.json` | `[[t,cx,cy,h]]`; `src/Corte.tsx` tira a mediana (`R = {cx, cy, queixo}` em px), que posiciona blocos e legenda |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, só com `previas: true` (9:16, já 3x, sem som) |

Gerado pelo molde: `public/pessoa.webm` (a pessoa recortada com transparência, por `scripts/recorte.py`) e
`public/trilha.wav` (por `scripts/som.py`).

## Composição
`VitrinePregacao` (1080x1920, 30 qps, `DURACAO` em `src/Corte.tsx`), props
`{previas: boolean, nomesPrevias: [string, string], fundoCor?: boolean, soTexto?: boolean}`, padrão
`{previas: false, nomesPrevias: ['modelodinamico01', 'storypodcast01'], fundoCor: false}`. `soTexto` renderiza só os
textos em fundo transparente (usado pelo checador). O render sai **sem som**; voz e trilha entram no `mixar.sh`.

Em `src/Corte.tsx`: `T` (os cortes, presos às palavras), `PEDACOS` (páginas da legenda), os blocos, `LET` (letreiro),
`PreviasEmCima` (câmera desce 380 px, prévias 300x533 no alto da zona), `ZONA`, `LEG_Y`/`LEG_Y2`.

## Como gerar (de dentro de `moldes/pregacaodinamica01/` ou `videos/<v>/`)
1. Recorte: `QUEM=pregacaodinamica01 sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recorte.py` →
   `public/pessoa.webm` (RVM em `../../tools/modelos/rvm_mobilenetv3_fp32.onnx`; ~3 min na CPU, é pesado, vai pela
   trava). `--saida <arquivo.webm>` e `--quadros N` servem para teste.
2. Trilha: `../../.venv/Scripts/python.exe scripts/som.py` → `public/trilha.wav` (`--saida` grava em outro lugar).
3. Checador: `node scripts/cobertura.mjs` (abaixo).
4. Render:
   ```
   QUEM=pregacaodinamica01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrinePregacao out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"previas":true,"nomesPrevias":["modelodinamico01","storypodcast01"],"fundoCor":false}'
   ```
5. Mixar: `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` (voz de `public/voz.wav` na frente,
   trilha +2 dB com ducking, loudnorm -14 LUFS / -1 dBTP em duas passadas).

## Checador
`node scripts/cobertura.mjs` (sai com erro se algo falhar). Ele pega a trava do estúdio sozinho, então **não** rode
dentro do `com-trava.sh`. Confere: toda palavra escrita na tela enquanto é dita, pedaço ≥ 1,5 s e palavra ≥ 0,4 s,
nenhuma palavra repetida, no máximo 2 posições de legenda, legenda das prévias abaixo do queixo descido, bloco com até 4
linhas e, renderizando só os textos a cada 0,1 s (com e sem prévias), nenhum pixel fora da zona segura (a conta de
pixels roda no `../../.venv`). Na vitrine: tudo zero, posições 1060 e 1352.

Quadros: `node scripts/quadros.mjs [--previas] 1 13 28` (`ESCALA=1` para tamanho cheio);
`../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ...`; `scripts/lado_a_lado.py` precisa de
`conferencia/ref/` com quadros de `../../modelos/pregacaodinamica01/referencias/`.

## O que é específico do vídeo de origem (refazer num vídeo novo)
- `DURACAO`, `T`, `PEDACOS`, os blocos, o letreiro (`LET`, a palavra "modelos" que sai da legenda) e a tela de destaque
  de `src/Corte.tsx` estão presos às palavras da vitrine.
- Os golpes de `scripts/som.py` repetem os cortes e ênfases desse plano.
- O plano da vitrine:

| De (s) | Fala | Na tela |
|---|---|---|
| 0,00 | Esse vídeo está sendo 100% editado pelo Claude. | frase-bloco de 3 linhas, *Claude.* vermelha |
| 3,02 | Ele foi criado justamente para te mostrar a diferença entre vários modelos que eu criei e melhorei | legenda; letreiro MODELOS atrás da cabeça (6,06 a 8,04) |
| 8,04 | para editar qualquer tipo de vídeo usando o Claude. | legenda |
| 10,64 | Inclusive, se você estiver no Instagram agora, | legenda |
| 12,58 | você está vendo apenas um desses modelos. | tela de destaque creme, 3 linhas |
| 14,44 | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | legenda (2ª posição com prévias); prévias em cima até 19,93 |
| 19,93 | Mas se você quiser realmente ver outros modelos de edição | frase-bloco de 4 linhas, *modelos* vermelha |
| 23,25 | como esse e aprender a como usar isso nos seus vídeos, | legenda |
| 26,69 | comenta edição | Comenta “*edição*” fixo até o fim |
| 27,85 | aqui embaixo que eu vou te mandar na sua DM agora. | legenda; dissolve para o preto em 28,21 |

## Origem
Copiado da vitrine dos modelos (revisão 4, 2026-10-12), que partiu do corte 9:16 aprovado do modelo (2026-10-06). Ao
entrar no estúdio, o molde passou a ler a entrada padrão (a mediana do rosto saiu do `preparar.py`, apagado, e passou a
ser calculada no `Corte.tsx`, com os mesmos valores), o recorte usa o RVM de `../../tools/modelos/`, o checador usa a
trava e o Python do estúdio, e a duração da trilha é medida de `public/voz.wav`.
