# anunciomotion01

> **Pacote no motor:** `projetos/maquina-de-conteudo/motor/pacotes/anunciomotion01/` (versão 1), em prova até o portão do dono. A comparação com o último vídeo aprovado está em `projetos/maquina-de-conteudo/docs/etapa-7/anunciomotion01.md`.

Primeiro modelo oficial do estilo **Anúncios em Motion**, montado olhando quadro a quadro 6 referências
que o Jessé escolheu (`referencias/`). Tudo o que ele ensinar dizendo "anunciomotion01" entra **só aqui**.
Os anúncios em motion antigos (amadores) não servem de base.

Folhas em `analise/`: `refN_XX.png` a 1,5 qps (vídeo inteiro) e `qNa_01.png` a 8 qps nos momentos-chave.

| | Arquivo | Formato | O que é |
|---|---|---|---|
| ref1 | SaveClip…W8E.mp4 (45 s) | 9:16 | Cakto, "Pix automático": pergunta-gancho, ícones 3D, app real inclinado, fluxo "Resultado → mais previsibilidade → menos cancelamentos", pirâmide, 0% de taxa em anéis |
| ref2 | SaveClip…Ptk.mp4 (33 s) | 9:16 | Cakto, checkout: logos de pagamento riscados de vermelho um a um, celular 3D girando com %, partículas, gráfico de barras, avião "Migre agora" |
| ref3 | SaveClip…mnw.mp4 (70 s) | 9:16 | Cakto, manifesto: dores em letras com glitch vermelho ("SUPORTE QUE NÃO RESPONDE", "TAXAS ABUSIVAS"), depois a virada pro verde, telas reais do painel, selos (RA1000, 3DS), "ferramentas caras" riscado, palavras de fecho em neon colorido |
| ref4 | SaveClip…y9o.mp4 (39 s) | 9:16 | Cakto, afiliados: contador (1318 → 1807), notificações "Venda Aprovada!" empilhadas, ranking de cartões, botão "quiz" que destrava, interruptor OFF/ON, lista de afiliados |
| ref5 | sdasdas12easd.mp4 (61 s) | 9:16 | XGate, pagamentos internacionais: palavras 3D em perspectiva curva ("CANSADO", "BUROCRACIA", "EXTERIOR"), cidade escura, ícones de engrenagem/prédio, mapa do Brasil, fluxo PIX → USDT, logo se montando |
| ref6 | snapgram…4x.mp4 (49 s) | 16:9 | XGate, demonstração do produto: fundo claro, câmera passeando sobre a interface real, etiquetas verdes rotulando as partes, frases curtas entre as telas, logo no fim |

## 1. A ideia central

**Anúncio sem apresentador: a narração conduz, a tela encena cada frase.** Uma voz (locutor) fala o
roteiro de venda e cada pedaço da fala vira um objeto em movimento na tela: a palavra-chave, um ícone,
um número, um pedaço real do produto. Nada fica parado mais de ~1 s e nada entra sem ser dito.

O roteiro sempre anda em três atos:
1. **Dor** (a pergunta ou o problema que o público reconhece): escuro, vermelho, coisas riscadas, glitch.
2. **Virada e produto** (o que muda): verde/menta, o produto real aparece, números caem ("0% de taxa").
3. **Chamada**: frase curta de ação + marca se montando no fim.

## 2. Paleta, fundo e tipografia

- **Uma cor de marca** (nas refs, verde-menta neon `#3CF2A4` / teal `#2EE6C0`) com **brilho forte**
  (glow) em tudo que é da marca: texto de peso, contornos, ícones.
- **Vermelho** (`#FF2A2A`) só para o que é ruim: riscos, palavra de dor, glitch.
- **Fundo base preto** com textura sutil de **listras diagonais** e vinheta; às vezes uma luz da cor da
  marca vazando no canto.
- **Contraste de ritmo: telas claras** (branco/menta muito claro com manchas suaves) entram de vez em
  quando, em corte seco, pra dar respiro e marcar mudança de assunto (ref1 2 s, 5 s, 12 s; ref4 2 s,
  6 s, 20 s). A proporção é ~70% escuro, ~30% claro.
- **Sans geométrica** (tipo Inter/Manrope/Sora): **Bold/ExtraBold** na palavra de peso, Regular na de
  ligação. Frase montada em **2 linhas com tamanhos e cores misturados** ("você **sabia**", "não é por
  **desistência**", "e qualquer modelo de **pagamento mensal**").
- Uma fonte **manuscrita** com seta desenhada aparece pontualmente como comentário ("Esqueci de pagar
  o pix", "ao checkout da cakto", "Para o seu infoproduto").

## 3. Como o texto entra

- **Palavra por palavra, no tempo da narração**, nascendo de um **desfoque com leve deslize**
  (~4 quadros). Palavras de uma mesma frase se posicionam desencontradas (uma em cima à direita, a
  outra embaixo à esquerda) e se acomodam.
- **Palavra-chave dentro de uma pílula/botão** com contorno brilhante, escrita **letra por letra**
  (ref1 "Assinaturas", ref2 "Checkout"). A pílula entra inclinada em 3D e se endireita.
- **Marca-texto**: uma barra da cor da marca passa por baixo da frase (ref1 "que a maioria").
- **Saída**: a frase se dissolve em desfoque ou sai com a tela inteira (zoom pra trás + desfoque).

## 4. O repertório de cenas (os blocos que o modelo combina)

1. **Pergunta-gancho no escuro** (ref1 0 a 1,3; ref4 0): 2 a 4 palavras centradas, uma colorida.
2. **Negação**: a coisa ruim aparece e é **riscada por uma linha vermelha** que corre da esquerda pra
   direita, um item por vez (ref2 logos de pagamento; ref3 "ferramentas caras", "programadores"), ou
   recebe o **símbolo de proibido** por cima, desfocada (ref1 "Assinaturas" 🚫).
3. **Dor em glitch** (ref3 6 a 12): palavras finas em caixa alta, com tremida, rastro RGB e um
   **pulso vermelho tipo eletrocardiograma** atravessando. Sempre no escuro.
4. **Ícone 3D herói**: um objeto de vidro/plástico na cor da marca (usuário, cacto-mascote, mão com
   moeda, cadeado, escudo "3DS", engrenagens), girando devagar, entrando em escala com brilho.
5. **Produto real flutuando**: print verdadeiro do app/painel numa **placa inclinada em perspectiva**,
   com sombra e brilho no contorno, que gira levemente e aproxima (ref1 14 s; ref3 18 a 26 s; ref4 16 s).
   Uma etiqueta manuscrita ou uma pílula aponta o que importa. No 16:9 (ref6) a câmera **passeia** por
   cima da interface e etiquetas verdes rotulam as partes.
6. **Número que conta** (ref4 1318 → 1807; ref2 8% → 0%; ref1 45% → 4% → 0%): número enorme no centro
   girando os dígitos, com **anéis concêntricos** e pontos orbitando atrás. Termina na frase "de taxa
   no **pix**".
7. **Fluxo / causa e efeito** (ref1 19 a 21): uma palavra no topo e setas pra baixo revelando os
   ganhos um por um, cada um numa pílula com cor própria.
8. **Hierarquia / pirâmide** (ref1 22 a 25): degraus que se empilham com o nome de cada nível.
9. **Notificação empilhada** (ref3 1 a 2,6; ref4 6 e 33 s): cards de notificação ("Venda Aprovada!",
   "Novo grupo criado!") caindo e empilhando rápido, ou um só deslizando com brilho. É a prova social
   visual.
10. **Botão que destrava** (ref4 10,5 a 13): botão cinza com cadeado → acende na cor da marca, o
    cadeado se abre e voa, aparece um balão ("clonado!"). Também o **interruptor OFF → ON**.
11. **Lista de marcas/parceiros** (ref1 34 a 37): logos entrando um abaixo do outro, ou num painel.
12. **Palavra 3D em perspectiva** (ref5 0 a 3,8): a palavra em caixa alta curvada no espaço, com
    rastro, a câmera girando em volta; tracejado da cor da marca liga uma palavra à próxima.
13. **Gráfico que cresce** (ref2 24 s; ref3 40 s): barras ou linha brilhante subindo, valor contando.
14. **Fecho em neon colorido** (ref3 54 a 58): as promessas finais, uma por tela, em cores diferentes
    com brilho ("vender com liberdade" amarelo, "escalar com lucro" verde, "controle total" azul).
15. **Marca se montando**: o logo entra letra a letra / o símbolo gira e encaixa, branco no preto, e
    fica 2 a 3 s parado. A frase de assinatura entra antes ("Vem pra Cakto / você tá sempre na frente").

## 5. Câmera, cortes e ritmo

- **Uma ideia a cada 0,7 a 1,5 s.** A tela troca no ritmo da narração; um anúncio de 40 s tem ~30
  "cenas".
- Tudo tem **câmera viva**: zoom lento pra frente ou pra trás, objetos com leve rotação 3D. Nada
  estático.
- Transições: **corte seco** (principalmente escuro ↔ claro), **desfoque** (a cena incha e borra e a
  próxima nasce do borrão), **chicote** rápido com rastro, e **íris/círculo** que abre do centro (ref1
  42 s, ref4 15 s).
- Profundidade de campo: o elemento principal nítido, outros desfocados na frente/atrás.

## 6. Som (o que dá pra ver; confirmar com o dono)

- Narração de locutor do começo ao fim, com trilha eletrônica baixa e **efeitos em cada entrada**
  (estalos, whooshes curtos, glitch nas dores, "ding" nas notificações). Eu não ouço as referências:
  a mixagem vale pelo que o dono aprovar no primeiro anúncio.

## 7. Vertical × horizontal

| | 9:16 (ref1 a ref5) | 16:9 (ref6) |
|---|---|---|
| Linguagem | Motion denso, escuro com respiros claros, ícones 3D | Demonstração do produto: fundo claro, câmera passeando na interface |
| Texto | Centro da tela, 2 linhas | Frases curtas sozinhas entre os trechos de interface, com 1 palavra colorida |
| Produto | Placa inclinada flutuando | Interface grande, preenchendo o quadro, com etiquetas |

## 8. O que depende de material à parte

- **Narração**: o dono grava, ou voz gerada com o ok dele. O roteiro passa pelo `/humanizer`.
- **Prints reais do produto** (app, painel, checkout): do dono. Nunca inventar tela, número de
  cliente, taxa ou selo. Número que aparece na tela tem que ser verdadeiro.
- **Logos de terceiros** (meios de pagamento, parceiros): só se o produto realmente integra.
- **Ícones 3D**: estúdio 3D (Blender) ou ilustração 2D com brilho e volume falso.
- **Logo/marca** do produto.

## 9. Aplicações

| Vídeo | Base | Saída |
|---|---|---|
| Vitrine dos modelos (fala do Jessé, 9:16, 31 s, prévias profissional01 + sofistmotion01) | `conteudo/2026-10-06-anuncio-motion-a/` (Marcaí) | `conteudo/2026-10-10-vitrine-modelos/anunciomotion01/out/vitrine-anunciomotion01.mp4` (cor menta das refs, sem marca, telas desenhadas) |
