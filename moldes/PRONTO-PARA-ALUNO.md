# Molde pronto para o aluno (a lista que todo molde cumpre)

Nasceu do teste de 2026-10-13: três vídeos feitos só com o estúdio aberto, em `videos/2026-10-13-teste-do-aberto/`.
Os agentes só terminaram contornando o código à mão. Um molde está pronto quando uma pessoa que nunca viu Remotion, com
o Claude dela, faz um vídeo novo sem tropeçar. **Nada aqui muda a cara do modelo:** o plano aprovado tem de sair igual,
pixel a pixel.

1. **Fala nova não quebra com erro críptico.**
   - Se o plano não bate com a fala, o molde para logo ao carregar e diz em português o que refazer: qual lista, em qual
     arquivo e em qual linha. Nada de `TypeError` ou `undefined`.
   - Ao comparar texto do plano com a fala, ignore maiúscula, acento e pontuação, porque o Whisper varia.
   - Nada fica preso à fala de origem: a duração e o último quadro vêm da voz ou das palavras, sem `ULTIMO_QUADRO = 905`.
     Também não vale `PLANOS[9]` nem índice fixo de palavra fora das listas do plano.
2. **Partes opcionais se desligam sem mexer em código de desenho.**
   - Prévias, contador, virada, fecho, escurecimento final e o que mais depender da fala de origem.
   - Cada uma se desliga por uma prop ou por uma lista vazia, documentada no `<modelo>.md`. Lista vazia ou prop desligada
     não pode quebrar nada.
3. **O tempo de leitura é conferido.** O conferidor do molde verifica as regras do `REGRAS.md`: bloco ≥ 1,5 s, cada
   palavra ≥ 0,4 s na tela, no máximo 4 linhas e 2 posições, e a zona segura. Quando falha, diz o que mexer.
4. **O conferidor é confiável.**
   - Sai com código diferente de 0 quando reprova.
   - Apaga os temporários mesmo quando dá erro.
   - Não presume partes que o vídeo não tem.
   - Confere com as opções que o vídeo vai usar (as do padrão do modelo, item 5).
5. **O padrão de cada chave é o do vídeo aprovado, mais as correções do dono.**
   - Os `defaultProps` do molde e os exemplos de render do `<m>.md` são as props com que o vídeo aprovado foi feito
     (tratamento de cor, efeitos, música, efeito de fundo). Só vem desligado o que o `modelos/<m>/<m>.md` diz que é opção.
     Erro que este item corrige: na rodada de 2026-10-13 tudo nasceu desligado, e o vídeo do aluno saiu sem a cara do
     modelo (o modelodinamico03 sem o tratamento quente).
   - `scripts/mixar.sh` funciona com e sem trilha; com trilha, ela fica cerca de 16 dB abaixo da voz.
   - Nunca corta o fim do vídeo: a saída tem o tamanho do vídeo, e a voz é completada com silêncio.
6. **Nenhum dado pessoal fixo.** Nome, @ e marca do Jessé ou de cliente viram prop. O padrão é vazio, e vazio esconde o
   elemento.
7. **Toda mídia que não vai para o aluno tem caminho.** Tudo o que o molde lê em `public/` além do contrato (`fala.mp4`,
   `voz.wav`, `src/palavras.json`, `src/rosto.json`) faz uma de três coisas:
   - é gerado por uma ferramenta do estúdio, como `tools/previa.py` para as prévias ou o `kit/`;
   - é opcional, com um plano B que o molde desenha sozinho;
   - ou está escrito no `<m>.md` com o comando exato para conseguir.
8. **O `<m>.md` tem a seção "Como fazer um vídeo novo".**
   - O passo a passo: o que refazer no plano (arquivo e linha), as chaves, o conferidor, o render com
     `tools/com-trava.sh` e a mixagem.
   - O exemplo de render usa os padrões do modelo, nunca `previas: true` sem as prévias.
9. **Prova.** Antes e depois da mudança, os mesmos quadros do plano aprovado, renderizados com a mídia do molde, dão o
   mesmo hash. Além disso, o molde carregado com uma fala diferente para com a mensagem clara do item 1.
10. **Parece o modelo com outra gravação.** Um vídeo feito pelo caminho do aluno (`tools/novo-video.py`, que adapta a
    gravação) com uma gravação diferente da do vídeo aprovado passa no `tools/parece.py` e, na folha lado a lado, não
    tem diferença que salte aos olhos no 1º segundo nem nos momentos-chave. Os conferidores de regra (tempo de leitura,
    zona segura) não provam isso: os três vídeos do teste de 2026-10-13 passaram neles e não pareciam o modelo.
