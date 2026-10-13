# Molde: modelodinamico03

Corte de podcast cinematográfico em 9:16: uma câmera alternando aberto (zoom 1,0) e fechado (1,3) nos cortes, com zoom
lento dentro do plano; grade âmbar com vinheta e grão (prop `tratamento`); blocos de destaque em 3 vozes (Inter Tight
800 apertada, Playfair itálica, Anton em caixa alta, vermelho `#E01E1E` só na palavra-chave) nascendo do desfoque palavra
a palavra entre o queixo e a legenda; legenda serifada calma no peito (`LEG_Y` 1220, 2ª posição `LEG_Y2` 1363 enquanto um
destaque está na tela e nas prévias), em páginas de até 2 linhas; transições de textura (desfoque, flash branco, chicote;
VHS só com a prop `efeitos`); tela de respiro e fecho "Comenta / “PALAVRA”". Todo texto em x 60–940, y 250–1500.
Os efeitos sonoros do modelo (whoosh, sopro e impacto, só nas texturas e nas palavras vermelhas) saem por padrão; a
trilha escura de trailer (música) e o glitch do VHS são opção (`--cama`, `--efeitos`). As regras (as 6 rodadas de 2026-10-12) estão em
`../../modelos/modelodinamico03/MODELO.md`; este molde é o código do último vídeo aprovado (a vitrine, 30,36 s).

## Entrada (contrato padrão)
| Arquivo | Uso |
|---|---|
| `public/fala.mp4` | a câmera (aberto/fechado, prévias, respiro); se acabar antes da fala, o último quadro segura |
| `public/voz.wav` | a voz, que entra só na mixagem (`scripts/mixar.sh`) |
| `src/palavras.json` | `[{text,start,end}]`; o plano aponta para as palavras pelo índice, com a palavra esperada ao lado |
| `src/rosto.json` | `[[t,cx,cy,h]]`; dá o queixo medido (o texto mora abaixo dele) |
| `public/previa1.mp4`, `public/previa2.mp4` | só com a prop `previas: true`. Não vêm com o estúdio: faça com `tools/previa.py` a partir de vídeos **seus** já prontos (ver "Vídeo novo") |

Gerado pelo molde: `public/trilha.wav` (`scripts/som.py`). A duração do vídeo é o fim da última palavra + 0,73 s
(`DURACAO`, calculada de `src/palavras.json`).

## Composição
`VitrineDinamico03` (1080x1920, 30 qps), props
`{previas: boolean, nomesPrevias: [string, string], tratamento: boolean, efeitos: boolean}`, padrão
`{previas: false, nomesPrevias: ['modelodinamico01', 'modelopadrao01'], tratamento: true, efeitos: false}` (o tratamento quente é a
cara do modelo: `CORRECOES.md` M3-3; VHS e glitch ficam em `efeitos`, desligados).
O render sai **sem som**; a voz e a trilha entram no `mixar.sh`. A vitrine foi renderizada com `tratamento: true`.

Tudo mora em `src/Reel.tsx`. No topo fica **O PLANO** (o que muda a cada vídeo): `T` (os cortes), `DESFOQUES`,
`FLASHES`, `CHICOTES`, `RESPIROS` (telas de destaque), `VHS`, `PREVIAS`, `ABERTURA`, `FECHO_DEF`, `CAM` (câmera),
`BLOCOS` (destaques) e `PEDACOS` (legenda). Abaixo dele é o modelo: `ajustes()` (subida e zoom da câmera em cada plano
com destaque), `PreviasEmCima`, `ZONA`, `PADRAO` (escala dos destaques, 0,9) e `exibicoes()`/`caixas()` (usados pelo
checador).

## Vídeo novo
1. `../../.venv/Scripts/python.exe ../../tools/novo-video.py modelodinamico03 <gravacao.mp4> <AAAA-MM-DD-tema>` (da raiz
   do estúdio). Ao carregar com a fala nova, o molde **para de propósito** e diz qual entrada do plano não bate (é o
   plano da vitrine). `node scripts/cobertura.mjs` diz o mesmo com a linha.
2. Refaça **O PLANO** em `src/Reel.tsx` (seguindo `../../modelos/modelodinamico03/MODELO.md` e `../../REGRAS.md`):
   - `T`: um corte por troca de plano, `c(índice, 'palavra')`, 2 quadros antes da palavra.
   - `CAM`: a câmera aberta (1,0) e fechada (1,3) alternando nos cortes; a última chave é `[DURACAO, ...]`. O 1,3 → 1,34
     do fechado é o da vitrine: numa gravação com o queixo mais baixo esse zoom põe o queixo dentro da legenda. O
     checador mede o queixo de cada plano (`src/rosto.json`) e diz até que zoom as chaves daquele plano podem ir.
   - `DESFOQUES`, `FLASHES`, `CHICOTES`, `RESPIROS` (telas de destaque com fundo borrado), `VHS`: os tempos das
     transições. **Lista vazia desliga.**
   - `ABERTURA` (bloco de 3 vozes até o 1º corte; `contador: null` se não há número dito) e `FECHO_DEF` (comando +
     palavra a comentar). **`opcional<AberturaDef>(null)` / `opcional<FechoDef>(null)` desliga.**
   - `PREVIAS`: a janela das prévias; `opcional<{de: number; ate: number}>(null)` desliga (a prop `previas` passa a não
     fazer nada).
   - `BLOCOS`: os destaques nas palavras fortes (`primeira` = índice da 1ª palavra, as linhas são as palavras ditas em
     ordem, `camera` = o plano que a câmera ajusta para ele caber, do corte em que o bloco começa ao corte em que
     termina). O bloco que começa num corte nasce no corte, nunca no fim do plano anterior: ponha `de` no corte
     (`de: T.x`), sem somar folga. Opcional: `risca: n` risca a linha `n` do bloco (0 = a 1ª) com o traço de caneta
     vermelho em diagonal, desenhado logo depois da última palavra da linha; é a **negação** do MODELO §3 (a palavra
     que é negada, como "edita esse vídeo" no vídeo de 2026-10-08). A vitrine não usa.
   - `PEDACOS`: a legenda, `[índice da 1ª palavra, 'texto / 2ª linha']`, cobrindo toda palavra que não está num destaque.
3. `node scripts/cobertura.mjs` até sair `APROVADO` (cobertura, 1,5 s por pedaço, 0,4 s por palavra, até 2 linhas, 2
   posições, rosto, zona segura). Ele diz o arquivo:linha e o que mexer; sai com código 1 enquanto reprova.
4. Refaça o **PLANO DO SOM** no topo de `scripts/som.py` com os mesmos cortes (índice + palavra esperada; lista vazia
   desliga) e rode `../../.venv/Scripts/python.exe scripts/som.py`. Sai `public/trilha.wav` com os efeitos do modelo
   (padrão, parte da identidade); `--cama` põe a música e `--efeitos` o glitch do VHS, os dois desligados por padrão.
5. Olhe os quadros: `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10` (padrões do modelo; ligue
   `--efeitos` ou `--previas` só se for usar; `--sem-tratamento` tira o tratamento quente, que é o padrão).
6. Render com os padrões do modelo (mude só o que você ligar):
   ```
   QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineDinamico03 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2
   ```
   Depois, a folha de 1 quadro por segundo (REGRAS §8), tirada do vídeo pronto, sem renderizar de novo:
   ```
   mkdir -p conferencia/seg && ffmpeg -v error -y -i out/so-video.mp4 -vf fps=1,scale=270:480 -frame_pts 1 conferencia/seg/q_%03d.png && ../../.venv/Scripts/python.exe scripts/montar.py conferencia/folha-1s.png conferencia/seg/q_*.png --cols 8
   ```
   (cada quadro leva o segundo no canto; olhe a `conferencia/folha-1s.png` inteira antes de dizer pronto).
7. Mixe: `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (voz + `public/trilha.wav`, os efeitos do modelo; com `-`
   no 3º argumento sai só a voz). Se o som tiver outra duração que o vídeo (o plano do som não foi refeito), ele para e
   diz.

**Prévias (opcional).** As prévias são clipes de vídeos seus, já editados em outros modelos. Da raiz do estúdio:
`.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<AAAA-MM-DD-tema> 1` (e `2` com o outro vídeo;
`--de`/`--ate` escolhem o trecho, `--vel 3` acelera). Depois ponha a janela em `PREVIAS`, os nomes na prop `nomesPrevias`
e renderize com `--props='{"previas":true,"nomesPrevias":["modeloA","modeloB"]}'`. Nunca use vídeo de terceiro.

## Como gerar (de dentro de `moldes/modelodinamico03/` ou `videos/<v>/`)
1. Som: `../../.venv/Scripts/python.exe scripts/som.py` → `public/trilha.wav` (whoosh nos desfoques e no chicote, sopro
   antes do flash, impacto grave nas palavras vermelhas: os efeitos do modelo, ligados por padrão). `--cama` põe o drone e
   o pulso da trilha de trailer (música: desligada por padrão); `--efeitos` põe o glitch do VHS (use junto com a prop
   `efeitos: true`); `--saida <arquivo.wav>` grava em outro lugar.
2. Render: o comando do passo 6 acima. A vitrine aprovada:
   ```
   QUEM=modelodinamico03 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineDinamico03 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"previas":false,"nomesPrevias":["modelodinamico01","modelopadrao01"],"tratamento":true,"efeitos":false}'
   ```
   com a trilha de `scripts/som.py --cama`.
3. Mixar: `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4 [som.wav | -]`: voz de `public/voz.wav` na frente, o som
   (padrão `public/trilha.wav`; `-` = só a voz) com ducking (~16 LU abaixo da voz), loudnorm -14 LUFS / -1 dBTP em duas
   passadas. A saída tem o tamanho do vídeo (o vídeo nunca é cortado; a voz e o som são completados com silêncio).

## Checador
`node scripts/cobertura.mjs` (usa o esbuild do `node_modules` do estúdio; o temporário vai para `../../.tmp` e sai sempre).
Antes de tudo confere o plano contra a fala (mensagem clara, código 1). Depois: toda palavra escrita na tela enquanto é
dita (0 buracos), pedaço ≥ 1,5 s e palavra ≥ 0,4 s, nenhuma palavra exibida duas vezes, legenda em até 2 linhas e nas 2
posições de repouso, nenhum texto no rosto, destaque sem bater na legenda, tudo na zona segura e destaque ≥ 85% do
padrão, sem e com prévias (só se o plano tem prévias). Peça desligada não é medida. Quando um texto cai no rosto, diz o
conserto certo: legenda no queixo = o zoom do plano (as chaves de `CAM`, com a linha e o zoom máximo medido); bloco fora
do plano da câmera dele = o `camera` do bloco. Na vitrine: 96 palavras, 0 em todas as regras.

Quadros: `node scripts/quadros.mjs [--previas] [--sem-tratamento] [--efeitos] 1 13.8 28.4` → `conferencia/q_*.png`
(`ESCALA=1` para tamanho cheio); `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ... [--cols 6]`.
`scripts/lado_a_lado.py` precisa de `conferencia/ref/` com quadros das referências, que só existem no estúdio local (não
vêm com o estúdio aberto).

## O que é específico do vídeo de origem (refazer num vídeo novo)
- **O PLANO** de `src/Reel.tsx` inteiro e o **PLANO DO SOM** de `scripts/som.py` apontam para a fala da vitrine.
- `nomesPrevias` padrão é o da vitrine.
- O plano da vitrine:

| De (s) | Fala | Câmera / transição | Na tela |
|---|---|---|---|
| 0,00 | Esse vídeo está sendo 100% editado pelo Claude. | aberto | bloco "Esse vídeo está sendo" + contador 0 a 100% + "editado pelo Claude." |
| 3,84 | (Ele foi criado) justamente para te mostrar | corte seco, fechado | legenda |
| 4,90 | a diferença entre vários modelos que eu criei e melhorei | fechado | "a diferença entre / *vários*" com MODELOS vermelho atrás |
| 8,04 | para editar | desfoque, aberto | legenda |
| 8,44 | qualquer tipo de vídeo (usando o Claude. Inclusive,) | aberto | "*qualquer* tipo de / VÍDEO" |
| 11,12 | se você estiver no Instagram agora, você está vendo apenas | fechado | legenda |
| 13,18 | um desses modelos. | fechado | "*um desses modelos.*" (sem o nome do modelo) |
| 15,20 | (Eu posso até) colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | flash branco, aberto ou dividido com as prévias | legenda; prévias de 15,20 a 19,93 |
| 19,93 | Mas se você quiser realmente ver | desfoque | legenda sobre o plano normal |
| 21,85 | outros modelos de edição como esse | tela de respiro (fundo borrado) | "outros modelos / de EDIÇÃO / como esse" |
| 24,15 | e aprender a como usar isso nos seus vídeos, | chicote, aberto | legenda |
| 26,69 | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | fecho | Comenta / “EDIÇÃO” fixos + legenda |

## Origem
Copiado da vitrine dos modelos (2026-10-10, com as 6 rodadas de correção de 2026-10-12), que partiu do vídeo aprovado
do modelo de 2026-10-08. Ao entrar no estúdio, o Python passou a ser o `../../.venv`, a duração da trilha passou a ser
medida de `public/voz.wav` e os comentários deixaram de apontar para a base da vitrine.
- 2026-10-13 (teste do estúdio aberto, `videos/2026-10-13-teste-do-aberto/`): o plano foi para a seção "O PLANO" com cada
  índice conferido contra a fala (mensagem clara em vez de `TypeError`); a duração vem das palavras e o último quadro do
  vídeo segura sozinho (sai o `ULTIMO_QUADRO = 905`); abertura, fecho, prévias e transições se desligam com `opcional(null)` ou
  lista vazia; o checador apaga o temporário mesmo com erro, não presume abertura/fecho e diz arquivo:linha; `quadros.mjs`
  parte dos padrões; `som.py` confere os índices e só põe a música com `--cama`; `mixar.sh` funciona sem trilha e nunca
  corta o vídeo. O plano aprovado sai igual, quadro a quadro.
- 2026-10-13 (retestes com fala nova): o bloco nasce no corte em que começa (antes aparecia 0,1 s no plano anterior e o
  checador mandava mexer na câmera); `risca` nos blocos para a negação do MODELO §3; o checador diz o zoom máximo de cada
  plano quando o queixo entra na legenda; os efeitos sonoros do modelo saem por padrão no `mixar.sh`, que para se o som
  for de outra fala; a folha de 1 quadro por segundo entrou no passo 6. O plano aprovado sai igual, quadro a quadro.
