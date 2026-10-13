# Molde superpodcast01

O **superpodcast01** é o corte de podcast montado como minidocumentário (`../../modelos/superpodcast01/MODELO.md`, refs
1, 2 e 3): a fala alterna entre quatro mundos com corte seco (palco vazio sob um foco, rosto recortado num estúdio frio
#131A1E, papel claro com fotos sem moldura, B-roll em tela cheia) e uma tela dividida palco/close. O texto fica no modo
conversa (Inter SemiBold entrando no lugar com fade e desfoque), a palavra-chave em Playfair Display Black Italic
vermelha #E0030A letra por letra saindo do borrão, terço inferior mono (JetBrains Mono) com letras embaralhando,
vazamento de luz na abertura e na virada, batidas nos vazamentos (trilha fria sintetizada como música opcional). Este
molde é o código do vídeo da vitrine aprovado (revisão 1 de 2026-10-12), autocontido no estúdio.

## Entrada

| Arquivo | Uso |
|---|---|
| `public/fala.mp4` | a gravação (fonte do `fala_grade.mp4`; sem ele, os mundos de rosto usam a gravação crua) |
| `public/voz.wav` | a voz limpa (entra na mixagem) |
| `src/palavras.json`, `src/rosto.json` | palavras com tempo e rosto a cada 0,25 s; a duração é a última palavra + `FOLGA` (0,53 s) |
| `public/fala_grade.mp4` | a pessoa recortada (RVM) no estúdio frio, sem som. Sai do `scripts/grade.py` (a sua gravação, sem IA) |
| `public/cards/*.jpg` + `src/cards.json` | os cards do papel (colagem, celulares, prints): quadros dos **seus** vídeos, pelo `../../tools/cards.py` |
| `public/palco.png` | opcional: o palco. Sem ele, o molde desenha o palco escuro |
| imagens de B-roll (`img` dos planos de arquivo) | opcionais: B-roll seu (foto) ou gerado. Sem a imagem, o plano de arquivo mostra a sua gravação em tom de arquivo |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais, com `previas: true` (feitas com `../../tools/previa.py`) |
| `public/trilha.wav`, `public/efeitos.wav` | o som, saem do `scripts/trilha.py` |

O `node_modules` é uma junção para `../../node_modules` (nunca `npm install` aqui). O que falta em `public/` vira o
plano B descrito acima, sem quebrar; só as prévias param o render (com o comando que as faz) se a prop pedir e elas não
existirem.

## Os mundos e o que cada um precisa (IA é opção, desligada por padrão)

O MODELO ("Regras novas") e o REGRAS §6 mandam: imagem gerada por IA no lugar de outra câmera é escolha do usuário. O
padrão do molde, sem IA nenhuma, é a sua gravação e os seus vídeos:

| Mundo | Padrão (sem IA) | Com material seu | Opção com IA (`../../kit/gerar.py`, chave própria) |
|---|---|---|---|
| rosto | a gravação, graduada pelo `scripts/grade.py` (ou crua, se não rodar o grade) | 10–20 s gravados num cômodo escuro (MODELO §15.3) viram outro plano | não se usa |
| papel | o fundo claro com os cards dos seus vídeos (`tools/cards.py`); sem cards, quadros 9:16 desenhados | fotos/prints seus como cards (`tools/cards.py` com `video@tempos`) | não precisa |
| palco | o palco escuro desenhado pelo molde (foco de cima, mesa clara) | uma foto sua do set em `public/palco.png` (9:16) | o palco vazio da vitrine (prompt em `material/GERADAS.md`) |
| arquivo | a sua gravação fria, com as bordas desfocadas | uma foto de B-roll sua em `public/` (o `img` do plano) | um B-roll gerado (prompts da vitrine em `material/GERADAS.md`) |
| dividida | o palco (desenhado ou `palco.png`) em cima, o rosto embaixo; a janela das prévias | prévias com `tools/previa.py` | não precisa |

Gerar com IA, só se você ligar: `../../kit/.venv/Scripts/python.exe ../../kit/gerar.py "<descrição>" public/palco.png
--formato 9:16` (e o mesmo para cada B-roll), anotando o prompt no `GERADAS.md`. A vitrine foi feita assim (palco e
dois B-rolls gerados), uma versão própria que o dono manteve como régua; isso não muda o padrão.

## Composição e props

- `VitrineSuperPodcast01` (`src/Root.tsx`), 1080x1920, 30 qps, `DURACAO` em `src/Reel.tsx` (o id ficou o da vitrine).
- Props: `{previas: boolean, nomesPrevias: [string, string], nome?: string, arroba?: string}`, padrão `previas: false`,
  `['modelodinamico01', 'modelopadrao01']`, `nome: ''`, `arroba: ''`. `nome` e `arroba` são o terço inferior da 1ª
  aparição do rosto: **o nome e o @ reais de quem fala na gravação**, e só se o dono do vídeo os der. Vazios, o terço
  não aparece. Nunca preencha com nome de exemplo: o terço identifica a pessoa na tela.
- A composição não toca som: a voz e o som entram no `scripts/mixar.sh`.

## Gerar, mixar e renderizar (de dentro de `moldes/superpodcast01/` ou da cópia em `videos/<v>/`)

Um processo pesado por vez; render sempre pela trava (TEMP vai para `../../.tmp`).

1. Rosto graduado: `QUEM=superpodcast01 sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/grade.py`
   gera `public/fala_grade.mp4` (RVM em `../../tools/modelos/rvm_mobilenetv3_fp32.onnx`). Ele diz se roda na placa de
   vídeo (CUDA) ou na CPU; na CPU, conte ~10 min. Com números (`scripts/grade.py 1 13 22`) só grava PNGs de teste em
   `conferencia/`.
2. Cards: da raiz do estúdio, `.venv/Scripts/python.exe tools/cards.py videos/<v>` (3 quadros de cada vídeo seu pronto
   em `videos/*/out/`; sem nenhum, 8 da própria gravação) ou com fontes e tempos escolhidos:
   `tools/cards.py videos/<v> videos/<outro>/out/final.mp4@1.5,12,23 --fala 4`. Grava `public/cards/` e `src/cards.json`.
3. Som: `../../.venv/Scripts/python.exe scripts/trilha.py` grava `public/trilha.wav` e `public/efeitos.wav`
   (`SAIDA=<pasta>` grava em outra pasta). A duração sai das palavras.
4. Checador: `node scripts/sincronia.mjs` (abaixo).
5. Render sem som (padrão do modelo: sem prévias, sem terço):
   ```
   QUEM=superpodcast01 sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineSuperPodcast01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2
   ```
   Com o terço e as prévias (depois de fazê-las):
   `--props='{"nome":"<NOME>","arroba":"@<arroba>","previas":true,"nomesPrevias":["<modelo 1>","<modelo 2>"]}'`. A
   vitrine saiu com terço, prévias e as imagens geradas.
6. Mixagem: `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (padrão: voz + batidas) ou, com a música,
   `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` (trilha -6 dB com ducking, ~16 dB abaixo da
   voz; foi assim na vitrine). Loudnorm -14 LUFS / -1 dBTP em duas passadas; a saída tem a duração do vídeo.
7. Quadros de conferência: nunca um `remotion still` por quadro (cada um copia a `public/` inteira).
   Quadros em lote (uma chamada para a lista toda, pela trava): `QUEM=superpodcast01 sh ../../tools/com-trava.sh node scripts/quadros.mjs [--previas] [--nome "<nome de quem fala>" --arroba "<@ de quem fala>"] 1 14.3 29.9` (`ESCALA=1` para tamanho cheio, saem em
   `conferencia/`; `--nome`/`--arroba` mostram o terço inferior, que sem eles não aparece). Folhas: `../../.venv/Scripts/python.exe scripts/montar.py saida.png q1.png ... [--cols 6]`;
   `scripts/lado_a_lado.py` monta nosso quadro contra o da referência (precisa de `conferencia/ref/`; as referências
   não vão para a distribuição).

## Checador

`node scripts/sincronia.mjs` (sai com código 1 se algo falhar e diz o que mexer): cada palavra nasce no seu start
(±2 quadros), cada corte cai na 1ª palavra do plano novo, nenhum bloco atravessa corte, toda fala aparece uma vez, máx. 4
linhas por bloco, legenda padrão em até 2 posições (bloco de pequenas que divide o tempo com um bloco de palavra-chave
conta como parte do destaque), zona segura 9:16 (y 250-1500, x 60-940) com e sem prévias, o tempo de leitura do
REGRAS §3 (bloco ≥ 1,5 s, palavra ≥ 0,4 s; palavra-chave completa ≥ 0,8 s e terço ≥ 1,5 s) e **nenhum texto no rosto**:
nos mundos que mostram a gravação (rosto, dividida e arquivo sem a imagem) ele mede o rosto de `src/rosto.json` com o
enquadramento do plano e diz o y que tira a linha de cima dele. Também avisa a mídia que falta em `public/` (cards de
`src/cards.json`, imagens dos planos, palco), que vira o plano B. A vitrine segue o ritmo da fala (3,3 palavras/s, MODELO
"Regras novas": nada de atraso para ganhar leitura) e foi aprovada assim: os blocos dela abaixo da régua, e os da tela
dividida com o texto sobre a boca, levam `aceito: 'vitrine'` e saem como aviso. **Num vídeo novo nenhum bloco leva
`aceito`.** Se o plano não bate com a fala, para logo e diz a lista e a linha. Na vitrine: 0 erros, 23 avisos.

## Vídeo novo

O `../../tools/novo-video.py superpodcast01 <gravação> <AAAA-MM-DD-tema>` copia este molde com a fala nova. O plano
continua o da vitrine e **para ao carregar** com a mensagem do que refazer (lista, arquivo e linha). Antes do código,
**reescreva o `plano.md`** para a fala nova (uma linha por frase: tempo, fala, mundo, texto na tela, gatilho, imagem): o
que veio nele é o plano da vitrine, de outra fala. Depois refaça, em `src/Reel.tsx`, seguindo o seu `plano.md` e o MODELO
§15 (os ids são índices de `src/palavras.json`, 0 = a 1ª):

1. **`PLANOS`** (linha 82): os planos emendados de 0 até `DURACAO`, cada corte no start da 1ª palavra do plano; mundo,
   enquadramento `q` nos de rosto, `img` nos de arquivo (sem imagem, a gravação em tom de arquivo) e `papel` nos de
   papel (`colagem` com as palavras `entra`/`foco`, `celulares` com a palavra `explode`, ou `prints`). O plano
   `dividida` é a janela das prévias.
2. **`VAZAMENTOS`** (linha 99): os tempos dos vazamentos de luz (abertura e virada); `[]` desliga.
3. **`blocos`** (linha 235): os textos de cada plano, com os ids das palavras, a palavra-chave e a posição. Sem `aceito`.
   A marca vai na caixa branca: `caixa: 7` (uma palavra) ou `caixa: [6, 7]` (palavras vizinhas numa caixa só, como
   "Claude Code"). **O y de cada linha depende do mundo:** nos de rosto e na dividida, abaixo do queixo; no arquivo, as
   posições da vitrine (y 900–1148) foram feitas para a imagem de B-roll. Sem a imagem, o arquivo mostra a sua gravação
   inteira e esse texto cai no rosto. O checador mede o rosto e diz o y certo.
4. **`TERCOS`** (linha 335): quando entra o terço inferior (1ª aparição do rosto); o texto vem das props `nome` e
   `arroba`, e `[]` desliga.
5. **`FOLGA`** (linha 61): quanto a última tela segura depois da última palavra (o `scripts/trilha.py` lê daqui).
6. **Som**: `VAZAMENTOS` de `scripts/trilha.py` iguais aos do `Reel.tsx`; rode o `trilha.py`.
7. **Material**: grade (passo 1), cards (passo 2: os lugares da colagem, dos celulares e dos prints ficam em `COL1`,
   `VOO` e `COL2`; os cards vêm do `src/cards.json`), e só se você quiser, palco e B-roll (seus ou gerados, tabela
   acima). O `src/cards.json` que veio é o da vitrine e lista cards que não vêm com o estúdio: rode o `tools/cards.py`
   (passo 2). Enquanto faltar card, o checador avisa e o molde desenha um quadro escuro no lugar. Prévias: `../../.venv/Scripts/python.exe ../../tools/previa.py <um vídeo seu pronto.mp4> . 1 --de 0` e o
   mesmo com `2`.
8. **Checador** até zerar (`node scripts/sincronia.mjs`) e a folha de quadros (com `--nome`/`--arroba` para ver o
   terço).
9. **Render e mixagem** como acima (passos 5 e 6).

## O que é específico do vídeo de origem (refazer num vídeo novo)

Tudo que está preso à fala da vitrine ("Esse vídeo está sendo 100% editado pelo Claude...", 30,16 s) mora em
`src/Reel.tsx` e no `plano.md`:
- `PLANOS` (13 planos P1-P13, cada um com tempo, mundo e enquadramento `q` sobre o rosto), `VAZAMENTOS`, `blocos`,
  `TERCOS` e `FOLGA`.
- O conteúdo dos mundos: os cards da colagem (P3, P10) e dos celulares (P6, que explodem no "Instagram"), quadros das
  edições do dono nos outros modelos (não vão para a distribuição; `src/cards.json` lista os nomes), os B-rolls (P4 e
  P12, imagens geradas para esta fala), o palco gerado, o terço inferior com o nome e o @ do dono (pelas props), os
  dois vazamentos (abertura e "Mas" em ~20,0 s) e o fecho com "edição" repetindo o P10.
- `scripts/trilha.py`: os mesmos `VAZAMENTOS`.

O que se aproveita igual num vídeo novo: os componentes dos mundos e os planos B, a tipografia e a medida de fonte, o
grade do rosto, a tela dividida com as prévias, a mixagem e o checador.

## Histórico

Primeira aplicação do modelo (vitrine de 2026-10-10). Revisão 1 (2026-10-12, correções do dono): cortes no start da
palavra, saiu o 2º terço inferior (o nome do modelo), legenda padrão em 2 posições, "edição" do fecho entre aspas. O que
ficou diferente das referências: palco vazio gerado (não há gravação de palco e gente não se gera), luz frontal com
queda lateral feita no grade, 12 trocas contra 34 da ref1 (nada atravessa corte), B-roll gerado em vez de arquivo de
época. 2026-10-13 (teste do estúdio aberto): plano que não bate com a fala para com mensagem em português; nome e @ do
terço viraram props vazias; colagem, celulares e prints leem `src/cards.json` (do `tools/cards.py`) com quadro desenhado
de plano B; palco desenhado e arquivo com a gravação quando faltam as imagens; IA virou opção; duração a partir das
palavras; o `tempos.py` entrou no `sincronia.mjs`; música opcional no `mixar.sh` (batidas em `efeitos.wav`); os quadros
da vitrine saem iguais (mesmo hash).
2026-10-13 (retestes com fala nova): `caixa` aceita palavras vizinhas (`[6, 7]`, uma caixa só); o checador acusa texto no
rosto (rosto, dividida e arquivo sem imagem; os blocos da tela dividida da vitrine levam `aceito`) e avisa cards, imagens
e palco que faltam em `public/`; o `trilha.py` lê o `FOLGA` do `Reel.tsx`; `quadros.mjs` aceita `--nome`/`--arroba`; o
`grade.py` usa só o provedor do onnxruntime que existe; o `mixar.sh` para se o som for de outra fala; o "Vídeo novo" manda
reescrever o `plano.md`. Os quadros da vitrine saem iguais (mesmo hash).
