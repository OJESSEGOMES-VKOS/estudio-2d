# Molde superpodcast01

O **superpodcast01** é o corte de podcast montado como minidocumentário (`../../modelos/superpodcast01/MODELO.md`, refs
1, 2 e 3): a fala alterna entre quatro mundos com corte seco (palco vazio sob um foco, rosto recortado num estúdio frio
#131A1E, papel claro com fotos sem moldura, B-roll em tela cheia) e uma tela dividida palco/close. O texto fica no modo
conversa (Inter SemiBold entrando no lugar com fade e desfoque), a palavra-chave em Playfair Display Black Italic
vermelha #E0030A letra por letra saindo do borrão, terço inferior mono (JetBrains Mono) com letras embaralhando,
vazamento de luz na abertura e na virada, trilha fria sintetizada. Este molde é o código do vídeo da vitrine aprovado
(revisão 1 de 2026-10-12), autocontido no estúdio.

## Entrada

| Arquivo | Uso |
|---|---|
| `public/fala.mp4` | a gravação (só para gerar `public/fala_grade.mp4`; a composição lê a graduada) |
| `public/fala_grade.mp4` | a pessoa recortada (RVM) no estúdio frio, sem som. Sai do `scripts/grade.py` |
| `public/voz.wav` | a voz limpa (entra na mixagem) |
| `src/palavras.json`, `src/rosto.json` | palavras com tempo e rosto a cada 0,25 s |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, com `previas: true` (9:16, já em 3x, sem som, ~6 s) |
| `public/palco.png`, `public/broll_edicao.png`, `public/broll_celular.png` | imagens geradas na kie.ai (originais e prompts em `material/`, `material/GERADAS.md`) |
| `public/cards/*.jpg` | quadros das edições dele nos outros modelos (a colagem do papel) |
| `public/trilha.wav` | a trilha, sai do `scripts/trilha.py` |

O `node_modules` é uma junção para `../../node_modules` (nunca `npm install` aqui).

## Composição e props

- `VitrineSuperPodcast01` (`src/Root.tsx`), 1080x1920, 30 qps, `DURACAO` = 30,16 s (906 quadros), em `src/Reel.tsx`.
- Props: `{previas: boolean, nomesPrevias: [string, string]}` (padrão `previas: false`,
  `['modelodinamico01', 'modelopadrao01']`).
- A composição não toca som: a voz e a trilha entram no `scripts/mixar.sh`.

## Gerar, mixar e renderizar (de dentro de `moldes/superpodcast01/` ou da cópia em `videos/<v>/`)

Um processo pesado por vez; render sempre pela trava (TEMP vai para `../../.tmp`).

1. Rosto graduado: `../../.venv/Scripts/python.exe scripts/grade.py` gera `public/fala_grade.mp4` (RVM em
   `../../tools/modelos/rvm_mobilenetv3_fp32.onnx`; o onnxruntime do venv roda na CPU, conte ~10 min).
   Com números (`scripts/grade.py 1 13 22`) só grava PNGs de teste em `conferencia/`.
2. Trilha: `../../.venv/Scripts/python.exe scripts/trilha.py` grava `public/trilha.wav` (`SAIDA=<pasta>` grava em outra pasta).
   Duração fixa no topo do script (`D = 30.16`): num vídeo novo, acerte para a duração nova.
3. Render sem som:
   ```
   QUEM=superpodcast01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineSuperPodcast01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"previas":true,"nomesPrevias":["<modelo da previa1>","<modelo da previa2>"]}'
   ```
4. Mixagem: `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` (voz de `public/voz.wav` com
   compressor, trilha -6 dB com ducking, loudnorm -14 LUFS / -1 dBTP em duas passadas; a trilha fica ~16 dB abaixo).
5. Stills: `QUEM=superpodcast01 sh ../../tools/com-trava.sh npx remotion still src/index.ts VitrineSuperPodcast01 ../../.tmp/q.png --frame=150 --props='{"previas":true,"nomesPrevias":["a","b"]}'`.
   Quadros em lote: `node scripts/quadros.mjs [--previas] 1 14.3 29.9` (`ESCALA=1` para tamanho cheio, saem em
   `conferencia/`). Folhas: `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ... [--cols 6]`;
   `scripts/lado_a_lado.py` monta nosso quadro contra o da referência (precisa de `conferencia/ref/`).

## Checador

- `node scripts/sincronia.mjs` (tem que sair `0 erros`): cada palavra nasce no seu start (±2 quadros), cada corte cai
  na 1ª palavra do plano novo, toda fala aparece uma vez, máx. 4 linhas por bloco, legenda padrão em até 2 posições,
  zona segura 9:16 (y 250-1500, x 60-940). Confere com e sem prévias.
- `../../.venv/Scripts/python.exe scripts/tempos.py`: tempo de leitura de cada bloco contra 1 s + 3 palavras/s,
  palavra-chave completa >= 0,8 s, nada atravessando corte; grava `conferencia/tempos.json`. Na fala da vitrine 16 de
  17 blocos ficam abaixo da regra de leitura (fala de 3,3 palavras/s); isso foi aceito, o que importa são as
  palavras-chave e os terços inferiores.

## O que é específico do vídeo de origem (refazer num vídeo novo)

Tudo que está preso à fala da vitrine ("Esse vídeo está sendo 100% editado pelo Claude...", 30,16 s) mora em
`src/Reel.tsx` e no `plano.md`:
- `DURACAO`, a lista `PLANOS` (13 planos P1-P13, cada um com tempo, mundo e enquadramento `q` sobre o rosto),
  `CORTES` e `JANELA_PREVIAS` (14,5-19,99 s, a tela dividida do P8).
- `blocos`: cada bloco de texto com os ids das palavras de `palavras.json`, a palavra-chave e a posição. Os ids só
  valem para esta fala.
- O conteúdo dos mundos: quais cards entram na colagem (P3, P10), o celular que explode no "Instagram" (P6), os
  B-rolls (P4 e P12, imagens geradas para esta fala), os terços inferiores (JESSÉ GOMES na 1ª aparição), os dois
  vazamentos (abertura e "Mas" em ~20,0 s) e o fecho com "edição" repetindo o P10.
- `scripts/trilha.py`: duração e as batidas presas aos tempos (abertura e 2º vazamento em 20,15 s).
- `scripts/sincronia.mjs`: as exceções de posição da legenda nos blocos de 26,69 e 28,27 s.

O que se aproveita igual num vídeo novo: os componentes dos mundos, a tipografia e a medida de fonte, o grade do
rosto, a tela dividida com as prévias, a mixagem e os checadores. O vídeo novo refaz o plano frase a frase sobre a fala
nova seguindo o MODELO.md e gera imagens novas para palco e B-roll com `../../kit/` (kie.ai via
`../../kit/.venv/Scripts/python.exe`).

## Histórico

Primeira aplicação do modelo (vitrine de 2026-10-10). Revisão 1 (2026-10-12, correções do Jessé): cortes no start da
palavra, saiu o terço inferior SUPERPODCAST01, legenda padrão em 2 posições, "edição" do fecho entre aspas. O que ficou
diferente das referências: palco vazio gerado (não há gravação de palco e gente não se gera), luz frontal com queda
lateral feita no grade, 12 trocas contra 34 da ref1 (nada atravessa corte), B-roll gerado em vez de arquivo de época.
