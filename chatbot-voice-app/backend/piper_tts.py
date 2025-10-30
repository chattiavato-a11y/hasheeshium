"""Generate friendly placeholder audio clips for responses."""

from __future__ import annotations

import math
import struct
import wave
from pathlib import Path
from typing import Optional


def synthesize_speech(text: str, *, language: str = "en", output_dir: Optional[Path] = None) -> Path:
    """Create a short sine-wave audio file that stands in for real TTS.

    The implementation keeps dependencies minimal while giving the UI something to play back.
    """

    sanitized = text.strip() or "TinyLLM response"
    output_base = Path(output_dir) if output_dir else Path(__file__).resolve().parent / "static" / "audio"
    output_base.mkdir(parents=True, exist_ok=True)

    sample_rate = 16000
    duration_seconds = min(4.0, 1.5 + len(sanitized) / 48)
    total_frames = int(sample_rate * duration_seconds)

    frequency = 440 if language == "en" else 392
    amplitude = 16000

    filename = f"tts-{abs(hash((sanitized, language, total_frames))) % (10 ** 10)}.wav"
    file_path = output_base / filename

    with wave.open(str(file_path), "w") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)  # 16-bit audio
        wav_file.setframerate(sample_rate)

        for index in range(total_frames):
            envelope = 0.5 * (1 - math.cos(2 * math.pi * min(index / total_frames, 1)))
            value = int(amplitude * envelope * math.sin(2 * math.pi * frequency * index / sample_rate))
            wav_file.writeframes(struct.pack("<h", value))

    return file_path

