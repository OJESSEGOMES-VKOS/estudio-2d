# Instala o Estúdio 2D dentro desta pasta (Windows, PowerShell 7).
# Precisa ter: Python 3.11 ou 3.12, Node.js 20+ e ffmpeg no PATH.
# Uso: pwsh -File instalar.ps1  (descobre sozinho a placa NVIDIA; -Gpu força)
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

Write-Host '1/5 Python do estúdio (.venv)'
if (-not (Test-Path "$raiz\.venv")) { python -m venv "$raiz\.venv" }
& "$raiz\.venv\Scripts\python.exe" -m pip install --upgrade pip
& "$raiz\.venv\Scripts\python.exe" -m pip install -r requirements.txt
if (-not $Gpu -and (Get-Command nvidia-smi -ErrorAction SilentlyContinue)) { $Gpu = $true; Write-Host '   placa NVIDIA encontrada: transcrição acelerada' }
if ($Gpu) { & "$raiz\.venv\Scripts\python.exe" -m pip install -r requirements-gpu.txt }

Write-Host '2/5 Python do kit de material (kit/.venv)'
if (-not (Test-Path "$raiz\kit\.venv")) { python -m venv "$raiz\kit\.venv" }
& "$raiz\kit\.venv\Scripts\python.exe" -m pip install --upgrade pip
& "$raiz\kit\.venv\Scripts\python.exe" -m pip install -r requirements-kit.txt
if (-not (Test-Path "$raiz\kit\.env")) { Copy-Item .env.exemplo "$raiz\kit\.env" }

Write-Host '3/5 Remotion (node_modules)'
npm ci
npx remotion browser ensure   # o navegador do render, dentro de node_modules

Write-Host '4/5 Modelos de visão (tools/modelos)'
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
Write-Host '5/5 Modelo de transcrição (tools/.cache)'
$env:HF_HOME = "$raiz\tools\.cache\huggingface"
$whisper = if ($Gpu) { 'large-v3' } else { 'medium' }   # sem placa, a transcrição usa o medium
& "$raiz\.venv\Scripts\python.exe" -c "from faster_whisper import download_model; download_model('$whisper')"
Remove-Item -Recurse -Force "$raiz\.tmp\pip-cache" -ErrorAction SilentlyContinue   # só servia para instalar
Write-Host 'Pronto. Para editar, peça ao Claude: edite meu vídeo <gravacao.mp4> no <modelo>.'
