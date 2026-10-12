# Molde: modelopadrao01

O estilo do reel "100% editado pelo Claude Code" (v1 a v4): rosto cheio com dois enquadramentos de operador (A e B,
B 15% mais perto, olhos em y 660/650, fixo dentro do trecho e só muda no corte), legenda sem tarja com a palavra ativa
em menta, tela dividida com pílula verde-escura na divisa, painel marfim com grade de pontos, editor "Claude Code" com o
próprio vídeo na prévia, chip do Claude com o asterisco laranja, caixa do Claude digitando, cartão branco no jeito do
Instagram no fecho. Geist 800 / Geist Mono, paleta marfim, menta, verde e o laranja do Claude. Som: cama de acordes
calma + efeitos sintetizados, com silêncio na virada. As regras estão em `../../modelos/modelopadrao01/MODELO.md`;
este molde é o código do último vídeo feito no modelo (a vitrine dos modelos, 30,36 s).

## Entrada (contrato padrão)
| Arquivo | Uso |
|---|---|
| `public/fala.mp4` | o rosto (A/B), a prévia do editor, o celular; a duração do vídeo vira `video_fim` |
| `public/voz.wav` | a voz (prop `voz`); a duração dela vira `duracao` |
| `src/palavras.json` | `[{text,start,end}]`; `src/tema.ts` converte para `P.palavras [{texto,de,ate}]` |
| `src/rosto.json` | `[[t,cx,cy,h]]` (entrada padrão; este molde não usa, ele mede o rosto por trecho em `scripts/rosto.py`) |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, só com `previas: true` (9:16, já 3x, sem som) |

Gerado pelo molde: `src/tempos.json` (o plano, por `scripts/gerar_tempos.py`), `src/rosto_med.json` (enquadramento por
trecho, por `scripts/rosto.py`), `public/trilha.wav` / `public/trilha_previas.wav` (por `audio/compor.py`). Fixos do
vídeo: `public/foto.jpg` (avatar) e `public/quadro.jpg` (um quadro da gravação, miniatura dos formatos).

## Composição
`VitrinePadrao01` (1080x1920, 30 qps, duração `T.duracao`), props `{voz: boolean, previas: boolean, nomesPrevias: [string, string]}`,
padrão `{voz: true, previas: false, nomesPrevias: ['modelodinamico01', 'youtubeedition01']}`.

- `src/tema.ts`: paleta, fontes, `P`, `T`, `R`, as janelas de cada tela. `src/Rosto.tsx`: rosto A/B e zooms.
- `src/Editor.tsx`: o editor Claude Code. `src/Cenas.tsx`: modelos, celular, prévias, outros, prompt, fecho.
- `src/Legenda.tsx`: legenda paginada. `src/ui.tsx`: peças comuns.

## Como gerar (de dentro de `moldes/modelopadrao01/` ou `videos/<v>/`)
1. Plano: `../../.venv/Scripts/python.exe scripts/gerar_tempos.py` → `src/tempos.json`.
2. Rosto por trecho: `../../.venv/Scripts/python.exe scripts/rosto.py` → `src/rosto_med.json` (lê os blocos do
   `tempos.json`; YuNet em `../../tools/modelos/`).
3. Som: `../../.venv/Scripts/python.exe audio/compor.py` → `public/trilha.wav`; com `--previas` →
   `public/trilha_previas.wav`. `--saida <arquivo.wav>` grava em outro lugar.
4. Render:
   ```
   QUEM=modelopadrao01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrinePadrao01 out/so-voz.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"voz":true,"previas":false,"nomesPrevias":["modelodinamico01","youtubeedition01"]}'
   ```
5. Mixar: `sh scripts/mixar.sh out/so-voz.mp4 public/trilha.wav out/final.mp4` (trilha 16 LU abaixo da voz + sidechain
   leve; loudnorm -14 LUFS / TP -1,2 em duas passadas). Com prévias, `public/trilha_previas.wav`.

## Conferência
Não há checador automático neste molde. Conferir por quadros:
- `node scripts/quadros.mjs [--previas] 1 13.8 28.4` → `conferencia/q_*.png` (`ESCALA=1` para tamanho cheio).
- `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ...` (folha).
- `scripts/lado_a_lado.py` põe nosso quadro sobre o do v4; precisa de `conferencia/final_*.png` e `conferencia/ref/`.
- Still rápido: `QUEM=modelopadrao01 sh ../../tools/com-trava.sh npx remotion still src/index.ts VitrinePadrao01 ../../.tmp/q.png --frame=150 --props='...'`.

## O que é específico do vídeo de origem (refazer num vídeo novo)
- Em `scripts/gerar_tempos.py`: os `BLOCOS` (cortes A/B 2 quadros antes da palavra que abre a frase), os `planos`
  A/B, e cada tela (`editor`, `modelos`, `celular`, `previas`, `outros`, `prompt`, `fecho`, `zooms`) presa às palavras
  da vitrine por `w('palavra', n)` e `corte(...)`.
- Em `src/Cenas.tsx` e `src/Editor.tsx`: os textos de tela (nomes dos modelos, `modelopadrao01`, EDIÇÃO, DM) e a busca
  por palavras como `Inclusive`.
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
