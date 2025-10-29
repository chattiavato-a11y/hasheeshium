# LLM Chat Application Template

A simple, ready-to-deploy chat application template powered by Cloudflare Workers AI. This template provides a clean starting point for building AI chat applications with streaming responses.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/llm-chat-app-template)

<!-- dash-content-start -->

## Demo

This template demonstrates how to build an AI-powered chat interface using Cloudflare Workers AI with streaming responses. It features:

- Real-time streaming of AI responses using Server-Sent Events (SSE)
- Easy customization of models and system prompts
- Support for AI Gateway integration
- Clean, responsive UI that works on mobile and desktop
- 🔁 BM25 retrieval layer for bilingual OPS knowledge snippets
- 🌐 English/Spanish UX toggle with client capability detection (WebGPU/WebNN/WebML/WebLLM)

## Features

- 💬 Simple and responsive chat interface
- ⚡ Server-Sent Events (SSE) for streaming responses
- 🧠 Powered by Cloudflare Workers AI LLMs
- 🛠️ Built with TypeScript and Cloudflare Workers
- 📱 Mobile-friendly design
- 🔄 Maintains chat history on the client
- 🔎 Built-in Observability logging
<!-- dash-content-end -->

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- A Cloudflare account with Workers AI access

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/cloudflare/templates.git
   cd templates/llm-chat-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Generate Worker type definitions:
   ```bash
   npm run cf-typegen
   ```

### Development

Start a local development server:

```bash
npm run dev
```

This will start a local server at http://localhost:8787.

Note: Using Workers AI accesses your Cloudflare account even during local development, which will incur usage charges.

### Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

### Monitor

View real-time logs associated with any deployed Worker:

```bash
npm wrangler tail
```

## Project Structure

```
/
├── public/             # Static assets
│   ├── index.html      # Chat UI HTML
│   └── chat.js         # Chat UI frontend script
├── src/
│   ├── index.ts        # Main Worker entry point + retrieval orchestration
│   ├── retrieval.ts    # Static OPS corpora + BM25 scoring utilities
│   └── types.ts        # TypeScript type definitions & request metadata
├── test/               # Test files
├── wrangler.jsonc      # Cloudflare Worker configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # This documentation
```

## How It Works

### Backend

The backend is built with Cloudflare Workers and uses the Workers AI platform to generate responses. The main components are:

1. **API Endpoint** (`/api/chat`): Accepts POST requests with chat messages and streams responses.
2. **BM25 Retrieval**: `src/retrieval.ts` scores bilingual OPS corpora (English + Spanish) and injects the highest ranking snippets into the system prompt.
3. **Adaptive System Prompting**: `src/index.ts` tailors instructions based on the detected/preferred language and optional WebLLM/WebGPU capabilities sent by the browser.
4. **Workers AI Binding**: Connects to Cloudflare's AI service via the Workers AI binding.

### Frontend

The frontend is a simple HTML/CSS/JavaScript application that:

1. Presents a chat interface with an OPS-styled bilingual toggle and acceleration badge.
2. Sends user messages plus language preference and detected capabilities to the API.
3. Processes streaming responses in real-time, normalizing SSE `data:` frames.
4. Maintains chat history on the client side and announces language changes inline.

## Customization

### Changing the Model

To use a different AI model, update the `MODEL_ID` constant in `src/index.ts`. You can find available models in the [Cloudflare Workers AI documentation](https://developers.cloudflare.com/workers-ai/models/).

### Using AI Gateway

The template includes commented code for AI Gateway integration, which provides additional capabilities like rate limiting, caching, and analytics.

To enable AI Gateway:

1. [Create an AI Gateway](https://dash.cloudflare.com/?to=/:account/ai/ai-gateway) in your Cloudflare dashboard
2. Uncomment the gateway configuration in `src/index.ts`
3. Replace `YOUR_GATEWAY_ID` with your actual AI Gateway ID
4. Configure other gateway options as needed:
   - `skipCache`: Set to `true` to bypass gateway caching
   - `cacheTtl`: Set the cache time-to-live in seconds

Learn more about [AI Gateway](https://developers.cloudflare.com/ai-gateway/).

### Modifying Retrieval or System Prompts

- **Curated Knowledge Base**: Update or expand the `DOCUMENTS` array in `src/retrieval.ts` with additional OPS-aligned content. The helper automatically recalculates BM25 statistics on Worker boot.
- **Language Behaviour**: Adjust `LANGUAGE_TONES` in `src/index.ts` to fine-tune bilingual tone or add new locales (remember to extend the `SupportedLanguage` union in `src/types.ts`).
- **System Voice**: The base prompt lives in `BASE_SYSTEM_PROMPT` inside `src/index.ts`. Update it to reflect branding, compliance, or persona changes.

### Styling

The UI styling is contained in the `<style>` section of `public/index.html`. You can modify the CSS variables at the top to quickly change the color scheme.

## Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/)
