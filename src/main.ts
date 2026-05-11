import './style.css';
import { marked } from 'marked';
import { createIcons, icons } from 'lucide';

function addCopyButtons() {
  const preBlocks = document.querySelectorAll('#blog-post pre');
  preBlocks.forEach(pre => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode?.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.innerHTML = `<i data-lucide="copy" width="14" height="14"></i>`;
    button.onclick = () => {
      const code = pre.textContent || '';
      navigator.clipboard.writeText(code).then(() => {
        button.innerHTML = `<i data-lucide="check" width="14" height="14"></i>`;
        createIcons({ icons });
        setTimeout(() => {
          button.innerHTML = `<i data-lucide="copy" width="14" height="14"></i>`;
          createIcons({ icons });
        }, 2000);
      });
    };
    wrapper.appendChild(button);
  });
  createIcons({ icons });
}

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  readingTime: string;
}

interface BlogMeta {
  title: string;
  date: string;
  slug: string;
}

function parseFrontmatter(content: string): { meta: BlogMeta; content: string } {
  const lines = content.split('\n');
  const meta: Partial<BlogMeta> = {};
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
      const value = valueParts.join(':').trim();
      if (key === 'title') meta.title = value;
      else if (key === 'date') meta.date = value;
      else if (key === 'slug') meta.slug = value;

    }
  }

  return {
    meta: meta as BlogMeta,
    content: lines.slice(contentStart).join('\n')
  };
}

let blogPosts: BlogPost[] = [];

async function fetchBlogPosts(): Promise<BlogPost[]> {
  const indexResponse = await fetch('/blog/blog-index.json');
  const files: string[] = await indexResponse.json();
  
  const posts: BlogPost[] = await Promise.all(
    files.map(async (filename) => {
      const response = await fetch(`/blog/${filename}`);
      const raw = await response.text();
      const { meta, content } = parseFrontmatter(raw);
      const words = content.split(/\s+/).length;
      const mins = Math.max(1, Math.round(words / 200));
      return {
        slug: meta.slug,
        title: meta.title,
        date: meta.date,
        content: content,
        readingTime: `${mins} min read`,
      };
    })
  );

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getSlugFromUrl(): string | null {
  const hash = window.location.hash.slice(1);
  return hash || null;
}

async function renderBlogPost(slug: string) {
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) {
    window.location.search = '';
    return;
  }

  const idx = blogPosts.indexOf(post);
  const related = [blogPosts[idx - 1], blogPosts[idx + 1]].filter(Boolean);

  const header = document.getElementById('main-header');
  const footer = document.querySelector('footer');
  if (header) header.style.display = 'none';
  if (footer) footer.style.display = 'none';

  const main = document.querySelector('main');
  if (!main) return;

  const html = await marked.parse(post.content.replace(/^# .+$/m, '').trim());
  main.innerHTML = `<section id="blog-post" class="fade-in">
      <a href="#" class="back-link" id="back-link">← Back to Blog</a>
      <h1>${post.title}</h1>
      <div class="meta">${post.date} · ${post.readingTime}</div>
      <div class="content">${html}</div>
      ${related.length ? `<div class="related"><p>More posts</p><div class="related-grid">${related.map(p => `<a href="#${p.slug}">${p.title}</a>`).join('')}</div></div>` : ''}
    </section>`;
  
  const backLink = document.getElementById('back-link');
  if (backLink) {
    backLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '';
      window.location.reload();
    });
  }
  createIcons({ icons });
  addCopyButtons();
}

function renderBlogList() {
  const blogSection = document.querySelector('#blog');
  if (!blogSection) return;

  let currentYear = '';
  const items = blogPosts.map(post => {
    const year = post.date.match(/\d{4}/)?.[0] ?? '';
    const yearHeader = year !== currentYear ? (currentYear = year, `<div class="blog-year">${year}</div>`) : '';
    return `${yearHeader}
    <article>
      <div class="blog-top">
        <h3><a href="#${post.slug}">${post.title}</a></h3>
        <span class="date">${post.date}</span>
      </div>
      <span class="reading-time">${post.readingTime}</span>
    </article>`;
  }).join('');

  blogSection.innerHTML = `<h2>Blog <span class="post-count">· ${blogPosts.length} posts</span></h2>${items}`;
  createIcons({ icons });
}

async function init() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      const icon = toggle.querySelector('[data-lucide]');
      if (icon) icon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
      createIcons({ icons });
    });
  }

  blogPosts = await fetchBlogPosts();
  renderBlogList();
  createIcons({ icons });

  const slug = getSlugFromUrl();

  if (slug) {
    await renderBlogPost(slug);
  }
}

window.addEventListener('hashchange', async () => {
  const slug = getSlugFromUrl();
  if (slug) {
    await renderBlogPost(slug);
  } else {
    window.location.reload();
  }
});

init();
