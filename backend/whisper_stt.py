"""Utilities for running speech-to-text inference with Whisper binaries."""
from __future__ import annotations

import subprocess
from pathlib import Path
from typing import Optional


def transcribe_audio(audio_path: str, *, model_path: str | Path = "models/ggml-base.en.bin",
                      whisper_binary: str | Path = "./main", timeout: Optional[int] = None) -> str:
    """Transcribe ``audio_path`` with whisper.cpp.

    Parameters
    ----------
    audio_path:
        Path to the audio file that should be transcribed.
    model_path:
        Path to the Whisper model binary (``.bin`` file).
    whisper_binary:
        Path to the ``whisper.cpp`` executable. Defaults to ``./main`` which
        is the common build artefact.
    timeout:
        Optional timeout (in seconds) for the transcription subprocess.

    Returns
    -------
    str
        The transcription text returned by Whisper.

    Raises
    ------
    FileNotFoundError
        If the audio file or model file do not exist, or the binary is missing.
    RuntimeError
        If the Whisper subprocess exits with a non-zero status or the output
        file cannot be read.
    """

    audio = Path(audio_path)
    if not audio.is_file():
        raise FileNotFoundError(f"Audio file not found: {audio}")

    model = Path(model_path)
    if not model.is_file():
        raise FileNotFoundError(f"Model file not found: {model}")

    binary = Path(whisper_binary)
    if not binary.exists():
        raise FileNotFoundError(f"Whisper binary not found: {binary}")

    output_path = audio.with_suffix(audio.suffix + ".txt")

    result = subprocess.run(
        [str(binary), "-m", str(model), "-f", str(audio), "-otxt"],
        capture_output=True,
        check=False,
        timeout=timeout,
    )

    if result.returncode != 0:
        stdout = result.stdout.decode("utf-8", errors="ignore")
        stderr = result.stderr.decode("utf-8", errors="ignore")
        raise RuntimeError(
            "Whisper transcription failed"
            f" (exit code {result.returncode}).\nSTDOUT: {stdout}\nSTDERR: {stderr}"
        )

    if not output_path.is_file():
        raise RuntimeError(f"Expected transcription output not found: {output_path}")

    try:
        transcript = output_path.read_text(encoding="utf-8").strip()
    except OSError as exc:
        raise RuntimeError(f"Could not read transcription output: {output_path}") from exc

    return transcript
