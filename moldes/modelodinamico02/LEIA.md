# Molde modelodinamico02

O código e a mídia do Reel "Esse vídeo foi editado 100% pelo Claude Code" no **modelodinamico02** (9:16, ~45 s):
a voz do Jessé sem o rosto, só animação tipográfica. Uma tela por vez, corte seco com troca de fundo (preto quente
↔ laranja Claude), algumas telas abrindo em íris. Regras do modelo: `../../modelos/modelodinamico02/MODELO.md`.
Vídeo novo: copiar este molde para `../../videos/<AAAA-MM-DD-tema>/` e refazer o que está em "O que é específico".

Origem: `conteudo/2026-10-05-reel-editado-pelo-claude` (texto histórico; nada aqui aponta pra lá). Aquele projeto
também tinha o modelopadrao01 e o modelodinamico01; aqui ficou só o que o modelodinamico02 usa.

## A entrada (não é a entrada padrão de rosto)
Só a voz. Não há vídeo da pessoa na tela.

| O quê | Onde mora | Como nasce |
|---|---|---|
| Voz | `public/d1/voz.wav` (44,4 s, a fala já decupada) | áudio da gravação decupada: `ffmpeg -i <decupado.mp4> -vn -ac 2 -ar 48000 public/d1/voz.wav` (ou `../../tools/preparar.py`, que grava `public/voz.wav`) |
| Palavras | `src/d1/palavras.json`, formato `{duracao, palavras: [{texto, de, ate}]}` (não é o `[{text,start,end}]` do contrato: converter na entrada) | Whisper: `../../.venv/Scripts/python.exe ../../tools/transcribe.py public/d1/voz.wav <pasta>` (modelo em `../../tools/.cache`), convertido e conferido contra a fala |
| Imagens | `public/d1/foto.jpg` (foto do perfil no fecho) e `public/d1/q/f600.jpg`, `f602.jpg` (quadros reais que enchem a palavra "frame") | à mão |
| Trilha | `public/d2/trilha.wav` (cama Am-F-C-G + golpes nas trocas de tela, sintetizada) | `d2/som.py` |

Os nomes `d1/` são herança do projeto de origem (a voz e as palavras eram do modelodinamico01); o código lê esses
caminhos, então mantenha-os ou troque junto em `src/d2/tema.ts`, `src/d2/Reel.tsx` e `src/d2/Cenas.tsx`.

## Composição
- `src/index.ts` → `src/Root.tsx`: composição **`Dinamico02`**, 1080x1920, 30 qps, duração = `palavras.duracao` +
  0,9 s (`DURACAO` em `src/d2/tema.ts`). Props: **`{voz: boolean}`** (padrão `false`; `true` toca
  `public/d1/voz.wav` no render).
- `src/d2/Cenas.tsx`: a lista `CENAS` (cada tela: fundo `E` escuro ou `L` laranja, linhas de texto com tamanho,
  fonte e efeito por palavra, herói animado opcional, `iris`) e os heróis (Cem, Arquivo, Mira, Prompt, Pastas,
  Cento, Frame, Orbita, Fichas, Guias, Carimbo...). Cada tela começa 0,06 s antes da primeira palavra dela
  (`tempoDe`).
- `src/d2/Reel.tsx`: troca seca de tela e a íris (~15 quadros, anel creme). `src/d2/tema.ts`: cores, fontes
  (Inter, Pinyon Script, Instrument Serif, Geist Mono), easings.
- `node_modules` é junção para `../../node_modules` (Remotion 4.0.530). Nunca `npm install` aqui.

## Renderizar e mixar (de dentro de `moldes/modelodinamico02/`)
1. `../../.venv/Scripts/python.exe d2/som.py` → `public/d2/trilha.wav` (~4 s).
2. `QUEM=modelodinamico02 sh ../../tools/com-trava.sh npx remotion render src/index.ts Dinamico02 out/so-voz.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"voz":true}'`
3. `sh d2/mixar.sh out/so-voz.mp4 public/d2/trilha.wav out/reel-dinamico02.mp4` (trilha abaixa sob a voz por
   sidechain; loudnorm -14 LUFS / -1 dBTP em duas passadas). O original saiu com 45,3 s, -14,3 LUFS, pico -1,0.

Conferir quadros: `QUEM=modelodinamico02 sh ../../tools/com-trava.sh node d2/quadros.mjs 2.6 9.9` →
`conferencia/d2/q_*.png`. Stills de prova: `conferencia/prova_f0240.jpg`, `prova_f0900.jpg`.

## O que é específico do vídeo de origem
- A voz, `src/d1/palavras.json` e as imagens de `public/d1/`.
- Em `src/d2/Cenas.tsx`: a lista `CENAS` inteira (o plano frase a frase: textos, quebras, tamanhos, fundos, íris) e
  os heróis feitos pra este roteiro (100%, arquivo, prompt, pastas do método, 160+, frame por frame, guias,
  carimbo de teste, perfil). Os componentes de tipografia, a troca seca e a íris são do modelo e ficam.
- Em `d2/som.py`: a lista `cortes` e os instantes dos efeitos, presos às palavras deste roteiro (`w('palavra', n)`).
