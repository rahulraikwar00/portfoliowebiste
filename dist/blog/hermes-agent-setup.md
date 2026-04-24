---
title: Setting Up Hermes Agent for Development
date: April 20, 2026
slug: hermes-agent-setup
---

# Setting Up Hermes Agent for Development

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

```bash
npm install -g hermes-agent
```

That's it! The package installs globally so you can use it from any directory.

## Configuration

After installation, create a config file at `~/.hermes/config.json`:

```json
{
  "model": "gpt-4",
  "apiKey": "your-api-key-here",
  "editor": "vim",
  "shell": "zsh"
}
```

You can also use environment variables:

```bash
export OPENAI_API_KEY="your-key"
```

## Your First Conversation

Start hermes-agent by running:

```bash
hermes-agent
```

You'll see a prompt where you can type naturally. Try asking:

- "Explain this code I'm looking at"
- "Write a function to parse CSV files"
- "Find all TODO comments in this project"

## Keyboard Shortcuts

- `Ctrl+C` - Cancel current task
- `Ctrl+D` - Exit hermes-agent
- `Ctrl+L` - Clear screen

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

Happy coding!