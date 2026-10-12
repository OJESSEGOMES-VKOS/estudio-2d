#!/bin/sh
# mixa a voz (do render) com os efeitos 10 dB abaixo (~16 LU sob a voz) e normaliza em -14 LUFS / -1 dBTP (duas passadas).
# uso: sh scripts/mixar.sh out/so-voz.mp4 public/sfx.wav out/vitrine-modelodinamico01-sem-previas.mp4
set -e
V="$1"; S="$2"; O="$3"
MIX="[0:a]aresample=48000[v];[1:a]volume=-10dB,aresample=48000[s];[v][s]amix=inputs=2:normalize=0:duration=first"
J=$(ffmpeg -hide_banner -nostats -i "$V" -i "$S" -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y -i "$V" -i "$S" -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$O"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
