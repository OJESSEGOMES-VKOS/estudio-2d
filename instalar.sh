#!/bin/sh
# Instala o Estúdio 2D dentro desta pasta (macOS/Linux). Precisa: Python 3.11+, Node.js 20+, ffmpeg.
# Uso: sh instalar.sh [--gpu]
set -e
RAIZ="$(cd "$(dirname "$0")" && pwd)"
cd "$RAIZ"
mkdir -p .tmp tools/modelos videos
export PIP_CACHE_DIR="$RAIZ/.tmp/pip-cache" npm_config_cache="$RAIZ/.tmp/npm-cache" TMPDIR="$RAIZ/.tmp"
for c in python3 node npm ffmpeg ffprobe; do command -v $c >/dev/null || { echo "Falta instalar: $c"; exit 1; }; done

echo '1/4 Python do estúdio (.venv)'
[ -d .venv ] || python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r requirements.txt
[ "$1" = "--gpu" ] && .venv/bin/python -m pip install -r requirements-gpu.txt

echo '2/4 Python do kit de material (kit/.venv)'
[ -d kit/.venv ] || python3 -m venv kit/.venv
kit/.venv/bin/python -m pip install --upgrade pip
kit/.venv/bin/python -m pip install -r requirements-kit.txt
[ -f kit/.env ] || cp .env.exemplo kit/.env

echo '3/4 Remotion (node_modules)'
npm ci
npx remotion browser ensure   # o navegador do render, dentro de node_modules

echo '4/4 Modelos de visão (tools/modelos)'
baixa() { [ -f "tools/modelos/$1" ] || curl -fL "$2" -o "tools/modelos/$1"; }
baixa face_detection_yunet_2023mar.onnx https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx
baixa rvm_mobilenetv3_fp32.onnx https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.onnx
baixa lama_fp32.onnx https://huggingface.co/Carve/LaMa-ONNX/resolve/main/lama_fp32.onnx

for d in moldes/*/; do [ -e "$d/node_modules" ] || ln -s ../../node_modules "$d/node_modules"; done
echo 'Pronto. No macOS/Linux, troque .venv/Scripts/python.exe por .venv/bin/python nos comandos.'
