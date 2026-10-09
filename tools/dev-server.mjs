import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, extname } from "node:path";
import discordHandler from "../api/discord.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const types = { ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png" };

export function createDevServer({ offline = false } = {}) {
  return http.createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
    catch { res.writeHead(400).end(); return; }
    if (pathname === "/api/discord") {
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 4500000) { res.writeHead(413).end(); return; }
        chunks.push(chunk);
      }
      try { req.body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {}; }
      catch { res.writeHead(400).end(); return; }
      res.status = code => { res.statusCode = code; return res; };
      res.json = value => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(value)); };
      if (offline && req.method === "POST" && req.headers.authorization) {
        res.status(503).json({ error: "External delivery is disabled in offline tests." });
        return;
      }
      await discordHandler(req, res);
      return;
    }
    if (!["GET", "HEAD"].includes(req.method)) { res.writeHead(405).end(); return; }
    if (pathname === "/firebase-config.js" && offline) {
      res.setHeader("Content-Type", types[".js"]);
      res.end('window.BOSS_TIMELINE_FIREBASE = null; window.BOSS_TIMELINE_DISCORD_API = "/api/discord";');
      return;
    }
    const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
    if (!/^(?:index\.html|firebase-config\.js|[\w-]+\.svg|assets\/[\w.-]+\.(?:js|css|png|svg))$/.test(relativePath)) {
      res.writeHead(404).end(); return;
    }
    try {
      const data = await readFile(resolve(root, relativePath));
      res.setHeader("Content-Type", types[extname(relativePath)] || "application/octet-stream");
      res.end(req.method === "HEAD" ? undefined : data);
    } catch { res.writeHead(404).end(); }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let port = Number(process.env.PORT) || 8137;
  const server = createDevServer({ offline: process.env.BOSS_TIMELINE_OFFLINE === "1" });
  server.on("error", error => {
    if (error.code === "EADDRINUSE" && port < 8157) { port++; server.listen(port, "127.0.0.1"); }
    else { console.error(error); process.exitCode = 1; }
  });
  server.on("listening", () => console.log(`Boss Timeline Pro: http://127.0.0.1:${port}`));
  server.listen(port, "127.0.0.1");
}
