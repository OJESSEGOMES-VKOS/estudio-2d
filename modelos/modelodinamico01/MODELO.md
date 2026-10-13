# modelodinamico01

Modelo de edição de Reel montado olhando quadro a quadro 3 Reels que o Jessé escolheu
(`referencias/`). Tudo o que ele ensinar dizendo "modelodinâmico01" entra **só aqui**. O que foi
feito antes (reel v1 a v4, `metodo/laboratorio/licoes-reel-01.md`) é o **modelopadrao01** e não
vale aqui, e o que está aqui não vale lá.

Medidas em 1080x1920 (as referências vieram em 720x1280 e foram multiplicadas por 1,5).
Folhas de quadros em `analise/` (`refN_XX.png` a 2 qps, `q_*.png` a 30 qps nas transições).

| | Arquivo | O que é |
|---|---|---|
| ref1 | snapgram.io_c61ffz2ye8al.mp4 (26,6 s) | "AI just killed video editors": rosto + telas de motion + tela dividida. Mesmo tema do nosso reel |
| ref2 | snapgram.io_xee5ojgda9fo.mp4 (52,5 s) | "Auto-Improving System": palco creme com título, card e rosto pequeno embaixo |
| ref3 | snapgram.io_2p3nc2f5aokf.mp4 (69,6 s) | "vibe-coded app": só motion, sem rosto, legenda karaokê, recibo que soma |

## 1. A ideia central

A tela **encena a frase** com interface de verdade (janela do Claude Code, campo de prompt,
arquivo sendo arrastado, celular com o próprio Reel, perfil do Instagram com Seguir). Nada de
ícone genérico nem selo. Cada frase ganha **um card**, e dentro do card acontece **uma
microação a cada 0,5 a 1 s** (digitar, cursor clicar, arquivo entrar, botão virar verde).

A legenda é a espinha: está sempre na tela, sempre no mesmo lugar do modo, poucas palavras.

## 2. Os 4 modos de tela

**M1 Palco (ref2).** O rosto nunca sai, a explicação acontece em cima.
- Fundo creme `#F1ECE3` com grade fina (linhas a cada 60 px, um tom mais escuro).
- Título no topo: linha 1 em serifa itálica cor de destaque (y 220 a 300, ~96 px), linha 2 em
  sans preta (y 300 a 400, ~100 px), traço de pincel na cor de destaque embaixo (y ~412, 6 px).
  O título **fica a seção inteira** (várias frases) e só troca quando o assunto troca.
- Card no meio: x 57 a 1023, y 453 a 1158, raio 18, sombra macia. Pode ser escuro (app) ou claro.
- Legenda pequena logo abaixo do card: sans bold ~51 px, preta, centralizada, y ~1245.
- Rosto num card embaixo: x 110 a 972, topo em y ~1388, sangrando pra fora da base, raio 36.

**M2 Tela cheia de motion (ref1, ref3).** Sem rosto.
- Fundo claro liso (`#EEEDEA`, ref1) ou o creme com grade; a ref3 alterna escuro `#141414` e
  claro por assunto.
- Visual centralizado na metade de cima (celular, janela de app, card), legenda **grande** embaixo
  (sans bold ~80 px, preta, y ~1460 na ref1), ou legenda em cima e card embaixo (ref3).

**M3 Dividido (ref1).**
- Divisa em y ~858. Em cima: fundo claro com um visual pequeno num card (330x395 na ref, um
  "react" ou objeto). Embaixo: o rosto.
- Legenda em **etiqueta mono maiúscula** branca em caixa preta `#1F1F1F`, centrada na divisa,
  ~39 px.

**M4 Rosto cheio (ref1, ref2).** Para a frase de impacto, curta (ref2: 1,0 a 1,3 s cada).
- Legenda no meio do peito (y ~1150 a 1250), sans branca com sombra; a palavra-chave em
  **serifa itálica** na cor de destaque.
- Variante ref1: card de vidro fosco no topo (forma de onda com os tempos da fala).

## 3. Legenda

- Pedaços de 1 a 3 palavras, entrando palavra por palavra (acumula até o pedaço fechar).
- Karaokê da ref3: o que já foi dito fica cinza, a palavra da vez fica cheia.
- Palavra-chave: serifa itálica na cor de destaque (ref1 "100%", "Claude"; ref2), ou caixa de
  seleção com alças (estilo Figma) + emoji (ref3, números e nomes).
- Em tela de motion, a legenda é texto preto sobre o claro, **sem pílula**. Pílula/etiqueta só no
  dividido (mono).

## 4. Tempo (medido)

- Troca de modo: ref1 a cada ~3 s (2,2 / 6,0 / 8,2 / 11,0 / 13,4 / 18,3 / 21,0); ref2 segura o
  palco 4 a 8 s e intercala rosto cheio de ~1,1 s nas frases de virada.
- Card dentro do palco troca a cada frase (2 a 5 s); microação a cada 0,5 a 1 s.
- Entrada de elemento: 6 a 10 quadros, saída rápida com leve passada.

## 5. Transições (quadro a quadro)

- **Entre modos: corte seco.** Zero quadro de transição (ref1 5,97→6,00; 8,17→8,20; ref2
  11,60→11,63). Toda a animação mora dentro da cena.
- Dentro do palco: o conteúdo do card troca no lugar, com chicote e borrão de movimento (6 a 8
  quadros).
- ref3: chicote vertical com borrão (~6 quadros) + o card novo **desenhado no traço** (contorno
  em ~8 quadros) e o conteúdo aparecendo dentro.
- Elemento que entra no card desliza de fora (arquivo vindo da direita em ~8 quadros, ref1 8,23).

## 6. Recursos que se repetem

- O próprio Reel dentro de um celular ("esse vídeo"), com selo de porcentagem ao lado (ref1).
- Linha do tempo de cenas que vai se montando (ref1 16 a 18 s).
- Recibo/lista que soma item a item e cai de um canto a cada novidade (ref3).
- Barra de progresso fixa embaixo com contagem regressiva "o prompt no final" (ref3, retenção).
- Cursor que anda e clica.

## 7. Fechamento

Interface real do pedido: caixa de comentário digitando a palavra e enviando (ref1, ref2), ou
perfil com Seguir clicado virando "Seguindo" (ref3).

## 8. Aplicações

| Vídeo | Base | Saída |
|---|---|---|
| Reel "editado pelo Claude" | `cru/decupado.mp4` (decupado à mão pelo Jessé) | `modelos/modelodinamico01/exemplos/reel-editado-pelo-claude.mp4` |
