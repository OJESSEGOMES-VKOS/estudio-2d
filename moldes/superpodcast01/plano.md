# Plano frase a frase (superpodcast01 sobre src/palavras.json)

Modelo: `../../modelos/superpodcast01/superpodcast01.md`.
Velocidade: entre a **calma** (ref2) e a **documental** (ref1). A fala é um convite com poucos substantivos concretos
(vídeo, modelos, Instagram, prévias, vídeos, DM), então o vídeo sai do rosto em cada um deles e volta ao palco nas
frases de impacto. 13 planos, 12 trocas (MODELO §15.1 pede 12 a 28 para ~30 s). A regra da casa "nada atravessa
corte" impede a rajada de B-roll com texto: a energia documental vem de dentro dos planos (fotos da colagem entrando
uma a uma a cada 0,12 s, card que cresce e explode, avanço de câmera com desfoque do resto).

Legenda: **modo conversa** o vídeo inteiro (ele fala o que pensa), palavra comum entrando no lugar com fade e desfoque
de 0,15 s (a da ref1), palavra-chave em Playfair Display Black Italic letra por letra saindo do borrão.
Corte: na pausa ou no começo da palavra que abre a frase seguinte. Quando a palavra de abertura é dita antes do corte,
ela entra no 1º quadro do plano novo (nunca antes de ser dita).

Mundos: **palco** (palco vazio gerado: mesa clara sob foco, cadeiras e microfones vazios, estúdio preto), **rosto** (a
gravação com a pessoa recortada pelo RVM e o fundo trocado pelo `estudio` #131A1E, luz lateral dura; médio 1,10 e
close 1,18–1,32), **papel** (colagem com quadros dos outros modelos da vitrine, o trabalho dele), **arquivo** (B-roll
gerado em tela cheia), **tela dividida** (palco em cima, close embaixo: ref2 21,1).

| # | tempo (s) | fala | mundo | texto na tela (pequena / **palavra-chave**) | gatilho (MODELO §6) | imagem |
|---|---|---|---|---|---|---|
| P1 | 0,00–3,02 | Esse vídeo está sendo 100% editado pelo Claude. | palco, vazamento de abertura 0–0,30 s | "Esse vídeo está sendo 100%" / **editado** vermelha / "pelo" + caixa branca **Claude.** | tese no palco, no 1º quadro; marca vira caixa branca (ref3 0,8) | `palco.png` (gerado) |
| P2 | 3,02–5,18 | Ele foi criado justamente para te mostrar | rosto médio | "Ele foi criado justamente" / "para te mostrar" (só pequenas) + **terço inferior** com o nome e o @ de quem fala (props `nome` e `arroba`: os reais de quem fala; sem eles, o terço não aparece) | 1ª aparição do falante (ref1 7,4; ref2 3,0) | gravação |
| P3 | 5,18–8,04 | a diferença entre vários modelos que eu criei e melhorei | papel | **diferença** vermelha / "entre vários modelos" / "que eu criei e melhorei" (tinta); o "a" saiu (palavra vazia, §5.8) | vários exemplos → colagem, uma foto por vez, e a câmera avança até um item no "criei" (ref1 2,6–4,7) | 8 quadros dos outros modelos da vitrine |
| P4 | 8,04–9,68 | para editar qualquer tipo de vídeo | arquivo, chicote na entrada | "para editar" / **qualquer** vermelha / "tipo de vídeo" | ação concreta → B-roll com palavra-chave (ref1 5,8 "automobile") | `broll_edicao.png` (gerado) |
| P5 | 9,68–10,64 | usando o Claude. | rosto close | "usando o" + caixa branca **Claude.** | marca na frase | gravação |
| P6 | 10,64–13,04 | Inclusive, se você estiver no Instagram agora, | papel | "Inclusive, se você estiver no" / **Instagram** em tinta preta / "agora," | rede social → card pequeno cresce no centro e explode em vários (ref1 25,2 "Twitter") | celulares com interface genérica (sem logo) e quadros dos modelos |
| P7 | 13,04–14,84 | você está vendo apenas um desses modelos. | rosto close | "você está vendo" / **apenas** vermelha / "um desses modelos." + **terço inferior** com o nome do modelo e o @ (momento 1; saiu na revisão 1) | 2ª aparição: o terço inferior vira a assinatura (ref1 32,4) | gravação |
| P8 | 14,84–20,05 | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | **tela dividida** (palco em cima, close embaixo); com `previas: true` as duas prévias moram em cima (momento 2) | "Eu posso até colocar" / "duas prévias" → "rápidas aqui em cima," → "aceleradas em" / **três vezes.** vermelha | "aqui em cima" → o quadro se divide (ref2 21,1) | palco + gravação |
| P9 | 20,05–21,85 | Mas se você quiser realmente ver | rosto médio, **vazamento** na entrada (virada para a conclusão) | "Mas se você quiser" / "realmente ver" (só pequenas) | troca de bloco → vazamento (ref1 25,1) | gravação |
| P10 | 21,85–24,15 | outros modelos de edição como esse | papel | "outros modelos de" / **edição** vermelha / "como esse" (petróleo) | vários exemplos → prints entrando um a um (ref1 27,0) | 8 quadros dos outros modelos |
| P11 | 24,15–25,47 | e aprender a como usar | palco | "e" / **aprender** vermelha / "a como usar" | frase de impacto → palco (ref1 12,1 "enormous.") | `palco.png` |
| P12 | 25,47–26,69 | isso nos seus vídeos, | arquivo | "isso nos seus vídeos," (legenda pequena) | objeto concreto → B-roll curto, legenda pequena (ref1 4,7) | `broll_celular.png` (gerado) |
| P13 | 26,69–30,33 | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | rosto médio | "comenta" / **edição** vermelha gigante embaixo / "aqui embaixo" → no "que" as pequenas trocam: "que eu vou te mandar" / **edição** / "na sua DM agora." (momento 3) | a última frase repete a palavra do P10 e fecha o círculo do "editado" da tese (ref1 fecha repetindo "capital") | gravação |

Contas: rosto ~49% do tempo (P2, P5, P7, P8 embaixo, P9, P13), palco ~15% + o alto da tela dividida, papel ~25%,
arquivo ~9%. Palavras-chave: 8 serifadas (7 vermelhas, 1 tinta no papel) + 2 caixas de marca. 2 vazamentos (abertura e
virada). Uma cor de destaque só: o `sinal` #E0030A.

Fidelidade: todas as palavras ditas aparecem, menos o "a" de "a diferença" (palavra vazia, §5.8). "Claude" sempre
certo, "100%" como ele disse. O nome do modelo (momento 1) e o @ do terço inferior são os únicos textos que ele não
fala, como o "ROBERT GREENE / NYT Best Selling Author" da ref1.
