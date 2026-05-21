# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A personal digital garden / knowledge base built on [Quartz v4](https://quartz.jzhao.xyz/) — a static site generator for Obsidian-style markdown notes. The site deploys to GitHub Pages from the `main` branch via `.github/workflows/deploy.yml`.

## Commands

```bash
npm run serve        # Build and serve locally with hot reload (http://localhost:8080)
npm run docs         # Serve the Quartz documentation instead of content
npm run check        # TypeScript type-check + Prettier format check
npm run format       # Auto-format all files with Prettier
npm test             # Run tests with tsx
npx quartz build     # One-shot build → output in public/
```

Run `npm run check` before committing; CI enforces both type correctness and formatting.

## Architecture

**Two distinct layers:**

1. **Quartz framework** (`quartz/`) — the SSG engine. Avoid modifying this unless extending the framework itself. Key entry points:
   - `quartz/plugins/` — transformers (markdown → AST), filters (exclude pages), emitters (AST → HTML files)
   - `quartz/components/` — Preact components for page layout (`.tsx`)
   - `quartz/cfg.ts` — type definitions for the config

2. **Site configuration & content** — the two files you'll touch most:
   - `quartz.config.ts` — plugin pipeline, theme colors, analytics, base URL, ignore patterns
   - `quartz.layout.ts` — which components appear in which layout zones (left sidebar, right sidebar, before/after body)
   - `content/` — all markdown notes; this is the actual knowledge base

**Build pipeline:** `quartz/build.ts` runs transformers → filters → emitters in sequence. Transformers process markdown frontmatter and AST, filters drop pages (e.g. `draft: true`), emitters write HTML to `public/`.

## Content Authoring

Every markdown file in `content/` must have YAML frontmatter:

```yaml
---
title: "Page Title"
description: "Brief description"
tags: [relevant, tags]
draft: false
date: YYYY-MM-DD
lastmod: YYYY-MM-DD
---
```

Pages with `draft: true` are excluded from the build by `Plugin.RemoveDrafts()`.

**Content areas:** Python, AWS, SQL, Django, FastAPI, React Testing Library, TypeScript, Infrastructure, System design, Git, Coding practices, Package management, Pytest.

**Internal links:** Use Obsidian-style wikilinks `[[Page Title]]` or shortest-path relative links. `Plugin.CrawlLinks({ markdownLinkResolution: "shortest" })` resolves them.

**Style:** Concise, practical, structured with H2/H3/H4 headings. Cover 80% use cases; avoid lengthy theoretical explanations or multiple examples for the same concept. Don't add "Next steps", "Further reading", or "Support" sections.

## Adding Frontmatter in Bulk

`add-metadata.cjs` is a utility script (currently scoped to `content/python/**`) for bulk-adding frontmatter to files that lack it. Adjust the glob and default tags as needed before running with `node add-metadata.cjs`.
