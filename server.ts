import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const LISTINGS_FILE = path.join(process.cwd(), "listings.json");
  const STORIES_FILE = path.join(process.cwd(), "stories.json");

  const N8N_BOOKING_WEBHOOK_URL = process.env.N8N_BOOKING_WEBHOOK_URL || "";
  const N8N_CHAT_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL || "";

  function loadData(file: string) {
    try {
      if (!fs.existsSync(file)) return [];
      const data = fs.readFileSync(file, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  app.get("/api/listings", (req, res) => {
    const { region, activity } = req.query;
    let data = loadData(LISTINGS_FILE);
    if (region && region !== "All") data = data.filter((l: any) => l.region === region);
    if (activity && activity !== "All") data = data.filter((l: any) => l.activity === activity);
    res.json(data);
  });

  app.get("/api/stories", (req, res) => {
    res.json(loadData(STORIES_FILE));
  });

  app.post("/api/stories", (req, res) => {
    const data = loadData(STORIES_FILE);
    const newItem = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      ...req.body,
    };
    data.push(newItem);
    fs.writeFileSync(STORIES_FILE, JSON.stringify(data, null, 2));
    res.json(newItem);
  });

  app.get("/api/listings/:id", (req, res) => {
    const data = loadData(LISTINGS_FILE);
    const item = data.find((l: any) => l.id === parseInt(req.params.id));
    if (item) res.json(item);
    else res.status(404).json({ error: "Listing not found" });
  });

  app.post("/api/listings", (req, res) => {
    const data = loadData(LISTINGS_FILE);
    const newId = Math.max(0, ...data.map((l: any) => l.id)) + 1;
    const newItem = { id: newId, ...req.body };
    data.push(newItem);
    fs.writeFileSync(LISTINGS_FILE, JSON.stringify(data, null, 2));
    res.json(newItem);
  });

  app.delete("/api/listings/:id", (req, res) => {
    let data = loadData(LISTINGS_FILE);
    data = data.filter((l: any) => l.id !== parseInt(req.params.id));
    fs.writeFileSync(LISTINGS_FILE, JSON.stringify(data, null, 2));
    res.json({ status: "deleted" });
  });

  app.get("/api/regions", (req, res) => {
    const data = loadData(LISTINGS_FILE);
    res.json(Array.from(new Set(data.map((l: any) => l.region))));
  });

  app.get("/api/activities", (req, res) => {
    const data = loadData(LISTINGS_FILE);
    res.json(Array.from(new Set(data.map((l: any) => l.activity))));
  });

  app.post("/api/book", async (req, res) => {
    const bookingData = req.body;
    console.log("New Booking:", bookingData);

    // Booking confirmation webhook
    if (N8N_BOOKING_WEBHOOK_URL) {
      try {
        await fetch(N8N_BOOKING_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });
      } catch (e) {
        console.error("⚠️ n8n booking webhook error:", e);
      }
    }

    // Tourist message pipeline — notify host with tourist info
    if (N8N_CHAT_WEBHOOK_URL) {
      try {
        const touristMessage = `New booking request!\nGuest: ${bookingData.guest_name}\nEmail: ${bookingData.email}\nPhone: ${bookingData.phone || "not provided"}\nListing: ${bookingData.listing_title} (${bookingData.listing_location})\nCheck-in: ${bookingData.check_in}\nCheck-out: ${bookingData.check_out}\nGuests: ${bookingData.guests}\nNights: ${bookingData.nights}\nTotal: $${bookingData.total}`;
        await fetch(N8N_CHAT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: touristMessage,
            guest_name: bookingData.guest_name,
            email: bookingData.email,
            phone: bookingData.phone || "",
            listing_title: bookingData.listing_title,
            listing_location: bookingData.listing_location,
            check_in: bookingData.check_in,
            check_out: bookingData.check_out,
            guests: bookingData.guests,
            nights: bookingData.nights,
            total: bookingData.total,
          }),
        });
        console.log("✅ Tourist info sent to n8n pipeline");
      } catch (e) {
        console.error("⚠️ n8n tourist message webhook error:", e);
      }
    }

    res.json({ status: "success", message: "Booking confirmed" });
  });

  // Workflow 2: translate tourist message → Darija → send to host via WhatsApp
  app.post("/api/chat", async (req, res) => {
    const { message, listingId, guestName } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });

    let translation = "";
    let sentViaWhatsApp = false;

    // Try n8n first (production webhook)
    if (N8N_CHAT_WEBHOOK_URL) {
      try {
        const n8nRes = await fetch(N8N_CHAT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, listingId, guestName }),
        });
        if (n8nRes.ok) {
          const data = await n8nRes.json().catch(() => ({}));
          translation = data.translation || data.darija || "";
          sentViaWhatsApp = true;
        }
      } catch (e) {
        console.error("⚠️ n8n chat webhook error:", e);
      }
    }

    // Gemini fallback: translate to Darija when n8n is unavailable
    if (!translation && process.env.GEMINI_API_KEY) {
      try {
        const result = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: [
            {
              role: "user",
              parts: [{
                text: `Translate this tourist message to Moroccan Darija (Arabic script). Return ONLY the translation, nothing else.\n\nMessage: "${message}"`
              }]
            }
          ]
        });
        translation = result.text?.trim() || "";
      } catch (e) {
        console.error("⚠️ Gemini translation error:", e);
      }
    }

    res.json({
      status: "sent",
      translation,
      sentViaWhatsApp,
      note: sentViaWhatsApp
        ? "Message sent to host via WhatsApp in Darija"
        : "Translated via AI — activate n8n workflow to enable WhatsApp delivery",
    });
  });

  // AI Trip Planner: generate multi-day Atlas itinerary via Gemini
  app.post("/api/trip-plan", async (req, res) => {
    const { region = "High Atlas", days = 3, interests = "all" } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: "GEMINI_API_KEY not configured" });
    }

    try {
      const result = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            role: "user",
            parts: [{
              text: `You are a local Moroccan tourism expert. Create a ${days}-day travel itinerary for the ${region} region of Morocco for a traveler interested in: ${interests}.

Return a JSON object with this exact structure:
{
  "title": "string — catchy itinerary title",
  "region": "${region}",
  "days": [
    {
      "day": 1,
      "title": "string — day theme",
      "morning": "string — morning activity (2-3 sentences)",
      "afternoon": "string — afternoon activity (2-3 sentences)",
      "evening": "string — evening activity or dinner (1-2 sentences)",
      "tip": "string — one local insider tip"
    }
  ],
  "essentials": ["packing tip 1", "packing tip 2", "packing tip 3"]
}

Return only the JSON, no markdown, no explanation.`
            }]
          }
        ]
      });

      const raw = result.text?.trim() || "{}";
      const cleaned = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      const itinerary = JSON.parse(cleaned);
      res.json(itinerary);
    } catch (e) {
      console.error("⚠️ Trip planner error:", e);
      res.status(500).json({ error: "Failed to generate itinerary" });
    }
  });

  app.use("/api", (err: any, req: any, res: any, next: any) => {
    console.error("API Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  });

  // In production, serve the built Vite SPA.
  // In development, Vite runs as a separate process (see npm run dev:client)
  // and proxies /api/* to this server.
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`   Chat webhook: ${N8N_CHAT_WEBHOOK_URL || "⚠️  not configured"}`);
    console.log(`   Booking webhook: ${N8N_BOOKING_WEBHOOK_URL || "⚠️  not configured"}`);
    console.log(`   Gemini: ${process.env.GEMINI_API_KEY ? "✓ configured" : "⚠️  not configured"}`);
  });
}

startServer();
