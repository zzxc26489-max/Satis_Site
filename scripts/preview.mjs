// Локальный просмотр существующего статического сайта. Сборка не требуется.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const root = process.cwd();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://preview').pathname);
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    let content = await readFile(file);
    // Предпросмотр обслуживается по HTTP; production CSP остаётся в файле.
    if (path.extname(file) === '.html') {
      content = content.toString('utf8').replace('; upgrade-insecure-requests', '');
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});
server.listen(Number(option('--port', 4173)), option('--host', '127.0.0.1'), () => console.log('Satis preview ready'));
