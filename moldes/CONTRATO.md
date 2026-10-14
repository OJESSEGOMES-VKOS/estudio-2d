# Contrato dos moldes

Cada pasta `moldes/<modelo>/` é a implementação de referência de um modelo: o código Remotion do último vídeo
aprovado nele. Um vídeo novo nasce copiando o molde para `videos/<AAAA-MM-DD-tema>/` (`tools/novo-video.py`) e
refazendo o plano sobre a fala nova, seguindo `modelos/<modelo>/<modelo>.md`.

## Tudo confinado no estúdio
- Nenhum caminho para fora da pasta do estúdio (nada de pasta de outro projeto, nada de outro `.venv`).
- Os caminhos são relativos e funcionam igual em `moldes/<m>/` e em `videos/<v>/` (as duas ficam a 2 níveis da raiz):
  - Remotion: `node_modules` é uma junção para `../../node_modules`.
  - Python: `../../.venv/Scripts/python.exe` (Whisper, OpenCV, numpy, scipy). Material de motion (rembg, kie.ai,
    ElevenLabs): `../../kit/.venv/Scripts/python.exe`.
  - Ferramentas: `../../tools/` (`preparar.py`, `transcribe.py`, `align.py`, `enquadrar.py`, modelos ONNX).
  - Render: `QUEM=<m> sh ../../tools/com-trava.sh npx remotion render ... --concurrency=2` (TEMP em `../../.tmp`).

## Entrada padrão (moldes com a pessoa gravada ou com a voz dela)
| Arquivo | O que é | Quem gera |
|---|---|---|
| `public/fala.mp4` | o vídeo, rotação aplicada, 30 qps | `tools/preparar.py` |
| `public/voz.wav` | a voz limpa | `tools/preparar.py` |
| `src/palavras.json` | `[{text,start,end}]` | `tools/preparar.py` |
| `src/rosto.json` | `[[t,cx,cy,h]]` a cada 0,25 s (vazio se não há rosto) | `tools/preparar.py` |
| `public/previa1.mp4`, `public/previa2.mp4` | opcionais (prop `previas`) | à mão |

Moldes de narração com imagens (anunciocanvas01, modelodinamico02 e afins) descrevem a própria entrada no
`modelos/<modelo>/<modelo>.md`.

## O que cada molde tem
- O manual do molde (o que é, a entrada, a composição e as props, como renderizar e mixar, o que é específico do vídeo
  de origem e precisa ser refeito num vídeo novo) está na seção do vídeo novo do `modelos/<modelo>/<modelo>.md`. No
  estúdio local o molde ainda guarda o `LEIA.md` antigo, que não vai para o estúdio aberto.
- `scripts/`: som, mixagem, quadros de conferência e o checador do modelo (legenda, sincronia, zona segura).
- Em `moldes/` fica a mídia do vídeo de origem (só no estúdio local), para o molde renderizar sozinho como prova.
