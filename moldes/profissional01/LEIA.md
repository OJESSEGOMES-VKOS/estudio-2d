# Molde: profissional01

O modelo da série do dentista, para profissional falando com a câmera: vídeo com deriva lenta e cortes de ênfase (com
flash), legenda limpa em Poppins 600 72 px em páginas de até 2 linhas (posições 1150 e 1354), títulos de até 3 linhas
com lugar reservado (Poppins 600/800 + uma alternativa, DM Serif ou Great Vibes), telas cheias no desenho do
modelodinamico02 (fundo escuro e fundo de cor alternando, grade de pontos, palavra a palavra do desfoque, objeto herói),
tela dividida com o vídeo sempre embaixo (olhos a 33% da metade) e painel opaco em cima, linha de destaque na divisa,
rótulo em pílula branca, cartão creme com vistos, botão de ação que acende na palavra. A cor de destaque sai do cenário
(aqui caramelo `#8F5F33`). Som: whoosh no flash; cama clara em ré maior como música opcional. Texto só em x 60–940,
y 250–1500. As regras estão em `../../modelos/profissional01/MODELO.md`; este molde é o código do último vídeo feito no
modelo (a vitrine).

## Entrada (contrato padrão)
| Arquivo | Uso |
|---|---|
| `public/fala.mp4` | o vídeo (planos, dividida, celular) |
| `public/voz.wav` | a voz (só na mixagem) e o ataque da voz que ancora as palavras em `scripts/palavras.py` |
| `src/palavras.json` | `[{text,start,end}]`, lido por `scripts/palavras.py` |
| `src/rosto.json` | `[[t,cx,cy,h]]`; dá o ponto entre os olhos (`ROSTO`) quando `ROSTO_MEDIDO` é `null` |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, só com `previas: true` (feitas com `../../tools/previa.py`) |

Gerado pelo molde: `src/palavras_voz.json` (`{duracao, palavras:[{texto,de,ate}]}` com o começo de cada palavra
ancorado no ataque da voz, MODELO §8; é o que o `Reel.tsx` e o `som.py` leem), `public/trilha.wav` e
`public/efeitos.wav`. Feitos à parte:
- `public/quadro.jpg` (um quadro da gravação, nos cartões das telas e no celular). Sem ele, o render para com o comando:
  `ffmpeg -ss 5 -i public/fala.mp4 -frames:v 1 -q:v 3 public/quadro.jpg`.
- `public/flash.mp4` (opcional: um flash branco gravado, em screen, na ênfase; o da vitrine não vai para a
  distribuição). Sem ele, o molde desenha um flash branco de 4 quadros no mesmo lugar.

## Composição
`VitrineProfissional01` (1080x1920, 30 qps, `DURACAO` = `palavras_voz.json`; o id ficou o da vitrine), props
`{previas: boolean, nomesPrevias: [string, string], arroba?: string}`, padrão
`{previas: false, nomesPrevias: ['modelodinamico01', 'modelopadrao01'], arroba: ''}`. `arroba` é o @ que aparece na
interface genérica do celular: o @ real de quem fala, só se o dono do vídeo der; vazio, a linha do perfil não
aparece. Nunca um @ de exemplo. O render sai **sem som**; voz e
som entram no `mixar.sh`. Tudo em `src/Reel.tsx`: `Fala` (câmera), `Legenda`, `Titulo`, `TelaCheia`, `Dividida`, as
cenas, `textos()` (usado pelo checador), `ZONA`, `LEG_Y`/`LEG_Y2`.

## Como gerar (de dentro de `moldes/profissional01/` ou `videos/<v>/`)
1. Palavras: `../../.venv/Scripts/python.exe scripts/palavras.py` → `src/palavras_voz.json`.
2. Som: `../../.venv/Scripts/python.exe scripts/som.py` → `public/trilha.wav` e `public/efeitos.wav` (`--saida`
   grava em outro lugar).
3. Quadro dos cartões: `ffmpeg -ss 5 -i public/fala.mp4 -frames:v 1 -q:v 3 public/quadro.jpg` (escolha um segundo
   com o rosto bem enquadrado).
4. Checador: `node scripts/cobertura.mjs` (abaixo).
5. Render (padrão do modelo: sem prévias, sem @):
   ```
   QUEM=profissional01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineProfissional01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2
   ```
   Opções: `--props='{"arroba":"@<arroba>","previas":true,"nomesPrevias":["<modelo 1>","<modelo 2>"]}'` (prévias só
   depois de fazê-las). A vitrine saiu com prévias `["superpodcast01","modelodinamico03"]` e o @ do dono.
6. Mixar: `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (padrão: voz + whoosh) ou, com a música,
   `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` (trilha 16 LU abaixo da voz com ducking; foi
   assim na vitrine). Voz com passa-alta e compressão leve, loudnorm -14 LUFS / TP -1,2 em duas passadas; a saída tem a
   duração do vídeo.

O nome na pílula diminui sozinho se não couber.

## Checador
`node scripts/cobertura.mjs [--previas]` (padrão: sem prévias, como a composição; use `--previas` se for renderizar com
elas). Sai com código 1 se algo falhar e diz o que mexer. Confere quadro a quadro: toda palavra escrita na tela enquanto
é dita, pedaço de legenda ≥ 1,5 s e palavra ≥ 0,4 s, nenhuma palavra repetida, legenda em no máximo 2 posições, todo
texto na zona segura e nenhuma página, título ou tela com mais de 4 linhas. Se o plano não bate com a fala, para logo e
diz a lista e a linha. Na vitrine (que foi ao ar com prévias): `--previas` dá 96 palavras e 0 em tudo, posições 1150 e
1354; sem prévias, "Eu posso até colocar" fica < 1,5 s (o plano dela conta com a dividida das prévias).

Quadros (uma chamada para a lista toda, pela trava): `NOMES=a,b QUEM=profissional01 sh ../../tools/com-trava.sh node scripts/quadros.mjs [--previas] 1 13.8 28.4` (`ESCALA=1` para tamanho cheio) e
`../../.venv/Scripts/python.exe scripts/montar.py saida.png --colunas 8 q1.png ...`.

## Vídeo novo
O `../../tools/novo-video.py profissional01 <gravação> <AAAA-MM-DD-tema>` copia este molde com a fala nova; rode o
passo 1 (palavras) logo depois. O plano continua o da vitrine e **para ao carregar** com a mensagem do que refazer
(lista, arquivo e linha). Os números do plano são índices de `src/palavras_voz.json` (0 = a 1ª). Refaça, em
`src/Reel.tsx`:

1. **`T`** (linha 70): os cortes (`c(de(i))` = 2 quadros antes da palavra i) e **`trechos`** (linha 100): o modo de
   cada trecho (`video`, `tela`, `celular`, `previas`, `lista`), seguindo o MODELO (telas cheias e dividida só onde a
   fala pede). Tirar um trecho da lista desliga o modo; com `previas` desligado, o trecho das prévias vira vídeo.
2. **`CAM`** (linha 121): os zooms e os cortes de ênfase.
3. **`MARCAS`** (linha 84): as palavras que fazem cada peça agir (cartões, barras, linha do tempo, player, celular,
   lista). Peças que o vídeo novo não usa saem de `TELAS`/`trechos` e as marcas delas podem ficar com qualquer índice
   válido.
4. **`ENTRADAS`** (linha 94): páginas da legenda que entram num tempo próprio (`{}` se nenhuma).
5. **`CTA`** (linha 96): o campo de comentário (`i` = "comenta", a palavra seguinte é a comentada); `null` desliga.
   **`FLASH`** (linha 99): o tempo do flash; `null` desliga.
6. **`ROSTO_MEDIDO`** (linha 144): `null` tira o ponto dos olhos de `src/rosto.json`; ou meça à mão.
7. **`PEDACOS`** (linha 162): as páginas da legenda (texto da fala; maiúscula, acento e pontuação não contam; `*x*`
   destaca na dividida) e os saltos `'#n'` das palavras que uma tela, título ou o fecho já mostram.
8. **`TELAS`** (linha 464), **`MODELOS`** (linha 614, o painel da lista) e **`TITULOS`** (linha 685): texto da fala a
   partir de `primeira`. Listas vazias desligam.
9. **Som**: `FLASH` de `scripts/som.py` (linha 23) = o índice da palavra do flash (`None` tira o whoosh); rode o
   `som.py`. **Quadro** (passo 3) e, se quiser, **prévias**: `../../.venv/Scripts/python.exe ../../tools/previa.py
   <um vídeo seu pronto.mp4> . 1 --de 0` e o mesmo com `2`.
10. **Checador** até zerar e a folha de quadros; **render e mixagem** como em "Como gerar" (sem `--props`, saem os
    padrões do modelo).

## O que é específico do vídeo de origem (refazer num vídeo novo)
- As listas acima (`T`, `trechos`, `CAM`, `MARCAS`, `ENTRADAS`, `CTA`, `FLASH`, `ROSTO_MEDIDO`, `PEDACOS`, `TELAS`,
  `MODELOS`, `TITULOS`) e os objetos herói estão presos à fala e ao enquadramento da vitrine. A cor de destaque sai do
  cenário de cada gravação.
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
conta do ganho com `awk` em vez de chamar um Python de fora. 2026-10-13 (teste do estúdio aberto): plano que não bate
com a fala para com mensagem em português (texto conferido sem acento/pontuação), índices fixos das peças viraram
`MARCAS`, fecho e flash desligáveis, @ do celular virou prop vazia, flash desenhado sem o `flash.mp4`, `ROSTO` a partir
do `rosto.json`, música opcional no `mixar.sh` (whoosh em `efeitos.wav`), checador sem prévias por padrão; os quadros da
vitrine saem iguais (mesmo hash).
