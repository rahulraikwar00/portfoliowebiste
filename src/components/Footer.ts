import { renderIcon } from "../utils/renderIcon.js";

export function createFooter(): string {
  return `<footer>
      <div class="social">
        <a href="https://github.com/rahulraikwar00" class="social-link" target="_blank" aria-label="GitHub">${renderIcon("FiGithub", 18)}</a>
        <a href="https://linkedin.com/in/rahul-raikwar" class="social-link" target="_blank" aria-label="LinkedIn">${renderIcon("CiLinkedin", 18)}</a>
        <a href="https://x.com/silicon2token" class="social-link" target="_blank" aria-label="X">${renderIcon("FiTwitter", 18)}</a>
      </div>
      <p>&copy; ${new Date().getFullYear()} Rahul Raikwar</p>
    </footer>`;
}

// const styles = {
//   footer: `
//     footer {
//       text-align: center;
//       padding: 20px;
//       background-color: var(--footer-bg);
//       color: var(--footer-text);
//     }
//     .social a {
//       margin: 0 10px;
//       color: var(--footer-text);
//       transition: color 0.3s;
//     }
//     .social a:hover {
//       color: var(--accent-color);
//     }
//   `,
// };
