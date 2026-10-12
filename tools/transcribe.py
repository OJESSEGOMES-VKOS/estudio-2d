"""Transcricao local (faster-whisper) -> JSON palavra a palavra + takes_packed.md.

Uso: python transcribe.py <video> <outdir> [--model large-v3] [--language pt] [--device auto]
Saida: <outdir>/transcript.json  {language, words:[{text,start,end}], motor, segments}
       <outdir>/takes_packed.md  (frases com [start-end], quebra em silencio >=0.5s)

Compatibilidade: `transcribe.py <src> <dir> --model medium` (chamada atual do pipeline)
continua funcionando sem nenhuma flag nova.

A ultima linha impressa em stdout e sempre um JSON de uma linha (o pipeline faz
`JSON.parse(ultima linha)`); todo log vai pro stderr.
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

# Os modelos (faster-whisper, torch) moram dentro do projeto, em tools/.cache
# (regra do dono: nada espalhado pelo computador). O app já passa isso no
# ambiente (app/scripts/ambiente.mjs); aqui vale também pra quem roda na mão.
_CACHE = Path(__file__).resolve().parent / ".cache"
os.environ.setdefault("HF_HOME", str(_CACHE / "huggingface"))
os.environ.setdefault("TORCH_HOME", str(_CACHE / "torch"))
os.environ.setdefault("XDG_CACHE_HOME", str(_CACHE))

from pack import gravar_takes


def registrar_dlls_nvidia() -> None:
    """Poe as DLLs de cuBLAS/cuDNN dos pacotes pip (nvidia-cublas-cu12,
    nvidia-cudnn-cu12) visiveis pro loader do Windows, sem tocar no sistema.

    O CTranslate2 4.x carrega essas DLLs em runtime (dlopen/LoadLibrary), e o
    Windows so acha DLL fora do PATH/diretorio do exe se o diretorio for
    registrado com `os.add_dll_directory` (Python 3.8+) -- por isso isto tem
    que rodar ANTES de importar faster_whisper/ctranslate2. Silencioso se os
    pacotes nao estiverem instalados (cai pro erro de sempre, que a cascata de
    device ja trata).
    """
    if sys.platform != "win32":
        return
    try:
        import nvidia.cublas
        import nvidia.cudnn
    except ImportError:
        return
    for mod in (nvidia.cublas, nvidia.cudnn):
        bin_dir = Path(mod.__path__[0]) / "bin"
        if bin_dir.is_dir():
            os.add_dll_directory(str(bin_dir))
            os.environ["PATH"] = str(bin_dir) + os.pathsep + os.environ.get("PATH", "")


registrar_dlls_nvidia()


def log(*a) -> None:
    print(*a, file=sys.stderr, flush=True)


def cuda_disponivel() -> bool:
    try:
        import ctranslate2
        return ctranslate2.get_cuda_device_count() > 0
    except Exception as e:
        log(f"[transcribe] checagem de CUDA falhou: {e}")
        return False


def transcrever_com_cascata(wav: Path, pref: str, modelo: str, compute_type: str,
                             transcribe_kwargs: dict):
    """Cascata de dispositivo. Retorna (segments_list, info, motor).

    pref: "auto" | "cuda" | "cpu"
    Tenta, na ordem que faz sentido pra preferencia: cuda (compute_type pedido, ou
    float16 por padrao) -> cpu/int8 (com fallback de large-v3 pra medium em cpu, que
    em cpu e lento demais).

    A falha do CUDA (DLL de cublas/cudnn faltando, driver ausente, OOM) so aparece
    quando o generator de segments e consumido, nao no `WhisperModel(...)` em si -- por
    isso a tentativa inteira (carregar + transcrever + materializar) fica dentro do
    try/except de cada nivel da cascata, e nao so o load.

    So UMA tentativa de CUDA por processo: medido nesta maquina que, depois de uma
    falha de inicializacao CUDA (ex.: cublas ausente), tentar de novo com outro
    compute_type no MESMO processo trava (nao levanta excecao, so nunca retorna) —
    e a CPU sempre resolve de verdade, entao repetir CUDA so custa tempo sem ganho.
    """
    from faster_whisper import WhisperModel

    tentativas = []
    quer_cuda = pref in ("auto", "cuda")
    if quer_cuda and cuda_disponivel():
        ct1 = compute_type if compute_type != "auto" else "float16"
        tentativas.append(("cuda", ct1, modelo))
    elif pref == "cuda":
        log("[transcribe] --device cuda pedido mas CUDA indisponivel (ctranslate2 nao acha "
            "device); caindo pra cpu")

    ct_cpu = compute_type if compute_type != "auto" else "int8"
    if modelo == "large-v3":
        # large-v3 em cpu e impraticavel (minutos por segundo de audio); pula
        # direto pra medium, que roda em tempo razoavel
        tentativas.append(("cpu", ct_cpu, "medium"))
    else:
        tentativas.append(("cpu", ct_cpu, modelo))

    ultimo_erro = None
    for i, (device, ct, mdl) in enumerate(tentativas):
        try:
            log(f"[transcribe] tentando device={device} compute_type={ct} model={mdl}")
            model = WhisperModel(mdl, device=device, compute_type=ct)
            segments, info = model.transcribe(str(wav), **transcribe_kwargs)
            segments = list(segments)  # forca a execucao aqui dentro do try
            motivo = None
            if i > 0:
                motivo = str(ultimo_erro) if ultimo_erro else "fallback"
            motor = {"device": device, "compute_type": ct, "model": mdl,
                     "fallback_reason": motivo}
            return segments, info, motor
        except Exception as e:
            log(f"[transcribe] falhou device={device} compute_type={ct} model={mdl}: {e}")
            ultimo_erro = e
    raise RuntimeError(f"nenhum dispositivo funcionou para transcrever: {ultimo_erro}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("video", type=Path)
    ap.add_argument("outdir", type=Path)
    ap.add_argument("--model", default="large-v3")
    ap.add_argument("--language", default="pt", help='"auto" para deteccao automatica')
    ap.add_argument("--device", default="auto", choices=["auto", "cuda", "cpu"])
    ap.add_argument("--beam-size", type=int, default=5)
    ap.add_argument("--compute-type", default="auto")
    ap.add_argument("--min-silence-ms", type=int, default=300)
    ap.add_argument("--no-condition-previous", dest="condition_previous",
                     action="store_false", default=False,
                     help="mantido por compatibilidade; condition_on_previous_text ja "
                          "comeca desligado por padrao")
    ap.add_argument("--condition-previous", dest="condition_previous",
                     action="store_true",
                     help="liga condition_on_previous_text (desligado por padrao)")
    ap.add_argument("--initial-prompt", default=None)
    a = ap.parse_args()
    a.outdir.mkdir(parents=True, exist_ok=True)

    language = None if a.language in (None, "auto") else a.language

    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "audio.wav"
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(a.video), "-vn", "-ac", "1", "-ar", "16000",
             "-c:a", "pcm_s16le", str(wav)],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )

        segments, info, motor = transcrever_com_cascata(
            wav, a.device, a.model, a.compute_type,
            dict(
                language=language, word_timestamps=True,
                vad_filter=True,
                vad_parameters={"min_silence_duration_ms": a.min_silence_ms},
                beam_size=a.beam_size,
                condition_on_previous_text=a.condition_previous,
                initial_prompt=a.initial_prompt,
            ),
        )
        words = []
        segs_out = []
        for seg in segments:
            segs_out.append({"start": round(seg.start, 3), "end": round(seg.end, 3),
                              "text": seg.text.strip()})
            for w in seg.words or []:
                words.append({"text": w.word.strip(), "start": round(w.start, 3),
                              "end": round(w.end, 3)})

    (a.outdir / "transcript.json").write_text(
        json.dumps({"language": info.language, "words": words, "motor": motor,
                     "segments": segs_out}, ensure_ascii=False, indent=1),
        encoding="utf-8")

    # empacota em frases legiveis pro agente decidir cortes
    phrases = gravar_takes(a.outdir, words)
    print(json.dumps({"words": len(words), "phrases": phrases,
                      "language": info.language, "motor": motor}))


if __name__ == "__main__":
    main()
