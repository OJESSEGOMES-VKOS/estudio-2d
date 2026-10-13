# Molde: modelopadrao01

O estilo do reel "100% editado pelo Claude Code" (v1 a v4): rosto cheio com dois enquadramentos de operador (A e B,
B 15% mais perto, olhos em y 660/650, fixo dentro do trecho e só muda no corte), legenda sem tarja com a palavra ativa
em menta, tela dividida com pílula verde-escura na divisa, painel marfim com grade de pontos, editor "Claude Code" com o
próprio vídeo na prévia, chip do Claude com o asterisco laranja, caixa do Claude digitando, cartão branco no jeito do
Instagram no fecho. Geist 800 / Geist Mono, paleta marfim, menta, verde e o laranja do Claude. Som: efeitos
sintetizados e, como opção, a cama de acordes calma com silêncio na virada. As regras estão em
`../../modelos/modelopadrao01/MODELO.md`; este molde é o código do último vídeo feito no modelo (a vitrine dos modelos,
30,36 s).

## Entrada (contrato padrão)
| Arquivo | Uso |
|---|---|
| `public/fala.mp4` | o rosto (A/B), a prévia do editor, o celular; a duração do vídeo vira `video_fim` |
| `public/voz.wav` | a voz (prop `voz`); a duração dela vira `duracao` |
| `src/palavras.json` | `[{text,start,end}]`; `src/tema.ts` converte para `P.palavras [{texto,de,ate}]` |
| `src/rosto.json` | `[[t,cx,cy,h]]` (entrada padrão; este molde não usa, ele mede o rosto por trecho em `scripts/rosto.py`) |
| `public/previa1.mp4`, `public/previa2.mp4` | só com `previas: true`. Não vêm com o estúdio: faça com `tools/previa.py` a partir de vídeos **seus** já prontos (ver "Vídeo novo") |
| foto do perfil (prop `foto`) | opcional: um arquivo seu em `public/` (ex.: `public/foto.jpg`); vazio esconde o avatar |

Gerado pelo molde: `src/tempos.json` (o plano, por `scripts/gerar_tempos.py`), `src/rosto_med.json` (enquadramento por
trecho, por `scripts/rosto.py`), `public/quadro.jpg` (um quadro da gravação, a miniatura dos formatos; o
`gerar_tempos.py` tira de `public/fala.mp4` se não existir), `public/trilha.wav` / `public/trilha_previas.wav` (por
`audio/compor.py`). Os dois JSON guardam de qual fala são: se a gravação mudou, o molde para ao carregar e diz qual rodar.

## Composição
`VitrinePadrao01` (1080x1920, 30 qps, duração `T.duracao`), props
`{voz: boolean, previas: boolean, nomesPrevias: [string, string], arroba: string, foto: string}`, padrão
`{voz: true, previas: false, nomesPrevias: ['modelodinamico01', 'youtubeedition01'], arroba: '', foto: ''}`.
`arroba` (sem o "@") e `foto` aparecem no Reel do celular e no fecho; vazios escondem o elemento.

- `src/tema.ts`: paleta, fontes, `P`, `T`, `R`, as janelas de cada tela. `src/Rosto.tsx`: rosto A/B e zooms.
- `src/Editor.tsx`: o editor Claude Code. `src/Cenas.tsx`: modelos, celular, prévias, outros, prompt, fecho.
- `src/Legenda.tsx`: legenda paginada (`MIN_PAGINA`). `src/ui.tsx`: peças comuns.

## Vídeo novo
1. `../../.venv/Scripts/python.exe ../../tools/novo-video.py modelopadrao01 <gravacao.mp4> <AAAA-MM-DD-tema>` (da raiz
   do estúdio). Ao carregar, o molde **para de propósito** e diz que `src/tempos.json` é de outra fala.
2. Refaça o bloco **O PLANO** de `scripts/gerar_tempos.py` (seguindo `../../modelos/modelopadrao01/MODELO.md` e
   `../../REGRAS.md`): `BLOCOS` e `planos` (cortes A/B), cada tela presa às palavras por `w('palavra', n)` /
   `corte(...)`, `PROMPT` (as palavras que a caixa do Claude digita) e `titulos` (a 1ª palavra e o tamanho de cada página
   de título no editor e no celular). **Tela que o vídeo não usa vira `None`** (`editor`, `modelos`, `celular`,
   `previas`, `outros`, `prompt`, `fecho`, `silencio`; `titulos.editor`/`titulos.celular`) e some do vídeo e do som.
3. `../../.venv/Scripts/python.exe scripts/gerar_tempos.py` → `src/tempos.json`. Se uma palavra do plano não existe na
   fala, ele para e diz a linha.
4. `../../.venv/Scripts/python.exe scripts/rosto.py` → `src/rosto_med.json` (o enquadramento segue os blocos novos).
5. Tempo de leitura: ponha `MIN_PAGINA = 1.5` em `src/Legenda.tsx` (a vitrine saiu com 0, páginas de até 3 palavras;
   com 1,5 elas se juntam até durar 1,5 s e a última palavra ficar 0,4 s, como cobra o REGRAS §3).
6. `node scripts/cobertura.mjs` até sair `APROVADO` (sai com código 1 enquanto reprova e diz o que mexer).
7. Som: `../../.venv/Scripts/python.exe audio/compor.py` (só efeitos; `--cama` liga a música; segue o `tempos.json`).
8. Olhe os quadros: `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10` (`--props
   '{"arroba":"seu.arroba","foto":"foto.jpg"}'` para ver com o seu perfil).
9. Render com os padrões do modelo (mude só o que você ligar):
   ```
   QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrinePadrao01 out/so-voz.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"arroba":"seu.arroba","foto":"foto.jpg"}'
   ```
10. Mixe: `sh scripts/mixar.sh out/so-voz.mp4 out/final.mp4 public/trilha.wav` (sem o 3º argumento sai só a voz).

**Prévias (opcional).** Clipes de vídeos seus já editados em outros modelos. Da raiz do estúdio:
`.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<AAAA-MM-DD-tema> 1` (e `2` com o outro vídeo;
`--de`/`--ate` escolhem o trecho). Depois `audio/compor.py --previas` e o render com
`--props='{"previas":true,"nomesPrevias":["modeloA","modeloB"]}'`. Nunca use vídeo de terceiro.

## Como gerar (de dentro de `moldes/modelopadrao01/` ou `videos/<v>/`)
1. Plano: `../../.venv/Scripts/python.exe scripts/gerar_tempos.py` → `src/tempos.json`.
2. Rosto por trecho: `../../.venv/Scripts/python.exe scripts/rosto.py` → `src/rosto_med.json` (lê os blocos do
   `tempos.json`; YuNet em `../../tools/modelos/`).
3. Som: `../../.venv/Scripts/python.exe audio/compor.py [--cama] [--previas]` → `public/trilha.wav` (com `--previas`,
   `public/trilha_previas.wav`). `--saida <arquivo.wav>` grava em outro lugar. A vitrine saiu com `--cama`.
4. Render. A vitrine aprovada:
   ```
   QUEM=modelopadrao01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrinePadrao01 out/so-voz.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"voz":true,"previas":false,"nomesPrevias":["modelodinamico01","youtubeedition01"],"arroba":"ojessegomes","foto":"foto.jpg"}'
   ```
5. Mixar: `sh scripts/mixar.sh out/so-voz.mp4 out/final.mp4 [public/trilha.wav]` (trilha 16 LU abaixo da voz + sidechain
   leve; loudnorm -14 LUFS / TP -1,2 em duas passadas). Com prévias, `public/trilha_previas.wav`. A saída tem o tamanho
   do vídeo (o vídeo nunca é cortado); se o render saiu sem som, a voz vem de `public/voz.wav`.

## Conferência
`node scripts/cobertura.mjs` (usa o esbuild do estúdio; o temporário vai para `../../.tmp` e sai sempre): quadro a
quadro, sem e com prévias, o texto dito na tela (a legenda e os títulos do editor e do celular): toda palavra escrita
enquanto é dita, página ≥ 1,5 s, palavra ≥ 0,4 s, nada em dois lugares, até 2 linhas, as 2 posições da legenda (base em
1190 e a pílula na divisa) e a zona segura (largura estimada pelas letras).

**A vitrine não passa** (ela é anterior às regras de leitura do REGRAS): 65 trechos curtos (páginas de até 3 palavras e
títulos de 2 e 3 palavras), 5 palavras sem texto na tela na entrada e na saída do editor e do celular e a última página
de título do celular larga demais. O plano aprovado fica como está; num vídeo novo o conferidor cobra as regras e diz
onde mexer.

Quadros:
- `node scripts/quadros.mjs [--previas] 1 13.8 28.4` → `conferencia/q_*.png` (`ESCALA=1` para tamanho cheio).
- `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ...` (folha).
- `scripts/lado_a_lado.py` põe nosso quadro sobre o do v4; precisa de `conferencia/final_*.png` e `conferencia/ref/`,
  que só existem no estúdio local (não vêm com o estúdio aberto).

## O que é específico do vídeo de origem (refazer num vídeo novo)
- O bloco **O PLANO** de `scripts/gerar_tempos.py`: os `BLOCOS` (cortes A/B 2 quadros antes da palavra que abre a
  frase), os `planos` A/B, cada tela (`editor`, `modelos`, `celular`, `previas`, `outros`, `prompt`, `fecho`, `zooms`,
  `silencio`) presa às palavras da vitrine por `w('palavra', n)` e `corte(...)`, o `PROMPT` e os `titulos`.
- Em `src/Cenas.tsx` e `src/Editor.tsx`: os textos de tela da vitrine (nomes dos modelos em `NOMES`, `MODELO =
  'modelopadrao01'`, "outros modelos", "Claude Code").
- O plano da vitrine:

| De | Fala | Modo | Na tela |
|---|---|---|---|
| 0,00 | Esse vídeo está sendo 100% editado | rosto A | abre limpo |
| 2,15 | pelo Claude. Ele foi criado justamente para te mostrar | editor | o vídeo entra no Claude Code; lâmina no clipe; a faixa de legenda nasce |
| 4,96 | a diferença entre vários modelos ... usando o Claude. | dividido | 8 cartões dos modelos, ✓, barra; o vídeo em 9:16, 16:9 e 1:1; tudo entra no chip do Claude |
| 10,63 | Inclusive, se você estiver no Instagram agora, você está vendo apenas um desses modelos. | celular | o vídeo vira um Reel; `modelopadrao01` com ✓ e marca-texto em "um" |
| 14,84 | Eu posso até colocar duas prévias rápidas aqui em cima... | rosto B / dividido com prévias | prévias lado a lado de 15,51 a 19,92, selo "3x" em "aceleradas" |
| 19,92 | Mas se você quiser realmente ver outros modelos de edição como esse | rosto A | a cama some na virada; etiqueta "outros modelos" |
| 23,88 | e aprender a como usar isso nos seus vídeos, | dividido | caixa do Claude digita, enviar acende em "vídeos" |
| 26,68 | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | rosto B | EDIÇÃO digitada no campo de comentário, a DM chega em cima |

- Os eventos de `audio/compor.py` leem o `tempos.json`, então seguem o plano novo sozinhos; sons novos de telas novas
  entram lá.

## Origem
Copiado da vitrine dos modelos (2026-10-10), que partiu do v4 do reel de 2026-10-05. Ao entrar no estúdio, o molde
passou a ler a entrada padrão (antes `gerar_tempos.py` lia a base da vitrine e reescrevia `src/palavras.json`), o
enquadramento por trecho virou `src/rosto_med.json`, `duracao` e `video_fim` passaram a ser medidos da mídia, e os
caminhos de Python e modelos passaram a ser `../../.venv` e `../../tools/modelos`.
- 2026-10-13 (teste do estúdio aberto, `videos/2026-10-13-teste-do-aberto/`): `tempos.json` e `rosto_med.json` guardam
  de qual fala são e o molde para com mensagem clara se a gravação mudou; `gerar_tempos.py` diz a linha da palavra que
  falta (sem maiúscula, acento e pontuação), escreve os títulos, as palavras do prompt e a palavra a comentar (antes
  fixas no código) e tira `public/quadro.jpg` da gravação se faltar; toda tela pode ser `None`; o @ e a foto viraram as
  props `arroba` e `foto` (vazias escondem); `rosto.py` cobre trecho sem rosto; `compor.py` só põe a música com
  `--cama`; `mixar.sh` funciona sem trilha e nunca corta o vídeo; `quadros.mjs` parte dos padrões; novo conferidor
  `scripts/cobertura.mjs` com o `MIN_PAGINA` para a régua de leitura. O plano aprovado sai igual, quadro a quadro (com
  `arroba` e `foto` passados no render).
