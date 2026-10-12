# Pedido de materiais (modelo do youtubeedition01)

O modelo faz sozinho tudo o que é explicação: texto, gráfico, ícone, fluxo, comparação, interface recriada,
legenda, zoom e trilha. O que ele **não pode inventar** é prova: o print daquele site, a gravação da tela do
criador, o vídeo que ele citou, a foto do resultado dele. Para isso existe este pedido.

O pedido nasce do plano do vídeo (`plano.md`), depois que o roteiro ou o bruto foi lido, e vai para a pasta
`materiais/youtubeedition01/<AAAA-MM-DD-tema>/PEDIDO.md`. O criador joga os arquivos na mesma pasta, com o
nome do ID (`M03.png`, `M07.mp4`). O vídeo nunca trava esperando: cada item tem o plano B escrito.

## Como escrever o pedido

1. **Linguagem de quem não é técnico.** "Grava a tela do seu celular abrindo o app", não "captura de tela em
   H.264". Diga de onde tirar e como fazer, passo a passo, quando for gravação.
2. **Um item por linha, com a hora e a frase.** O criador precisa saber *em que momento* aquilo aparece e *o
   que ele disse ali*, para lembrar o que mostrar.
3. **Agrupe por tipo de tarefa,** na ordem em que ele faz de uma vez: primeiro tudo o que se grava no
   computador, depois prints, depois links de vídeo, depois fotos e objetos.
4. **Prioridade honesta:** `essencial` (sem isso a frase fica sem prova e perde força) ou `bom ter` (melhora,
   mas o plano B segura).
5. **Plano B sempre, e honesto** (ver a regra abaixo).
6. **Peça o mínimo.** Item que o sistema consegue fazer não entra aqui. Um pedido de 40 itens não volta;
   corte para o que muda o vídeo (a meta é até 12 itens num vídeo de 10 a 15 min).

## A regra do plano B (inviolável)

- **Nunca fabricar prova.** Se o print do faturamento, do painel, do comentário ou da notícia não vier, o
  sistema **não recria aquele print** com o número ou o nome real como se fosse a tela verdadeira.
- Planos B permitidos, nesta ordem:
  1. **A fala vira o destaque:** o número ou a frase em texto grande ao lado do rosto (`R3`/`R4`), como
     afirmação do criador, sem moldura de site.
  2. **Ilustração assumida:** interface genérica, sem marca e sem dado real (ex.: um painel com barras
     subindo, sem números), quando a ideia é "um painel", não "o meu painel".
  3. **Fonte pública verificável** que o próprio sistema acha (página oficial, notícia com link), anotada no
     `ORIGEM.md`, só se diz exatamente o que a fala diz.
  4. **Deixar no rosto.** Melhor um trecho limpo de rosto do que uma prova falsa.
- Vídeo de terceiro (`P4`) nunca é baixado sem o link vindo do criador e o "pode usar" dele. Trecho curto, com
  a fonte na tela, no tempo do comentário.

## Cuidados que vão escritos no pedido (para gravação de tela e print)

- Tela em 1080p ou mais, navegador com zoom de 125% para o texto ficar legível no celular de quem assiste.
- Notificações desligadas, abas pessoais fechadas, nada de senha, e-mail, telefone ou saldo que não deve aparecer.
  O que escapar, o sistema desfoca antes de montar (e avisa).
- Gravar devagar e um pouco antes e depois do clique: é melhor sobrar do que faltar.
- Print: a tela inteira, sem recortar (o sistema recorta e dá zoom no ponto certo).

## Formato do pedido

```markdown
# Pedido de materiais: <tema do vídeo>
Para: <criador> · Vídeo: <título provisório> · Prazo sugerido: <data>

Oi, <nome>. O vídeo já está planejado e quase tudo eu faço daqui. Faltam estas provas que só você tem.
Joga os arquivos nesta pasta com o nome do código (M01, M02...). O que não der, tudo bem: cada item tem o que
eu faço no lugar.

## 1. Gravar no computador (uma sessão só, ~15 min)
| Código | Prioridade | Hora no vídeo | O que você disse ali | O que gravar, passo a passo | Se não vier |
|---|---|---|---|---|---|
| M01 | essencial | 02:10 | "aí eu abro o Claude e mando o roteiro" | Abra o Claude, cole o roteiro e clique em enviar. Grave até a resposta começar a aparecer. | Prompt recriado digitado na tela (fica claro que é ilustração) |

## 2. Prints
| Código | Prioridade | Hora | O que você disse | O que printar e onde | Se não vier |

## 3. Vídeos que você citou
| Código | Prioridade | Hora | O que você disse | Link + trecho (de mm:ss a mm:ss) + pode usar? | Se não vier |

## 4. Fotos e objetos
| Código | Prioridade | Hora | O que você disse | Foto de quê, como | Se não vier |

## O que eu já faço sozinho neste vídeo (não precisa mandar)
- <lista curta: os gráficos, os textos, os ícones, a trilha...>
```

## Recebimento

Quando os arquivos chegam, o sistema confere cada um antes de usar:
- abre e olha: é o que foi pedido? dá para ler no tamanho em que vai aparecer?
- caça dado pessoal na imagem (e-mail, telefone, saldo, nome de cliente) e desfoca;
- anota no `plano.md` o que veio, o que não veio e qual plano B entrou.
