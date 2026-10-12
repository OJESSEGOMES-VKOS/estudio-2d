# youtubeedition01

Modelo de **edição de vídeo longo de YouTube** com a pessoa falando: o formato que os maiores canais de
negócio, IA e método usam hoje. A pessoa grava; o modelo lê a fala, decide o que entra na tela em cada frase,
faz sozinho tudo o que é explicação e **pede ao criador** só o que é prova e que ninguém além dele tem.

Diferente dos outros modelos, este não é uma receita visual: é uma **gramática de decisão**. As 4 referências
são 4 formatos diferentes de vídeo, e a regra que une todas é a mesma: *a tela responde à fala no mesmo segundo,
e cada tipo de frase tem o seu tipo de resposta.*

Tudo o que o dono ensinar dizendo "youtubeedition01" entra só aqui. A autenticidade de cada criador mora em
`perfis/` e nunca reescreve este arquivo (ver §12).

## Referências (medidas de ponta a ponta)

Medição: `analise/medir.py` (cortes, folhas de 1 quadro a cada 3 s, rosto pelo YuNet), `analise/som.py` (chão
de ruído), Whisper large-v3 onde a legenda do YouTube falhou. Decupagem completa de cada uma em
`analise/refN_decupagem.md`, feita pelo `analise/PROTOCOLO-decupagem.md` (que serve pra qualquer referência
nova). Nas citações abaixo: **S** = ref1, **D** = ref2, **J** = ref3, **M** = ref4, com a hora do vídeo (S e J
podem ter até 1,5 s de folga, ver o aviso no topo das decupagens).

| | Canal | Vídeo | Duração | Formato | Cortes secos | Mediana | Rosto cheio | Rosto no canto | Sem rosto |
|---|---|---|---|---|---|---|---|---|---|
| S | Sanji Nai-Chien | The $30K/Month AI Faceless Shorts Method (450 mil) | 13:27 | Método com a tela | 70 | 6,4 s | ~32% | **~63%** | ~4% |
| D | Dan Martell | The Only 14 Ways to Make Money with AI in 2026 (1,3 mi) | 26:44 | Lista com placar | 304 | 4,3 s | **~77%** | ~12% (janela) | ~10% |
| J | Joseph, Video Editing | Claude Just Edited My Entire YouTube Video (134 mil) | 13:31 | Tutorial explicado | 106* | 5,5 s | ~52% | ~1% | **~47%** |
| M | Mark Tilbury | I Tried The LAZIEST Way to Make Money With AI (5,9 mi) | 33:19 | Eu testei | 452 | **3,0 s** | ~51% | ~39% (círculo) | ~9% |

\* J troca de tela muito por transição suave, que o detector não pega: o número real de trocas é bem maior.
Em todos, o detector não marca punch-in no mesmo plano e zoom dentro da gravação de tela, então os cortes são
um piso. O "rosto" foi conferido quadro a quadro nas folhas (o detector conta o rosto no canto como grande).

Os vídeos ficam em `referencias/` só para estudo. **Não vão em entrega nenhuma.** Quando o vídeo de
apresentação deste modelo for aprovado, ele vira a referência e os de terceiros podem sair.

---

## 1. A ideia central

Cinco leis, todas medidas nas 4 referências:

1. **A tela responde à fala no mesmo segundo.** O que é apontado ("olha isso", "this is", "here") aparece; o que
   é afirmado e pode ser checado ganha prova; o que é abstrato vira desenho; o que é opinião fica no rosto. A
   §5 é a tabela completa. [S, D, J, M: as 4 decupagens chegam nas mesmas regras de forma independente]
2. **Prova e explicação têm caras diferentes, e nunca se confundem.** Prova é a coisa real: navegador com barra
   de endereço e cursor, print, painel, vídeo citado, objeto filmado. Explicação é desenhada, num fundo limpo da
   marca do vídeo. O espectador sabe pela cara da tela se está vendo um dado ou uma ideia. [S regra 8, J §7, D
   regra 9] **Prova nunca é fabricada** (§11).
3. **O rosto quase nunca some.** Em 3 dos 4 vídeos a pessoa está na tela (cheia ou no canto) em ~90% do tempo:
   quando a tela entra, o rosto vai para uma janela no canto (S 63%, M 39%, D 12%). O espectador está sempre com
   alguém. A exceção é o tutorial explicado (J), que troca o rosto pela animação em tela cheia em 47% do tempo.
4. **O vídeo tem uma espinha: um mapa visível de onde estamos.** Fases em degraus (J), placar e tier board que
   acumula (D), lista física riscada com o tempo restante (M). Ela volta a cada capítulo e funciona como barra de
   progresso. É isso que segura 13 a 33 minutos. (§3)
5. **O ritmo vem de alternar camadas, não só de cortar.** O primeiro minuto tem 8 a 9 recursos diferentes nos 4
   vídeos (um visual novo a cada 3 a 5 s). Depois, uma tela longa é sustentada por zoom e pan internos a cada 3 a
   6 s, e um trecho de rosto puro pode durar 14 a 36 s quando a fala é opinião. (§6)

---

## 2. Os quatro formatos

O modelo lê o roteiro (ou a transcrição do bruto) e escolhe **um formato-base** pelo que a fala promete. Um
vídeo pode pegar emprestado um bloco de outro formato (um tutorial dentro de uma lista), mas a espinha é uma só.

| | **A. Método com a tela** (S) | **B. Lista com placar** (D) | **C. Tutorial explicado** (J) | **D. Eu testei** (M) |
|---|---|---|---|---|
| A fala promete | "vou te mostrar como funciona, passo a passo" | "os N jeitos de..., e no fim qual eu escolho" | "o processo em N fases, e por que funciona" | "eu testei X por N dias, com regras e risco" |
| Onde o tempo fica | rosto no canto sobre a tela ~63%, rosto cheio ~32% | rosto cheio ~77% com placar ao lado, tier board ~11% | rosto ~52%, animação e tela cheia ~47% | rosto cheio ~51%, círculo sobre a tela ~39%, objeto de cima ~6% |
| Espinha | quase nenhuma: título-capítulo grande atrás do rosto e recap numerada só no fim | rótulo numerado + barra-placar + tier board que acumula | cartela de fases em degraus, a da vez acesa | lista física de passos riscada à caneta + cartela de tempo restante + troca de roupa/cenário por dia |
| Recurso dominante | `P2` gravação de tela (~48%), `P3` zoom no número real | `R4` placar ao lado do rosto (~24%), `R5` tier board | `E2` diagrama (~13%), `P2` (~19%), `E1`/`E4` | `P2` (53 trechos), `P5` objeto físico (30), `R2` punch-in (24) |
| Ritmo do corpo | 2 a 5 cortes/min, zoom interno a cada 3 a 6 s | 7 a 16 cortes/min (média ~11) | 7 a 15 cortes/min, fim cai para 1 a 4 | 13,6 cortes/min, pesquisa chega a 26 |
| CTA do meio | link da ferramenta aos ~67% | isca grátis aos ~20%, produto aos ~35% | curso aos ~31%, entrando pela dor do bloco anterior | código de desconto aos ~23% + faixa "material grátis" 5 vezes |
| Fecho | recap em 3 itens que acendem, CTA de ação | método em 5 passos (hub que acende), aforismo, comentário | comparação manual x IA em números, objeção, CTA | conta do lucro item a item, paga a aposta do gancho |

**Como reconhecer pelo roteiro:** "passo a passo", "full workflow", muitos verbos de clique → A. Número no
título e "ranking", "tier", "os N" → B. "Fases", "o processo", ensino de método com exemplo → C. "Eu testei",
"por N dias", regras, aposta, "resultados crus" → D. Na dúvida, o formato é o que a **espinha** precisa ser: se
o espectador precisa saber quantos faltam, é B; em que dia/etapa está, é D; em que fase do processo, é C.

### O que os 4 têm em comum na estrutura do roteiro (o modelo usa como checagem, não como fôrma)

1. **Gancho com prova embutida em 10 a 25 s.** Afirmação forte + prova real na tela antes dos 25 s: painéis de
   faturamento (S 00:03, M 00:18), credencial física (D 00:12), o bruto e o resultado (J 00:29).
2. **Um laço aberto até o fim**: "no fim eu digo qual escolheria" (D 00:19), a aposta de US$ 1.000 (M 00:51), "as
   4 fases" (J 00:20). O fecho paga o laço.
3. **Conteúdo começa entre 24 s e 1 min.** As regras do jogo entram dentro do primeiro item, quando o público já
   está dentro (D 00:59).
4. **CTA do meio só depois de entregar valor**, entrando pela dor que o bloco anterior levantou (J 04:20) ou logo
   depois de um veredito forte (D 05:26).
5. **Teasers de retenção** a cada terço ("não esquece o fim", "agora só faltam dois") (D 10:26, 19:31; M "COMING
   UP").
6. **Fecho com recapitulação** em uma frase ou lista, e o CTA final.

---

## 3. A espinha do vídeo (o mapa de onde estamos)

Todo vídeo deste modelo tem uma espinha escolhida no plano, antes de qualquer gráfico. Ela usa a marca do vídeo
(§9) e **volta igual** a cada capítulo, mudando só o que avançou.

| Espinha | Para | Como funciona | Prova |
|---|---|---|---|
| **Degraus de fase** | C, e qualquer processo em etapas | No anúncio das N fases, a escada inteira aparece; em cada "fase X", a da vez acende e a anterior apaga embaixo | J 00:20, 01:59, 09:03, 11:03 |
| **Placar + quadro que acumula** | B | Três camadas por item, todas com o mesmo ícone: rótulo numerado no "next we have", barra de critérios que recebe o veredito de cada critério na hora em que é dito, card que pousa no quadro no veredito final. O quadro acumulado é a barra de progresso | D 00:25, 01:49, 02:40 e mais 13 itens |
| **Lista física + relógio** | D, e qualquer desafio com prazo | Lista de passos escrita à mão, filmada de cima; cada passo fecha com a caneta marcando e a cartela de tempo restante; os dias trocam roupa e cenário | M 04:22+04:28, 06:29+06:34, 19:13 |
| **Título-capítulo** | A, e vídeos curtos (até ~12 min) | Sem cartela: o capítulo é uma palavra grande atrás do rosto ("WHY NOW?", "NICHE"); só a recap final numera | S 01:03, 03:18, 13:08 |
| **Hub de passos** | o bloco de "método" no fim de qualquer formato | Diagrama com os N passos que volta a cada passo e acende o nó da vez, acumulando | D 22:37 a 25:22 |

Regras da espinha:
- **Uma por vídeo.** O hub de passos pode entrar como bloco final em qualquer formato.
- **A posição obedece à fala ao pé da letra.** "Logo atrás do X", "topo do B", "na frente do Y": o card vai
  exatamente ali (D: 7 casos). O valor escrito é o veredito; a nuance fica na fala ("decent, actually pretty
  good" vira Moderate) (D regra 16).
- **Se a fala divaga, a espinha sai e volta**; se emenda, fica (D 01:49 / 02:10 / 02:34).

---

## 4. O catálogo de recursos

Os códigos são os do protocolo (para as referências se compararem). A última coluna diz **quem fornece**:
**sistema** (faz sozinho), **busca** (o sistema acha fonte aberta ou oficial), **criador** (só ele tem: vai para
o pedido, §11).

| Código | Recurso | Como aparece nas referências | Quem fornece |
|---|---|---|---|
| `R1` | Rosto puro | O chão do vídeo: 27% (S) a 46% (D) | criador (o bruto) |
| `R2` | Punch-in | Zoom de corte no mesmo plano, 1,2 a 1,4x, na frase-chave; D 19 fortes, M 24 | sistema (precisa de folga de quadro no bruto) |
| `R3` | Rosto + texto | Palavra-título **atrás** da pessoa (S "WHY NOW?"), complemento **na frente** no terço de baixo, texto lateral com itens entrando (M), legenda-frase só em aforismo (D) | sistema (texto atrás exige recorte da pessoa) |
| `R4` | Rosto + elemento ao lado | Placar (D), pílulas numeradas (J 12:23), short em moldura de celular (S 04:00), card de comentário (M 21:52), reação em tela dividida (M 17:43) | sistema, com o conteúdo do criador quando é prova |
| `R5` | Rosto no canto | Cartão arredondado (S) ou círculo (M) sobre a tela; **troca de canto conforme o espaço livre**; entra com o rosto encolhendo e girando até virar o cartão (S 00:09, 03:39, 12:12) | criador grava a câmera junto com a tela; sistema monta |
| `R6` | Outro plano | 2ª câmera lateral fechada (M, nas piadas), outro cenário por dia (M) | criador |
| `P1` | Print | Página, perfil, artigo com **grifo na frase que prova**, círculo no nome (M 02:10, S 00:34) | criador ou busca (fonte pública verificável) |
| `P2` | Gravação de tela | O passo exato que a fala descreve, com zoom no campo em uso e cursor (S, J, M: a espinha dos tutoriais) | criador (sessão dele, conta dele) |
| `P3` | Número real | Zoom até o número no painel onde ele mora, cursor em cima (S 00:03, 04:27; M 30:46) | criador |
| `P4` | Vídeo de terceiro | Trecho do reel/vídeo citado, quase sempre com o rosto no canto (M 15 vezes, S 2) | criador manda o link e o "pode usar" |
| `P5` | Objeto real filmado | Lista e quadro filmados de cima (M 30), parede da empresa (D 00:12) | criador |
| `E1` | Texto em tela cheia | Título cinético, preço antigo e novo (J 04:50), pergunta em tela cheia (M 24:49) | sistema |
| `E2` | Diagrama | Fluxo entrada → ferramenta → saída com linha tracejada (J 06:40, 09:20), antes/depois, comparação em duas colunas, quadro de 4 áreas (M) | sistema |
| `E3` | Gráfico ou número animado | Curva esquemática desenhando (S 01:10), conta com contador (S 02:27), números entrando um a um sobre os ícones (J 11:33) | sistema (só com número do roteiro) |
| `E4` | Ícone e ilustração | Uma palavra + um ícone por conceito (J 02:24), logo de ferramenta (D 03:02), metáfora desenhada literal (D 04:22 "cash cow"), ícone riscado (J 09:11, S 00:42) | sistema (logo oficial por busca; ilustração gerada) |
| `E5` | Interface recriada | Prompt digitado em fundo limpo (J 05:52), chat de duas bolhas para objeção (S 01:51), balão de fala citada (D 08:40), card de comentário com o @ do criador (M 00:51) | sistema, sempre como ilustração assumida (§11) |
| `C1` | Stock | Só D, ~1% (bolsos vazios, profissões). Marginal neste formato | busca |
| `C2` | B-roll próprio | Bastidor do time (D 16:38), os artefatos do experimento como B-roll (M) | criador |
| `C3` | Meme/cena pop | 1 por vídeo no máximo (M Cruella 11:22, J "SLOP") | busca; peso pelo perfil |
| `C4` | Cartela e transição | Fases (J), rótulo numerado (D), tempo restante e "COMING UP / PREVIOUSLY" (M), montagem acelerada com música (M 6) | sistema |
| `C5` | Legenda | **Nenhum dos 4 tem legenda corrida.** Só palavra-chave solta ou legenda-frase em momento de efeito | sistema |
| `P&B` | Corte em preto e branco | Piada sobre si mesmo, quase sempre no close lateral (M 6 vezes) | sistema; peso pelo perfil |

---

## 5. Os gatilhos: qual frase chama qual recurso

O coração do modelo. Cada frase do roteiro recebe uma **função**; a função escolhe o recurso. A coluna "refs"
diz em quantas referências a regra foi vista de forma independente (4/4 é lei; 1/4 é opção).

### 5.1 Mostrar o que é dito

| Função da frase | O que a tela faz | Refs | Prova |
|---|---|---|---|
| **Dêitico** ("olha isso", "aqui", "isso aqui", "ele me mandou isto") | A coisa real, no mesmo segundo | 4/4 | J 00:29, 01:45, 07:37; S 00:10; M 05:09; D 02:22 |
| **Passo de tutorial** (clique, cole, digite, abra, exporte) | Gravação daquele passo, ampliada no campo em uso, cursor visível; texto digitado no ritmo da fala; rosto no canto livre | 3/4 | S 05:42, 06:03, 10:03; J 01:26, 07:08; M 04:43, 10:31 |
| **Ferramenta citada pela 1ª vez** | A interface dela antes do primeiro clique | 3/4 | S 05:36, 08:48; J 09:14; M 04:34, 06:43 |
| **Leitura em voz alta** (resposta da IA, texto de um site) | Grifo acompanhando a linha que está sendo lida | 2/4 | M 05:09 a 06:09, 13:04; J 08:09 (moldura na caixa de prompt) |
| **Prompt citado** | Legível: na gravação, a caixa ganha moldura de acento e o resto escurece; ou recriado, digitado num fundo limpo | 2/4 | J 08:09, 09:29, 05:52; M 09:43 |
| **Resultado gerado + reação** | Tela dividida: o criador assistindo de um lado, o resultado com som do outro | 1/4 | M 17:43, 18:04, 27:16 |

### 5.2 Provar o que é afirmado

| Função da frase | O que a tela faz | Refs | Prova |
|---|---|---|---|
| **Número de resultado que tem prova** (faturamento, views, seguidores, pedidos) | Zoom até o número no painel onde ele mora, cursor ou caixa em cima | 3/4 | S 00:03, 03:48, 04:27; M 01:31, 22:49, 30:46; D 17:54 |
| **Afirmação de mercado que pede prova** | Artigo ou página com grifo na frase exata que sustenta a afirmação | 2/4 | M 01:43, 02:10; S 00:34 |
| **"Não acredite em mim" / "confere você mesmo"** | Prova de tela logo em seguida, muitas vezes em rajada | 2/4 | S 04:26, 12:48 |
| **Nome próprio de pessoa ou conta** | Print do perfil com o rosto no canto, círculo no nome | 2/4 | M 01:28, 02:01, 03:28; S 00:10, 00:27 |
| **Algo do próprio criador** (produto, empresa, livro, canal, trajetória) | A coisa real dele | 3/4 | D 00:12, 05:37, 08:58; M 00:33, 09:22; J 05:40 |
| **Como os outros fazem** ("os canais grandes fazem assim") | Um exemplo real de terceiro: ao lado do rosto se ele explica, dentro da tela se está no tutorial | 2/4 | S 04:00, 09:36; M 02:16 |

### 5.3 Explicar o que é abstrato

| Função da frase | O que a tela faz | Refs | Prova |
|---|---|---|---|
| **Conceito novo nomeado** | Uma palavra + um ícone, fundo limpo da marca; se o conceito volta, volta **a mesma** animação | 2/4 | J 02:24, 03:47, 06:21 (reaproveita); D 02:57 |
| **Metáfora** ("vaca leiteira", "fábrica de negócios") | A metáfora desenhada literalmente, em tela cheia | 2/4 | D 04:22, 16:26; J 05:17 (o "jogar coisas" vira arrastar) |
| **Processo** (entrada → ferramenta → saída) | Fluxo da esquerda para a direita, linha tracejada | 3/4 | J 06:40, 09:20, 00:53; S 02:57; D 06:04 |
| **Comparação** (antes x depois, manual x IA, 1 x 3) | Tela dividida em dois lados ou duas linhas | 3/4 | J 01:56, 11:33, 12:13; D 09:58; M 17:43 |
| **Conta** ("vamos fazer a conta") | Itens entrando um a um, na hora em que são ditos, e o total no fim | 3/4 | S 02:27; M 30:52, 31:46; J 11:33 |
| **Limitação ou negação** ("não consegue", "sem X, sem Y") | O ícone riscado | 2/4 | J 09:11; S 00:42 |
| **Ideia antes do dado** | Primeiro o esquema desenhado, depois o dado real | 1/4 | S 01:10 (curva) → 01:24 (Google Trends) |
| **Sigla** | A definição escrita na hora | 2/4 | S 02:00 (RPM); D 09:01 (APEX) |

### 5.4 Listar e organizar

| Função da frase | O que a tela faz | Refs | Prova |
|---|---|---|---|
| **Lista de nomes próprios** (ferramentas) | Um logo por nome, na ordem falada | 2/4 | J 01:20; D 03:02 |
| **Lista de exemplos curtos** | Montagem de ~1 s por exemplo, um plano por palavra | 2/4 | D 00:43, 09:10; M 02:50 |
| **Enumeração com valor** (itens, custos, "1 vídeo, 1 cliente, 1 pagamento") | Rosto para um lado, itens entrando do outro, um por fala; se a fala sai do assunto, a lista some e volta | 3/4 | M 03:46, 30:52; J 12:23; S 13:08 |
| **Anúncio de capítulo, fase ou item** | A espinha (§3) | 4/4 | J 01:59; D 00:25; M 04:28; S 03:18 |
| **Callback** ("lembra do primeiro canal") | O mesmo material de antes, igual | 4/4 | S 02:09, 12:48; D 09:07 → 13:49; J 04:02, 05:03; M 05:19, 23:37 |
| **Volta do assunto depois de um desvio** (CTA, digressão) | O mesmo visual de antes do desvio | 1/4 | J 05:03 |

### 5.5 Dar peso, humor e respiro

| Função da frase | O que a tela faz | Refs | Prova |
|---|---|---|---|
| **Opinião, conselho, regra, emoção, analogia** | **Rosto puro, nada por cima**, por 14 a 36 s se for preciso | 4/4 | J 10:27 a 11:03; S 04:10, 11:45; D (R1 46%); M 30:07 (só punch-in, sem gráfico) |
| **Frase-chave, provocação, conclusão** | Punch-in | 4/4 | D 00:05, 07:18, 18:05; M 01:12, 25:01; S 00:48 |
| **Aforismo, palavrão, frase de efeito** | Legenda-frase grande, junto com punch-in (e só nesses momentos) | 2/4 | D 00:05, 08:52, 26:16; S 00:48 "100% PROFIT" |
| **Piada sobre si mesmo** | Corte em preto e branco, de preferência no close lateral | 1/4 | M 01:37, 02:25, 07:28 (peso pelo perfil) |
| **Julgamento negativo** | O gráfico vai para a cor de "ruim" da marca | 2/4 | J 00:14, 12:17; D (F no tier board) |
| **Objeção em discurso direto** ("alguém te diz que...") | Chat de duas bolhas, a resposta assinada pelo criador | 1/4 | S 01:51 |
| **"Vou repetir o processo" / acelerar** | Montagem de cortes de ~1 s com música | 1/4 | M 02:50, 11:06, 13:52 |
| **Resultado a revelar** | Escondido antes (pixelado, borrado, "Generating") e mostrado com destaque depois | 2/4 | M 00:43, 30:37 → 30:46; J 01:56 |
| **Tempo avançando** (num experimento) | Cartela de tempo, tag ("NA MANHÃ SEGUINTE"), troca de roupa e cenário | 1/4 | M 19:16, 26:22 |

### 5.6 Chamar para a ação

| Função da frase | O que a tela faz | Refs | Prova |
|---|---|---|---|
| **Link na descrição** | Frase sobre o rosto, embaixo, com gradiente ("Clica no link abaixo") ou faixa com seta para baixo | 3/4 | J 04:59, 13:15; S 09:03; D 09:22 |
| **Material grátis** | Faixa de acento com seta para baixo, sempre igual, a cada vez que é citado | 1/4 | M 08:25, 09:34, 12:22, 16:31, 20:10, 25:49 |
| **Produto ou curso** | Um card por item falado; preço antigo grande vazado, preço novo grande na cor de acento | 1/4 | J 04:23 a 04:59, 13:00 |
| **Comentário** | Card de comentário com o @ do criador ao lado do rosto | 2/4 | M 00:51, 33:01; D 26:25 |
| **Código de desconto** | O código digitado em letra gigante | 1/4 | M 08:09 |

### 5.7 Quando NÃO pôr nada (tão importante quanto o resto)

- **Dinheiro e número de passagem ficam na boca.** Número só ganha tela quando: tem prova (zoom na prova), é o
  ponto da frase (a conta, a comparação final) ou é a **primeira vez** que aparece. Repetição de número já
  mostrado fica no rosto (J 10:27 recita 4 números e a tela não mostra nada; D 07:10, 12:21, 15:33 ficam em R1).
  Isso resolve a aparente contradição entre S (todo número de resultado ganha zoom) e D (dinheiro fica na boca):
  em S o número é sempre prova de painel; em D é estimativa.
- **Marca usada como analogia não ganha logo.** "Como o Airbnb", "tipo Uber": nada na tela. Logo é só para
  ferramenta que o público pode usar (D regra 5, com os contraexemplos de 18:20 e 19:02).
- **Opinião não ganha gráfico** (5.5).
- **Na dúvida, o teste do J:** *esta frase é crucial para o espectador entender?* Se não, rosto. (J 03:02)

---

## 6. Ritmo

| Fase | S | D | J | M | Faixa do modelo |
|---|---|---|---|---|---|
| Primeiro minuto | 13 cortes, layout novo a cada ~4 s | 21 cortes, 9 recursos | 10 cortes + transições, 9 recursos | 16 cortes, 8 recursos | **8 a 9 recursos diferentes em 60 s, um visual novo a cada 3 a 5 s** |
| Corpo | 2 a 5 cortes/min; zoom interno a cada 3 a 6 s | 7 a 16/min (~11) | 7 a 15/min | ~12/min; pesquisa 26 | **7 a 16 trocas por minuto, contando zoom interno**; tela longa nunca parada mais de 6 s |
| Rosto puro mais longo | ~20 s | — | 36 s | — | até 36 s, só em opinião/emoção |
| Fim | 4 cortes de prova e 28 s sem corte | 7 a 12/min | 1 a 4/min | 10 e 3 | desacelera: recap e CTA respiram |

- A cada 1 a 2 min, uma quebra de padrão: piada com punch-in ou P&B, reação, troca de cenário (M).
- Trecho repetitivo vira montagem de 3 a 7 s com música (M).
- O texto respeita o tempo de leitura da casa: **1 s + 3 palavras por segundo**, título antes da ação, nunca
  atravessa corte.

---

## 7. O A-roll e o rosto no canto

- **Grave com folga.** Plano médio com espaço em volta da cabeça: o punch-in vai até ~1,4x e o texto atrás da
  pessoa precisa de parede livre (S). Uma câmera basta (D faz tudo com reenquadramento digital); a segunda,
  lateral e fechada, é opcional para apartes (M).
- **Punch-in** é o principal recurso dentro do A-roll: na frase-chave, na troca de ideia e para esconder o corte
  de um erro. Centralizado no rosto (o `enquadrar.py` da Máquina já segue o rosto).
- **Rosto no canto (R5):** cartão de canto arredondado ou círculo, com sombra, no canto que a tela deixa livre (ele
  troca de canto quando a tela muda: S 01:24 à esquerda, 03:40 à direita; M 04:34 → 04:43 → 05:03). A entrada
  é o rosto cheio encolhendo até virar o cartão (S). O criador precisa gravar a câmera **junto** com a tela.
- **Sem legenda corrida.** Vídeo longo de YouTube não usa (0 de 4). O texto sobre o rosto é palavra-chave,
  título de capítulo ou legenda-frase de efeito. Se o perfil do criador pedir legenda (acessibilidade, público
  no mudo), ela entra discreta e nunca disputa com o R3.

---

## 8. Texto na tela

- **Atrás da pessoa:** só a palavra-título mais forte do trecho (S "WHY NOW?", "UNLIMITED"). Exige o recorte
  da pessoa quadro a quadro.
- **Na frente, terço de baixo:** o complemento, a frase de clique, a pergunta-regra (S 00:06; J 03:02, 04:59).
- **Lateral, com o rosto deslocado:** listas e contas, item a item (M 03:46, 30:52).
- **Tela cheia:** título cinético de capítulo, preço, pergunta de virada (J 02:47; M 24:49).
- Fonte e cor vêm da marca do vídeo (§9). Uma família de texto por vídeo.
- **O texto na tela confere com a fala.** J escreve "12 minutes" onde a fala diz 20 e "sentance" errado; M troca
  "Total costs" por "Total cost". A conferência (§15) pega isso.

---

## 9. A marca do vídeo

Antes do primeiro gráfico, o plano define a marca das explicações. Ela vem do perfil do criador (§12); se ele
não tem, ou se ele pediu identidade nova, entra a identidade própria do modelo (§9.1).

- **Fundo** das explicações (claro ou escuro) e o tema geral.
- **Cartão:** forma, borda, sombra.
- **Uma cor de acento**, mais a cor de "ruim" e a de "bom".
- **Uma família de fonte** para título, texto e número.
- **Um elemento repetido** que costura tudo (no J: esferas e linhas tracejadas laranja).
- **O mesmo conceito volta com a mesma animação** (J 03:47 → 06:21).

Exemplo medido (J, §7 da decupagem): fundo branco gelo, cartões creme de borda laranja fina com brilho difuso,
números grandes em laranja gradiente, rótulo pequeno em caixa-alta espaçada, uma palavra de destaque em itálico
serifado, linhas tracejadas e grifos laranja. O J tem **duas** famílias no mesmo vídeo (a clara nas explicações,
uma escura premium no CTA e nas cartelas): o modelo permite uma segunda família só para a espinha e o CTA, nunca
para as explicações.

---

### 9.1 A identidade própria do modelo: "Gelo, tinta e amarelo" (padrão quando o vídeo não tem marca)

O Jessé recusou trazer a paleta pessoal dele (papel `#F0EEE6` + menta `#7ED9B2`, Geist) para este modelo e pediu
"identidade nova" (2026-10-10). A identidade abaixo saiu do que as referências têm em comum, medida em quadro cheio
(contagem de pixels por cor em `analise/refN_q_full/`), e é o ponto de partida de todo vídeo deste modelo até um
perfil definir outra:

| Papel | Cor | Medida em |
|---|---|---|
| Fundo das explicações (a tela "ideia") | gelo `#F8F8F8` | S 02:59 e J 09:13 (o branco das explicações dos dois é `#F8F8F8`) |
| Texto sobre o gelo e texto ATRÁS da pessoa | tinta `#0A0A0A` | S sobre branco (`#000808`) |
| Texto NA FRENTE da pessoa | branco `#FCFCFC` com sombra suave | J 04:59 "Click the Link Below", D 10:37 rótulo |
| O único acento: a palavra-chave, o fio, o contorno | amarelo `#FCDC00` | M 00:01 "thousands of dollars" e M 21:32 caixa "Editor's note" (ambos `#FCDC00`); J 12:25 pílulas amarelas |
| Ruim | vermelho `#FC0000` | S 00:43, o anel que risca |

- **Fonte:** Inter Tight (uma família só, como pede o §8): 900 nas palavras-título e na palavra-chave, 800 no
  complemento e nos rótulos, 700 na frase de ação. Caixa alta com entreletra apertada (-0,03 a -0,045 em) no R3, como
  o S; frase em caixa baixa só no CTA, como o J. Rótulo de cartão/miniatura: 800, 23 px no 1080, caixa alta, tinta.
- **Entrada do texto:** palavra a palavra na hora em que é dita, com borrão que assenta em 0,2 s (S 02:00, 03:18; J
  02:14). Peças e cartões entram com borrão de movimento (J 00:43, 09:13).
- **Cartões:** canto 22 a 34 px, sombra suave, sem borda (o cartão do rosto do S não tem borda visível).
- **Elemento que costura:** o fio amarelo (debaixo do nome, contorno do "este aqui", seta do CTA).
- **CTA:** degradê escuro na base com a frase de ação em branco (J 04:59) e a palavra-chave gigante em amarelo (M 00:31).

### 9.2 Nota: o modelo no 9:16 (Instagram, Reels, Shorts)

As refs são 16:9. Na 1ª aplicação vertical (vitrine, 2026-10-10) a gramática foi mantida e só a geometria mudou:
- **Lado a lado vira em cima / embaixo:** o R4 e a tela dividida (M 17:43) põem a coisa mostrada em cima e o rosto na
  metade de baixo.
- **Rosto no canto (R5):** cartão de 370x500 no canto inferior direito, com o giro e o borrão de entrada do S; a "tela"
  ocupa os dois terços de cima (grade 3x2 de vídeos 9:16).
- **Texto atrás da pessoa:** o plano vertical deixa só ~180 px de parede acima da cabeça. Cabe uma palavra curta
  (100%, ~250 px) com o cabelo cortando a base das letras, de preferência no plano aberto; nome comprido não cabe atrás
  (a cabeça cobre o meio) e vai na frente, no centro do A-roll, sobre a camiseta (S 03:18 "NICHE").
- **Texto na frente:** a camiseta é o "terço de baixo" do vertical (y 1150 a 1500 no 1080x1920).
- **Página recriada (S 03:24):** o próprio plano encolhe para dentro de uma tela de reels genérica (sem logo).
- **Montagem de exemplos (D 00:43):** cortes de ~0,3 s em tela cheia, porque a fala vertical é mais rápida.

## 10. Som

- **Trilha por baixo o vídeo inteiro** em 3 dos 4: o chão de ruído fica constante entre -33 e -38 dB do começo ao
  fim (S, D, J), o que só acontece com música por baixo da voz. No M a trilha entra e sai por trecho (chão de -40
  a -64 dB, minuto a minuto) e sobe nas montagens aceleradas. [MEDIDO, `analise/refN_som.txt`]
- **Efeito sonoro nos cortes: não medido.** O teste de agudos nos cortes deu o mesmo resultado em instantes
  aleatórios (a voz gera os picos), então não dá para afirmar nada. Ninguém ouviu as referências.
- Proposta de partida, a validar no primeiro vídeo: trilha baixa contínua (voz sempre na frente), troca de trilha
  na virada de capítulo, música em primeiro plano só nas montagens, efeito curto e discreto na entrada de gráfico.

---

## 11. Materiais: o que o modelo faz e o que ele pede

A triagem acontece no plano, frase a frase (coluna "quem fornece" da §4):

- **Sistema:** todo `E`, `C4`, `R2`, `R3`, a montagem do `R4`/`R5`, zoom e grifo sobre as gravações, trilha.
- **Busca:** logo oficial de ferramenta, página pública que prova uma afirmação geral, ilustração gerada para
  metáfora, stock (raro). Sempre com a fonte anotada no `ORIGEM.md` do vídeo.
- **Criador:** gravação de tela da sessão dele, painel e número dele, print do que ele citou, link do vídeo que
  ele comentou, objeto, bastidor, material próprio. Isso vira o **pedido de materiais**: `PEDIDO-modelo.md` tem
  o formato, o tom e a regra do plano B.

Regras invioláveis:
- **Nunca fabricar prova.** Sem o print real, o número vai em texto como afirmação do criador, ou fica no rosto. A
  interface recriada (`E5`) é sempre ilustração assumida: marca inventada ou genérica, sem dado real de terceiro
  (D faz assim: as interfaces de exemplo têm marca inventada).
- **Dado pessoal desfocado** antes de montar (e-mail, telefone, saldo, nome de cliente), e o criador é avisado.
- **Vídeo de terceiro só com o link e o "pode usar" do criador**, trecho curto, fonte na tela.
- **Pessoa real nunca gerada por IA fingindo ser ela.** Encenação com avatar só quando a fala diz que é encenação
  (D 21:12).
- **Profissão regulamentada** (advogado, médico, dentista...): antes do plano, pesquisar as regras atuais de
  publicidade do conselho e seguir.

---

## 12. Autenticidade: o modelo aprende o criador sem perder o resto

Regras completas em `perfis/LEIA.md`; o perfil de cada criador em `perfis/<criador>/PERFIL.md` (modelo em
`perfis/_modelo/`). Em resumo:

- **Três camadas:** o núcleo (este arquivo, muda só pelo dono do sistema), o perfil (cresce com o uso) e o vídeo.
- **O perfil ajusta, nunca apaga:** muda pesos, densidade dentro da faixa, marca visual, peças fixas; pode vetar
  um recurso para aquele criador, mas o recurso continua no catálogo, e nenhuma função fica sem resposta.
- **Não desliga o inegociável:** tempo de leitura, nada de prova fabricada, dado pessoal, conferência.
- **Promoção:** pedido em 1 vídeo vale só nele; repetido em 2 vídeos, ou dito como "sempre/nunca", vai para o perfil;
  nada sobe para o núcleo sem o dono decidir.
- **A semente vem do bruto**, não de suposição: o primeiro vídeo mede ritmo de fala, pausas, energia, bordões,
  cenário.
- **Contra a mesmice:** a conferência compara com os 2 vídeos anteriores do criador.

O que é assinatura de cada referência (cenário, bordão, paleta, humor) está na §7 de cada decupagem: serve de
exemplo de como a autenticidade aparece, **nunca** vira regra daqui.

---

## 13. O fluxo de um vídeo (com portões)

1. **Entrada.** O bruto (A-roll + gravações de tela, se já existirem), o roteiro se houver, o perfil do criador.
   Pasta do vídeo em `conteudo/AAAA-MM-DD-tema/` (projeto Remotion); materiais em
   `materiais/youtubeedition01/AAAA-MM-DD-tema/`.
2. **Transcrição e limpeza.** Whisper + `align.py`; corte de silêncio e de take ruim; o corte que esconde erro
   vira punch-in.
3. **Leitura.** Formato-base (§2), capítulos, espinha (§3), o laço aberto e onde ele é pago, onde entram os CTAs.
4. **Mapa de momentos** (`plano.md`): uma linha por frase com hora, função (§5), recurso, quem fornece e o texto
   que vai na tela. Checagem de ritmo (§6) e do "quando não pôr nada" (§5.7).
5. **Pedido de materiais** (§11). O vídeo não espera: o que é do sistema já começa.
6. **Portão 1, a marca e os quadros-chave.** Mockup de 6 a 10 quadros (a espinha, uma explicação, uma prova com o
   rosto no canto, um R3, o CTA) na marca do vídeo. Ninguém anima antes do OK.
7. **Montagem** no Remotion: A-roll cortado, as peças do catálogo presas às palavras, o rosto no canto, a trilha.
8. **Portão 2, a prévia.** Folha de contato do vídeo inteiro e os momentos-chave em tamanho real.
9. **Conferência** (§15) e render.
10. **Diário.** O que o criador pediu, aprovou e recusou vai para o `PERFIL.md` dele, pela régua de promoção.

---

## 14. Produção com o que a casa tem

| Precisa | Ferramenta | Estado |
|---|---|---|
| Transcrição palavra a palavra | `projetos/maquina-de-conteudo/tools/transcribe.py` + `align.py` | pronto |
| Punch-in e câmera seguindo o rosto | `enquadrar.py` (YuNet) | pronto |
| Recorte da pessoa para texto atrás (R3) | modelo RVM em `maquina-de-conteudo/tools/modelos/rvm_mobilenetv3_fp32.onnx` | o modelo existe; falta o script que gera a máscara quadro a quadro |
| Apagar dado pessoal ou marca d'água | `inpaint_lama.py`, desfoque no Remotion | pronto |
| Logo oficial e foto aberta | `estudio-2d/kit/buscar.py` | pronto |
| Ilustração de metáfora | `kit/gerar.py` (kie.ai) | pronto, com gasto |
| Trilha e efeito | `kit/audio_ia.py` (ElevenLabs) | pronto, com gasto |
| Gravar navegação em site público | navegador automatizado (playwright) | conexão disponível |
| Peças do catálogo (espinhas, R3, R4, R5, E1 a E5, C4) | Remotion | primeira versão em `conteudo/2026-10-10-youtubeedition01-apresentacao/src/` (Camera.tsx e Pecas.tsx); viram componentes reaproveitáveis e, depois, o pacote do modelo |

---

## 15. Conferência antes de entregar

- [ ] Cada frase do `plano.md` tem função e decisão (inclusive "nada").
- [ ] Primeiro minuto com 8 a 9 recursos; nenhuma tela parada mais de 6 s no corpo.
- [ ] Todo dêitico mostra a coisa no mesmo segundo; todo passo de tutorial mostra o passo.
- [ ] Nenhuma prova fabricada; cada `E5` é ilustração assumida; cada fonte no `ORIGEM.md`.
- [ ] Nenhum dado pessoal visível nas gravações e prints.
- [ ] O texto na tela bate com a fala (número, nome, grafia) e fica 1 s + 3 palavras/s.
- [ ] A espinha avança certo (o item, a fase, o dia) e a posição obedece à fala.
- [ ] O laço aberto do gancho é pago no fim.
- [ ] O rosto no canto nunca cobre o que está sendo mostrado.
- [ ] Marca do vídeo consistente: uma família nas explicações, o mesmo conceito com a mesma animação.
- [ ] Checagem de variedade contra os 2 vídeos anteriores do criador.
- [ ] Texto público que acompanha o vídeo (título, descrição) passou pelo `/humanizer`.

---

## 16. Aplicações

| Vídeo | Formato | Saída |
|---|---|---|
| Apresentação do modelo (1 min, 16:9, fala improvisada pelo Jessé; pode virar criativo impulsionado) | vitrine curta, espinha = barra de tempo | `conteudo/2026-10-10-youtubeedition01-apresentacao/out/youtubeedition01-apresentacao.mp4` (RECUSADA: "parece que você criou outro") |
| Vitrine dos modelos (30 s, 9:16, Instagram) | A. método com a tela, espinha = título-capítulo; identidade §9.1 | `conteudo/2026-10-10-vitrine-modelos/youtubeedition01/out/vitrine-youtubeedition01-sem-previas.mp4` (aguardando o Jessé) |

A versão longa da apresentação (~4:45) fica de reserva em `apresentacao/roteiro.md`.

### O que a 1ª aplicação ensinou (2026-10-10, ainda sem o olho do Jessé)

- **O criador improvisa.** O plano feito sobre o roteiro serviu de direção, mas a decisão frase a frase teve que ser
  refeita sobre a transcrição da fala real. O fluxo §13 já previa: o passo 4 roda sobre a transcrição, nunca só sobre o roteiro.
- **Vídeo curto também precisa de espinha.** Sem capítulos, a espinha virou a barra de tempo no topo, nascida na frase
  "gravar apenas um minuto". Toda duração tem um mapa possível.
- **O tempo de leitura derruba cortes.** Três textos ficavam menos de 1 s + 3 palavras/s porque um corte seco os
  encurtava; a solução foi tirar o corte (a pose segue até o próximo punch-in), não acelerar o texto.
- **Nada atravessa corte seco**, nem por 0,05 s: a conferência precisa listar as trocas secas da câmera e as saídas
  de cada peça e comparar (dois casos achados assim).
- **Peça só aparece depois da entrada.** Peças com mola começavam visíveis no quadro 0; toda peça precisa de
  `t >= t0` explícito (achado na prévia, antes do render final).
- **O Whisper inventa palavra em trecho rápido** ("eu vou colocar" em 26 s): conferir transcrevendo o trecho sozinho.
- **Trilha sintetizada fica baixa se normalizada pelo pico:** saiu a -40 LUFS (25 dB abaixo da voz). Alvo medido na
  mixagem: ~16 dB abaixo da voz.
- **Microfone na frente do queixo** inviabiliza o texto atrás da pessoa (o recorte erra): virou traço do perfil, não regra.

### O que a 2ª aplicação ensinou (vitrine 9:16, 2026-10-10, ainda sem o olho do Jessé)

- **A recusa da 1ª foi de linguagem, não de capricho.** A apresentação respondia às frases com cartõezinhos de
  interface (selo, cartão de seguir, caixa de comentário, mono pequeno) na paleta do perfil: nenhuma referência faz
  isso. As refs respondem com **tipografia grande sobre o A-roll** (R3 atrás e na frente), **tela cheia de gelo** com
  a coisa real em cima e o rosto no canto, e **corte de plano** (punch-in). A 2ª trocou os cartões por isso.
- **Conferir com a folha lado a lado antes de animar o resto:** cada recurso do plano ganhou um quadro de referência
  correspondente (`conferencia/lado-a-lado.png` da vitrine); o que não achava par nas refs saiu.
- **A coisa real de um vídeo sobre modelos são os próprios vídeos**, tocando no mesmo segundo da fala (a mesma
  gravação em seis edições): prova sem fabricar nada.
- **Texto atrás no vertical:** cabe uma palavra curta no plano aberto; o nome comprido foi para a frente (§9.2).
- **Tempo de leitura e trilha:** com o texto preso a blocos que nascem e morrem em corte, todos os 8 blocos passaram
  em 1 s + 3 palavras/s (`scripts/tempos.py`); a trilha sintetizada a -3,5 dB com ducking ficou ~16 dB abaixo da voz.

## 17. Em aberto

- O som das referências não foi ouvido: efeito sonoro, transições finas e a curva dos movimentos ficam para
  calibrar no primeiro vídeo.
- As peças do catálogo existem só no projeto da apresentação (`conteudo/2026-10-10-youtubeedition01-apresentacao/src/`): câmera em janela, abertura com número, barra de tempo, nome no terço de baixo, grade, elemento que cai, celular flutuante, tela dividida, gravação com rosto no canto, frase com marca-texto, seguir, comentário com palavra-chave. Viram componentes reaproveitáveis no próximo vídeo. Na identidade §9.1 e no 9:16, as peças estão em `conteudo/2026-10-10-vitrine-modelos/youtubeedition01/src/` (Camera.tsx com o giro do cartão e o texto atrás com `pessoa.webm`; Video.tsx com R3 atrás e na frente, grade de vídeos reais, montagem, tela de reels genérica, prévias em cima, CTA com degradê): é dali que o próximo vídeo deste modelo parte, se o Jessé aprovar.
- O script de recorte da pessoa (RVM) para o texto atrás.
- Pacote no motor da Máquina: só depois de o dono aprovar o primeiro vídeo e pedir.

## Validação do vertical (2026-10-12, Jessé)

A versão 9:16 da vitrine (`conteudo/2026-10-10-vitrine-modelos/youtubeedition01/`) foi aprovada como está ("ficou perfeito no 9:16"). Ficam como regra para as próximas aplicações, sem refazer a da vitrine:
- **Música é opcional**, escolha do usuário; padrão desligada.
- **Não escrever o nome do modelo na tela** quando a fala menciona "este modelo".
- **9:16 dinâmico pede legenda corrida opcional** numa boa posição de leitura (altura do peito, dentro da zona segura das redes), porque a maioria assiste vídeo curto com legenda. Padrão: oferecer ao usuário; no 16:9 de YouTube o modelo segue sem legenda corrida, como as referências.
- O modelo continua sendo de 16:9; o vertical é adaptação, não o uso principal.
