"""Empacota palavras com tempo em frases legiveis (takes_packed.md).

Um dono so: transcribe.py chama depois do whisper, align.py chama depois de mexer nos
tempos. Se as linhas daqui e as palavras do transcript.json discordarem, o agente escolhe
uma linha e o corte perde a ultima palavra.
"""
from __future__ import annotations

from pathlib import Path

GAP_S = 0.5


def empacotar(words: list[dict]) -> list[list[dict]]:
    lines: list[list[dict]] = []
    cur: list[dict] = []
    for w in words:
        if cur and w["start"] - cur[-1]["end"] >= GAP_S:
            lines.append(cur)
            cur = []
        cur.append(w)
    if cur:
        lines.append(cur)
    return lines


def gravar_takes(outdir: Path, words: list[dict]) -> int:
    lines = empacotar(words)
    md = ["# Transcricao empacotada", ""]
    for ln in lines:
        md.append(f"[{ln[0]['start']:07.2f}-{ln[-1]['end']:07.2f}] "
                  + " ".join(x["text"] for x in ln))
    (outdir / "takes_packed.md").write_text("\n".join(md), encoding="utf-8")
    return len(lines)
