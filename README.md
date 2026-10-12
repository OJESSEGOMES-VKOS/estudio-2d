# Estúdio 2D

Edite vídeos com o Claude Code em **modelos de edição** prontos. Você grava (ou só narra), o Claude lê a sua fala e
edita no estilo de um modelo, em [Remotion](https://www.remotion.dev). Cada modelo foi montado medindo quadro a quadro
vídeos de referência reais: posição e tamanho do texto, fontes, cores, ritmo de corte, e o que a tela faz em cada
tipo de frase.

Criado por **Jessé Gomes ([@OJESSEGOMES](https://instagram.com/ojessegomes))**.

## O que vem aqui
| Pasta | O que é |
|---|---|
| `REGRAS.md` | as regras de ofício que valem para todo modelo: legenda, tempo de leitura, destaque, zona segura, conferência |
| `modelos/<modelo>/MODELO.md` | o cérebro de cada modelo: a receita visual medida e os gatilhos (o que a tela faz quando a fala faz X) |
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
2. O Claude lê `modelos/storypodcast01/MODELO.md` e `REGRAS.md` e refaz o plano frase a frase sobre a sua fala.
3. Confere com o checador do molde, olha os quadros e renderiza (`QUEM=eu sh tools/com-trava.sh npx remotion render ...`).

## Os modelos
| Com a pessoa gravada | Sem gravação de pessoa |
|---|---|
| modelodinamico01, modelopadrao01, modelodinamico03, pregacaodinamica01, profissional01, storypodcast01, superpodcast01, youtubeedition01 | modelodinamico02, ilustrations01, sofistmotion01, anunciomotion01, anunciocanvas01, youtubedark01 |

Os moldes vêm sem a mídia do vídeo de origem (gravação, imagens geradas, trilhas): para ver um modelo funcionando, rode
`novo-video.py` com uma gravação sua. Cada molde traz o plano do vídeo de origem, preso àquela fala; o molde trava de
propósito se a fala nova não bater, e é aí que o Claude refaz o plano para a sua fala. Moldes que usam imagens
(superpodcast01, modelodinamico02, anunciocanvas01) dizem no `LEIA.md` quais gerar ou buscar com o `kit/`.

## Licença e créditos
Licença **Apache 2.0** (`LICENSE`). Você pode usar, modificar e redistribuir, inclusive comercialmente, **desde que
mantenha o `NOTICE` e o crédito "Estúdio 2D por Jessé Gomes (@OJESSEGOMES)"** (veja `NOTICE`).

Ferramentas de terceiros usadas (cada uma com a licença dela, instaladas pelo instalador, não incluídas aqui):
- **Remotion**: licença própria. Gratuita para pessoas físicas e empresas pequenas; empresas maiores precisam de uma
  licença da Remotion. Confira em remotion.dev/license antes de usar comercialmente.
- faster-whisper e os pesos do Whisper (MIT), OpenCV e o detector de rosto YuNet (Apache 2.0/MIT), LaMa (Apache 2.0),
  Robust Video Matting (GPL-3.0, baixado à parte e usado como arquivo de modelo), rembg (MIT).
- Fontes do Google Fonts (OFL), carregadas pelo `@remotion/google-fonts`.

Os vídeos de referência que deram origem aos modelos não são distribuídos; os MODELO.md descrevem medidas e padrões,
não copiam material.
