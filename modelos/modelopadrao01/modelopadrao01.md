# modelopadrao01: rosto cheio com telas que mostram o que é dito

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

Uma pessoa falando, em rosto cheio, e telas claras que entram para **representar o que está sendo dito**.
- **Abre leve:** só a pessoa e a legenda. A edição entra depois do gancho (0 s a 1 s).
- **Rosto cheio com dois enquadramentos** (A e B), fixos dentro do trecho; só mudam no corte (0 s, 15 s, 20 s, 27 s).
- **Legenda sem tarja**, branca com sombra, com a palavra que está sendo dita em menta (0 s, 21 s).
- **Tela dividida** com painel marfim em cima e a legenda numa pílula verde-escura na divisa (5 s a 9 s, 24 s a 26 s).
- **Telas que encenam a fala:** o editor "Claude Code" com o próprio vídeo na prévia (2 s a 4 s), o chip do Claude
  (10 s), o celular com o Reel (11 s a 14 s), a caixa do Claude digitando a frase dita (24 s a 26 s).
- **Fecho no jeito minimalista do Instagram:** o campo de comentário com a palavra, a foto e o @ reais (27 s a 29 s).
- **Cor:** marfim, menta, verde-escuro e o laranja do Claude. Nunca preto como fundo de tela: o preto não dá contraste
  com o vídeo.

## 2. Os números do modelo (o `parece.py` confere)

| Item | Valor | O que é |
|---|---|---|
| Brilho | 163 (de 0 a 255) | Claro: o marfim pesa |
| Contraste | 212 | |
| Saturação | 39 | Pouca cor |
| Temperatura | +3,7 | Levemente quente |
| Rosto no plano A | 29% da altura do quadro | (0 s) |
| Rosto no plano B | 32% da altura do quadro | (15 s) |
| Altura do rosto | centro a 73% do topo | Medido no vídeo todo, contando a metade de baixo do dividido |
| Rosto no centro horizontal | 48% | |
| Cabeça cortada pelo topo | 0% do tempo | Nunca |
| Tempo com rosto na tela | 76% | Referência: o `parece.py` não cobra este item |
| Cortes | cerca de 22 por minuto | |

**De onde vem o contraste e o brilho:** das telas marfim. O rosto sozinho mede brilho perto de 90; o editor, 223; o
celular, 207; o dividido, 157. Um vídeo que fica quase só no rosto reprova em contraste e brilho no `parece.py`, por
mais que o resto esteja certo. Por isso o vídeo novo precisa de uma proporção de tempo parecida com a do aprovado
(medida no `mapa.json`, a cada 0,25 s):

| Modo | Tempo no aprovado | Brilho médio |
|---|---|---|
| Rosto cheio (com a legenda) | 21% | 88 |
| Fecho (rosto com o campo de comentário) | 11% | 99 |
| Editor | 11% | 223 |
| Dividido (modelos, prévias, caixa do Claude) | 43% | 157 |
| Celular | 15% | 207 |

Em conta redonda: **cerca de 2/3 do tempo com tela marfim** (editor, celular ou dividido) e 1/3 só no rosto. Monte o
plano já com essa conta: some a duração de cada modo antes de gerar o `tempos.json`.

## 3. Câmera e ritmo

- **Rosto cheio A:** zoom 1,06, olhos em y 660. **Rosto cheio B:** zoom 1,2 (15% mais perto), olhos em y 650. O rosto
  fica centrado na horizontal pelo rastreio. O fundo nunca aparece nas bordas.
- **O enquadramento é fixo dentro do trecho.** A troca A/B só acontece no corte, 2 quadros antes da palavra que abre a
  frase. Os olhos ficam na mesma altura entre trechos.
- **Dividido:** a divisa fica em y 960. O rosto vai para a metade de baixo, zoom 1,08, olhos em y 1400. O painel claro
  ocupa a metade de cima. Entra e sai em 0,4 s.
- **Rosto em moldura:** dentro do editor, o vídeo vira a prévia 9:16 (x 375, y 500, 330 de largura); no celular, a tela
  9:16 (x 330, y 466, 420 de largura). A passagem do rosto cheio para a moldura é animada (escala, posição e recorte).
- **Trecho** é o pedaço entre dois cortes de enquadramento (`BLOCOS` no plano): o tempo em que o plano A, o B, o
  dividido, o editor ou o celular fica parado sem corte. Cada trecho dura de 2 a 5 s; o editor e o celular contam como
  um trecho cada.

## 4. As telas (a assinatura)

- **Fundo das telas:** marfim `#F0EEE6` com grade de pontos (`#DCD7CA`, 2 px, a cada 36 px). Cartões em papel `#FBF9F4`
  com sombra macia. Tinta `#0A0A0A`, texto suave `#5E5A52`.
- **Fontes:** Geist (500 a 800) e Geist Mono (400 a 600). Só essas.
- **Cores de acento:** menta `#7ED9B2` (só preenchimento e marca-texto), menta clara `#DDF2E8`, verde `#1E6A50`,
  verde-escuro `#173F33` (pílula), laranja do Claude `#D97757` (só no que é do Claude).
- **Painel entra já preenchido** e sai junto com o corte. Nunca "cortina aberta".
- **Editor "Claude Code"** (2 s a 4 s): janela papel de raio 30 com o título em Geist Mono 600, 26 px; a prévia do
  próprio vídeo numa moldura escura `#1B1B1A`; a linha do tempo com clipes azulados (`#B9C7D6`, `#9FB3C8`). Na palavra
  "Claude" uma lâmina laranja corta o clipe; na palavra seguinte nasce a faixa de legenda em menta; depois uma tela se
  monta na prévia. As três animações seguem o plano: a caixa verde vai na palavra dita em `editor.legenda`, o contorno
  na dita em `editor.tela`, o marca-texto menta nas palavras de `titulos.marcas`. **O título no topo é o texto dito:**
  Geist 800, 74 px, tinta, letras apertadas (-0,04 em), y 250 a 420 ("pelo", "Ele foi", "justamente para", 2 s a 4 s).
  Num vídeo novo a caixa vai de x 80 a 940: **até 2 linhas, cerca de 20 letras por linha (40 no total)**. Cada página de
  título fica pelo menos 1,5 s; a última fica até as camadas saírem (0,2 s depois do `devolve`). Nessas telas não há
  legenda.
- **Cartões dos modelos** (5 s a 7 s): papel, 425x108, raio 26, nome em Geist Mono 600, 29 px; entram girando, ganham ✓
  e uma barra verde enche. Com `entradas` no plano (um tempo por cartão, na palavra dita) ou num vídeo novo, a grade
  fica no meio da área e o cartão sozinho da última linha vai para o centro.
- **Formatos do vídeo** (9 s): o mesmo vídeo em 9:16, 16:9 e 1:1, com borda papel de 9 px e raio 24; tudo entra no chip.
- **Chip do Claude** (10 s): pílula papel, raio 60, o asterisco laranja e "Claude" em Geist 800, 60 px, em y 470.
- **Celular** (11 s a 14 s): corpo `#121212` de raio 46; o vídeo vira um Reel com a foto, o @ e "Seguir" reais embaixo
  e a barra de progresso; o título no topo é o texto dito ("se você", "no Instagram agora", 11 s e 12 s); embaixo, uma
  etiqueta com ✓ e o nome em Geist 800, 60 px, com marca-texto menta (13 s a 14 s); os outros celulares aparecem atrás,
  tracejados (14 s).
- **Etiqueta ao lado do rosto** em Geist Mono 34 px ("outros modelos", 22 s a 23 s).
- **Caixa do Claude digitando** (24 s a 26 s): de x 100 a 950, topo em y 330; cabeçalho "Claude" em Geist 700, 40 px;
  caixa papel de raio 30 com borda `#E4DFD3`, Geist 600, 58 px, que digita exatamente as palavras ditas; o botão de enviar
  (64 px) acende em laranja na última palavra.
- **A tela mostra o que está sendo dito.** Número e frase exatamente como foram falados. Imagem de prova grande e
  devagar.
- **Nunca escreva o nome do modelo na tela** num vídeo novo.

## 5. A legenda (conta a história)

- **Toda palavra dita aparece na tela, uma vez só, em ordem.** No editor e no celular, quem conta a fala é o título no
  topo; fora deles, a legenda.
- **Geist 800**, letras apertadas (-0,025 em). A palavra que está sendo dita fica **menta `#7ED9B2`**, as outras brancas.
- **Entrada da página:** sobe 10 px e cresce de 96% para 100% em 4 quadros.
- **Páginas:** quebram de preferência em pontuação ou pausa maior que 0,3 s. **Tempo de leitura:** nenhum pedaço fica
  menos que o tempo de ler, nunca palavra solta piscando: cada página fica pelo menos 1,5 s e cada palavra pelo menos
  0,4 s depois de aparecer. A última palavra de uma página que já ficou 1,5 s na tela não é palavra solta: basta 0,25 s.
- **Vídeo novo:** `MIN_PAGINA = 1.5` em `src/tema.ts`. Com ela o molde escolhe o melhor conjunto de páginas (até 2
  linhas, cerca de 40 letras), uma página nunca atravessa um corte, a entrada ou a saída do dividido nem o título, e a
  palavra que está no título do editor ou do celular não se repete na legenda. A legenda fica até o instante em que o
  título aparece e volta quando as camadas do editor ou do celular começam a sair: não há buraco nas bordas. Com 0, o
  molde refaz o vídeo aprovado exatamente como ele é.
- **Só 2 posições no vídeo todo:**
  - rosto cheio: sem tarja, 68 px, sombra escura, caixa de x 110 a 940, logo abaixo do queixo (no aprovado, a base em
    y 1190; num vídeo novo, o topo 40 px abaixo do queixo medido do trecho, crescendo para baixo, para a 2ª linha
    nunca subir no queixo);
  - dividido: numa pílula verde-escura `#173F33`, raio 20, 56 px, centrada na divisa (topo em y 914), caixa de x 120 a
    930.

## 6. Som e fecho

- **Efeitos sintetizados** só em evento de verdade (lâmina, ✓, digitar, enviar, a DM chegando). A trilha sai com o
  tamanho do vídeo (`duracao` do plano), com um pop por cartão na entrada dele.
- **Silêncio na virada:** o som some no corte de "Mas se você quiser" (20 s).
- A cama de acordes calma é opcional e vem desligada. Quando ligada, fica 16 LU abaixo da voz. Final em -14 LUFS.
- **Fecho minimalista do Instagram** (27 s a 29 s): um cartão branco de raio 36 (x 110 a 940, topo em y 1236) com a foto
  real num anel de degradê do Instagram, o campo cinza `#EFEFEF` onde a palavra a comentar é digitada em MAIÚSCULA
  (Geist 800, 88 px) e ganha marca-texto menta, e o botão azul `#0095F6` que aperta; a DM chega em cima com a foto e o @
  reais. "Comenta" e a palavra entre aspas ficam fixos; o resto da fala segue na legenda.
- **Prévias (opcional):** o dividido com dois clipes de vídeos seus lado a lado (380x676, raio 30, borda papel de 10 px),
  o nome do modelo de cada um em Geist Mono 25 px e o selo menta "3x" na palavra "aceleradas" (16 s a 19 s). Nunca use
  vídeo de terceiro.

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Voz no render | **ligada** | Prop `voz: false` |
| Efeitos sonoros do modelo | **ligados** | Sem o 3º argumento no `mixar.sh` sai só a voz |
| Cama de acordes | desligada | `audio/compor.py --cama` |
| @ e "Seguir" no Reel e no fecho | vazio (escondido) | Prop `arroba: "seu.arroba"` (sem o @), só o real de quem fala |
| Foto do perfil | vazia (escondida) | Prop `foto: "foto.jpg"` (arquivo em `public/`) |
| Prévias | desligadas | Prop `previas: true`, `nomesPrevias: ["modeloA","modeloB"]` e `compor.py --previas` |

Os padrões vêm do `src/Root.tsx`: `{voz: true, previas: false, nomesPrevias: ['modelodinamico01', 'youtubeedition01'],
arroba: '', foto: ''}`.

## 8. Zona segura e rosto

- Todo texto fica em x 60 a 940 e y 250 a 1500 (1080x1920).
- A zona segura é assimétrica de propósito: a coluna de botões do Instagram ocupa os 140 px da direita, por isso nenhum texto passa de x 940.
- Nenhum texto cobre o rosto: a legenda mora abaixo do queixo medido.
- No máximo 2 linhas por página de legenda e 4 por bloco de texto.
- Nome e @ na tela, só os reais de quem fala, ou nenhum.

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo".

1. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py modelopadrao01 <gravacao.mp4> <AAAA-MM-DD-tema>`.
   Isso cria `videos/<AAAA-MM-DD-tema>/`, transcreve a fala (`src/palavras.json`) e adapta a gravação ao modelo. Ao
   carregar, o molde para de propósito e diz que `src/tempos.json` é de outra fala.
   Nome que a transcrição errar (ex.: "Cloud" no lugar de "Claude") se corrige já aqui: `--trocar Cloud=Claude` (pode repetir).
2. **Escreva o `plano.md`** na pasta do vídeo, frase a frase sobre `src/palavras.json`: onde cortar e qual plano (A, B,
   dividido, editor, celular), o que cada tela encena e as palavras de cada título.
3. **Monte O PLANO** no bloco marcado de `scripts/gerar_tempos.py` (na pasta do vídeo). Toda tela é presa à fala por
   `w('palavra', n)` (início da n-ésima vez que ela é dita) ou `corte('palavra', n)` (2 quadros antes):
   - `BLOCOS` (os cortes) e `planos` (`'A'` ou `'B'`, um por bloco);
   - as telas `editor`, `modelos`, `celular`, `previas`, `outros`, `prompt`, `fecho`, `silencio`: cada uma com os
     instantes dos seus eventos. **Tela que o vídeo não usa vira `None`** e some do vídeo e do som;
   - `PROMPT`: as palavras que a caixa do Claude digita, `(palavra, ocorrência)`;
   - `titulos`: para o editor e o celular, a 1ª palavra (`i0`) e o tamanho de cada página de título (`grupos`).
   - os textos das telas, também no plano: `modelos.nomes` (os cartões, de 2 a 8), `celular.etiqueta` (a etiqueta com
     ✓ embaixo do celular), `outros.texto` (a etiqueta ao lado do rosto) e `titulos.marcas` (palavras do título com
     marca-texto). Os do aprovado são daquele vídeo: escreva o que a fala nova diz.
   - `modelos`: obrigatórios `de`, `modelos`, `criei`, `melhorei`, `sai` e `nomes`. Opcionais: `entradas` (um tempo por
     cartão; sem ele os cartões entram espaçados por igual até `modelos`), `editar` (os cartões saem; sem ele ficam até o
     painel sair), `formatos` (3 tempos) e `claude` (sem eles não há formatos nem chip).
   Some o tempo de cada modo e confira com a tabela da seção 2 (cerca de 2/3 com tela marfim).
4. **Gere o plano:** `../../.venv/Scripts/python.exe scripts/gerar_tempos.py` (na pasta do vídeo). Grava
   `src/tempos.json`; se uma palavra do plano não existe na fala, ele para e diz a linha.
5. **Meça o rosto por trecho:** `../../.venv/Scripts/python.exe scripts/rosto.py` (na pasta do vídeo). Grava
   `src/rosto_med.json`.
6. **Tempo de leitura:** ponha `MIN_PAGINA = 1.5` em `src/tema.ts`.
7. **Confira as regras:** `node scripts/cobertura.mjs` (na pasta do vídeo) até sair `APROVADO`. Ele confere, quadro a
   quadro e com e sem prévias, toda palavra escrita enquanto é dita, página de 1,5 s, palavra de 0,4 s (0,25 s a última
   de uma página de 1,5 s), nada em dois lugares, até 2 linhas, as 2 posições da legenda e a zona segura, e diz o que
   mexer. Página curta que ele aponta quase sempre é plano, não legenda: veja "Fala rápida" abaixo.
8. **Som:** `../../.venv/Scripts/python.exe audio/compor.py` (na pasta do vídeo). Ele lê o `tempos.json` e segue o plano
   sozinho. Sai `public/trilha.wav`. `--cama` liga a música.
9. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10` (na pasta do vídeo). Com
   o seu perfil: `--props '{"arroba":"seu.arroba","foto":"foto.jpg"}'`.
10. **Renderize** (na pasta do vídeo):
    `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrinePadrao01 out/so-voz.mp4 --codec=h264 --crf=16 --concurrency=2 --props='{"arroba":"seu.arroba","foto":"foto.jpg"}'`
    (tire `arroba` e `foto` se a pessoa não deu os dela).
11. **Mixe:** `sh scripts/mixar.sh out/so-voz.mp4 out/final.mp4 public/trilha.wav` (na pasta do vídeo). Sai em -14 LUFS.
12. **Prove que parece o modelo:** `.venv/Scripts/python.exe tools/parece.py videos/<v>/out/final.mp4 modelopadrao01`.
    Reprovou, o vídeo não sai: corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava, com o aprovado
    em cima e o seu embaixo. Se a diferença salta aos olhos, ainda não está pronto.

**Fala rápida (3 palavras por segundo ou mais):** as telas cabem do mesmo jeito; o que muda é o tamanho de cada pedaço.
- **Toda quebra precisa de 1,5 s de fala dos dois lados.** Corte, entrada e saída do dividido, entrada e saída do
  editor e do celular quebram a legenda. Antes de cada uma, conte: se a fala entre duas quebras tem menos de 1,5 s, mude
  a quebra de palavra.
- **Editor e celular:** o título é o texto dito, então o tempo deles é o tempo das páginas de título. Com fala rápida,
  use uma ou duas páginas de 4 a 7 palavras (até 2 linhas) em vez de páginas de 2 ou 3. Entre com
  `de = w('1ª palavra do título') - 0.15` e devolva (`devolve`) na palavra que abre a frase seguinte, sem pausa: a
  legenda some quando o título aparece e volta quando as camadas saem.
- **Editor direto para o dividido** (como no aprovado, 5 s): `devolve` do editor e `de` do dividido na mesma palavra.
- **O dividido é o modo mais longo do modelo** (43%) e o mais fácil de encaixar: a legenda vai para a pílula e a
  frase cabe inteira. Quando uma frase não rende editor nem celular, use o dividido com a caixa do Claude ou os cartões.
- **No máximo 3 quebras numa fala curta** (até uns 30 s a 3 palavras por segundo). Cada quebra a mais rouba 1,5 s de
  algum lado e a legenda vira pedaço curto.
- **Quebre só depois de palavra longa ou de pausa** (mais de 0,3 s). Quebra logo depois de palavra curta e corrida deixa
  essa palavra sozinha na página.
- **A 1ª palavra do título corta a legenda do rosto.** A página de título começa no início da palavra `i0`, não no
  `de` da tela: a legenda do rosto vai até ali. Conte o 1,5 s da última página de legenda até a 1ª palavra do título.
- **A última página de título fica até 0,2 s depois do `devolve`.** Se ela tem menos de 1,5 s, mexa no `devolve`:
  empurre para uma palavra depois (a página ganha tempo) ou adiante e tire essa palavra do título (ela volta para a
  legenda do rosto). O `cobertura.mjs` chama isso de palavra solta de título.
- **Só os cartões:** quando a fala cita modelos mas não fala de formatos nem do Claude, monte `modelos` só com `de`,
  `modelos`, `criei`, `melhorei`, `sai` e `nomes` (de 2 a 8), com `entradas` na palavra que cita cada um. Sem `editar`,
  os cartões ficam até o painel sair; sem `formatos` e `claude`, nada mais entra. Com poucos cartões a grade fica no meio.
- **O último trecho pode ter menos de 2 s quando o vídeo acaba nele.** Não há corte depois para atravessar; vale só a
  régua da legenda (página de 1,5 s, palavra de 0,4 s), que o `cobertura.mjs` cobra.
- **Cauda depois da última palavra:** o vídeo dura o áudio da gravação (`duracao` = tamanho de `public/voz.wav`,
  `src/Root.tsx`) e o rosto congela no último quadro da gravação (`video_fim`). A última página de legenda fica até o
  fim. O aprovado termina 0,73 s depois da última palavra (29,63 s e 30,36 s), então cauda de 0,2 s a 0,8 s é a do
  modelo. Mais que 1 s, apare a gravação antes do `novo-video.py`; menos que 0,2 s, o fim fica abrupto.

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> videos/<v> 1` (e `2`; `--de`/`--ate`
escolhem o trecho), depois `../../.venv/Scripts/python.exe audio/compor.py --previas` (na pasta do vídeo), o render com
`--props='{"previas":true,"nomesPrevias":["modeloA","modeloB"]}'` e a mixagem com `public/trilha_previas.wav`.

## 10. O plano do vídeo aprovado (para comparar)

| Tempo | Fala | Câmera / tela | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado | rosto A, abre limpo | legenda com "100%" em menta |
| 2,1 s | pelo Claude. Ele foi criado justamente para te mostrar | o rosto entra no editor | Claude Code com o vídeo na prévia; lâmina no clipe; faixa de legenda nasce; títulos "pelo", "Ele foi", "justamente para" |
| 5 s | a diferença entre vários modelos que eu criei e melhorei | dividido | cartões dos modelos entram, ✓ e barra; pílula "mostrar a diferença", "entre vários modelos" |
| 8 s | para editar qualquer tipo de vídeo usando o Claude. | dividido | o vídeo em 9:16, 16:9 e 1:1; tudo entra no chip do Claude (10 s) |
| 10,6 s | Inclusive, se você estiver no Instagram agora, | corte, o rosto entra no celular | o vídeo vira Reel com foto, @ e Seguir; títulos "se você", "no Instagram agora" |
| 12,5 s | você está vendo apenas um desses modelos. | celular | etiqueta com ✓ e o nome, marca-texto em "um"; outros celulares atrás (14 s) |
| 14,8 s | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | rosto B, depois dividido com prévias | prévias lado a lado de 15,5 s a 19,9 s, selo "3x" em "aceleradas" |
| 19,9 s | Mas se você quiser realmente ver outros modelos de edição como esse | corte, rosto A; silêncio na virada | legenda; etiqueta "outros modelos" (22 s) |
| 23,9 s | e aprender a como usar isso nos seus vídeos, | dividido | caixa do Claude digitando; enviar acende em "vídeos" |
| 26,7 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | rosto B | campo de comentário com "EDIÇÃO" digitado; a DM chega em cima com o @ (29 s) |

No vídeo aprovado as prévias estão ligadas e a foto e o @ são os reais de quem fala. Os nomes de modelo escritos na tela
são daquele vídeo; num vídeo novo, a tela mostra o que a fala nova diz.
