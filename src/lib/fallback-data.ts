/**
 * CMS 不可用时的 fallback 数据（过渡用）
 * 主人在 admin 录入数据后删除此文件 + page.tsx 的 fallback 逻辑
 */

import type {
  LandingHeroData,
  ProductsMatrixData,
  LandingFeaturesData,
  LandingCtaData,
} from "./cms";

export const fallbackHero: LandingHeroData = {
  eyebrow: "Full-Stack Developer · AI Builder · Open Source Creator · Indie Maker",
  title: "Building things from the void",
  subtitle: "✦",
  description:
    "Crafting AI-powered tools, desktop apps, and an interconnected creative universe — where music, stories, art, and worlds converge.",
  ctas: [
    { label: "Explore Products", href: "#projects", variant: "primary" },
    {
      label: "GitHub",
      href: "https://github.com/voidcraft-dev",
      variant: "outline",
    },
  ],
};

export const fallbackProducts: ProductsMatrixData = {
  headline: "Products & Tools",
  subheadline:
    "Open-source tools and an AI creation ecosystem — where music, stories, art, and worlds come alive.",
  products: [
    {
      id: "termcanvas",
      name: "TermCanvas",
      tagline:
        "Multi-terminal management desktop app with an intuitive canvas UI.",
      description:
        "Drag, resize, and organize terminal sessions visually. Supports PowerShell, CMD, WSL, Bash — with remote mobile access via QR code.",
      tags: ["Tauri", "Rust", "React", "TypeScript"],
      status: "beta",
      featured: true,
      order: 1,
    },
    {
      id: "memory-forge-rs",
      name: "Memory Forge RS",
      tagline:
        "Edit AI's memory — local session manager for Claude Code, Codex, Gemini CLI & Kiro CLI.",
      description:
        "100% offline, built with Tauri + Rust. Visualize and modify AI memory with a clean interface.",
      tags: ["Tauri", "Rust", "TypeScript"],
      status: "active",
      featured: true,
      order: 2,
    },
    {
      id: "beatcraft",
      name: "BeatCraft",
      icon: "🎵",
      tagline:
        "AI-powered music generation platform. Create ancient-style, epic, and healing music with one click.",
      description: "Live with Gumroad payment.",
      tags: ["Next.js", "Suno API", "Cloudflare"],
      status: "active",
      order: 3,
    },
    {
      id: "huayixia",
      name: "HuaYiXia",
      icon: "🎨",
      tagline:
        "VoidCraft visual engine — AI character illustration and cover design.",
      description: "Dual engine: GPT Image + HTML rendering.",
      tags: ["Next.js", "AI Image", "TypeScript"],
      status: "beta",
      order: 4,
    },
    {
      id: "vk-novel",
      name: "vk-novel",
      icon: "📖",
      tagline:
        "Interactive novel platform with branching narratives, world-building tools, and AI-assisted writing.",
      description: "Deployed on Cloudflare Workers.",
      tags: ["Next.js", "D1", "Cloudflare Workers"],
      status: "beta",
      order: 5,
    },
    {
      id: "seedworld",
      name: "SeedWorld",
      icon: "🌍",
      tagline:
        "AI world simulator — create a world with one sentence.",
      description:
        "Characters live, talk, and emergent stories unfold autonomously.",
      tags: ["Three.js", "DeepSeek", "Cloudflare"],
      status: "coming-soon",
      order: 6,
    },
    {
      id: "memory-forge",
      name: "Memory Forge",
      icon: "🧠",
      tagline:
        "The original memory editor for AI coding assistants.",
      description: "Manage Claude Code sessions with a visual interface.",
      tags: ["TypeScript", "Node.js"],
      status: "active",
      order: 7,
    },
  ],
};

export const fallbackFeatures: LandingFeaturesData = {
  headline: "Skills & Tech Stack",
  subheadline: "Technologies and tools I use to bring ideas to life.",
  layout: "grid-3",
  items: [
    {
      icon: "⚛️",
      title: "Frontend",
      description:
        "React, Next.js, Vue 3, TypeScript, Tailwind CSS, Framer Motion, Three.js",
    },
    {
      icon: "⚙️",
      title: "Backend",
      description: "Rust, Node.js, Python, FastAPI, REST APIs, GraphQL",
    },
    {
      icon: "🖥️",
      title: "Desktop & Tools",
      description: "Tauri, Electron, Godot, Chrome Extensions, CLI Tools",
    },
    {
      icon: "🤖",
      title: "AI & Automation",
      description:
        "MCP Servers, Claude API, LLM Integration, AI Agents, Prompt Engineering",
    },
    {
      icon: "☁️",
      title: "Cloud & Infra",
      description:
        "Cloudflare Workers, D1, R2, Docker, Vercel, GitHub Actions",
    },
    {
      icon: "📊",
      title: "Data",
      description: "Web Scraping, PostgreSQL, SQLite, Data Pipelines",
    },
  ],
};

export const fallbackCta: LandingCtaData = {
  headline: "Let's Work Together",
  subheadline:
    "Available for freelance projects, consulting, and collaboration. Let's build something great.",
  ctas: [
    {
      label: "Get In Touch",
      href: "mailto:revk3315196130@gmail.com",
      variant: "primary",
    },
  ],
  background: "dark",
};
