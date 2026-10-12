#!/bin/sh
# Fila de render do estúdio: espera a trava .tmp/render.lock ficar livre, cria a sua, roda o comando e apaga só a sua.
# uso: QUEM=<nome> sh tools/com-trava.sh <comando...>   (rodar de qualquer pasta dentro do estúdio)
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
TRAVA="$RAIZ/.tmp/render.lock"
mkdir -p "$RAIZ/.tmp"
export TEMP="$RAIZ/.tmp" TMP="$RAIZ/.tmp"
until mkdir "$TRAVA" 2>/dev/null; do echo "trava ocupada, esperando..."; sleep 20; done
echo "${QUEM:-agente} $$ $(date)" > "$TRAVA/dono.txt"
trap 'rm -rf "$TRAVA"' EXIT INT TERM
"$@"
