// Local preview server. No dependencies: node serve.js [port]
// Mimics GitHub Pages: clean URLs (/asos-refer-a-friend -> asos-refer-a-friend.html)
// and 404.html for anything missing.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.argv[2]) || 8000;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
};

function resolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const safe = path.normalize(path.join(root, decoded));
  if (!safe.startsWith(root)) return null; // no escaping the repo
  const candidates = safe.endsWith(path.sep)
    ? [path.join(safe, 'index.html')]
    : [safe, safe + '.html', path.join(safe, 'index.html')];
  return candidates.find((p) => fs.existsSync(p) && fs.statSync(p).isFile()) || null;
}

http
  .createServer((req, res) => {
    let file = resolve(req.url);
    let status = 200;
    if (!file) {
      file = path.join(root, '404.html');
      status = 404;
      if (!fs.existsSync(file)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not found');
      }
    }
    const type = types[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const size = fs.statSync(file).size;
    const range = status === 200 && req.headers.range;

    // Range requests, so the case-study videos can seek and play in every browser.
    const match = range && /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match) {
      let [, startRaw, endRaw] = match;
      let start = startRaw ? Number(startRaw) : size - Number(endRaw);
      let end = startRaw && endRaw ? Number(endRaw) : size - 1;
      if (!(start >= 0 && end < size && start <= end)) {
        res.writeHead(416, { 'Content-Range': `bytes */${size}` });
        return res.end();
      }
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-store',
      });
      if (req.method === 'HEAD') return res.end();
      return fs.createReadStream(file, { start, end }).pipe(res);
    }

    res.writeHead(status, {
      'Content-Type': type,
      'Content-Length': size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store',
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`peterwford.com -> http://localhost:${port}`));
