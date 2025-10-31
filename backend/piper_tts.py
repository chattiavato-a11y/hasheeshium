"""Utilities for running Piper text-to-speech synthesis."""
from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path
from typing import Optional


def synthesize_speech(
    text: str,
    *,
    model_path: str | Path = "models/en-us_piper.onnx",
    piper_binary: str | Path = "./piper",
    output_dir: str | Path = "temp_audio",
    timeout: Optional[int] = None,
) -> Path:
    """Generate speech audio from ``text`` using Piper.

    The synthesized audio is written to ``output_dir`` and the temporary file
    path is returned to the caller. Callers are responsible for deleting the
    file once it has been served or persisted elsewhere.

    Raises
    ------
    ValueError
        If ``text`` is empty.
    FileNotFoundError
        If the Piper binary or model cannot be found.
    RuntimeError
        If the Piper process exits with a non-zero status code.
    """

    if not text or text.strip() == "":
        raise ValueError("Text to synthesize must be a non-empty string")

    binary = Path(piper_binary)
    if not binary.exists():
        raise FileNotFoundError(f"Piper binary not found: {binary}")

    model = Path(model_path)
    if not model.exists():
        raise FileNotFoundError(f"Piper model not found: {model}")

    output_directory = Path(output_dir)
    output_directory.mkdir(parents=True, exist_ok=True)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav", dir=output_directory) as tmp_file:
        output_path = Path(tmp_file.name)

    result = subprocess.run(
        [str(binary), "--model", str(model), "--output_file", str(output_path)],
        input=text.encode("utf-8"),
        capture_output=True,
        check=False,
        timeout=timeout,
    )

    if result.returncode != 0:
        stdout = result.stdout.decode("utf-8", errors="ignore")
        stderr = result.stderr.decode("utf-8", errors="ignore")
        raise RuntimeError(
            "Piper synthesis failed"
            f" (exit code {result.returncode}).\nSTDOUT: {stdout}\nSTDERR: {stderr}"
        )

    return output_path
