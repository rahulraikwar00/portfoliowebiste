---
title: Setting Up Hermes Agent for Development
date: April 20, 2026
slug: hermes-agent-setup
---

A quick guide to installing and configuring Hermes Agent on your development machine for coding, research, file operations, and automation. Hermes Agent is a terminal-based AI assistant that works alongside you, handling the repetitive stuff so you can focus on the creative parts of development.

## What is Hermes Agent?

Hermes Agent is an open-source, terminal-based AI assistant for developers. It helps with coding tasks, research questions, file operations, and automation. It runs entirely in your terminal, integrates with your local development environment, and can read and write files in your project. Unlike cloud-based coding assistants, Hermes Agent operates on your local machine with direct access to your files and tools.

The agent works best when you provide context about what you're working on. Navigate to your project directory before starting a session. The agent will read your project files, understand the structure, and provide more relevant assistance.

## Prerequisites

Before installing, make sure you have Node.js 18 or higher installed on your system. Verify with `node --version`. You also need npm or pnpm as your package manager. An OpenAI API key is optional but recommended for advanced features like code explanation, debugging assistance, and complex task automation.

## Installation

Open your terminal and run:

```bash
npm install -g hermes-agent
```

The package installs globally so you can use it from any directory. Installation takes about 30 seconds depending on your internet connection speed.

After installation, verify it works:

```bash
hermes-agent --version
```

You should see the version number printed in your terminal.

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

Set the model to one you have access to — `gpt-4` offers higher quality responses, while `gpt-3.5-turbo` is faster and cheaper. Set `editor` to your preferred editor (vim, nano, code for VS Code). Set `shell` to your default shell (bash, zsh, fish).

You can also use environment variables for the API key:

```bash
export OPENAI_API_KEY="your-key"
```

This approach keeps your API key out of config files, which is better for security if you commit your config to a dotfiles repository.

## Your First Conversation

Start hermes-agent by running:

```bash
hermes-agent
```

You'll see a prompt where you can type naturally. Try asking questions about your current project:

- "Explain this code I'm looking at"
- "Write a function to parse CSV files"
- "Find all TODO comments in this project"
- "What dependencies does this project use?"

The agent reads your project files to provide context-aware responses. Navigate to a project directory before starting for the best results.

## Keyboard Shortcuts

- `Ctrl+C` cancels the current task
- `Ctrl+D` exits hermes-agent  
- `Ctrl+L` clears the screen
- `Ctrl+P` pastes the current clipboard contents

## Tips for Better Results

Be specific with your requests. "Create a React component for a login form with email and password fields, validation, and error handling" works better than "make a form." Use context by navigating to your project first so the agent can read the files. Iterate by refining your requests based on the output — it's a conversation, not a magic wand.

## Troubleshooting

**API errors.** Check your API key is set correctly in config or environment. Run `echo $OPENAI_API_KEY` to verify the environment variable. **Slow responses.** Try using gpt-3.5-turbo instead of gpt-4 for faster results on simpler tasks. **Permission errors.** Make sure your config directory is writable. Run `chmod 755 ~/.hermes` to fix permissions.
