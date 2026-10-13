#!/bin/sh
# Fila de render do estúdio: espera a trava .tmp/render.lock ficar livre, cria a sua, roda o comando e apaga só a sua.
# uso: QUEM=<nome> sh tools/com-trava.sh <comando...>   (rodar de qualquer pasta dentro do estúdio)
# No fim (deu certo ou não) apaga o que o Remotion deixa no .tmp a cada render: a cópia da pasta public
# (remotion-*-assets*, ~100 MB por render ou still), o pacote (remotion-webpack-bundle-*) e o perfil do navegador.
# Sem essa limpeza, cada `remotion still` deixava uma cópia da mídia e o disco enchia.
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
TRAVA="$RAIZ/.tmp/render.lock"
mkdir -p "$RAIZ/.tmp"
export TEMP="$RAIZ/.tmp" TMP="$RAIZ/.tmp"
until mkdir "$TRAVA" 2>/dev/null; do echo "trava ocupada, esperando..."; sleep 20; done
echo "${QUEM:-agente} $$ $(date)" > "$TRAVA/dono.txt"
limpar() {
  # só quem tem a trava renderiza, então tudo isso é deste comando ou sobra de um render que caiu
  rm -rf "$RAIZ"/.tmp/remotion-v*-assets* "$RAIZ"/.tmp/remotion-webpack-bundle-* \
         "$RAIZ"/.tmp/puppeteer_dev_chrome_profile-* "$RAIZ"/.tmp/react-motion-render* 2>/dev/null
  find "$RAIZ/.tmp" -maxdepth 1 -type f -name '*.tmp' -size 0 -delete 2>/dev/null
  rm -rf "$TRAVA"
}
trap limpar EXIT INT TERM
"$@"
