#!/bin/sh
# Voz na frente (passa-alta + compressão leve, como no dentista) + trilha 16 LU abaixo da voz com ducking (sidechain);
# loudnorm -14 LUFS / -1 dBTP em duas passadas (alvo TP -1,2: o AAC sobe ~0,1 dB).
# uso: sh scripts/mixar.sh out/so-video.mp4 out/vitrine-profissional01-sem-previas.mp4
set -e
cd "$(dirname "$0")/.."
V="$1"; O="$2"; VOZ=public/voz.wav; S=public/trilha.wav
lufs() { ffmpeg -hide_banner -nostats -i "$1" -af "$2ebur128" -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}'; }
PRE="highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,"
IV=$(lufs "$VOZ" "$PRE"); IS=$(lufs "$S" "")
G=$(awk "BEGIN{printf \"%.2f\", ($IV - 16) - ($IS)}")
echo "voz $IV LUFS, trilha $IS LUFS -> ganho da trilha $G dB"
MIX="[1:a]aresample=48000,${PRE}asplit=2[v][k];[2:a]aresample=48000,volume=${G}dB[s0];[s0][k]sidechaincompress=threshold=0.03:ratio=4:attack=30:release=400[s];[v][s]amix=inputs=2:normalize=0:duration=first"
J=$(ffmpeg -hide_banner -nostats -i "$V" -i "$VOZ" -i "$S" -filter_complex "$MIX,loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y -i "$V" -i "$VOZ" -i "$S" -filter_complex "$MIX,loudnorm=I=-14:TP=-1.2:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$O"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
