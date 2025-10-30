"""Rule-based TinyLLM stand-in with optional fallback heuristics."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Sequence

from bm25_search import RetrievedDocument


@dataclass
class GenerationResult:
    """Simple container for generated text."""

    text: str
    used_fallback: bool = False


class TinyLLMResponder:
    """Compose grounded responses using retrieval snippets."""

    def __init__(self) -> None:
        self._greetings = {
            "en": "Hello! I'm the TinyLLM voice assistant. How can I help you today?",
            "es": "¡Hola! Soy el asistente de voz TinyLLM. ¿En qué puedo ayudarte hoy?",
        }
        self._fallback_suffix = {
            "en": "If you need more detail, just ask another question!",
            "es": "Si necesitas más detalle, ¡haz otra pregunta!",
        }

    def generate(self, user_message: str, documents: Sequence[RetrievedDocument], language: str = "en") -> GenerationResult:
        lang = language if language in self._greetings else "en"
        normalized = user_message.strip().lower()

        if not normalized:
            return GenerationResult(text=self._greetings[lang], used_fallback=True)

        if any(keyword in normalized for keyword in ["hello", "hola", "buenos", "hi"]):
            return GenerationResult(text=self._greetings[lang])

        if not documents:
            text = (
                "I could not find a matching snippet in the project notes, but I'm still happy to help. "
                if lang == "en"
                else "No encontré un fragmento coincidente en las notas del proyecto, pero aún quiero ayudarte. "
            )
            text += self._fallback_suffix[lang]
            return GenerationResult(text=text, used_fallback=True)

        bullet_points = [f"• {doc.text}" for doc in documents]
        context_section = "\n".join(bullet_points)

        if lang == "es":
            answer = (
                "Esto es lo que encontré para ti:\n"
                f"{context_section}\n\n"
                "¿Te gustaría profundizar en algún punto?"
            )
        else:
            answer = (
                "Here is what I found for you:\n"
                f"{context_section}\n\n"
                "Would you like to dive deeper into any topic?"
            )

        return GenerationResult(text=answer, used_fallback=False)


def build_responder() -> TinyLLMResponder:
    return TinyLLMResponder()

