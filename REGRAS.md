# Regras de ofício (valem para todo modelo)

O estilo (cor, fonte, layout, ritmo) é de cada modelo e mora no `modelos/<modelo>/MODELO.md`. As regras abaixo são
de ofício: valem para todos, e um modelo só as quebra se o MODELO.md disser por quê. Todas nasceram de vídeos
reprovados e corrigidos.

## 0. Correções do dono que valem para todos (acima de tudo)
Ficam acima das regras abaixo, do MODELO.md e do código. As de um modelo só ficam em `modelos/<m>/CORRECOES.md`.
Correção mais nova vence a mais velha. G22 e G23 vêm primeiro porque mandam no resto:

| # | Regra | Data |
|---|---|---|
| G22 | O padrão de cada modelo é tudo o que está no vídeo aprovado dele mais as correções do dono; as correções ficam acima das regras do modelo. | 2026-10-13 17:15 |
| G23 | O vídeo novo num modelo tem que parecer o vídeo aprovado daquele modelo desde o 1º segundo. | 2026-10-10 16:13 e 2026-10-13 16:49 |
| G1 | Todo texto fica na tela o tempo de ser lido; nunca jogar texto rápido demais. | 2026-09-30 00:06; 2026-10-03 15:14; 2026-10-12 08:54 |
| G2 | A tela mostra o que está sendo dito; nada de elemento com outro texto. | 2026-10-05 11:43 |
| G3 | Representar o ato, não relatar. | 2026-10-05 11:43 |
| G4 | Palavra-chave forte ganha animação/ilustração própria no instante; badge só para o simples. | 2026-10-05 11:43 |
| G5 | Nada de elemento solto em lugar aleatório; o trecho vira tela ilustrada, enxuta e didática. | 2026-10-05 11:43 |
| G6 | Ler o tom da fala e editar a respeito dele. | 2026-10-05 11:43 |
| G7 | Sem cortina aberta: tela cheia sai junto com o corte. | 2026-10-05 11:43 |
| G8 | Número e frase exatamente como foram ditos. | 2026-10-05 10:49 e 11:43 |
| G9 | Imagem de prova grande e devagar para ser entendida. | 2026-10-05 11:43 |
| G10 | Decupagem limpa: tirar take repetido e conferir cada corte pela transcrição. | 2026-10-05 11:43 e 15:11 |
| G11 | Cor: identidade própria da peça/modelo, nunca as cores da marca do dono; cor que combina em contraste com o vídeo. | 2026-10-05 11:08; 2026-10-10 16:13; 2026-10-13 16:09 |
| G12 | O que se ensina num modelo fica só nele (não contamina os outros). | 2026-10-05 16:35 e 23:17 |
| G13 | Lições técnicas de um modelo valem nos outros (o que é ofício, não estilo). | 2026-10-07 12:42 |
| G14 | A legenda conta a história: todas as falas, em ordem, sem embolar. | 2026-10-12 08:22 e 08:54 |
| G15 | Legenda padrão em no máximo 2 posições no vídeo inteiro. | 2026-10-12 08:54 |
| G16 | Legenda padrão na altura de leitura da regra (peito), nunca rebaixada ao pé. | 2026-10-12 09:36 e 09:39 |
| G17 | Em 9:16, todo texto respeita as margens das redes (zona segura). | 2026-10-12 09:39 |
| G18 | No máximo 4 linhas por bloco de texto. | 2026-10-12 08:54 e 09:08 |
| G19 | Destaque só no termo protagonista da fala. | 2026-10-12 08:54 |
| G20 | Nunca escrever o nome do modelo na tela. | 2026-10-12 09:08, 10:33, 10:38, 10:55 |
| G21 | Cor de fundo, preto e branco, efeitos, música e imagem de IA no lugar de câmera são escolha do usuário. | 2026-10-12 09:08, 10:00, 10:33, 10:38 |
| G24 | Material: o sistema busca, recorta e gera o que dá; o que não conseguir vira pasta/pedido para o dono. | 2026-10-07 15:28 |
| G25 | Cada modelo entende a autenticidade do usuário com o uso, sem corromper o modelo. | 2026-10-10 14:20 |
| G26 | Conteúdo padronizado de cliente segue o vídeo que o cliente aprovou; variação nova só acrescenta. | 2026-10-09 17:27 |
| G27 | Entrega enxuta: o modelo se sustenta sem referências de terceiros; o vídeo de apresentação vira a referência. | 2026-10-10 12:30 |
| G28 | Tudo confinado na pasta do projeto (fixo e temporário). | 2026-10-09 08:50 |
| G29 | Não encher o disco do dono durante o trabalho. | 2026-10-13 13:11 |
| G30 | Produzir no estúdio 2D, não na Máquina de Conteúdo/VK Studio (salvo pedido). | 2026-10-09 15:36; 2026-10-13 15:56 |
| G31 | Nome/@ na tela só os reais de quem fala; nunca nome de exemplo. | 2026-10-13 16:43; 2026-10-12 10:33 |

Como se confere G23: `tools/parece.py` (luz, cor, enquadramento e ritmo contra `modelos/<m>/assinatura.json`) e a
folha lado a lado que ele grava. Os conferidores de regra dos moldes não provam G23.

## 1. O vídeo parece as referências do modelo
- Antes de editar, ler o MODELO.md inteiro e olhar os quadros das referências (`modelos/<m>/analise/`; no estúdio aberto, que não traz
  referências de terceiros, a folha `modelos/<m>/referencia.jpg` do vídeo aprovado do modelo).
- A receita visual é medida (posição e tamanho em % do quadro, fonte, hex, movimento); seguir a medida, não o gosto.
- Comparar quadro a quadro com as referências antes de entregar (folha lado a lado em `conferencia/`).
- A cor e a fonte são as do modelo. Nada da identidade pessoal de quem edita.

## 2. A tela mostra o que está sendo dito
- Texto na tela são as palavras ditas (ou nenhuma). Número e frase exatamente como foram falados.
- Representar, não relatar: se a fala diz "está editando", a tela mostra o ato de editar.
- Palavra-chave forte ganha ilustração própria no instante exato; nada de elemento solto em lugar aleatório.
- Imagem de prova grande e devagar o bastante para ser entendida. Prova nunca é inventada.

## 3. A legenda conta a história
"Quando a legenda se bagunça, é como embolar os acontecimentos."
- Todas as falas aparecem (nos modelos com legenda), cada trecho uma vez só.
- Tempo de leitura: bloco ≥ 1,5 s e cada palavra ≥ 0,4 s depois de aparecer. A régua ideal é 1 s + 3 palavras/s;
  com fala rápida, juntar em frases maiores em vez de picar. Nada pisca.
- No máximo 4 linhas por bloco.
- Legenda padrão em no máximo 2 posições fixas no vídeo todo, na altura de leitura medida do modelo (em geral o
  peito). Nunca no pé do quadro. Troca de posição só quando um destaque ocupa o lugar.
- Sincronia: cada texto e cada corte entram no início da palavra que os motiva (±2 quadros).
- Nada atravessa um corte seco. Toda peça só aparece a partir do seu tempo de entrada.
- Sem "cortina aberta": tela cheia que cobre o vídeo sai junto com o corte.

## 4. Destaque só no protagonista
- Tela ou palavra de destaque é para o termo protagonista da fala (o assunto: "outros modelos de edição"), nunca
  advérbio ou ligação ("realmente").
- Tela de destaque não carrega texto comum; texto comum que continua depois não começa dentro dela.
- Destaques do mesmo vídeo têm o mesmo tamanho. Destaque não encolhe para caber: abre-se o plano.
- Nunca escrever o nome do modelo na tela.
- Nome, @ ou cargo na tela são sempre os reais de quem fala na gravação, e só quando o dono do vídeo os dá. Sem
  eles, o elemento fica desligado. Nunca nome de exemplo, inventado ou de outra pessoa sobre o rosto de alguém.

## 5. Zona segura (9:16, Reels/TikTok/Shorts)
- Todo texto entre y 250 e 1500 e entre x 60 e 940 (num quadro 1080x1920): fora da barra de cima, da legenda do post
  e dos botões da direita.
- O rosto não fica coberto por texto.

## 6. Opções e padrão
O padrão de cada modelo é o vídeo aprovado mais as correções (G22). Pelas correções G21 ficam desligados por padrão,
e o usuário liga se quiser: música, cor de fundo alterada, preto e branco, efeitos de textura (VHS, glitch) e
imagem/vídeo gerado por IA no lugar de outra câmera. O tratamento de imagem que faz a cara do modelo segue o vídeo
aprovado (no modelodinamico03 o tratamento quente, no storypodcast01 o fundo escuro do `efeitoFundo`): ligado. Os
efeitos sonoros do próprio modelo ficam ligados.
- Fontes: o limite é o de cada modelo (storypodcast01: 2 fontes e 1 variação de peso; profissional01: 1 principal e
  2 alternativas). Na dúvida, poucas fontes, as do vídeo aprovado.
- Chamada para ação: só o comando fica fixo, com a palavra a comentar entre aspas (comenta "EDIÇÃO"); o resto da
  fala segue na legenda.

## 7. Material
- Fazer sozinho tudo o que dá: buscar foto com licença aberta (`kit/buscar.py`), recortar (`kit/recortar.py`),
  gerar objeto/cenário (`kit/gerar.py`). Pessoa real só com foto real licenciada, nunca rosto gerado.
- O que só o criador tem (print específico, gravação de tela) vira um pedido numerado, com a hora, a frase e um plano
  B honesto. O resto do vídeo segue enquanto isso.
- Licença anotada sempre (`ORIGEM.md`); crédito na descrição quando a licença pede.

## 8. Conferir com prova
- Cada molde tem um checador (`scripts/`): falas cobertas, tempo, repetição, posições, zona segura, sincronia.
  Rodar até zerar antes de renderizar.
- Olhar os quadros (folha de 1 quadro por segundo) antes de dizer pronto.
- Áudio final: voz na frente, trilha ~16 dB abaixo, -14 LUFS, pico ≤ -1 dBTP.

## 9. Confinado
- Tudo o que o estúdio usa e gera mora dentro dele: `.venv/`, `node_modules/`, `tools/.cache/`, `.tmp/`, `videos/`.
- Render com a trava (`tools/com-trava.sh`), `--concurrency=2`, um render pesado por vez.
