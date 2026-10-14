#!/bin/sh
# Mixa a voz com a trilha de audio/compor.py: a trilha entra 16 LU abaixo da voz e ainda abaixa sob a voz (sidechain leve,
# como no v4); depois loudnorm -14 LUFS / -1 dBTP em duas passadas (alvo TP -1,2: o AAC sobe ~0,1 dB).
# A voz vem do próprio render (prop voz: true) ou, se o render saiu sem som, de public/voz.wav.
# A saída tem o tamanho do vídeo: o vídeo nunca é cortado; a voz e a trilha são completadas com silêncio até o fim dele.
# uso: sh scripts/mixar.sh out/so-voz.mp4 out/final.mp4 [public/trilha.wav]
#   sem o 3º argumento sai só a voz (música e efeitos são opção).
set -e
cd "$(dirname "$0")/.."
V="${1:?uso: sh scripts/mixar.sh <video.mp4> <saida.mp4> [trilha.wav]}"; O="${2:?uso: sh scripts/mixar.sh <video.mp4> <saida.mp4> [trilha.wav]}"; S="$3"
[ -f "$V" ] || { echo "não achei o vídeo $V"; exit 1; }
[ -z "$S" ] || [ -f "$S" ] || { echo "não achei a trilha $S (gere com audio/compor.py ou rode sem ela)"; exit 1; }
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
lufs() { ffmpeg -nostdin -hide_banner -nostats -i "$1" -map 0:a -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}'; }
if [ -n "$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$V")" ]; then
	VZ="$V"; set -- -i "$V"
else
	[ -f public/voz.wav ] || { echo "o render saiu sem som e não achei public/voz.wav"; exit 1; }
	VZ=public/voz.wav; set -- -i "$V" -i public/voz.wav
fi
N=$(($# / 2))  # o índice da próxima entrada (a voz é a anterior)
VOZ="[$((N - 1)):a]aresample=48000"
if [ -n "$S" ]; then
	IV=$(lufs "$VZ"); IS=$(lufs "$S")
	G=$(awk "BEGIN{printf \"%.2f\", ($IV - 16) - ($IS)}")
	echo "voz $IV LUFS, trilha $IS LUFS -> ganho da trilha $G dB"
	set -- "$@" -i "$S"
	MIX="$VOZ,asplit=2[v][k];[$N:a]aresample=48000,volume=${G}dB[s0];[s0][k]sidechaincompress=threshold=0.03:ratio=3:attack=20:release=350[s];[v][s]amix=inputs=2:normalize=0:duration=first"
else
	MIX="$VOZ"
fi
MIX="$MIX,apad,atrim=end=$DUR"
J=$(ffmpeg -nostdin -hide_banner -nostats "$@" -filter_complex "$MIX,loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -nostdin -hide_banner -loglevel error -y "$@" -filter_complex "$MIX,loudnorm=I=-14:TP=-1.2:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -movflags +faststart "$O"
echo "vídeo $DUR s -> $O ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$O") s)"
ffmpeg -nostdin -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
