import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database for Sections
  let sections = [
    {
      id: "hero-1",
      title: "Modern Hero Section",
      category: "Hero",
      thumbnail: "https://picsum.photos/seed/hero1/400/250",
      content: {
        heading: "Build Something Amazing",
        subheading: "The most powerful section builder for your next project.",
        buttonText: "Get Started",
        buttonLink: "#",
        bgColor: "#ffffff",
        textColor: "#1a1a1a",
        accentColor: "#3b82f6",
        padding: "80px",
        borderRadius: "0px"
      }
    },
    {
      id: "cta-1",
      title: "Simple Call to Action",
      category: "CTA",
      thumbnail: "https://picsum.photos/seed/cta1/400/250",
      content: {
        heading: "Ready to grow your business?",
        subheading: "Join over 10,000+ companies using Toolora.",
        buttonText: "Sign Up Now",
        buttonLink: "#",
        bgColor: "#3b82f6",
        textColor: "#ffffff",
        accentColor: "#ffffff",
        padding: "60px",
        borderRadius: "12px"
      }
    }
  ];

  // API Routes
  app.get("/api/sections", (req, res) => {
    res.json(sections);
  });

  app.post("/api/sections", (req, res) => {
    const newSection = { ...req.body, id: `section-${Date.now()}` };
    sections.push(newSection);
    res.status(201).json(newSection);
  });

  app.put("/api/sections/:id", (req, res) => {
    const { id } = req.params;
    sections = sections.map(s => s.id === id ? { ...s, ...req.body } : s);
    res.json({ success: true });
  });

  app.delete("/api/sections/:id", (req, res) => {
    const { id } = req.params;
    sections = sections.filter(s => s.id !== id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
