# Protocolo de decupagem (youtubeedition01)

Como decupar uma referência de vídeo de YouTube para este modelo. Vale para as 4 referências de
origem e para qualquer referência nova que o dono mandar depois (o modelo cresce assim).

## Entrada (gerada por `medir.py`)
- `refN_tl_NN.png`: linha do tempo, 1 quadro a cada 3 s, 20 por folha (5 x 4), hora no canto (cada folha = 60 s).
- `refN_cortes.txt`: cada corte seco, com hora e duração da cena, e cortes por minuto (linha 2).
- `refN_rosto.txt`: por quadro, altura do maior rosto (>0,12 = rosto grande, A-roll; 0 a 0,12 = rosto pequeno, quase
  sempre a câmera no canto sobre a tela).
- `refN_roteiro.txt` ou `<Canal>_texto.txt`: a fala com tempo.
- O vídeo em `../referencias/` para tirar um quadro em resolução cheia quando a folha não deixa ler:
  `ffmpeg -loglevel error -ss MM:SS -i <video> -frames:v 1 <saida>.png` (um quadro por vez, nunca extração em massa).

## Taxonomia fixa (use estes códigos, para as referências se compararem)

**Rosto (A-roll)**
- `R1` rosto em plano normal, sem nada por cima
- `R2` punch-in: o mesmo plano com zoom de corte (ênfase, troca de ideia, esconder corte)
- `R3` rosto + texto grande (palavra-chave atrás ou na frente da pessoa, título cinético)
- `R4` rosto + elemento ao lado (print, ícone, card, chat, número) dividindo o quadro
- `R5` rosto em janela (câmera no canto) sobre tela, print ou B-roll
- `R6` rosto em outro plano/cenário (segunda câmera, gravação externa, de pé)

**Prova (vem de fora, o sistema quase nunca consegue fazer sozinho)**
- `P1` print estático de site, artigo, notícia, post, comentário (com zoom, grifo, seta, círculo)
- `P2` gravação de tela navegando ou usando uma ferramenta (cursor, digitação, cliques)
- `P3` print ou gravação de número/resultado (painel, receita, analytics, extrato)
- `P4` vídeo de terceiro (outro criador, entrevista, notícia de TV, trecho de filme ou série)
- `P5` produto ou objeto real filmado (o criador mostrando algo na mão, na mesa)

**Explicação (o sistema consegue fazer)**
- `E1` texto em tela cheia (frase, título, número gigante, lista)
- `E2` diagrama, fluxo, passo a passo, comparação lado a lado
- `E3` gráfico ou número animado (curva desenhando, barra, contador)
- `E4` ícones e ilustrações (emoji, ícone riscado, pictograma)
- `E5` encenação de interface recriada (chat, notificação, busca, mensagem, tweet recriado)

**Clima e ritmo**
- `C1` B-roll de stock / genérico
- `C2` B-roll próprio do criador (mãos, mesa, rua, rotina)
- `C3` meme, reação, gif, cena de filme como piada
- `C4` cartela de capítulo / transição gráfica / vinheta
- `C5` legenda (descrever estilo: palavra a palavra, frase, só palavras-chave)

## Saída: `refN_decupagem.md`, com estas seções

1. **Ficha**: canal, título, tema, duração, nicho, % rosto grande / pequeno / sem rosto (do `rosto.txt`), cortes secos e
   ritmo, e como é o A-roll (enquadramento, cenário, luz, microfone, 1 ou 2 câmeras, legenda sim/não).
2. **Estrutura do roteiro**: blocos com tempo (gancho, prova do gancho, promessa, contexto, corpo em partes, CTA no meio,
   fecho, CTA final). Para cada bloco: o que diz (citação curta em inglês) e a função dele.
3. **Linha do tempo de recursos**: tabela com TODO trecho em que a tela não é `R1` puro, do começo ao fim, sem pular
   minuto. Colunas: `hora | código | o que aparece (layout, como entra/sai, movimento) | fala no momento (citação) | gatilho`.
   O **gatilho** é a parte mais importante: o que na fala chamou aquele recurso (nome próprio citado, número, "look at
   this", afirmação que precisa de prova, passo de tutorial, objeção, piada, troca de capítulo...).
4. **Contagem**: quantas vezes cada código aparece e % aproximada do tempo; ritmo por fase (abertura 0-60 s, corpo, fim).
5. **Regras contextuais**: 8 a 20 regras do tipo "quando a fala [X], a tela faz [Y]", cada uma com 2+ horas de prova.
   Separe o que é regra do vídeo inteiro do que é truque de um momento só.
6. **Materiais**: liste os itens que só o criador pode dar (print específico, gravação da própria tela, vídeo citado,
   foto de resultado) e os que o sistema faz sozinho (texto, gráfico, ícone, chat recriado, stock). Para cada item que
   depende do criador, escreva como ele seria pedido (o quê, de onde tirar, em que formato, para qual hora do vídeo).
7. **Assinatura do criador**: o que nesse vídeo é marca pessoal daquele canal (bordão, cor, fonte, cenário, piada
   recorrente) e NÃO deve virar regra do modelo, só exemplo de como autenticidade aparece.
8. **O que não deu pra ver**: som (música, efeitos), transições finas, o que a folha a cada 3 s não pega. Sem inventar.

Regra de honestidade: só escreva o que viu na folha, no quadro ou no roteiro. Hora errada ou recurso suposto estraga o modelo.
