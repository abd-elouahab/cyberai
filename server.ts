import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const LISTINGS_FILE = path.join(process.cwd(), "listings.json");
  const STORIES_FILE = path.join(process.cwd(), "stories.json");

  const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "";

  function loadData(file: string) {
    try {
      if (!fs.existsSync(file)) return [];
      const data = fs.readFileSync(file, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  app.get("/api/listings", (req, res) => {
    const { region, activity } = req.query;
    let data = loadData(LISTINGS_FILE);
    if (region && region !== "All") {
      data = data.filter((l: any) => l.region === region);
    }
    if (activity && activity !== "All") {
      data = data.filter((l: any) => l.activity === activity);
    }
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
    const regions = Array.from(new Set(data.map((l: any) => l.region)));
    res.json(regions);
  });

  app.get("/api/activities", (req, res) => {
    const data = loadData(LISTINGS_FILE);
    const activities = Array.from(new Set(data.map((l: any) => l.activity)));
    res.json(activities);
  });

  app.post("/api/book", async (req, res) => {
    const bookingData = req.body;
    console.log("New Booking Received:", bookingData);
    if (N8N_WEBHOOK_URL) {
      try {
        await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });
      } catch (e) {
        console.error("⚠️ Error sending data to n8n:", e);
      }
    }
    res.json({ status: "success", message: "Booking confirmed and sent to workflow" });
  });

  app.use("/api", (err: any, req: any, res: any, next: any) => {
    console.error("API Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();