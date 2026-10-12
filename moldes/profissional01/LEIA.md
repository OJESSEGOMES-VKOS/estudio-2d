# Molde: profissional01

O modelo da série do dentista, para profissional falando com a câmera: vídeo com deriva lenta e cortes de ênfase (com
flash), legenda limpa em Poppins 600 72 px em páginas de até 2 linhas (posições 1150 e 1354), títulos de até 3 linhas
com lugar reservado (Poppins 600/800 + uma alternativa, DM Serif ou Great Vibes), telas cheias no desenho do
modelodinamico02 (fundo escuro e fundo de cor alternando, grade de pontos, palavra a palavra do desfoque, objeto herói),
tela dividida com o vídeo sempre embaixo (olhos a 33% da metade) e painel opaco em cima, linha de destaque na divisa,
rótulo em pílula branca, cartão creme com vistos, botão de ação que acende na palavra. A cor de destaque sai do cenário
(aqui caramelo `#8F5F33`). Trilha: cama clara em ré maior + whoosh no flash. Texto só em x 60–940, y 250–1500. As regras
estão em `../../modelos/profissional01/MODELO.md`; este molde é o código do último vídeo feito no modelo (a vitrine).

## Entrada (contrato padrão)
| Arquivo | Uso |
|---|---|
| `public/fala.mp4` | o vídeo (planos, dividida, celular) |
| `public/voz.wav` | a voz (só na mixagem) e o ataque da voz que ancora as palavras em `scripts/palavras.py` |
| `src/palavras.json` | `[{text,start,end}]`, lido por `scripts/palavras.py` |
| `src/rosto.json` | `[[t,cx,cy,h]]`; o ponto entre os olhos (`ROSTO` em `src/Reel.tsx`, x 590 y 620) foi tirado dele à mão |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, só com `previas: true` (9:16, já 3x, sem som, ~6 s) |

Gerado pelo molde: `src/palavras_voz.json` (`{duracao, palavras:[{texto,de,ate}]}` com o começo de cada palavra
ancorado no ataque da voz, MODELO §8; é o que o `Reel.tsx` e o `som.py` leem) e `public/trilha.wav`. Fixos do vídeo:
`public/flash.mp4` (o flash do Jessé na ênfase) e `public/quadro.jpg` (quadro da gravação usado nos cartões).

## Composição
`VitrineProfissional01` (1080x1920, 30 qps, `DURACAO` = `palavras_voz.json`), props
`{previas: boolean, nomesPrevias: [string, string]}`, padrão `{previas: false, nomesPrevias: ['modelodinamico01', 'modelopadrao01']}`.
O render sai **sem som**; voz e trilha entram no `mixar.sh`. Tudo em `src/Reel.tsx`: `Fala` (câmera), `Legenda`,
`Titulo`, `TelaCheia`, `Dividida`, as cenas, `textos()` (usado pelo checador), `ZONA`, `LEG_Y`/`LEG_Y2`.

## Como gerar (de dentro de `moldes/profissional01/` ou `videos/<v>/`)
1. Palavras: `../../.venv/Scripts/python.exe scripts/palavras.py` → `src/palavras_voz.json`.
2. Trilha: `../../.venv/Scripts/python.exe scripts/som.py` → `public/trilha.wav` (`--saida` grava em outro lugar).
3. Render:
   ```
   QUEM=profissional01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineProfissional01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"previas":true,"nomesPrevias":["superpodcast01","modelodinamico03"]}'
   ```
4. Mixar: `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (lê `public/voz.wav` e `public/trilha.wav`; voz com
   passa-alta e compressão leve, trilha 16 LU abaixo com ducking, loudnorm -14 LUFS / TP -1,2 em duas passadas).

O nome na pílula diminui sozinho se não couber.

## Checador
`node scripts/cobertura.mjs [--sem-previas]` (padrão: com prévias, o modo que foi ao ar). Confere quadro a quadro:
toda palavra escrita na tela enquanto é dita, pedaço de legenda ≥ 1,5 s e palavra ≥ 0,4 s, nenhuma palavra repetida,
legenda em no máximo 2 posições e todo texto na zona segura. Na vitrine (com prévias): 96 palavras, 0 em tudo,
posições 1150 e 1354. Sem prévias, "Eu posso até colocar" ainda fica < 1,5 s (a vitrine foi ao ar com prévias).

Quadros: `NOMES=a,b node scripts/quadros.mjs [--previas] 1 13.8 28.4` (`ESCALA=1` para tamanho cheio) e
`../../.venv/Scripts/python.exe scripts/montar.py saida.png --colunas 8 q1.png ...`.

## O que é específico do vídeo de origem (refazer num vídeo novo)
- As cenas de `src/Reel.tsx` (quais frases viram tela cheia, dividida, título; os objetos herói; o painel "Modelos de
  edição"; o campo de comentário com EDIÇÃO), as páginas da legenda e `ROSTO` estão presos à fala e ao enquadramento
  da vitrine. A cor de destaque sai do cenário de cada gravação.
- `scripts/som.py` põe o whoosh na palavra 62 ("Mas"), o índice do flash desta fala.
- O plano da vitrine:

| De | Fala | Modo | Na tela |
|---|---|---|---|
| 0,00 | Esse vídeo está sendo 100% editado pelo Claude. | vídeo | título de 3 linhas |
| 3,04 | Ele foi criado justamente | vídeo | legenda |
| 4,06 | para te mostrar a diferença entre vários modelos | tela cheia escura | três cartões 9:16 com edições diferentes |
| 6,68 | que eu criei e melhorei | tela cheia de cor | barras que sobem com a seta |
| 8,04 | para editar qualquer tipo de vídeo usando o Claude. | tela cheia escura | linha do tempo de editor, lâmina em "editar" |
| 10,66 | Inclusive, se você estiver no Instagram agora, você está vendo apenas um desses modelos. | dividida | o vídeo num celular com interface genérica de Reels |
| 14,58 | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | vídeo / dividida com prévias | prévias lado a lado com o nome na pílula |
| 19,94 | Mas se você quiser realmente | vídeo, ênfase (corte 1,18 + flash) | legenda |
| 21,41 | ver outros modelos de edição como esse | dividida | painel "Modelos de edição" com vistos |
| 24,11 | e aprender a como usar isso nos seus vídeos, | tela cheia de cor | o vídeo num cartão, play some, barra anda |
| 26,72 | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | vídeo, fecho | campo de comentário recebe Comenta “EDIÇÃO” e acende |

## Origem
Copiado da vitrine dos modelos (com a fila de ajustes de 2026-10-12), que partiu do último vídeo aprovado do modelo
(um vídeo de cliente, da série do dentista). Ao entrar no estúdio, o molde passou a ler a entrada padrão (as palavras
ancoradas viraram `src/palavras_voz.json`, gerado de `src/palavras.json`), o Python passou a ser o `../../.venv`, a
trava própria saiu (vale `../../tools/com-trava.sh`), a duração é medida de `public/voz.wav` e o `mixar.sh` faz a
conta do ganho com `awk` em vez de chamar um Python de fora.
