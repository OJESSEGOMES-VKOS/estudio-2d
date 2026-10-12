# ref4: decupagem (Mark Tilbury, "I Tried The LAZIEST Way to Make Money With AI")

Fontes: as 34 folhas `ref4_tl_01..34.png` (todas vistas, em ordem), `ref4_cortes.txt`, `ref4_rosto.txt`,
`ref4_roteiro.txt` e 20 quadros em resolução cheia em `ref4_q_full/` (nome do arquivo = hora real, ex.: `q_23115.png` = 23:11,5).

**Aviso de hora (vale para as outras referências também).** O `medir.py` usa `fps=1/3`, e o ffmpeg pega o quadro do
meio de cada janela de 3 s: o quadro que a folha rotula `00:33` é, na verdade, de 00:34,5. Conferido em quadro cheio
duas vezes (a foto de arquivo rotulada 00:33 está em 00:34,5; a marcação do passo 2, entre rótulos, está em 06:29,4).
Por isso as horas desta decupagem são **hora real ≈ rótulo da folha + 1 s**, com precisão de ±1,5 s, e usam o início
exato do corte quando o `ref4_cortes.txt` mostra. Recursos de menos de 3 s podem cair entre dois quadros e não aparecer
na folha (o "marcar passo 2" só foi achado em quadro cheio).

---

## 1. Ficha

| item | valor |
|---|---|
| Canal | Mark Tilbury |
| Título | I Tried The LAZIEST Way to Make Money With AI |
| Tema | desafio de 7 dias: criar influenciadores de IA (Claude + Higgsfield), postar no Instagram e vender um produto digital, com orçamento de US$ 99 e aposta de US$ 1.000 |
| Duração | 33:19 (1999,1 s) |
| Nicho | renda extra / dinheiro com IA, formato "I tried" (experimento documentado) |
| Rosto (detector) | grande 91% (603 quadros), pequeno 0%, sem rosto 9% (63) |
| Rosto (conferido na folha, quadro a quadro) | rosto dele em plano cheio 51% (R1/R2/R6 39%, R4 7%, R3 5%); rosto dele **no círculo** sobre a tela 39% (R5); rosto de outra pessoa ou foto 2%; sem rosto 9% |
| Cortes | 452 cenas, mediana 3,02 s, média 4,42 s, 17 cenas abaixo de 1 s, 101 acima de 6 s, 15 acima de 15 s; 13,6 cortes/min |
| Cortes por minuto | 16 26 25 20 13 19 14 7 11 13 12 22 10 14 16 18 8 14 10 16 10 14 9 17 12 9 10 8 14 9 12 11 10 3 |

**O "rosto grande em 91%" não é ele em A-roll em 91% do tempo.** Cruzando cada um dos 666 quadros com o valor do
detector:

- **254 dos 603 "rostos grandes" são o círculo da câmera dele** sobre a gravação de tela (R5). O círculo ocupa ~31% da
  altura e o rosto dentro dele mede 0,17 a 0,25 (mediana 0,19), acima do limite de 0,12. Por isso o detector deu
  "rosto pequeno 0%": o caso que o protocolo chama de rosto pequeno existe em 39% do vídeo, mas passa do limite.
  Prova em quadro cheio: `q_1015.png`, `q_22505.png`, `q_30390.png`.
- **11 quadros são rosto de outra pessoa**: criadores terceiros no gancho (00:09, 00:12, 00:21), Cruella no filme
  (11:21), card do vídeo antigo dele e colagens de personagens de IA (09:21, 09:24, 15:33, 25:21), e fotos (00:33 ele
  jovem, 30:21 ele com dois rapazes).
- Em pelo menos 7 quadros de círculo, o maior rosto medido é o da **influenciadora de IA** na tela, não o dele: 01:42
  Lil Miquela (0,53), 02:51 e 03:00 a podcaster loira (0,43 e 0,48), 05:18 Mother Satori (0,44), 06:18 (0,43), 11:15
  Vivienne (0,39). Nos 45 quadros de tela dividida (R4) os dois rostos aparecem juntos.
- No gancho (00:03 a 00:09), entre amostras, **o próprio Mark vira três personagens de IA** na mesma cadeira e
  cenário: uma mulher, um rapper e um alienígena réptil (`q_00045.png`, `q_00053.png`, `q_00062.png`). O detector
  conta esses rostos como A-roll.
- Os 63 "sem rosto" são o quadro e a lista de tarefas filmados de cima (42), as cartelas de contagem e texto (13) e 8
  telas sem círculo.

**Como é o A-roll.** Plano médio frontal, centralizado, sentado a uma mesa escura com notebook à direita (aparece a
partir de 01:24; no gancho a mesa está vazia). Parede de tijolo aparente, luminária de pé de três lâmpadas acesas à
esquerda, prateleira com lâmpadas e carrinhos de controle remoto à direita, luz quente lateral, fundo levemente
desfocado. Microfone não aparece. **Duas câmeras**: a frontal (com punch-in digital de corte) e um close lateral de
lente longa (`q_12315.png`), usado quase sempre em preto e branco. **Cenário e roupa trocam a cada "dia"** do desafio:
camisa azul-marinho + tijolo (dia 1, até 19:12), azul-clara + parede de ripas de madeira e jukebox iluminada (19:13),
externo em pátio com celular e caneca (21:40), vermelha + jukebox (22:37), azul-escura + jukebox (23:31), azul-royal +
tijolo (29:06). **Legenda queimada: não.** Só o primeiro trecho (00:00 a 00:03) tem a palavra-chave "thousands of
dollars" em amarelo embaixo (`q_00015.png`); o resto do vídeo não tem legenda.

---

## 2. Estrutura do roteiro

| tempo | bloco | o que diz | função |
|---|---|---|---|
| 00:00-00:25 | Gancho + prova do gancho | "People are secretly making thousands of dollars using Claude to make AI influencers like this, this, and this" + falas de terceiros "$100,000 in the last 30 days", "$200,000 profit" | promessa de dinheiro + demonstração (ele vira IA) + prova social com painéis |
| 00:25-00:32 | Tensão | "Some are even calling it the laziest AI side hustle. But does this really work or is it just AI slop?" | a pergunta que o vídeo vai responder |
| 00:32-00:40 | Credencial cética | "as a businessman who made his millions the old school way... I'm highly skeptical" | por que ele é o juiz certo (foto antiga) |
| 00:40-00:54 | Promessa + aposta | "I'm giving myself 7 days... sharing the raw results. And if I don't make at least $1,000, I'll give someone down in the comments $1,000" | prazo, transparência e risco pessoal; teaser "COMING UP" |
| 00:54-01:17 | Regras + largada | "I must follow these three rules... Okay, start the timer." | limita o jogo (US$ 99, sem rosto/voz, 1º influenciador no dia 1) e liga o relógio |
| 01:17-04:28 | Passo 1: espionar a concorrência | "first up on our to-do list is to spy on the competition" (Lil Miquela, Mother Satori, bandeiras, vovó) → nicho | pesquisa vira quadro NICHE/FORMAT/USP/MONEY; acha a lacuna "wealth" |
| 04:28-06:34 | Passo 2: ideias de personagem | "I want this to be as lazy as possible. So, let's use AI to generate some ideas." | tutorial no Claude: Amos, Vivienne, Sienna |
| 06:34-11:58 | Passo 3: gerar as fotos | "it seems like Higsfield is one of the best" | cadastro, **código de desconto TILBURY** (07:35-08:20, CTA no meio), conector Claude+Higgsfield, fichas e locais dos três |
| 11:58-14:10 | Passo 4: conteúdo viral | "I'm going to use something called a Claude skill" | skills, ideias e roteiros |
| 14:10-15:28 | Passo 5: voz | "we're going to be giving them a voice" | TTS no Higgsfield |
| 15:28-19:10 | Passo 6: dar vida | "combine our images, locations, and scripts and turn them into high quality videos" | geração de vídeo + "sneak peek" com reação; fim do dia 1 ("come back tomorrow") |
| 19:10-21:37 | Passo 7: lançar as contas | "Okay, so this morning..." | novo dia; Instagram, bio com "Your AI grandpa" |
| 21:37-22:33 | Check-in fora do plano | "Well, this is fairly unexpected. I wasn't actually planning on filming" | drama dos comentários; gravado em outro lugar |
| 22:33-23:30 | Passo 8: coroar o vencedor | "Coming in third is Viven... Amos came first. But look at the gap." | ranking com números de seguidores |
| 23:30-29:06 | Passo 9: começar a ganhar | "let's look at our options" | eliminação riscando no quadro, produto digital no Claude, loja no Stan Store |
| 29:06-32:00 | Passo 10: contar o lucro | "we actually made some sales. But we've made a massive mistake." → opinião ("sucks the soul out of the internet") → "Let's crunch the numbers" | reviravolta (Vivienne viralizou), posição ética, receita US$ 276, custos US$ 118,52, lucro US$ 157,48 |
| 32:00-32:45 | Perspectiva | "Imagine what we could achieve if we expanded our strategy" | recap "PREVIOUSLY" e potencial |
| 32:45-33:19 | Fecho + CTA final | "a deal is a deal... I'm going to be giving one of you in the comments $1,000... Make sure to subscribe if you want to grow your wealth" | paga a aposta, CTA de comentário, próximo vídeo, inscrição |

CTAs no meio: código TILBURY (07:35-08:20), "link in the description... follow along" (08:22), "cheat sheet" cinco vezes
(09:32, 12:20, 16:29, 20:09, 25:47), pedido de comentário sobre Shopify (24:01), "this isn't sponsored" sobre o Stan
Store (27:25).

---

## 3. Linha do tempo de recursos

Legenda de leitura: "círculo" = câmera dele em círculo com sombra, num canto, sobre a gravação de tela (R5). A
gravação de tela vem quase sempre ampliada (zoom de ~1,5x no campo em uso). Trechos de R1 puro foram omitidos.

| hora | código | o que aparece | fala no momento | gatilho |
|---|---|---|---|---|
| 00:00-00:03 | R1 + C5 | legenda amarela só com a palavra-chave "thousands of dollars", embaixo, centralizada | "People are secretly making thousands of dollars" | valor em dinheiro da promessa |
| 00:03-00:09 | R1 (fora da taxonomia: troca de rosto por IA) | na mesma cadeira e cenário, ele se funde numa mulher, num rapper e num alienígena réptil, um a cada "this" | "AI influencers like this, this, and this" | "this, this and this" pede exemplo; o tema (IA) é demonstrado no próprio apresentador |
| 00:09-00:13 | P4 | criador terceiro em luz azul falando pra câmera | "I've generated $100,000 in the last 30 days" | depoimento de quem já faz = prova do gancho |
| 00:13-00:16 | P4 + P1 | outro criador (boné, microfone) com post de influenciadora de IA ao lado | "AI influencers are changing the entire game" | idem |
| 00:16-00:18 | P4 (E1 dentro) | trecho de vídeo de terceiro: tela branca "But the best part is $671" em verde | "This is actually generating sales over $2,000" | número |
| 00:18-00:20 | P3 | painel de vendas do stan.store de terceiro, e-mails pixelados | "$2,000" | número → painel |
| 00:20-00:25 | P3 + P4 | painel "USD payouts $3,554.77", "ARR $1.11M", "Gross volume $103K", criador no canto | "$200,000 profit. We made over $13,000." | números |
| 00:31-00:33 | R3 | texto à esquerda entrando palavra a palavra: "But does this REALLY work or... is it just AI", REALLY grande em amarelo | "But does this really work or is it just AI slop?" | a pergunta central do vídeo |
| 00:33-00:36 | C2 (foto de arquivo) | foto antiga dele jovem numa loja de modelismo TAMIYA, num card sobre o próprio A-roll desfocado (`q_00345.png`) | "as a businessman who made his millions the old school way" | credencial pessoal citada |
| 00:43-00:48 | C4 (P2 em P&B) + R5 | tag amarela "COMING UP..." sobre fundo quadriculado escuro; tela do Claude em P&B com as imagens pixeladas, depois painel do Stan Store em US$ 0,00 (`q_00435.png`) | "I'll be documenting the whole process and of course sharing the raw results" | promessa de documentar → prévia que esconde o resultado |
| 00:51-00:54 | R4 (E5) | card de comentário do YouTube "@marktilbury if I fail this challenge then someone..." embaixo do rosto | "I'll give someone down in the comments $1,000" | "comments" |
| 00:55-01:12 | P5 + E1 | prancheta "THE RULES" filmada de cima, mãos; cada regra aparece escrita na hora em que é dita ("1 BUDGET OF $99", "2 NO PERSONAL ADVANTAGE", "3 FIRST INFLUENCER IN ONE DAY"), intercalada com R1 | "One, ...less than $99. Two, I can't use my own face or voice... three..." | enumeração |
| 01:12-01:14 | R2 | punch-in forte | "Okay, start the timer." | ordem de largada |
| 01:15-01:18 | C4 (E1) | "TIME REMAINING... 6 DAYS 23 HOURS", amarelo sobre preto quadriculado | (logo após "start the timer") | relógio ligado |
| 01:19-01:22 | P5 + E2 | lista física "TO DO LIST" de 10 passos em caneta neon, sobre o quadro de 4 quadrantes | "first up on our to-do list is to spy on the competition" | "to-do list" |
| 01:22-01:25 | P5 + E2 | quadro NICHE / FORMAT / USP / MONEY vazio | "figure out all of their secrets" | promessa de organizar a pesquisa |
| 01:28-01:31 | P1 + R5 | mosaico de posts da Lil Miquela | "She's called Lil Michaela" | nome próprio |
| 01:31-01:34 | P2 + R5 | perfil do Instagram, cursor circula "2.2M followers" | "over 2 million followers" | número |
| 01:34-01:37 | P1 + R5 | post do Met Gala com comentários | "Here she is at the Met Gala" | evento citado |
| 01:37-01:39 | R1 em P&B | ele em preto e branco | "Didn't get an invite myself" | autodepreciação |
| 01:43-01:46 | P1 + R5 | artigo "Lil Miquela does not exist. She just made $12 million." | "how is Lil Michaela making over $11 million a year?" | número que precisa de prova |
| 01:46-01:49 | P1 + R5 | trecho do artigo com grifo e cursor em "Calvin Klein, Prada" | "including Prada and Kelvin Klein" | marcas citadas → grifo |
| 01:52-01:55 | P5 + E2 | mão escreve "BRAND DEAL" no quadrante MONEY | "let's write brand deals in the money section" | conclusão anotada |
| 01:55-01:58 | P1 + R5 | post da Lil Miquela de couro | "positioned as a full-blown supermodel" | posicionamento citado |
| 02:01-02:06 | P1 + R5 | perfil mother.satori com grid; bio grifada | "This is Mother Satori, and she's a US-based holistic expert" | nome + descrição |
| 02:10-02:13 | P1 + R5 | press release "The Global Wellness Economy Hits a Record $6.8 Trillion" com grifo amarelo | "health is one of the most profitable niches out there" | afirmação de mercado |
| 02:13-02:16 | P5 + E2 | escreve HEALTH/WELLNESS (NICHE) e SUPERMODEL (USP) | "people will always pay to feel better" | anotação |
| 02:16-02:21 | P4 + R5 | reel da Mother Satori tocando com som, legenda do próprio reel ("THAT'S MY MOTHER", "YOU 108 YEARS") | "I'm going to have to watch this one." / "Wife, that's my mother... 108 years old" | "watch this" → toca o vídeo |
| 02:25-02:27 | R6 em P&B | close em preto e branco | "I thought I was the old one around here" | piada de idade |
| 02:28-02:31 | P5 + E2 | escreve OLD AGE (USP); FORMAT ganha "interview style, props" | "the unique selling point, let's put old age" | conclusão |
| 02:31-02:36 | P4 + R5 | reel com o frasco, comentários ao lado | "she promotes this... some sort of gut cleanse detox drink" | produto citado |
| 02:40-02:43 | P4 + R5 | reel "SERENE HERBS SOURSOP", coluna de comentários | "the comment section is full of people asking to buy it" | afirmação → mostra os comentários |
| 02:46-02:49 | P5 + E2 | escreve PHYSICAL PRODUCTS (MONEY) | "promoting this one product alone" | conclusão |
| 02:50-02:56 | C4 (montagem: P4 + P5) | cortes de 0,6 a 0,8 s alternando reels e o quadro sendo preenchido (MILITARY, RELATIONSHIPS, VLOG, PODCAST, PATRIOTIC, UNDERDOG); a legenda automática marca [music] em 02:55 | "let's quickly blast through some more as I'm running out of time" | pressa declarada |
| 02:52-03:04 | P4 / P1 + R5 | reel de podcast e grid da loira ("Olivia") | "glamorous lifestyle photos and makes these podcast style reels" | descrição de formato |
| 03:07-03:12 | P4 + R5 | TikTok "Luke's Flags": veterano fazendo bandeira de madeira | "patriotic British guy pouring his heart and soul into crafting these beautiful wooden flags" | descrição |
| 03:16-03:21 | P4 + R5 | mais vídeos da conta ("Nobody will EVER buy your stup*d veteran flags") | "Now, is this ethical? No, because the person behind the account is lying" | julgamento → o caso de novo na tela |
| 03:28-03:34 | P4 + P1 + R5 | vovó de IA rosa num iate; perfil grannyspills "2.1M followers" | "this AI granny... over 2 million followers" | número |
| 03:37-03:44 | P5 + E2 | quadro completo; mão aponta a coluna MONEY (brand deals, physical products, ad revenue, digital products, affiliate income) | "making money in all these different ways" | síntese |
| 03:46-03:51 | R3 | rosto à esquerda, texto à direita: "Money Making Niches:" e depois "1. Health 2. Wealth 3. Relationships" | "three niches... Health, wealth, and relationships" | lista falada |
| 03:52-03:57 | P5 + E2 | circula HEALTH/WELLNESS e RELATIONSHIPS | "Two of them are already on the board" | referência ao quadro |
| 04:01-04:03 | P5 + E2 | WEALTH escrito e circulado | "not a single one... was talking about money or wealth, which means we found a gap" | descoberta |
| 04:10-04:14 | R2 | punch-in forte | "you'll have an advantage over everyone else" | conselho direto ao público |
| 04:19 | R2 | punch-in | "So, we can tick step one off our list" | fecho de etapa |
| 04:22-04:27 | P5 | lista: caneta vermelha marca o passo 1 | "tick step one off our list" | etapa concluída |
| 04:28-04:31 | C4 | "6 DAYS 21 HOURS" | "move on to step two, generating character ideas" | troca de capítulo |
| 04:34-04:39 | P2 + R5 | Google: digita "Cl", resultado "Claude by Anthropic" | "I'm going to head over to Claude" | nome de ferramenta |
| 04:43-05:01 | P2 + R5 | Claude, caixa de texto em zoom; o prompt é digitado no ritmo da fala | "create a character profile for an AI influencer in the health niche. Give them a name, a backstory..." | passo de tutorial |
| 05:04-05:14 | P2 + R5 | resposta do Claude com zoom e grifo azul acompanhando o que ele lê ("101 years old", "Lived off the land...") | "Okay, so Amos... 101 years old. Uh, bit like me, I guess." | leitura de resultado |
| 05:19-05:21 | P4 + R5 | volta o reel da Mother Satori | "sound like a male version of Mother Sator" | retorno a referência anterior |
| 05:25-05:28 | P2 + R5 | grifo "Completely shaved head / Very long white beard" | "Shaved head, long beard." | leitura |
| 05:31-05:47 | P2 + R5 | digita "Now do it for the wealth"; Grandma Vivienne com grifos linha a linha | "started with nothing, made loads of money, been through three husbands, private jets" | tutorial + leitura |
| 05:52-05:58 | P2 + R5 | grifo "Almost everyone in this niche is a young man in a rented Lamborghini, she is the exact opposite" | mesma frase lida | leitura |
| 05:58-06:03 | P1 (material próprio) + R5 | o canal dele no YouTube (miniaturas "$300/DAY", "$500/day") | "one of the reasons I managed to stand out in the wealth niche" | autorreferência → o próprio canal como prova |
| 06:04-06:14 | P2 + R5 | digita "Now finally do it for the relationship"; Sienna com grifos | "Sienna, stylish, 22 years old... situationship drama" | tutorial |
| 06:19-06:22 | P4 + R5 | três reels da loira lado a lado, views 3.1M, 278K, 233K | "the AI influencer that we found earlier called Olivia" | retorno |
| 06:29-06:31 | P5 | lista: caneta verde marca o passo 2 (inserto de 1,7 s, só em quadro cheio: `q_06294.png`) | "let's move on to step three" | etapa concluída |
| 06:34-06:37 | C4 | "6 DAYS 21 HOURS" | "generate the photos" | capítulo |
| 06:43-07:02 | P2 + R5 | Google "Higgsfield AI", home do site, modal "Welcome to Higgsfield", cursor em "Continue with Email" | "Higsfield is one of the best... click sign up... I think I'm going to just use email" | tutorial |
| 07:07-07:26 | P2 + R5 | perguntas do cadastro, cursor escolhe cada resposta | "How do you plan to use Higsfield? Uh, for personal use... I want to create avatars" | tutorial |
| 07:28-07:30 | R6 em P&B | close lateral em preto e branco | "Look, I'm not doing bad for an old boy." | autodepreciação |
| 07:31-07:34 | P2 + R5 | pop-up "Congratulations! You received a personal 55% OFF offer" | "it's just popped up with a personal offer" | o que surge na tela |
| 07:34-07:36 | R2 | punch-in (`q_07345.png`) | "we don't need this deal because we've got a much better one" | virada |
| 07:58-08:20 | P2 + R5 | planos "GO PREMIUM", menu do perfil, "Manage Account", campo "Enter promo code"; TILBURY digitado em letras gigantes; "Promo code for 20% discount applied successfully!" em verde | "type in Tilbury. T I L B U R Y. So I'm going to click claim." | código soletrado → texto enorme |
| 08:25-08:28 | R1 + C5 | faixa amarela "FOLLOW ALONG WITH ME" embaixo, com seta curva apontando pra baixo | "I'll drop a link in the description below if you guys want to follow along" | CTA de descrição |
| 08:28-08:45 | P2 + R5 | planos Starter/Plus/Ultra, zoom no Ultra US$ 79, checkout | "over 100 videos here on this ultra one... as you can see, it's under budget" | escolha + prova de que cabe no orçamento |
| 08:49 | R2 | punch-in | "we can connect Higsfield with Claude" | ideia nova |
| 08:55-09:11 | P2 + R5 | Claude "Good evening, Mark Tilbury" > Customize > Connectors > Add custom connector; página "Higgsfield MCP & CLI"; URL colada; conector listado | "let's go to customize, then click connectors, add... paste this link" | tutorial |
| 09:16 | R2 | punch-in | "starting with Amos, our health influencer" | ideia nova |
| 09:22-09:27 | P1 (material próprio) | card do vídeo dele "Laziest Ways to Make Money with AI (For Beginners) 1.9M views · 1 month ago" sobre fundo quadriculado | "from my past experience dabbling with AI" | autorreferência → vídeo anterior |
| 09:31 | R2 | punch-in | "instead of spending ages writing something really detailed" | contraste |
| 09:34-09:39 | R1 + C5 | faixa "FREE CHEAT SHEET" com seta pra baixo | "I'll add all of my prompts to the cheat sheet in the description" | material prometido |
| 09:43-09:57 | P2 + R5 | o prompt no Claude, com grifo amarelo andando trecho a trecho ("two panels", "completely bald...", "white studio background, photorealism, real untouched skin") | "a full body shot and a closeup... white background with realistic looking skin" | leitura do prompt |
| 10:01-10:15 | P2 + R5 | prompt enorme rolando rápido; "yes"; ferramenta "Higgsfield AI generate_image" (`q_1015.png`) | "Wow, this is a monster... all that's left for me to do is to type yes" | volume do texto |
| 10:19-10:26 | P2 + R5 | ficha do Amos (corpo inteiro + close) | "He actually looks very realistic... He looks younger than me" | revelação de resultado |
| 10:31-10:38 | P2 + R5 | digita "make him a few years older"; versão envelhecida | "So, let's type make him a few years older. Oh, that's better." | correção |
| 10:40-10:56 | P2 + R5 | digita os locais, palavra por palavra; imagem da varanda | "his porch, farmhouse, kitchen, vegetable garden" | tutorial |
| 11:04 | R2 | punch-in | "Just for the sake of time" | anúncio de aceleração |
| 11:06-11:12 | C4 (montagem: P2) | 6 cortes de ~1 s no Claude até a Vivienne; [music] em 11:10 | "I'm going to go through this quickly" | aceleração declarada |
| 11:10-11:17 | P2 + R5 | ficha da Vivienne (óculos, casaco de pele) | "The sunglasses, the jewelry, the fur coat" | descrição do resultado |
| 11:22-11:25 | C3 | cena de filme da Cruella (101 Dálmatas) | "It looks like that woman from 101 Dalmatians, doesn't it?" | referência pop |
| 11:25-11:36 | P2 + R5 | digita os locais; jato, carro esportivo, sala, terraço aparecem um a um | "a private jet, a sports car... drawing room... terrace" | cada item citado aparece |
| 11:40-11:44 | P2 + R5 | ficha da Sienna (3 painéis) | "Sienna. She looks pretty stylish" | resultado |
| 11:49-11:52 | P2 + R5 | locais da Sienna | "we've also got the locations here, too" | resultado |
| 11:55-11:58 | P5 | lista: caneta rosa marca o passo 3 | "That's our photos generated" | etapa concluída |
| 11:58-12:01 | C4 | "6 DAYS 19 HOURS" | "mapping out the viral content" | capítulo |
| 12:10-12:17 | R2 + R4 (P1) | card "Claude Support" com a definição de skills entra embaixo e depois desliza pra esquerda | "If you haven't heard of skills before, they're basically reusable tools" | termo técnico → definição oficial |
| 12:22-12:29 | R1 + C5 | "FREE CHEAT SHEET" | "I'll include them in the cheat sheet so you can use them" | material prometido |
| 12:30-12:32 | R6 | close lateral da 2ª câmera (`q_12315.png`) | "let's give them a try and hope for the best" | variação de plano |
| 12:34-12:56 | P2 + R5 | Settings > Skills > Add > Upload skill > arrastar; "/content-engine Generate content ideas for" | "upload a skill, and drag and drop... hit forward slash and select content engine skill" | tutorial |
| 13:04-13:13 | P2 + R5 | lista de ideias rolando; grifo "#2 First date questions the girlies never ask" | "It's handed me a whole list... I quite like idea two" | escolha |
| 13:22-13:26 | P2 + R5 | grifos no gancho #1 e no #7 | "Number one sounds good... number seven is also quite interesting" | escolha |
| 13:34-13:37 | P2 + R5 | digita "Generate scripts for t..." | "let's generate scripts for these three" | tutorial |
| 13:52-13:58 | C4 (montagem: P2) | roteiros dos outros dois rolando; [music] em 13:54 | "Now I'll do the same process for the other two influencers" | repetição comprimida |
| 14:04-14:07 | P5 | lista: caneta laranja marca o passo 4 | "let's tick that one off our list" | etapa concluída |
| 14:10-14:13 | C4 | "6 DAYS 19 HOURS" | "we're going to be giving them a voice" | capítulo |
| 14:16-14:22 | P2 + R5 | Higgsfield, aba Audio, "Upload media" | "go to the audio tab. It says you can upload media" | tutorial |
| 14:28-14:40 | P2 + R5 | foto da Vivienne carregada; script digitado no ritmo da fala | "Hi, my name is Viven. Use this sound." | tutorial |
| 14:49-15:04 | P2 + R5 | prompt de voz no Claude; colado em "Voice details"; Generate; "Seed Audio 1.0" gerando; a voz gerada toca | "click generate." / ">> Hi, my name is Vivienna." | tutorial + revelação sonora |
| 15:10 | R2 | punch-in | "It actually sounds like one of my old school teachers" | comentário pessoal |
| 15:13-15:16 | C4 (montagem: P2) | TTS do Amos; [music] em 15:14 | "I'll do the same process but for Amos and Sienna" | repetição |
| 15:22-15:25 | P5 | lista: marca o passo 5 | "Cool. So, that's sorted." | etapa concluída |
| 15:28-15:31 | C4 | "6 DAYS 18 HOURS" | "bring them to life" | capítulo |
| 15:34-15:37 | E2 (colagem de C2 gerado) | ficha da Vivienne + jato, terraço, carro, interior, arranjados sobre fundo quadriculado | "combine our images, locations, and scripts" | "combine" → junta as peças na tela |
| 15:40-16:11 | P2 + R5 | Cinema Studio: novo projeto "Sienna", proporção 9:16, qualidade 1080p | "go to Cinema Studio and then new project... 9 by 16... 1080p" | tutorial |
| 16:22-16:27 | R4 (P4) | ele à esquerda; reels verticais de terceiros com texto na tela à direita | "I've seen these types of videos do really well recently" | referência de formato |
| 16:31-16:38 | R1 + C5 | "FREE CHEAT SHEET" | "another Claude skill, which I'll also add to the cheat sheet" | material prometido |
| 16:40-16:56 | P2 + R5 | cola o prompt detalhado e rola; referência "@image1" | "let's paste the detailed prompt... it's referenced image one" | tutorial |
| 17:01-17:08 | R5 (janela retangular dentro da interface) + P2 | vídeo gerado da Sienna à esquerda; o A-roll dele encaixado num retângulo no lugar do preview do app (`q_17025.png`) | "All right, not bad. Nothing crazy at this point because obviously she's not talking" | revelação + reação |
| 17:13-17:26 | R2 | punch-in e enquadramento mais fechado sustentado | "this is a nice way to test... hear Sienna talk for the first time" | expectativa |
| 17:28-17:30 | C4 (montagem: P2) | gerando vídeos da Vivienne; [music] em 17:26 | (música) | passagem de tempo |
| 17:31-17:34 | C4 | "6 DAYS 16 HOURS" | (antes de "I've made a lot of these videos now") | elipse |
| 17:40 | R2 | punch-in | "Let me give you a sneak peek at some of my favorites" | anúncio de mostrar |
| 17:43-17:59 | R4 (C2 gerado) | tela dividida: ele à esquerda assistindo e reagindo, clipe do Amos à direita com som (café na varanda, feijão na cozinha) | ">> There's a quote I live by..." / ">> Number one longevity food in the world, beans." | "sneak peek" → reação lado a lado |
| 18:01-18:03 | R6 em P&B | olhando pra baixo, preto e branco | "I don't know if the wife will agree that beans are the best thing" | piada |
| 18:04-18:08 | R4 (C2 gerado) | split com a Sienna | ">> I can turn water into wine, but I can turn you into mine." | clipe |
| 18:16-18:23 | R4 (C2 gerado) | split com a Sienna | ">> She's your friend, but whenever she gets a boyfriend..." | clipe |
| 18:28-18:47 | R4 (C2 gerado) | split com a Vivienne | ">> Excuse me, ma'am. How did you get rich?" | clipe |
| 18:55-18:57 | R2 | punch-in extremo | "probably some of the younger ones as well" | punchline |
| 19:07-19:09 | P5 | lista: caneta vermelha marca o passo 6 | "we've completed that part of the challenge" | etapa concluída |
| 19:10-19:13 | C4 | "6 DAYS 16 HOURS" | "I'm going to come back tomorrow" | fim do dia 1 |
| 19:13-21:36 | R6 | novo cenário: camisa azul-clara, parede de ripas, jukebox iluminada | "Okay, so this morning..." | novo dia → nova roupa e cenário |
| 19:16-19:19 | C2 + C4 | card em P&B das mãos e caneca na mesa, tag amarela "THIS MORNING..." | "this morning I've been a bit cheeky and added some captions" | marcador de tempo |
| 19:22-19:25 | P1 | site do Instagram Edits "Video editing app for creators" | "free editing apps like Cap Cut or Instagram Edits" | ferramenta citada |
| 19:31 | R2 | punch-in | "We're just going to focus on Instagram for now" | decisão |
| 19:37-20:08 | P2 + R5 | cadastro no Instagram: "Amos \| Health and Wellness", "The username Amos is not available", "Amos.oldways", seletor de arquivos | "I assume just Amos is taken. Yep, makes sense. So, let's type old ways" | tutorial |
| 20:10-20:15 | R6 + C5 | "FREE CHEAT SHEET" | "of course, I'll add the prompts in the cheat sheet" | material prometido |
| 20:16-20:28 | P2 + R5 | escolhe a foto de perfil (com o cordeiro, etc.) | "We've got him with a little lamb here" | escolha |
| 20:34-20:58 | P2 + R5 | bio digitada "101 years old... Your AI grandpa", rótulo "AI creator" ligado, perfil pronto | "I'm also going to write your AI grandpa because I don't want anyone feeling like they've been tricked" | tutorial + ética |
| 21:04-21:07 | C4 (montagem: P2) | perfis da Sienna e da Vivienne; [music] em 21:03 | "rinse and repeat" | repetição |
| 21:13 | P2 + R5 | perfil amos.oldways | "I've now got the accounts all set up" | prova de feito |
| 21:16 | R2 | punch-in | "I'm going to post 10 videos on each account" | plano com número |
| 21:19-21:21 | P5 | lista: caneta verde marca o passo 7 | "it's time to start posting" | etapa concluída |
| 21:28-21:30 | P5 | lista parada, próximos passos à vista | "crown the winner and double down on them" | próximo passo citado |
| 21:31-21:36 | R4 + E4 | ele à esquerda, Vivienne à direita; seta curva desenhada e tag amarela "Editor's note: Mark's crush?" (`q_21325.png`) | "I'm of course rooting for Grandma Vivien" | torcida declarada → piada do editor |
| 21:37-21:40 | C4 | "4 DAYS 16 HOURS" | (após "something to report") | salto de tempo |
| 21:40-22:32 | R6 | externo: pátio, celular na mão, caneca, jardim ao fundo | "Well, this is fairly unexpected. I wasn't actually planning on filming anything" | check-in fora do plano → cenário improvisado |
| 21:52-22:08 | R4 (P1) | card do comentário do Instagram à esquerda ("Dude you are wearing a SHEIN dress and drinking a $3 frappuccino..."); as respostas surgem uma a uma | "Someone here is bashing Sienna... support from another fellow woman... the hater came back for more" | comentários citados |
| 22:19-22:23 | R4 (P1) | comentário "Okay but where's that hoodie fromm such a good color" entra desfocado e fica nítido | "people asking where she got her clothes from" | comentário citado |
| 22:34-22:37 | C4 | "4 DAYS 16 HOURS" | (antes de "since we last spoke") | elipse |
| 22:37-23:30 | R6 | camisa vermelha, jukebox | "since we last spoke, I've genuinely tried my hardest not to look at these accounts" | novo dia |
| 22:46 | R2 | punch-in | "Coming in third is Viven" | revelação |
| 22:49-22:53 | P3 + R5 | perfil grandma.vivienne: 10 posts, 359 followers (`q_22505.png`) | "Coming in third is Viven" | ranking → número |
| 22:58 | R2 | punch-in | "that one does sting a bit" | emoção |
| 23:07-23:12 | P3 + R5 | sienna.saysso 2,643 followers; amos.oldways 3,699 followers (`q_23085.png`) | "Coming in second is Sienna, which obviously means Amos came first" | ranking → número |
| 23:13-23:20 | R4 (P3) | os dois perfis em cards empilhados à direita, ele à esquerda (`q_23115.png`) | "But look at the gap. Sienna's numbers are genuinely really impressive" | comparação |
| 23:28-23:30 | P5 | lista: marca o passo 8 | "let's crown Amos our winner" | etapa concluída |
| 23:31-29:06 | R6 | camisa azul-escura, jukebox | "Right. So, now we've got a clear winner." | novo bloco |
| 23:37-23:41 | P5 + E2 | o quadro do começo volta; mão gesticula sobre MONEY | "at the start of this challenge, we wrote down all the different ways" | retorno |
| 23:55-23:59 | P5 + E2 | risca BRAND DEALS | "for this challenge, it's definitely out of the question" | eliminação |
| 24:10 | P5 + E2 | risca PHYSICAL PRODUCTS | "setting up a store as a whole project in itself" | eliminação |
| 24:16-24:20 | P5 + E2 | risca AD REVENUE | "that isn't an option right now" | eliminação |
| 24:34-24:38 | P5 + E2 | risca AFFILIATE INCOME | "we'll have to cross that one off, too" | eliminação |
| 24:46-24:48 | P5 + E2 | close: circula DIGITAL PRODUCTS | "So I guess that just leaves digital products" | decisão |
| 24:49-24:51 | E1 | tela cheia "What digital product should we actually make?" (segunda linha em amarelo) | "So the big question what digital product should we actually make?" | pergunta |
| 25:01 | R2 | punch-in | "So that's not going to work for us." | conclusão |
| 25:07-25:17 | R3 | lista à direita entrando item a item: "- Structured", "- Interactive", "- Transformational" (a partir de 25:16 com punch-in) | "it has to be structured, interactive, and hold their hand through some sort of transformation" | lista falada |
| 25:22-25:25 | C2 (gerado) | três clipes verticais do Amos lado a lado sobre fundo quadriculado | "Amos is honestly perfect for this because he's all about living a simple, effective life" | personagem citado |
| 25:31-25:34 | C4 | "3 DAYS 18 HOURS" | (antes de "let's go back over to Claude") | elipse |
| 25:34-25:47 | P2 + R5 | lista de skills; "/digital-product Create a workbook as a digital product for Amos" | "select the digital product skill and say create a workbook" | tutorial |
| 25:49-25:51 | R6 + C5 | "FREE CHEAT SHEET" | "this skill will also be in the cheat sheet" | material prometido |
| 25:52-26:08 | P2 + R5 | três ideias; grifo "#1 The Old Ways: 30-Day Energy Reset" e "A 30-day challenge, one forgotten habit a day" | "the first one sounds the best. A 30-day challenge... One habit a day." | escolha |
| 26:16-26:20 | P2 + R5 | digita "Build number" | "Let's type build number one." | tutorial |
| 26:22-26:24 | C4 (E1) | "A couple of minutes later..." branco sobre fundo escuro | (antes de "Okay, I think it's done") | elipse de espera |
| 26:25-26:41 | P2 + R5 | o workbook gerado: "Day 0", "The Well Rule" com caixa de marcar, "Bonus Three - The Wall Chart", "Bonus One - Amos's Nine Dinners" | "full 30-day plan... tick box... a tracker at the back... his mother's old dinner recipe" | cada item citado aparece |
| 26:43-26:45 | R6 em P&B | close em preto e branco | "That's my dinner plan sorted for tonight." | piada |
| 26:46-26:58 | P2 + R5 | "Add this photo of Amos to the front cover"; capa "THE OLD WAYS" | "There we go. And look at that." | revelação |
| 27:13-27:15 | R6 | lateral, lendo; [music] em 27:12 | "remove any hints of AI slop" | passagem de tempo |
| 27:16-27:25 | R4 | ele à esquerda lendo, capa do workbook à direita | "Okay, all looks good." | prova da revisão |
| 27:28-27:30 | P1 + R5 | Google "Welcome to Stan Store" | "I'm going to use a platform called Standtore" | ferramenta citada |
| 27:34-28:32 | P2 + R5 | Stan Store: painel US$ 0,00, Add Product, tipos, seletor de arquivos com a ovelha, recorte, título, botão "Start The Old Ways Challenge", preço 15.99 e desconto 12, Publish, link copiado | "the price $15.99. Then we can actually offer a discount to $12" | tutorial com zoom no campo |
| 28:37-28:39 | P2 + R5 | bio do Instagram com "Start the Old Ways Challenge: https://stan.store/amosoldways" | "paste that into our Instagram bio" | tutorial |
| 28:43-28:47 | R6 em P&B | preto e branco | "I'll do that off camera as I don't want to share those details" | aparte |
| 28:49-28:53 | P2 + R5 | a página da loja em formato de celular | "Let's test this out." | teste |
| 29:01-29:04 | P5 | lista: marca o passo 9 | "I think we can tick that one off of the list. Just like that." | etapa concluída |
| 29:06-33:19 | R6 | camisa azul-royal, tijolo | "Okay, so it's the last day of the challenge" | último dia |
| 29:10-29:12 | P5 | dedo aponta "10. COUNT THE PROFITS" | "it's the last day of the challenge and we actually made some sales" | etapa final |
| 29:22-29:29 | R4 (P3) | ele com o celular à esquerda; reels da Vivienne em card vertical com o contador: 11.7K, 23.9K, 253K (`q_29240.png`) | "over 10,000 views on this video, 20,000 on this video, and this video here has actually gone viral with over 250,000 views" | número → reel com contador |
| 29:40-29:50 | R2 | punch-in | "It's a great way to test a side hustle, but sometimes you just need a little bit more time" | lição |
| 30:07-30:10 | R2 | punch-in | "I do still have some reservations about AI slop" | opinião |
| 30:22-30:24 | C2 (foto pessoal) | foto dele com dois rapazes num mirante, card sobre fundo quadriculado | "connecting with actual people from all walks of life" | ideia abstrata → foto pessoal |
| 30:34 | R2 | punch-in | "Let's crunch the numbers" | virada para os números |
| 30:37-30:45 | P3 + R5 | Stan Store: lista de pedidos de US$ 12,00; receita total e e-mails borrados (`q_30390.png`) | "we sold the workbook for $12 and made 23 sales" | número |
| 30:46-30:48 | P3 + R5 | "Total Revenue $276.00" revelado com caixa amarela; gráfico subindo | "which brings our total revenue to $276" | revelação |
| 30:52-31:11 | R3 | "Total costs:" em amarelo à esquerda; os itens surgem na fala: "- Claude: $0", "- Instagram Edits: $0", "- Stan Store: $0" | "First, we used Claude, but that was a free subscription... Instagram edits... standtore" | conta falada |
| 31:13-31:22 | R6 / R2 | sem lista enquanto fala da taxa do PayPal (punch-in em 31:19) | "As we got paid through PayPal, they do take some fees, which came to $19.52" | aparte (a taxa só entra na lista depois) |
| 31:25-31:29 | R3 | a lista volta, agora "Total cost:", com "- Higgsfield:" em branco | "We of course use Higsfield to create all the photos" | item da conta |
| 31:31-31:41 | P2 + R5 | retorno: TILBURY no campo de código e os planos (US$ 129 riscado, Ultra US$ 79) | "I also used a Tilbury discount code" | retorno |
| 31:46-31:57 | R3 | "- Higgsfield: $99", "- Paypal fees: $19.52", "= $118.52" | "which would normally be $99 for that plan... our total cost came to $11,852" | conta falada |
| 31:58-32:00 | R3 | "Total profit: $157.48" grande em amarelo | "that leaves us with a profit of $157.48" | resultado final |
| 32:07-32:11 | C4 (P2) + R5 | cards "PREVIOUSLY..." com a tela do Claude e a do TTS | "This was all done with minimal effort using AI tools" | retrospecto |
| 32:19-32:29 | C2 (gerado) + R5 | mosaico de dezenas de vídeos das três contas, abrindo em zoom out | "we've already generated a ton of videos for Instagram" | quantidade |
| 32:34-32:36 | C4 + P5 + E2 em P&B | "PREVIOUSLY..." o quadro do começo em preto e branco, com a mão | "Remember all of those monetization strategies we talked about at the start of the video?" | retorno |
| 32:46 | R2 | punch-in | "But guys, a deal is a deal." | virada |
| 33:01-33:05 | R4 (E5) | card de comentário "@marktilbury Who was your favourite influencer and why?" sendo digitado | "Just comment below who your favorite influencer was and why" | CTA de comentário |
| 33:07-33:09 | P5 | lista: marca o passo 10 | "So, that's the profits counted." | fim do desafio |
| 33:13 | R2 | punch-in, mão acenando | "But don't click on it just yet." | piada |
| 33:16-33:19 | R4 (E5) | card "Mark Tilbury SUBSCRIBED" com cursor clicando no sino | "Make sure to subscribe if you want to grow your wealth." | CTA de inscrição |

---

## 4. Contagem

**Ocorrências na tabela** (198 linhas; cada linha conta uma vez por código; código entre parênteses conta como camada da linha):

| código | ocorrências | observação |
|---|---|---|
| R1 (com algo por cima) | 7 | 4 faixas de CTA, 1 legenda, 1 P&B, 1 troca de rosto |
| R2 | 24 | punch-in visto na folha; deve haver mais entre amostras |
| R3 | 7 | sempre texto lateral com o rosto deslocado; nunca palavra solta atrás da cabeça |
| R4 | 15 | 5 com card/print, 4 de reação a clipe gerado, 2 com comentário real, 3 cards de CTA, 1 "Editor's note" |
| R5 | 71 | círculo em 70, janela retangular dentro da interface em 1 |
| R6 | 15 | 5 blocos de cenário/dia, 5 cortes P&B, 2 closes laterais, 2 faixas de CTA, 1 aparte |
| P1 | 17 | perfis, posts, artigos, sites; 2 são material próprio (canal, vídeo antigo) |
| P2 | 53 | a espinha do vídeo: todo passo do tutorial |
| P3 | 8 | painéis de terceiros no gancho, seguidores, views, pedidos e receita |
| P4 | 15 | reels e vídeos de terceiros, quase sempre com o círculo |
| P5 | 30 | lista de tarefas, quadro de 4 quadrantes e prancheta, todos objetos físicos filmados de cima |
| E1 | 5 | prancheta, cartelas, pergunta em tela cheia |
| E2 | 17 | o quadro de 4 quadrantes (anotar, circular, riscar) + 1 colagem |
| E3 | 0 | nenhum gráfico animado feito na edição; o gráfico que aparece é print (P3) |
| E4 | 1 | seta + "Editor's note" |
| E5 | 3 | cards de comentário recriados e de inscrição |
| C1 | 0 | nenhum stock |
| C2 | 10 | 2 fotos pessoais, 1 card "THIS MORNING", 7 usos das imagens/vídeos gerados no experimento como B-roll |
| C3 | 1 | Cruella |
| C4 | 22 | 11 cartelas de contagem, 6 montagens aceleradas, 3 "COMING UP"/"PREVIOUSLY", "THIS MORNING", "A couple of minutes later" |
| C5 | 7 | 1 legenda de palavra-chave + 6 faixas de CTA |
| fora da taxonomia | 1 | troca de rosto do apresentador por IA (00:03-00:09) |

**Percentual aproximado do tempo** (666 quadros classificados um a um na folha):

| o que está na tela | quadros | % |
|---|---|---|
| Rosto dele cheio sem nada (R1, R2, R6) | 262 | 39% |
| Gravação de tela ou print com o círculo (R5 sobre P1/P2/P3/P4) | 259 | 39% |
| Rosto + elemento ao lado (R4) | 45 | 7% |
| Objeto físico de cima: lista, quadro, prancheta (P5 + E2) | 42 | 6% |
| Rosto + texto lateral (R3) | 31 | 5% |
| Cartelas (C4/E1) | 13 | 2% |
| Terceiro em tela cheia, fotos, colagens (P4, C2, C3, P3 sem círculo) | 14 | 2% |

**Ritmo por fase**

| fase | cortes/min | o que domina |
|---|---|---|
| Abertura 00:00-01:00 | 16 | 8 recursos diferentes em 60 s: troca de rosto, terceiros, painéis, texto, foto, teaser, comentário, prancheta |
| Pesquisa 01:00-04:28 | 26, 25, 20 | o trecho mais rápido: print, quadro e reel se alternando a cada 2 s |
| Tutorial do dia 1, 04:28-19:10 | 13,4 de média (mínimo 7 no minuto 7, máximo 22 no 11) | R5 em 44% do tempo; cenas longas de tela (até 20,8 s) quebradas por R2 e por montagens com música |
| Dias 2 a 7, 19:10-32:00 | 11,5 de média | o rosto volta a dominar (45% em R6); entram R3 (contas) e R4 (comentários, números) |
| Fecho 32:00-33:19 | 10 e 3 | recap "PREVIOUSLY", CTAs em card |

Como o ritmo se mantém em 33 minutos sem ser só corte rápido: (1) a lista de 10 passos dá um "capítulo" a cada 1 a 5 min,
sempre fechado por marcar + contagem; (2) dentro de cada passo, tela e rosto se alternam a cada frase (o círculo
mantém o rosto presente mesmo na tela); (3) a cada 1 a 2 min surge uma piada com punch-in ou P&B; (4) os trechos
repetitivos viram montagem de 3 a 7 s com música; (5) a troca de cenário a cada "dia" renova o visual na segunda
metade.

---

## 5. Regras contextuais

**Regras do vídeo inteiro**

1. **Quando a fala diz um número de resultado, a tela mostra o print onde o número mora**, ampliado ou com caixa
   amarela. 00:18 e 00:20 (painéis do gancho), 01:31 (2.2M), 22:49 e 23:07 (seguidores), 29:22 (views), 30:37 e
   30:46 (pedidos e receita).
2. **Quando a fala cita um nome próprio (pessoa, conta, ferramenta, site), entra o print do perfil ou da página com
   o círculo do rosto.** 01:28 Lil Miquela, 02:01 Mother Satori, 03:28 grannyspills, 04:34 Claude, 06:43 Higgsfield,
   19:22 Instagram Edits, 27:28 Stan Store.
3. **Quando a fala faz uma afirmação de mercado que pede prova, entra artigo ou press release com grifo na frase
   que sustenta a afirmação.** 01:43 ("$12 million"), 01:46 (grifo em "Calvin Klein, Prada"), 02:10 (grifo amarelo
   em "$6.8 Trillion").
4. **Quando a fala é um passo de tutorial, a tela é a gravação ampliada no campo em uso, com o texto sendo digitado
   no ritmo da fala e o círculo no canto livre.** 04:43, 05:31, 10:31, 10:40, 14:28, 19:37, 20:34, 25:34, 27:34. O
   círculo muda de canto conforme o espaço livre (direita em 04:34, esquerda em 04:43, direita de novo em 05:03).
5. **Quando ele lê em voz alta a resposta da IA, um grifo acompanha a linha que ele está lendo.** 05:09, 05:25,
   05:39, 05:52, 06:09, 09:43 (grifo andando pelo prompt), 13:04, 13:22, 26:00.
6. **Quando uma etapa termina, a caneta marca o item na lista física e, logo depois, entra a cartela de contagem.**
   04:22 + 04:28, 06:29 + 06:34, 11:55 + 11:58, 14:04 + 14:10, 15:22 + 15:28, 19:07 + 19:10. As 10 marcações
   existem; a de 06:29 tem só 1,7 s.
7. **Quando a pesquisa gera uma conclusão, ela é escrita à mão no quadro de 4 quadrantes; quando chega a hora de
   decidir, as opções são riscadas no mesmo quadro.** Anotar: 01:52, 02:13, 02:28, 02:46, 04:01. Riscar: 23:55,
   24:10, 24:16, 24:34; circular a escolhida: 24:46.
8. **Quando ele faz piada sobre si mesmo (idade, esposa, jantar, "não fui convidado"), corta para P&B**, quase
   sempre no close lateral. 01:37, 02:25, 07:28, 18:01, 26:43, 28:43.
9. **Quando a frase é punchline, conselho direto ou virada, entra punch-in.** 01:12, 04:10, 07:34, 18:55, 21:16,
   25:01, 30:34, 32:46, 33:13.
10. **Quando a fala enumera (lista, conta de custos), o rosto vai para um lado e os itens entram do outro, um por
    vez, na hora em que são ditos.** 03:46, 25:07, 30:52, 31:46. Se a fala sai do assunto no meio (taxa do PayPal em
    31:13), a lista some e volta depois.
11. **Quando a fala promete material (link, prompts, skills), entra a faixa amarela com seta para baixo** ("FREE
    CHEAT SHEET" ou "FOLLOW ALONG WITH ME"). 08:25, 09:34, 12:22, 16:31, 20:10, 25:49.
12. **Quando a fala cita comentários, a tela mostra um card de comentário ao lado do rosto**: recriado com @marktilbury
    para os CTAs dele (00:51, 33:01) e real, com as respostas surgindo, para comentários de terceiros (21:52, 22:19).
13. **Quando ele mostra um resultado gerado e reage, a tela divide: ele assistindo de um lado, o clipe com som do
    outro.** 17:43, 18:04, 18:16, 18:28, 27:16. Variação: o A-roll encaixado dentro da janela do app (17:01).
14. **Quando a fala volta a algo já visto, o mesmo material reaparece.** 05:19 (Mother Satori), 06:19 (Olivia),
    23:37 (o quadro), 31:31 (TILBURY), 32:07 e 32:34 ("PREVIOUSLY").
15. **Quando ele diz que vai repetir o processo ou acelerar, entra montagem de cortes de ~1 s com música.** 02:50,
    11:06, 13:52, 15:13, 17:28, 21:04 (a legenda automática marca [music] em 02:55, 11:10, 13:54, 15:14, 17:26, 21:03).
16. **Quando o tempo do desafio avança, a tela marca o salto**: cartela de contagem (11 vezes), tag de tempo ("THIS
    MORNING..." 19:16, "A couple of minutes later..." 26:22) e troca de roupa e cenário a cada dia (19:13, 21:40,
    22:37, 23:31, 29:06).
17. **Quando ele usa a própria trajetória como credencial ou argumento, mostra material pessoal.** 00:33 (foto
    jovem), 05:58 (o canal), 09:22 (vídeo anterior com 1.9M views), 30:22 (foto com pessoas).
18. **Quando há um resultado a revelar, ele é escondido antes e mostrado com destaque depois.** 00:43 (teaser com as
    imagens pixeladas), 10:19 (ficha do Amos só aparece depois do "Generating"), 30:37 borrado → 30:46 "$276.00" com
    caixa amarela, 31:58 lucro em letras grandes.

**Truques de um momento só (não viram regra)**

- 00:03-00:09: ele se transforma em três personagens de IA a cada "this".
- 08:09: o código TILBURY digitado em letras gigantes.
- 11:22: cena de filme (Cruella) para uma comparação pop.
- 12:10: card de definição oficial ("Claude Support") para termo técnico.
- 15:34: colagem das imagens geradas para ilustrar "combine".
- 21:31: "Editor's note: Mark's crush?", a edição comentando o apresentador.
- 24:49: pergunta em tela cheia ("What digital product should we actually make?").
- 32:19: mosaico de todos os vídeos gerados, em zoom out.
- 33:16: card de inscrição com o clique no sino.

**Como a edição conta a jornada (o formato "I tried")**

- **Antes**: ceticismo declarado (00:32), regras e aposta escritas na prancheta, relógio ligado (01:15).
- **Tentativa**: a lista física de 10 passos é o mapa; cada passo abre com cartela de contagem e fecha com a caneta
  marcando. Os erros e ajustes ficam no corte ("make him a few years older" em 10:31, "Amos is not available" em
  19:47).
- **Resultado**: cada número aparece no painel onde nasceu (seguidores, views, pedidos, receita), nunca só dito. As
  contas de custo e lucro são montadas na tela item a item. A reviravolta ("we've made a massive mistake", 29:12) é
  provada com os contadores de views da conta perdedora.
- **Fecho**: o que foi prometido em 00:51 (comentário, US$ 1.000) volta em 33:01 com o mesmo tipo de card.

---

## 6. Materiais

**Só o criador pode dar**

| item | como pedir | para qual hora (no modelo) |
|---|---|---|
| Gravação de tela do processo inteiro | "Grave a tela do computador do começo ao fim de cada etapa (OBS ou gravador do sistema, 1080p ou mais, cursor visível, sem esconder o que digita). Um arquivo por etapa, nome com o número do passo." | todo o miolo (04:30 a 29:00 no ref4) |
| Câmera ligada junto com a gravação de tela | "Enquanto grava a tela, deixe a câmera do A-roll gravando você trabalhando e reagindo. É dela que sai o círculo do canto." | todo trecho R5 |
| A-roll em 2 câmeras | "Uma câmera frontal em plano médio e uma segunda de lado, mais fechada. A lateral é usada nas piadas e apartes." | punch-in, P&B |
| Uma roupa e um canto diferente por dia | "Se o experimento tem dias, troque de camisa e, se der, de canto da casa a cada dia. Um dia pode ser fora (varanda, quintal) com o celular na mão." | 19:13, 21:40, 22:37, 23:31, 29:06 |
| Objetos físicos filmados de cima | "Uma lista de tarefas do desafio escrita à mão em placa escura com caneta colorida, e um quadro de anotações dividido em áreas. Filme de cima marcando, escrevendo, circulando e riscando cada item, um clipe por ação." | 01:19, todas as marcações e anotações |
| Prints de terceiros citados | "Para cada conta, pessoa ou artigo que você citar, mande o link ou o print do perfil, do post e do trecho que prova o que você disse (número de seguidores, frase da matéria)." | 01:28 a 03:34, 02:10 |
| Vídeos de terceiros citados | "Link do reel ou vídeo exato que você comentou, com o segundo em que acontece o que você citou." | 02:16, 02:31, 03:07 |
| Painéis de resultado reais | "Print ou gravação do painel no dia do resultado: seguidores de cada conta, views de cada vídeo, lista de pedidos e receita total. Dado sensível (e-mail de cliente, conta bancária) a gente borra." | 22:49, 23:07, 29:22, 30:37, 30:46 |
| Comentários reais | "Print dos comentários que você citar, com as respostas." | 21:52, 22:19 |
| Material próprio de trajetória | "Foto antiga que mostre de onde você veio, print do seu canal ou do seu vídeo que mais deu certo, foto com pessoas reais." | 00:33, 05:58, 09:22, 30:22 |
| Os artefatos do experimento | "Exporte tudo o que foi gerado: imagens, vídeos, áudios, o produto final (PDF), com nome por personagem." | 10:19 a 18:47, 25:22, 26:25, 32:19 |
| Código de desconto ou parceria | "Se houver código ou link de afiliado, mande o código exato e a tela onde ele é aplicado." | 08:09 |

**O sistema faz sozinho**

- Cartela de contagem "TIME REMAINING... X DAYS Y HOURS" e tags "COMING UP...", "PREVIOUSLY...", "THIS MORNING...",
  "A couple of minutes later...".
- Texto lateral com itens entrando um a um (R3), pergunta em tela cheia (E1).
- Faixa amarela de CTA com seta ("FREE CHEAT SHEET", "FOLLOW ALONG WITH ME").
- Card de comentário recriado com o @ do criador e card de inscrição com clique no sino (E5).
- Círculo com sombra a partir do A-roll, troca de canto do círculo, janela retangular dentro da interface.
- Zoom e grifo sobre a gravação de tela que o criador mandar; borrar dado sensível; pixelar o resultado no teaser.
- Punch-in digital, corte em P&B, tela dividida, cards de perfil empilhados.
- Montagem acelerada com música, colagem e mosaico a partir dos artefatos enviados.
- Seta desenhada + "Editor's note".

---

## 7. Assinatura do criador (não vira regra do modelo)

- O cenário: parede de tijolo, luminária de três lâmpadas, carrinhos de controle remoto na prateleira (que conversam
  com a foto dele jovem na loja TAMIYA); depois a jukebox iluminada e a parede de ripas.
- A autodepreciação de idade: "bit like me, I guess", "I thought I was the old one around here", "not doing bad for an
  old boy", "old fart", e a esposa ("I don't know if the wife will agree"). O P&B das piadas é o jeito da edição dele
  sublinhar essa persona.
- "I love a little discount" e o código com o próprio sobrenome (TILBURY).
- A aposta de US$ 1.000 para um comentarista, aberta no gancho e paga no fim.
- O fecho fixo "Make sure to subscribe if you want to grow your wealth".
- Visual: amarelo como única cor de destaque, sans geométrica em negrito branco + amarelo, fundo preto quadriculado nas
  cartelas, caneta neon em placa preta para a lista e o quadro.
- A edição brincando com ele ("Editor's note: Mark's crush?"), possível porque a persona dele aguenta a piada.

---

## 8. O que não deu pra ver

- **Som.** Não ouvi o áudio. Só sei onde a legenda automática do YouTube marca [music]: 00:40, 00:58, 01:05, 02:55,
  11:10, 13:54, 15:14, 17:26, 21:03, 27:12. Efeitos sonoros (whoosh, clique, caneta) não dá pra afirmar.
- **Transições finas.** A folha a cada 3 s não mostra se as entradas são corte seco, deslize ou zoom. Vi em quadro cheio
  só três: a fusão da troca de rosto (00:04,5), o comentário entrando desfocado (22:19) e o card "Claude Support"
  mudando de posição (12:10 a 12:17).
- **Inserções curtas.** Tudo abaixo de 3 s pode ter caído entre amostras. A marcação do passo 2 só apareceu em quadro
  cheio; deve haver outras inserções de 1 a 2 s que não registrei.
- **Se a escrita na lista e no quadro é real ou animada por cima.** A mão aparece segurando a caneta, mas a folha não
  permite saber se o traço é filmado ou composto.
- **Se a troca de rosto do gancho foi feita com a mesma ferramenta do vídeo.** Só vi o resultado.
- **Legenda em outros pontos.** Só vi legenda queimada em 00:00-00:03. Pode haver outras palavras-chave curtas entre as
  amostras.
- **O que acontece depois de 33:19** (tela final com o vídeo "right up there"): o vídeo termina antes de aparecer.
- **Divergência registrada, sem interpretar:** a fala diz que o plano "would normally be $99" (31:43), e a tela
  logo antes mostra US$ 129 riscado e US$ 79 no Ultra (31:36-31:41). O título da lista também muda de "Total costs:"
  (30:52) para "Total cost:" (31:25), e "Stan Store" aparece escrito "Stanstore" em 31:24.
- **Os "cortes secos" do detector** incluem saltos de zoom e trocas de tela dentro da gravação de tela; não separei
  quantos dos 452 são troca de plano de verdade.
