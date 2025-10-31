"""Helpers for performing local LLM inference via subprocess calls."""
from __future__ import annotations

import subprocess
from typing import Iterable


DEFAULT_MODEL = "tinyllama"


def _build_prompt(prompt: str, context: Iterable[str] | None = None) -> str:
    context_section = "\n".join(context or [])
    if context_section:
        context_section = f"Context:\n{context_section}\n\n"
    return f"{context_section}Q: {prompt}\nA:"


def generate_response(
    prompt: str,
    context: Iterable[str] | None = None,
    *,
    model: str = DEFAULT_MODEL,
    ollama_binary: str = "ollama",
    timeout: int | None = None,
) -> str:
    """Generate a response from an Ollama-served model.

    Parameters
    ----------
    prompt:
        The user prompt to send to the model.
    context:
        Optional iterable of strings that provide additional context.
    model:
        The Ollama model name or tag to run.
    ollama_binary:
        The Ollama CLI binary to execute.
    timeout:
        Optional timeout (seconds) for the process.
    """

    if not prompt or prompt.strip() == "":
        raise ValueError("Prompt must be a non-empty string")

    command = [ollama_binary, "run", model]
    full_prompt = _build_prompt(prompt, context)

    result = subprocess.run(
        command,
        input=full_prompt.encode("utf-8"),
        capture_output=True,
        check=False,
        timeout=timeout,
    )

    if result.returncode != 0:
        stdout = result.stdout.decode("utf-8", errors="ignore")
        stderr = result.stderr.decode("utf-8", errors="ignore")
        raise RuntimeError(
            "Ollama inference failed"
            f" (exit code {result.returncode}).\nSTDOUT: {stdout}\nSTDERR: {stderr}"
        )

    return result.stdout.decode("utf-8", errors="ignore").strip()


__all__ = ["generate_response"]
