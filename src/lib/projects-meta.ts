/**
 * 产品扩展元数据 — CMS schema 不支持的字段（图片/链接/stars）
 * 按 product.id 与 CMS products-matrix 数据合并
 */

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectMeta {
  github?: string;
  live?: string;
  stars?: number | null;
  images?: {
    desktop: ProjectImage[];
    mobile: ProjectImage[];
  };
}

export const projectsMeta: Record<string, ProjectMeta> = {
  termcanvas: {
    github: "https://github.com/voidcraft-dev/termcanvas-site",
    live: "https://termcanvas-site.vercel.app",
    images: {
      desktop: [
        { src: "/projects/1.png", alt: "TermCanvas - canvas layout" },
        { src: "/projects/2.png", alt: "TermCanvas - context menu" },
        { src: "/projects/3.png", alt: "TermCanvas - multi-terminal" },
        { src: "/projects/4.png", alt: "TermCanvas - remote access" },
      ],
      mobile: [
        { src: "/projects/6.png", alt: "TermCanvas mobile - terminal list" },
        { src: "/projects/5.png", alt: "TermCanvas mobile - Claude Code" },
        { src: "/projects/7.png", alt: "TermCanvas mobile - session" },
      ],
    },
  },
  "memory-forge-rs": {
    github: "https://github.com/voidcraft-dev/memory-forge-rs",
    stars: 66,
    images: {
      desktop: [
        { src: "/projects/16.png", alt: "Memory Forge RS - dashboard" },
        { src: "/projects/11.png", alt: "Memory Forge RS - prompt library" },
        { src: "/projects/12.png", alt: "Memory Forge RS - diff view" },
        { src: "/projects/14.png", alt: "Memory Forge RS - chat history" },
        { src: "/projects/15.png", alt: "Memory Forge RS - settings" },
      ],
      mobile: [],
    },
  },
  beatcraft: {
    live: "https://beatcraft.voidcraft-dev.com",
    github: "https://github.com/voidcraft-dev/beatcraft",
  },
  huayixia: {
    github: "https://github.com/voidcraft-dev/HuaYiXia",
  },
  "vk-novel": {
    github: "https://github.com/voidcraft-dev/vk-novel-app",
  },
  seedworld: {
    github: "https://github.com/voidcraft-dev/SeedWorld",
  },
  "memory-forge": {
    github: "https://github.com/voidcraft-dev/memory-forge",
    stars: 20,
  },
};
