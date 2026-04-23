import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '..', 'public', 'blog');

const files = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.md') && f !== 'blog-index.json')
  .sort()
  .reverse();

fs.writeFileSync(
  path.join(blogDir, 'blog-index.json'),
  JSON.stringify(files, null, 2)
);

console.log('Generated blog-index.json:', files.length, 'files');