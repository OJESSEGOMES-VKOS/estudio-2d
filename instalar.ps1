# Instala o Estúdio 2D dentro desta pasta (Windows, PowerShell 7).
# Precisa ter: Python 3.11 ou 3.12, Node.js 20+ e ffmpeg no PATH.
# Uso: pwsh -File instalar.ps1 [-Gpu]
param([switch]$Gpu)
$ErrorActionPreference = 'Stop'
$raiz = $PSScriptRoot
Set-Location $raiz
New-Item -ItemType Directory -Force "$raiz\.tmp", "$raiz\tools\modelos", "$raiz\videos" | Out-Null
# Caches dentro da pasta, nada espalhado pelo computador
$env:PIP_CACHE_DIR = "$raiz\.tmp\pip-cache"
$env:npm_config_cache = "$raiz\.tmp\npm-cache"
$env:TEMP = "$raiz\.tmp"; $env:TMP = "$raiz\.tmp"

foreach ($c in 'python', 'node', 'npm', 'ffmpeg', 'ffprobe') {
  if (-not (Get-Command $c -ErrorAction SilentlyContinue)) { throw "Falta instalar: $c" }
}

Write-Host '1/4 Python do estúdio (.venv)'
if (-not (Test-Path "$raiz\.venv")) { python -m venv "$raiz\.venv" }
& "$raiz\.venv\Scripts\python.exe" -m pip install --upgrade pip
& "$raiz\.venv\Scripts\python.exe" -m pip install -r requirements.txt
if ($Gpu) { & "$raiz\.venv\Scripts\python.exe" -m pip install -r requirements-gpu.txt }

Write-Host '2/4 Python do kit de material (kit/.venv)'
if (-not (Test-Path "$raiz\kit\.venv")) { python -m venv "$raiz\kit\.venv" }
& "$raiz\kit\.venv\Scripts\python.exe" -m pip install --upgrade pip
& "$raiz\kit\.venv\Scripts\python.exe" -m pip install -r requirements-kit.txt
if (-not (Test-Path "$raiz\kit\.env")) { Copy-Item .env.exemplo "$raiz\kit\.env" }

Write-Host '3/4 Remotion (node_modules)'
npm ci
npx remotion browser ensure   # o navegador do render, dentro de node_modules

Write-Host '4/4 Modelos de visão (tools/modelos)'
$modelos = @{
  'face_detection_yunet_2023mar.onnx' = 'https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx'
  'rvm_mobilenetv3_fp32.onnx'         = 'https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.onnx'
  'lama_fp32.onnx'                    = 'https://huggingface.co/Carve/LaMa-ONNX/resolve/main/lama_fp32.onnx'
}
foreach ($m in $modelos.Keys) {
  $alvo = "$raiz\tools\modelos\$m"
  if (-not (Test-Path $alvo)) { Invoke-WebRequest $modelos[$m] -OutFile $alvo }
}

# Cada molde usa o node_modules da raiz
Get-ChildItem "$raiz\moldes" -Directory | ForEach-Object {
  $nm = Join-Path $_.FullName 'node_modules'
  if (-not (Test-Path $nm)) { New-Item -ItemType Junction -Path $nm -Target "$raiz\node_modules" | Out-Null }
}
Write-Host 'Pronto. O modelo do Whisper (large-v3, ~3 GB) baixa sozinho para tools/.cache no primeiro vídeo.'
Write-Host 'Próximo passo: .venv\Scripts\python.exe tools\novo-video.py <modelo> <gravacao.mp4> <AAAA-MM-DD-tema>'
