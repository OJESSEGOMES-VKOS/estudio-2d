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

| Arquivo | Uso | De onde vem |
|---|---|---|
| `public/voz.wav`, `src/palavras.json` | a voz (a composição toca) e as palavras com tempo | `tools/novo-video.py` com a gravação da narração (em vídeo; só áudio, veja "Vídeo novo") |
| `src/tempos.json` | **o plano**: a fala para a qual foi feito, a duração, as cenas (quadro de cada corte), as prévias, as marcas, os blocos de legenda (ids por linha) e o comando fixo; `texto` troca a grafia de uma palavra | à mão, sobre a fala |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, só com `previas: true` | `tools/previa.py` a partir de um vídeo seu pronto |
| `public/grao/g0-g7.png` | opcional: o grão de filme, um por quadro em ciclo; sem ele, só a vinheta | `../../.venv/Scripts/python.exe scripts/grao.py` |
| `public/trilha.wav`, `public/efeitos.wav` | opcionais, com `musica`/`efeitos` | `scripts/som.py` |
| `scripts/ComicNeue-Bold.ttf` | a Comic Neue Bold (google/fonts, OFL), só para o checador medir a largura | vem no molde |

Se uma prop ligada pede um arquivo que não está em `public/`, o molde para ao carregar e diz o comando para fazer.
O `node_modules` é uma junção para `../../node_modules` (nunca `npm install` aqui).

## Composição e props

- `VitrineYoutubeDark01` (`src/Root.tsx`), 1080x1920, 30 qps, `duracao_q` quadros (912 na vitrine, 30,40 s).
- Do curta aprovado: `src/Boneco.tsx` (o rig), `src/Poses.ts`, `src/Cenarios.tsx` (parede, janela, cama, mesa,
  luminária, facho, poeira), `src/Grao.tsx`, a paleta em `src/base.ts`. Desta vitrine: `src/Objetos.tsx` (cartões 9:16
  com "jeitos de editar" abstratos, ícones de tipo de vídeo, setas, cadeira), `src/Cenas.tsx` (S1-S11, prévias,
  legenda, comando fixo), `src/Reel.tsx`.
- Props: `previas` (false), `nomesPrevias` ([string, string], padrão `['superpodcast01', 'youtubeedition01']`),
  `musica` (false), `efeitos` (true: os efeitos sonoros do modelo, de `scripts/som.py`). A composição toca `voz.wav` sempre e trilha/efeitos quando ligados, então o
  render já sai mixado; o `finalizar.sh` só normaliza.
- Prévias (na vitrine 15,67-20,00 s): dentro de dois quadros dourados na parede sob dois focos (x 140-440 e 640-940,
  y 290-823), etiqueta embaixo de cada um. Com `previas: false` a parede fica só com os focos.
- Partes que se desligam no `src/tempos.json`, sem mexer no desenho: sem `"previas"` não há prévias (nem com a prop);
  sem `"fixo"` não há comando fixo no fecho; sem `"fade_q"` não escurece no fim; marca que o plano não tem, efeito
  sonoro dela que não toca.

## Vídeo novo

Da raiz do estúdio: `.venv/Scripts/python.exe tools/novo-video.py youtubedark01 <narracao.mp4> <AAAA-MM-DD-tema>`
(a narração gravada, ou gerada pelo `kit/voz.py`; o `novo-video.py` ainda não aceita áudio puro, então ponha o
áudio num vídeo preto antes: `ffmpeg -f lavfi -i color=c=black:s=1080x1920:r=30 -i narracao.wav -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac narracao.mp4`). Depois, de dentro de `videos/<AAAA-MM-DD-tema>/`:

1. **Refazer o `src/tempos.json` sobre o `src/palavras.json` novo**, seguindo o MODELO e o `REGRAS.md`. Enquanto o
   plano for o da vitrine, o vídeo para ao carregar com `O plano não bate com a fala` e o conferidor diz a linha.
   - `"fala"` (linha 2): o texto da fala nova (o conferidor imprime pronto para colar). Maiúscula, acento e pontuação
     não contam.
   - `"duracao_q"` (linha 4, ao menos o fim da última palavra) e `"fade_q"` (linha 5, opcional).
   - `"cenas"` (linha 6): uma ilustração parada por frase, cortes no início de uma palavra, a última até `duracao_q`.
     Cada `id` tem de estar desenhado em `src/Cenas.tsx` (`CENAS`): reaproveite as que servem e desenhe as novas.
   - `"previas"` (linha 19, opcional), `"marcas"` (linha 20: `"nome": [índice, "palavra"]`, os instantes que as cenas e
     o `som.py` usam: `barra_cheia`, `barra_fim`, `caixa`, `risco`), `"texto"`, `"blocos"` (linha 28) e `"fixo"`
     (linha 41, opcional).
2. Conferir: `../../.venv/Scripts/python.exe scripts/conferir.py` (tem que sair `0 erros`; abaixo).
3. Opcionais: `../../.venv/Scripts/python.exe scripts/grao.py` (grão), `../../.venv/Scripts/python.exe scripts/som.py`
   (trilha e efeitos, gravados a partir do plano) e, para `previas: true`, da raiz:
   `.venv/Scripts/python.exe tools/previa.py <video.mp4> videos/<pasta> 1` e o mesmo com `2`.
4. Olhar os quadros: `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1.5 16.5` (em
   `conferencia/q/`; `PROPS=<arquivo.json>` usa as props do render, `--previas` liga as prévias).
5. Render com os padrões (só a voz):
   ```sh
   QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineYoutubeDark01 out/bruto.mp4 --codec=h264 --crf=16 --concurrency=2
   ```
   Com trilha e efeitos (depois do `som.py`): `--props='{"musica":true,"efeitos":true}'`; com prévias (depois do
   `previa.py`): acrescente `"previas":true,"nomesPrevias":["<previa1>","<previa2>"]`.
6. `sh scripts/finalizar.sh out/bruto.mp4 out/final.mp4` (loudnorm -14 LUFS, TP -1,3; com -1 o pico saía -0,9). O som
   já está no render, do tamanho do vídeo.

## Checador

`../../.venv/Scripts/python.exe scripts/conferir.py` (sai 1 se algo falhar, não grava nada). Primeiro, o plano é desta
fala (`"fala"` igual às palavras, ids existentes, cada marca na palavra que diz); se não for, para dizendo a palavra que
difere, as linhas do `src/tempos.json` a refazer e o texto da fala nova. Depois: toda palavra aparece uma vez só
(legenda + comando fixo), nasce no start (±2 quadros) e fica >= 0,4 s; bloco >= 1,5 s, máx. 4 linhas, dentro da cena;
no máximo 2 posições de texto; cada corte no start de uma palavra; cenas sem buraco, do 0 a `duracao_q`, que cobre a
fala; zona segura 9:16 y 250-1500, x 60-940 (largura com a Comic Neue Bold, contorno incluído); nenhum travessão e
nenhum nome de modelo. Partes que o plano não tem não são conferidas. Na vitrine:
`0 erros | cenas 11 | prévias 15.67-20.00 s | duração 30.40 s`.

## O vídeo de origem (a vitrine)

Preso à fala da vitrine ("Esse vídeo está sendo 100% editado pelo Claude...", 30,40 s):
- `src/tempos.json` inteiro (os 11 cortes, os blocos com os ids das palavras desta fala, as marcas).
- `src/Cenas.tsx`, a ilustração de cada frase: S1 0,00 mesa de edição com a barra chegando a 100% (marcas
  `barra_cheia`/`barra_fim`); S2 3,08 três cartões diferentes; S3 6,73 o cartão verde e os tipos de vídeo; S4 10,70 na
  cama com o celular (feed genérico); S5 12,57 só um cartão aceso entre cinco; S6 14,50 a parede das prévias; S7 17,13
  ele aponta "aqui em cima" com setas; S8 20,00 porta fechada com luz; S9 21,90 porta aberta, sala de cartões acesos
  ("OUTROS MODELOS DE EDIÇÃO" em verde); S10 24,77 livro aberto brilhando; S11 26,77 fecho com comenta “EDIÇÃO” fixo
  na caixa de comentário (marca `caixa`) e o risco vermelho ondulado do aprovado (marca `risco`).
- `scripts/som.py`: um acorde por cena (ciclo Am, F, C, G e a cadência F, C, Am no fim) e os efeitos nas marcas.

Para refazer a vitrine igual: `--props='{"previas":true,"nomesPrevias":["superpodcast01","youtubeedition01"],"musica":true,"efeitos":true}'`.
Folhas do mp4 final: `../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4` grava `conferencia/folha-1qps.png`
e `conferencia/lado-a-lado.png` (este precisa dos quadros das referências e do curta, que não vêm na distribuição).
Folha avulsa: `scripts/montar.py`.

## Histórico

Partiu do curta aprovado HOJE (original intocado). Diferenças das refs B: ilustração em código (SVG no traço do curta
aprovado), não gerada por IA, e mais simples que a ref4; o feijão creme no lugar do boneco palito; legenda em blocos de
até 4 linhas palavra por palavra (lição de 2026-10-12), não uma palavra por vez; vermelho só no risco sob "EDIÇÃO".
