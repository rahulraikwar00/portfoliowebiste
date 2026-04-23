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

const blogPosts: BlogPost[] = [
  {
    slug: 'hermes-agent-setup',
    title: 'Setting Up Hermes Agent for Development',
    date: 'April 20, 2026',
    content: `# Setting Up Hermes Agent for Development

A quick guide to installing and configuring Hermes Agent on WSL for your daily development workflow.

## What is Hermes Agent?

Hermes Agent is a terminal-based AI assistant that helps you with coding, research, file operations, and automation. It's designed to work alongside you, handling the repetitive stuff so you can focus on the creative parts of development.

## Prerequisites

Before installing, make sure you have:

- Node.js 18 or higher
- npm or pnpm package manager
- An OpenAI API key (optional, for advanced features)

## Installation

Open your terminal and run:

\`\`\`bash
npm install -g hermes-agent
\`\`\`

That's it! The package installs globally so you can use it from any directory.

## Configuration

After installation, create a config file at \`~/.hermes/config.json\`:

\`\`\`json
{
  "model": "gpt-4",
  "apiKey": "your-api-key-here",
  "editor": "vim",
  "shell": "zsh"
}
\`\`\`

You can also use environment variables:

\`\`\`bash
export OPENAI_API_KEY="your-key"
\`\`\`

## Your First Conversation

Start hermes-agent by running:

\`\`\`bash
hermes-agent
\`\`\`

You'll see a prompt where you can type naturally. Try asking:

- "Explain this code I'm looking at"
- "Write a function to parse CSV files"
- "Find all TODO comments in this project"

## Keyboard Shortcuts

- \`Ctrl+C\` - Cancel current task
- \`Ctrl+D\` - Exit hermes-agent
- \`Ctrl+L\` - Clear screen

## Tips for Better Results

1. **Be specific** - "Create a React component for a login form" works better than "make something"

2. **Use context** - Navigate to your project first so hermes-agent can read the files

3. **Iterate** - It's a conversation, not a magic wand. Refine your requests.

## Troubleshooting

**API errors**: Check your API key is set correctly in config or environment

**Slow responses**: Try using gpt-3.5-turbo instead of gpt-4 for faster results

**Permission errors**: Make sure your config directory is writable

## What's Next

Once you're comfortable, explore:

- Custom prompts for your team
- Integration with git hooks
- Automated code reviews

Happy coding!`
  },
  {
    slug: 'obsidian-vault-wsl',
    title: 'Managing Obsidian Vault on Linux WSL',
    date: 'April 19, 2026',
    content: `# Managing Obsidian Vault on Linux WSL

How to structure your Obsidian vault when using WSL with a Windows host — keeping your notes organized and accessible.

## The Problem

When using WSL (Windows Subsystem for Linux) alongside Windows, you have two file systems to choose from. Each has pros and cons:

- **Windows drive** (\`/mnt/c/...\`) - Accessible from Windows apps but slower
- **Linux drive** (\`~/...\`) - Fast but harder to access from Windows

Finding the right setup for your knowledge management system matters more than you'd think.

## Option 1: Windows Drive

Store your vault in Windows and access it via \`/mnt/c\`:

\`\`\`
/mnt/c/Users/YourName/Documents/Obsidian/Vault
\`\`\`

### Pros
- Full access from the Windows Obsidian app
- Easy backup via OneDrive or iCloud
- Syncs across your Windows devices
- No permission headaches

### Cons
- Noticeably slower file operations in WSL
- Path handling can be tricky
- Some Linux tools may choke on Windows line endings

### Best For
- Using Obsidian primarily on Windows
- Team environments on Windows
- Quick setup without migration

## Option 2: Linux Drive

Keep everything in Linux:

\`\`\`
~/notes/vault
\`\`\`

Then use Obsidian for Linux or access via WSLg.

### Pros
- Blazing fast file access
- Native Linux experience
- Perfect for terminal-based workflows
- Easy git integration

### Cons
- Can't easily open from Windows Obsidian
- Requires WSLg or X server for GUI apps
- Sync across devices needs manual setup

### Best For
- Terminal-first workflows
- Running Obsidian in WSL only
- Developers who live in the Linux ecosystem

## Option 3: Hybrid Approach (Recommended)

Use two vaults:

1. **Windows vault** (\`/mnt/c/...\`) - For general notes, meeting notes, anything sharing with Windows apps

2. **Linux vault** (\`~/notes/dev\`) - For development notes, code snippets, technical documentation

### How to Link Them

Use symbolic links to keep them organized:

\`\`\`bash
# In your Linux home
mkdir -p ~/notes
ln -s /mnt/c/Users/YourName/Documents/Obsidian/General ~/notes/windows
\`\`\`

Now \`~/notes/windows\` points to your Windows vault.

## Vault Structure

Whatever option you choose, structure matters. Here's what works:

\`\`\`
Vault/
├── 00-Inbox/       # Quick captures
├── 10-Projects/    # Project-specific notes
├── 20-Code/        # Code snippets, commands
├── 30-Learning/    # Tutorials, articles
└── 40-Reference/  # API docs, cheatsheets
\`\`\`

The numeric prefix keeps things alphabetically sorted.

## Syncing

For the Linux-only approach, use git or a sync service:

\`\`\`bash
# Simple git sync
cd ~/notes
git init
git remote add origin your-repo
\`\`\`

Or use Syncthing for automatic sync between machines.

## My Setup

I'm currently using Option 3 with:

- Windows vault for general notes
- Linux vault for dev stuff
- Git-backed code notes

It takes a bit of maintenance but gives me the best of both worlds.

## Decision Framework

Ask yourself:

1. **Where do I primarily use Obsidian?** That's your main vault location.
2. **Do I need cross-platform access?** Use Windows drive.
3. **Am I terminal-first?** Go Linux-native.
4. **Do I work with non-technical teammates?** Windows drive.

Start simple, iterate as needed.`
  }
];

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

async function init() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);

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
    btn.innerHTML = theme === 'dark' ? moonIcon : sunIcon;
  }
}