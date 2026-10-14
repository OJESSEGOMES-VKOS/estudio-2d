#!/bin/sh
# Instala o Estúdio 2D dentro desta pasta (macOS/Linux). Precisa: Python 3.11+, Node.js 20+, ffmpeg.
# Uso: sh instalar.sh [--gpu]
set -e
RAIZ="$(cd "$(dirname "$0")" && pwd)"
cd "$RAIZ"
mkdir -p .tmp tools/modelos videos
export PIP_CACHE_DIR="$RAIZ/.tmp/pip-cache" npm_config_cache="$RAIZ/.tmp/npm-cache" TMPDIR="$RAIZ/.tmp"
for c in python3 node npm ffmpeg ffprobe; do command -v $c >/dev/null || { echo "Falta instalar: $c"; exit 1; }; done

echo '1/5 Python do estúdio (.venv)'
[ -d .venv ] || python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r requirements.txt
GPU=""; { [ "$1" = "--gpu" ] || command -v nvidia-smi >/dev/null 2>&1; } && GPU=1
[ -n "$GPU" ] && .venv/bin/python -m pip install -r requirements-gpu.txt

echo '2/5 Python do kit de material (kit/.venv)'
[ -d kit/.venv ] || python3 -m venv kit/.venv
kit/.venv/bin/python -m pip install --upgrade pip
kit/.venv/bin/python -m pip install -r requirements-kit.txt
[ -f kit/.env ] || cp .env.exemplo kit/.env

echo '3/5 Remotion (node_modules)'
npm ci
npx remotion browser ensure   # o navegador do render, dentro de node_modules

echo '4/5 Modelos de visão (tools/modelos)'
baixa() { [ -f "tools/modelos/$1" ] || curl -fL "$2" -o "tools/modelos/$1"; }
baixa face_detection_yunet_2023mar.onnx https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx
baixa rvm_mobilenetv3_fp32.onnx https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.onnx
baixa lama_fp32.onnx https://huggingface.co/Carve/LaMa-ONNX/resolve/main/lama_fp32.onnx

for d in moldes/*/; do [ -e "$d/node_modules" ] || ln -s ../../node_modules "$d/node_modules"; done
echo '5/5 Modelo de transcrição (tools/.cache)'
export HF_HOME="$PWD/tools/.cache/huggingface"
W=medium; [ -n "$GPU" ] && W=large-v3   # sem placa, a transcrição usa o medium
.venv/bin/python -c "from faster_whisper import download_model; download_model('$W')"
rm -rf .tmp/pip-cache   # só servia para instalar
echo 'Pronto. Para editar, peça ao Claude: edite meu vídeo <gravacao.mp4> no <modelo>.'
