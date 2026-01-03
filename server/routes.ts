import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(
  app: Express
): Promise<Server> {
  // API Proxy to fix CORS
  app.get("/api/proxy/dramabox/*", async (req, res) => {
    try {
      const pathParam = (req.params as any)[0];
      const queryParams = new URLSearchParams(req.query as any).toString();
      const url = `https://dramabox.sansekai.my.id/api/dramabox/${pathParam}${queryParams ? '?' + queryParams : ''}`;
      
      console.log(`Proxying to: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`External API error: ${response.status} for ${url}`);
        return res.status(response.status).json({ error: 'External API error' });
      }
      const data = await response.json();
      
      // Handle different response structures
      if (data.data) {
        res.json(data.data);
      } else if (data.list) {
        res.json(data.list);
      } else {
        res.json(data);
      }
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Failed to fetch from external API' });
    }
  });

  // Serve static files
  app.use(express.static(path.join(__dirname, "../client/public")));
  
  // Serve index.html for all other routes (SPA routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public/index.html"));
  });

  const httpServer = createServer(app);
  return httpServer;
}
