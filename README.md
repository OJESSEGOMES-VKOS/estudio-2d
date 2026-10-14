# Estúdio 2D

Você grava, o Claude edita. O Estúdio 2D traz 14 **modelos de edição** prontos: você escolhe um, entrega a sua
gravação e o Claude Code edita o vídeo no estilo daquele modelo, com legenda, telas, cortes e som.

Criado por **Jessé Gomes ([@OJESSEGOMES](https://instagram.com/ojessegomes))**.

## 1. Instalar (uma vez só)
Abra o Claude Code numa pasta vazia e cole:

> Instale o Estúdio 2D seguindo https://github.com/OJESSEGOMES-VKOS/estudio-2d/blob/main/PREPARAR.md

O Claude cuida de tudo e pede a sua licença antes de instalar cada programa. Leva de 20 a 40 minutos e ocupa uns
10 GB no computador.

## 2. Gravar
- Celular em pé, rosto de frente, boa luz e sem música ao fundo.
- Deixe 1 segundo de silêncio depois da última frase.
- Nos modelos sem pessoa na tela, basta a narração em áudio.

## 3. Editar
Coloque a gravação na pasta do estúdio e peça ao Claude, por exemplo:

> Edite meu vídeo gravacao.mp4 no storypodcast01

Ele faz o resto e te mostra o vídeo pronto. Se quiser mudar algo, é só pedir com as suas palavras.

## 4. Deixar com a sua cara
Cada modelo tem um arquivo em `modelos/<modelo>/<modelo>.md`. No topo dele fica a seção **"Do seu jeito"**: escreva
ali o seu nome e @, a sua foto, a chamada do fim e o que você gosta ou não quer. O Claude lê isso antes de cada vídeo.
Quando você corrigir algo, ele oferece anotar ali para os próximos.

## Os modelos
Para ver como cada um fica, abra `modelos/<modelo>/referencia/original.mp4`.

| Com você na tela | Sem pessoa na tela |
|---|---|
| modelodinamico01, modelopadrao01, modelodinamico03, pregacaodinamica01, profissional01, storypodcast01, superpodcast01, youtubeedition01 | modelodinamico02, ilustrations01, sofistmotion01, anunciomotion01, anunciocanvas01, youtubedark01 |

O vídeo sai no estilo do modelo, não uma cópia do exemplo: as telas e os textos nascem da sua fala. Como a gravação é
outra, o resultado fica parecido com o exemplo, não idêntico.

## Para quem é técnico
O Claude segue o `CLAUDE.md` da raiz e o arquivo de cada modelo. Os moldes Remotion ficam em `moldes/`
(`moldes/CONTRATO.md`), as ferramentas em `tools/` e as regras gerais em `REGRAS.md`. Tudo fica dentro da pasta:
ambiente Python, Remotion, modelos de IA, caches e temporários.

## Licença e créditos
Licença **Apache 2.0** (`LICENSE`). Você pode usar, modificar e redistribuir, inclusive comercialmente, **desde que
mantenha o `NOTICE` e o crédito "Estúdio 2D por Jessé Gomes (@OJESSEGOMES)"** (veja `NOTICE`).

Ferramentas de terceiros usadas (cada uma com a licença dela, instaladas pelo instalador, não incluídas aqui):
- **Remotion**: licença própria. Gratuita para pessoas físicas e empresas pequenas; empresas maiores precisam de uma
  licença da Remotion. Confira em remotion.dev/license antes de usar comercialmente.
- faster-whisper e os pesos do Whisper (MIT), OpenCV e o detector de rosto YuNet (Apache 2.0/MIT), LaMa (Apache 2.0),
  Robust Video Matting (GPL-3.0, baixado à parte e usado como arquivo de modelo), rembg (MIT).
- Fontes do Google Fonts (OFL), carregadas pelo `@remotion/google-fonts`.

Nenhum vídeo de terceiro vem aqui. A referência de cada modelo é o vídeo aprovado dele, feito pelo criador do estúdio
com a própria gravação.
