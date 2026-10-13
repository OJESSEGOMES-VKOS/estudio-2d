# superpodcast01: corte de podcast documental, montado palavra por palavra

Criado em 2026-10-10 a partir de 3 Reels 9:16 do mesmo canal de entrevistas (origem em `referencias/ORIGEM.txt`).
Uma 4ª referência era cópia idêntica da ref1 e foi removida.

| Ref | Duração | O que é | Decupagem |
|---|---|---|---|
| ref1 | 38,5 s | Robert Greene: "reputation is capital", com Musk e Tesla de exemplo. A versão **documental**: 35 cortes, B-roll, colagem | `analise/ref1_decupagem.md` |
| ref2 | 32,2 s | Dan Koe: focar na vida que você não quer. A versão **calma**: 10 planos, sem B-roll, lista numerada | `analise/ref2_decupagem.md` |
| ref3 | 55,1 s | Ronnie Fieg (Kith): trailer de episódio. A versão **trailer**: pergunta-gancho, nome em cartela, narração com rajada de provas, logo | `analise/ref3_decupagem.md` |

Quadros cheios medidos em `analise/refN_q/`; linhas do tempo a 2 qps em `analise/refN_tl_NN.png`.

---

## 1. A ideia central

Um trecho de conversa vira um **minidocumentário**: cada frase ganha a imagem do que está sendo dito, e a
palavra que carrega a frase aparece **gigante, em serifa itálica vermelha que acende letra por letra**.
- A tela pula entre quatro mundos: o **palco** (plano aberto do set escuro, onde moram as teses), o **rosto** de
  quem fala, o **papel** (colagem de fotos e prints sobre fundo claro) e o **arquivo** (B-roll em tela cheia).
- O texto se monta **no tempo da fala**, palavra por palavra, sempre no lugar final. As palavras comuns são
  pequenas e brancas; a palavra-chave domina a largura do quadro.
- O visual é frio e escuro: preto de estúdio, branco aceso, um único vermelho. Nada de cor quente, nada de segunda
  cor de destaque.
- O vídeo abre com a tese no palco e, quando dá, fecha repetindo a mesma palavra (ref1: "Reputation is capital" →
  "…was capital").

## 2. Que tipo de trecho funciona

Funciona:
- **Tese com exemplo concreto** (ref1): uma afirmação curta ("reputação é capital") seguida de um caso com nomes,
  marcas, lugares e objetos. Cada substantivo concreto vira imagem, e é isso que dá o ritmo documental.
- **Instrução ou reflexão** (ref2): um conselho com passos ou perguntas em série. Sem nomes para mostrar, o estilo
  fica calmo: palco, lista numerada e rosto.
- **Apresentação de alguém ou de um projeto** (ref3): pergunta-gancho, resposta curta e forte, quem é a pessoa,
  provas em rajada, frase-lema, frase cortada no meio.
- Frases curtas e declarativas, com a palavra forte no fim. Duração de 30 a 60 s.

Não funciona (ou pede outro modelo):
- Fala longa e abstrata sem nenhum substantivo concreto, por mais de 15 s: sem B-roll possível, vira só rosto e
  legenda e perde o estilo.
- Humor de reação e troca rápida entre duas pessoas: o estilo é de **uma voz** por trecho.
- Tutorial de tela: as gravações de tela brigam com o papel e o palco (use o youtubeedition01).

## 3. Os quatro mundos (o layout)

| Mundo | Como é (medido) | Para quê | Parte do tempo (ref1) |
|---|---|---|---|
| **Palco** | plano aberto do set: mesa clara a ~53–57% H sob um foco, pessoas pequenas (rosto ~3% H) nos lados, chão claro em elipse, parede quase preta (#0A0C0C no alto, #19191E no chão; ref2 mais aço, #3D4553). Na ref2, faixas pretas de ~6% em cima e embaixo só nesse plano | tese da abertura, fim de frase de impacto, lista numerada, fecho | 25% |
| **Rosto** | close com rosto de 26–28% H (ref1) ou plano médio com 14–15% H (ref2, ref3), falante um pouco à direita (x 52–60%), microfone escuro em primeiro plano à esquerda, fundo cinza-azulado escuro (#131A1E; #3A4250 na ref2), luz lateral dura | o miolo da fala, o terço inferior | 31% |
| **Papel** | fundo claro com vinheta forte (#EFEAE7 no centro, #7E7C7A nos cantos); fotos e prints sem moldura, espalhados, de tamanhos variados, com franja fina laranja/azul na borda e sombra curta | época, vários exemplos, rede social, imprensa | 44% junto com o arquivo |
| **Arquivo** | B-roll em tela cheia, sem moldura, com vinheta e bordas levemente desfocadas; fundo branco puro (#FFFFFF) para logo e ilustração | o objeto, o lugar, a marca, a pessoa citada | (idem) |

Elementos que aparecem sobre os mundos:
- **Terço inferior** (rosto, 1ª aparição do falante): traço vertical vermelho de ~1% W por ~10,7% H, com brilho
  vermelho; à direita (~30 px), o nome em mono caixa alta espaçada (desenho 1,7–1,8% H) e uma 2ª linha em mono
  menor (1,0–1,3% H). Posição: traço em x 14–21% W, bloco entre 44% e 57% H, ao lado do microfone. Entra com as
  letras embaralhando até assentar (~0,5 s) e fica ~5 s.
- **Lista numerada** (palco, ref2): grotesca negrito, desenho 1,6% H por linha, entrelinha ~34 px, alinhada à
  esquerda em x 11% W, bloco entre 33% e 44% H; o trecho que nega ("not want", "not enough") em vermelho.
- **Tela dividida** (ref2 21,1): palco em cima (31% H), close embaixo, divisa reta sem borda.
- **Caixa de marca** (ref3 0,8): o nome da marca dentro da frase, em caixa branca com letra preta, da altura da
  linha (3,4% H).
- **Cartela de nome** (ref3 8,4): silhueta da pessoa no centro e o nome dividido dos dois lados, grotesca negrito
  vermelha caixa alta espaçada (2,3–2,4% H), y 47% H, com brilho.
- **Traço de caneta** (ref1 16,8): linha vermelha fina que se desenha sobre uma foto em ~0,3 s.

## 4. A receita da tipografia (medida)

Quadro de referência 720x1280 (H = 1280). Medidas = altura desenhada da palavra; o corpo da fonte vem entre
parênteses. Em 1080x1920 multiplique os px por 1,5.

| Voz | Tamanho | Fonte aproximada | Cor | Onde |
|---|---|---|---|---|
| **Palavra-chave gigante** | desenho 7–11% H (corpo ~8 a ~11,5% H); a palavra ocupa **60–83% da largura**; palavra longa encolhe até caber ("pronouncements." 3,9% H) | serifa didone itálica de alto contraste, peso preto: **Playfair Display Black Italic** | vermelho sinal #E0030A (2/3 dos casos); branco #FBFAFB para nome de pessoa e sobre fundo vermelho; tinta #0B0A0F sobre o papel | centro em x ~50%, y 42–64% H; no palco, 40–50% H |
| **Palavra-chave na linha** (ref3) | do tamanho da linha a ~1,3x (desenho 3,1–4,5% H) | a mesma serifa | vermelho | no lugar dela dentro da frase |
| **Palavras pequenas** (modo conversa) | desenho 2,3–3,1% H (corpo ~3,2–3,8% H, ~45 px em 1280) | grotesca seminegrito de espaço apertado: **Inter SemiBold**, entreletra -2% | branco com brilho fraco; sobre o papel, tinta #0B0A0F ou petróleo #09222F com brilho claro | linha colada acima ou abaixo da palavra-chave |
| **Palavra média** | desenho 4–7% H | Inter Bold | vermelho (marca, resposta de uma palavra) ou branco | quando a ênfase não pede serifa |
| **Linha fina** (ref2) | desenho ~2,6% H | **Inter Regular** | branco com brilho | abaixo da palavra-chave no palco |
| **Legenda simples** (modo narração e closes calmos) | desenho 1,8–2,3% H (corpo ~2,4% H, ~30 px em 1280) | Inter Bold | branco #FDFEFF, sombra curta | centrada, **y 64% H**, 2 a 6 palavras, troca inteira |
| **Terço inferior** | nome: desenho 1,7–1,8% H (corpo ~2,5% H); 2ª linha 1,0–1,3% H | mono: **JetBrains Mono Regular** | branco; traço vermelho com brilho | ver §3 |

**Brilho:** toda palavra tem halo da própria cor. O vermelho espalha ~50 px (4% H) além da letra, com ~40% de
força junto da letra; o branco tem halo curto, só para a letra parecer acesa.

**Linha pequena espaçada:** em 4 casos da ref1 a linha pequena tem um vão no meio ("Look … at", "in that case …
was"): as palavras se distribuem ao longo da largura da palavra-chave. Nos outros, a linha é corrida e começa na
borda esquerda da palavra-chave. As duas formas valem; o vão nunca é por acaso, é o lugar já reservado.

## 5. Regras da legenda

1. **Dois modos, nunca misturados no mesmo plano.**
   - **Modo conversa** (a pessoa falando o que pensa): o texto se monta palavra por palavra no lugar final, em 1 ou
     2 linhas, e a frase fica inteira até trocar de plano ou de frase. Uma palavra-chave por frase.
   - **Modo narração / calmo** (contexto, apresentação, trecho de transição): legenda simples centrada em y 64% H,
     troca inteira a cada 2 a 6 palavras, sem palavra-chave. Na ref2 os closes ficam todos neste modo.
2. **A palavra-chave é uma por frase** (no máximo duas, como "cut… cloth."). É o substantivo, adjetivo ou verbo que
   carrega a ideia, e de preferência a **última palavra da frase, com o ponto dentro dela** ("precarious.",
   "scratch.", "zero.", "die."). Nunca palavra de ligação. Nome de pessoa vira serifa **branca**; marca vira
   grotesca vermelha ou caixa branca; negação na lista vira vermelho.
3. **Entrada da palavra comum:** nasce no lugar, sem deslizar, num fade com desfoque de 4–5 quadros (~0,15 s), ou
   no "acende" da ref3: nasce com ~40% de opacidade (às vezes tingida de vermelho-escuro) e vai ao branco em
   0,3–0,5 s. Um jeito por vídeo.
4. **Entrada da palavra-chave serifada:** letra por letra, da esquerda para a direita, cada letra saindo de um borrão
   vermelho para nítida em ~3 quadros; a palavra inteira em **0,33–0,47 s**, começando na sílaba tônica falada.
5. **Layout calculado antes:** o bloco final é medido com a fonte real antes de a primeira palavra entrar, e as
   palavras só aparecem nos lugares já reservados. Nenhuma palavra empurra outra (regra da casa: sem refluxo).
6. **Lugar:** sempre no espaço livre e abaixo do queixo medido no rosto (peito, 55–65% H); no palco, na parede
   escura acima das cabeças (35–50% H); no papel, numa faixa livre entre as fotos.
7. **Máximo na tela:** 6 a 8 palavras pequenas + a palavra-chave.
8. **A tela mostra as palavras ditas.** Pode cortar palavra vazia ("that you" sumiu na ref2), nunca reescrever nem
   resumir com palavras que a pessoa não disse (a ref2 juntou duas perguntas numa linha: aqui não).

## 6. Os gatilhos: que palavra chama o quê

| Quando a fala… | A tela faz | Prova |
|---|---|---|
| diz a **tese** do vídeo (1ª frase) | palco + palavra-chave gigante, já no 1º quadro | ref1 0,0; ref2 0,3 |
| fecha uma **frase de impacto** | volta ao palco com a palavra-chave | ref1 12,1 / 23,4 / 35,5; ref3 23,5 / 28,7 / 40,2 |
| nomeia uma **pessoa** | corta para a pessoa e o nome entra em serifa branca | ref1 1,6 |
| nomeia uma **marca** | o logo dela em close (no papel ou no branco) ou a caixa branca dentro da frase | ref1 4,2; ref3 0,8 / 11,9 |
| fala de **época ou de vários exemplos** ("early years", "always in the news") | colagem no papel, uma foto por palavra, e a câmera avança até o item principal | ref1 2,6 / 27,0 |
| fala de **rede social ou imprensa** | colagem de prints: um card pequeno cresce no centro e explode em vários | ref1 25,2 |
| diz um **objeto ou ação concreta** | B-roll curto do objeto, legenda pequena | ref1 4,7 / 19,0 |
| fala de **dinheiro, mercado, escala** | rajada de B-roll (planos de 0,13–0,7 s) | ref1 9,8 |
| **lista nomes** ("BMW, Nike, Armani") | um plano por nome, uma palavra por plano | ref3 20,1 |
| faz **perguntas em série** ou passos | lista numerada no palco, cada item no tempo dele | ref2 8,0 |
| diz **"influente", "o maior", "15 anos"** (escala) | rajada de fotos, 3 por segundo | ref3 13,4 |
| fala da pessoa **no passado** | foto de época com traço de caneta vermelho | ref1 16,5 |
| a pessoa aparece **pela 1ª vez** | terço inferior com nome e credencial ou @ | ref1 7,4; ref2 3,0 |
| a pessoa é **apresentada** (quem ela é) | silhueta + nome em vermelho dividido, entre vazamentos | ref3 8,4 |
| **muda de bloco** (do exemplo para a conclusão, do rosto para o arquivo) | vazamento de luz vermelho → âmbar → branco | ref1 25,1 / 30,1; ref3 8,1 |
| vira para a **conclusão** ("So if you can master…") | tela dividida palco + close | ref2 21,1 |
| deixa uma **frase no ar** ("but…") | flash branco e cartela final | ref3 48,4 |
| **pede comentário** | o terço inferior vira a chamada com as palavras dela | ref2 30,0 |

**Quando não pôr nada:** no miolo do rosto entre duas palavras-chave, só as palavras pequenas. Nenhum elemento
gráfico extra (selo, ícone, emoji, seta) aparece em nenhuma referência.

## 7. Ritmo

Três velocidades, escolhidas pelo trecho:

| Velocidade | Trocas de plano | Rajada | Maior plano parado | Exemplo |
|---|---|---|---|---|
| **Calma** | 1 a cada ~3,2 s | nenhuma | 8,1 s (lista no palco) | ref2 |
| **Documental** | 0,9 por segundo (mediana 0,68 s) | 2 a 7 trocas por segundo no B-roll | 3,0 s | ref1 |
| **Trailer** | ~1 por segundo | 3/s nas fotos; ~15/s nos borrões | 3,0 s | ref3 |

- Em todas, **o texto muda a cada palavra**: nenhum segundo parado de verdade.
- Abertura sem respiro: a tese entra no 1º quadro (ref1) ou depois de um vazamento de 0,3 s (ref2).

## 8. Transições

- **Corte seco** é a regra.
- **Vazamento de luz** marca troca de bloco, 1 a 3 por vídeo: uma onda vermelha (#BD2027) sobe ou varre na
  diagonal em 2–3 quadros, vira âmbar (#FDD48B), amarelo (#FEE87B) e um quadro branco estourado, e revela o plano
  novo (~0,3 s no total).
- **Flash branco** antes da cartela final (ref3).
- **Chicote leve**: o 1º quadro de um B-roll vem borrado na horizontal (ref1 6,6).
- **Rajada de borrões** como textura de "arquivo / folhear" (ref3 33,6).
- Nada de VHS, glitch, deslize ou cortina.

## 9. Som

- Trilha contínua por baixo da voz nas três (o chão não cai nas pausas: -19,9 dB numa pausa da ref1).
- Batida alta junto do vazamento de abertura (ref2: pico -1,3 dB nos primeiros 0,6 s) e música alta sob a cartela
  final (ref3: -16,3 dB sem fala).
- Não ouvi o tipo de trilha nem confirmei efeitos nos cortes: calibrar no primeiro vídeo.
- Na casa: trilha ~16 dB abaixo da voz (medido no youtubeedition01), batida curta no vazamento.

## 10. Assinatura dos criadores originais (não vira regra)

- O canal de origem: o nome dele no terço inferior ("Full Conversation on YouTube"), a cartela do logo no fim e o
  preto mudo depois dela.
- O set: mesa clara ou de madeira sob o foco no estúdio preto, as cadeiras, a câmera no tripé em primeiro plano.
- A chamada "COMMENT "NOME" FOR FULL EPISODE" com o nome do convidado.
- Os assuntos (Musk, Tesla, Kith) e todo o material de arquivo deles.
- O formato de trailer com narrador (ref3) é uma estrutura do canal, não regra do modelo.

## 11. A identidade visual própria do modelo: "Palco Escuro"

Tirada das referências. Não é a paleta do dono nem do cliente; só muda se o perfil do criador disser outra coisa.

| Token | Hex | Uso |
|---|---|---|
| `breu` | #0A0C0C | parede do palco, fundo de cartela |
| `chao` | #19191E | chão do palco, base escura |
| `estudio` | #131A1E | fundo atrás do rosto (alvo da correção de cor) |
| `aco` | #3A4250 | variante calma (fundo do rosto e parede do palco na velocidade calma) |
| `branco` | #FBFAFB | todo texto em fundo escuro |
| `sinal` | #E0030A | palavra-chave, traço do terço inferior, negação, nome em cartela; o único acento |
| `papel` | #EFEAE7 → `papel-borda` #7E7C7A | colagem (centro → cantos) |
| `tinta` | #0B0A0F; `petroleo` #09222F | texto sobre o papel |
| `vazamento` | #BD2027 → #FDD48B → #FEE87B → branco | troca de bloco |

- **Fontes:** Playfair Display Black Italic (palavra-chave), Inter SemiBold / Bold / Regular (texto), JetBrains Mono
  Regular (terço inferior). As três são abertas (Google Fonts).
- **Correção de cor:** fria e neutra, pretos fundos, vinheta forte, nada de âmbar. B-roll com vinheta, borda
  levemente desfocada e franja de aberração cromática fina nas fotos do papel.
- **Uma cor de destaque só.** A ref2 tem um vermelho mais coral (#ED4053, #FE4E61); o modelo fica com o `sinal`.

## 12. O que o superpodcast01 tem de diferente

**Do modelodinamico03** (corte de podcast cinematográfico):
| | modelodinamico03 | superpodcast01 |
|---|---|---|
| Cor | quente: âmbar e marrom, grão | fria: preto de estúdio, branco aceso, um vermelho |
| Plano | longo, 3 a 6 s; quem dá o ritmo é o texto | curto, mediana 0,68 s na versão documental; quem dá o ritmo é a imagem do que é dito |
| Imagem | o podcast quase o tempo todo; arquivo P&B flutuando ao lado da pessoa | quatro mundos: palco, rosto, **papel** (colagem clara) e **arquivo em tela cheia** |
| Tipografia | bloco de **3 vozes** (sans apertada + serifa fina + condensada caixa alta enorme) | **2 vozes**: grotesca pequena + **uma** serifa itálica preta gigante; mono só no terço inferior; nada de condensada |
| Palavra-chave | carimbo vermelho atrás do bloco, risco de caneta na negação | acende **letra por letra** saindo do borrão, com halo; ocupa 60–83% da largura |
| Transição | textura sempre: desfoque, VHS, flash, chicote | corte seco; vazamento de luz só na troca de bloco |
| Elementos | círculo vermelho com número que conta | terço inferior mono com letras embaralhadas, lista numerada, caixa de marca, cartela de nome |
| Fecho | cartela "Comente NOME" | repete a palavra da tese (ref1) ou flash + logo (ref3) |

**Do storypodcast01** (corte de podcast com legenda editorial azul e vermelha em close escuro): o storypodcast
fica no close e trabalha a legenda com duas cores de destaque; o superpodcast01 **sai do rosto** sempre que a fala
dá um substantivo concreto (palco, colagem, arquivo), tem **um único vermelho** e nenhum azul, e a palavra-chave
não é legenda grifada: é um letreiro gigante que domina a largura.

## 13. Como produzir com o que a casa tem

### O fluxo
1. **Entrada:** a gravação. Da raiz do estúdio, `.venv/Scripts/python.exe tools/novo-video.py superpodcast01
   <gravação> <AAAA-MM-DD-tema>` cria a pasta do vídeo `videos/<AAAA-MM-DD-tema>/` (o projeto Remotion, cópia de
   `moldes/superpodcast01/`) com o contrato: `public/fala.mp4`, `public/voz.wav`, `src/palavras.json` e
   `src/rosto.json`. O material do vídeo (fotos, prints, B-roll seu) mora em `public/` dessa pasta. O passo a passo é o
   "Vídeo novo" do `LEIA.md` do molde.
2. **Transcrição:** já vem do `novo-video.py` (palavras com tempo). Confira de ouvido o trecho rápido e corrija a grafia
   (nomes, números) antes do plano. O plano roda **sobre a transcrição da fala real**, não sobre roteiro (o criador
   improvisa).
3. **Plano (`plano.md`):** uma linha por frase com hora, mundo (palco, rosto, papel, arquivo), palavra-chave, modo
   da legenda, gatilho da §6 e quem fornece a imagem. Escolher a velocidade (§7).
4. **Pedido de materiais** (abaixo). O vídeo não espera: o que é do sistema começa.
5. **Portão 1:** 6 a 8 quadros-chave (o palco com a tese, um rosto com terço inferior, uma palavra-chave gigante,
   uma colagem, um B-roll com palavra-chave, o fecho). Ninguém anima antes do OK.
6. **Montagem no Remotion**, prévia (folha de contato + momentos-chave em tamanho real), conferência (§14), render.

### As peças no Remotion (prontas no molde, `moldes/superpodcast01/src/Reel.tsx`)
A palavra-chave (`PalavraK`: letra por letra do borrão, halo, ajuste à largura de 60–83%), a linha pequena (`PalavraP`,
fade com desfoque, com a caixa de marca branca), o terço inferior (`TercoView`: mono, letras embaralhando, traço com
brilho), a colagem, os celulares e os prints do papel (`ColagemModelos`, `RedeSocial`, `ColagemEdicao`, com os cards de
`src/cards.json`), o `Vazamento` (onda vermelha → âmbar → branco), o `Palco` (a foto `public/palco.png` ou o palco
desenhado), o arquivo (`Arquivo`), a tela dividida com as prévias (`Dividida`, `PreviasEmCima`) e o rosto graduado
(`Gravacao`, com o `scripts/grade.py`). Fontes pelo `@remotion/google-fonts`; correção de cor e vinheta no grade e por
filtro CSS. Ainda não estão no molde: a lista numerada, a cartela de nome e o traço de caneta; quando a fala pedir,
desenhe no mesmo estilo (Inter SemiBold, um vermelho só).

### Quem fornece o quê
| Precisa | Quem | Como |
|---|---|---|
| O **palco**: plano aberto do set, com a pessoa pequena | **criador** | gravar 10–20 s: sentado a uma mesa, num cômodo escuro, uma luz só por cima ou de lado, mesma roupa, olhando para o lado como numa conversa (o pedido explica com um quadro da ref1). Sem isso, o molde desenha o palco escuro (padrão, sem IA) |
| Os closes | criador | a própria gravação; dois enquadramentos saem dela por recorte (1,0 e ~1,3) |
| Nome e credencial ou @ | criador | texto do terço inferior |
| Prints, fotos e gravações **dele** (o que ele citou, os números dele, o trabalho dele) | criador | entra no papel ou no arquivo |
| Foto real de pessoa pública, lugar, objeto, logo oficial | **sistema** | `kit/buscar.py "<termo>" <pasta> --n 8` (Wikimedia Commons e Openverse, licença aberta, fonte no `ORIGEM.md`), escolher pela folha |
| Recorte de objeto ou pessoa para o papel | sistema | `kit/recortar.py` |
| Cenário, objeto ou metáfora sem pessoa real | criador ou sistema | foto do criador ou com licença aberta (`kit/buscar.py`); gerado por IA (`kit/gerar.py`, chave própria) só se o usuário ligar |
| Clipe curto de atmosfera para a rajada (fábrica, cidade, mesa) | criador | B-roll dele; gerado por IA (`kit/video.py`, chave própria) só se o usuário ligar, nunca pessoa real, nunca no lugar de um fato |
| Palco **vazio** de reserva (mesa clara sob foco em estúdio preto, sem ninguém) | sistema | o molde desenha (padrão, sem IA); a foto gerada por IA (`kit/gerar.py`) em `public/palco.png` é opção do usuário |
| Trilha e batida | sistema | `scripts/trilha.py` do molde (sintetizada): as batidas saem por padrão, a música é opção |
| Câmera seguindo o rosto, punch-in | sistema | `tools/enquadrar.py` |

### Material de terceiro
- Nas referências, foto e vídeo de terceiros (Musk, Tesla, NYSE, tweets, manchetes, campanhas com famosos) entram
  livres. **Aqui não.** O sistema busca imagem com licença aberta; o que for de terceiro sem licença (manchete,
  print de rede social, trecho de telejornal, foto de campanha) só entra como **citação**: o criador manda o link,
  fica pequeno e no tempo do comentário, com a fonte visível, e nunca vira tapete de B-roll.
- O que não der para conseguir vira `PEDIDO.md` na pasta do vídeo (`videos/<AAAA-MM-DD-tema>/`), com o quadro da
  referência que mostra o que é preciso e o plano B (o palco vazio, a palavra-chave sobre o rosto).
- Pessoa real nunca gerada por IA. Dado pessoal desfocado antes de montar.

### Regras da casa que mudam o que as referências fazem
- **Texto não atravessa corte seco** (nas referências atravessa, nas rajadas de B-roll). Aqui, numa rajada, cada
  plano carrega só a palavra dita nele (como a ref3 faz com "BMW," "Nike,"), e a frase com palavra-chave fica num
  plano que dura a frase inteira.
- **Tempo de leitura:** o bloco fica pelo menos 1 s + 3 palavras/s contado da primeira palavra; a palavra-chave
  completa fica pelo menos 0,8 s (a ref1 chega a 0,44 s no fim; aqui não), e a última tela do vídeo segura 1,5 s.
- **Peça só aparece depois da entrada:** toda peça com `t >= t0` explícito.
- **Chamada só com as palavras dele:** o terço inferior de chamada só existe se ele disser a chamada.

## 14. Conferência antes de entregar

- [ ] Cada frase do `plano.md` tem mundo, modo de legenda e decisão (inclusive "só palavras pequenas").
- [ ] Uma palavra-chave por frase (no máximo duas), nunca palavra de ligação; o texto na tela bate com a fala
      (grafia, número, nome) e não tem palavra que ele não disse.
- [ ] Palavra-chave serifada entre 60% e 83% da largura, letra por letra em 0,33–0,47 s, com halo vermelho.
- [ ] Nenhuma palavra muda de lugar depois de aparecer.
- [ ] Texto abaixo do queixo medido no rosto; nada na faixa de baixo do Reels nem fora da área segura.
- [ ] Lista de trocas secas comparada com a saída de cada texto: nada atravessa corte.
- [ ] Tempos de leitura da §13 conferidos por script (`scripts/sincronia.mjs`).
- [ ] Um único vermelho (`sinal`), nenhuma outra cor de destaque; correção de cor fria, sem âmbar.
- [ ] Vazamento de luz só nas trocas de bloco (1 a 3 no vídeo).
- [ ] Toda imagem de fora com fonte e licença no `ORIGEM.md`; terceiro sem licença só como citação, com fonte na tela.
- [ ] Trilha ~16 dB abaixo da voz, medida na mixagem.
- [ ] Trecho rápido da transcrição conferido de ouvido (o Whisper inventa palavra em fala rápida).
- [ ] Texto público que acompanha o vídeo (legenda do post) passou pelo `/humanizer`.

## 15. Como aplicar no vídeo-teste comum

O dono grava um vídeo de ~30 s (roteiro em `../../teste-comum/ROTEIRO.md`), ele sozinho falando para a câmera, que vai ser editado em todos os modelos. As
diferenças para as referências: uma pessoa só, uma câmera, olhar para a lente em vez de para o entrevistador, e
nenhum set de podcast. O tratamento:

1. **Escolher a velocidade pela fala.** Se ele der exemplos com nomes, marcas, números e objetos, documental
   (ref1); se for conselho ou reflexão, calma (ref2). Para ~30 s: 12 a 28 trocas de plano.
2. **Achar a tese** (a frase que resume o vídeo) e pôr no começo, no palco, com a palavra-chave gigante. Se ele não
   abrir com ela, o primeiro plano ainda é o palco com a frase dita mais perto do começo que carrega a ideia, sem
   mudar a ordem da fala.
3. **O palco:** pedir a ele 10–20 s gravados num cômodo escuro, sentado a uma mesa sob uma luz só, mesma roupa,
   olhando para o lado. Sem isso, o molde desenha o palco escuro (mesa sob foco, sem pessoa) e usa como fundo da tese,
   da lista e do fecho. O palco vazio gerado por IA é opção do usuário (regras novas, abaixo).
4. **O rosto:** a gravação dele em dois enquadramentos alternados nos cortes (aberto 1,0 e fechado ~1,3, rosto com
   26–28% H no fechado), câmera seguindo o rosto (`enquadrar.py`), fundo escurecido e esfriado com vinheta para
   chegar perto do `estudio` #131A1E. Para isso funcionar bem, o pedido diz: fundo escuro e longe, uma luz de lado,
   roupa escura. O olhar para a câmera fica como está; não se inventa entrevistador.
5. **Terço inferior** na primeira aparição do rosto: nome dele e @ em mono, com o traço vermelho, ~5 s.
6. **Cada substantivo concreto vira imagem** (§6): pessoa ou marca citada pelo `buscar.py`; objeto e cenário por foto
   dele ou com licença aberta (`buscar.py`; gerado pelo `gerar.py` só se o usuário ligar); o trabalho dele (telas,
   prints, números) pedido a ele; série de exemplos vira colagem no papel.
   Rosto ~40–50% do tempo, palco ~20%, papel e arquivo o resto.
7. **Legenda no modo conversa** em todo o vídeo (ele fala o que pensa), uma palavra-chave serifada por frase, na
   última palavra forte; nome dele ou de pessoa em serifa branca.
8. **1 a 2 vazamentos de luz**, na virada do exemplo para a conclusão.
9. **Fecho:** se ele terminar com chamada ("comenta X", "me segue"), o terço inferior vira a chamada com as palavras
   dele; senão, volta ao palco e repete a palavra-chave da tese, como a ref1.
10. **Trilha** contínua por baixo, ~16 dB abaixo da voz, batida curta no vazamento.

## 16. Aplicações

| Data | Peça | Observação |
|---|---|---|
| 2026-10-10 | Vitrine dos modelos (`moldes/superpodcast01/`) | 1ª aplicação: vídeo-teste comum, 13 planos nos 4 mundos + tela dividida, palco vazio gerado, colagem com as edições dele, nome do modelo no terço inferior; texto no tempo da fala fica abaixo de 1 s + 3 palavras/s (fala a 3,3 palavras/s), palavras-chave todas com 0,8 s; aguarda o olho do Jessé |

## 17. Em aberto

- O som das referências não foi ouvido: tipo de trilha, efeito nos cortes e no vazamento ficam para calibrar no
  primeiro vídeo.
- A lista numerada, a cartela de nome e o traço de caneta (§13) ainda não estão no molde.
- Se o palco das referências é filmado ou gerado (parece filmado, o mesmo set dos closes).
- Qual entrada de palavra comum vira padrão (fade com desfoque da ref1 ou "acende" da ref3): decidir no portão 1 do
  primeiro vídeo.
- Pacote no motor da Máquina: só depois de o dono aprovar o primeiro vídeo e pedir.

## Regras novas (2026-10-12, pedido do Jessé)

- **Outras câmeras não se geram por IA.** Os planos das referências são outras câmeras do mesmo set e, no máximo, B-roll.
  No lugar de "outra câmera" entram, nesta ordem: outros cortes de câmera do mesmo vídeo, B-roll do usuário ou B-roll de
  terceiros. Imagem ou vídeo gerado por IA (palco vazio, B-roll gerado) é **opção do usuário**, desligada por padrão,
  nunca o padrão do modelo. É o que a §13 e a §15.3 descrevem: sem a gravação do palco, o palco desenhado pelo molde;
  o palco gerado só quando o usuário escolher.
- **Versão própria, mantida.** A 1ª aplicação (vitrine, `moldes/superpodcast01/`) gerou o
  palco e o B-roll por IA copiando a cena das refs. Com isso o vídeo virou uma versão própria do modelo, e o Jessé decidiu
  mantê-la como está "para termos essa noção". É a régua de visual, ritmo e tamanho de legenda (aprovados: "sensacionais").
- **Sem nome do modelo na tela** no "um desses modelos": o 2º terço inferior (o nome do modelo com o @ de quem fala) saiu; as
  etiquetas das prévias ficam.
- **Sincronia:** cada palavra nasce quando é dita (±2 quadros) e cada corte cai no start da palavra que o motiva. Nada de
  atraso proposital para ganhar tempo de leitura. Conferido por `scripts/sincronia.mjs` (tem que dar 0 erros).
