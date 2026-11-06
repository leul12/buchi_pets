// Tiny static file server for the Buchi landing page. No dependencies.
// Hosts like EthioDeploy run `npm start` and give the port in PORT.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};
// Only these are public: the page and its pictures (not server.js, package.json, .git…).
const PUBLIC = (rel) => rel === "index.html" || rel === "robots.txt" || rel.startsWith("images/");

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    let rel = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    if (rel === "") rel = "index.html";
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT + path.sep) || !PUBLIC(rel.split(path.sep).join("/"))) {
      res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
        return;
      }
      const ext = path.extname(file).toLowerCase();
      res.writeHead(200, {
        "Content-Type": TYPES[ext] || "application/octet-stream",
        "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(data);
    });
  })
  .listen(PORT, "0.0.0.0", () => console.log(`Buchi landing page on port ${PORT}`));
