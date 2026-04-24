---
title: Vim Tips for Developers
date: April 18, 2026
slug: vim-tips-developers
---

# Vim Tips for Developers

Essential Vim tips for developers who want to be more productive in the terminal.

## Why Vim?

Vim is modal — this means it takes time to learn but pays off in speed once mastered. Here's how to make the most of it.

## Essential Movements

- `h j k l` — Basic movement (or arrow keys, but learn the defaults)
- `w` — Next word start
- `e` — Next word end
- `b` — Previous word start
- `0` — Line start
- `$` — Line end
- `gg` — File start
- `G` — File end

## Text Objects Are Your Friend

Text objects let you operate on blocks of text:

- `iw` — inner word
- `aw` — a word (includes space)
- `i(` — inner parentheses
- `a(` — a parentheses
- `i"` — inner quotes
- `ip` — inner paragraph
- `ap` — a paragraph

Combine with `d`, `c`, `y`:
- `ciw` — change inner word
- `da"` — delete a quote
- `yip` — yank inner paragraph

## Search and Replace

- `*` — Search for word under cursor
- `n` — Next match
- `N` — Previous match
- `/pattern` — Search forward
- `?pattern` — Search backward

In command mode:
- `:%s/old/new/g` — Replace all
- `:%s/old/new/gc` — Replace all with confirm

## Windows and Tabs

- `:sp` — Split horizontal
- `:vsp` — Split vertical
- `Ctrl+w h/j/k/l` — Navigate splits
- `:tabnew` — New tab
- `gt` — Next tab
- `gT` — Previous tab

## Macros

Record and replay:

- `qa` — Start recording to register a
- `q` — Stop recording
- `@a` — Play back register a
- `@@` — Repeat last macro

Example: Number lines
```
qa
yyp
Ctrl+a
q
```
Then press `@a` repeatedly.

## Buffers

- `:ls` — List buffers
- `:b next` — Switch to next buffer
- `:b name` — Switch by name
- `:bd` — Delete buffer

## Dot Command

The `.` repeats your last change. This alone makes Vim powerful.

Make a change once, then use `.` to repeat it elsewhere.

## Config

Add to `~/.vimrc`:

```vim
" Enable syntax highlighting
syntax on

" Show line numbers
set number

" Use relative line numbers
set relativenumber

" Enable mouse
set mouse=a

" Search case insensitive
set ignorecase
set smartcase

" Highlight search
set hlsearch

" Auto indent
set autoindent
set smartindent

" Use spaces instead of tabs
set expandtab
set shiftwidth=2
set tabstop=2
```

## Getting Started

1. Start with basic movements
2. Learn one new command per day
3. Try using Vim for small edits first
4. Gradually replace your editor

Start with `vimtutor` in your terminal — it comes with Vim and takes 30 minutes.