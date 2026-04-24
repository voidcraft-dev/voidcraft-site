"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  Star,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Music,
  Palette,
  BookOpen,
  Globe,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState, useRef, useCallback } from "react";

interface ProjectImage {
  src: string;
  alt: string;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
  stars?: number | null;
  featured?: boolean;
  status?: string;
  icon?: React.ComponentType<{ className?: string }>;
  video?: string | null;
  images?: {
    desktop: ProjectImage[];
    mobile: ProjectImage[];
  };
}

const featuredProjects: Project[] = [
  {
    title: "TermCanvas",
    description:
      "Multi-terminal management desktop app with an intuitive canvas UI. Drag, resize, and organize terminal sessions visually. Supports PowerShell, CMD, WSL, Bash — with remote mobile access via QR code.",
    tags: ["Tauri", "Rust", "React", "TypeScript"],
    github: "https://github.com/voidcraft-dev/termcanvas-site",
    live: "https://termcanvas-site.vercel.app",
    stars: null,
    featured: true,
    status: "In Development",
    video: null,
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
  {
    title: "Memory Forge RS",
    description:
      "Edit AI's memory — local session manager for Claude Code, Codex, Gemini CLI & Kiro CLI. 100% offline, built with Tauri + Rust. Visualize and modify AI memory with a clean interface.",
    tags: ["Tauri", "Rust", "TypeScript"],
    github: "https://github.com/voidcraft-dev/memory-forge-rs",
    stars: 66,
    featured: true,
    video: null,
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
];

const ecosystemProjects: Project[] = [
  {
    title: "BeatCraft",
    description:
      "AI-powered music generation platform. Create ancient-style, epic, and healing music with one click. Live with Gumroad payment.",
    tags: ["Next.js", "Suno API", "Cloudflare"],
    live: "https://beatcraft.voidcraft-dev.com",
    github: "https://github.com/voidcraft-dev/beatcraft",
    icon: Music,
    status: "Live",
  },
  {
    title: "HuaYiXia",
    description:
      "VoidCraft visual engine — AI character illustration and cover design. Dual engine: GPT Image + HTML rendering.",
    tags: ["Next.js", "AI Image", "TypeScript"],
    github: "https://github.com/voidcraft-dev/HuaYiXia",
    icon: Palette,
    status: "In Development",
  },
  {
    title: "vk-novel",
    description:
      "Interactive novel platform with branching narratives, world-building tools, and AI-assisted writing. Deployed on Cloudflare Workers.",
    tags: ["Next.js", "D1", "Cloudflare Workers"],
    github: "https://github.com/voidcraft-dev/vk-novel-app",
    icon: BookOpen,
    status: "In Development",
  },
  {
    title: "SeedWorld",
    description:
      "AI world simulator — create a world with one sentence. Characters live, talk, and emergent stories unfold autonomously.",
    tags: ["Three.js", "DeepSeek", "Cloudflare"],
    github: "https://github.com/voidcraft-dev/SeedWorld",
    icon: Globe,
    status: "Concept",
  },
  {
    title: "Memory Forge",
    description:
      "The original memory editor for AI coding assistants. Manage Claude Code sessions with a visual interface.",
    tags: ["TypeScript", "Node.js"],
    github: "https://github.com/voidcraft-dev/memory-forge",
    stars: 20,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${className}`}
    >
      {children}
    </div>
  );
}

function ProjectGallery({
  images,
  video,
}: {
  images: { desktop: ProjectImage[]; mobile: ProjectImage[] };
  video?: string | null;
}) {
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile">("desktop");
  const [activeIndex, setActiveIndex] = useState(0);
  const currentImages =
    activeTab === "desktop" ? images.desktop : images.mobile;

  const prev = () =>
    setActiveIndex((i) => (i === 0 ? currentImages.length - 1 : i - 1));
  const next = () =>
    setActiveIndex((i) => (i === currentImages.length - 1 ? 0 : i + 1));

  return (
    <div className="mb-4">
      {images.mobile.length > 0 && (
        <div className="mb-2 flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab("desktop");
              setActiveIndex(0);
            }}
            className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
              activeTab === "desktop"
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => {
              setActiveTab("mobile");
              setActiveIndex(0);
            }}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors ${
              activeTab === "mobile"
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smartphone className="h-3 w-3" />
            Mobile
          </button>
        </div>
      )}

      <div
        className={`group relative overflow-hidden rounded-lg border border-border/50 bg-background ${
          activeTab === "mobile" ? "mx-auto max-w-[200px]" : "aspect-video"
        }`}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {currentImages.map((img, i) => (
            <div key={img.src} className="w-full flex-shrink-0">
              <Image
                src={img.src}
                alt={img.alt}
                width={activeTab === "desktop" ? 800 : 375}
                height={activeTab === "desktop" ? 450 : 667}
                className="h-full w-full object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {currentImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:text-foreground group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:text-foreground group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {currentImages.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {currentImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex
                  ? "w-4 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`View image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {video && (
        <div className="mt-3 overflow-hidden rounded-lg border border-border/50">
          <video src={video} controls preload="metadata" className="w-full">
            <track kind="captions" />
          </video>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;

  const colorMap: Record<string, string> = {
    Live: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    "In Development": "bg-primary/15 text-primary border-primary/20",
    Concept: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  };

  return (
    <Badge
      className={`border text-xs font-normal ${colorMap[status] || "bg-primary/15 text-primary border-primary/20"}`}
    >
      {status === "Live" && (
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      )}
      {status}
    </Badge>
  );
}

export function Projects() {
  return (
    <section id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Products & Tools
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Open-source tools and an AI creation ecosystem — where music,
            stories, art, and worlds come alive.
          </p>
        </motion.div>

        {/* Featured projects with images */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-16 grid gap-6 md:grid-cols-2"
        >
          {featuredProjects.map((project) => (
            <motion.div key={project.title} variants={item}>
              <SpotlightCard className="h-full">
                <Card className="group flex h-full flex-col border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        {project.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {project.stars && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-amber-400/50 text-amber-400" />
                            {project.stars}
                          </span>
                        )}
                        <StatusBadge status={project.status} />
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    {project.images && (
                      <div className="mb-4">
                        <ProjectGallery
                          images={project.images}
                          video={project.video}
                        />
                      </div>
                    )}

                    <div className="mt-auto">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                          >
                            <GithubIcon className="h-3.5 w-3.5" />
                            Source
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Live
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Ecosystem & other projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h3 className="mb-2 text-center font-mono text-sm tracking-widest text-primary uppercase">
            VoidCraft Ecosystem
          </h3>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            An interconnected AI creation universe
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ecosystemProjects.map((project) => (
            <motion.div key={project.title} variants={item}>
              <SpotlightCard className="h-full">
                <div className="glass-card group h-full rounded-xl p-5 transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      {project.icon && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                          <project.icon className="h-4 w-4" />
                        </div>
                      )}
                      <h4 className="font-semibold">{project.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.stars && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-amber-400/50 text-amber-400" />
                          {project.stars}
                        </span>
                      )}
                      <StatusBadge status={project.status} />
                    </div>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                      >
                        <GithubIcon className="h-3.5 w-3.5" />
                        Source
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
