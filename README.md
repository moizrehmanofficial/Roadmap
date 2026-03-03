# 🚀 DevGuide — Full-Stack Developer Study Guide

A complete interactive study guide for JavaScript, TypeScript, React, Next.js, PostgreSQL, Supabase, Git, and Vercel — with dark theme, animations, and a **live code playground** you can use on mobile too.

## ✨ Features

- 📚 **40+ concepts** explained with What / Why / How / When framework
- 💻 **Live Code Playground** — run JavaScript directly in the browser
- 📱 **Mobile friendly** — works on phones and tablets
- 🌙 **Dark theme** — easy on the eyes
- ⚡ **Fast** — built with Next.js 14 App Router
- 🆓 **Free to deploy** on Vercel

---

## 📁 Project Structure

```
devguide/
│
├── app/                          # Next.js App Router pages
│   ├── globals.css               # Global styles, CSS variables, animations
│   ├── layout.tsx                # Root layout (metadata, fonts)
│   ├── page.tsx                  # Home page (/)
│   ├── not-found.tsx             # 404 page
│   │
│   ├── guide/                    # Study guide section
│   │   ├── layout.tsx            # Sidebar navigation layout
│   │   ├── page.tsx              # Redirects to first concept
│   │   └── [topicId]/            # Dynamic topic route
│   │       ├── page.tsx          # Redirects to first concept of topic
│   │       └── [conceptId]/      # Dynamic concept route
│   │           └── page.tsx      # Concept page (explanation + code)
│   │
│   └── playground/
│       └── page.tsx              # Live code editor + console
│
├── lib/
│   └── data.ts                   # ALL study content (topics, concepts, examples)
│
├── public/                       # Static assets
│
├── .gitignore
├── .eslintrc.json
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🛠️ Setup & Run Locally

### Prerequisites
- **Node.js** version 18 or higher → [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js) or **pnpm** / **yarn**

### Steps

```bash
# 1. Navigate to project folder
cd devguide

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# → http://localhost:3000
```

That's it! No environment variables needed for the study guide.

---

## 🚀 Deploy to Vercel (Free)

### Method 1: GitHub + Vercel (Recommended)

```bash
# 1. Initialize git
git init
git add .
git commit -m "feat: initial devguide setup"

# 2. Create GitHub repository
# Go to github.com → New Repository → Copy the URL

# 3. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/devguide.git
git branch -M main
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"New Project"**
3. Import your `devguide` repository
4. Vercel auto-detects Next.js — click **Deploy**
5. Your site is live in ~60 seconds! 🎉

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts — Vercel handles everything
```

---

## 📦 Dependencies Explained

| Package | Why it's here |
|---------|---------------|
| `next` | The React framework — routing, SSR, build |
| `react` & `react-dom` | React itself |
| `framer-motion` | Smooth animations (optional, add later) |
| `lucide-react` | Icon library — clean SVG icons |
| `tailwindcss` | Utility-first CSS — rapid styling |
| `typescript` | Type safety |
| `@types/*` | TypeScript definitions for packages |
| `autoprefixer` | CSS vendor prefixes for cross-browser |
| `postcss` | CSS processing pipeline |

---

## 🧩 Adding New Content

All content lives in `lib/data.ts`. To add a new concept:

```typescript
// In lib/data.ts, find the topic and add to concepts array:
{
  id: "my-new-concept",
  title: "My New Concept Title",
  what: "What this concept is...",
  why: "Why you need to know it...",
  when: "When to use it...",
  how: "How to use it...",
  terms: [
    { term: "Key Term", definition: "What it means" },
  ],
  examples: [
    {
      language: "javascript",
      title: "Example title",
      code: `// Your code here
console.log("Hello!")`,
    },
  ],
}
```

Then the route `/guide/[topicId]/my-new-concept` is automatically created!

---

## 🎯 Topics Covered

1. **JavaScript** — Variables, Scope, Data Types, Functions, Arrays, Objects, Async
2. **TypeScript** — Types, Interfaces, Generics, Utility Types
3. **React** — Components, useState, useEffect, Hooks, Context
4. **Next.js** — App Router, Server/Client Components, API Routes
5. **PostgreSQL** — SQL CRUD, JOINs, Indexes
6. **Supabase** — Client Setup, CRUD, Authentication
7. **Git & GitHub** — Daily Workflow, Branching
8. **Vercel & Deployment** — CI/CD, Environment Variables

---

## 💡 Tips for Using the Playground

- Press **Ctrl+Enter** (or **Cmd+Enter** on Mac) to run code
- The **Tab** key inserts 2 spaces
- Use `console.log()` to see output
- `fetch()`, `async/await`, `setTimeout` all work
- Choose a starter template from the dropdown

---

## 📱 Mobile Usage

The guide is fully responsive:
- **Sidebar** becomes a slide-out drawer on mobile
- **Playground** stacks editor above console on small screens
- Tap any topic to expand its lessons
- All code examples have copy buttons

---

## 🎨 Customization

### Colors (in `globals.css`)
```css
:root {
  --accent-cyan: #00d4ff;    /* primary accent */
  --accent-purple: #a855f7;  /* secondary accent */
  --bg-primary: #080b14;     /* page background */
}
```

### Tailwind config (in `tailwind.config.ts`)
All custom colors, animations, and keyframes are defined here.

---

Built with ❤️ using Next.js 14 + Tailwind CSS
