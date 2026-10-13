# Estúdio 2D: instruções para o Claude

Você edita vídeos em modelos de edição, com Remotion, dentro desta pasta.

**Quem manda, em ordem** (o de cima vence o de baixo):
1. `modelos/<modelo>/CORRECOES.md`: as correções do dono naquele modelo, e `REGRAS.md` §0, as que valem para todos.
2. `modelos/<modelo>/MODELO.md`: a receita medida do modelo.
3. O código do molde (`moldes/<modelo>/`): é o vídeo aprovado em código, calibrado numa gravação; não é a regra.

**O padrão de cada modelo é o vídeo aprovado dele mais as correções.** Tudo o que aparece no vídeo aprovado (tratamento
de cor, palco, efeitos sonoros, ritmo de câmera) vem ligado; só fica desligado o que uma correção mandou desligar.

1. Leia `README.md`, `REGRAS.md` e o `CORRECOES.md` do modelo antes de qualquer edição.
2. Um vídeo novo nasce com `tools/novo-video.py <modelo> <gravacao> <AAAA-MM-DD-tema>` e vive em `videos/`. Ele já
   adapta a gravação ao ponto de partida do modelo (`tools/adaptar.py`: rosto no tamanho e na altura, luz de partida);
   não pule esse passo.
3. Antes de animar, leia `modelos/<modelo>/MODELO.md` inteiro e olhe os quadros das referências (no estúdio aberto,
   que não traz as referências de terceiros: `modelos/<modelo>/referencia.jpg`, 8 quadros do vídeo aprovado do
   modelo). O vídeo tem que parecer o modelo, não o seu gosto. Faça um `plano.md` frase a frase sobre `src/palavras.json`,
   seguindo a gramática do vídeo aprovado (ex.: alternância de plano aberto e fechado, onde ficam os destaques altos).
4. Confira com prova, nesta ordem, e só chame de pronto quando tudo passar:
   - o checador do molde zerado;
   - `tools/parece.py <video.mp4> <modelo>`: luz, cor, enquadramento do rosto e ritmo contra a assinatura do modelo
     (`modelos/<modelo>/assinatura.json`). Reprovou, o vídeo não sai: corrija o que ele aponta;
   - olhe a folha lado a lado que o `parece.py` grava (o 1º segundo e 6 momentos, aprovado em cima, o seu embaixo).
     Se a diferença salta aos olhos, não está pronto, mesmo com os números dentro;
   - folha de 1 quadro por segundo, -14 LUFS.
5. Tudo confinado: use `.venv/`, `node_modules/`, `tools/`, `kit/` e `.tmp/` desta pasta; render com
   `QUEM=<nome> sh tools/com-trava.sh ...` e `--concurrency=2`. Nada fora da pasta.
6. Nunca invente prova, número, fala ou nome. Nome e @ na tela são os reais de quem fala, ou nenhum.
7. Correção do dono sobre um modelo vai para o `CORRECOES.md` daquele modelo, com data e as palavras dele; regra que
   vale para todos vai para `REGRAS.md` §0. Mudou o vídeo aprovado de um modelo? Rode `tools/assinatura.py <modelo>`.
