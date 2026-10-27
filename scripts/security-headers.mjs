import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Astro inlines small scripts, including the React hydration bootstrap. Hash the
// actual output on every build so CSP can allow those scripts without allowing
// arbitrary inline JavaScript or eval. JSON-LD is inert, not executable script.
const output = path.resolve('dist');
const hashes = new Set();
let pages = 0;
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await inspect(filename);
    else if (entry.name.endsWith('.html')) {
      pages++;
      const html = await readFile(filename, 'utf8');
      for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
        if (/\bsrc\s*=/i.test(attributes) || !body.trim()) continue;
        const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
        if (type && !['module', 'text/javascript', 'application/javascript'].includes(type)) continue;
        hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
      }
      // The existing non-blocking font link has this single load handler.
      // Refuse new handlers instead of silently granting them CSP permission.
      for (const [, handler] of html.matchAll(/\son[a-z]+="([^"]*)"/gi)) {
        if (handler !== "this.media='all'") throw new Error(`Unexpected inline event handler in ${filename}`);
      }
    }
  }
}
await inspect(output);
if (!pages || !hashes.size) throw new Error('No built pages or scripts found for CSP');
const fontHandlerHash = createHash('sha256').update("this.media='all'").digest('base64');
const policy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' https://static.cloudflareinsights.com ${[...hashes].sort().join(' ')}`,
  `script-src-attr 'unsafe-hashes' 'sha256-${fontHandlerHash}'`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com https://*.cloudflareinsights.com",
  "frame-src https://www.google.com https://www.openstreetmap.org",
  'upgrade-insecure-requests',
].join('; ');
const header = `  Content-Security-Policy: ${policy}`;
if (header.length > 2000) throw new Error('CSP exceeds the Workers 2,000-character header line limit');
const baseline = await readFile('public/_headers', 'utf8');
await writeFile(path.join(output, '_headers'), baseline.trimEnd() + '\n' + header + '\n');
console.log(`Security headers: ${pages} HTML pages, ${hashes.size} allowed script hashes, ${header.length} character CSP line.`);
