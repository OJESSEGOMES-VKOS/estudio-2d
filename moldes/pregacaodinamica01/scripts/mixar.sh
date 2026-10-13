#!/bin/sh
# Voz na frente; loudnorm -14 LUFS / -1 dBTP em duas passadas. A saída tem a duração do vídeo: a voz é completada com
# silêncio e nada corta o fim.
# - Padrão (música desligada, REGRAS §6): voz + os golpes do modelo (public/efeitos.wav, do scripts/som.py), se existir.
# - Com a trilha (cama + golpes, do scripts/som.py): ~16 dB abaixo da voz, com ducking. Foi assim na vitrine.
# uso: sh scripts/mixar.sh out/so-video.mp4 out/final.mp4                     (voz + golpes)
#      sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4   (com a música)
set -e
cd "$(dirname "$0")/.."
if [ $# -ge 3 ]; then V="$1"; S="$2"; O="$3"; else V="${1:-out/so-video.mp4}"; S=""; O="${2:-out/final.mp4}"; fi
if [ -z "$S" ] && [ -f public/efeitos.wav ]; then S=public/efeitos.wav; fi
G="${TRILHA_DB:-2}"  # trilha crua mede -32,2 LUFS: +2 dB a deixa ~16 dB abaixo da voz (os golpes sozinhos vão no mesmo ganho)
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
if [ -n "$S" ]; then
  # o som é feito para a duração deste vídeo; outra duração quer dizer que ele é de outra fala (o plano do som não foi refeito)
  DS=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$S")
  awk -v a="$DUR" -v b="$DS" 'BEGIN { d = a - b; exit (d < -0.1 || d > 0.1) }' || { echo "$S tem $DS s e o vídeo $DUR s: o som é de outra fala. Refaça o plano do som e rode scripts/som.py (LEIA.md, Vídeo novo)."; exit 1; }
fi
VOZ="[1:a]aresample=48000,highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,apad"
if [ -n "$S" ]; then
  echo "voz + $S"
  set -- -i "$V" -i public/voz.wav -i "$S"
  MIX="$VOZ,asplit=2[voz][chave];[2:a]aresample=48000,volume=${G}dB,apad[tri];\
[tri][chave]sidechaincompress=threshold=0.06:ratio=2:attack=40:release=400[triduck];\
[voz][triduck]amix=inputs=2:duration=first:normalize=0,atrim=0:$DUR"
else
  echo "só a voz"
  set -- -i "$V" -i public/voz.wav
  MIX="$VOZ,atrim=0:$DUR"
fi
J=$(ffmpeg -hide_banner -nostats "$@" -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y "$@" -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$O"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
