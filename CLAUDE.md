# Estúdio 2D: instruções para o Claude

Você edita vídeos em modelos de edição, com Remotion, dentro desta pasta.

**Cada modelo tem um arquivo só que manda: `modelos/<modelo>/<modelo>.md`.** Ele traz a cara do modelo, os números, as
regras (já com as correções do dono e as regras gerais que valem para ele), as opções e o passo a passo do vídeo novo.
Quando o código, uma mensagem de erro ou outro arquivo citar `MODELO.md`, `LEIA.md` de molde, `CORRECOES.md` ou
`REGRAS.md`, a resposta está no `<modelo>.md`. O código do molde (`moldes/<modelo>/`) é o vídeo aprovado em código; ele
não é a regra.

**O padrão de cada modelo é o vídeo aprovado dele.** Tudo o que aparece no aprovado (tratamento de cor, palco, efeitos
sonoros, ritmo de câmera) vem ligado; só fica desligado o que o `<modelo>.md` diz que é opção desligada.

1. Leia `README.md` e o `modelos/<modelo>/<modelo>.md` inteiro antes de qualquer edição.
2. Estude o vídeo aprovado do modelo em `modelos/<modelo>/referencia/`: o `referencia.mp4` (com a voz), a `folha.jpg`
   (1 quadro por segundo) e o `mapa.json` (rosto, luz e cortes medidos a cada 0,25 s). Assista, tire os quadros que
   precisar e meça. O `original.mp4` é o mesmo vídeo em qualidade cheia. O vídeo tem que parecer o modelo, não o seu
   gosto; mas a referência mostra o jeito, não um roteiro para copiar: as telas, os textos e os cortes nascem da fala nova.
3. Um vídeo novo nasce com `tools/novo-video.py <modelo> <gravacao> <AAAA-MM-DD-tema>` (nome que a transcrição errar:
   `--trocar Errado=Certo`; achou o erro depois, `tools/trocar.py videos/<pasta> Errado=Certo` corrige sem transcrever
   de novo) e vive em `videos/`. Ele já adapta a gravação ao ponto de partida do modelo
   (`tools/adaptar.py`: rosto no tamanho e na altura, luz de partida); não pule esse passo. Depois siga a seção do vídeo
   novo do `<modelo>.md`, com um `plano.md` frase a frase sobre `src/palavras.json`.
4. Confira com prova, nesta ordem, e só chame de pronto quando tudo passar:
   - o checador do molde zerado;
   - `tools/parece.py <video.mp4> <modelo>`: luz, cor, enquadramento do rosto e ritmo contra o aprovado (vídeo curto é
     comparado com os trechos do mesmo tamanho do aprovado). Reprovou, o vídeo não sai: corrija o que ele aponta;
   - olhe a folha lado a lado que o `parece.py` grava (aprovado em cima, o seu embaixo). Se a diferença salta aos olhos,
     não está pronto, mesmo com os números dentro;
   - folha de 1 quadro por segundo, -14 LUFS.
5. Tudo confinado: use `.venv/`, `node_modules/`, `tools/`, `kit/` e `.tmp/` desta pasta; render com
   `QUEM=<nome> sh tools/com-trava.sh ...` e `--concurrency=2`. Nada fora da pasta.
6. Nunca invente prova, número, fala, marca ou nome. Nome e @ na tela são os reais de quem fala, ou nenhum.
7. Correção do dono sobre um modelo entra no `<modelo>.md` daquele modelo, como regra (e, no estúdio local, também no
   `CORRECOES.md` dele, com data e as palavras do dono). Regra que vale para todos vai para `REGRAS.md` §0 e para o
   `<modelo>.md` de cada modelo em que se aplica. Mudou o vídeo aprovado de um modelo? Rode `tools/assinatura.py
   <modelo>` e, no estúdio local, `tools/referencia.py <modelo>`.
