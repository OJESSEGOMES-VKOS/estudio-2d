# Lições do Reel 01 ("100% editado pelo Claude Code", 2026-10-05)

Primeiro vídeo real com o método (`modelos/modelopadrao01/aplicacoes/2026-10-05-reel-editado-pelo-claude/`). O dono criticou a
v1 em cinco pontos; a v2 corrigiu assim. Viram regra da skill.

1. **Cor da marca não basta, tem que casar com o vídeo cru.** Painel preto contra parede bege quente
   pesou e pareceu outro filme. Regra: medir a cor dominante do fundo do vídeo e usar painel da mesma
   família (aqui marfim #F0EEE6 com grade de pontos). Menta (#7ED9B2) só como preenchimento sobre o
   claro; texto verde sobre claro usa verde escuro (#1E6A50).
2. **Legenda no rosto cheio: sem tarja.** A pílula preta tapava mão e microfone. Texto claro com
   sombra, base logo abaixo do queixo medido (y 1190 com queixo em ~1030-1080). Na tela dividida, a
   legenda vai na divisa, numa pílula verde escura que lê sobre os dois lados.
3. **Enquadramento por rastreio do rosto** (`rosto.py`, YuNet): olhos em y 660 no plano A; plano B 15%
   mais perto alternando a cada corte (esconde o pulo do corte seco); quadro fixo dentro do trecho.
4. **Elemento não cobre o rosto.** Cartão em cima da cabeça cobria cabelo e testa. Elemento pequeno vai
   na coluna livre ao lado do rosto (x 96-330, altura dos olhos); elemento grande vai pro painel da
   tela dividida.
5. **Tempos nascem das palavras** (`gerar_tempos.py`): recortar a fala de novo não desalinha nada.
6. **Painel nunca fica vazio esperando a palavra.** O conteúdo entra junto com a divisão.
7. **Legenda sai na tela cheia de número** (brigava com o número).

Medido na RTX 3050: render de 57 s em 1080x1920 no Remotion = ~2 min 50 s (concorrência 6).

## Rodada 3 (reprovação da v2 pelo dono, que já editou mais de 600 vídeos)
Os princípios dele estão na memória (`edicao-principios-jesse`) e viram regra central da skill:
8. **A tela ilustra a frase dita, nunca outro texto.** O "relatório" do terminal no gancho e a lista de
   regras escrita quebravam a atenção. Texto na tela = as palavras dele.
9. **Representar o ato, não relatar.** "Editado pelo Claude" virou o Claude editando ESTE vídeo num
   editor ao vivo (a pré-visualização é o próprio vídeo).
10. **Palavra-chave forte = animação própria no instante exato** (corte = lâmina; legenda = a palavra vira
    legenda; tela = tela se montando). Badge só pra coisa simples.
11. **Nada de gif solto:** trecho que pede vira tela inteira ilustrada (a tarde inteira).
12. **Ler o tom** ("Mas não foi simplesmente…") e editar a respeito (caixa de prompt com as palavras
    dele, riscada em "na verdade").
13. **Sem cortina aberta:** tela cheia sai junto com o corte seguinte (`corte()` em `gerar_tempos.py`).
14. **Número como ele disse** ("160+", não 168). Imagem de prova grande e devagar (3 quadros, um por palavra).
15. **Decupagem por energia do áudio + escuta do trecho sem VAD:** o Whisper engoliu o take repetido
    ("e se você já perdeu" x2) e cortava o começo do "Mas". `cortar.py` agora corta pela energia, protege
    o ataque de cada palavra e remove takes listados à mão.
16. Fecho de perfil: layout minimalista estilo Instagram (foto, @, Seguir azul → Seguindo).
17. **Abre limpo:** os primeiros segundos são só a pessoa e a legenda; a edição entra depois (gancho
    carregado de elemento pesa).
18. **Conferir decupagem em cada ponto de corte:** volume nos 40 ms de borda (borda alta = palavra
    cortada) e voz sem palavra transcrita. O Whisper adianta até 0,5 s e marca palavra em respiração:
    nunca proteger trecho pela transcrição; realinhar as palavras no áudio já cortado.
