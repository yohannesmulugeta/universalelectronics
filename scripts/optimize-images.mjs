import { readFile, readdir, mkdir, writeFile, stat, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const src = path.join(root, 'src');
const publicAssets = path.join(root, 'public/assets');
const optimized = path.join(publicAssets, 'optimized');
const manifestFile = path.join(src, 'generated/image-manifest.json');
const widths = [480, 960, 1500];

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (/\.(?:astro|tsx?|jsx?)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const references = new Set();
for (const file of await walk(src)) {
  const body = await readFile(file, 'utf8');
  for (const match of body.matchAll(/\/assets\/[^"'\\\s<>\`]+?\.(?:png|jpe?g|webp|avif)/gi)) {
    references.add(match[0]);
  }
}
// Keep product photos, featured project scenes, and catalog images responsive.
// Avoid processing the archived originals that never appear on the public website.
await rm(optimized, { recursive: true, force: true });
await mkdir(optimized, { recursive: true });
await mkdir(path.dirname(manifestFile), { recursive: true });
const manifest = {};
let totalOriginal = 0;
let totalOptimized = 0;
let generated = 0;
for (const source of [...references].sort()) {
  const relative = source.replace(/^\/assets\//, '');
  const filePath = path.join(publicAssets, relative);
  let originalStats;
  try { originalStats = await stat(filePath); } catch { continue; }
  if (originalStats.size < (source.startsWith('/assets/brand/') ? 4 : 80) * 1024) continue;
  let original;
  try { original = sharp(filePath, { failOn: 'none' }).rotate(); await original.metadata(); }
  catch (error) { console.warn('Image skipped:', source, String(error)); continue; }
  const fileVariants = {};
  for (const width of source.startsWith('/assets/brand/') ? [200, 400] : widths) {
    try {
      const buffer = await sharp(filePath, { failOn: 'none' })
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 75, effort: 4 })
        .toBuffer();
      // Keep a derivative only when it actually reduces transferred bytes.
      if (buffer.length >= originalStats.size * 0.96) continue;
      const filename = relative + '-' + width + '.webp';
      const target = path.join(optimized, filename);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, buffer);
      fileVariants[width] = '/assets/optimized/' + filename.replaceAll(path.sep, '/');
      totalOptimized += buffer.length;
      generated++;
    } catch (error) {
      console.warn('Could not optimize', source, width, String(error));
    }
  }
  if (Object.keys(fileVariants).length) {
    manifest[source] = fileVariants;
    totalOriginal += originalStats.size;
  }
}
await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
console.log('Image optimization: ' + Object.keys(manifest).length + ' source images, ' + generated + ' responsive variants.');
console.log('Original selected bytes: ' + (totalOriginal/1024/1024).toFixed(2) + ' MiB. Derivative variants combined: ' + (totalOptimized/1024/1024).toFixed(2) + ' MiB.');
