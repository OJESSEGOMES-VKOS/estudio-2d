# Molde: modelodinamico01

Reel 9:16 que alterna quatro modos com corte seco 2 quadros antes da palavra: **M1 palco** (título com serifa itálica +
sans + traço, card que troca com chicote, rosto num card), **M2** (um visual grande com legenda grande), **M3 dividido**
(visual em cima, rosto embaixo com etiqueta mono) e **M4 rosto cheio**. Fundo creme `#F1ECE3` com grade, destaque
terracota `#D97757`, Geist / Instrument Serif itálica / Geist Mono. Legenda de até 3 palavras por modo. Só efeitos
sonoros, sem música. As regras do modelo estão em `../../modelos/modelodinamico01/MODELO.md`; este molde é o código do
último vídeo aprovado nele (a vitrine dos modelos, 30,36 s), pronto para ser copiado para `videos/<AAAA-MM-DD-tema>/`.

## Entrada (contrato padrão)
| Arquivo | Uso |
|---|---|
| `public/fala.mp4` | o vídeo da pessoa (cards de rosto, M4, miniaturas congeladas) |
| `public/voz.wav` | a voz (prop `voz`) |
| `src/palavras.json` | `[{text,start,end}]`; `src/tema.ts` converte para `P = {duracao, palavras:[{texto,de,ate}]}` |
| `src/rosto.json` | `[[t,cx,cy,h]]` a cada 0,25 s; `rostoX(t)` segue o rosto na horizontal (média de ±1 s) |
| `public/previa1.mp4`, `public/previa2.mp4` | só com `previas: true`. Não vêm com o estúdio: faça com `tools/previa.py` a partir de vídeos **seus** já prontos (ver "Vídeo novo") |
| foto do perfil (prop `foto`) | opcional: um arquivo seu em `public/` (ex.: `public/foto.jpg`); vazio esconde o avatar |

Gerado pelo molde (não é entrada): `src/rosto_med.json` (mediana de olhos, largura e queixo em px, quadros do vídeo e a
marca da fala, por `scripts/rosto.py`), `public/sfx.wav` e `public/sfx_previas.wav` (por `scripts/som.py`). A duração do
vídeo é o fim da última palavra + 0,73 s (`DURACAO` em `src/tema.ts`, calculada de `src/palavras.json`).

## Composição
`VitrineDinamico01` (1080x1920, 30 qps), props
`{voz: boolean, previas: boolean, nomesPrevias: [string, string], arroba: string, foto: string}`, padrão
`{voz: true, previas: false, nomesPrevias: ['modelopadrao01', 'youtubeedition01'], arroba: '', foto: ''}`.
`arroba` (sem o "@") e `foto` aparecem nas telas de Instagram (Reels, comentário fixado, DM); vazios escondem o elemento.

- `src/tema.ts`: cores, fontes, `w(palavra, n)` / `iw(palavra, n)` (início / índice da n-ésima vez que a palavra é dita;
  se a fala não tem, param com a mensagem do que refazer), `montaCenas(previas)` (o plano: `base()`).
- `src/Cenas.tsx`: uma cena por frase (`CENA_COMP`); `PreviasCena` é o dividido das prévias.
- `src/ui.tsx`: card de rosto, título, troca, cursor, seleção. `src/Legenda.tsx`: a legenda por modo (`LUGAR`) e o plano
  dela (`CHAVE`, `CAIXA_ALTA`, `SELECAO`, `MIN_PEDACO`).

## Vídeo novo
1. `../../.venv/Scripts/python.exe ../../tools/novo-video.py modelodinamico01 <gravacao.mp4> <AAAA-MM-DD-tema>` (da raiz
   do estúdio). Ao carregar, o molde **para de propósito**: primeiro pede o rosto novo, depois diz qual palavra do plano a
   fala nova não tem.
2. Rosto: `../../.venv/Scripts/python.exe scripts/rosto.py` → `src/rosto_med.json` (YuNet em `../../tools/modelos/`).
3. `node scripts/cobertura.mjs` lista **todas** as palavras do plano que a fala não tem, com arquivo:linha. Refaça, seguindo
   `../../modelos/modelodinamico01/MODELO.md` e `../../REGRAS.md`:
   - `base()` em `src/tema.ts`: uma cena por frase, `[id, modo, corte(w('palavra que abre a frase'))]`;
   - as cenas em `src/Cenas.tsx` (cada uma presa às palavras por `w('palavra', n)`; textos de tela como `MODELOS`,
     `CATALOGO` e a pasta `2026-10-10-vitrine/` são da vitrine). Cena que o vídeo não usa: tire de `base()` e de
     `CENA_COMP`; as prévias só aparecem com a prop `previas`;
   - `CHAVE`, `CAIXA_ALTA` e `SELECAO` em `src/Legenda.tsx`.
4. Tempo de leitura: ponha `MIN_PEDACO = 1.5` em `src/Legenda.tsx` (a vitrine saiu com 0, pedaços de 1 a 3 palavras do
   MODELO §3; com 1,5 os pedaços se juntam até durar 1,5 s e cada palavra ficar 0,4 s, como cobra o REGRAS §3). Para a
   zona segura, `LUGAR` (mesmo arquivo) tem o topo e as margens da legenda de cada modo.
5. `node scripts/cobertura.mjs` até sair `APROVADO` (sai com código 1 enquanto reprova e diz o que mexer).
6. Som: `../../.venv/Scripts/python.exe scripts/som.py` (os eventos usam as mesmas palavras das cenas; refaça junto).
7. Olhe os quadros: `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10` (`--props
   '{"arroba":"seu.arroba","foto":"foto.jpg"}'` para ver com o seu perfil).
8. Render com os padrões do modelo (mude só o que você ligar):
   ```
   QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineDinamico01 out/so-voz.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"arroba":"seu.arroba","foto":"foto.jpg"}'
   ```
9. Mixe: `sh scripts/mixar.sh out/so-voz.mp4 out/final.mp4 public/sfx.wav` (sem o 3º argumento sai só a voz).

**Prévias (opcional).** Clipes de vídeos seus já editados em outros modelos. Da raiz do estúdio:
`.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<AAAA-MM-DD-tema> 1` (e `2` com o outro vídeo;
`--de`/`--ate` escolhem o trecho). Depois `scripts/som.py --previas` e o render com
`--props='{"previas":true,"nomesPrevias":["modeloA","modeloB"]}'`. Nunca use vídeo de terceiro.

## Como gerar (de dentro de `moldes/modelodinamico01/` ou `videos/<v>/`)
1. Rosto médio: `../../.venv/Scripts/python.exe scripts/rosto.py` → `src/rosto_med.json`.
2. Som: `../../.venv/Scripts/python.exe scripts/som.py` → `public/sfx.wav`; com `--previas` → `public/sfx_previas.wav`
   (soma os sons das prévias). `--saida <arquivo.wav>` grava em outro lugar.
3. Render (sem música; a voz vem do próprio render). A vitrine aprovada:
   ```
   QUEM=modelodinamico01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineDinamico01 out/so-voz.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"voz":true,"previas":false,"nomesPrevias":["modelopadrao01","youtubeedition01"],"arroba":"ojessegomes","foto":"foto.jpg"}'
   ```
4. Mixar: `sh scripts/mixar.sh out/so-voz.mp4 out/final.mp4 [public/sfx.wav]` (efeitos 10 dB abaixo, ~16 LU sob a voz;
   loudnorm -14 LUFS / -1 dBTP em duas passadas). Com prévias, `public/sfx_previas.wav`. A saída tem o tamanho do vídeo
   (o vídeo nunca é cortado); se o render saiu sem som, a voz vem de `public/voz.wav`.

## Conferência
`node scripts/cobertura.mjs` (usa o esbuild do estúdio; o temporário vai para `../../.tmp` e sai sempre): as palavras do
plano existem na fala; toda palavra dita aparece na legenda; pedaço ≥ 1,5 s e palavra ≥ 0,4 s; nada repetido; até 4
linhas; um lugar por modo (MODELO §2); legenda e títulos dentro da zona segura (largura estimada pelas letras). Sem e com
prévias.

**A vitrine não passa** (ela é anterior às regras de leitura e de zona segura do REGRAS): 72 trechos curtos (pedaços de 1
a 3 palavras), a legenda do modo M2 embaixo passa de y 1500 e os títulos de 2 linhas começam em y 205. O plano aprovado
fica como está; num vídeo novo o conferidor cobra as regras e diz onde mexer.

Quadros:
- `node scripts/quadros.mjs [--previas] 1 13.8 28.4` → `conferencia/q_*.png` (`ESCALA=1` para tamanho cheio).
- `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png q2.png ...` (folha).
- `scripts/lado_a_lado.py` monta nosso quadro sobre o da referência; precisa de `conferencia/final_*.png` e
  `conferencia/ref/` com quadros das referências, que só existem no estúdio local (não vêm com o estúdio aberto).

## O que é específico do vídeo de origem (refazer num vídeo novo)
Tudo abaixo está preso à fala da vitrine e muda a cada vídeo:
- A lista `base(previas)` de `montaCenas` em `src/tema.ts`: a cena de cada frase e o modo dela.
- As cenas de `src/Cenas.tsx`, presas às palavras pelo `w('palavra')`, e `CHAVE`/`CAIXA_ALTA`/`SELECAO` em
  `src/Legenda.tsx`. O plano da vitrine:

| De | Fala | Modo | Na tela |
|---|---|---|---|
| 0,00 | Esse vídeo está sendo 100% editado pelo Claude. | M2 | o próprio Reel no celular, selo 90→100%, chip do Claude |
| 3,02 | Ele foi criado justamente para te mostrar a | M3 | Claude Code criando a pasta da vitrine (texto de tela) |
| 5,18 | diferença entre vários modelos que eu criei e melhorei | M1 | título "a diferença / entre modelos"; as 8 pastas de modelos entram e ganham ✓ |
| 8,18 | para editar qualquer tipo de vídeo usando o Claude. | M1 | troca de card: reel 9:16, youtube 16:9, podcast, pregação |
| 10,64 | Inclusive, se você estiver no Instagram agora, | M2 | celular no Reels: toque, aba, coração |
| 12,52 | você está vendo apenas um desses modelos. | M1 | título `modelodinamico01` e seleção estilo Figma |
| 14,44 | Eu posso até colocar duas prévias rápidas aqui em cima... | M4 / M3 com prévias | prévias com etiqueta e selo "3x" em 17,86 |
| 19,93 | Mas se você quiser realmente | M4 | punch-in no rosto |
| 21,41 | ver outros modelos de edição como esse | M1 | catálogo, cursor clica no modelodinamico01 |
| 24,13 | e aprender a como usar isso nos seus vídeos, | M1 | prompt do Claude `/modelodinamico01` + seu-video.mp4 |
| 26,69 | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | M2 (legenda em cima) | comentários, EDIÇÃO digitado e publicado, DM chega |

- A lista `MODELOS` e os textos de tela (pasta `2026-10-10-vitrine/`, `videos /`, `/modelodinamico01`, o comentário
  fixado "Comenta EDIÇÃO que eu te mando na DM") são da vitrine.
- Os eventos de som de `scripts/som.py` repetem os eventos visuais das cenas (corte, clique, item, ✓, tecla) e usam as
  mesmas palavras; refazer junto com as cenas.
- Sem prévias, 14,44 a 21,41 fica quase todo rosto (a cena foi feita para as prévias).

## Origem
Copiado da vitrine dos modelos (2026-10-10), que partiu do reel aprovado de 2026-10-05. Ao entrar no estúdio, o molde
passou a ler a entrada padrão (antes lia um `palavras.json` convertido e `rosto_t.json`), a mediana do rosto virou
`src/rosto_med.json` e os caminhos de Python e modelos passaram a ser `../../.venv` e `../../tools/modelos`.
- 2026-10-13 (teste do estúdio aberto, `videos/2026-10-13-teste-do-aberto/`): fala nova para com mensagem clara (w/iw e o
  rosto médio de outra gravação), comparação sem maiúscula, acento e pontuação; a duração vem das palavras e o quadro que
  segura no fim vem do vídeo (`src/rosto_med.json`); `CHAVE` deixou de usar índices fixos; o @ e a foto viraram as props
  `arroba` e `foto` (vazias escondem); novo conferidor `scripts/cobertura.mjs` com o `MIN_PEDACO` para a régua de
  leitura; `mixar.sh` funciona sem efeitos e nunca corta o vídeo; `quadros.mjs` parte dos padrões. O plano aprovado sai
  igual, quadro a quadro (com `arroba` e `foto` passados no render).
