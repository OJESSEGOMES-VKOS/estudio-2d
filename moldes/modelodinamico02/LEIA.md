# Molde modelodinamico02

O código e a mídia do Reel "Esse vídeo foi editado 100% pelo Claude Code" no **modelodinamico02** (9:16, ~45 s):
a voz do Jessé sem o rosto, só animação tipográfica. Uma tela por vez, corte seco com troca de fundo (preto quente
↔ laranja Claude), algumas telas abrindo em íris. Regras do modelo: `../../modelos/modelodinamico02/MODELO.md`.
Vídeo novo: ver a seção "Vídeo novo".

Origem: `modelos/modelopadrao01/aplicacoes/2026-10-05-reel-editado-pelo-claude` (texto histórico; nada aqui aponta pra lá). Aquele projeto
também tinha o modelopadrao01 e o modelodinamico01; aqui ficou só o que o modelodinamico02 usa.

## A entrada (contrato padrão, só a voz)
Não há vídeo da pessoa na tela: o molde usa só a voz e as palavras que o `tools/novo-video.py` prepara.

| O quê | Onde mora | Como nasce |
|---|---|---|
| Voz | `public/voz.wav` | `tools/preparar.py` (via `novo-video.py`), da sua gravação |
| Palavras | `src/palavras.json`, `[{text,start,end}]` | `tools/preparar.py` (Whisper), conferido contra a fala |
| Quadros da palavra "frame" | `public/quadros/f600.jpg`, `f602.jpg` (`FRAME_FOTOS` em `src/Cenas.tsx`) | opcional: `ffmpeg -ss <segundo> -i public/fala.mp4 -frames:v 1 -q:v 3 public/quadros/f600.jpg` (um quadro da sua gravação); `null` deixa a palavra em cor sólida |
| Foto do perfil (prop `foto`) | um arquivo seu em `public/` (ex.: `public/foto.jpg`) | opcional; vazio esconde o anel com a foto do fecho |
| Trilha | `public/trilha.wav` (efeitos nas trocas de tela; com `--cama`, a cama Am-F-C-G) | `scripts/som.py` |

A duração do vídeo é o fim da última palavra + 1,24 s (`QUADROS` em `src/tema.ts`, calculado de `src/palavras.json`).

## Composição
- `src/index.ts` → `src/Root.tsx`: composição **`Dinamico02`**, 1080x1920, 30 qps. Props **`{voz: boolean, arroba:
  string, foto: string}`**, padrão `{voz: false, arroba: '', foto: ''}`: `voz: true` toca `public/voz.wav` no render;
  `arroba` (sem o "@") e `foto` aparecem na assinatura do fecho e, vazios, escondem o elemento.
- `src/Cenas.tsx`: a lista `CENAS` (cada tela: fundo `E` escuro ou `L` laranja, linhas de texto com tamanho,
  fonte e efeito por palavra, herói animado opcional, `iris`) e os heróis (Cem, Arquivo, Mira, Prompt, Pastas,
  Cento, Frame, Orbita, Fichas, Guias, Carimbo...). Cada tela começa 0,06 s antes da primeira palavra dela
  (`tempoDe`, que lê as linhas como as palavras ditas, na ordem; token com `~` é enfeite).
- `src/Reel.tsx`: troca seca de tela e a íris (~15 quadros, anel creme). `src/tema.ts`: cores, fontes (Inter, Pinyon
  Script, Instrument Serif, Geist Mono), easings, `w('palavra', n)`.
- `node_modules` é junção para `../../node_modules` (Remotion 4.0.530). Nunca `npm install` aqui.

## Vídeo novo
1. `../../.venv/Scripts/python.exe ../../tools/novo-video.py modelodinamico02 <gravacao.mp4> <AAAA-MM-DD-tema>` (da raiz
   do estúdio; a gravação pode ser você falando: só a voz entra). Ao carregar, o molde **para de propósito** e diz a primeira
   palavra do plano que a fala nova não tem.
2. `node scripts/cobertura.mjs` lista as palavras dos heróis que faltam (arquivo:linha). Refaça em `src/Cenas.tsx`,
   seguindo `../../modelos/modelodinamico02/MODELO.md` e `../../REGRAS.md`: a lista `CENAS` inteira (uma ideia nova a
   cada 1,5 a 2,5 s, fundo alternando; as linhas são as palavras ditas, na ordem) e os heróis que a fala nova pede
   (os da vitrine são do roteiro dela). Herói que não serve: tire o `heroi:` da tela. `FRAME_FOTOS`: seus quadros ou
   `null`.
3. `node scripts/cobertura.mjs` até sair `APROVADO` (tela ≥ 1,5 s, palavra ≥ 0,4 s, até 4 linhas, zona segura; sai com
   código 1 enquanto reprova e diz o que mexer).
4. Som: refaça a lista `cortes` e os efeitos de `scripts/som.py` com as mesmas palavras e rode
   `../../.venv/Scripts/python.exe scripts/som.py` (só efeitos; `--cama` liga a música).
5. Olhe os quadros: `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 2 5 9` (`--props
   '{"arroba":"seu.arroba","foto":"foto.jpg"}'` para ver com o seu perfil).
6. Render com os padrões do modelo, com a voz:
   ```
   QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts Dinamico02 out/so-voz.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"voz":true,"arroba":"seu.arroba"}'
   ```
7. Mixe: `sh scripts/mixar.sh out/so-voz.mp4 out/final.mp4 public/trilha.wav` (sem o 3º argumento sai só a voz).

## Renderizar e mixar (de dentro de `moldes/modelodinamico02/` ou `videos/<v>/`)
1. `../../.venv/Scripts/python.exe scripts/som.py [--cama]` → `public/trilha.wav`. A vitrine saiu com `--cama`.
2. A vitrine aprovada: `QUEM=modelodinamico02 sh ../../tools/com-trava.sh npx remotion render src/index.ts Dinamico02 out/so-voz.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"voz":true,"arroba":"ojessegomes","foto":"foto.jpg"}'`
3. `sh scripts/mixar.sh out/so-voz.mp4 out/reel-dinamico02.mp4 [public/trilha.wav]` (trilha abaixa sob a voz por
   sidechain; loudnorm -14 LUFS / -1 dBTP em duas passadas). A saída tem o tamanho do vídeo (o vídeo nunca é cortado);
   se o render saiu sem som, a voz vem de `public/voz.wav`. O original saiu com 45,3 s, -14,3 LUFS, pico -1,0. Com esta
   receita a trilha fica ~24 LU abaixo da voz (mais baixa que os ~16 dB do REGRAS §8; a vitrine foi aprovada assim).

## Conferência
`node scripts/cobertura.mjs` (usa o esbuild do estúdio; o temporário vai para `../../.tmp` e sai sempre). Este modelo
não tem legenda: o texto de cada tela é o design (MODELO §1), e o conferidor mede o bloco de texto de cada tela (tempo,
linhas e zona segura); o texto dos heróis não é medido.

**A vitrine não passa** (ela é anterior às regras de leitura e de zona segura do REGRAS): 6 telas abaixo de 1,5 s, a tela
"cada" com 6 linhas e o texto grande centrado passando de x 940 ou começando acima de y 250 em 16 telas. O plano
aprovado fica como está; num vídeo novo o conferidor cobra as regras e diz onde mexer.

Quadros: `QUEM=modelodinamico02 sh ../../tools/com-trava.sh node scripts/quadros.mjs 2.6 9.9` → `conferencia/q_*.png`.
Stills de prova: `conferencia/prova_f0240.jpg`, `prova_f0900.jpg`.

## O que é específico do vídeo de origem
- `src/palavras.json`, a voz, a foto e os quadros de `public/quadros/`.
- Em `src/Cenas.tsx`: a lista `CENAS` inteira (o plano frase a frase: textos, quebras, tamanhos, fundos, íris) e
  os heróis feitos pra este roteiro (100%, arquivo `20261005_103843.mp4`, prompt, pastas do método, 160+, frame por
  frame, órbita de tópicos, fichas de regras, guias, carimbo de teste, perfil). Os componentes de tipografia, a troca
  seca e a íris são do modelo e ficam.
- Em `scripts/som.py`: a lista `cortes` e os instantes dos efeitos, presos às palavras deste roteiro (`w('palavra', n)`).

## Histórico
- 2026-10-13 (teste do estúdio aberto, `videos/2026-10-13-teste-do-aberto/`): o molde passou a ler a entrada padrão
  (`src/palavras.json` no formato do contrato e `public/voz.wav`; antes `src/d1/palavras.json` em outro formato e
  `public/d1/voz.wav`, que o `novo-video.py` não preenche); as pastas `d1/` e `d2/` viraram `src/` e `scripts/`; a
  duração vem das palavras; fala nova para com mensagem clara (sem maiúscula, acento e pontuação); o @ e a foto viraram
  as props `arroba` e `foto` (vazias escondem); os quadros do "frame" têm plano B; novo conferidor
  `scripts/cobertura.mjs`; `som.py` diz a linha da palavra que falta e só põe a música com `--cama`; `mixar.sh` funciona
  sem trilha e nunca corta o vídeo. O plano aprovado sai igual, quadro a quadro (com `arroba` e `foto` passados).
