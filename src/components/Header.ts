import { renderIcon } from "../utils/renderIcon.js";

export function createHeader(): string {
  return `<header id="main-header">
      <div class="header-top">
        <h1>Rahul Raikwar</h1>
        <div class="header-right">
          <button id="theme-toggle" aria-label="Toggle theme"><i data-lucide="moon" width="18" height="18"></i></button>
          <div class="header-links">
          <button id="support-btn" class="support-header-btn" aria-label="Support"><i data-lucide="coffee" width="18" height="18" aria-hidden="true"></i></button>
        </div>
        </div>
      </div>
      <p class="tagline">Software engineer & developer. Building tools, automating workflows, and writing about code.</p>
      <p class="bio">Hi, I'm Rahul — a developer passionate about clean code, automation, and building useful tools. I work on backend systems, DevOps, and AI integrations. This site shares my projects and thoughts.</p>
      <div class="skills">
        <span>TypeScript</span><span>Node.js</span><span>Python</span><span>React</span><span>PostgreSQL</span><span>Kubernetes</span><span>Docker</span><span>FastAPI</span><span>DevOps</span><span>AI</span>
      </div>
    </header>`;
}
