# Molde anunciocanvas01

O código e a mídia do anúncio do Marcaí (produto fictício de agendamento pra salão, barbearia e estética), 9:16,
~44 s, na **v6** (a atual; as versões anteriores não vieram pro estúdio). Cada frase da narração vira um grupo de
elementos solto num canvas infinito, e a câmera percorre um caminho contínuo entre eles, sem corte. Regras do
modelo: `../../modelos/anunciocanvas01/MODELO.md`. O Marcaí, o "Studio Aurora", a Bia e o Teo são adereços do plano de
exemplo (fictícios): num anúncio real, só dado real do cliente.

Origem: `modelos/anunciocanvas01/aplicacoes/2026-10-10-anuncio-canvas-marcai` (texto histórico; nada aqui aponta pra lá). É o mesmo roteiro,
voz e som do anúncio do anunciomotion01.

## A entrada (não é a entrada padrão de rosto)
Não há pessoa gravada. O vídeo é narração + elementos desenhados em código + as telas do produto.

| O quê | Onde mora | Como nasce |
|---|---|---|
| Roteiro | `roteiro.txt` (o texto falado, inteiro) | à mão (+ `/humanizer`) |
| Narração e palavras | `public/voz.wav` + `src/palavras.json`, ou `public/voz.mp3` + `src/palavras.json` | gravada: `tools/novo-video.py` (dá `voz.wav` e `[{text,start,end}]`); gerada: `../../kit/voz.py` (gasta crédito; dá `.mp3` e `[{w,s,e}]`). O molde lê os três formatos de palavras, inclusive o da vitrine `{duracao, palavras: [{texto, de, ate}]}` |
| Som final (opcional) | `public/som.m4a` (voz + trilha + efeitos já mixados); sem ele, o render toca só a narração | mixado fora; trilha/efeitos pelo `../../kit/audio_ia.py` (gasta crédito) |
| Telas do produto (opcionais) | `public/reserva.png`, `public/confirmado.png` (celular, 1170x2532), `public/painel.png` (2160x1440) | os prints reais do produto anunciado. **Sem eles, o molde desenha uma tela de app genérica no lugar** (`TelaGenerica` em `src/ui.tsx`) |

O `node_modules` é junção para `../../node_modules` (Remotion 4.0.530). Nunca `npm install` aqui.

## Composição
- `src/index.ts` → `src/Root.tsx`: composição **`Anuncio`**, 1080x1920, 30 qps, duração = `duracao` das palavras +
  2,35 s (`DURACAO` em `src/tema.ts`; com `[{text,start,end}]` ou `[{w,s,e}]`, `duracao` é o fim da última palavra).
  Props: **`{voz: boolean}`** (padrão `true`: toca `public/som.m4a`, ou `voz.wav`/`voz.mp3` se não houver o mix; sem
  nenhum, para e diz o que falta).
- `src/Canvas.tsx` (v6): `FALA` (o texto para o qual o plano foi feito), `FRASES` (cada frase = intervalo de índices
  de palavra + tom `marca`/`dor`/`noite`/`claro`), a câmera (keyframe no meio de cada frase, Hermite "auto bezier"; cada
  passagem sorteia com semente fixa entre fluxo, curva e chicote; a virada é sempre chicote e o fecho, curva), a
  `Coreografia` (onde cada elemento mora no canvas e quando entra) e o `Fundo` que muda de cor por tom.
- `src/ui.tsx`: peças (celular, bolha, notificação, pílula, marca-texto, ícone de vidro, wordmark com o texto por prop,
  glitch, tela genérica). `src/tema.ts`: cores, fontes (Sora e Caveat), easings, `w('palavra', n)` que acha o instante
  de uma palavra e `seq()` que tempora uma linha escrita.

## Vídeo novo

1. Narração e palavras, num destes jeitos (de dentro da pasta do vídeo, `videos/<AAAA-MM-DD-tema>/`, que nasce com
   `tools/novo-video.py anunciocanvas01 <narracao> <AAAA-MM-DD-tema>` da raiz):
   - **gravada:** o `novo-video.py` já põe `public/voz.wav` e `src/palavras.json` (ele ainda não aceita áudio puro: ponha
     o áudio num vídeo preto antes, `ffmpeg -f lavfi -i color=c=black:s=1080x1920:r=30 -i narracao.wav -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac narracao.mp4`);
   - **gerada:** escreva `roteiro.txt` e rode, da raiz do estúdio,
     `kit/.venv/Scripts/python.exe kit/voz.py videos/<pasta>/roteiro.txt videos/<pasta>/public/voz.mp3 --voz <voice_id>`
     e copie `public/voz.palavras.json` por cima de `src/palavras.json`.
2. **Refazer o plano em `src/Canvas.tsx` sobre a fala nova.** Enquanto ele for o da vitrine, o vídeo para ao carregar
   com `O plano não bate com a fala` (diz a palavra que difere).
   - `FALA` (linha 24): o texto da fala nova (maiúscula, acento e pontuação não contam).
   - `FRASES` (linha 41): as frases cobrem a fala inteira, em ordem (o molde confere e diz qual está fora).
   - A `Coreografia`: um bloco por frase, `<El k={frase} ...>`; cada linha escrita com `<L de={segundos} txt="..."/>`
     (as palavras como foram ditas; o molde para dizendo qual não bate) e os instantes por `w('palavra', n)`.
   - Em `src/tema.ts`, a paleta; o wordmark é a prop `texto` do `<Wordmark>` (um `ı` sem pingo ganha o acento).
3. Telas do produto (opcionais): os prints reais em `public/` com os nomes da tabela; para um produto fictício, gerar
   pela kie.ai no mais barato (1K, 4 créditos cada), da raiz:
   `kit/.venv/Scripts/python.exe kit/gerar.py "tela de app de agendamento, <o que a tela mostra>, interface limpa, sem logo de terceiros" videos/<pasta>/public/reserva.png --formato 9:16`
   (o `painel.png` com `--formato 3:2`). Sem elas, sai a tela genérica.
4. Olhar quadros (perto das trocas de frase a câmera está em trânsito; escolha o meio da frase), numa chamada só:
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts Anuncio conferencia/q --sequence --frames=300-302 --image-format=jpeg --scale=0.5`.
5. Render (o som entra no render): `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts Anuncio out/video.mp4 --codec=h264 --crf=16 --concurrency=2`.
6. `sh scripts/finalizar.sh out/video.mp4 out/final.mp4` (loudnorm -14 LUFS / -1 dBTP, do tamanho do vídeo). Música é
   opção: só entra se você mixar o `public/som.m4a` (trilha ~16 dB abaixo da voz) antes do render.

Sem checador de legenda: o texto aqui não é legenda corrida (cada frase se espalha em peças pelo canvas e sai de
quadro com a câmera); a conferência do plano contra a fala roda ao carregar o vídeo.

## O vídeo de origem (a vitrine)
- `roteiro.txt`, `public/voz.wav`, `public/som.m4a`, `src/palavras.json` e as 3 telas em `public/`.
- Em `src/Canvas.tsx`: `FALA`, a lista `FRASES` (índices e tons), a `Coreografia` inteira (cada elemento é deste roteiro:
  23h47, quarta 15, relógio, sinal no Pix, painel, "12", os três neons de salão/barbearia/estética, botão "Teste
  grátis", marca) e a semente das passagens. O motor de câmera e o `Fundo` são do modelo e ficam.
- Em `src/tema.ts`: a paleta do Marcaí. Stills de prova da vitrine: `conferencia/prova_f0360.jpg`, `prova_f0900.jpg`
  (só no estúdio local).
