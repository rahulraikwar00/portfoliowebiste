import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import { createFooter } from '../src/components/Footer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicBlogDir = path.join(__dirname, '..', 'public', 'blog');
const docsDir = path.join(__dirname, '..', 'docs');

interface BlogMeta {
  slug?: string;
  title?: string;
  date?: string;
  [key: string]: string | undefined;
}

function parseFrontmatter(content: string): { meta: BlogMeta; content: string } {
  const lines = content.split('\n');
  const meta: BlogMeta = {};
  let contentStart = 0;
  let inFrontmatter = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '---') {
      if (inFrontmatter) {
        contentStart = i + 1;
        break;
      }
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter && line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      meta[key.trim()] = valueParts.join(':').trim();
    }
  }

  return {
    meta,
    content: lines.slice(contentStart).join('\n').trim(),
  };
}

function getDescription(content: string): string {
  const text = content.replace(/^#.+$/m, '').trim().split('\n\n')[0] || '';
  return text.replace(/<[^>]*>/g, '').replace(/[""]/g, '').slice(0, 160).trim() || 'Read this blog post by Rahul Raikwar';
}

function escHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function escJson(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

const files = fs.readdirSync(publicBlogDir)
  .filter(f => f.endsWith('.md') && f !== 'blog-index.json');

for (const file of files) {
  const raw = fs.readFileSync(path.join(publicBlogDir, file), 'utf-8');
  const { meta, content } = parseFrontmatter(raw);
  const slug = meta.slug;
  if (!slug) continue;

  const htmlContent = marked.parse(content) as string;
  const description = getDescription(content);
  const postDir = path.join(docsDir, 'blog', slug);

  fs.mkdirSync(postDir, { recursive: true });

  const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escHtml(meta.title || '')} | Rahul Raikwar</title>
    <meta name="description" content="${escHtml(description)}" />
    <link rel="canonical" href="https://iamrahulraikwar.online/blog/${slug}/" />
    <meta property="og:title" content="${escHtml(meta.title || '')}" />
    <meta property="og:description" content="${escHtml(description)}" />
    <meta property="og:url" content="https://iamrahulraikwar.online/blog/${slug}/" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Rahul Raikwar" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escHtml(meta.title || '')}" />
    <meta name="twitter:description" content="${escHtml(description)}" />
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${escJson(meta.title || '')}",
      "datePublished": "${escJson(meta.date || '')}",
      "author": {
        "@type": "Person",
        "name": "Rahul Raikwar",
        "url": "https://iamrahulraikwar.online"
      }
    }
    </script>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <main>
      <section>
        <p><a href="../">&larr; All Posts</a></p>
        <h1>${escHtml(meta.title || '')}</h1>
        <p>${escHtml(meta.date || '')}</p>
        <div>${htmlContent}</div>
      </section>
    </main>
    ${createFooter()}
  </body>
</html>`;

  fs.writeFileSync(path.join(postDir, 'index.html'), page);
  console.log('Generated blog page:', slug);
}

let sitemapUrls = `<url><loc>https://iamrahulraikwar.online/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>`;

for (const file of files) {
  const raw = fs.readFileSync(path.join(publicBlogDir, file), 'utf-8');
  const { meta } = parseFrontmatter(raw);
  if (meta.slug) {
    sitemapUrls += `<url><loc>https://iamrahulraikwar.online/blog/${meta.slug}/</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>`;
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`;

fs.writeFileSync(path.join(docsDir, 'sitemap.xml'), sitemap);
console.log('Generated sitemap.xml');

console.log('Done. Generated', files.length, 'blog pages + sitemap.xml');
