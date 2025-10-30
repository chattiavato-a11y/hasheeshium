# OPS Website Chatbot

A bilingual chat experience that runs on Cloudflare Workers and answers questions using curated content from the OPS website. The Worker streams responses from Workers AI while grounding each answer in the same OPS sections visitors see online.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/llm-chat-app-template)

<!-- dash-content-start -->

## Demo

This Worker application powers the production-ready OPS website assistant. It features:

- Real-time streaming of AI responses using Server-Sent Events (SSE)
- Retrieval-augmented generation that keeps every reply grounded in OPS copy
- Optional AI Gateway integration for rate limiting, analytics, and caching
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
- A Cloudflare account with Workers AI access (required for both local and production execution)

### Installation

```bash
cd Chatbot/chatbot/main
npm install
```

### Configure Cloudflare access

Authenticate Wrangler so the Worker can invoke Workers AI during development:

```bash
npx wrangler login
```

Wrangler stores credentials locally. No additional environment variables are required because the Worker reads the `AI` binding defined in `wrangler.jsonc`.

### Run the chatbot locally

```bash
npm run dev
```

Wrangler serves the UI at [http://localhost:8787](http://localhost:8787) and proxies chat requests to Cloudflare. Open the page and:

1. Choose English or Spanish with the language toggle.
2. Ask a question such as "What are the OPS service pillars?".
3. Watch the assistant stream an answer that cites the relevant OPS section.

Because the Worker executes on Cloudflare during `wrangler dev`, responses are identical to production. Charges apply according to your Workers AI plan.

### Deploy

```bash
npm run deploy
```

### Monitor production traffic

```bash
npm wrangler tail
```

### Validate retrieval behaviour locally

Run the Vitest suite to confirm that bilingual detection and retrieval are wired correctly:

```bash
npm run test
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

## Key application components

- **Frontend UI (`public/index.html` + `public/chat.js`)** – Renders the OPS-branded chat surface, manages the floating EN/ES toggle (persisted in `localStorage`), and streams responses while keeping the page accessible with live region announcements and language-aware placeholders.
- **Worker backend (`src/index.ts`)** – Hosts the Cloudflare Worker that proxies `/api/chat`, enriches prompts with persona guidance, and streams Workers AI completions back to the browser.
- **Retrieval layer (`src/retrieval.ts` + `src/documents.ts`)** – Maintains the curated bilingual OPS knowledge base, builds the BM25 index, and returns the highest-scoring snippets for the active language.
- **Type definitions (`src/types.ts`)** – Centralises shared types (chat payloads, knowledge documents, and supported languages) for both Worker logic and tests.
- **Quality gates (`test/retrieval.test.ts`)** – Vitest coverage that validates language detection, bilingual retrieval, and knowledge base integrity so answers stay grounded in official OPS copy.

## Additional items to address

- **Curate the knowledge base** – Update `src/documents.ts` whenever OPS web content changes and extend the Vitest expectations if you add new locales or services.
- **Monitor Workers AI usage** – `wrangler dev` executes against Cloudflare’s managed models, so ensure request volume aligns with your plan and governance requirements before deploying.
- **Audit accessibility & localization** – Review toggle labels, announcements, and prompt translations when you introduce new UI variants. Confirm that `public/chat.js` continues to set `lang` attributes, aria labels, and live region messages appropriately for each locale.

## How It Works

### Backend

The backend runs entirely inside a Cloudflare Worker:

1. **API Endpoint** (`/api/chat`): Accepts POST requests with chat messages and streams responses.
2. **BM25 Retrieval**: `src/retrieval.ts` scores bilingual OPS corpora (English + Spanish) and injects the highest ranking snippets into the system prompt.
3. **Adaptive System Prompting**: `src/index.ts` tailors instructions based on the detected/preferred language and optional WebLLM/WebGPU capabilities sent by the browser.
4. **Workers AI Binding**: The `AI` binding in `wrangler.jsonc` connects to Cloudflare's managed Llama-3.3 70B Instruct model.

### Frontend

The static UI in `public/` ships alongside the Worker and:

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

- **Curated Knowledge Base**: Update or expand the `KNOWLEDGE_DOCUMENTS` array in `src/documents.ts` with additional OPS-aligned content. The helper automatically recalculates BM25 statistics on Worker boot.
- **Language Behaviour**: Adjust `LANGUAGE_TONES` in `src/index.ts` to fine-tune bilingual tone or add new locales (remember to extend the `SupportedLanguage` union in `src/types.ts`).
- **System Voice**: The base prompt lives in `BASE_SYSTEM_PROMPT` inside `src/index.ts`. Update it to reflect branding, compliance, or persona changes.

### Styling

The UI styling is contained in the `<style>` section of `public/index.html`. You can modify the CSS variables at the top to quickly change the color scheme.

## Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/)
