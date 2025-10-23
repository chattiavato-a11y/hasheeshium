export function createSpeechController({ lang = "en-US", onResult, onError, onStart, onEnd } = {}) {
  if (typeof window === "undefined") {
    return { supported: false };
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return { supported: false };
  }
  const recognition = new SpeechRecognition();
  recognition.lang = lang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let active = false;

  recognition.addEventListener("start", () => {
    active = true;
    onStart && onStart();
  });

  recognition.addEventListener("end", () => {
    active = false;
    onEnd && onEnd();
  });

  recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript;
    onResult && onResult(transcript);
  });

  recognition.addEventListener("error", (event) => {
    onError && onError(event);
  });

  return {
    supported: true,
    isActive: () => active,
    start: () => {
      if (!active) {
        recognition.start();
      }
    },
    stop: () => {
      if (active) {
        recognition.stop();
      }
    }
  };
}

export function speak(text, lang = "en-US") {
  if (typeof window === "undefined") return;
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.pitch = 1;
  utterance.rate = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
