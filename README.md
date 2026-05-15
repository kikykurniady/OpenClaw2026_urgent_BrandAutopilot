# BrandAutopilot 🚀

> Build your brand in 60 seconds with autonomous AI agents.

A full-stack demo for **OpenClaw Agenthon 2026** that turns a one-screen form into a complete brand strategy — positioning, voice, value props, and ready-to-post Instagram captions — using a sequential multi-agent loop.

## ✨ Features

- **4 AI Agents** working in a sequential pipeline
- Research → Strategy → Brand → Content
- Fully autonomous (no human in the loop)
- Real-time agent status visualization (glow + progress + checkmarks)
- Generated content ready to post (with one-click copy)
- Graceful fallback data — the demo never breaks, even without an API key
- `?demo=true` mode for fully offline pitches

## 🛠️ Tech Stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** with a custom dark, premium design system
- **OpenRouter API** → Claude 3 Haiku
- Multi-Agent architecture inspired by **OpenClaw**

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone <repo-url>
cd brandautopilot
npm install
```

### 2. Set up environment

```bash
cp .env.local.example .env.local
# Edit .env.local and paste your OpenRouter API key
```

Get a free OpenRouter API key at https://openrouter.ai

> Don't have a key yet? The app still works — it falls back to deterministic dummy data so you can demo offline. Append `?demo=true` to force demo mode explicitly.

### 3. Run dev server

```bash
npm run dev
```

Open http://localhost:3000

### 4. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Set `OPENROUTER_API_KEY` in the Vercel dashboard (Project → Settings → Environment Variables).

## 🏗️ Architecture

### Multi-Agent pipeline

```
User Input
    ↓
Research Agent     ── analyze competitors & trends
    ↓ [structured JSON context]
Strategy Agent     ── identify market gap & positioning
    ↓ [structured JSON context]
Brand Agent        ── craft voice, tone, value props
    ↓ [structured JSON context]
Content Agent      ── generate 3 Instagram captions
    ↓
Final structured strategy report
```

Each agent:

1. Builds a focused prompt using upstream output.
2. Calls Claude via OpenRouter (`lib/openrouter.ts`).
3. Parses a typed JSON response.
4. Hands its structured output to the next agent.

If an agent fails (no key, network error, malformed JSON), it falls back to a deterministic personalized payload — the rest of the pipeline keeps running.

### File layout

```
brandautopilot/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # 3-state SPA: input → loading → results
│   ├── globals.css
│   └── api/
│       └── generate-brand/
│           └── route.ts      # Multi-agent pipeline orchestrator
├── components/
│   ├── InputForm.tsx
│   ├── AgentPipeline.tsx     # Sequential animated agent cards
│   ├── ResultsDashboard.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── lib/
│   ├── agents.ts             # The 4 agent functions + fallbacks
│   └── openrouter.ts         # OpenRouter client + JSON extraction
├── types/
│   └── index.ts
├── .env.local.example
├── package.json
├── tailwind.config.ts
└── next.config.js
```

## 🎬 Demo mode

For pitches without API rate-limit risk, append `?demo=true` to the URL. The pipeline animation still runs at full speed but uses preset fallback data.

```
http://localhost:3000/?demo=true
```

## 📊 OpenClaw Agenthon 2026

Built for OpenClaw Agenthon 2026 with full multi-agent autonomy:

- ✅ Tool call capability (each agent is a discrete LLM call)
- ✅ Autonomous loop (sequential, context-passing)
- ✅ No manual intervention between agents
- ✅ Structured reasoning (typed JSON contracts between steps)

## 📜 License

MIT

## 👤 Author

Built for **OpenClaw 2026**.
