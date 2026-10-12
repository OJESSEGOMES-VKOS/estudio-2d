# Molde: modelodinamico03

Corte de podcast cinematográfico em 9:16: uma câmera alternando aberto (zoom 1,0) e fechado (1,3) nos cortes, com zoom
lento dentro do plano; grade âmbar com vinheta e grão (prop `tratamento`); blocos de destaque em 3 vozes (Inter Tight
800 apertada, Playfair itálica, Anton em caixa alta, vermelho `#E01E1E` só na palavra-chave) nascendo do desfoque palavra
a palavra entre o queixo e a legenda; legenda serifada calma no peito (`LEG_Y` 1220, 2ª posição `LEG_Y2` 1363 enquanto um
destaque está na tela e nas prévias), em páginas de até 2 linhas; transições de textura (desfoque, flash branco, chicote;
VHS só com a prop `efeitos`); tela de respiro e fecho "Comenta / “PALAVRA”". Todo texto em x 60–940, y 250–1500.
Trilha escura de trailer com efeitos só nas texturas. As regras (as 6 rodadas de 2026-10-12) estão em
`../../modelos/modelodinamico03/MODELO.md`; este molde é o código do último vídeo aprovado (a vitrine, 30,36 s).

## Entrada (contrato padrão)
| Arquivo | Uso |
|---|---|
| `public/fala.mp4` | a câmera (aberto/fechado, prévias, respiro) |
| `public/voz.wav` | a voz, que entra só na mixagem (`scripts/mixar.sh`); a duração dela vira `D` em `scripts/som.py` |
| `src/palavras.json` | `[{text,start,end}]`, usado direto pelos índices das palavras |
| `src/rosto.json` | `[[t,cx,cy,h]]`; dá o queixo medido (o texto mora abaixo dele) |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, só com `previas: true` (9:16, já 3x, sem som) |

Gerado pelo molde: `public/trilha.wav` (`scripts/som.py`).

## Composição
`VitrineDinamico03` (1080x1920, 30 qps, `DURACAO` em `src/Reel.tsx`), props
`{previas: boolean, nomesPrevias: [string, string], tratamento: boolean, efeitos: boolean}`, padrão
`{previas: false, nomesPrevias: ['modelodinamico01', 'modelopadrao01'], tratamento: false, efeitos: false}`.
O render sai **sem som**; a voz e a trilha entram no `mixar.sh`. A vitrine foi renderizada com `tratamento: true`.

Tudo mora em `src/Reel.tsx`: `TRECHOS`/cortes (índices das palavras), `BLOCOS` (destaques), `PAGINAS`/`PEDACOS` (legenda),
`ajustes()` (subida e zoom da câmera em cada plano com destaque), `PreviasEmCima`, `ZONA`, `PADRAO` (escala dos
destaques, 0,9) e `exibicoes()`/`palavrasNaTela()` (usados pelo checador).

## Como gerar (de dentro de `moldes/modelodinamico03/` ou `videos/<v>/`)
1. Trilha: `../../.venv/Scripts/python.exe scripts/som.py` → `public/trilha.wav` (drone, whoosh nos desfoques e no
   chicote, sopro antes do flash, impacto grave nas palavras vermelhas). `--efeitos` põe o glitch do VHS (use junto com a
   prop `efeitos: true`); `--saida <arquivo.wav>` grava em outro lugar.
2. Render:
   ```
   QUEM=modelodinamico03 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineDinamico03 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"previas":false,"nomesPrevias":["modelodinamico01","modelopadrao01"],"tratamento":true,"efeitos":false}'
   ```
3. Mixar: `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` (voz de `public/voz.wav` na frente,
   trilha ~16 dB abaixo com ducking, loudnorm -14 LUFS / -1 dBTP em duas passadas).

## Checador
`node scripts/cobertura.mjs` (usa o esbuild do `node_modules` do estúdio). Confere: toda palavra escrita na tela enquanto
é dita (0 buracos), pedaço ≥ 1,5 s e palavra ≥ 0,4 s, nenhuma palavra exibida duas vezes, posições de repouso da legenda,
nenhum texto no rosto, destaque sem bater na legenda, tudo na zona segura e destaque ≥ 85% do padrão. Rode de novo a cada
mudança do plano. Na vitrine: 96 palavras, 0 em todas as regras.

Quadros: `node scripts/quadros.mjs [--previas] 1 13.8 28.4` → `conferencia/q_*.png` (`ESCALA=1` para tamanho cheio);
`../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ... [--cols 6]`; `scripts/lado_a_lado.py` precisa de
`conferencia/ref/` com quadros de `../../modelos/modelodinamico03/referencias/`.

## O que é específico do vídeo de origem (refazer num vídeo novo)
- `DURACAO` em `src/Reel.tsx` e todos os índices de palavra (`TRECHOS`, `BLOCOS`, `PAGINAS`, `PEDACOS`) apontam para a
  fala da vitrine; uma fala nova refaz o plano inteiro e roda o checador.
- Os índices de `scripts/som.py` (whoosh, flash, impactos, VHS em 35 e 83) são os mesmos cortes; refazer junto.
- `nomesPrevias` padrão e o de `scripts/quadros.mjs` são os da vitrine.
- O plano da vitrine:

| De (s) | Fala | Câmera / transição | Na tela |
|---|---|---|---|
| 0,00 | Esse vídeo está sendo 100% editado pelo Claude. | aberto | bloco "Esse vídeo está sendo" + contador 0 a 100% + "editado pelo Claude." |
| 3,84 | (Ele foi criado) justamente para te mostrar | corte seco, fechado | legenda |
| 4,90 | a diferença entre vários modelos que eu criei e melhorei | fechado | "a diferença entre / *vários*" com MODELOS vermelho atrás |
| 8,04 | para editar | desfoque, aberto | legenda |
| 8,44 | qualquer tipo de vídeo (usando o Claude. Inclusive,) | aberto | "*qualquer* tipo de / VÍDEO" |
| 11,12 | se você estiver no Instagram agora, você está vendo apenas | fechado | legenda |
| 13,18 | um desses modelos. | fechado | "*um desses modelos.*" (sem o nome do modelo) |
| 15,20 | (Eu posso até) colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | flash branco, aberto ou dividido com as prévias | legenda; prévias de 15,20 a 19,93 |
| 19,93 | Mas se você quiser realmente ver | desfoque | legenda sobre o plano normal |
| 21,85 | outros modelos de edição como esse | tela de respiro (fundo borrado) | "outros modelos / de EDIÇÃO / como esse" |
| 24,15 | e aprender a como usar isso nos seus vídeos, | chicote, aberto | legenda |
| 26,69 | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | fecho | Comenta / “EDIÇÃO” fixos + legenda |

## Origem
Copiado da vitrine dos modelos (2026-10-10, com as 6 rodadas de correção de 2026-10-12), que partiu do vídeo aprovado
do modelo de 2026-10-08. Ao entrar no estúdio, o Python passou a ser o `../../.venv`, a duração da trilha passou a ser
medida de `public/voz.wav` e os comentários deixaram de apontar para a base da vitrine.
