# ref1: Motivation x Discipline (barra fixa)

Quadros cheios em `ref1_q/` (0.50, 1.50, 3.00, 6.00, 8.50, 10.25, 11.90). Movimento medido a 10 qps pelo topo e pela base
dos pixels claros de cada boneco; cores e posições medidas nos quadros cheios (vídeo em 720x1280).

## 1. Ficha

| | |
|---|---|
| Formato | 9:16, 720x1280, 30 qps |
| Duração | 12,07 s |
| Idioma | sem fala (o detector deu "nn") |
| Assunto | motivação começa rápido e acaba; disciplina segue no mesmo compasso |
| Quem fala | ninguém. Só dois rótulos fixos |
| Rosto | 0% (bonecos de costas, sem rosto) |
| Cortes | nenhum: 1 plano de 12,07 s, câmera parada |
| Trilha | sim: chão -23,9 dB, mediana -19,1 dB (música o tempo todo) |
| Criador | @profithuman (marca "D" colorida no rodapé). Diferente das refs 2 a 4 |

## 2. Linha do tempo

Picos de subida medidos (topo da cabeça mais alto). Azul = "Discipline", cinza = "Motivation".

| Hora | Tela | Fala | Gatilho |
|---|---|---|---|
| 0,0 a 1,2 | Os dois já pendurados na barra no quadro 0, rótulos já na tela. Cinza faz 2 barras rápidas (picos 0,35 e 1,1 s); azul faz 1 (pico 0,6 s) | sem fala | Abertura sem entrada: o contraste começa no 1º segundo |
| 1,2 a 3,0 | Cinza: picos 1,9 e 2,85 (intervalo cresce de 0,75 para 0,95 s). Azul: picos 1,8 e 3,0 | sem fala | Ciclo do azul fixo em 1,2 s |
| 3,0 a 6,0 | Cinza: picos 4,2 e 5,9 (intervalos 1,35 e 1,7 s, ficando lento). Azul: 4,2 e 5,4 | sem fala | Divergência: um desacelera, o outro não |
| 6,0 a 7,3 | Cinza desce devagar; azul pico 6,6 | sem fala | |
| 7,3 a 8,1 | Cinza tenta subir e **trava a meia altura** (base parada em y 800 por 0,8 s). Azul pico 7,8 | sem fala | A trilha sobe forte em 7,6 s (de -20 para -7 dB) |
| 8,1 a 8,4 | Cinza solta e fica de braço esticado | sem fala | A desistência |
| 8,2 a 9,3 | "@profithuman" em cinza translúcido no peito do azul | | Marca anti-cópia, não é recurso |
| 8,4 a 12,07 | Cinza pendurado **imóvel** até o fim. Azul segue: picos 9,0, 10,2, 11,4 | sem fala | Segura 3,7 s mostrando o resultado. Termina no meio de uma subida do azul |

## 3. Receita visual medida

**Layout.** Palco frontal, câmera parada. Barra horizontal metálica atravessando o quadro inteiro em y 38,4 a 39,8% (18 px
com o brilho, ~1,4% da altura). Dois bonecos pendurados, centros em x 31% (cinza) e x 68% (azul). Cada boneco: 19 a 21% da
largura, 24 a 27% da altura (das mãos na barra até os pés). Metade de baixo do quadro vazia, só com os reflexos.

**Rótulos.** "Motivation" e "Discipline", caixa mista, grotesca neutra tipo Arial/Helvetica, peso regular, branco
`#FDFDFD`, sem contorno nem sombra. Altura total 21 a 26 px (1,6 a 2,0% da altura). Posição y 24,8 a 26,7%, centrados
em cima de cada boneco (centro do rótulo = centro do boneco, x 226 e x 492). Parados do quadro 0 ao fim.

**Paleta medida.**

| Cor | Hex | Onde |
|---|---|---|
| Fundo | `#000000` | quadro inteiro |
| Branco | `#FDFDFD` | rótulos |
| Cinza do boneco que falha | `#59595A`, `#6A6A6A`, `#828282`, luz `#F0F0F1` | boneco "Motivation" |
| Azul do boneco que persiste | miolo `#08A1DF`, luz `#37CAFB`, borda acesa `#77EDFE`, sombra `#082550` | boneco "Discipline" |
| Halo azul | `#04101F` a `#07203A` | névoa em volta do azul, ~58% da largura e 47% da altura |
| Barra | `#828384` a `#CCCECF`, perto do azul pega `#CAF8FF` | barra fixa |

**Elementos gráficos.**
- Bonecos: manequins sem rosto vistos de costas (regata e short), com sombreamento suave de volume (não é traço chapado).
- O azul **emite luz**: contorno claro, miolo saturado e um halo grande e fraco que acende a barra perto dele.
- Reflexo no chão: borrão vertical de cada boneco bem abaixo (y 70 a 86%), sem contorno, muito apagado (cinza `#1E1E1E`,
  azul `#0D2935`, ~12 a 15% da luz do original). Não é espelho nítido: é uma mancha borrada.
- Marca do criador no rodapé, centro, y 89,5 a 92,6%, cinza `#7E7E7E`, 5% da largura.

**Movimento.**
- Azul: uma barra a cada **1,2 s cravado**, sempre a mesma altura (sobe ~48 px, 3,8% da altura; o corpo encolhe 106 px).
  Subida ~0,6 s, descida ~0,6 s, sem pausa.
- Cinza: começa mais rápido que o azul (0,75 s por barra) e vai alongando (0,8, 0,95, 1,35, 1,7 s), trava a meia altura
  0,8 s e cai. Depois fica parado de verdade (nenhum pixel muda de 8,4 s ao fim).
- Câmera parada. Nada entra nem sai.

**Transições.** Nenhuma.

**Ritmo.** Uma única cena. A ação é contínua; o "evento" é a parada do cinza em 7,3 a 8,4 s (60 a 70% do vídeo).

**Som.** Trilha com batida a cada ~0,73 s do começo ao fim (picos de volume em 0,3, 1,0, 1,8, 2,5, 3,2, 4,0...). Em 7,6 s
a música entra numa parte bem mais forte (-7 dB) e fica assim até o fim. A batida não acompanha a barra do azul (1,2 s).

## 4. Gatilhos

- **A tese tem dois nomes** → dois personagens iguais lado a lado, cada um com o nome em cima (0,0 s).
- **O lado certo** → ganha cor viva e luz própria; o lado errado fica cinza (0,0 s em diante).
- **"Um começa forte e para"** → o cinza começa mais rápido que o azul e desacelera até desistir (0,35 a 8,4 s).
- **A virada** (a desistência) → a trilha muda de parte no mesmo instante (7,6 s).
- **O fim** → segura o resultado sem texto nenhum por ~3,7 s.

## 5. Assinatura do criador (não vira regra)

Marca "D" colorida e "@profithuman"; o manequim 3D de costas; o tema academia. O inglês dos rótulos.

## 6. Materiais

Nada do criador: dois bonecos vetoriais, uma barra e dois rótulos. O sistema faz tudo. Trilha: banco livre ou gerada.

## 7. O que não deu pra ver

O som não foi ouvido de ouvido: o que está acima é volume medido. Não dá pra saber se há efeito de esforço ou respiração.
A fonte exata dos rótulos não foi identificada (parece Arial/Helvetica).
