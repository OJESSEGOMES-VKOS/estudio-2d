#!/bin/sh
# Voz de public/voz.wav na frente e o som de scripts/som.py com ducking (receita do vídeo aprovado: depois do ducking ele
# fica ~16 LU abaixo da voz); loudnorm -14 LUFS / -1 dBTP em duas passadas.
# O padrão do modelo é voz + os efeitos dele (whoosh nos desfoques e no chicote, sopro no flash, impacto nas palavras
# vermelhas): eles são parte da identidade e o som.py os grava sempre em public/trilha.wav. A música (som.py --cama) e o
# glitch do VHS (som.py --efeitos) são opção, desligados por padrão.
# A saída tem o tamanho do vídeo: o vídeo nunca é cortado; a voz e o som são completados com silêncio até o fim dele.
# uso: sh scripts/mixar.sh out/so-video.mp4 out/final.mp4 [som.wav]
#   sem o 3º argumento usa public/trilha.wav (rode scripts/som.py antes); com "-" sai só a voz, sem os efeitos.
set -e
cd "$(dirname "$0")/.."
V="${1:?uso: sh scripts/mixar.sh <video.mp4> <saida.mp4> [som.wav | -]}"; O="${2:?uso: sh scripts/mixar.sh <video.mp4> <saida.mp4> [som.wav | -]}"; S="${3:-public/trilha.wav}"
[ "$S" = "-" ] && S=""
[ -f "$V" ] || { echo "não achei o vídeo $V"; exit 1; }
[ -f public/voz.wav ] || { echo "não achei public/voz.wav (a voz do contrato)"; exit 1; }
[ -z "$S" ] || [ -f "$S" ] || { echo "não achei o som $S: gere com ../../.venv/Scripts/python.exe scripts/som.py (ou passe - para sair só a voz)"; exit 1; }
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
if [ -n "$S" ]; then
	# o som é feito para a duração deste vídeo; outra duração quer dizer que ele é de outra fala (o plano do som não foi refeito)
	DS=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$S")
	awk -v a="$DUR" -v b="$DS" 'BEGIN { d = a - b; exit (d < -0.1 || d > 0.1) }' || { echo "$S tem $DS s e o vídeo $DUR s: o som é de outra fala. Refaça o PLANO DO SOM e rode scripts/som.py (LEIA.md, Vídeo novo)."; exit 1; }
	echo "voz + $S"
else
	echo "só a voz"
fi
VOZ="[1:a]aresample=48000,highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2"
set -- -i "$V" -i public/voz.wav
if [ -n "$S" ]; then
	set -- "$@" -i "$S"
	MIX="$VOZ,asplit=2[voz][chave];[2:a]aresample=48000,volume=-6dB[tri];[tri][chave]sidechaincompress=threshold=0.06:ratio=2:attack=40:release=400[triduck];[voz][triduck]amix=inputs=2:duration=longest:normalize=0"
else
	MIX="$VOZ"
fi
MIX="$MIX,apad,atrim=end=$DUR"
J=$(ffmpeg -hide_banner -nostats "$@" -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y "$@" -filter_complex "$MIX,loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$O"
echo "vídeo $DUR s -> $O ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$O") s)"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
