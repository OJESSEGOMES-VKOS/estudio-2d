#!/bin/sh
# Mixa a voz com os efeitos de scripts/som.py 10 dB abaixo (~16 LU sob a voz) e normaliza em -14 LUFS / -1 dBTP (duas
# passadas). A voz vem do próprio render (prop voz: true) ou, se o render saiu sem som, de public/voz.wav.
# A saída tem o tamanho do vídeo: o vídeo nunca é cortado; a voz e os efeitos são completados com silêncio até o fim dele.
# Este modelo não tem música; os efeitos são do modelo (MODELO §5) e entram passando o 3º argumento.
# uso: sh scripts/mixar.sh out/so-voz.mp4 out/final.mp4 [public/sfx.wav]   (com prévias: public/sfx_previas.wav)
set -e
cd "$(dirname "$0")/.."
V="${1:?uso: sh scripts/mixar.sh <video.mp4> <saida.mp4> [efeitos.wav]}"; O="${2:?uso: sh scripts/mixar.sh <video.mp4> <saida.mp4> [efeitos.wav]}"; S="$3"
[ -f "$V" ] || { echo "não achei o vídeo $V"; exit 1; }
[ -z "$S" ] || [ -f "$S" ] || { echo "não achei os efeitos $S (gere com scripts/som.py ou rode sem eles)"; exit 1; }
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
if [ -n "$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$V")" ]; then
	set -- -i "$V"; VOZ="[0:a]aresample=48000"
else
	[ -f public/voz.wav ] || { echo "o render saiu sem som e não achei public/voz.wav"; exit 1; }
	set -- -i "$V" -i public/voz.wav; VOZ="[1:a]aresample=48000"
fi
if [ -n "$S" ]; then
	N=$(($# / 2)); set -- "$@" -i "$S"
	MIX="$VOZ[v];[$N:a]volume=-10dB,aresample=48000[s];[v][s]amix=inputs=2:normalize=0:duration=first"
else
	MIX="$VOZ"
fi
MIX="$MIX,apad,atrim=end=$DUR"
J=$(ffmpeg -hide_banner -nostats "$@" -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y "$@" -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -movflags +faststart "$O"
echo "vídeo $DUR s -> $O ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$O") s)"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
