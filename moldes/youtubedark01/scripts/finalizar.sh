#!/bin/sh
# O render do Remotion já sai com voz + trilha + efeitos (props musica/efeitos). Aqui só o loudnorm -14 LUFS / -1 dBTP
# em duas passadas, vídeo copiado. uso: sh scripts/finalizar.sh out/bruto.mp4 [out/final.mp4]
set -e
cd "$(dirname "$0")/.."
V="${1:-out/bruto.mp4}"; O="${2:-out/final.mp4}"
J=$(ffmpeg -nostdin -hide_banner -nostats -i "$V" -af "loudnorm=I=-14:TP=-1.3:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -nostdin -hide_banner -loglevel error -y -i "$V" -af "loudnorm=I=-14:TP=-1.3:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" \
  -map 0:v -map 0:a -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$O"
ffmpeg -nostdin -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
