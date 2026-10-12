# Molde: storypodcast01

Corte de podcast de reflexão em 9:16 (ref3 como principal): estúdio escuro e frio feito por grade (a pessoa recortada
com RVM, o fundo vira breu petróleo `#111A1B` desfocado com faixas de painel, pretos esmagados, pele quente, queda de luz
lateral), uma câmera em vários planos (médio com o rosto de lado, aberto, close, reenquadre, close extremo P&B uma vez),
poucos cortes (6 na vitrine, 1 nos 9 s iniciais), palavra-chave gigante em Anton condensada colorida pelo sentido (azul
`#0A64FC` com brilho = o que se busca, vermelho `#FD1701` = custo, branco em degradê = resposta neutra) revelada letra a
letra fora de ordem do desfoque, legenda Poppins 400/600 em y 1050 ou 1400 com negrito no trecho de peso, chicote de 1
quadro no fecho, corte seco 0,2 s depois da última palavra. Trilha: pad escuro de 4 acordes, sopro no P&B, whoosh no
chicote. Texto só em x 60–940, y 250–1500. As regras estão em `../../modelos/storypodcast01/MODELO.md` (§18b para a
revisão 1); este molde é o código da primeira aplicação do modelo (a vitrine).

## Entrada (contrato padrão)
| Arquivo | Uso |
|---|---|
| `public/fala.mp4` | o vídeo (com `efeitoFundo: false`) e a fonte do grade |
| `public/voz.wav` | a voz (na composição e na mixagem) |
| `src/palavras.json` | `[{text,start,end}]`, usado direto pelos índices das palavras |
| `src/rosto.json` | `[[t,cx,cy,h]]`; a mediana por plano dá o enquadramento, e o grade usa o rosto para a queda de luz |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, só com `previas: true` (9:16, já 3x, sem som) |

Gerado pelo molde: `public/fala_grade.mp4` (o vídeo com o grade, sem som, por `scripts/grade.py`; usado com
`efeitoFundo: true`) e `public/trilha.wav` (por `scripts/trilha.py`).

## Composição
`VitrineStoryPodcast01` (1080x1920, 30 qps, `DURACAO` = 29,83 em `src/Reel.tsx`), props
`{previas: boolean, nomesPrevias: [string, string], musica?: boolean, efeitoFundo?: boolean}`, padrão
`{previas: false, nomesPrevias: ['modelodinamico01', 'modelopadrao01']}` com `musica` e `efeitoFundo` desligados. A
vitrine usa as duas `true`. Com `musica` a composição toca voz + trilha (prévia no Studio); o render final sai `--muted`
e o som vem do `mixar.sh`. Em `src/Reel.tsx`: `PLANOS` (cortes e enquadramentos), `PECAS` (textos), a revelação das
letras, o P&B, `PreviasEmCima` (câmera desce 560 px, prévias 340x604 em y 70).

## Como gerar (de dentro de `moldes/storypodcast01/` ou `videos/<v>/`)
1. Grade: `QUEM=storypodcast01 sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/grade.py` →
   `public/fala_grade.mp4` (RVM em `../../tools/modelos/`; pesado, vai pela trava). Com números (`grade.py 1 13 22`) sai
   só PNG de teste em `conferencia/`; `--saida <arquivo.mp4>` grava o vídeo em outro lugar.
2. Trilha: `../../.venv/Scripts/python.exe scripts/trilha.py` → `public/trilha.wav` (`--saida` grava em outro lugar).
3. Checador: `node scripts/cobertura.mjs` (abaixo).
4. Render:
   ```
   QUEM=storypodcast01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineStoryPodcast01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2 --muted --props='{"previas":true,"nomesPrevias":["modelopadrao01","profissional01"],"musica":true,"efeitoFundo":true}'
   ```
5. Mixar: `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` (voz de `public/voz.wav` na frente,
   trilha -5 dB com ducking, ~16 dB abaixo da voz, loudnorm -14 LUFS / -1 dBTP em duas passadas).

## Checador
`node scripts/cobertura.mjs`. Confere: toda palavra escrita na tela enquanto é dita, pedaço ≥ 1,5 s e palavra ≥ 0,4 s,
cada palavra exatamente uma vez, bloco com até 4 linhas, legenda só em 1050 e 1400, nenhum texto cruzando outro, tudo
na zona segura, fontes usadas = importadas e a conta de cortes (no máximo 1 nos 9 s iniciais). Na vitrine: 96 palavras,
0 em tudo, 6 cortes.

Quadros: `node scripts/quadros.mjs [--previas] 1 14.7 28.6` (`ESCALA=1` para tamanho cheio);
`../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ... [--cols 6]`; `scripts/lado_a_lado.py` precisa de
`conferencia/ref/` com quadros de `../../modelos/storypodcast01/referencias/`.

## O que é específico do vídeo de origem (refazer num vídeo novo)
- `DURACAO` (29,83 = última palavra + 0,2 s) em `src/Reel.tsx` e o `D` igual em `scripts/trilha.py`.
- `PLANOS` e `PECAS` de `src/Reel.tsx` (índices das palavras, palavra-chave e cor de cada bloco, o P&B em "você está
  vendo apenas um desses modelos", EDIÇÃO no fecho) e os eventos de `scripts/trilha.py` (sopro no P&B, whoosh no chicote).
- `plano.md` é o plano frase a frase da 1ª versão; a revisão 1 juntou planos e pedaços (a lista atual sai impressa pelo
  checador).
- O plano atual da vitrine (revisão 1): abertura 0–6,68 s com o bloco "esse vídeo está sendo 100% editado pelo CLAUDE";
  "a DIFERENÇA entre vários MODELOS"; close do QUALQUER; aberto na virada "Inclusive"; P&B em "você está vendo APENAS um
  desses modelos." (sem o nome do modelo escrito); prévias de 15,20 a 19,93 s; virada "Mas se você QUISER"; destaque em
  "outros modelos de EDIÇÃO"; chamada com chicote: comenta "EDIÇÃO" fixo e o resto na legenda.

## Origem
Copiado da vitrine dos modelos (revisão 1, 2026-10-12), a primeira aplicação do modelo. Ao entrar no estúdio, o grade
passou a usar o RVM de `../../tools/modelos/` e o Python do `../../.venv`. Esse venv tem o onnxruntime de CPU: o grade
avisa que não achou CUDA e roda na CPU, mais devagar que antes.
