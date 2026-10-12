# Protocolo de decupagem de vídeo curto (Reel, Short, até ~1 min)

Para criar um modelo a partir de referências curtas. Entrada gerada por `tools/medir_curto.py` dentro de
`modelos/<modelo>/analise/`: `refN_tl_NN.png` (2 quadros por segundo, hora no canto), `refN_cortes.txt`,
`refN_rosto.txt`, `refN_som.txt`, `refN_fala.txt`. O vídeo está em `../referencias/refN.mp4`; para ler um detalhe,
tire UM quadro em resolução cheia: `ffmpeg -loglevel error -ss S.SS -i ../referencias/refN.mp4 -frames:v 1 refN_q/S.SS.png`.

## A lição que este protocolo carrega

No youtubeedition01 o dono disse: *"não senti que você usou o modelo que criamos, parece que você criou outro"*. O
modelo tinha boas regras de *quando* cada recurso entra, mas descrevia pouco *como ele é na tela*, e a edição saiu
com a cara do editor. Por isso a decupagem curta tem duas metades com o mesmo peso:

1. **A receita visual medida**: o suficiente para outra pessoa reconstruir um quadro da referência sem ver o vídeo.
2. **Os gatilhos**: o que na fala chama cada recurso.

E a identidade de cor do modelo é **própria do modelo** (tirada das referências, não do dono nem do cliente), a não ser
que o perfil do criador diga outra coisa.

## Saída: `refN_decupagem.md`

1. **Ficha**: formato (9:16 ou 16:9), duração, idioma, assunto, quem fala (1 pessoa, 2 no podcast, narrador, sem fala),
   % com rosto, cortes e mediana, trilha por baixo (chão de som acima de -45 dB = provável trilha).
2. **Linha do tempo completa**: uma linha por trecho (de 0 ao fim, sem buraco), com `hora | o que está na tela | fala |
   gatilho`. Em vídeo curto, cada segundo conta.
3. **A receita visual medida** (o coração da metade 1):
   - **Layout**: onde fica a pessoa (fração do quadro), tamanho do rosto, enquadramento, divisão de tela, fundo.
   - **Legenda**: posição (y em % da altura), tamanho da letra (% da altura do quadro), fonte (família aproximada:
     grotesca, serifa, condensada, arredondada), peso, caixa (alta/baixa), cor do texto, contorno ou sombra, quantas
     palavras por vez, destaque da palavra-chave (cor, escala, fundo), animação de entrada.
   - **Tipografia de títulos e textos grandes**: mesma descrição.
   - **Paleta**: 3 a 6 cores com hex aproximado (meça num quadro cheio), e onde cada uma aparece.
   - **Elementos gráficos**: cada tipo, com forma, tamanho, posição, cor, borda, sombra.
   - **Movimento**: como as coisas entram e saem (corte, escala com quique, deslize, máscara, digitação), velocidade
     (rápido < 0,2 s, médio, lento > 0,6 s), movimento de câmera (zoom de corte, zoom contínuo, tremida, paralaxe).
   - **Transições** entre planos.
   - **Ritmo**: trocas de tela por segundo, maior trecho parado.
   - **Som** que dá pra inferir (trilha, silêncio, efeito marcado pela legenda automática).
4. **Gatilhos**: regras "quando a fala/história faz X, a tela faz Y", com a hora de prova.
5. **O que é assinatura do criador** (cenário, bordão, logo, personagem): não vira regra, só exemplo.
6. **Materiais**: o que só o criador pode dar e o que o sistema faz sozinho.
7. **O que não deu pra ver** (sem inventar).

Regra de honestidade: só escreva o que viu. Hex, tamanho e posição saem de quadro cheio medido, não de impressão.
