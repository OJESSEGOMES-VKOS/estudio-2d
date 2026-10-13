#!/bin/sh
# Voz na frente; trilha e efeitos são opção (níveis já gravados por scripts/som.py: trilha ~16 dB abaixo da voz, parte
# forte na virada). loudnorm -14 LUFS / -1 dBTP em duas passadas. A saída tem o tamanho do vídeo: a voz é completada
# com silêncio e nada corta o fim.
# uso: sh scripts/mixar.sh out/so-video.mp4 out/final.mp4 [public/trilha.wav] [public/efeitos.wav]   (sem extras: só a voz)
set -e
cd "$(dirname "$0")/.."
V="${1:-out/so-video.mp4}"; O="${2:-out/final.mp4}"
[ -f "$V" ] || { echo "não achei o vídeo $V (renderize antes)"; exit 1; }
[ -f public/voz.wav ] || { echo "falta public/voz.wav (sai do tools/novo-video.py)"; exit 1; }
shift 2 2>/dev/null || shift $#
ENT=""; ROT="[voz]"; n=1
for x in "$@"; do
  [ -f "$x" ] || { echo "não achei $x (scripts/som.py grava public/trilha.wav e public/efeitos.wav)"; exit 1; }
  n=$((n + 1)); ENT="$ENT -i $x"; ROT="$ROT[$n:a]"
done
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
MIX="[1:a]aresample=48000,highpass=f=70[voz];$ROT""amix=inputs=$n:duration=longest:normalize=0,aresample=48000,apad,atrim=0:$DUR"
[ $n = 1 ] && MIX="[1:a]aresample=48000,highpass=f=70,apad,atrim=0:$DUR"
J=$(ffmpeg -hide_banner -nostats -i "$V" -i public/voz.wav $ENT -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y -i "$V" -i public/voz.wav $ENT -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$O"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
