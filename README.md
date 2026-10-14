# Estúdio 2D

Edite vídeos com o Claude Code em **modelos de edição** prontos. Você grava (ou só narra), o Claude lê a sua fala e
edita no estilo de um modelo, em [Remotion](https://www.remotion.dev). Cada modelo foi montado medindo quadro a quadro
vídeos de referência reais: posição e tamanho do texto, fontes, cores, ritmo de corte, e o que a tela faz em cada
tipo de frase.

Criado por **Jessé Gomes ([@OJESSEGOMES](https://instagram.com/ojessegomes))**.

## O que vem aqui
| Pasta | O que é |
|---|---|
| `modelos/<modelo>/<modelo>.md` | o arquivo único de cada modelo: a cara, os números, as regras, as opções e o passo a passo do vídeo novo |
| `modelos/<modelo>/referencia/` | o vídeo aprovado do modelo (com a voz), a folha de 1 quadro por segundo e o mapa medido (rosto, luz, cortes) |
| `REGRAS.md` | as regras de ofício que valem para todo modelo (já estão dentro de cada `<modelo>.md`; servem para criar modelo novo) |
| `moldes/<modelo>/` | o código Remotion de um vídeo real feito no modelo, para partir dele (`moldes/CONTRATO.md`) |
| `tools/` | preparar a gravação (vídeo, voz limpa, palavras com tempo pelo Whisper, rosto), começar um vídeo, fila de render |
| `kit/` | material para vídeos de motion: foto com licença aberta, recorte de fundo, geração de imagem e narração (opcional, com chave própria) |
| `videos/` | onde os seus vídeos nascem |

Tudo fica dentro da pasta: ambiente Python, Remotion, modelos de IA, caches e temporários.

## Instalar
Precisa de Python 3.11 ou 3.12, Node.js 20+ e ffmpeg no PATH. Uma placa NVIDIA acelera a transcrição, mas não é
obrigatória.

```powershell
# Windows (PowerShell 7)
pwsh -File instalar.ps1          # ou: pwsh -File instalar.ps1 -Gpu
```
```sh
# macOS / Linux
sh instalar.sh
```

## Fazer um vídeo
Abra a pasta no Claude Code (o `CLAUDE.md` já orienta o Claude) e peça, por exemplo: *"edita `minha-gravacao.mp4` no
storypodcast01"*. Por baixo, o caminho é:

1. `.venv/Scripts/python.exe tools/novo-video.py storypodcast01 minha-gravacao.mp4 2026-10-20-meu-tema`
   (se o Whisper errar um nome sempre do mesmo jeito, corrija na hora: `--trocar Cloud=Claude`). A pasta `base/` que
   nasce no vídeo guarda a preparação original (fala, voz, palavras, rosto). Errou uma palavra depois de criado?
   `.venv/Scripts/python.exe tools/trocar.py videos/2026-10-20-meu-tema Claudio=Claude` corrige sem rodar o Whisper de
   novo. Narração sem imagem (mp3/wav) também entra: vira um vídeo preto em pé, para os modelos sem pessoa gravada.
   O mesmo comando adapta a sua gravação ao ponto de partida do modelo (`tools/adaptar.py`): o rosto no tamanho e na
   altura em que o modelo foi calibrado e a mesma luz de partida. Sem isso, uma gravação mais perto, mais baixa ou mais
   clara sai com a cabeça cortada e a cor errada.
2. O Claude lê `modelos/storypodcast01/storypodcast01.md`, estuda `modelos/storypodcast01/referencia/` (o vídeo
   aprovado do modelo, com a folha de quadros e o mapa medido) e refaz o plano frase a frase sobre a sua fala.
3. Confere com o checador do molde, olha os quadros e renderiza (`QUEM=eu sh tools/com-trava.sh npx remotion render ...`).
   A trava põe um render por vez e apaga as sobras do Remotion no fim.
4. Confere se parece o modelo: `.venv/Scripts/python.exe tools/parece.py videos/<pasta>/out/final.mp4 <modelo>`. Ele
   mede luz, cor, enquadramento do rosto e ritmo contra o vídeo aprovado do modelo (vídeo curto é comparado com os
   trechos do mesmo tamanho do aprovado) e grava uma folha com o seu vídeo embaixo do aprovado. Reprovou, o vídeo ainda não está pronto.

No macOS e no Linux, troque `.venv/Scripts/python.exe` por `.venv/bin/python` em todos os comandos.

**Dica de gravação:** deixe 1 segundo de silêncio depois da última frase. Os modelos seguram a última palavra na tela
um pouco depois da fala; sem essa sobra, o último quadro fica parado.

## Os modelos
| Com a pessoa gravada | Sem gravação de pessoa |
|---|---|
| modelodinamico01, modelopadrao01, modelodinamico03, pregacaodinamica01, profissional01, storypodcast01, superpodcast01, youtubeedition01 | modelodinamico02, ilustrations01, sofistmotion01, anunciomotion01, anunciocanvas01, youtubedark01 |

Os moldes vêm sem a mídia do vídeo de origem (gravação, imagens geradas, trilhas): para ver um modelo funcionando, rode
`novo-video.py` com uma gravação sua. Cada molde traz o plano do vídeo de origem, preso àquela fala; o molde trava de
propósito se a fala nova não bater, e é aí que o Claude refaz o plano para a sua fala. O `<modelo>.md` de cada modelo
tem a seção **"Como fazer um vídeo novo"**: o que refazer, as chaves, o conferidor, o render e a mixagem. **O padrão de
cada modelo é o vídeo aprovado dele**: o que aparece nele (tratamento de cor, palco, efeitos sonoros) vem ligado, e só
vem desligado o que o `<modelo>.md` diz que é opção. As correções do criador já estão escritas como regra nesse
arquivo, e ele vale acima do código.

O que o vídeo de origem tinha e você mesmo providencia:
- **Prévias** (os clipes acelerados em cima, em alguns moldes): faça de vídeos seus já prontos com
  `tools/previa.py <seu-video.mp4> videos/<pasta> 1 --de 10` (e `2` para a segunda). Nunca vídeo de terceiro.
- **Cartões de colagem** (superpodcast01): `tools/cards.py`, a partir dos seus vídeos e da sua gravação.
- **Imagens geradas ou buscadas** (B-roll, cenários): o `<modelo>.md` diz quais, com o comando do `kit/`. O palco e os
  B-rolls do superpodcast01 já vêm com o estúdio.
  Imagem por IA é opção sua, nunca obrigação.

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
com a própria gravação; os `<modelo>.md` descrevem medidas e padrões desse vídeo.
