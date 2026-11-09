# DevGuide

A free, open study guide for building, shipping and securing software: **Foundations, Full-Stack Development, DevOps, Cloud, Cyber Security, DevSecOps, Cloud Security and Career**, with 459 lessons mapped across 65 modules.

Every lesson follows the same structure: **What → Why → When & where → How → Hands-on → Real-world example → Common mistakes → Security lens → Interview questions → Key terms → Practice**.

## Features

- **Full curriculum map.** Every planned lesson is visible from day one; unwritten ones are marked *Planned*.
- **MDX lessons** with syntax-highlighted code (light and dark), copy buttons, callouts, glossaries and interview Q&A.
- **Playground.** Runs JavaScript and TypeScript in an isolated Web Worker that is stopped after 5 seconds, so an infinite loop cannot freeze the page. Any JS/TS example in a lesson opens there with **Run**.
- **Search** (`Ctrl K` or `/`) across all lessons, planned ones included.
- **Progress tracking** in the browser, with export/import to move it between phone and laptop.
- Light and dark themes, mobile-first layout, keyboard accessible, fully static.

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run check:content
```

## Project structure

```
content/
  curriculum.ts            # Tracks → modules → lessons (the whole roadmap)
  LESSON_TEMPLATE.mdx      # Copy this to start a new lesson
  lessons/<track>/<module>/<lesson-slug>.mdx
app/
  page.tsx                 # Home: learning path
  tracks/[track]/          # Track overview
  learn/[track]/[module]/[lesson]/   # Lesson page
  playground/              # JS/TS playground
  progress/                # Progress, export / import
  search.json/             # Static search index
components/                # UI (code blocks, callouts, search, nav, progress…)
lib/
  content.ts               # Reads curriculum + MDX
  mdx.tsx                  # MDX → React (shiki highlighting)
  runner.ts                # Sandboxed Web Worker code runner
  progress.ts              # localStorage progress store
scripts/check-content.mjs  # Validates lessons against the curriculum
```

## Adding a lesson

1. Find the lesson title in `content/curriculum.ts`. Its slug is the lowercase title with spaces turned into `-` (for example *SSH and Key-Based Authentication* becomes `ssh-and-key-based-authentication`).
2. Copy `content/LESSON_TEMPLATE.mdx` to `content/lessons/<track>/<module>/<slug>.mdx`.
3. Write it, then run `npm run check:content`.

The lesson changes from *Planned* to published automatically.

MDX components available in lessons: `<Callout type="note|tip|warning|danger|security">`, `<Terms>` + `<Term name="">`, `<QA q="">`, `<Steps>`.

## Deploy

Push to GitHub and import the repository on Vercel. No environment variables are required. Optionally set `NEXT_PUBLIC_SITE_URL` to the production URL so social-preview metadata uses absolute links.
