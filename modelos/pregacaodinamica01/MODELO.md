# pregacaodinamica01

> **Pacote no motor:** `projetos/maquina-de-conteudo/motor/pacotes/pregacaodinamica01/` (versão 1), em prova até o portão do dono. A comparação com o último vídeo aprovado está em `projetos/maquina-de-conteudo/docs/etapa-7/pregacaodinamica01.md`.

Modelo de edição de corte de pregação, montado olhando quadro a quadro 5 referências que o Jessé
escolheu (`referencias/`). Tudo o que ele ensinar dizendo "pregaçãodinâmica01" entra **só aqui**.
Não mistura com modelopadrao01, modelodinamico01 nem modelodinamico02.

**Vale para vertical (9:16) e horizontal (16:9).** As regras são as mesmas; o que muda está na
seção 7.

Folhas em `analise/` (`refN_XX.png` a 1,5–2 qps, `q*.png` a 30 qps nos momentos-chave).

| | Arquivo | Formato | O que é |
|---|---|---|---|
| ref1 | snapgram.io_ffzognhss413.mp4 (53 s) | 9:16 | Pregador no palco, legenda sobre o peito, frase-bloco montada, letreiro gigante atrás, tela creme, vinheta da igreja |
| ref2 | snapgram.io_o9dphrvjmnlq.mp4 (31 s) | 9:16 | Palco azul, legenda amarela/branca, versão LEGO do pregador, telas azuis lisas, sílabas empilhadas |
| ref3 | snapgram.io_w6joglvxlop9.mp4 (55 s) | 9:16 | Entrevista sentado, quase só legenda; palavra-tese em cursiva vermelha; vinheta desfocada |
| ref4 | snapgram.io_x2806uoed6cy.mp4 (61 s) | 16:9 | Pregador de lado, legenda espalhada pelo quadro, preto e branco no clímax, LEGO na abertura, palavras gigantes |
| ref5 | snapgram.io_lycvp4omumz7.mp4 (57 s) | 16:9 | Criador falando centrado (podcast/estúdio) com **B-roll longo** no meio (paisagem aberta, 13 a 39,5 s, a voz continua por cima), palavra-chave colorida por sentido, letreiro gigante atrás ("Insistir") |

## 1. A ideia central

A pregação é a estrela: **a voz e o rosto do pregador mandam**, a edição só amplifica. Quase todo
o vídeo é o pregador com **uma legenda palavra por palavra no meio do corpo**. Em cima dessa base,
a cada 5 a 10 s, entra **um momento de ênfase** na frase mais forte (bloco de frase, palavra
gigante, tela lisa, preto e branco, LEGO). Nada de enfeite fora desses picos.

## 2. A legenda base (o que está na tela 80% do tempo)

- **Uma palavra (ou duas curtas) por vez,** trocando no ritmo exato da fala (ref1 "problema" →
  "nenhum" → "de" → "te", troca seca no quadro do ataque da sílaba, sem animação de entrada).
- Surgimento sutil: 4 quadros de fade com 8 px de subida (nada de troca seca crua).
- Sans grossa e apertada (tipo Inter/Helvetica Bold, espaçamento negativo), **branco quente**
  (`#F3EDE4`), sombra suave, sem caixa.
- **Posição:** no peito do pregador, centrada nele, logo abaixo do queixo (ref1/ref3 ~y 640 de
  1920 quando o plano é médio; ref2 acompanha o corpo). Ela segue o pregador, não o centro da tela.
- Tamanho ~5% da altura do quadro (≈ 90 px em 1920). **O tamanho é escolha por vídeo:** o Jessé às vezes pede menor (como nas referências), às vezes maior (corte 2 horizontal: 88 px em 1080, palavra-chave 130).
- ref3 (fala mais calma): 2 a 4 palavras por vez, menor, com o pedaço que sai desfocando.

## 3. Os momentos de ênfase (o tempero, a cada 5–10 s)

1. **Frase-bloco que se monta** (ref1 0 a 4,5; ref4 10 a 13): a frase da tese fica na tela e vai
   crescendo palavra por palavra num bloco à esquerda, com **tamanhos misturados**: palavras de
   ligação minúsculas encaixadas ("não tem", "em", "te") e as de peso grandes ("Deus", "problema",
   "algum"). A **última palavra** entra em **cursiva/serifa itálica vermelha** (`#E8141C`) e maior
   ("frustrar", "melhor", "Líder", "valores"). Entrada: cada palavra sobe desfocada em ~4 quadros.
   Saída: o bloco inteiro sai num chicote borrado (2 quadros) junto com o corte.
2. **Palavra-chave em vermelho itálico** no meio da legenda normal (ref3 "valores", "princípios";
   ref4 "semana", "entreter").
3. **Letreiro gigante atrás do pregador** (correção do Jessé: o letreiro mostra **parte da frase** sendo dita, e essas palavras saem da legenda base; nunca repetir atrás uma palavra que já está na legenda) (ref1 5,7 a 22): uma palavra-tema enorme ("MEU CHAMADO")
   no topo, cor fria clara (`#BFE8E0`), atravessando a tela devagar, com o pregador **na frente**
   (recorte). Entra letra por letra e rola durante vários segundos. É a camada de profundidade.
4. **Repetição espalhada** (ref1 7,3): quando ele repete uma palavra ("não, não, não"), a palavra
   aparece várias vezes espalhada pela tela, pequena e branca, com uma grande em vermelho no centro.
5. **Sílabas empilhadas** (ref2 19 a 21): palavra longa dita devagar entra sílaba por sílaba,
   empilhada, amarela, enorme ("pre / ci / pi / ta / ção.").
6. **Palavras gigantes coloridas** (ref4 22,4: "DA SUA VIDA", branco + vermelho, linha a linha,
   cobrindo meia tela ao lado do pregador).
7. **Tela lisa** (ref2 4,5 e 15; ref1 15 a 20): corta para um fundo de cor chapada (azul `#2B2BF0`
   com grão, ou creme `#EDE3D3`) só com a frase escrita, palavra por palavra. É o "respiro" antes
   da frase de impacto. 1,5 a 5 s. Na tela creme, palavras em branco/creme claro com a de peso em
   serifa itálica maior ("planos").
8. **Preto e branco no clímax** (ref4 13,6 a 16 e 38 a 46): o vídeo fica P&B durante a parte mais
   séria, com a palavra de peso em vermelho (único ponto de cor).
9. **Versão LEGO do pregador** (ref2 1,6 a 4 e 8 a 9,5; ref4 0 a 5): a mesma pose e enquadramento
   recriados como boneco LEGO, em corte seco, segurando a legenda. Usado na abertura (gancho) ou
   para ilustrar um personagem bíblico. **Exige imagem gerada por IA à parte** (ver §8).
10. **Plano de fundo recolorido** (ref1 0 a 4,5): fundo do plano tingido de vinho/bordô para a frase
    de abertura, voltando ao normal no corte.

11. **Ilustração minimalista em traço nas telas criadas** (em teste, corte 2): ícones de linha que se desenham sob a pergunta (profissões) e um caminho que se divide em vários no fecho ("não é a única forma"). Traço fino, uma cor, a peça-chave na cor de ênfase.

12. **B-roll com a voz por cima** (ref5 13 a 39,5 s): corta seco do falante pra uma imagem de apoio (ali, uma paisagem aberta com uma figura pequena, plano longo e quase parado) e a fala continua. Sem o falante, **o quadro inteiro vira palco da legenda**: as frases se montam em qualquer ponto (cantos, centro, topo), com o mesmo jogo de sans branca + serifa itálica + palavra colorida, entrando e saindo por desfoque. Volta ao falante em corte seco na frase de virada ("Mas se você..."). **Regra de uso (Jessé):** B-roll só entra se o dono mandar os arquivos de B-roll junto com o vídeo. Sem B-roll, esse trecho vira as telas que já fazemos (tela lisa §3.7, ilustração em traço §3.11, tela creme/preta com a frase).
13. **Cor da palavra-chave pelo sentido** (ref5): vermelho no que nega ou alerta ("não importa", "NÃO É SOBRE", "médio", "AUMENTAR"), verde no que afirma ou é o ganho ("É SOBRE", "Dinheiro", "receita"), azul em termo técnico ou pergunta ("nicho", "trabalhando?"). Uma cor por ideia, nunca enfeite: a cor diz se a frase é o erro ou a saída.

**Pedido avulso que pode voltar (não é regra fixa):** "capriche mais nas palavras-destaque". No corte 2 isso virou: a palavra entra maior e desfocada e assenta (0,22 s), ganha brilho vermelho e um traço de pincel que se desenha por baixo, sempre conferindo enquadramento e tempo de tela.

## 4. Cortes e movimento

- **Corte seco** entre planos, sempre na troca de frase. Plano dura 2 a 6 s.
- Troca de enquadramento entre médio, próximo e aberto (ref1, ref4), com **zoom lento contínuo**
  dentro do plano.
- Chicote borrado (2–3 quadros) para entrar num momento de ênfase (ref1 4,57; ref2 1,60).
- Transição para a tela lisa: **dissolve rápido** (~6 quadros, ref1 14,83 a 15,03) ou corte seco
  (ref2).
- Corte com flash (branco negativo, 2 quadros) para entrar no P&B (ref4 13,6).

## 5. Cor e tipografia

- Uma cor de ênfase por vídeo: **vermelho vivo** (ref1, ref3, ref4) ou **amarelo** (ref2).
- Base branca quente. Sans grossa para a legenda; **cursiva/serifa itálica** só para a palavra de
  peso.
- Grão leve de filme em tudo (ref2).

## 6. Abertura e fechamento

- Abre **direto na frase mais forte** do trecho, já com a frase-bloco ou com o LEGO (gancho nos
  primeiros 1–2 s). Nada de vinheta no início.
- Fecha com a **vinheta da igreja/ministério** em fundo escuro com degradê (ref1 45 a 52: logo
  animada se montando) ou a última frase sozinha na tela preta (ref2 "não ora.").

## 7. Vertical × horizontal

| | 9:16 | 16:9 |
|---|---|---|
| Plano | Pregador centrado, médio-próximo | Pregador num terço; o outro lado fica livre |
| Legenda base | No peito, centrada nele | Espalhada: palavras surgem em pontos diferentes do lado livre (ref4) e o bloco às vezes divide em duas colunas, uma de cada lado do pregador |
| Frase-bloco / gigantes | Ocupa a largura, em cima ou no meio | Ocupa o lado livre, alinhada à borda |
| Letreiro atrás | No topo | Faixa atrás do pregador |
| Marca d'água | – | Logo pequena no canto inferior esquerdo (ref4) |
| Aprendido no corte 2 | | Pessoa no centro: a legenda base vai em pares, um pedaço à esquerda e o seguinte à direita, **na altura da cabeça** (na altura do peito ela bate no ombro e nas mãos). **Lugar fixo, nunca seguindo o protagonista** (correção do Jessé: legenda que persegue o enquadramento fica "caçando lugar" quadro a quadro). Mede-se o quanto o rosto anda no vídeo inteiro e fixam-se duas colunas fora desse alcance, já contando o zoom (corte 2: esquerda termina em x 560, direita começa em x 1400, y 400 de 1080). **Tempo mínimo de tela: nenhum pedaço pisca** (correção do Jessé: pedaço com ~1 quadro é inaceitável). Pedaço que ficaria menos de 0,55 s até a próxima fala não fecha o grupo: os pedaços seguintes entram **juntos no mesmo lado, lado a lado e abaixo** (como o bloco do gancho, mas com o mesmo tamanho e fonte da legenda base), e o bloco só fecha quando o último pedaço tiver tempo. **No máximo 2 linhas por lado**: se o bloco precisar de 3 ou 4, as duas últimas vão pro lado oposto (as palavras se distribuem por largura, frase nova começa no outro lado). Conferir com `scripts/medir.ts` (lista o tempo de tela de cada pedaço) |

## 8. O que depende de material à parte

- **LEGO:** imagem da cena gerada por IA a partir de um quadro do pregador. Só entra se o dono
  aprovar e fornecer ou autorizar a geração.
- **Letreiro atrás do pregador:** recorte da pessoa (máscara de segmentação) para o texto passar por
  trás.
- **Vinheta final:** logo do ministério/igreja (arquivo do cliente).
- **B-roll (§3.12):** só com arquivos que o dono enviar junto. Nunca baixar ou gerar B-roll por conta própria; sem arquivo, usar as telas criadas.
- Nunca inventar versículo, nome de igreja ou citação: a legenda é exatamente o que foi dito.

## 9. Aplicações

| Vídeo | Base | Saída |
|---|---|---|
| Corte de podcast "a gente é treinado" (16:9, 32,9 s, QR code apagado por IA) | `corte-2-limpa2.mp4` | `conteudo/2026-10-06-corte-podcast-horizontal01/out/corte-horizontal-pregacaodinamica01.mp4` |
| Corte de podcast "a pessoa não te cumprimentou" (9:16, 18,9 s) | `corte-1-limpa.mp4` | `conteudo/2026-10-06-corte-podcast-pregacao01/out/corte-pregacaodinamica01.mp4` |

## Regras novas (2026-10-12, pedido do Jessé)

Valem acima do que estiver escrito antes neste arquivo. Vieram da correção do vídeo da vitrine
(`conteudo/2026-10-10-vitrine-modelos/pregacaodinamica01/`) e incluem as que ele já tinha dado no modelodinamico03.

- **A legenda conta uma história.** Todas as falas aparecem na tela, cada trecho uma vez só, em ordem. Nada de trecho
  falado enquanto um bloco segura a tela sem estar escrito.
- **Tempo de leitura.** Nenhum pedaço abaixo de 1,5 s e nenhuma palavra visível menos de 0,4 s depois de nascer. Fala
  rápida: junte em páginas maiores (até 2 linhas na legenda), com as palavras nascendo junto da voz; nunca pique.
- **No máximo 4 linhas em qualquer bloco** (frase-bloco, tela de destaque, legenda). A frase-bloco de tamanhos
  misturados conta cada degrau como linha: nada de empilhar palavra pequena "subindo" ao lado da grande.
- **Legenda padrão em no máximo 2 posições no vídeo todo** (na vitrine: uma só; a y 1560 da 1ª rodada foi erro, ver a 2ª rodada abaixo).
  Sem palavra colorida na legenda.
- **Destaque só no termo protagonista** (o assunto: "modelos", "Claude", "edição"), nunca advérbio, verbo solto ou fala
  coadjuvante ("Inclusive, se você estiver no Instagram agora" é legenda, não tela).
- **Tela de destaque só para a fala protagonista e sempre com contraste legível.** Na tela creme o texto é tinta escura
  (`#1A1512`) e a palavra de peso vai em vermelho escuro (`#C8141B`). Texto branco sobre fundo claro é proibido.
- **Cor do fundo é opção, desligada por padrão.** O tingimento do fundo (vinho, azul petróleo) fica na prop `fundoCor`
  (`false`). Sem ele, o letreiro atrás da pessoa vai no vermelho do modelo para ler na parede clara.
- **Preto e branco e flash negativo saíram** (só entram se o dono pedir, como opção desligada).
- **Sem o nome do modelo escrito na tela.** As etiquetas de nome das prévias de outros modelos continuam.
- **Fecho: fixo só o comando, com a palavra entre aspas:** Comenta “edição”. O resto da fala segue na legenda.
- **Prova obrigatória:** `scripts/cobertura.mjs` do projeto (buracos, pedaços curtos, repetição, posições, linhas por
  bloco), com tudo zerado, antes de entregar.

## Regras novas (2026-10-12, 2ª rodada, pedido do Jessé)

Valem acima de tudo o que estiver antes. Vieram da 2ª correção do vídeo da vitrine.

- **Legenda padrão na posição de leitura medida, nunca rebaixada ao pé do quadro.** A posição é a da §2: no peito,
  logo abaixo do queixo. Na vitrine (queixo em y ~940 a 990 com o zoom dos planos) a legenda começa em **y 1060**,
  centrada na zona segura (x 500), numa posição só no vídeo inteiro. Em outro vídeo, mede-se o queixo (`rosto.json`)
  e a legenda vai logo abaixo dele; a y 1560 que saiu na 1ª rodada é o erro a não repetir.
- **Zona segura das redes em 9:16 (Reels, TikTok, Shorts), em 1080x1920.** Nenhum texto (legenda, frase-bloco, tela de
  destaque, letreiro, fecho, etiquetas das prévias) fora de: **y 250 a 1500** (fora os 250 px de cima, da barra e do
  nome, e os 420 px de baixo, da legenda do post, do @ e dos botões) e **x 60 a 940** (fora os 60 px da esquerda e os
  140 px da direita, do coração, comentário e compartilhar). O centro de texto centralizado é o da zona (x 500), não
  o do quadro. No código é a constante `ZONA` do `Corte.tsx`; o `scripts/cobertura.mjs` renderiza só os textos
  (prop `soTexto`, fundo transparente) a cada 0,1 s, com e sem prévias, e falha se algum pixel de texto sair da zona.
- **Consequências na vitrine:** letreiro MODELOS em 176 px parado na zona (y 260, deriva curta, sem rolar para fora
  do quadro); chicote de saída com deslocamento curto (18 px) para não vazar pela esquerda; prévias 420x747 em
  y 280 (x 65 a 935), sobre o próprio vídeo desfocado e escuro, com a legenda no mesmo y 1060 logo abaixo delas;
  fecho Comenta “edição” abaixo da legenda (y 1222, 92 e 180 px).
