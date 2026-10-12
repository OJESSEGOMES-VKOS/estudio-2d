# ref2: decupagem (Dan Martell, "The Only 14 Ways to Make Money with AI in 2026")

Decupagem feita pelo `PROTOCOLO-decupagem.md`. Fontes: as 27 folhas `ref2_tl_01..27.png` (todas vistas, em ordem),
`ref2_cortes.txt`, `ref2_rosto.txt`, `ref2_roteiro.txt` (fala com tempo) e 22 quadros em resolução cheia em
`ref2_q_full/` (nome do arquivo = hora do quadro, ex.: `q_14541.png` = 14:54.1).

**Aviso de tempo (importante para todas as referências):** a hora escrita na folha está cerca de **1,5 s adiantada**
em relação ao conteúdo. O `medir.py` tira os quadros com `fps=1/3`, e esse filtro pega o quadro do meio do intervalo:
o quadro marcado "10:39" mostra o que acontece por volta de 10:40,5. Conferido em 4 pontos com quadro avulso
(10:37.6, 12:29.5, 14:54.1, 00:46.6) cruzando com `cortes.txt` e com o roteiro. **Todas as horas deste documento já
estão corrigidas** (folha + 1,5 s; nas inserções em tela cheia, a hora vem do `cortes.txt`). O `rosto.txt` usa os
mesmos quadros, então carrega o mesmo deslocamento.

---

## 1. Ficha

| Campo | Valor |
|---|---|
| Canal | Dan Martell |
| Título | The Only 14 Ways to Make Money with AI in 2026 |
| Tema | Ranking (tier list S/A/B/F) de 14 modelos de negócio com IA, avaliados por 3 critérios, e no fim o plano de 5 passos para lançar o favorito |
| Duração | 26:44 (1603,7 s) |
| Nicho | Negócios e empreendedorismo com IA (público: quem quer abrir um negócio de IA) |
| Rosto (medição) | 89% rosto grande, 0,6% rosto pequeno, 10% sem rosto (535 quadros) |
| Rosto (corrigido olhando as folhas) | ~77% rosto em tela cheia; ~12% rosto **em janela** ao lado do tier board (a janela vertical é alta, por isso o medidor contou como "rosto grande": são os valores 0,15 a 0,19); ~10% sem rosto |
| Cortes | 304 cenas, média 5,28 s, mediana 4,33 s; 9 cenas < 1 s, 6 cenas > 15 s |
| Ritmo | 21 cortes no 1º minuto, depois 7 a 16 por minuto (média ~11). O detector **não pega** punch-in no mesmo plano (ex.: 17:56 a 18:09 aparece como uma cena de 13 s, mas tem punch-in dentro), então o número real de cortes é maior |
| A-roll | Plano médio frontal (cintura pra cima), sentado a uma mesa de madeira, olhando para a lente. Microfone dinâmico preto num braço articulado entrando pela esquerda. MacBook à direita, de costas para a câmera, com adesivo de montanhas. Sala ampla de casa: lareira de pedra à esquerda, janelões com luz natural de dia, sofá escuro ao fundo, fundo bem desfocado. Camiseta azul lisa |
| Câmeras | 1 câmera aparente. As variações de plano (aberto, médio, fechado, deslocado para um lado) são reenquadramentos digitais do mesmo ângulo: comparando `q_0816` e `q_1022`, a posição de tudo no cenário é idêntica |
| Legenda | Não tem legenda contínua. Só 3 legendas-frase grandes em momentos de efeito (00:05, 08:52, 26:16) |
| Linguagem gráfica | Azul-marinho escuro com ciano neon (cards, barra, diagramas), fonte sem serifa bold branca; tier list com fileiras vermelho/laranja/amarelo/verde brilhantes |

---

## 2. Estrutura do roteiro

| Bloco | Tempo | O que diz (citação curta) | Função |
|---|---|---|---|
| Gancho | 00:00-00:15 | "thousands of internet gurus tell you how to make money with AI. But 99% of them are full of sh-" | Inimigo comum (os gurus) + provocação |
| Prova do gancho | 00:11-00:15 | "someone who actually launches a new AI company every single month, most of which are making millions" | Autoridade: por que ouvir ele e não os gurus |
| Promessa | 00:15-00:24 | "I'll be ranking the only real ways ... at the end, I'll tell you exactly which one I'd pick" | Formato (ranking) + laço aberto até o fim |
| Item 1 já começa | 00:24-00:59 | "So let's start with the first idea, AI voice agents" | Entra no conteúdo em 24 s, sem introdução longa |
| Regras do jogo (dentro do item 1) | 00:59-01:48 | "four tiers. S tier ... F tier, which is you might want to just ignore and run away" / "three things. First off is profitability" | Ensina o sistema de avaliação no meio do 1º item, quando o público já está dentro |
| Corpo, itens 1 a 3 | 01:48-05:26 | Voice Agents (A), Lead Generation (S), Faceless YouTube (F) | Primeiros vereditos: mistura um A, um S e um F para mostrar que o ranking é sincero |
| CTA no meio | 05:26-05:58 | "if you want my help to sell any of these AI companies ... DM me YouTube SBC" | Isca (playbook) logo depois do primeiro F, antes do item 4 |
| Corpo, itens 4 a 8 | 05:58-13:42 | Repurposing (B), Consulting (S), Virtual Assistant (B), Chat Agents (A), Trading Bots (F) | Dentro do item 6 entra o 2º CTA, do produto próprio: "click the link below in the description" (09:20). Em 10:26: "don't forget the end of this video ... I've got some bangers coming" (teaser de retenção) |
| Corpo, itens 9 a 14 | 13:42-22:32 | Agent Development (S, o topo), Copywriting (B), Venture Studio (A-), AI-to-AI Marketplace (A), Logo e Brand (B), Cybersecurity (S) | Em 19:31: "now we only have two more, and now I'm going to tell you which one I would pick" (2º teaser) |
| Virada para o plano | 22:32-22:40 | "now that I've ranked everyone, now I'm going to tell you how I'd launch my favorite. So, clearly that's agent development" | Fecha o laço aberto em 00:19 |
| Método em 5 passos | 22:37-25:48 | Validate, Pre-sell, Launch manually, Build audience, Productize. "This is how I've built every one of my companies" | Entrega prática e aplicável (o "como") |
| Fecho | 25:48-26:25 | "you're not behind ... People who win aren't the ones who start first. They're literally the ones who don't quit" | Motivação, aforismo |
| CTA final | 26:25-26:44 | "which one did you find the most interesting? ... DM me YouTube SBC ... click the video and I'll see you on the other side" | Comentário + repete a isca + próximo vídeo |

**Micro-estrutura de cada item (repete 14 vezes):** "Next we have X" (rótulo) → o que é, em uma frase → exemplo
concreto ou prova (logo, print, ilustração, B-roll) → "profitability / competition / longevity", um de cada vez
(barra-placar) → "I'm going to put it in [tier]" (tier board). Duração por item: de ~1:00 (Repurposing) a ~2:20 (Voice
Agents, que carrega as regras).

---

## 3. Linha do tempo de recursos

Tudo que não é `R1` puro, do começo ao fim. Trechos de R1 com algo notável **faltando** aparecem como "(R1)".
Reenquadramentos leves (rosto 0,31 a 0,34) acontecem o vídeo todo e não estão listados um a um.

| hora | código | o que aparece (layout, entrada/saída, movimento) | fala no momento | gatilho |
|---|---|---|---|---|
| 00:00-00:05 | E5 | Mosaico 3x3 de thumbnails de "guru" ("HOW I MADE MONEY WITH AI", "AI SIDE HUSTLES", "MAKE $1,000/DAY WITH AI"), bordas neon, laterais desfocadas, leve aproximação. Rostos e valores genéricos: parecem feitos para a cena, não prints reais (`q_00015`) | "Every single day, thousands of internet gurus tell you how to make money with AI" | O sujeito da frase ("internet gurus") mostrado como multidão |
| 00:05-00:08 | R2+R3 | Punch-in forte + legenda em 2 linhas no canto inferior esquerdo: "99% of them" (ciano) / "are full of sh*t" (branco). O áudio corta em "sh-"; o texto completa censurado | "But 99% of them are full of sh-" | Número + palavrão (provocação) |
| 00:09-00:10 | C1 | Stock: homem puxando os bolsos vazios | "Most of them haven't made a single dollar with AI" | Afirmação literalizada (zero dólar) |
| 00:12-00:15 | P5 | Parede do escritório: "MARTELL VENTURES" e logos das empresas dele (Revio, Precision, Atlas, Hero, Social Sweep, Frank., BuddyPro, The Deal Room, Alli) | "launches a new AI company every single month, most of which are making millions" | Credencial que pede prova |
| 00:15-00:21 | E2 | Tier list em tela cheia: título "The Only Real Ways to Make Money With AI" digitando, fileiras S/A/B/F com caixas "?", câmera virtual aproximando | "I'll be ranking the only real ways to make money with AI" | Promessa do formato (ranking) |
| 00:21-00:24 | E2 | Mergulho na fileira S: caixa "?" com contorno neon azul em close | "at the end, I'll tell you exactly which one I'd pick" | Laço aberto: o escolhido é mistério |
| 00:25-00:27 | C4 | Rótulo "1 AI Voice Agents" no canto inferior esquerdo (número em quadrado azul + nome com sublinhado) | "So let's start with the first idea, AI voice agents" | Anúncio do item |
| 00:28-00:34 | R4 | Card azul-marinho entra deslizando pela direita (ocupa 1/3 do quadro): ícone de robô + "AI Phone Agent / Books Appointments / Qualifies Leads" | "build an AI phone agent that books appointments, qualify leads" | Definição do item com suas funções |
| 00:43-00:48 | C1 | 4 planos de ~1 s: mão mexendo em registros de encanamento, aperto de mão numa sala de advocacia, mais 2 não pegos pelos quadros (`q_00446`, `q_00466`) | "think about like plumbers, HVAC, law firms, dental clinics" | Lista de exemplos: um plano por palavra |
| 00:53-00:57 | C1 | Tela dividida: homem ao telefone (esq.) e robô ao telefone (dir.) | "They're probably talking to AI right now and they don't even realize the person was AI" | Contraste humano x IA |
| 01:03-01:15 | R5 | Tier board com o rosto numa janela vertical à esquerda; o nome de cada fileira digita na hora: "Super", "Great", "Okay", "Ignore and run away" | "S tier, which is like super duper tier ... B tier, which is meh ... ignore and run away" | Explicação das regras do ranking |
| 01:19 | R2 | Punch-in forte | "most of these experts are talking about ideas being like, 'This is the one to do.'" | Imitação de terceiro (objeção) |
| 01:22-01:41 | R4 | Painel "Criteria" à direita (20 s seguidos); "1. Profitability", "2. Competition", "3. Longevity" entram um a um quando ditos | "we're going to look at three things. First off is profitability ... The second is competition ... the third is longevity" | Lista numerada falada |
| 01:49-01:56 | R4 | **Barra-placar** sobe na parte de baixo: ícone de onda + "AI Voice Agent", campos PROFITABILITY, COMPETITION, LONGEVITY; "High" entra no 1º campo | "So where do we put the AI voice agent? Profitability is high." | Veredito do critério |
| 02:10-02:17 | R2+R4 | Barra volta e atravessa o corte do punch-in para o plano normal; Competition "High" | "Next we got competition. I think the market's pretty crowded." | Nome do critério |
| 02:22-02:27 | P2 | Gravação de tela do Google Maps (busca local, pinos no mapa) em janela flutuante sobre fundo azul; aproxima no card de uma empresa com o cursor no botão "Call" | "just going through Google local and calling those businesses" | Passo prático verificável |
| 02:34-02:38 | R4 | Barra: Longevity "High" | "And longevity? I think this will be relevant for a long time." | Nome do critério |
| 02:40-02:46 | R5 | Tier board; card "AI Voice Agent" (mesmo ícone de onda da barra) aparece e assenta na fileira A | "I think it's an A-tier opportunity" | Veredito |
| 02:49 | C4 | "2 AI Lead Generation" | "The next one is AI lead generation" | Anúncio do item |
| 02:57-02:59 | E4 | Ilustração holográfica azul: prancheta "LEADS" com lista e checks sobre placa de circuito | "essentially presents qualified leads to a business" | Objeto da frase |
| 03:02-03:05 | E4 | Cartelas de logo em tela cheia, ~1,7 s cada: Manus (fundo claro, `q_03025`) e Gemini (fundo escuro) | "use tools like Manas, called Co-work, Gemini" | Nome de ferramenta (Co-work ficou sem logo) |
| 03:05-03:08 | P2 | Interface do Manus "Wide Research" coletando 250 perfis, janelas empilhadas; parece material oficial do produto (`q_03055`) | "to essentially go find those leads" | Demonstração da ferramenta |
| 03:25-03:35 | R4 | Barra "AI Lead Generation" (ícone de pessoa): "High"; "Moderate" entra e a barra sai descendo | "Profitability? It's actually pretty high ... competition, it's getting tougher" | Critério |
| 03:37 | R4 | Logo 3D "clay" surge à direita do rosto | "There's actually new AI platforms like clay.com" | Nome de ferramenta |
| 03:43 | R2 | Punch-in forte | "I have a friend Hunter that does this every day" | Anedota pessoal |
| 03:46-03:50 | R4 | Barra volta com "Moderate" + Longevity "High" | "Longevity is pretty strong" | Critério |
| 04:04-04:15 | R5 | Tier board; card "AI Lead Generation" vai para S. O quadro entra já no "where I tier this", antes do veredito | "So, let's talk about where I tier this. I actually think this one is S tier." | Veredito |
| 04:16-04:20 | C4 | "3 Faceless AI YouTube Channels", atravessa um corte | "let's talk about faceless AI YouTube channels" | Anúncio do item |
| 04:22-04:26 | E4 | Ilustração com cara de IA, em moldura sobre preto: figura encapuzada sem rosto com microfone, vaca de óculos escuros sobre dinheiro, botão do YouTube, cifrão dourado, sinal de alerta; aproximação lenta | "creating these cash cow fantasy things" | Metáfora literalizada ("cash cow" vira vaca) |
| 04:36-04:41 | E5 | Painel escuro do YouTube Studio "Monetization disabled / Not eligible", canal "Faceless AI YouTube Channel"; entra deslizando da direita por cima do rosto, com borrão de movimento (`q_04370`) | "Channels get demonetized within weeks" | Afirmação que pede prova (recriada) |
| 04:49-05:02 | R4 | Barra "Faceless AI YT Channels" (ícone play): Low, High, Low | "Profitability is almost zero ... competition ... Longevity? None." | Critérios |
| 05:13-05:26 | R5 | Tier board; card vai para F; fica 13 s enquanto ele comenta | "So, I'm going to put this in the F tier" | Veredito |
| 05:37 | E1 | Capa "SELL BY CHAT PLAYBOOK" com celular mostrando um chat, sobre fundo azul escuro (material do criador) | "It's called my Sell by Chat Playbook" | Nome do brinde |
| 05:43-05:47 | P1 | Páginas reais do documento deslizando ("The Sell By Chat Playbook", "New Rep Onboarding", "Content That Commands Attention") | "It's got the offer template, it's got the structure, the nine-box model" | Conteúdo do brinde |
| 05:52-05:59 | P2 | Mockup de celular: perfil @danmartell no Instagram → busca e digitação "YOUTUBE" na DM → envio "YOUTUBE SBC" → resposta "Here you go" | "find me on Instagram at Dan Martell and DM me YouTube SBC" | CTA mostrado passo a passo |
| 06:01-06:05 | C4 | "4 AI Content Repurposing"; continua por cima do diagrama seguinte | "Next, we've got AI content repurposing" | Anúncio do item |
| 06:04-06:11 | E2 | Diagrama neon: player de vídeo → ramifica em tweet, imagem e e-mail | "take a long-form video like this and turn it into short-form content like tweets and carousels and newsletters" | Processo "um vira vários" |
| 06:11-06:16 | (R1) | Nada na tela | "my Threads are blowing up by using content from my YouTube" | Ausência notável: afirmação pessoal sem prova |
| 06:17-06:20 | E5 | Interface recriada no estilo Opus Clip: thumb de podcast, campo "Drop a long video and..." + botão "Get Clips", clipes gerados com ícones de plataforma, cursor | "You can use tools that are AI-powered like Opus Clips" | Ferramenta |
| 06:20-06:21 | E4 | Logo Descript em tela cheia, fundo branco com vinheta (`q_06205`) | "and Descript" | Ferramenta |
| 06:25-06:41 | R4 | Barra "AI Content Repurposing" (ícone reciclar): High, Moderate, Low; fica direto através dos cortes | "This is pretty solid ... pretty moderate ... this is where I think it's weak" | Critérios |
| 06:49-06:58 | R5 | Tier board; card vai para B | "So, I would grade this as a B tier" | Veredito |
| 06:58-07:05 | C4 | "5 AI Consulting", sai deslizando para baixo | "Next, we've got AI consulting" | Anúncio do item |
| 07:10-07:17 | (R1) | Nada na tela | "You could charge like $5,000 to audit any business and turn that into potentially a $50,000 implementation project" | Ausência notável: valores em dinheiro sem card |
| 07:18-07:26 | R2 | Punch-in fechado (rosto 0,32 a 0,34) | "just look at the comments below. They know they should learn AI" | Apelo direto à audiência |
| 07:28-07:41 | R4 | Barra "AI Consulting" (ícone lâmpada): High, Low | "profitability, it's one of the top ones ... Competition, I mean, it's kind of low" | Critérios |
| 07:49-07:56 | R4 | Barra: Longevity "High" | "When I think of longevity, I think consulting is always going to be needed" | Critério |
| 08:04-08:15 | R5 | Tier board (a janela do rosto entra 1 a 2 s depois do quadro); card entra no S depois de Lead Gen | "I'm going to give this an S tier ... I even like it better than lead gen, so we're going to put it in front of that" | Veredito. A troca de posição não aparece nos quadros; em 09:58 Consulting já está na frente |
| 08:31 | C4 | "6 AI Virtual Assistant" | "Next up, we have virtual assistants" | Anúncio do item |
| 08:34 | R4 | Livro 3D "BUY BACK YOUR TIME" + faixa "BUYBACKYOURTIME.COM" no canto inferior esquerdo | "as the guy who wrote the book, Buy Back Your Time" | Credencial (produto próprio) |
| 08:40 | R2+R4 | Punch-in + balão de chat azul à direita: "Dan, where do you see AI disrupting us?" | "the top five virtual agencies in the world are like, 'Dan, where do you see AI disrupting us?'" | Citação de terceiro |
| 08:52 | R2+R3 | Punch-in forte + legenda-frase branca na base: "This is what AI does better than anything" | "this is what AI does better than anything" | Frase de efeito |
| 08:58 | P1 | Site do Apex (roxo e escuro, "Your digital twin. It doesn't just chat, it acts.", botão "Join the Waitlist"), cursor | "I built a whole platform called Apex" | Produto próprio |
| 09:01-09:05 | R3 | Acrônimo vertical A-P-E-X em roxo à direita do rosto, as palavras completam: "Agent / Platform for / eXecution" | "that's what it stands for, agents platforms for execution" | Sigla explicada |
| 09:07-09:09 | R4 | Avatar circular do "Kai" (rosto gerado) com balão "Hi, I'm Kai!" | "My guy is called Kai and Kai does everything" | Personagem com nome |
| 09:10-09:15 | P2 | Montagem de ~1,5 s por tarefa, janelas flutuando sobre fundo azul: e-mail sendo escrito (tod@danmartell.com, "Keynote Speech London"), Google Calendar criando "Meeting w/" (`q_09113`), Slack | "He manages my inbox, he manages my calendar, he coordinates projects, he checks my Slack" | Lista de tarefas: uma tela por verbo |
| 09:19-09:22 | E2 | Organograma: "Kai" no topo ligado ao avatar "Reese" | "He even hired a bunch of people, like my real estate guy named Reese" | Relação hierárquica |
| 09:22-09:26 | R3 | Banner contornado no centro inferior: "Click the Link in the Description to Sign Up for the Apex Waitlist" + seta para baixo | "if you want to check out Apex, just click the link below in the description" | CTA do produto |
| 09:28-09:50 | R4 | Barra "AI Virtual Assistant" (fone): High, High, Moderate; 22 s seguidos | "profitability, it's decent ... competition, pretty crowded ... longevity is kind of moderate" | Critérios ("decent" vira High) |
| 09:58-10:08 | R5 | Tier board: Consulting já na frente de Lead Gen no S; VA entra no B **antes** de Repurposing | "So I think we are a B, but I do think the value prop is stronger than content repurposing" | Veredito relativo |
| 10:19-10:22 | C1 | B-roll com cara de IA: robôs trabalhando em computadores numa sala de servidores | "Apex essentially is a full team of AI agents" | Imagem literal da frase |
| 10:31 | R2 | Punch-in forte | "And I've got some bangers coming" | Teaser de retenção |
| 10:34-10:38 | C4 | "7 AI Chatbot Agents", atravessa um corte (`q_10376`) | "Next, we've got AI chat agents" | Anúncio do item |
| 10:40-10:42 | C1/C2 | Homem grisalho de paletó no celular num restaurante à noite. Não dá para confirmar se é o próprio criador | "I was just looking into booking dinner tonight" | Anedota pessoal encenada |
| 10:43-10:44 | P2 | Mockup de celular com o app OpenTable dizendo "Good afternoon, Dan" | "I didn't want to even go through OpenTable" | Marca citada, mostrada como app |
| 11:07-11:38 | R4 | Barra "AI Chatbot Agents" (balões): High, High, Moderate; 30 s seguidos através de 4 cortes | "profitability, it's good ... competition, it's pretty crowded ... longevity, I mean it's kind of moderate" | Critérios (Intercom citado em 11:20 sem logo) |
| 11:31 | R2+R4 | Punch-in forte com a barra na tela | "Is this just going to be built into every frontier AI model?" | Pergunta retórica |
| 11:43-12:03 | R5 | Tier board (janela entra depois); card em A, **atrás** de Voice Agent; 20 s | "So, I'm going to put it in A behind the voice agent" | Veredito relativo |
| 12:04-12:08 | C4 | "8 AI Trading Bot" | "Next, we have AI trading bots" | Anúncio do item |
| 12:16-12:21 | E4 | Arte no estilo thumbnail de guru: "AI STOCK TRADING BOT" com robô de desenho e gráfico de ações, aproximação | "Everybody selling some kind of trading bot is essentially selling you a course" | O "produto do guru" mostrado |
| 12:27-12:31 | E4 | Logos em tela cheia: Renaissance (fundo vermelho) e "D E Shaw & Co" (fundo branco, `q_12295`); Two Sigma não confirmado | "companies like Renaissance Technologies, D.E. Shaw, uh Two Sigma" | Nomes próprios usados como prova |
| 12:31-12:53 | (R1) | 22 s de rosto | "if I had a bot that made me 20% ... 10 to 15 billion ... 16 months ... $97" | Ausência notável: números sem card |
| 13:07-13:23 | R4 | Barra "AI Trading Bot" (gráfico): High, High, Low | "is it profitable for you? Yeah ... Competition? ... Longevity? I think zero." | Critérios |
| 13:34 | R2 | Punch-in forte | "you're getting in the SEC territory ... So I would rank it as S" | Preparação da piada |
| 13:35-13:42 | R5 | Tier board entra **na mentira** ("It's the best"); o card só pousa no F depois do "I'm kidding" (`q_13365` mostra o quadro ainda sem o card) | "So I would rank it as S. It's the best. I'm kidding. It's ranked at the bottom." | Piada com falso veredito |
| 13:43-13:47 | C4 | "9 AI Agent Development" | "Next we have AI agent development" | Anúncio do item |
| 13:49-13:51 | E4 | O mesmo avatar do Kai, sozinho no centro, fundo roxo escuro | "Like my guy Kai who can do all this cool stuff" | Callback (asset reaproveitado) |
| 14:04-14:08 | E2 | Organograma de robôs: chefe no topo com seta ciano apontando, 3 abaixo, 4 abaixo | "You have your chief of staff agent and then the agent manages several other agents" | Hierarquia descrita |
| 14:10-14:29 | R4 | Barra "AI Agent Development" (ícone </>): High, Low, High | "the profitability if you get it right, massive ... it's low because it's hard ... the longevity is strong" | Critérios |
| 14:43-14:53 | R5 | Tier board: card entra em **primeiro** lugar no S (`q_14530`) | "I consider this the top opportunity right now ... it is the S of the S of the S" | Veredito superlativo |
| 14:54-14:55 | C4 | "10 AI Copywriting" (só o quadro avulso `q_14541` pegou; dura ~1,7 s) | "Next we have AI copywriting" | Anúncio do item |
| 14:55-14:59 | E5 | Landing fictícia "Power Your Home for What's Next" (marca VoltCraft, carregador de carro elétrico) e depois caixa de entrada com o e-mail da mesma marca | "Landing pages, case studies, sales emails" | Exemplos citados em lista |
| 15:28-15:50 | R4 | Barra "AI Copywriting" (caneta): Moderate, High, Low | "it's decent. It's actually pretty good ... Competition is high ... the longevity is kind of shaky" | Critérios |
| 16:01-16:11 | R5 | Tier board: card entra no **topo** do B, antes de VA | "if you're specific enough ... then you're at the top of B" | Veredito relativo |
| 16:13 | C4 | "11 AI Venture Studio" | "Next up, we have the AI venture studio" | Anúncio do item |
| 16:26-16:30 | E4 | Ilustração "BUSINESSES FACTORY": esteira com braços robóticos produzindo mini prédios (Store, SaaS, Coffee shop) | "if you had a factory that turns out profitable businesses on repeat" | Metáfora literalizada |
| 16:38-16:43 | C2 | 3 planos curtos do time dele: rapaz apresentando no quadro branco com chamada de vídeo na TV; dois programando em laptops (fusão entre planos, `q_16415`) | "I shut down my company for 2 days and taught everybody how to code in Claude code" | Anedota que pede prova (bastidor) |
| 16:43-16:50 | R4 | Barra "AI Venture Studio" (engrenagens): High | "Profitability, truth is is unlimited" | Critério |
| 16:58-17:08 | R4 | Barra: Low | "In regards to competition ... they don't compete" | Critério |
| 17:19-17:29 | R4 | Barra: High | "And then when I think of longevity" | Critério |
| 17:31-17:43 | R5 | Tier board; o card vai para o fim do A (o pouso não aparece nos quadros, `q_17405` ainda sem ele; em 19:16 está lá) | "I'm not going to rank it S ... Martel Ventures is a venture studio ... I'm putting it A-minus" | Veredito (Martell Ventures sem logo) |
| 17:43-17:47 | C4 | "12 AI-to-AI Marketplace" | "Next we got an AI to AI marketplace" | Anúncio do item |
| 17:48-17:51 | P2 | Busca no Google com o resultado "RentAHuman - Hire Humans for AI Agents", cursor clicando | "there's a website where AI agents hire humans? It's called rentahuman.ai" | Site citado |
| 17:51-17:57 | P2+P3 | Site rentahuman rolando; aproxima no contador "727,669 RENTABLE HUMANS" | "I think they've had over 700,000 humans register" | Número que pede prova |
| 18:05-18:08 | R2 | Punch-in (dentro do mesmo plano, o detector não marcou corte) | "you'll either be the person leading it or working for the AI" | Alerta |
| 18:12-18:13 | C4 | Transição de zoom com borrão branco e roxo | "But the other part is that AI will be buying from AI" | Virada para a prova |
| 18:13-18:20 | P1 | Página da Stripe "The new standard for agentic commerce" flutuando sobre fundo azul, depois aproxima, cursor | "Stripe, which is the number one merchant provider in the world, just came out with a protocol" | Marca + fato que pede prova (Google, citado em seguida, sem logo) |
| 18:20-18:36 | (R1) | Nada na tela | "build the Facebook marketplace ... the Airbnb of AI agents" | Ausência notável: analogia não ganha logo |
| 18:40-19:05 | R4 | Barra "AI-to-AI Marketplace" (ícone $): Moderate, Low, High | "10%, on the high end 30% ... almost nobody ... wildly defensible" | Critérios (Uber, Airbnb, Instacart sem logo) |
| 19:04 | R2+R4 | Punch-in forte com a barra | "like Uber, like Airbnb, like Instacart" | Ênfase na lista |
| 19:16-19:32 | R5 | Tier board; card pousa no **topo** do A | "I'm going to put it on the top of A" | Veredito relativo |
| 19:40-19:44 | C4 | "13 AI Logo and Brand Design" | "Next we have AI logo and brand design" | Anúncio do item |
| 19:47-19:48 | E5 | Brand kit fictício "ASTERA SYSTEMS" (paleta, tipografia, componentes) | "use AI to generate logos and brand kits" | Exemplo citado |
| 19:49-19:52 | R2+R4 | Punch-in + ícone do app Nano Banana (banana) no centro-inferior esquerdo | "You can use tools like Nano Banana" | Ferramenta (Manus, citado logo depois, sem logo) |
| 19:58-20:05 | R4 | Barra "AI Logo and Brand Design" (paleta): Moderate | "Profitability? It's kind of medium" | Critério ($100,000 em 20:05 sem card) |
| 20:19-20:41 | R4 | Barra: High, Low (punch-in em 20:40 com a barra) | "The competition, you got a lot ... longevity, I just don't see a world" | Critérios |
| 20:43-20:53 | R5 | Tier board; card em B logo **depois** de Copywriting | "I'm going to give this one a B tier ranking right after copywriting" | Veredito relativo |
| 20:55-20:59 | C4 | "14 Managed AI Cybersecurity" | "Next up we have managed AI cybersecurity" | Anúncio do item |
| 21:07 | R2 | Punch-in forte | "like social engineering" | Termo-chave |
| 21:12-21:19 | C3 | Vídeo de um homem de terno num escritório, com aparência de avatar gerado, falando para a câmera a fala do golpe (rosto grande: o medidor contou como A-roll) | "We've detected suspicious activity on your account. Can you tell me your login information? Just kidding. I'm fake." | Encenação da ameaça (deepfake) |
| 21:40-21:44 | R4 | Barra "Managed AI Cybersecurity" (escudo): High | "Profitability? Wildly profitable." | Critério |
| 22:01-22:20 | R4 | Barra: Low, High | "almost none ... the more AI gets powerful" | Critérios |
| 22:22-22:32 | R5 | Tier board; card em 2º no S, **atrás** de Agent Development. Quadro final completo: S = Agent Dev, Cyber, Consulting, Lead Gen; A = Marketplace, Voice, Chatbot, Venture Studio; B = Copywriting, Logo, VA, Repurposing; F = Faceless, Trading Bot | "I'm going to put it in S tier, right behind agent development" | Veredito relativo |
| 22:37-22:41 | E2 | Diagrama-hub: nó central "AI Agent Development" (ícone </>) com 5 pílulas vazias em volta; "Validate" acende | "Here are my five steps. Number one is I got to validate" | Passo 1 do método |
| 22:57-23:03 | E5 | Landing "The AI-Powered Chief of Staff" (marca Shake, botão "Join the Waitlist"), afastando | "a simple landing page that talks about this new AI-powered chief of staff ... added to the wait list" | Exemplo do que construir |
| 23:10-23:18 | R2+R4 | Punch-in + balão azul à direita que cresce enquanto o texto digita junto com a fala: "Who do you know that's looking for an AI powered chief of staff that helps them get back 10 to 15 hours of their week and man..." | "I just ask them, 'Who do you know that's looking for...'" | Script citado |
| 23:19-23:22 | R2 | 3 cortes secos (0,84 s, 0,80 s, 0,56 s) com reenquadramento a cada "Send" (`q_23206`) | "Send. Send. Send." | Repetição rítmica |
| 23:28 | R2 | Punch-in forte | "most people are going to reply and say, 'Well, I want that.'" | Fala citada (virada) |
| 23:34-23:36 | R4 | Balão azul: "Would you pay to solve this problem today?" | "ask if they would pay to solve that problem today" | Pergunta citada |
| 23:37-23:41 | E2 | Hub volta; "Presell" acende | "Second, we have to pre-sell" | Passo 2 |
| 23:49-23:52 | E5 | A mesma landing da Shake | "The landing page we just created, that's essentially the offer page" | Callback |
| 24:19-24:22 | E2 | Hub entra em fusão por cima do rosto (borrado na entrada) | "Then the third step is launch it manually" | Passo 3 |
| 24:38-24:41 | R2 | Punch-in forte | "deliver real value before you build or automate anything" | Conclusão do passo |
| 24:43-24:45 | E2 | Hub com "Launch Manually" aceso e o 4º nó vazio | "Now, I want to go build my audience" | Passo 4 |
| 24:58-25:01 | P2 | Busca no Instagram por "AI chief of staff": grade de Reels de outros criadores, em janela flutuante | "go find people currently talking about chief of staff using AI" | Passo prático verificável |
| 25:22-25:24 | E2 | Hub completo: Validate, Presell, Launch Manually, Build Audience, Productize | "Number five, which is last, is productize" | Passo 5 (fecha o método) |
| 25:43 | R2 | Punch-in forte | "This is how I've built every one of my companies" | Credencial |
| 25:44-25:48 | C2 | 3 planos curtos no escritório: ele (mesma camiseta azul) debruçado com um funcionário num laptop (`q_25465`) | "This is my process. I keep doing it every month." | Prova de bastidor |
| 26:01 | R2 | Punch-in forte | "So, now all you have to do is just pick one" | Chamada final |
| 26:16-26:23 | R3 | Legenda-frase branca, 2 linhas que montam uma de cada vez: "People who win aren't the ones who start first" / "They're the ones who don't quit" (o texto corta o "literally") | "People who win aren't the ones who start first. They're literally the ones who don't quit." | Aforismo |
| 26:31-26:35 | P2 | O mesmo celular do Instagram (DM "YOUTUBE SBC" e resposta) | "DM me YouTube SBC on Instagram at Dan Martell" | Callback do CTA |

---

## 4. Contagem

Base: 535 quadros (1 a cada 3 s). "%" = fatia aproximada do tempo do vídeo.

| Código | Vezes | % do tempo | Observação |
|---|---|---|---|
| R1 | (base) | ~46% | Rosto puro, com reenquadramentos leves frequentes |
| R2 | 19 momentos fortes (+3 jump cuts do "Send") | ~4% | Rosto ≥0,35 em 18 trechos amostrados; zoom leve (0,31 a 0,34) é muito mais frequente e não foi contado |
| R3 | 5 | ~2% | 3 legendas-frase, 1 acrônimo (APEX), 1 banner de CTA |
| R4 | 32 | ~24% | 22 entradas da barra-placar (~21% do tempo sozinha), 1 painel Criteria, 9 cards/ícones/balões ao lado |
| R5 | 15 | ~11% | Tier board com rosto em janela: 1 de regras + 14 vereditos, de 7 a 20 s cada |
| R6 | 0 | 0% | |
| P1 | 3 | ~1% | Playbook, site Apex, Stripe |
| P2 | 8 | ~3% | Maps, Manus, DM no Instagram (x2), montagem e-mail/agenda/Slack, OpenTable, rentahuman, busca no Instagram |
| P3 | 1 | <1% | Zoom no contador do rentahuman |
| P4 | 0 | 0% | Nenhum vídeo de terceiro confirmado (a UI do Manus pode ser material oficial) |
| P5 | 1 | <1% | Parede da Martell Ventures |
| E1 | 1 | <1% | Capa do Sell by Chat |
| E2 | 9 | ~3% | Tier list de abertura, diagrama de repurposing, Kai→Reese, organograma, hub do método (5 vezes) |
| E3 | 0 | 0% | Nenhum gráfico ou contador animado |
| E4 | 10 | ~2% | 5 logos em tela cheia, 4 ilustrações (LEADS, cash cow, trading bot, fábrica), avatar do Kai |
| E5 | 7 | ~2% | Mosaico de thumbs, YouTube Studio, Opus Clip, VoltCraft, Astera, landing Shake (x2) |
| C1 | 5 | ~1% | Bolsos vazios, 4 profissões, telefone dividido, robôs, restaurante |
| C2 | 2 | <1% | Time aprendendo a programar, ele no escritório |
| C3 | 1 | <1% | O "fake" do golpe |
| C4 | 15 | ~4% | 14 rótulos numerados + 1 transição de zoom |
| C5 | 0 | 0% | Sem legenda contínua |

**Ritmo por fase**

- **Abertura (00:00-01:00):** 21 cortes; 13 dos 20 quadros não são R1 puro (65%); 9 recursos diferentes em 60 s
  (E5, R2+R3, C1, P5, E2, C4, R4, montagem C1, tela dividida). Um visual novo a cada 3 a 5 s.
- **Item 1 + regras (01:00-02:46):** apresenta os 3 sistemas gráficos que vão se repetir (tier board, painel de
  critérios, barra-placar) com tempo longo de tela (painel de 20 s, tier board de 12 s).
- **Corpo (02:46-22:32):** 7 a 16 cortes por minuto (média ~11). Mais ou menos 55% a 60% do tempo com algo na tela,
  quase tudo barra e tier board. Inserções em tela cheia ficam concentradas no começo de cada item (a parte "o que é").
- **Fim (22:32-26:44):** 7 a 12 cortes por minuto; hub do método voltando a cada passo + balões de chat; o último
  1:20 é quase só rosto, com 2 punch-ins, 1 legenda-frase e o celular do CTA (~25% não R1).

---

## 5. Regras contextuais

### Como os 14 itens são marcados na tela (o sistema do vídeo)

Cada item ganha **três camadas que se repetem iguais**, e as três usam o mesmo ícone do item (onda = voice, pessoa =
lead gen, play = faceless, reciclar = repurposing, lâmpada = consulting, fone = VA, balões = chatbot, gráfico =
trading, </> = agent dev, caneta = copywriting, engrenagens = venture studio, $ = marketplace, paleta = logo, escudo =
cyber):

1. **Rótulo numerado** (C4) no "Next we have X": número em quadrado azul + nome sublinhado, canto inferior esquerdo,
   2 a 5 s, atravessa corte e sai deslizando para baixo.
2. **Barra-placar** (R4) durante a avaliação: ícone + nome do item à esquerda, 3 campos (PROFITABILITY, COMPETITION,
   LONGEVITY) que recebem High, Moderate ou Low no momento do veredito de cada critério.
3. **Card no tier board** (R5) no veredito final: o quadro vai acumulando os cards. Ele funciona como barra de
   progresso do vídeo: o espectador vê quantos itens faltam e quais vagas sobraram.

### Regras do vídeo inteiro

1. **Quando a fala anuncia o próximo item ("Next we have X"), aparece o rótulo numerado** em até 2 s.
   Provas: 00:25, 02:49, 04:16, 06:01, 06:58, 08:31, 10:34, 12:04, 13:43, 14:54, 16:13, 17:43, 19:40, 20:55.
2. **Quando ele diz o nome de um critério, a barra-placar sobe; o valor entra quando ele dá o veredito daquele
   critério.** Se ele divaga entre um critério e outro, a barra sai e volta; se ele emenda, ela fica (até 30 s).
   Provas: sai e volta em 01:49 / 02:10 / 02:34 e 16:43 / 16:58 / 17:19; fica direto em 06:25-06:41, 09:28-09:50,
   11:07-11:38.
3. **Quando ele dá o veredito final ("I'm going to put it in..."), corta para o tier board em tela cheia com o rosto
   numa janela à esquerda; o card voa até a fileira e o quadro fica de 7 a 20 s enquanto ele justifica.** O quadro
   entra já na frase que anuncia o veredito, antes da letra.
   Provas: 02:40, 04:04 ("where I tier this"), 05:13, 06:49, 08:04, 09:58, 11:43, 14:43, 16:01, 19:16, 20:43, 22:22.
4. **Quando o veredito é relativo, a posição do card obedece a fala ao pé da letra.** "Stronger than content
   repurposing" põe VA antes de Repurposing (09:58); "behind the voice agent" (11:43); "the top opportunity" entra em
   1º (14:43); "top of B" (16:01); "top of A" (19:28); "right after copywriting" (20:43); "right behind agent
   development" (22:25); "put it in front of [lead gen]" já aparece cumprido em 09:58.
5. **Quando ele cita uma ferramenta que o público pode usar, aparece o logo**: em tela cheia por 1 a 2 s (Manus
   03:02, Gemini 03:04, Descript 06:20) ou ao lado do rosto (clay 03:37, Nano Banana 19:49).
   **Contraexemplo que define a regra:** marca usada como analogia ou como gabarito não ganha logo (Facebook e Airbnb
   18:20-18:36, Uber/Airbnb/Instacart 19:02, Intercom 11:20, Google 18:18, Martell Ventures 17:34).
6. **Quando o "o que é" do item tem uma metáfora, a tela desenha a metáfora literalmente** em ilustração ou diagrama
   de tela cheia: "cash cow" vira vaca sobre dinheiro (04:22), "a factory that turns out businesses" vira esteira
   (16:26), "the agent manages several other agents" vira organograma (14:04), "long-form into tweets, carousels,
   newsletters" vira vídeo ramificando (06:04), "presents qualified leads" vira prancheta LEADS (02:57).
7. **Quando a fala enfileira exemplos concretos curtos, vira montagem de ~1 s por exemplo**, um plano por palavra.
   Provas: plumbers, HVAC, law firms, dental (00:43-00:48); inbox, calendar, Slack (09:10-09:15); landing pages e sales
   emails (14:55-14:59).
8. **Quando ele cita uma frase dita ou mandada por alguém, vira balão de chat azul ao lado do rosto**, com o texto
   digitando no ritmo da fala. Provas: 08:40, 23:10-23:18, 23:34.
9. **Quando a afirmação pode ser checada num site ou app real, aparece a gravação de tela flutuando sobre fundo azul,
   com cursor, e aproxima no botão ou número que prova.** Provas: Google Maps com cursor em "Call" (02:22-02:27),
   rentahuman com zoom em "727,669" (17:51-17:57), Stripe (18:13-18:20), busca no Instagram (24:58).
10. **Quando ele fala de algo dele (produto, livro, empresa), mostra a coisa real dele**: parede da Martell Ventures
    (00:12), playbook (05:37-05:47), livro (08:34), site e sigla do Apex (08:58-09:05), Kai e as tarefas do Kai
    (09:07-09:15), o time (16:38, 25:44).
11. **Quando a fala volta a um assunto, o mesmo asset volta (callback)**: Kai em 09:07 e 13:49; landing da Shake em
    22:57 e 23:49; celular da DM em 05:52 e 26:31.
12. **Quando ele enuncia passos numerados de um método, um diagrama-hub volta a cada passo e acende o nó da vez,
    acumulando.** Provas: 22:37 (Validate), 23:37 (Presell), 24:19 e 24:43 (Launch Manually), 25:22 (Productize, os 5).
13. **Frase de efeito, aforismo ou palavrão vira legenda-frase grande (e só nesses momentos), quase sempre junto com
    punch-in.** Provas: 00:05 ("99% of them are full of sh*t", com a censura escrita), 08:52, 26:16-26:23.
14. **Punch-in forte marca a frase que vira a chave da conversa**: provocação (00:05), imitação de terceiro (01:19),
    anedota pessoal (03:43), apelo ao público (07:18), teaser (10:31), pergunta retórica (11:31),
    preparação da piada (13:34), alerta (18:05), fala citada (23:28), conclusão de passo (24:38), chamada final (26:01).
15. **Número de dinheiro fica na boca dele, sem card.** "$5,000 ... $50,000" (07:10), "20%", "10 to 15 billion", "$97"
    (12:21-12:56), "10 to 15,000 a month" (15:33), "$100,000" (20:05) ficam todos em R1. O único número que ganha
    tela é o que tem prova externa (727,669 no site, 17:54), e a forma é zoom na prova, não gráfico.
16. **A barra simplifica o adjetivo da fala em 3 níveis.** "decent" vira High (09:28), "decent, actually pretty good"
    vira Moderate (15:28), "kind of medium" vira Moderate (19:58), "getting tougher" vira Moderate (03:33). O valor
    escrito é o veredito, a fala é a nuance.

### Truques de um momento só (não viram regra)

- **"Send. Send. Send."** com um corte seco por repetição (23:19-23:22).
- **Piada do falso veredito**: tier board entra na mentira e o card só pousa depois do "I'm kidding" (13:35-13:42).
- **Deepfake encenado**: um "homem falso" fala a frase do golpe e diz "I'm fake" (21:12-21:19).
- **Acrônimo APEX** montando as palavras ao lado do rosto (09:01-09:05).
- **Banner "Click the link in the description"** com seta (09:22-09:26): o único CTA de link escrito na tela.
- **Painel "Criteria"** com lista numerada (01:22-01:41): aparece uma vez só, depois a barra assume.
- **Mergulho na caixa "?" do S** (00:21-00:24) para segurar o laço aberto.
- **Transição de zoom com borrão** (18:12): a única vista; o resto entra deslizando ou em corte seco.

---

## 6. Materiais

### O que só o criador pode dar (e como pedir)

| Item (hora no ref2) | Por que só ele | Como pedir |
|---|---|---|
| Fachada, parede ou placa da empresa com as marcas (00:12) | É a prova física da credencial dita no gancho | "Grave 5 s da parede/placa da sua empresa (ou dos logos dos seus projetos), câmera parada na horizontal, 1920x1080, com luz do dia. Vai na frase em que você diz o que já construiu (gancho)." |
| Capa e páginas do material gratuito (05:37-05:47) | O conteúdo é dele | "Me mande o PDF do seu material gratuito (ou o link do Notion/Docs). Eu faço a capa e o rolar das páginas a partir do arquivo. Vai no CTA do meio." |
| Gravação da DM com a palavra-chave e a resposta automática (05:52, 26:31) | Conta e automação dele | "Grave a tela do celular (gravação nativa do iPhone/Android), vertical: abrir o Instagram, ir no seu perfil, mandar a palavra-chave na DM, a resposta automática chegando. 15 a 20 s, sem notificação aparecendo (modo não perturbe). Vai no CTA do meio e no CTA final." |
| Site do produto próprio com cursor (08:58) | É o produto dele | "Grave a tela do computador abrindo o site do seu produto, rolando devagar e passando o mouse no botão principal. 10 s, 1920x1080, navegador sem abas pessoais. Vai quando você cita o produto." |
| Telas do produto funcionando (09:10-09:15: e-mail, agenda, Slack) | Contas reais dele, com dados dele | "Grave 3 telas curtas (3 s cada) do seu sistema fazendo as tarefas que você vai citar, na ordem em que fala. Pode borrar nomes de clientes; eu aviso onde vai." |
| Avatar ou personagem do produto (09:07, 13:49) | Identidade do produto | "Me mande a imagem oficial do seu assistente/personagem em PNG com fundo transparente, ou me autorize a gerar uma." |
| Livro ou produto físico (08:34) | Produto dele | "Mande a capa em alta (PNG/JPG, mínimo 1500 px) e o endereço do site do livro. Vai quando você se apresenta como autor." |
| B-roll de bastidor do time (16:38, 25:44) | Só ele tem acesso ao escritório e às pessoas | "Grave 3 planos de 3 a 5 s, sem falar: você trabalhando com alguém do time no computador, uma reunião, uma tela com o trabalho rolando. Horizontal, luz boa, com autorização de quem aparece. Vai quando você conta um bastidor." |
| Anedota pessoal encenada (10:40, restaurante) | Se for ele, é cena própria | "Se quiser aparecer: 3 s de você fazendo a ação que conta (ex.: mexendo no celular num restaurante). Se não, eu uso cena de banco de imagens e aviso." |
| App no próprio celular com o nome dele (10:43, "Good afternoon, Dan") | Personalização autêntica | "Grave 3 s do app que você cita aberto no seu celular, na tela inicial do app." |
| Print de resultado que ele **afirma e o vídeo não mostra** (06:11 "my Threads are blowing up") | Só ele tem o painel | "Você vai dizer que [rede] está crescendo: me mande um print do painel de estatísticas dos últimos 30 dias (tela cheia, sem cortar a data). Se não quiser mostrar, a frase fica sem prova e tudo bem." |
| Pesquisa que ele fez de verdade (Maps 02:22, busca de site 17:48, busca no Instagram 24:58) | O sistema consegue gravar a navegação num site público, mas a busca do criador tem os resultados reais da cidade dele | "Se puder, grave você fazendo a busca que vai citar (Google Maps, Instagram), 10 s. Se não, eu gravo a mesma busca no navegador e mostro como exemplo." |

### O que o sistema faz sozinho

- Tier board (fileiras, cards, ícones, pouso animado), barra-placar, rótulos numerados, painel de critérios.
- Balões de chat recriados com texto digitando, legendas-frase, acrônimo, banner de CTA.
- Diagramas: hub de passos acumulativo, organograma, "um vira vários".
- Cartelas de logo de ferramentas públicas (Manus, Gemini, Descript, clay, Nano Banana), sempre com o logo oficial.
- Ilustrações geradas (vaca do "cash cow", fábrica de negócios, prancheta LEADS, robôs no escritório).
- B-roll de banco de imagens (bolsos vazios, profissões, telefone humano x robô).
- Interfaces recriadas de exemplo (YouTube Studio com monetização desativada, ferramenta de cortes, landing e caixa
  de entrada fictícias, brand kit), sempre com marca inventada para não parecer print real de terceiro.
- Gravação de navegação em site público (rentahuman, Stripe) pelo navegador automatizado.
- Avatar falando uma fala encenada (o "fake" de 21:12): dá pra fazer, mas só deixando claro na fala que é encenação,
  como ele faz.

---

## 7. Assinatura do criador

Isto é marca do Dan Martell e **não** deve virar regra do modelo, só exemplo de como a autenticidade aparece:

- Cenário de casa com lareira de pedra e janelões, camiseta azul lisa, microfone em braço, MacBook com o adesivo de
  montanhas (o símbolo da marca dele aparece também nas camisetas do time em 25:44).
- Paleta gráfica azul-marinho com ciano neon e o tier board vermelho/laranja/amarelo/verde.
- Produtos e personagens próprios: Martell Ventures, livro "Buy Back Your Time", playbook "Sell by Chat" com a
  palavra-chave "YOUTUBE SBC", plataforma Apex e o agente "Kai".
- Bordões e tiques: palavrão cortado no meio ("full of sh-"), "the S of the S of the S", "I've got some bangers
  coming", "dude", humor de falso veredito.
- Autoridade por quantidade ("launches a new AI company every single month") e por bastidor do time.

O que **é** transferível: o sistema de três camadas por item, a obediência literal da posição do card à fala, a regra
de logo só para ferramenta, o callback de asset e o número de dinheiro sem card.

---

## 8. O que não deu pra ver

- **Som:** não ouvi o vídeo. O roteiro automático marca "[music]" em 8 pontos (04:33, 05:09, 08:48, 13:03, 13:18, 15:36,
  17:36, 19:58); 6 deles caem a menos de 3 s de uma entrada de gráfico (slide do YouTube Studio, tier board do F,
  legenda-frase, valor "Low", barra). Pode ser efeito sonoro de entrada; não confirmado.
- **Animações finas:** como o card voa até a fileira, a curva da barra subindo, se há som no pouso. Os quadros a cada
  3 s só mostram o antes e o depois. Vistos de fato: slide com borrão de movimento (04:37), fusão entre planos de
  B-roll (16:41) e do hub sobre o rosto (24:19), zoom com borrão (18:12).
- **Trocas que aconteceram entre quadros:** Consulting passando à frente de Lead Gen (entre 08:13 e 09:58), o card do
  Venture Studio pousando no A (entre 17:40 e 19:16), a pílula "Build Audience" acendendo (entre 24:45 e 25:22).
- **Planos curtos não pegos:** 00:08 (1,0 s), 00:10,5 (1,8 s), 2 das 4 profissões (00:43-00:48), 12:26,1 (0,9 s),
  12:52,8 (0,5 s), Two Sigma (se teve logo), a 4ª tela da montagem do Kai.
- **Restaurante (10:40):** não dá para saber se o homem é o próprio criador ou banco de imagens.
- **Origem das ilustrações e das interfaces de exemplo:** a aparência indica geração por IA ou recriação, mas não há
  como provar pela imagem.
- **Tela final do YouTube:** o "click the video" (26:41) não tem elemento gráfico no arquivo; os cards de fim são
  colocados pelo YouTube e não aparecem no download.
- **Notas de método para o protocolo:** (1) a hora das folhas está 1,5 s adiantada (ver o aviso no topo); (2) o
  detector de cortes não marca punch-in no mesmo plano, então 304 é piso; (3) rosto em janela alta conta como "rosto
  grande", então o 89% inclui ~12% de tier board.
