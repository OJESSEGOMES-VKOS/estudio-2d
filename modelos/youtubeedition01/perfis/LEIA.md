# Perfis: a autenticidade de cada criador

O youtubeedition01 edita qualquer criador, mas o vídeo tem que sair com a cara **daquele** criador. Essa cara
mora aqui, um perfil por criador (`perfis/<criador>/PERFIL.md`), e cresce a cada vídeo editado.

**Os perfis são dado do usuário: não vão no pacote de entrega do modelo.**

## As três camadas (quem manda em quê)

| Camada | Onde | O que guarda | Quem muda |
|---|---|---|---|
| **Núcleo** | `youtubeedition01.md` | O catálogo de recursos, os gatilhos (quando cada recurso entra), as regras de leitura, de tempo e de honestidade, a conferência | Só o dono do sistema, por decisão explícita, como versão nova (nunca por causa de um criador) |
| **Perfil** | `perfis/<criador>/PERFIL.md` | Quem é o criador na tela: voz, ritmo natural, bordões, cenário, marca visual, peças recorrentes, preferências e vetos | Cresce com o uso, pelas regras abaixo |
| **Vídeo** | `plano.md` do vídeo | As decisões daquele vídeo | O próprio vídeo |

Ordem de precedência na hora de decidir: **o núcleo garante o que é inegociável, o perfil escolhe dentro do que
o núcleo permite, o vídeo ajusta o resto.**

## O que o perfil pode e não pode fazer

O perfil **ajusta**, nunca **apaga**. É isso que deixa o modelo aprender o criador sem perder a capacidade inteira.

- **Pode:** mudar o peso de um recurso (mais print, menos meme), mexer na densidade dentro da faixa do formato,
  definir a paleta, as fontes, a posição da câmera no canto, o estilo da legenda, o CTA padrão, os bordões que
  ganham destaque, as peças fixas (vinheta, cartela, assinatura).
- **Pode vetar** um recurso para aquele criador ("nunca meme"). O veto vale para ele, fica anotado com o motivo, e o
  recurso continua vivo no catálogo para todos os outros.
- **Não pode** desligar as regras do núcleo: tempo de leitura, zona segura, nada de prova fabricada, nada de dado
  inventado, dado pessoal desfocado, conferência antes de entregar.
- **Não pode** reduzir o catálogo a um truque só. Se um veto ou um peso deixaria uma função sem nenhum recurso (ex.:
  sem nenhuma forma de mostrar um número), o sistema usa o recurso permitido mais próximo da mesma família e avisa.
- **Não pode** fixar uma faixa fora do que as referências mediram (ex.: um corte a cada 0,5 s num vídeo de 20 min).
  O perfil escolhe *onde* dentro da faixa; a faixa é do núcleo.

## Como o perfil cresce (a régua de promoção)

1. **Primeiro vídeo: a semente vem do material, não de suposição.** O sistema lê o próprio bruto e anota o que viu:
   palavras por minuto, tamanho das pausas, energia, se faz piada, se usa as mãos, bordões repetidos, o cenário e as
   cores da roupa e da sala, se olha pra câmera. Cada item entra com a marca `[lido no vídeo X]`. Se o criador já tem
   marca (cores, fontes, logo), entra como `[dado pelo criador]`. Nada entra como `[confirmado]` ainda.
2. **Um pedido do criador num vídeo** ("tira esse zoom", "queria mais print aqui") vale **só naquele vídeo** e fica
   anotado no `plano.md`, no diário.
3. **Promove para o perfil** quando: o mesmo pedido aparece em **2 vídeos**, ou o criador diz que é sempre ("sempre",
   "nunca", "eu não gosto de"), ou ele aprova um vídeo sem mexer num traço que era só `[lido]`, aí o traço vira
   `[confirmado]`.
4. **Nunca promove para o núcleo.** Se algo parece valer para todo criador, vira uma nota em "Pode virar núcleo" no
   fim do perfil, e só o dono do sistema decide.
5. **Rebaixa** o que o criador desaprovar depois: o traço sai de `[confirmado]` e volta a ser testado.

## Contra a mesmice (a checagem de variedade)

Aprender o criador não pode virar repetir o mesmo vídeo. A cada vídeo, a conferência compara com os 2 anteriores
dele e acusa:
- o mesmo recurso abrindo o vídeo 3 vezes seguidas;
- a mesma peça de B-roll, ícone ou gráfico reaproveitada sem ser de propósito (motivo recorrente é de propósito;
  repetição por preguiça não é);
- um código do catálogo que ficou 3 vídeos sem aparecer num formato em que ele cabia.

Constância de marca (cor, fonte, câmera no canto, cartela) é desejada. Repetição de solução visual não é.
