#!/bin/sh
# Voz na frente + trilha (~16 dB abaixo, parte forte na virada) + efeitos, níveis já gravados por scripts/som.py.
# loudnorm -14 LUFS / -1 dBTP em duas passadas.
# uso: sh scripts/mixar.sh out/so-video.mp4 out/vitrine-ilustrations01.mp4
set -e
cd "$(dirname "$0")/.."
V="${1:-out/so-video.mp4}"; O="${2:-out/vitrine-ilustrations01.mp4}"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
MIX="[1:a]aresample=48000,highpass=f=70[voz];[2:a]aresample=48000[tri];[3:a]aresample=48000[fx];\
[voz][tri][fx]amix=inputs=3:duration=longest:normalize=0,apad,atrim=0:$DUR"
J=$(ffmpeg -hide_banner -nostats -i "$V" -i public/voz.wav -i public/trilha.wav -i public/efeitos.wav -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y -i "$V" -i public/voz.wav -i public/trilha.wav -i public/efeitos.wav -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$O"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
