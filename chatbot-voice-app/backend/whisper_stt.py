"""Optional speech-to-text helper with graceful degradation."""

from __future__ import annotations

from pathlib import Path
from typing import Dict, Union

AudioSource = Union[str, Path]


def transcribe_audio(audio: AudioSource, language: str = "en") -> Dict[str, object]:
    """Attempt to transcribe the provided audio clip.

    The demo falls back to a friendly message when Whisper is unavailable, which keeps the
    voice interface responsive even without heavy ML dependencies.
    """

    try:
        from faster_whisper import WhisperModel  # type: ignore
    except Exception:
        return {
            "text": "",
            "language": language,
            "confidence": 0.0,
            "message": "Speech recognition is not installed on this demo server.",
            "provider": "unavailable",
        }

    audio_path = Path(audio)
    if not audio_path.exists():
        return {
            "text": "",
            "language": language,
            "confidence": 0.0,
            "message": "The audio clip could not be found on the server.",
            "provider": "unavailable",
        }

    model_size = "tiny"
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments, info = model.transcribe(str(audio_path), language=language if language in {"en", "es"} else None)

    text = " ".join(segment.text.strip() for segment in segments).strip()
    return {
        "text": text,
        "language": info.language or language,
        "confidence": info.language_probability,
        "message": "",
        "provider": f"faster-whisper:{model_size}",
    }

