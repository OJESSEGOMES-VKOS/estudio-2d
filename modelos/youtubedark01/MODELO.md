# youtubedark01

> **Pacote no motor:** `projetos/maquina-de-conteudo/motor/pacotes/youtubedark01/` (versão 1), em prova até o portão do dono. A comparação com o último vídeo aprovado está em `projetos/maquina-de-conteudo/docs/etapa-7/youtubedark01.md`.

Primeiro modelo do estilo **YouTube Dark**: vídeos de canal sem rosto ("perfil dark"), em 16:9 e 9:16.
Montado olhando quadro a quadro 8 vídeos de 3 canais que o Jessé escolheu, lendo o roteiro de cada um
pela legenda e medindo o ritmo de cortes. Diferente dos outros modelos, este cobre **direção** (roteiro e
cenas) além da edição. Tudo o que ele ensinar dizendo "youtubedark01" entra **só aqui**.

Ferramentas em `analise/`: `cenas.py` (detecta cada corte, faz a folha com 1 quadro por cena, mede o ritmo
e limpa o roteiro da legenda). Folhas: `refN_cenas_XX.png` (uma por cena), `refN_t_XX.png` (1 quadro a cada
2 s), `qN_01.png` (6 qps nos momentos-chave). Roteiros: `refN_roteiro.txt`. Ritmo: `refN_cortes.txt`.
Download: `projetos/estudio-2d/tools/.venv-ytdlp` (yt-dlp).

| | Canal | Vídeo | Formato | Duração | Cenas | Mediana por cena |
|---|---|---|---|---|---|---|
| ref1 | Day One Films | DISCIPLINE (1 mi de views) | 16:9 | 2:38 | 6 cortes secos* | — |
| ref2 | Day One Films | DOPAMINE (110 mil) | 16:9 | 2:40 | 9* | — |
| ref3 | Day One Films | Motivation Will Fail You | 16:9 | 3:28 | 26* | 6,0 s |
| ref4 | BibleFix Finance | Why God Can't Trust You With Greater Wealth | 16:9 | 8:16 | 141 | **2,2 s** |
| ref5 | BibleFix | 5 Morning Habits… UNSHAKABLE (222 mil) | 16:9 | 8:52 | 42 | 6,2 s |
| ref6 | BibleFix | God Heard You… (115 mil) | 16:9 | 10:01 | 103 | 3,0 s |
| ref7 | BibleFix | Short: Mercy vs. Grace (13 mil) | 9:16 | 0:38 | 17 | 2,1 s |
| ref8 | BibleFix | Short: Pray with Expectation (22 mil) | 9:16 | 0:50 | 1 | — |

\* Day One troca de cena por fusão pelo preto e por movimento dentro do plano, não por corte seco: o
detector não pega. O ritmo real dele está nas folhas `refN_t`.
Faltou 1 vídeo do BibleFix Finance ("7 Biblical Money Habits"): o YouTube bloqueou o download por excesso
de pedidos. Dá pra tentar de novo.

## 1. A ideia central

**Um bonequinho simples vive o que o roteiro diz.** Nos três canais, quem conduz é um personagem
genérico (palito ou corpo de feijão, rosto redondo, sem nome) com quem qualquer pessoa se identifica. O
canal não mostra rosto, não mostra apresentador: a história é dele, e o espectador se vê nele.

O modelo tem **duas famílias**. Escolha uma por vídeo, não misture:

| | **A. Curta animado** (Day One) | **B. Explicação ilustrada** (BibleFix / Finance) |
|---|---|---|
| Narração | **Nenhuma.** Só música, efeitos e frases curtas na tela | Locutor do começo ao fim, calmo e firme |
| Duração | 2:30 a 3:30 | 8 a 10 min (Short: 35 a 50 s) |
| Imagem | Animação vetorial de verdade: o personagem anda, cai, levanta | Uma **ilustração parada** por frase, em corte seco |
| Ritmo | Planos de 4 a 20 s com movimento dentro | Uma imagem nova a cada **2 a 6 s** (uma por frase) |
| Força | Emoção: o espectador sente a recaída e a virada | Ensino: lista numerada com versículo e exemplo do dia a dia |
| Custo de produzir | Alto (animar personagem) | Baixo (ilustração + voz + legenda) |

## 2. Direção de roteiro

### A. Curta animado (Day One): arco de 3 atos sem fala

1. **Rotina presa (0 a ~35%)**: o mesmo dia se repetindo. Despertador às 5:00, soneca, sofá, celular. Uma
   frase de abertura no preto ("Every day started the same.", "The world used to be full of color.").
2. **O vilão fala (meio)**: uma **sombra do próprio personagem**, preta com contorno vermelho e olhos
   vermelhos, cochicha as mentiras em texto vermelho ("you're lazy", "why even try?", "you'll never
   change", "you don't feel like it"). Ele cede. Fundo escuro com bordas vermelhas.
3. **Fundo do poço**: o personagem encolhido sob um único foco de luz, e a frase-tese em branco ("But lazy
   isn't who you are. It's what you repeat.").
4. **A virada (~40%)**: o mesmo despertador, mas agora ele levanta. Letreiro "DAY 1." no topo.
5. **A luta (montagem)**: contador de dias subindo (DAY 1 → 2 → 5 → 30 → 61 → 100), recaídas (o vilão
   volta, a barra de motivação cai a 0%), ele continua mesmo assim. Saco de pancada vermelho com as
   mentiras escritas, escada subindo, chuva.
6. **A lição em 2 frases** ("Motivation gets you started. / Discipline keeps you going.", "Nobody is coming
   to save you. / So save yourself.") sobre uma paisagem de pôr do sol, a única cena quente do filme.
7. **Fecho em loop**: volta ao quarto do começo, mas ele já está de pé. Às vezes um segundo personagem
   aparece no começo da jornada e ele estende a mão (ref3 "come on.").
8. **Cartela**: título em uma palavra, caixa alta, sublinhado vermelho ondulado ("DISCIPLINE") + "Day one,
   or one day. **You decide.**" (a última frase em vermelho).

Regra: **todo filme é sobre uma palavra** (DISCIPLINE, DOPAMINE, READY, ROOTS) e o vilão é a voz interna
que defende o contrário dela.

### B. Explicação ilustrada (BibleFix): a lista com tese

A estrutura se repete nos 3 vídeos longos, quase com as mesmas palavras:

| Tempo | Bloco | O que diz (exemplo real) |
|---|---|---|
| 0 a 20 s | **Gancho em pergunta ou provocação** | "What would happen to your life if you were completely unshakeable?" / "Money does not just reveal what you can buy. It reveals what controls your heart." |
| 20 s a 1 min | **O problema como o público vive** + o erro comum | "Most Christians want this… but they try to build it in the middle of the storm." |
| ~1 min | **A âncora**: uma passagem que prova a tese | Marcos 1:35, Lucas 16:10 |
| ~1 min | **A promessa da lista** com isca pro fim | "Here are five biblical reasons… **and the fifth may be the most overlooked of all**." |
| corpo | **5 itens**, ~1 a 1,5 min cada | ver abaixo |
| meio (~3:30) | **CTA no meio**: like + inscrição + comentário com frase pronta | "comment, 'Lord, I trust you while I wait.'" |
| fim | **Recapitulação dos 5** em uma frase só + a tese de novo | "protecting your eyes, anchoring your mind…, something amazing begins to happen." |
| último 20 s | **Compromisso no comentário** + like/inscreva + bênção | "type 'I give my mornings to God' in the comments below as your personal pledge." |

Cada item segue a mesma receita: **nome do item numerado → passagem → explicação curta → comparação
do dia a dia → ação prática concreta** ("No phone for the first 15 to 30 minutes after you wake up";
"Think about ordering something online… for a while, you see none of that").

Frase: curta, em segunda pessoa ("you"), com **contrastes em par** ("Not with millions. Not with a
six-figure income. It begins with little." / "The problem is not the amount. The problem is the
pattern."). O Short (ref7) é a mesma coisa comprimida: definição em par ("Mercy withholds what we
deserve. Grace gives what we do not deserve.") em 35 s.

## 3. Direção de cena

### A. Curta animado

- **Personagem**: corpo de feijão creme (`#EDE6D6`), cabeça redonda grande, olhos de ponto, sem roupa, sem
  nome. Um acessório vira marca da virada (a faixa vermelha na testa a partir do DAY 1).
- **Vilão**: silhueta preta do mesmo personagem, maior, com **contorno vermelho brilhante** e olhos de
  fenda vermelhos. Aparece atrás do ombro, cochichando.
- **Mundo**: quarto (cama, janela com lua, criado-mudo com despertador vermelho de LED), sofá com TV,
  mesa com luminária, rua de cidade à noite com postes, academia, escada infinita, colina no pôr do sol.
  Poucos objetos, chão como uma linha. Ref3 já tem cor (roxo, rosa, laranja do céu), ref1 é quase
  preto e branco com vermelho.
- **Objetos que contam a história**: despertador 5:00 gigante em close (e a mão batendo nele), barra
  "MOTIVATION ___%" no canto como HUD de jogo, o calendário com X vermelhos, o espelho que mostra a
  sombra, o celular com vídeos de motivação ("NO EXCUSES", "DO IT NOW") parodiando o YouTube, o gráfico
  final de "motivação em picos vs. disciplina em linha".
- **Repetição com variação**: a mesma cena (despertador, rua, academia) volta 3 a 5 vezes; o que muda é a
  reação dele. É isso que mostra a passagem do tempo.
- **Câmera**: plano geral lateral, como palco. Close no rosto ou no despertador nos momentos de decisão.
  Travelling lateral acompanhando a corrida. Transição por **fusão pelo preto**.
- **Luz**: um foco de luz (abajur, luz da TV, holofote do teto) que isola o personagem; brilho dourado
  no corpo quando a motivação está alta; vermelho quando o vilão domina.

### B. Explicação ilustrada

- **Uma imagem por frase.** A ilustração encena literalmente a frase falada: "you rely on human strength"
  → o boneco empurrando uma pedra com um galho escrito "human strength"; "the problem is the pattern" →
  um ciclo de setas; "Job had great possessions" → um homem com rebanho e tendas.
- **Personagem**: boneco palito com **cabeça redonda grande e camiseta colorida** (azul, verde, vermelho,
  laranja: a cor muda de cena em cena, é o "você" genérico). Personagens bíblicos em traço mais
  realista (Jesus de túnica branca e manto vermelho, com halo).
- **Duas identidades** do mesmo dono, mesma gramática:
  - **BibleFix**: papel creme/pergaminho, lápis + aquarela, muita luz dourada vinda de cima quando Deus
    está na cena.
  - **BibleFix Finance**: **fundo preto**, boneco em traço branco de giz, e só duas cores de destaque:
    **verde neon** no dinheiro e **dourado** na luz. É a versão mais "dark" e mais rápida (2,2 s por
    cena).
- **Metáforas visuais que se repetem**: balança (escolha), porta aberta/fechada (oportunidade),
  ampulheta e relógio (espera), pedra pesada ou corrente (fardo), semente debaixo da terra (Deus agindo
  sem aparecer), feixe de luz do alto (presença de Deus), livro aberto brilhando (Escritura), caminho que
  bifurca (decisão), espelho (autoexame).
- **Câmera**: **parada**. As imagens são estáticas, sem zoom nem pan (confirmado a 6 qps). O movimento vem
  só do corte para a próxima imagem.
- **Cartela de capítulo**: no início de cada item, o título numerado em letra grossa, uma palavra em
  vermelho ("1. GOD MAY BE WORKING / BEFORE Y…") sobre o papel liso, digitando.
- Marca d'água pequena do canal no canto inferior direito.

## 4. Texto na tela

- **B horizontal**: a **frase que está sendo falada**, inteira, em cima, centralizada, serifada ou
  manuscrita fina, preta no claro ou branca no escuro. Troca junto com a imagem. Citação de versículo
  vai entre aspas com a referência.
- **B vertical (Short)**: **uma palavra por vez**, em caixa alta, letra grossa branca com contorno preto,
  no terço de baixo, no tempo da fala (ref7). A palavra-chave da cena às vezes está escrita dentro da
  ilustração ("JUDGMENT", "GRACE / Undeserved Gift").
- **A**: frase curta em minúsculas, fonte manuscrita arredondada, branca no rodapé ou no topo; as falas
  do vilão em vermelho perto dele; letreiros de jogo ("DAY 1.", "MOTIVATION 72%") em caixa alta.

## 5. Ritmo e som

- **A**: um gesto do personagem a cada 1 a 2 s dentro de planos longos. A música manda: piano/ambiente
  baixo no começo, sobe na virada, explode na montagem dos dias, respira na lição. Efeitos de foley
  (despertador, soco, passos, chuva). O vilão tem um som grave e distorcido quando fala.
- **B**: a imagem troca a cada frase (2 a 6 s; o Finance chega a 1,2 s nas frases de lista). Voz grave,
  calma, sem pressa, com pausa depois de cada contraste. Trilha de piano ou cordas bem baixa por baixo
  de tudo. Sem efeito sonoro no corte.

## 6. Vertical × horizontal

| | 16:9 | 9:16 |
|---|---|---|
| A | Formato nativo (plano lateral de palco) | Recortar o mesmo filme não funciona (o palco é largo): refazer os planos em pé, personagem maior |
| B | Ilustração 16:9 + frase em cima | **Ilustração em pé, nova**, palavra por palavra embaixo (ref7). Ou o atalho da ref8: o vídeo horizontal no meio, faixa preta em cima com o título em letra grossa branca ("PRAY WITH EXPECTATION") e embaixo vazio. O atalho é mais fraco (13 mil x 22 mil não prova nada; vale testar) |

## 7. Como a gente produz cada família

- **A (curta animado)**: personagem, vilão e cenários desenhados em vetor (SVG) e animados no Remotion,
  com os objetos (despertador, HUD, calendário) como componentes reaproveitáveis. É o mais trabalhoso;
  um primeiro filme leva um ou mais dias de bancada.
- **B (explicação ilustrada)**: precisa de **uma ilustração por frase** (80 a 150 por vídeo de 8 min). Os
  canais de referência usam ilustração gerada por IA de imagem, no mesmo estilo. Caminhos: (1) API de
  geração de imagem paga, com o ok do Jessé e teto de gasto, travando o estilo por um prompt-base e
  imagens de referência; (2) desenhar em SVG no código, mais barato e consistente, mas mais simples
  que a aquarela. A voz pode ser edge-tts, Qwen (Voicebox) ou a do dono. Montagem, legenda e corte no
  tempo da fala: Remotion + whisper, como nos outros modelos.
- **Roteiro**: passa pelo `/humanizer` e, se for tema bíblico, toda passagem citada é conferida na fonte
  (livro, capítulo e versículo certos). Nunca inventar citação.

## 8. O que depende do dono

- O **nicho e o idioma** de cada perfil dark (os 3 canais são em inglês e de fé/disciplina; o modelo
  serve pra outros temas, mas a estrutura foi medida nesses).
- A **voz**: narrador definido por perfil, e mantido em todos os vídeos do canal.
- O **personagem** de cada perfil: cor, acessório, nome do canal na marca d'água.
- Aprovar o caminho das ilustrações da família B (API paga ou desenho em código).

## 9. Aplicações

| Vídeo | Família | Saída |
|---|---|---|
| HOJE (procrastinação, 32 s, 9:16, sem voz; sombra diz "amanhã") | A | `conteudo/2026-10-06-youtubedark-hoje/out/hoje-youtubedark.mp4` |
| Vitrine dos modelos (30,4 s, 9:16, narrado com a voz do Jessé; prévias superpodcast01 + youtubeedition01) | B (identidade escura) | `conteudo/2026-10-10-vitrine-modelos/youtubedark01/out/vitrine-youtubedark01.mp4` |
