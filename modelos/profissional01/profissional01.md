# profissional01: autoridade e didática para quem fala com a câmera

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (30 s, com a voz). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo) e o `mapa.json`
(rosto, luz e cortes medidos a cada 0,25 s). Antes de editar, assista ao vídeo inteiro uma vez. O mesmo vídeo em qualidade cheia está no `original.mp4`, para ler letra pequena e detalhe de tela.

**A referência mostra o jeito do modelo, não um roteiro para copiar.** Siga a cara, os números e as regras; as telas, os textos e os cortes do vídeo novo nascem da fala nova. Não repita as cenas do aprovado só porque estão lá.

---

## 0. Do seu jeito (o aluno preenche, se quiser)

Escreva aqui, com as suas palavras, o que vale para todos os seus vídeos neste modelo. Pode ir somando com o tempo.

- Meu nome e @ (só onde o modelo mostra):
- Minha foto de perfil (nome do arquivo na pasta do estúdio):
- Chamada do fim (o que peço para a pessoa fazer):
- Gosto de:
- Não quero:

**Para o Claude:** leia esta seção antes de tudo e siga o que está nela. Ela decide o conteúdo e as opções da seção 7,
mas não muda a cara do modelo (cores, fontes, posições, ritmo). Se um pedido daqui mudar a cara, avise antes de fazer.
Quando a pessoa corrigir algo num vídeo e a correção valer para os próximos, ofereça anotar aqui, nas palavras dela.

---

## 1. A cara do modelo

Um profissional falando com a câmera numa tomada só. **O vídeo transmite autoridade e é muito didático:** tudo o que
puder virar ilustração, elemento ou tela dividida, vira.
- **Câmera calma:** aproximação e afastamento bem lentos, e só uns 3 cortes de ênfase no vídeo todo (0 s a 4 s, 20 s).
- **Legenda limpa** em Poppins branca, no peito (2 s, 11 s, 20 s).
- **Títulos de frase-chave** sobre o vídeo, de até 3 linhas, só nos momentos de ênfase (1 s a 2 s).
- **Telas cheias** no desenho de tipografia cinética com objeto herói, alternando fundo escuro e fundo de cor
  (5 s a 10 s, 24 s a 26 s).
- **Tela dividida com o vídeo sempre embaixo** e um painel, ilustração ou B-roll em cima (11 s a 19 s, 22 s a 23 s).
- **Uma cor de destaque tirada do cenário** da gravação (no vídeo aprovado, caramelo `#8F5F33`, da parede bege).
- **Fecho:** o comando fixo, Comenta “EDIÇÃO”, num botão que acende (27 s a 29 s).
- **Nada de efeito mirabolante no fundo. Nada de preto e branco.**

## 2. Os números do modelo (o `parece.py` confere)

| Item | Valor | O que é |
|---|---|---|
| Brilho | 81 (de 0 a 255) | Médio-escuro |
| Contraste | 160 | |
| Saturação | 89 | A cor de destaque aparece bem |
| Temperatura | +4,6 | Quente |
| Rosto no plano normal | 27% da altura do quadro | (0 s) |
| Rosto no plano de ênfase | 30% da altura do quadro | (20 s) |
| Altura do rosto | centro a 61% do topo | Medido no vídeo todo, contando a metade de baixo da dividida |
| Rosto no centro horizontal | 49% | |
| Cabeça cortada pelo topo | 0% do tempo | Nunca |
| Tempo com rosto na tela | 71% | |
| Cortes | cerca de 14 por minuto | Poucos: a câmera é calma |

## 3. Câmera e ritmo

- **Uma tomada, com deriva bem lenta:** menos de 1% por segundo (por exemplo, de 1,0 a 1,035 ao longo de um trecho
  inteiro). O zoom nasce do ponto entre os olhos.
- **No máximo 3 cortes de enquadramento no vídeo todo**, só nas ênfases da fala: a pergunta-gancho, a frase da ação e o
  fecho, este abrindo o quadro. No vídeo aprovado: "Mas se você quiser" fecha de 1,07 para 1,18 (20 s), e o fecho abre
  para 1,0 (27 s). Nunca corte seco de zoom toda hora.
- **O que manda é o tamanho do rosto, não o número do zoom.** Os zooms do molde (1,0 / 1,035 / 1,18) valem para a
  gravação do aprovado. Na sua, o rosto tem que dar **27% da altura do quadro no plano normal e 30% na ênfase**. Como
  escolher: o `novo-video.py` já adapta a gravação para o rosto nascer perto de 27% em zoom 1,0. Rode o `parece.py`
  numa prévia (ou meça a altura do rosto em `src/rosto.json`, a 4ª coluna, em fração do quadro): se o rosto nasce em
  27%, use os zooms do molde; se nasce maior, deixe a deriva normal entre 1,0 e 1,03 e calcule a ênfase pela proporção,
  zoom ≈ 30 ÷ (rosto em %, no zoom 1,0). Confira no `parece.py` e ajuste até o rosto da ênfase dar perto de 30%.
  Exemplo: rosto que nasce em 29% pede ênfase perto de 1,03 a 1,07 (30 ÷ 29), nunca 1,18 (daria 34%).
- **No vídeo novo, `ROSTO_MEDIDO = null` é obrigatório.** O ponto `{x: 590, y: 620}` do molde é o da gravação do
  aprovado; com `null` o ponto dos olhos sai de `src/rosto.json`.
- **Fala sem pausa no lugar do corte de ênfase:** não espere uma pausa que não existe. Corte quando a palavra de antes
  já ficou 0,4 s (por exemplo `de(i) + 0,42`) e faça da frase da ênfase um **título**, em vez de legenda. Na fala corrida
  isso cascateia (cada palavra empurrada também precisa de 0,4 s): ande o corte até achar duas palavras seguidas com
  0,4 s ou mais entre elas e comece o título na segunda, mesmo no meio da frase. O checador cobra os 0,4 s também da
  última palavra antes de um corte.
- **Flash na ênfase:** um flash branco e quente de 4 quadros no corte de ênfase (20 s), com um whoosh.
- **Transição limpa** entre algumas cenas, como do gancho para a 1ª parte.
- Tratamento leve na gravação: contraste 1,06, saturação 0,94, brilho 0,98.

## 4. Títulos e telas (a assinatura)

**Fontes:** 1 principal, Poppins (600 e 800), e 2 alternativas, DM Serif Display e Great Vibes. Cada título usa só UMA
alternativa. O tamanho varia pouco.

**Títulos sobre o vídeo (frases-chave)** (1 s a 2 s):
- No máximo 3 linhas, com o lugar de todas as palavras reservado desde o início: **palavra nenhuma "teleporta"**.
- Cada palavra entra suave em 0,4 s (desfoque de 4 px e deslize de 10 px), junto com a voz. O título sai num fade de
  0,22 s.
- Palavra comum em Poppins 600; âncora em Poppins 800 (no máximo 2 vezes o tamanho das comuns, "100%", 1 s); alternativa
  em DM Serif ou Great Vibes. Branco com sombra de 2 camadas. Uma linha pode ganhar marca-texto da cor de destaque.
- Fica num lugar só, do peito para baixo: topo em y 1110 (y 1000 com 3 linhas). Nunca no rosto.
- **Quantos títulos:** no aprovado, 2 em 30 s (o gancho e uma frase-chave). Num vídeo curto, de 10 a 15 s, cabem 2: o
  gancho e a frase da ênfase. Nunca dois títulos seguidos sem vídeo com legenda entre eles.
- Nunca use cartela branca de texto tipográfico.

**Telas cheias** (quando a tela não mostra o vídeo):
- **Dois fundos que alternam no corte:** escuro (degradê radial de `#3B2D22` para `#16110D`) e cor (degradê de `#B27C48`
  para `#8F5F33` e `#6A4422` nas bordas), sempre com uma grade de pontos sutil (2 px a cada 44 px).
- **Tipografia grande palavra a palavra**, entrando do desfoque, com tamanhos misturados, até 3 linhas: ligação em
  Poppins 600, palavra grande em Poppins 800 bem apertada, palavra de efeito em DM Serif ou Great Vibes ("te mostrar /
  a diferença entre vários / **modelos**", 6 s; "*e* / **criei**", 7 s; "usando o Claude." em serifa, 10 s).
- **Um objeto herói que faz o que a frase diz:** cartões 9:16 (6 s), barras que sobem (7 s), linha do tempo com a lâmina
  (8 s a 10 s), o vídeo num cartão que toca (24 s a 26 s).
- **Palavra curta não fica sozinha:** no vídeo novo, ponha `CURTA_JUNTO = true` no plano. A palavra que vem depois de
  uma de até 2 letras ("e", "o", "a", "de") entra junto com ela. Sem isso, numa linha como "e mandei o arquivo." o "e"
  aparece sozinho na ponta esquerda (a linha reserva o lugar de todas as palavras e só ele chegou) até a voz dizer
  "mandei". No molde fica `false`, que é como o aprovado foi feito.
- A tela inteira aproxima 1,2% por segundo.
- Uma ideia por tela, de 1 a 2,5 s.

**Tela dividida:**
- **O vídeo original fica sempre embaixo**, com os olhos a 180 px do topo da metade de baixo e a mesma deriva lenta.
- Em cima: ilustração, foto, painel ou B-roll. **O fundo do painel de cima é opaco desde o 1º quadro**: nenhuma outra
  cena aparece por trás. Só o conteúdo do painel entra animado (celular, cartões, lista).
- Uma linha de 4 px da cor de destaque marca a divisa e se desenha em 0,3 s.
- **B-roll só em tela dividida e sem exagero:** 2 blocos num vídeo de 1 minuto, um clipe por pedaço da fala (1 a 3 s
  cada), com aproximação lenta. O B-roll é temático e contextual, e não se repete entre vídeos.
- Um rótulo em **pílula branca** (Poppins 800, 34 px) no canto, quando o tema tem nome.
- Painel de lista: cabeçalho tinta `#1F160F` com o título em Poppins 600, 30 px, maiúsculo e espaçado; itens em Poppins
  600, 40 px, com vistos que acendem um a um; o item da vez acende na cor de destaque (22 s a 23 s). Com 6 a 8 itens o
  painel fica a 85% do tamanho, com o topo em y 262; com menos itens ele fica a 96% (o zoom lento do painel não o leva para fora da zona segura), centrado na metade de
  cima. Título e itens saem da fala nova (veja `LISTA` na seção 9).
- Celular com interface genérica de Reels e só o @ real de quem fala, ou nenhum (11 s a 14 s).
- Tela simples demais vira tela dividida. Pouco texto por tela, bem enquadrado.

**Sempre:** número e frase exatamente como foram ditos; painel entra já preenchido; nada atravessa um corte. Nunca
escreva o nome do modelo na tela (a fala "um desses modelos" fica só na legenda, 13 s).

## 5. A legenda (conta a história)

- **Toda palavra dita aparece na tela, uma vez só, em ordem.** O que um título, uma tela ou o fecho já mostra não se
  repete na legenda.
- **Poppins 600 branca**, sem itálico, sombra de 2 camadas (`0 2px 4px rgba(0,0,0,.45)` e `0 4px 22px rgba(0,0,0,.4)`),
  com uma faixa escura bem suave (16% a 20%) atrás da linha.
- Pedaços de 2 a 4 palavras, cortados pelo sentido e escritos à mão; fala rápida vira página de até 2 linhas.
- **Troca seca** com fade de 2 quadros (de 50% a 100%). Cada palavra entra no quadro do corte, 2 quadros antes da voz,
  ancorada no ataque da voz. A página fica até a próxima entrar e nunca pisca no meio da fala.
- **Tempo de leitura:** cada página fica pelo menos 1,5 s e cada palavra pelo menos 0,4 s. Corte que cairia no meio de
  uma frase rápida anda até a pausa ou leva a frase junto.
- **Legenda mais trabalhada só nos momentos de ênfase** (os títulos). No resto, limpa.
- **Só 2 posições:**
  - na gravação: **72 px**, topo em y 1150 (2 s, 20 s);
  - na tela dividida e no fecho: 56 px, até 2 linhas, com o pé em y 1500 (topo em y 1354) (11 s, 27 s).
  A linha que passaria da largura encolhe só ela.
- **Na tela dividida**, as palavras-chave ganham uma caixa da cor de destaque (raio 12) ("Instagram", "prévias", "três
  vezes", 11 s a 19 s). No plano, `*palavra*` marca a caixa. **Pontuação colada vai dentro da caixa:** escreva
  `*corte,*` e `*três vezes.*`, nunca `*corte*,` (a vírgula fica solta depois da caixa, como "corte ,").

## 6. Som e fecho

- **Som padrão:** a voz e o whoosh do flash. A voz leva passa-alta e compressão leve. Final em -14 LUFS.
- A música (uma cama clara em ré maior) é opcional e vem desligada. Quando ligada, fica 16 LU abaixo da voz, com ducking.
- **Fecho** (27 s a 29 s): o quadro abre (zoom 1,0). Entre o queixo e a legenda ficam fixos só o comando, "Comenta"
  (Poppins 600, 64 px), e um botão em pílula (170 px de altura) com o ícone de comentário e **“EDIÇÃO”** entre aspas
  (Poppins 800, 84 px), de borda branca, que acende na cor de destaque na palavra. O resto da fala segue na legenda,
  na 2ª posição.
- **Prévias (opcional):** a dividida com dois clipes de vídeos seus lado a lado, o nome de cada modelo na pílula (15 s a
  19 s). Nunca use vídeo de terceiro.

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Whoosh do flash | **ligado** | `FLASH = None` em `scripts/som.py` (ou o tempo dele, veja o passo 7 da seção 9) |
| Flash na ênfase | **ligado** | `FLASH = null` em `src/Reel.tsx` |
| Fecho com o botão Comenta | **ligado** | `CTA = null` em `src/Reel.tsx` |
| Música (cama em ré maior) | desligada | `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` |
| @ no celular | vazio (a linha do perfil some) | Prop `arroba: "@seu.arroba"`, só o real de quem fala |
| Prévias | desligadas | Prop `previas: true` e `nomesPrevias: ["modeloA","modeloB"]` |
| Cor de destaque | a do cenário | Os tons de `C` no topo de `src/Reel.tsx` (destaque, escuro, claro), tirados da gravação |

Os padrões vêm do `src/Root.tsx`: `{previas: false, nomesPrevias: ['modelodinamico01', 'modelopadrao01'], arroba: ''}`.
O render sai **sem som**; a voz entra no `mixar.sh`.

## 8. Zona segura e rosto

- Todo texto fica em x 60–940 e y 250–1500 (1080x1920). Linha que passaria de 880 px encolhe só ela.
- A zona segura é assimétrica de propósito: a coluna de botões do Instagram ocupa os 140 px da direita, por isso nenhum texto passa de x 940.
- Nenhum texto cobre o rosto. Na dividida o rosto sobe (olhos a 180 px do topo da metade) para a legenda ficar abaixo do
  queixo.
- No máximo 3 linhas por título ou tela, 2 por página de legenda.
- Nome e @ na tela, só os reais de quem fala, ou nenhum.

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo".

1. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py profissional01 <gravacao.mp4> <AAAA-MM-DD-tema>`.
   Isso cria `videos/<AAAA-MM-DD-tema>/`, transcreve a fala (`src/palavras.json`), mede o rosto (`src/rosto.json`) e adapta
   a gravação ao modelo. Nome que o Whisper escreve errado (Cloud no lugar de Claude) se corrige aqui, com
   `--trocar Cloud=Claude` (vários pares: `--trocar Cloud=Claude Cod=Code`); depois do passo 2 não se mexe na transcrição.
2. **Ancore as palavras na voz, logo em seguida e antes de tudo:** `../../.venv/Scripts/python.exe scripts/palavras.py`
   (na pasta do vídeo). Grava `src/palavras_voz.json`. O vídeo novo nasce com o `palavras_voz.json` do aprovado: até
   este passo, o molde para com "src/palavras_voz.json não é desta fala". Os números do plano são índices dessa lista
   (0 = a 1ª palavra). Mudou a transcrição, rode de novo.
3. **Tire o quadro dos cartões:** `ffmpeg -ss 5 -i public/fala.mp4 -frames:v 1 -q:v 3 public/quadro.jpg` (na pasta do
   vídeo; escolha um segundo com o rosto bem enquadrado).
4. **Escreva o `plano.md`** na pasta do vídeo, frase a frase: onde cai a ênfase, o que vira tela cheia, o que vira tela
   dividida, os títulos, a cor de destaque do cenário.
5. **Monte O PLANO** no topo de `src/Reel.tsx` (na pasta do vídeo). O molde para ao carregar e diz qual lista não bate:
   - `T`: os cortes, `c(de(i))` = 2 quadros antes da palavra i. As chaves são livres (troque as do aprovado pelas
     suas, sem guardar chave que sobrou): só o plano lê `T`;
   - `trechos`: o modo de cada trecho (`video`, `tela`, `celular`, `previas`, `lista`);
   - `CAM`: a deriva e os cortes de ênfase (`true` = corte), no máximo 3, no tamanho de rosto da seção 3;
   - `MARCAS`: as palavras que fazem cada herói agir, uma lista por herói (as do aprovado são dos heróis dele);
   - `LISTA`: o painel de lista, `{titulo, itens, vistos, acende}`, ou `null`. `titulo` e `itens` vêm da fala nova;
     `vistos` tem uma palavra por item (cada visto na sua palavra) e `acende: 'davez'` acende o item da vez. O formato
     do aprovado, `vistos: [primeira, última]` com `acende` = índice da palavra, espaça os vistos por igual e acende só o
     último;
   - `CURTA_JUNTO = true` (seção 4);
   - `ENTRADAS`: páginas de legenda com entrada própria (`{}` se nenhuma);
   - `CTA` (`{i: índice de "comenta", comando, palavra, de: o corte do fecho}`, ou `null`) e `FLASH` (o tempo do
     flash, ou `null`). Sem chamada para ação na fala, não há fecho nem o 3º corte de enquadramento: `CTA = null` e pronto: o resto do molde não procura `T.comenta`;
   - `ROSTO_MEDIDO = null` (obrigatório, seção 3);
   - `PEDACOS`: as páginas da legenda, com a fala escrita (`/` quebra a linha, `*x*` destaca na dividida, `'#n'` pula n
     palavras já mostradas por uma tela, título ou o fecho);
   - `TELAS` e `TITULOS`: o texto da fala a partir de `primeira`. Lista vazia desliga;
   - `C`: a cor de destaque tirada do cenário.
   Os heróis do molde (`Cartoes`, `Barras`, `LinhaTempo`, `Player`, `Celular`) desenham as frases do aprovado. Herói
   que não ilustra a sua frase sai do plano, e você escreve um novo (veja "Como escrever um herói", abaixo).
6. **Confira as regras:** `node scripts/cobertura.mjs` (na pasta do vídeo; `--previas` se for usar prévias) até zerar.
   Ele confere, quadro a quadro, toda palavra escrita enquanto é dita, página de 1,5 s e palavra de 0,4 s, nada repetido,
   legenda em no máximo 2 posições, zona segura e linhas, e diz o que mexer.
7. **Som:** o whoosh cai no mesmo tempo do `FLASH` do `src/Reel.tsx`. Em `FLASH` de `scripts/som.py`, um inteiro é o
   índice da palavra (corte 2 quadros antes dela, como `c(de(i))`) e um número com casa decimal são os segundos. Se o
   corte da ênfase não é `c(de(i))` (por exemplo `de(20) + 0.42`), passe os segundos:
   `../../.venv/Scripts/python.exe scripts/som.py --flash 7.76` (na pasta do vídeo). Sai `public/efeitos.wav` (e
   `public/trilha.wav`).
8. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10` (na pasta do vídeo).
9. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineProfissional01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2`
   (com o @ real: `--props='{"arroba":"@seu.arroba"}'`).
10. **Mixe:** `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (na pasta do vídeo; voz e whoosh). Sai em -14 LUFS.
11. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 profissional01`.
    Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
    em cima e o seu embaixo. Se a diferença salta aos olhos, ainda não está pronto.

**Como escrever um herói** (o objeto da tela cheia que faz o que a frase diz):
- O formato é `Heroi`: um componente que recebe `{t, de, fim, fg, ac}` (o tempo atual, o começo e o fim da tela, a cor
  da frente e a de acento, já certas para o fundo escuro ou de cor). Ele desenha em coordenadas do quadro 1080x1920,
  abaixo do texto da tela (de y 1000 a 1600) e dentro de x 100 a 980.
- As palavras que fazem o herói agir ficam em `MARCAS`, numa lista com o nome dele: `meuHeroi: [i1, i2]`. O molde
  confere que cada índice existe. Dentro do herói, `const [a, b] = MARCAS.meuHeroi.map((i) => de(i))`.
- Movimento: `mola(t, quando)` dá uma mola de 0 a 1 que começa em `quando` (comece 0,04 s antes da palavra);
  `tw(t, a, b, v0, v1)` é a transição suave; `entra(k)` é a entrada padrão (aparece e cresce de 80% a 100%).
- Uma ação por palavra marcada, nunca mais que 3 por herói. Use o quadro dele (`public/quadro.jpg`) quando a frase fala
  dele ou do vídeo.
- Ligue na tela: `{de: T.minhaTela, fundo: 'E', topo: 500, primeira: i, linhas: [...], heroi: MeuHeroi}` em `TELAS`.

Exemplo, o `Player` do molde ("aprender a como usar isso nos seus vídeos": o vídeo toca em "usar" e ganha a legenda em
"vídeos"), com `MARCAS.player = [78, 82]`:

```tsx
const Player: Heroi = ({t, de: d, fim, fg, ac}) => {
	const k = mola(t, d + 0.05); // entra logo depois do corte
	const [usar, videos] = MARCAS.player.map((i) => de(i));
	const usa = tw(t, usar - 0.04, usar + 0.3, 0, 1); // "usar": o play some e a imagem clareia
	const prog = tw(t, usar, fim, 0, 1, (x) => x); // a barra anda até o fim da tela
	const ed = mola(t, videos - 0.04); // "vídeos": a legenda aparece no cartão
	const W = 330;
	const H = (W * 16) / 9;
	return (
		<div style={{position: 'absolute', left: 540 - W / 2, top: 1040, width: W, height: H, borderRadius: 30, overflow: 'hidden', border: `6px solid ${fg}`, ...entra(k)}}>
			{/* quadro.jpg com brightness(0.75 + 0.25 * usa), o botão de play com opacity 1 - usa,
			    a legenda com opacity ed e a barra com width prog * 100% */}
		</div>
	);
};
```

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<v> 1` (e `2`), depois o checador
com `--previas` e o render com `--props='{"previas":true,"nomesPrevias":["modeloA","modeloB"]}'`.

**Série de um mesmo cliente:** o vídeo novo parte do código do vídeo que o cliente aprovou. Variação nova só acrescenta;
a base segue a aprovada.

## 10. O plano do vídeo aprovado (para comparar)

| Tempo | Fala | Câmera / modo | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. | vídeo, deriva 1,0 | título de 3 linhas: "Esse vídeo está sendo / **100%** editado / pelo Claude" |
| 3 s | Ele foi criado justamente | vídeo | legenda "Ele foi criado / justamente para" |
| 4,1 s | para te mostrar a diferença entre vários modelos | tela cheia escura | três cartões 9:16; "**modelos**" grande |
| 6,7 s | que eu criei e melhorei | tela cheia de cor | "**criei**"; barras que sobem |
| 8 s | para editar qualquer tipo de vídeo usando o Claude. | tela cheia escura | linha do tempo, lâmina em "editar"; "tipo de vídeo", "usando o Claude." em serifa |
| 10,7 s | Inclusive, se você estiver no Instagram agora, você está vendo apenas um desses modelos. | dividida | o vídeo num celular de Reels; legenda com caixa em "Instagram", "um" |
| 14,6 s | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | dividida com prévias | prévias lado a lado com a pílula do nome; caixa em "prévias", "três vezes." |
| 19,9 s | Mas se você quiser realmente | vídeo, corte de ênfase 1,18 e flash | legenda "Mas se você quiser / realmente ver" |
| 21,4 s | ver outros modelos de edição como esse | dividida | painel "Modelos de edição" com os vistos; o último acende |
| 24,1 s | e aprender a como usar isso nos seus vídeos, | tela cheia de cor | "**usar isso**", "nos seus vídeos" em serifa; o vídeo num cartão, play some, barra anda |
| 26,7 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | vídeo, o quadro abre (1,0) | "Comenta" e o botão “EDIÇÃO” que acende; legenda na 2ª posição |

No vídeo aprovado as prévias estão ligadas. Os textos de tela (nomes de modelo na lista) são daquele vídeo; num vídeo
novo, a tela mostra o que a fala nova diz.
