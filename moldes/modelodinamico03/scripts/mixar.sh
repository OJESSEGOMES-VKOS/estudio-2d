#!/bin/sh
# voz na frente + trilha ~16 dB abaixo com ducking (receita do vídeo aprovado), loudnorm -14 LUFS / -1 dBTP em duas passadas.
# uso: sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/vitrine-modelodinamico03-sem-previas.mp4
set -e
cd "$(dirname "$0")/.."
V="${1:-out/so-video.mp4}"; S="${2:-public/trilha.wav}"; O="${3:-out/vitrine-modelodinamico03-sem-previas.mp4}"
MIX="[1:a]aresample=48000,highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,asplit=2[voz][chave];\
[2:a]aresample=48000,volume=-6dB[tri];\
[tri][chave]sidechaincompress=threshold=0.06:ratio=2:attack=40:release=400[triduck];\
[voz][triduck]amix=inputs=2:duration=longest:normalize=0"
J=$(ffmpeg -hide_banner -nostats -i "$V" -i public/voz.wav -i "$S" -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y -i "$V" -i public/voz.wav -i "$S" -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$O"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
