const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const voiceBtn = document.getElementById("voice-btn");
const statusLabel = document.getElementById("status");

let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

function setStatus(message = "") {
  statusLabel.textContent = message;
}

function appendMessage(sender, message, sources = []) {
  const container = document.createElement("div");
  container.className = `message ${sender}`;
  container.setAttribute("data-sender", sender);

  const text = document.createElement("p");
  text.textContent = message;
  container.appendChild(text);

  if (sources.length) {
    const list = document.createElement("ul");
    list.className = "sources";
    sources.forEach((source) => {
      const item = document.createElement("li");
      item.textContent = `${source.score.toFixed(2)} • ${source.text}`;
      list.appendChild(item);
    });
    container.appendChild(list);
  }

  chatBox.appendChild(container);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function detectLanguage(text) {
  const lowered = text.toLowerCase();
  const spanishHints = ["¿", "¡", "ñ", "á", "é", "í", "ó", "ú"];
  const containsSpanish = spanishHints.some((hint) => lowered.includes(hint));
  if (containsSpanish) return "es";
  const spanishWords = ["hola", "gracias", "ayuda", "buenos", "días", "información"];
  const englishWords = ["hello", "thanks", "help", "good", "morning", "information"];
  const spanishCount = spanishWords.reduce((sum, word) => (lowered.includes(word) ? sum + 1 : sum), 0);
  const englishCount = englishWords.reduce((sum, word) => (lowered.includes(word) ? sum + 1 : sum), 0);
  return spanishCount > englishCount ? "es" : "en";
}

async function sendMessage(text, language) {
  const payload = { message: text, language: language || detectLanguage(text) };
  sendBtn.disabled = true;
  userInput.disabled = true;
  setStatus("Thinking...");

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    appendMessage("bot", data.reply, data.sources || []);

    if (data.audio_url) {
      const audio = new Audio(data.audio_url);
      audio.play().catch(() => {
        console.warn("Unable to autoplay audio. User interaction may be required.");
      });
    }
    setStatus("Ready");
  } catch (error) {
    console.error(error);
    setStatus("Unable to contact the chatbot. Please try again.");
  } finally {
    sendBtn.disabled = false;
    userInput.disabled = false;
    userInput.focus();
  }
}

async function handleSubmit() {
  const text = userInput.value.trim();
  if (!text) return;
  appendMessage("user", text);
  userInput.value = "";
  await sendMessage(text);
}

async function processVoiceRecording(blob) {
  const form = new FormData();
  form.append("audio", blob, "message.webm");

  setStatus("Transcribing voice message...");
  try {
    const response = await fetch("/voice", {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      throw new Error(`Voice endpoint returned ${response.status}`);
    }

    const result = await response.json();

    if (!result.text) {
      setStatus(result.message || "We could not transcribe that audio clip.");
      return;
    }

    const language = result.language || detectLanguage(result.text);
    appendMessage("user", `${result.text} 🎤`);
    await sendMessage(result.text, language);
  } catch (error) {
    console.error(error);
    setStatus("Recording failed. Please try again.");
  }
}

function resetRecordingState() {
  isRecording = false;
  voiceBtn.textContent = "🎤";
  setStatus("Ready");
  recordedChunks = [];
}

async function toggleRecording() {
  if (isRecording) {
    mediaRecorder.stop();
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setStatus("Voice capture is not supported in this browser.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    recordedChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(recordedChunks, { type: "audio/webm" });
      if (blob.size > 0) {
        processVoiceRecording(blob);
      } else {
        setStatus("No audio captured.");
      }
      resetRecordingState();
    };

    mediaRecorder.start();
    isRecording = true;
    voiceBtn.textContent = "⏹️";
    setStatus("Recording... release to send.");
  } catch (error) {
    console.error(error);
    setStatus("Microphone access was denied.");
  }
}

sendBtn.addEventListener("click", handleSubmit);
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSubmit();
  }
});

voiceBtn.addEventListener("mousedown", toggleRecording);
voiceBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  toggleRecording();
});

voiceBtn.addEventListener("mouseup", () => {
  if (isRecording) mediaRecorder.stop();
});

voiceBtn.addEventListener("mouseleave", () => {
  if (isRecording) mediaRecorder.stop();
});

voiceBtn.addEventListener("touchend", () => {
  if (isRecording) mediaRecorder.stop();
});

window.addEventListener("load", () => {
  setStatus("Ready");
});
