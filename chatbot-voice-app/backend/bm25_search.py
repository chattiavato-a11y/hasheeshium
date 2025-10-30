"""Lightweight BM25 retrieval for bilingual demo corpora."""

from __future__ import annotations

import math
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List

_CORPUS_FILENAMES = {
    "en": "en_docs.txt",
    "es": "es_docs.txt",
}

_TOKEN_PATTERN = re.compile(r"[\w']+")


@dataclass
class RetrievedDocument:
    """Structured representation for search results."""

    text: str
    score: float


class BM25Retriever:
    """A tiny BM25 implementation with static bilingual corpora."""

    def __init__(
        self,
        language: str = "en",
        *,
        corpus_dir: Path | None = None,
        k1: float = 1.5,
        b: float = 0.75,
    ) -> None:
        self.language = language if language in _CORPUS_FILENAMES else "en"
        self.k1 = k1
        self.b = b
        self._corpus_dir = corpus_dir or Path(__file__).resolve().parent / "corpora"
        self._documents: List[str] = []
        self._doc_tokens: List[List[str]] = []
        self._doc_freqs: Dict[str, int] = {}
        self._avgdl: float = 0.0
        self._load()

    def _load(self) -> None:
        corpus_path = self._corpus_dir / _CORPUS_FILENAMES[self.language]
        if not corpus_path.exists():
            raise FileNotFoundError(f"Corpus file not found: {corpus_path}")

        documents = [line.strip() for line in corpus_path.read_text(encoding="utf-8").splitlines() if line.strip()]
        self._documents = documents
        self._doc_tokens = [self._tokenize(doc) for doc in documents]
        self._avgdl = sum(len(tokens) for tokens in self._doc_tokens) / max(len(self._doc_tokens), 1)

        df: Dict[str, int] = {}
        for tokens in self._doc_tokens:
            seen = set(tokens)
            for token in seen:
                df[token] = df.get(token, 0) + 1
        self._doc_freqs = df

    def _tokenize(self, text: str) -> List[str]:
        return [token.lower() for token in _TOKEN_PATTERN.findall(text.lower())]

    def _idf(self, term: str) -> float:
        n_docs = len(self._documents)
        doc_freq = self._doc_freqs.get(term, 0)
        if doc_freq == 0:
            return 0.0
        return math.log(1 + (n_docs - doc_freq + 0.5) / (doc_freq + 0.5))

    def _score(self, term: str, tf: int, doc_len: int) -> float:
        if tf == 0:
            return 0.0
        numerator = tf * (self.k1 + 1)
        denominator = tf + self.k1 * (1 - self.b + self.b * doc_len / (self._avgdl or 1))
        return self._idf(term) * (numerator / denominator)

    def search(self, query: str, top_k: int = 3) -> List[RetrievedDocument]:
        tokens = self._tokenize(query)
        if not tokens:
            return []

        results: List[RetrievedDocument] = []
        for doc, doc_tokens in zip(self._documents, self._doc_tokens):
            doc_len = len(doc_tokens)
            term_freqs: Dict[str, int] = {}
            for token in doc_tokens:
                term_freqs[token] = term_freqs.get(token, 0) + 1

            score = 0.0
            for term in set(tokens):
                tf = term_freqs.get(term, 0)
                score += self._score(term, tf, doc_len)

            if score > 0:
                results.append(RetrievedDocument(text=doc, score=score))

        results.sort(key=lambda item: item.score, reverse=True)
        return results[:top_k]


def build_retrievers(languages: Iterable[str]) -> Dict[str, BM25Retriever]:
    """Helper to build retrievers for the supported languages."""

    retrievers: Dict[str, BM25Retriever] = {}
    for lang in languages:
        try:
            retrievers[lang] = BM25Retriever(lang)
        except FileNotFoundError:
            continue
    return retrievers

