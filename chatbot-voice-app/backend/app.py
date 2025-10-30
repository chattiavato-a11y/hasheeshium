"""Flask backend for the TinyLLM voice chatbot demo."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Dict
from uuid import uuid4

from flask import Flask, jsonify, request, send_from_directory

from bm25_search import BM25Retriever, build_retrievers
from llm_infer import TinyLLMResponder, build_responder
from piper_tts import synthesize_speech
from whisper_stt import transcribe_audio

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"
AUDIO_OUTPUT_DIR = BASE_DIR / "static" / "audio"
AUDIO_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path="")

retrievers: Dict[str, BM25Retriever] = build_retrievers(["en", "es"])
responder: TinyLLMResponder = build_responder()


@app.route("/")
def index() -> object:
    return app.send_static_file("index.html")


@app.post("/chat")
def chat() -> object:
    payload = request.get_json(force=True, silent=True) or {}
    message = (payload.get("message") or "").strip()
    language = (payload.get("language") or "en").lower()

    if not message:
        return jsonify({"error": "Message is required."}), 400

    retriever = retrievers.get(language) or retrievers.get("en")
    documents = retriever.search(message) if retriever else []
    generation = responder.generate(message, documents, language)

    audio_path = synthesize_speech(generation.text, language=language, output_dir=AUDIO_OUTPUT_DIR)

    response_body = {
        "reply": generation.text,
        "language": language,
        "sources": [
            {"text": doc.text, "score": doc.score}
            for doc in documents
        ],
        "audio_url": f"/audio/{audio_path.name}",
        "used_fallback": generation.used_fallback,
    }

    return jsonify(response_body)


@app.post("/voice")
def voice() -> object:
    if "audio" not in request.files:
        return jsonify({"message": "Audio file not provided."}), 400

    audio_file = request.files["audio"]
    language = (request.form.get("language") or "en").lower()

    temp_path = AUDIO_OUTPUT_DIR / f"voice-{uuid4().hex}.webm"
    audio_file.save(temp_path)

    result = transcribe_audio(temp_path, language=language)

    try:
        temp_path.unlink()
    except Exception:  # pragma: no cover - cleanup best effort
        logging.getLogger(__name__).debug("Temporary audio file could not be removed: %s", temp_path)

    return jsonify(result)


@app.get("/audio/<path:filename>")
def audio(filename: str) -> object:
    return send_from_directory(AUDIO_OUTPUT_DIR, filename, mimetype="audio/wav")


@app.get("/health")
def health() -> object:
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

