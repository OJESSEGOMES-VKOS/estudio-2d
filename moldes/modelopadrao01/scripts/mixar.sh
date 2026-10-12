#!/bin/sh
# Mixa a voz (do render) com a trilha do v4 (cama + efeitos): a trilha entra 16 LU abaixo da voz e ainda abaixa
# sob a voz (sidechain leve, como no v4); depois loudnorm -14 LUFS / -1 dBTP em duas passadas (alvo TP -1,2: o AAC sobe ~0,1 dB).
# uso: sh scripts/mixar.sh out/so-voz.mp4 public/trilha.wav out/vitrine-modelopadrao01-sem-previas.mp4
set -e
V="$1"; S="$2"; O="$3"
lufs() { ffmpeg -hide_banner -nostats -i "$1" -map 0:a -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}'; }
IV=$(lufs "$V"); IS=$(lufs "$S")
G=$(awk "BEGIN{printf \"%.2f\", ($IV - 16) - ($IS)}")
echo "voz $IV LUFS, trilha $IS LUFS -> ganho da trilha $G dB"
MIX="[0:a]aresample=48000,asplit=2[v][k];[1:a]aresample=48000,volume=${G}dB[s0];[s0][k]sidechaincompress=threshold=0.03:ratio=3:attack=20:release=350[s];[v][s]amix=inputs=2:normalize=0:duration=first"
J=$(ffmpeg -hide_banner -nostats -i "$V" -i "$S" -filter_complex "$MIX,loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y -i "$V" -i "$S" -filter_complex "$MIX,loudnorm=I=-14:TP=-1.2:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$O"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
