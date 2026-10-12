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
| `public/voz.wav` | a voz (prop `voz`); a duração dela dá a duração do som em `scripts/som.py` |
| `src/palavras.json` | `[{text,start,end}]`; `src/tema.ts` converte para `P = {duracao, palavras:[{texto,de,ate}]}` |
| `src/rosto.json` | `[[t,cx,cy,h]]` a cada 0,25 s; `rostoX(t)` segue o rosto na horizontal (média de ±1 s) |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, só com `previas: true` (9:16, já acelerados 3x, sem som) |

Gerado pelo molde (não é entrada): `src/rosto_med.json` (mediana de olhos, largura e queixo em px, por
`scripts/rosto.py`), `public/sfx.wav` e `public/sfx_previas.wav` (por `scripts/som.py`). Fixo do molde:
`public/foto.jpg` (avatar dos cards de Instagram).

## Composição
`VitrineDinamico01` (1080x1920, 30 qps, `DURACAO` em `src/tema.ts`), props
`{voz: boolean, previas: boolean, nomesPrevias: [string, string]}`, padrão
`{voz: true, previas: false, nomesPrevias: ['modelopadrao01', 'youtubeedition01']}`.

- `src/tema.ts`: cores, fontes, `w(palavra, n)` (início da n-ésima ocorrência), `montaCenas(previas)` (o plano).
- `src/Cenas.tsx`: uma cena por frase (`CENA_COMP`); `PreviasCena` é o dividido das prévias.
- `src/ui.tsx`: card de rosto, título, troca, cursor, seleção. `src/Legenda.tsx`: a legenda por modo.

## Como gerar (de dentro de `moldes/modelodinamico01/` ou `videos/<v>/`)
1. Rosto médio: `../../.venv/Scripts/python.exe scripts/rosto.py` → `src/rosto_med.json` (YuNet em
   `../../tools/modelos/`).
2. Som: `../../.venv/Scripts/python.exe scripts/som.py` → `public/sfx.wav`; com `--previas` → `public/sfx_previas.wav`
   (soma os sons das prévias). `--saida <arquivo.wav>` grava em outro lugar.
3. Render (sem música; a voz vem do próprio render):
   ```
   QUEM=modelodinamico01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineDinamico01 out/so-voz.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"voz":true,"previas":false,"nomesPrevias":["modelopadrao01","youtubeedition01"]}'
   ```
   Com prévias: `"previas":true` e os dois nomes dos modelos das prévias.
4. Mixar: `sh scripts/mixar.sh out/so-voz.mp4 public/sfx.wav out/final.mp4` (efeitos 10 dB abaixo, ~16 LU sob a voz;
   loudnorm -14 LUFS / -1 dBTP em duas passadas). Com prévias, use `public/sfx_previas.wav`.

## Conferência
Não há checador automático neste molde. Conferir por quadros:
- `node scripts/quadros.mjs [--previas] 1 13.8 28.4` → `conferencia/q_*.png` (`ESCALA=1` para tamanho cheio).
- `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png q2.png ...` (folha).
- `scripts/lado_a_lado.py` monta nosso quadro sobre o da referência; precisa de `conferencia/final_*.png` e
  `conferencia/ref/` com quadros de `../../modelos/modelodinamico01/referencias/` (os nomes estão na lista `PARES`).
- Stills rápidos: `QUEM=modelodinamico01 sh ../../tools/com-trava.sh npx remotion still src/index.ts VitrineDinamico01 ../../.tmp/q.png --frame=150 --props='...'`.

## O que é específico do vídeo de origem (refazer num vídeo novo)
Tudo abaixo está preso à fala da vitrine e muda a cada vídeo:
- `DURACAO` em `src/tema.ts` (30,36 s) e a lista `base(previas)` de `montaCenas`: a cena de cada frase e o modo dela.
- As cenas de `src/Cenas.tsx`, presas às palavras pelo `w('palavra')`. O plano da vitrine:

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

- A lista `MODELOS` e os textos de tela (pasta `2026-10-10-vitrine/`, `videos /`, `/modelodinamico01`) são da vitrine.
- Os eventos de som de `scripts/som.py` repetem os eventos visuais das cenas (corte, clique, item, ✓, tecla) e usam as
  mesmas palavras; refazer junto com as cenas.
- Sem prévias, 14,44 a 21,41 fica quase todo rosto (a cena foi feita para as prévias).

## Origem
Copiado da vitrine dos modelos (2026-10-10), que partiu do reel aprovado de 2026-10-05. Ao entrar no estúdio, o molde
passou a ler a entrada padrão (antes lia um `palavras.json` convertido e `rosto_t.json`), a mediana do rosto virou
`src/rosto_med.json` e os caminhos de Python e modelos passaram a ser `../../.venv` e `../../tools/modelos`.
