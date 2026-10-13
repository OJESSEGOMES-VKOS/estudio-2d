# kit/ — o material dos vídeos de motion

Ferramentas pra conseguir a matéria-prima de um vídeo só de motion graphics (qualquer modelo
sem gravação, e o material de apoio dos outros): achar imagem, recortar, gerar e pedir o que faltar.
Ambiente próprio: `.venv` (rembg + requests + pillow), criado com `python -m uv venv .venv`.
Rodar tudo com `.venv/Scripts/python.exe`.

| Arquivo | O que faz |
|---|---|
| `buscar.py` | busca foto com licença aberta (Wikimedia Commons e Openverse, sem chave), baixa, anota fonte/autor/licença no `ORIGEM.md` e monta uma folha pra escolher de olho. `buscar.py "Sam Altman" <pasta> --n 8` |
| `recortar.py` | tira o fundo e grava PNG transparente recortado justo, mais uma prova sobre xadrez pra conferir a borda. `--modelo pessoa` (BiRefNet portrait, gente e cabelo), `geral` (objeto, prédio, logo), `leve` (teste rápido). Os pesos ficam em `kit/.cache/rembg/` (o portrait tem 973 MB, baixa na 1ª vez) |
| `gerar.py` | gera imagem e grava na pasta do vídeo, com o prompt anotado no `GERADAS.md`. Motor padrão: **kie.ai, Nano Banana 2.1 em 1K** (`--resolucao 2K/4K` quando precisar, `--ref` com até 10 imagens de referência, `--creditos` mostra o saldo). Reserva opcional: `--motor codex` (usa o Codex CLI logado na sua conta do ChatGPT; se o login expirou, `codex login`). A chave da kie.ai mora em `kit/.env` (`KIE_API_KEY=`), nunca em arquivo publicado |
| `voz.py` | narração pelo ElevenLabs com o tempo de cada palavra (`<saida>.palavras.json`), sem Whisper. `--voz <id>` (voz da biblioteca pública entra na conta com `--dono <public_owner_id>`), `--saldo` mostra os caracteres do mês. Plano Starter: só MP3 128 kbps; o eleven_v3 ignora `--velocidade` (acelerar depois com `atempo`). Voz de confronto testada: "Eliel" `y3X5crcIDtFawPx7bcNq` (grave, 77 Hz, a que mais varia de tom entre 4 candidatas). Chave em `kit/.env` (`ELEVENLABS_API_KEY=`) |
| `video.py` | clipe curto de imagem → vídeo pela kie.ai (Grok Imagine, 480p, 6 s), com o prompt e o gasto no `GERADAS.md`. `video.py <imagem.png> "<movimento em inglês>" <saida.mp4>`. Só atmosfera e objeto: nunca pessoa real, nunca no lugar de um fato que aconteceu |
| `camadas.py` | separa uma cena em camadas pra câmera 2.5D: `_frente.png` (objeto recortado) e `_fundo.jpg` (buraco preenchido pelo LaMa de `tools/modelos/`), do mesmo tamanho, alinhados |
| `audio_ia.py` | ElevenLabs: `efeito` (som de efeito), `trilha` (música por descrição), `plano` (música em seções com duração exata) e `plano-rascunho` (grátis). Anota tudo em `SONS.md` |

Custo medido: kie.ai 1K = 4 créditos por imagem (~15 s); clipe Grok Imagine 480p de 6 s = 14,4 créditos (~75 s), 200 créditos = 1 dólar; ElevenLabs ~1.300 caracteres por take de 95 s.

Medido em 2026-10-07: busca "Sam Altman" trouxe 11 fotos certas e 1 de outra pessoa (por isso a
folha: sempre escolher no olho). Recorte do retrato com o BiRefNet portrait: cabelo limpo, 1min44
na 1ª vez (download do modelo), segundos depois.

## Regras de uso
- **Licença anotada sempre.** Toda imagem baixada entra no `ORIGEM.md` da pasta do vídeo. CC BY pede
  crédito: ele vai na descrição do vídeo.
- **Gente real:** foto real com licença aberta, nunca rosto gerado por IA fingindo ser a pessoa.
  Imagem gerada serve pra cenário, objeto, metáfora e figurante sem identidade.
- **Arquivo de terceiro** (manchete, print de site, trecho de telejornal) entra como citação, com a
  fonte visível, no tamanho e no tempo do comentário.
- **O que não der pra conseguir aqui** vira pedido escrito na pasta do vídeo
  (`videos/<AAAA-MM-DD-tema>/PEDIDO.md`: o que falta, em que segundo e o plano B), nunca um buraco no vídeo e nunca um
  "não consegui" no fim.
