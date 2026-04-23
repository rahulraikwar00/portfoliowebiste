import './style.css';
import { marked } from 'marked';

function addCopyButtons() {
  const preBlocks = document.querySelectorAll('#blog-post pre');
  preBlocks.forEach(pre => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode?.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
    button.onclick = () => {
      const code = pre.textContent || '';
      navigator.clipboard.writeText(code).then(() => {
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
        setTimeout(() => {
          button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
        }, 2000);
      });
    };
    wrapper.appendChild(button);
  });
}

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
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
      return {
        slug: meta.slug,
        title: meta.title,
        date: meta.date,
        content: content
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

  const relatedPost = blogPosts.find(p => p.slug !== slug);

  const header = document.getElementById('main-header');
  const footer = document.querySelector('footer');
  const toggle = document.querySelector('.theme-toggle');
  if (header) header.style.display = 'none';
  if (footer) footer.style.display = 'none';
  if (toggle) (toggle as HTMLElement).style.display = 'none';

  const main = document.querySelector('main');
  if (!main) return;

  const html = await marked.parse(post.content.replace(/^# .+$/m, '').trim());
  main.innerHTML = `<section id="blog-post">
      <a href="#" class="back-link">← All Posts</a>
      <h1>${post.title}</h1>
      <span class="meta">${post.date}</span>
      <div class="content">${html}</div>
      ${relatedPost ? `<div class="related"><p>What's next?</p><a href="#${relatedPost.slug}">${relatedPost.title}</a></div>` : ''}
    </section>`;
  
  addCopyButtons();
}

function renderBlogList() {
  const blogSection = document.querySelector('#blog');
  if (!blogSection) return;

  const cards = blogPosts.map(post => `
    <article class="card">
      <h3><a href="#${post.slug}">${post.title}</a></h3>
      <span class="date">${post.date}</span>
    </article>
  `).join('');

  blogSection.innerHTML = `<h2>Blog</h2>${cards}`;
}

async function init() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);

  blogPosts = await fetchBlogPosts();
  renderBlogList();

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

(window as any).toggleTheme = function() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeButton(next);
};

const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

function updateThemeButton(theme: string) {
  const btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.innerHTML = theme === 'light' ? moonIcon : sunIcon;
  }
}