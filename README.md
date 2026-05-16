<div align="center">

# 🏔️ Atlas Connect

### AI-Powered Authentic Tourism Platform for the Atlas Mountains

*Bridging remote mountain villages with global travelers through WhatsApp and AI*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-Google-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![n8n](https://img.shields.io/badge/n8n-Automation-EA4B71?logo=n8n&logoColor=white)](https://n8n.io/)

</div>

---

## Table of Contents

- [Vision](#vision)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Live Demo Architecture](#live-demo-architecture)
- [Full System Architecture](#full-system-architecture)
- [AI Workflows (n8n)](#ai-workflows-n8n)
- [Tech Stack](#tech-stack)
- [Data Model](#data-model)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Social Impact](#social-impact)
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

```
LOCAL HOST (WhatsApp)          AI LAYER                  TOURIST (Website)
─────────────────────    ──────────────────────    ──────────────────────────
Voice message in        →  Whisper STT             →  Structured listing in
Darija / Arabic            LLM extraction              English / French
                           Auto-translation            / Arabic
                           Listing generation
                           Moderation check
                           n8n orchestration       →  Semantic search
                                                       AI trip planner
                                                       Multilingual chat
                           WhatsApp reply          ←  Booking request
```

---

## Live Demo Architecture

The hackathon demo runs as a **full-stack TypeScript monorepo** with:

- A **React 19 + Vite** frontend (multilingual UI, AI-assisted booking)
- An **Express** backend serving REST APIs
- **JSON flat-file persistence** for rapid prototyping (listings, stories)
- **Google Gemini AI** for generative tasks
- **n8n webhook integration** for automating booking workflows

```
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
                        │  HTTP / REST
┌───────────────────────▼──────────────────────────────────┐
│                  Express Server (server.ts)               │
│                                                          │
│  GET  /api/listings          GET  /api/stories           │
│  GET  /api/listings/:id      POST /api/stories           │
│  POST /api/listings          GET  /api/regions           │
│  DELETE /api/listings/:id    GET  /api/activities        │
│  POST /api/book                                          │
│                                                          │
│  ┌──────────────────┐   ┌────────────────────────────┐  │
│  │  JSON File Store │   │  n8n Webhook (booking)     │  │
│  │  listings.json   │   │  N8N_WEBHOOK_URL →          │  │
│  │  stories.json    │   │  booking automation flow   │  │
│  └──────────────────┘   └────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │               Google Gemini AI                   │   │
│  │   GEMINI_API_KEY → @google/genai SDK             │   │
│  │   Generative listing content / recommendations  │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## Full System Architecture

This is the complete production vision built around the demo:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         ATLAS CONNECT — FULL ARCHITECTURE                 │
└──────────────────────────────────────────────────────────────────────────┘

 ┌─────────────────┐         ┌────────────────────────────────────────────┐
 │   LOCAL HOST    │         │              AI ORCHESTRATION LAYER        │
 │  (WhatsApp)     │         │                   (n8n Workflows)          │
 │                 │         │                                            │
 │  📱 Voice msg   │──────►  │  ┌──────────┐   ┌──────────┐             │
 │  📝 Text msg    │         │  │ Whisper  │   │  LLM     │             │
 │  📸 Photos      │  Twilio │  │  STT     │──►│ Extract  │             │
 │  📍 GPS         │ /360dlg │  └──────────┘   └────┬─────┘             │
 └─────────────────┘         │                       │                    │
         ▲                   │  ┌──────────┐   ┌────▼─────┐             │
         │                   │  │Moderation│   │Translate │             │
         │  Translated reply │  │    AI    │   │ GPT-4o / │             │
         │                   │  │(spam/    │   │  DeepL   │             │
         │                   │  │ scam)    │   └────┬─────┘             │
         │                   │  └──────────┘        │                    │
         │                   │                  ┌───▼──────┐             │
         │                   │                  │ Listing  │             │
         │                   │                  │Generator │             │
         │                   │                  │(title +  │             │
         │                   │                  │ desc +   │             │
         │                   │                  │ SEO tags)│             │
         │                   │                  └───┬──────┘             │
         │                   └──────────────────────┼────────────────────┘
         │                                          │ Structured listing
         │                   ┌──────────────────────▼────────────────────┐
         │                   │              BACKEND API                  │
         │                   │        (Node.js / Express / FastAPI)      │
         │                   │                                           │
         │                   │  ┌─────────────┐  ┌────────────────────┐ │
         │                   │  │  Listings   │  │  Booking Engine    │ │
         │                   │  │  Service    │  │  + Payments        │ │
         │                   │  └─────────────┘  └────────────────────┘ │
         │                   │  ┌─────────────┐  ┌────────────────────┐ │
         │                   │  │Recommend-   │  │  Auth / Users      │ │
         │                   │  │ation Engine │  │  Service           │ │
         │                   │  │(embeddings) │  └────────────────────┘ │
         │                   │  └─────────────┘                         │
         │                   │             │                             │
         │                   │  ┌──────────▼──────────────────────────┐ │
         │                   │  │         MongoDB / JSON Store        │ │
         │                   │  │  users · listings · bookings        │ │
         │                   │  │  messages · reviews · stories       │ │
         │                   │  └─────────────────────────────────────┘ │
         │                   └──────────────────────┬────────────────────┘
         │                                          │
         │                   ┌──────────────────────▼────────────────────┐
         │                   │              FRONTEND                     │
         │                   │         (Next.js / React / Vite)          │
         │                   │                                           │
         │                   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
         │                   │  │ Listings │ │  Search  │ │  Stories │ │
         │                   │  │  Browse  │ │ AI Seman-│ │Community │ │
         │                   │  │ + Filter │ │  tic     │ │  Feed    │ │
         │                   │  └──────────┘ └──────────┘ └──────────┘ │
         │                   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
         │                   │  │ Booking  │ │Trip Plan-│ │Multilang │ │
         │                   │  │  Flow    │ │  ner AI  │ │  Chat    │ │
         │                   │  └──────────┘ └──────────┘ └──────────┘ │
         │                   └──────────────────────┬────────────────────┘
         │                                          │
         └──────────────────────────────────────────┘
                       Real-time translated chat
```

---

## AI Workflows (n8n)

All AI automation is orchestrated through **n8n** — a self-hosted workflow engine. Each workflow handles one domain of the system.

> Screenshots of the actual n8n workflows will be added here once finalized.

### Workflow 1 — Host Listing Creation

```
WhatsApp Message Received
        │
        ▼
┌───────────────┐
│  Is Voice?    │──Yes──► Whisper STT ──► Raw Text
└───────┬───────┘
        │ No
        ▼
   Raw Text
        │
        ▼
┌───────────────────────────┐
│ GPT-4o — Extract Fields   │
│  location / price /       │
│  capacity / amenities /   │
│  activities / dates       │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ Translation Layer         │
│  Arabic → EN / FR / AR    │
│  (GPT-4o + DeepL)         │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ Listing Generator         │
│  title / description /    │
│  tags / SEO content       │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ Moderation Check          │
│  spam / scam / duplicate  │
│  suspicious pricing       │
└─────────────┬─────────────┘
              │
         Pass │  Fail
              │    │
              ▼    ▼
         Publish  Reject +
         Listing  Notify Host
```

### Workflow 2 — Booking Notification

```
Tourist submits booking (POST /api/book)
        │
        ▼
Express server calls N8N_WEBHOOK_URL
        │
        ▼
n8n receives booking payload
        │
        ├──► Notify host via WhatsApp (translated)
        ├──► Send tourist confirmation email
        ├──► Log to database
        └──► Trigger payment flow (future)
```

### Workflow 3 — Multilingual Communication

```
Tourist sends message
        │
        ▼
Detect language
        │
        ▼
Translate to host's language (Arabic/Darija)
        │
        ▼
Forward via WhatsApp
        │
        ▼
Host replies (text or voice)
        │
        ├── Voice ──► Whisper STT
        └── Text  ──►
                     │
                     ▼
              Translate to tourist language
                     │
                     ▼
              Return to tourist on website
```

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
| MongoDB | Production data store (roadmap) |

### AI & Automation
| Technology | Role |
|---|---|
| Google Gemini AI (`@google/genai`) | Generative AI (listings, recommendations) |
| OpenAI Whisper | Voice → text (host audio messages) |
| GPT-4o | LLM extraction, translation, generation |
| DeepL API | High-quality multilingual translation |
| n8n | Workflow orchestration & automation |

### Messaging
| Technology | Role |
|---|---|
| Twilio / 360dialog | WhatsApp Business API gateway |
| n8n WhatsApp node | Message routing & replies |

---

## Data Model

### Listing
```typescript
{
  id: number;
  title: string;          // AI-generated
  location: string;       // Extracted from host message
  region: string;         // Atlas region (Imlil, Ourika, Ouzoud…)
  activity: string;       // hiking | cooking | weaving | cultural
  price: number;          // USD per night
  rating: number;         // 0–5
  badge: string;          // "Verified Local Host" | "Luxury Heritage"
  tag: string;            // Thematic tag (AI-generated)
  image_url: string;
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
  timestamp: string;      // ISO 8601
}
```

### Booking (POST /api/book payload)
```typescript
{
  listingId: number;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}
```

---

## API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/listings` | List all listings. Optional `?region=` and `?activity=` filters |
| `GET` | `/listings/:id` | Get a single listing by ID |
| `POST` | `/listings` | Create a new listing |
| `DELETE` | `/listings/:id` | Remove a listing |
| `GET` | `/stories` | List all community stories |
| `POST` | `/stories` | Submit a new story |
| `GET` | `/regions` | List all unique regions |
| `GET` | `/activities` | List all unique activity types |
| `POST` | `/book` | Submit a booking (triggers n8n webhook if configured) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Google AI Studio account (for Gemini API key)
- (Optional) An n8n instance for full workflow automation

### Installation

```bash
# Clone the repository
git clone https://github.com/abd-elouahab/cyberai.git
cd cyberai

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your keys (see Environment Variables section)
```

### Development

```bash
# Run both frontend (Vite) and backend (Express) concurrently
npm run dev
```

The Vite dev server proxies `/api` requests to the Express server automatically.

### Production Build

```bash
# Build frontend + bundle server
npm run build

# Start the production server
npm start
```

---

## Environment Variables

Create a `.env` file at the root of the project:

```env
# Google Gemini AI — required for AI-generated content
GEMINI_API_KEY=your_gemini_api_key_here

# Public URL of the hosted app (used for callbacks and self-referential links)
APP_URL=https://your-app-url.com

# n8n booking automation webhook — optional
# When set, every POST /api/book forwards the payload to this URL
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/booking
```

> In Google AI Studio, `GEMINI_API_KEY` and `APP_URL` are injected automatically from the Secrets panel.

---

## Project Structure

```
cyberai/
├── src/
│   ├── App.tsx          # Main React app — all pages & components
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── server.ts            # Express API server + n8n webhook integration
├── listings.json        # Listing data store
├── stories.json         # Community stories data store
├── metadata.json        # App metadata (name, description)
├── vite.config.ts       # Vite build configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies & scripts
└── .env.example         # Environment variable template
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

| | Airbnb | Atlas Connect |
|---|---|---|
| Host onboarding | Complex web form | WhatsApp voice message |
| Digital literacy required | Yes | No |
| Rural village access | Weak | Designed for it |
| AI translation flow | None | Real-time multilingual |
| Cultural authenticity | Generic | Core differentiator |
| Local guide integration | No | Yes |

---

## Roadmap

- [ ] WhatsApp Business API integration (Twilio / 360dialog)
- [ ] Whisper STT for host voice messages
- [ ] Full n8n workflow deployment (listing creation + communication)
- [ ] MongoDB migration from JSON flat files
- [ ] Semantic search with embeddings (Gemini / OpenAI)
- [ ] AI trip planner (multi-day Atlas itinerary generation)
- [ ] Multilingual real-time chat with translation
- [ ] Host earnings dashboard
- [ ] Payment integration
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