# Regras de ofício (valem para todo modelo)

O estilo (cor, fonte, layout, ritmo) é de cada modelo e mora no `modelos/<modelo>/MODELO.md`. As regras abaixo são
de ofício: valem para todos, e um modelo só as quebra se o MODELO.md disser por quê. Todas nasceram de vídeos
reprovados e corrigidos.

## 1. O vídeo parece as referências do modelo
- Antes de editar, ler o MODELO.md inteiro e olhar os quadros das referências (`modelos/<m>/analise/`).
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

## 5. Zona segura (9:16, Reels/TikTok/Shorts)
- Todo texto entre y 250 e 1500 e entre x 60 e 940 (num quadro 1080x1920): fora da barra de cima, da legenda do post
  e dos botões da direita.
- O rosto não fica coberto por texto.

## 6. Escolhas do usuário, não do modelo
Ficam desligados por padrão e o usuário liga se quiser: cor de fundo alterada, preto e branco, tratamento de imagem,
efeitos (VHS, glitch), música e imagem/vídeo gerado por IA no lugar de outra câmera.
- No máximo 2 fontes por modelo, mais 1 variação de peso.
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
