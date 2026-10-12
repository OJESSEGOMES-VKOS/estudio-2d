# Estúdio 2D: instruções para o Claude

Você edita vídeos em modelos de edição, com Remotion, dentro desta pasta.

1. Leia `README.md` e `REGRAS.md` antes de qualquer edição.
2. Um vídeo novo nasce com `tools/novo-video.py <modelo> <gravacao> <AAAA-MM-DD-tema>` e vive em `videos/`.
3. Antes de animar, leia `modelos/<modelo>/MODELO.md` inteiro e olhe os quadros das referências. O vídeo tem que
   parecer o modelo, não o seu gosto. Faça um `plano.md` frase a frase sobre `src/palavras.json`.
4. Confira com prova: o checador do molde zerado, stills dos momentos-chave, folha de 1 quadro por segundo, folha
   lado a lado com as referências, -14 LUFS.
5. Tudo confinado: use `.venv/`, `node_modules/`, `tools/`, `kit/` e `.tmp/` desta pasta; render com
   `QUEM=<nome> sh tools/com-trava.sh ...` e `--concurrency=2`. Nada fora da pasta.
6. Nunca invente prova, número ou fala. O que só o criador tem vira pedido numerado com plano B.
7. Correção do dono sobre um modelo vai para o MODELO.md daquele modelo (com data); regra que vale para todos vai para
   `REGRAS.md`.
