import argparse
import json
import re
from html import unescape
from pathlib import Path

WHITESPACE_RE = re.compile(r"\s+")
SCRIPT_STYLE_RE = re.compile(r"(?is)<(script|style)[^>]*>.*?</\\1>")
TAG_RE = re.compile(r"(?s)<[^>]+>")


CHATBOT_START_RE = re.compile(r"<section\s+class=\"chatbot-panel\"")
CHATBOT_END_RE = re.compile(r"</section>")


def extract_text(html: str) -> str:
    cleaned = SCRIPT_STYLE_RE.sub(" ", html)
    text = TAG_RE.sub(" ", cleaned)
    text = unescape(text)
    text = WHITESPACE_RE.sub(" ", text)
    return text.strip()


def slice_between_markers(html: str, start_pattern: re.Pattern[str], end_pattern: re.Pattern[str] | None = None) -> str:
    start_match = start_pattern.search(html)
    if not start_match:
        raise ValueError(f"start pattern '{start_pattern.pattern}' not found")
    start_index = start_match.start()
    if end_pattern:
        end_match = end_pattern.search(html, start_match.end())
        end_index = end_match.end() if end_match else None
    else:
        end_index = None
    return html[start_index:end_index]


def count_characters(path: Path, section: str | None = None) -> int:
    html = path.read_text(encoding="utf-8")
    if section == "chatbot":
        segment = slice_between_markers(html, CHATBOT_START_RE, CHATBOT_END_RE)
    else:
        segment = html
    text = extract_text(segment)
    return len(text)


def main() -> None:
    parser = argparse.ArgumentParser(description="Compute character counts for OPS web pages.")
    parser.add_argument("--output", type=Path, help="Optional JSON file to write counts")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    paths = {
        "website": repo_root / "index.html",
        "chatbot": repo_root / "index.html",
        "join_us": repo_root / "apply.html",
        "contact_us": repo_root / "contact.html",
    }

    results = {}
    for key, path in paths.items():
        section = "chatbot" if key == "chatbot" else None
        try:
            results[key] = count_characters(path, section=section)
        except ValueError as error:
            results[key] = str(error)

    if args.output:
        args.output.write_text(json.dumps(results, indent=2), encoding="utf-8")
    else:
        print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
