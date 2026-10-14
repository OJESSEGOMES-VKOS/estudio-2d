#!/bin/sh
# Voz na frente; trilha opcional (~16 dB abaixo da voz, com ducking); loudnorm -14 LUFS / -1 dBTP em duas passadas.
# A saída tem o tamanho do vídeo: a voz é completada com silêncio, nada corta o fim.
# uso: sh scripts/mixar.sh out/so-video.mp4 out/final.mp4 [public/trilha.wav]   (sem o 3º argumento: só a voz)
set -e
cd "$(dirname "$0")/.."
V="${1:-out/so-video.mp4}"; O="${2:-out/final.mp4}"; S="$3"
[ -f "$V" ] || { echo "não achei o vídeo $V (renderize antes)"; exit 1; }
[ -f public/voz.wav ] || { echo "falta public/voz.wav (sai do tools/novo-video.py)"; exit 1; }
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
VOZ="[1:a]aresample=48000,highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2"
if [ -n "$S" ]; then
  [ -f "$S" ] || { echo "não achei a trilha $S (scripts/trilha.py grava public/trilha.wav)"; exit 1; }
  MIX="$VOZ,asplit=2[voz][chave];[2:a]aresample=48000,volume=-3.5dB[tri];\
[tri][chave]sidechaincompress=threshold=0.06:ratio=2:attack=40:release=400[triduck];\
[voz][triduck]amix=inputs=2:duration=longest:normalize=0,apad,atrim=0:$DUR"
else
  MIX="$VOZ,apad,atrim=0:$DUR"
fi
J=$(ffmpeg -nostdin -hide_banner -nostats -i "$V" -i public/voz.wav ${S:+-i "$S"} -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -nostdin -hide_banner -loglevel error -y -i "$V" -i public/voz.wav ${S:+-i "$S"} -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$O"
ffmpeg -nostdin -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
