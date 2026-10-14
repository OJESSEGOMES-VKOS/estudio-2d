#!/bin/sh
# Voz na frente (passa-alta + compressão leve, como no dentista); loudnorm -14 LUFS / -1 dBTP em duas passadas (alvo
# TP -1,2: o AAC sobe ~0,1 dB). A saída tem a duração do vídeo: a voz é completada com silêncio e nada corta o fim.
# - Padrão (música desligada, REGRAS §6): voz + o whoosh do flash (public/efeitos.wav, do scripts/som.py), se existir.
# - Com a trilha (cama + whoosh, do scripts/som.py): 16 LU abaixo da voz, com ducking (sidechain). Foi assim na vitrine.
# O whoosh sozinho vai no mesmo ganho que a trilha teria (medido de public/trilha.wav).
# uso: sh scripts/mixar.sh out/so-video.mp4 out/final.mp4                     (voz + whoosh)
#      sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4   (com a música)
set -e
cd "$(dirname "$0")/.."
if [ $# -ge 3 ]; then V="$1"; S="$2"; O="$3"; else V="${1:-out/so-video.mp4}"; S=""; O="${2:-out/final.mp4}"; fi
VOZ=public/voz.wav
REF="$S"
if [ -z "$S" ] && [ -f public/efeitos.wav ]; then S=public/efeitos.wav; REF=public/trilha.wav; fi
lufs() { ffmpeg -nostdin -hide_banner -nostats -i "$1" -af "$2ebur128" -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}'; }
PRE="highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
if [ -n "$S" ]; then
  [ -f "$REF" ] || { echo "falta $REF para medir o ganho (rode scripts/som.py)"; exit 1; }
  IV=$(lufs "$VOZ" "$PRE"); IS=$(lufs "$REF" "")
  G=$(awk "BEGIN{printf \"%.2f\", ($IV - 16) - ($IS)}")
  echo "voz $IV LUFS, trilha $IS LUFS -> ganho $G dB em $S"
  set -- -i "$V" -i "$VOZ" -i "$S"
  MIX="[1:a]aresample=48000,${PRE}apad,asplit=2[v][k];[2:a]aresample=48000,volume=${G}dB,apad[s0];[s0][k]sidechaincompress=threshold=0.03:ratio=4:attack=30:release=400[s];[v][s]amix=inputs=2:normalize=0:duration=first,atrim=0:$DUR"
else
  echo "só a voz"
  set -- -i "$V" -i "$VOZ"
  MIX="[1:a]aresample=48000,${PRE}apad,atrim=0:$DUR"
fi
J=$(ffmpeg -nostdin -hide_banner -nostats "$@" -filter_complex "$MIX,loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -nostdin -hide_banner -loglevel error -y "$@" -filter_complex "$MIX,loudnorm=I=-14:TP=-1.2:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -movflags +faststart "$O"
ffmpeg -nostdin -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
