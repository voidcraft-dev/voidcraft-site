-- voidcraft-site CMS 数据 seed
-- 在 Supabase SQL Editor 跑一次，把硬编码内容灌入 VoidAdmin
-- 跑之前确认 cms_pages 表已创建（voidadmin/supabase/schema.sql）

-- 1. Hero section
INSERT INTO cms_pages (slug, product_id, title, content, version, published)
VALUES (
  'hero',
  'voidcraft-site',
  'Hero',
  '{
    "type": "landing-hero",
    "version": 1,
    "data": {
      "eyebrow": "Full-Stack Developer · AI Builder · Open Source Creator · Indie Maker",
      "title": "Building things from the void",
      "description": "Crafting AI-powered tools, desktop apps, and an interconnected creative universe — where music, stories, art, and worlds converge.",
      "ctas": [
        { "label": "Explore Products", "href": "#projects", "variant": "primary" },
        { "label": "GitHub", "href": "https://github.com/voidcraft-dev", "variant": "outline" }
      ]
    }
  }'::jsonb,
  1,
  true
)
ON CONFLICT (slug, product_id) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = now();

-- 2. Products matrix
INSERT INTO cms_pages (slug, product_id, title, content, version, published)
VALUES (
  'products-matrix',
  'voidcraft-site',
  'Products & Tools',
  '{
    "type": "products-matrix",
    "version": 1,
    "data": {
      "headline": "Products & Tools",
      "subheadline": "Open-source tools and an AI creation ecosystem — where music, stories, art, and worlds come alive.",
      "products": [
        {
          "id": "termcanvas",
          "name": "TermCanvas",
          "tagline": "Multi-terminal management desktop app with an intuitive canvas UI.",
          "description": "Drag, resize, and organize terminal sessions visually. Supports PowerShell, CMD, WSL, Bash — with remote mobile access via QR code.",
          "tags": ["Tauri", "Rust", "React", "TypeScript"],
          "status": "beta",
          "featured": true,
          "order": 1
        },
        {
          "id": "memory-forge-rs",
          "name": "Memory Forge RS",
          "tagline": "Edit AI''s memory — local session manager for Claude Code, Codex, Gemini CLI & Kiro CLI.",
          "description": "100% offline, built with Tauri + Rust. Visualize and modify AI memory with a clean interface.",
          "tags": ["Tauri", "Rust", "TypeScript"],
          "status": "active",
          "featured": true,
          "order": 2
        },
        {
          "id": "beatcraft",
          "name": "BeatCraft",
          "icon": "🎵",
          "tagline": "AI-powered music generation platform. Create ancient-style, epic, and healing music with one click.",
          "description": "Live with Gumroad payment.",
          "tags": ["Next.js", "Suno API", "Cloudflare"],
          "status": "active",
          "order": 3
        },
        {
          "id": "huayixia",
          "name": "HuaYiXia",
          "icon": "🎨",
          "tagline": "VoidCraft visual engine — AI character illustration and cover design.",
          "description": "Dual engine: GPT Image + HTML rendering.",
          "tags": ["Next.js", "AI Image", "TypeScript"],
          "status": "beta",
          "order": 4
        },
        {
          "id": "vk-novel",
          "name": "vk-novel",
          "icon": "📖",
          "tagline": "Interactive novel platform with branching narratives, world-building tools, and AI-assisted writing.",
          "description": "Deployed on Cloudflare Workers.",
          "tags": ["Next.js", "D1", "Cloudflare Workers"],
          "status": "beta",
          "order": 5
        },
        {
          "id": "seedworld",
          "name": "SeedWorld",
          "icon": "🌍",
          "tagline": "AI world simulator — create a world with one sentence.",
          "description": "Characters live, talk, and emergent stories unfold autonomously.",
          "tags": ["Three.js", "DeepSeek", "Cloudflare"],
          "status": "coming-soon",
          "order": 6
        },
        {
          "id": "memory-forge",
          "name": "Memory Forge",
          "icon": "🧠",
          "tagline": "The original memory editor for AI coding assistants.",
          "description": "Manage Claude Code sessions with a visual interface.",
          "tags": ["TypeScript", "Node.js"],
          "status": "active",
          "order": 7
        }
      ]
    }
  }'::jsonb,
  1,
  true
)
ON CONFLICT (slug, product_id) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = now();

-- 3. Skills / Features
INSERT INTO cms_pages (slug, product_id, title, content, version, published)
VALUES (
  'features',
  'voidcraft-site',
  'Skills & Tech Stack',
  '{
    "type": "landing-features",
    "version": 1,
    "data": {
      "headline": "Skills & Tech Stack",
      "subheadline": "Technologies and tools I use to bring ideas to life.",
      "layout": "grid-3",
      "items": [
        { "icon": "⚛️", "title": "Frontend", "description": "React, Next.js, Vue 3, TypeScript, Tailwind CSS, Framer Motion, Three.js" },
        { "icon": "⚙️", "title": "Backend", "description": "Rust, Node.js, Python, FastAPI, REST APIs, GraphQL" },
        { "icon": "🖥️", "title": "Desktop & Tools", "description": "Tauri, Electron, Godot, Chrome Extensions, CLI Tools" },
        { "icon": "🤖", "title": "AI & Automation", "description": "MCP Servers, Claude API, LLM Integration, AI Agents, Prompt Engineering" },
        { "icon": "☁️", "title": "Cloud & Infra", "description": "Cloudflare Workers, D1, R2, Docker, Vercel, GitHub Actions" },
        { "icon": "📊", "title": "Data", "description": "Web Scraping, PostgreSQL, SQLite, Data Pipelines" }
      ]
    }
  }'::jsonb,
  1,
  true
)
ON CONFLICT (slug, product_id) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = now();

-- 4. Contact / CTA
INSERT INTO cms_pages (slug, product_id, title, content, version, published)
VALUES (
  'cta',
  'voidcraft-site',
  'Contact',
  '{
    "type": "landing-cta",
    "version": 1,
    "data": {
      "headline": "Let''s Work Together",
      "subheadline": "Available for freelance projects, consulting, and collaboration. Let''s build something great.",
      "ctas": [
        { "label": "Get In Touch", "href": "mailto:revk3315196130@gmail.com", "variant": "primary" },
        { "label": "revk3315196130@gmail.com", "href": "mailto:revk3315196130@gmail.com" },
        { "label": "github.com/voidcraft-dev", "href": "https://github.com/voidcraft-dev" },
        { "label": "VoidCraft Blog", "href": "https://voidcraft-blog.vercel.app" }
      ],
      "background": "dark"
    }
  }'::jsonb,
  1,
  true
)
ON CONFLICT (slug, product_id) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = now();
