# Molde anunciocanvas01

O código e a mídia do anúncio do Marcaí (produto fictício de agendamento pra salão, barbearia e estética), 9:16,
~44 s, na **v6** (a atual; as versões anteriores não vieram pro estúdio). Cada frase da narração vira um grupo de
elementos solto num canvas infinito, e a câmera percorre um caminho contínuo entre eles, sem corte. Regras do
modelo: `../../modelos/anunciocanvas01/MODELO.md`. Vídeo novo: copiar este molde para
`../../videos/<AAAA-MM-DD-tema>/` e refazer o que está em "O que é específico".

Origem: `conteudo/2026-10-10-anuncio-canvas-marcai` (texto histórico; nada aqui aponta pra lá). É o mesmo roteiro,
voz e som do anúncio do anunciomotion01.

## A entrada (não é a entrada padrão de rosto)
Não há pessoa gravada. O vídeo é narração + elementos desenhados em código + 3 telas do produto.

| O quê | Onde mora | Como nasce |
|---|---|---|
| Roteiro | `roteiro.txt` (o texto falado, inteiro) | à mão (+ `/humanizer`) |
| Voz | `public/voz.wav` (a narração limpa, referência pra conferir as palavras) | narração gerada (ElevenLabs pelo `../../kit/voz.py`, gasta crédito) ou gravada |
| Palavras | `src/palavras.json`, formato `{duracao, palavras: [{texto, de, ate}]}` (não é o `[{text,start,end}]` do contrato: converter na entrada) | do `kit/voz.py` (`.palavras.json`, `[{w,s,e}]`) ou do `../../tools/transcribe.py`, convertido |
| Som final | `public/som.m4a` (voz + trilha + efeitos já mixados, -14 LUFS); toca dentro do render com `voz: true` | mixado fora (no anúncio original do anunciomotion01); num vídeo novo, gerar a trilha/efeitos (`../../kit/audio_ia.py`, gasta crédito) e mixar com a voz antes |
| Telas do produto | `public/reserva.png`, `public/confirmado.png`, `public/painel.png` | prints/mockups do produto anunciado |

## Composição
- `src/index.ts` → `src/Root.tsx`: composição **`Anuncio`**, 1080x1920, 30 qps, duração = `palavras.duracao` +
  2,35 s (`DURACAO` em `src/tema.ts`). Props: **`{voz: boolean}`** (padrão `true`: toca `public/som.m4a`).
- `src/Canvas.tsx` (v6): `FRASES` (cada frase = intervalo de índices de palavra + tom `marca`/`dor`/`noite`/`claro`),
  a câmera (keyframe no meio de cada frase, Hermite "auto bezier"; cada passagem sorteia com semente fixa entre
  fluxo, curva e chicote; a virada é sempre chicote e o fecho, curva), a `Coreografia` (onde cada elemento mora no
  canvas e quando entra) e o `Fundo` que muda de cor por tom.
- `src/ui.tsx`: peças (celular, bolha, notificação, pílula, marca-texto, ícone de vidro, wordmark, glitch).
  `src/tema.ts`: cores, fontes (Sora e Caveat), easings, `w('palavra', n)` que acha o instante de uma palavra.
- `node_modules` é junção para `../../node_modules` (Remotion 4.0.530). Nunca `npm install` aqui.

## Renderizar (de dentro de `moldes/anunciocanvas01/`)
O som já entra no render; não há mixagem separada.
`QUEM=anunciocanvas01 sh ../../tools/com-trava.sh npx remotion render src/index.ts Anuncio out/video.mp4 --codec=h264 --crf=16 --concurrency=2`
Still: `QUEM=anunciocanvas01 sh ../../tools/com-trava.sh npx remotion still src/index.ts Anuncio conferencia/x.jpg --frame=360 --image-format=jpeg --scale=0.5`
(perto das trocas de frase a câmera está em trânsito e o quadro sai quase vazio: escolha o meio da frase).
Stills de prova: `conferencia/prova_f0360.jpg`, `prova_f0900.jpg`.

## O que é específico do vídeo de origem
- `roteiro.txt`, `public/voz.wav`, `public/som.m4a`, `src/palavras.json` e as 3 telas em `public/`.
- Em `src/Canvas.tsx`: a lista `FRASES` (índices e tons), a `Coreografia` inteira (cada elemento é deste roteiro:
  23h47, quarta 15, relógio, sinal no Pix, painel, "12", os três neons de salão/barbearia/estética, botão "Teste
  grátis", marca) e a semente das passagens. O motor de câmera e o `Fundo` são do modelo e ficam.
- Em `src/tema.ts`: a paleta e o wordmark do Marcaí. Produto fictício: num anúncio real, só dado real do cliente.
