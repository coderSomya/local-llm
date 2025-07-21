# MiniVault API

A lightweight local REST API that simulates a core ModelVault feature: running a local LLM to respond to a user prompt — completely offline, using Ollama.

## Features
- `POST /generate`: Send a prompt, get a response from your local Ollama LLM
- `GET /status`: Get memory, uptime, and system info
- Logs all prompt/response pairs to `logs/log.jsonl`
- CLI tool for quick terminal prompts
- Dockerfile for easy containerization

---

## Setup

### 1. Prerequisites
- Node.js 18+
- [Ollama](https://ollama.com/) running locally (default: `http://localhost:11434`)
- (Optional) Docker

### 2. Install dependencies
```bash
npm install
```

### 3. Start the API server
```bash
npm start
```

The server runs on [http://localhost:3000](http://localhost:3000) by default.

### 4. Send a prompt (API)
```bash
curl -X POST http://localhost:3000/generate -H 'Content-Type: application/json' -d '{"prompt": "Who is Euler?"}'
```

### 5. Use the CLI
```bash
node src/cli.js "Who is Euler?"
```

### 6. Check logs
- All prompt/response pairs are appended to `logs/log.jsonl` in JSONL format.

### 7. Docker (optional)
```bash
docker build -t minivault .
docker run -p 3000:3000 -v $(pwd)/logs:/app/logs minivault
```

#### To use a custom Ollama URL (e.g., remote or non-default port):
```bash
docker run -p 3000:3000 -v $(pwd)/logs:/app/logs -e OLLAMA_URL="http://host.docker.internal:11434/api/generate" minivault
```

Replace `http://host.docker.internal:11434/api/generate` with your Ollama endpoint as needed.

---

## Endpoints

### POST /generate
- **Input:** `{ "prompt": "Who is Euler?" }`
- **Output:** `{ "response": "..." }`

### GET /status
- Returns memory, uptime, and system info.

---

## Design Notes & Tradeoffs
- **Local-first:** No cloud calls; all LLM responses are from your local Ollama instance. This ensures privacy and offline capability, but means model quality and speed depend on your local hardware and model selection.
- **Logging:** Uses JSONL for easy parsing and streaming. This format is append-only and simple, but could grow large over time; log rotation or archiving may be needed for production use.
- **Error Handling:** API returns clear error messages and logs failures. This helps with debugging and transparency, but for a production tool, more granular error codes and user-friendly messages could be added.
- **Extensible:** The codebase is modular, making it easy to swap out the model, add endpoints, or integrate with other local tools. However, it currently assumes a single model and endpoint; multi-model or multi-user support would require further abstraction.
- **Model Selection:** The model is set via environment variable. For more flexibility, the API or CLI could allow dynamic model selection per request.
- **Security:** The API is open by default for local use. For shared or production environments, authentication and rate limiting should be considered.

