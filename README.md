<div align="center">

# 🏔️ Atlas Connect

### AI-Powered Authentic Tourism Platform for the Atlas Mountains

*Bridging remote mountain villages with global travelers through WhatsApp and AI*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/Gemini_1.5-Google-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Scribe-000000?logo=elevenlabs&logoColor=white)](https://elevenlabs.io/)
[![Twilio](https://img.shields.io/badge/Twilio-WhatsApp-F22F46?logo=twilio&logoColor=white)](https://www.twilio.com/)
[![n8n](https://img.shields.io/badge/n8n-Automation-EA4B71?logo=n8n&logoColor=white)](https://n8n.io/)

</div>

---

## Table of Contents

- [Vision](#vision)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Live Demo Architecture](#live-demo-architecture)
- [AI Workflows (n8n)](#ai-workflows-n8n)
- [Tech Stack](#tech-stack)
- [Data Model](#data-model)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Social Impact](#social-impact)
- [Competitive Advantage](#competitive-advantage)
- [Roadmap](#roadmap)

---

## Vision

**Atlas Connect** is an AI-powered tourism platform that connects international travelers with local families living in remote villages of the Atlas Mountains.

The goal is to make authentic cultural tourism accessible while creating **direct economic opportunities for isolated communities** that have no presence on platforms like Airbnb or Google Maps.

Instead of requiring villagers to learn complex digital tools, the platform is built around something they already know:

> **WhatsApp.**

Local hosts publish offers using voice messages or simple texts. Tourists discover and book authentic experiences through a modern multilingual website. The AI layer does everything in between.

---

## The Problem

| Remote Villages | International Tourists |
|---|---|
| No digital visibility | Searching for authentic experiences |
| No Airbnb presence | Want local culture & traditional food |
| Limited internet literacy | Looking for eco-tourism & mountain stays |
| Language barriers (Darija, Tamazight) | Frustrated by over-commercialized platforms |
| Not on Google Maps | Cannot find or communicate with local hosts |

Existing platforms fail this market because:
- Hosts must manually create listings in foreign languages
- Interfaces require digital literacy that remote villagers don't have
- No real-time multilingual communication layer
- Remote villages simply aren't indexed

---

## The Solution

Atlas Connect creates a two-sided AI-powered bridge:

```text
LOCAL HOST (WhatsApp)          AI LAYER (n8n)            TOURIST (Website)
─────────────────────    ──────────────────────    ──────────────────────────
Voice message in        →  ElevenLabs Scribe       →  Structured listing in
Darija / Arabic            (Darija STT)                English / French
                           Gemini 1.5 Flash            
                           (extraction +
                           multilingual generation)
                           Moderation check
                           n8n orchestration       →  Listing browse + search
                                                       AI booking flow
                                                       Multilingual chat
WhatsApp reply          ←  Tourist message         ←  Tourist message
(Gemini → Darija)
```

---

## Live Demo Architecture

The hackathon demo runs as a **full-stack TypeScript monorepo** plus an **n8n cloud instance** for AI orchestration:

- A **React 19 + Vite** frontend (multilingual UI, AI-assisted booking)
- An **Express** backend serving REST APIs
- **JSON flat-file persistence** for rapid prototyping (listings, stories)
- **n8n workflows** orchestrating ElevenLabs + Gemini + Twilio
- **Twilio WhatsApp Sandbox** as the messaging gateway

```text
┌─────────────────────────────────────────────────────────┐
│                     Browser / Client                     │
│                                                          │
│   ┌──────────┐  ┌───────────┐  ┌──────────────────┐    │
│   │   Home   │  │  Stories  │  │   Experiences    │    │
│   │ Listings │  │ Community │  │ Workshops/Tours  │    │
│   └──────────┘  └───────────┘  └──────────────────┘    │
│        │              │                 │                │
│        └──────────────┴─────────────────┘                │
│                       │                                  │
│              React State + Hooks                         │
│              (listings, bookings, filters)               │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTP / REST
┌───────────────────────▼──────────────────────────────────┐
│                  Express Server (server.ts)               │
│                                                          │
│  GET  /api/listings          GET  /api/stories           │
│  GET  /api/listings/:id      POST /api/stories           │
│  POST /api/listings          GET  /api/regions           │
│  DELETE /api/listings/:id    GET  /api/activities        │
│  POST /api/book              POST /api/chat              │
│                                                          │
│  ┌──────────────────┐   ┌────────────────────────────┐  │
│  │  JSON File Store │   │  n8n Webhooks              │  │
│  │  listings.json   │   │  - host-audio (workflow 1) │  │
│  │  stories.json    │   │  - tourist-message (wf 2)  │  │
│  └──────────────────┘   └────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                        ▲
                        │ (n8n posts new listings back)
                        │
┌───────────────────────┴──────────────────────────────────┐
│                    n8n AI Orchestration                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │
│  │ ElevenLabs │  │   Gemini   │  │      Twilio        │ │
│  │  Scribe    │  │ 1.5 Flash  │  │   WhatsApp API     │ │
│  └────────────┘  └────────────┘  └────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## AI Workflows (n8n)

All AI automation is orchestrated through **n8n cloud**. Two production workflows power the demo.

### Workflow 1 — Host Audio → Structured Listing

A host sends a WhatsApp voice message in Darija. Within seconds, the listing appears live on the site, fully translated.

```text
┌─────────────────────────────────────────────────────────┐
│              n8n CANVAS: INBOUND AUDIO STEP             │
└─────────────────────────────────────────────────────────┘
 WhatsApp voice message (Darija)
               │
               ▼ Twilio webhook → n8n
 ┌────────────────────────────────────────┐
 │   Download Audio from Twilio           │
 │   - Authentication: Basic Auth         │
 └─────────────────────┬──────────────────┘
                       │ audio binary payload
                       ▼
 ┌────────────────────────────────────────┐
 │   ElevenLabs Scribe v1 Node            │
 │   - Input: Darija Audio                │
 │   - Output: Arabic Script Text         │
 │   (State-of-the-art STT dialect map)   │
 └─────────────────────┬──────────────────┘
                       │ transcribed Darija text
                       ▼
 ┌────────────────────────────────────────┐
 │   Gemini 1.5 Flash Node                │
 │   - Task: Structured JSON Extraction   │
 │   - Schema fields:                     │
 │     • title (en/fr/ar)                 │
 │     • description (en/fr/ar)           │
 │     • location / region                │
 │     • price (EUR) / capacity / tags    │
 └─────────────────────┬──────────────────┘
                       │ normalized JSON payload
                       ▼
 ┌────────────────────────────────────────┐
 │   HTTP Request Node                    │
 │   - Method: POST /api/listings         │
 │   - Action: Push live to backend UI    │
 └─────────────────────┬──────────────────┘
                       │ execution response
                       ▼
 ┌────────────────────────────────────────┐
 │   Twilio Send Message Node             │
 │   - Recipient: Host Phone Number       │
 │   - Message: "Your listing is live!"   │
 └────────────────────────────────────────┘
```

**Architectural rationale:** ElevenLabs Scribe is currently state-of-the-art for dialectal Arabic transcription (~3.1% WER on the FLEURS Arabic benchmark). Gemini 1.5 Flash handles the structured extraction and multilingual generation in a single text-based call. Splitting these responsibilities — each AI doing what it does best — gives the highest-quality output for the lowest cost.

### Workflow 2 — Tourist → Host Multilingual Chat

A tourist types a question in English on the website. The host receives it on WhatsApp in authentic Moroccan Darija.

```text
┌─────────────────────────────────────────────────────────┐
│              n8n CANVAS: TOURIST CHAT STEP              │
└─────────────────────────────────────────────────────────┘
 Tourist types in English on website
               │
               ▼ HTTP POST → n8n Webhook
 ┌────────────────────────────────────────┐
 │   Gemini 1.5 Flash Translation Node    │
 │   - Prompt: Translate EN/FR → Darija   │
 │   - Rules: Use Arabic script, maintain │
 │     conversational tone, preserve text │
 │     variables like dates/numbers.      │
 └─────────────────────┬──────────────────┘
                       │ generated Darija text
                       ▼
 ┌────────────────────────────────────────┐
 │   Twilio WhatsApp Node                 │
 │   - Target: Saved host's phone number  │
 │   - Content: Translated message        │
 └─────────────────────┬──────────────────┘
                       │ confirmation receipt
                       ▼
 ┌────────────────────────────────────────┐
 │   Webhook Response Node                │
 │   - Payload: Status confirmation +     │
 │     raw translation string             │
 └────────────────────────────────────────┘
```

**Architectural rationale:** Gemini handles Darija translation significantly better than Tamazight (due to more expansive training data availability). Output uses Arabic script (`الحروف العربية`) which is what hosts actually read and interact with natively on WhatsApp.

### Future Workflow — Inbound Host Replies

The host replies in Darija (voice or text). The AI transcribes if needed, translates back to the tourist's language, and posts to the website chat. *Designed, not yet wired — requires routing logic since both inbound flows would compete for the same Twilio webhook.*

---

## Tech Stack

### Frontend
| Technology | Role |
|---|---|
| React 19 | UI framework |
| Vite 6 | Build tool & dev server |
| TypeScript 5.8 | Type safety |
| Tailwind CSS 4 | Utility-first styling |
| Lucide React | Icon library |
| Motion (Framer) | Animations |

### Backend
| Technology | Role |
|---|---|
| Express 4 | REST API server |
| Node.js + tsx | TypeScript runtime |
| esbuild | Production bundler |
| JSON flat files | Data persistence (demo) |
| ngrok | Public tunnel to localhost for n8n callbacks |

### AI & Automation
| Technology | Role |
|---|---|
| **ElevenLabs Scribe v1** | Darija/Arabic speech-to-text |
| **Google Gemini 1.5 Flash** | Structured extraction, multilingual translation, generation |
| `@google/genai` SDK | Gemini integration |
| **n8n cloud** | Workflow orchestration |

### Messaging
| Technology | Role |
|---|---|
| **Twilio WhatsApp Sandbox** | Inbound + outbound WhatsApp gateway |
| n8n HTTP nodes | Custom Twilio integration (download media + send messages) |

---

## Data Model

### Listing
```typescript
{
  id: number;
  title: string;              // English title (AI-generated)
  title_fr?: string;          // French translation
  title_ar?: string;          // Arabic translation
  description_en?: string;
  description_fr?: string;
  description_ar?: string;
  location: string;           // Village name
  region: string;             // Atlas region (High Atlas, Ourika, ...)
  activity: string;           // hiking | cooking | weaving | cultural
  price: number;              // EUR per night
  rating: number;             // 0–5
  badge: string;              // "Local Host" | "Verified" | "Luxury Heritage"
  tag: string;                // Thematic tag (AI-generated)
  image_url: string;
  capacity?: number;
  amenities?: string[];
  transcription?: string;     // Original Darija transcription (audit trail)
  host_phone?: string;
  host_name?: string;
  moderation_status?: 'approved' | 'flagged';
  moderation_notes?: string;
}
```

### Story
```typescript
{
  id: number;
  title: string;
  author: string;
  content: string;
  region: string;
  timestamp: string;          // ISO 8601
}
```

### Booking (`POST /api/book` payload)
```typescript
{
  listingId: number;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;         // EUR
}
```

---

## API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/listings` | List all listings. Optional `?region=` and `?activity=` filters |
| `GET` | `/listings/:id` | Get a single listing by ID |
| `POST` | `/listings` | Create a new listing (called by n8n Workflow 1) |
| `DELETE` | `/listings/:id` | Remove a listing |
| `GET` | `/stories` | List all community stories |
| `POST` | `/stories` | Submit a new story |
| `GET` | `/regions` | List all unique regions |
| `GET` | `/activities` | List all unique activity types |
| `POST` | `/book` | Submit a booking |
| `POST` | `/chat` | Forward a tourist message to n8n Workflow 2 (EN → Darija) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A **Google AI Studio** account (Gemini API key — free tier works)
- An **ElevenLabs** account (free tier ~10 STT minutes/month)
- A **Twilio** account with WhatsApp sandbox enabled
- An **n8n cloud** account or self-hosted n8n instance
- **ngrok** (or equivalent) to expose your local Express to n8n

### Installation

```bash
git clone https://github.com/abd-elouahab/cyberai.git
cd cyberai

npm install

cp .env.example .env
# Edit .env with your keys (see Environment Variables section)
```

### Development

```bash
# Run both frontend (Vite) and backend (Express) concurrently
npm run dev

# In a separate terminal, expose the backend for n8n callbacks
ngrok http 8000
# Paste the ngrok URL into the n8n "Save Listing to Backend" node
```

### Production Build

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env` file at the root of the project:

```env
# Google Gemini AI — required for all generative AI tasks
GEMINI_API_KEY=your_gemini_api_key_here

# ElevenLabs — required for Darija STT
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Twilio WhatsApp Sandbox
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WA_FROM=whatsapp:+14155238886

# n8n webhooks (only POST /api/book and POST /api/chat use these)
N8N_HOST_AUDIO_WEBHOOK=https://your-n8n.app.n8n.cloud/webhook/atlas-host-audio
N8N_TOURIST_MESSAGE_WEBHOOK=https://your-n8n.app.n8n.cloud/webhook/atlas-tourist-message

# Public URL of the hosted app
APP_URL=https://your-app-url.com
```

---

## Project Structure

```text
atlas-connect/
├── src/
│   ├── App.tsx              # Main React app — all pages & components
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
├── server.ts                # Express API + n8n webhook forwarders
├── listings.json            # Listing data store
├── stories.json             # Community stories data store
├── metadata.json            # App metadata (name, description)
├── docs/
│   └── architecture/        # Workspace design files & markdown charts
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript configuration
├── package.json
└── .env.example
```

### Frontend Pages

| Page | Route (state) | Description |
|---|---|---|
| **Home** | `home` | Browse & filter listings by region and activity |
| **Stories** | `stories` | Community travel narratives, submit your own |
| **Experiences** | `experiences` | Workshops, tours, and cultural activities |

### Key Frontend Components

| Component | Purpose |
|---|---|
| `Navbar` | Fixed header with navigation and mobile menu |
| `Hero` | Reusable section header with listing count |
| `ListingCard` | Accommodation card with pricing, rating, and booking action |
| `DetailView` | Full listing modal with booking form and cost breakdown |
| `StoryForm` | Modal for community story submissions |
| `Sidebar` | Recent bookings panel (last 3 confirmed reservations) |

---

## Social Impact

Atlas Connect is more than a tourism platform — it is an **economic inclusion engine**:

| Impact Area | Description |
|---|---|
| **Rural Empowerment** | Families in remote Atlas villages earn directly from tourism with zero digital onboarding friction |
| **Cultural Preservation** | Authentic Amazigh culture, crafts, food, and traditions reach a global audience |
| **Digital Accessibility** | Voice-first, WhatsApp-based interface removes the smartphone literacy barrier |
| **Sustainable Tourism** | Directs tourist spending to communities that need it most, not large hotel chains |
| **Language Inclusion** | Darija, Tamazight, Arabic, French, and English are all first-class |

---

## Competitive Advantage

| Feature | Airbnb | Atlas Connect |
|---|---|---|
| **Host onboarding** | Complex web form | WhatsApp voice message |
| **Digital literacy required** | Yes | No |
| **Rural village access** | Weak | Designed for it |
| **AI translation flow** | None | Real-time multilingual |
| **Cultural authenticity** | Generic | Core differentiator |
| **Local guide integration** | No | Yes |

---

## Roadmap

- [x] Workflow 1: Darija voice → multilingual listing (ElevenLabs + Gemini)
- [x] Workflow 2: Tourist → Host translated chat (Gemini → Darija)
- [ ] Inbound host replies (Darija → tourist language)
- [ ] Production WhatsApp Business API (replace sandbox)
- [ ] MongoDB / Postgres migration from JSON flat files
- [ ] Semantic search with embeddings (Gemini `text-embedding-004`)
- [ ] AI trip planner (multi-day Atlas itinerary generation)
- [ ] Host earnings dashboard
- [ ] Payment integration (Stripe Connect / CMI)
- [ ] Mobile-native PWA
- [ ] Expansion to rural Africa and other mountain regions

---

## Built With ❤️ at a Hackathon

Atlas Connect was built as a hackathon project with the mission to prove that **AI can be the bridge between the world's most isolated communities and the global tourism economy**.

> *"The AI infrastructure for authentic rural tourism worldwide."*

---

<div align="center">

**[⭐ Star this repo](https://github.com/abd-elouahab/cyberai)** if you believe technology should empower the most isolated communities first.

</div>
