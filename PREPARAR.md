# Preparar o Estúdio 2D

**Para você, aluno:** abra o Claude Code numa pasta vazia (por exemplo `Documentos\estudio-claude`) e escreva:

> Instale o Estúdio 2D seguindo https://github.com/OJESSEGOMES-VKOS/estudio-2d/blob/main/PREPARAR.md

Não precisa baixar nem copiar nada. O Claude lê estas instruções e faz o resto, pedindo a sua licença antes de instalar
cada programa. Leva de 20 a 40 minutos, conforme a internet, e você só faz isso uma vez.

---

## Para o Claude: o que fazer

Quem pediu isto não é programador. Fale em português simples, um passo por vez, e diga o que está fazendo antes de cada
passo. Peça licença antes de instalar qualquer programa no computador. Se algo falhar, explique em uma frase o que
houve e tente o caminho alternativo; não despeje erro técnico na pessoa.

### 1. Conferir o espaço
O estúdio ocupa uns 10 GB depois de pronto (a transcrição baixa mais 3 GB no primeiro vídeo). Confira se o disco da
pasta atual tem pelo menos **15 GB livres**. Se não tiver, avise e pare.

### 2. Os programas de base
Confira se já existem: **Python 3.11 ou 3.12**, **Node.js 20 ou mais novo** e **ffmpeg** (com `ffprobe`). Para o que
faltar, com a licença da pessoa:
- **Windows:** `winget install -e --id Python.Python.3.12`, `winget install -e --id OpenJS.NodeJS.LTS`,
  `winget install -e --id Gyan.FFmpeg`. Precisa também do PowerShell 7: `winget install -e --id Microsoft.PowerShell`.
- **macOS:** com o Homebrew, `brew install python@3.12 node ffmpeg`.
- **Linux:** o gerenciador da distribuição (`apt install python3 python3-venv nodejs npm ffmpeg`).

Depois de instalar, o terminal atual pode não enxergar os programas novos. Se for o caso, peça para a pessoa fechar e
abrir o Claude Code de novo na mesma pasta e repetir o pedido; você continua de onde parou.

### 3. Baixar o estúdio
Baixe `https://github.com/OJESSEGOMES-VKOS/estudio-2d/archive/refs/heads/main.zip` e extraia nesta pasta, de modo que o
`CLAUDE.md` do estúdio fique na pasta atual (não numa subpasta `estudio-2d-main`). Não precisa de git nem de conta no
GitHub.

### 4. Instalar
- **Windows:** `pwsh -File instalar.ps1` (com placa NVIDIA: `pwsh -File instalar.ps1 -Gpu`).
- **macOS / Linux:** `sh instalar.sh`.

O instalador deixa tudo dentro da pasta: ambiente Python, Remotion, modelos de IA e caches. Nada se espalha pelo
computador. Ao terminar, apague a pasta `.tmp/pip-cache` (1,5 GB que só serviam para instalar).

### 5. Conferir que funciona
Confira as três partes, sem precisar de vídeo:
- Python: `.venv/Scripts/python.exe -c "import faster_whisper, cv2, numpy"` (no macOS/Linux, `.venv/bin/python`);
- Remotion: `npx remotion versions`;
- ffmpeg: `ffmpeg -version`.

Se as três responderem sem erro, está pronto. O primeiro vídeo de verdade da pessoa é o teste completo.

### 6. Avisar a pessoa
Diga, em poucas linhas:
- que o estúdio está pronto e em que pasta;
- que, para editar, ela grava o vídeo (celular em pé, rosto de frente, boa luz, sem música ao fundo), coloca o arquivo
  nesta pasta e escreve, por exemplo: *"Leia `modelos/modelopadrao01/modelopadrao01.md` e edite o meu vídeo
  `gravacao.mp4` nesse modelo"*;
- que os modelos disponíveis estão em `modelos/`, cada um com o vídeo de exemplo em `referencia/referencia.mp4`;
- que ela pode deixar o modelo mais com a cara dela preenchendo a seção "Do seu jeito", no topo do arquivo do modelo.
