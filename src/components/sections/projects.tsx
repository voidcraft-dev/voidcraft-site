"use client";

import { motion } from "framer-motion";
import { ExternalLink, Star, Smartphone, ChevronLeft, ChevronRight } from "lucide-react";
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
import { useState } from "react";

const projects = [
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
    video: null as string | null,
    images: {
      desktop: [
        { src: "/projects/1.png", alt: "TermCanvas - canvas layout with multiple terminals" },
        { src: "/projects/2.png", alt: "TermCanvas - context menu with terminal type options" },
        { src: "/projects/3.png", alt: "TermCanvas - multi-terminal workspace with code editors" },
        { src: "/projects/4.png", alt: "TermCanvas - remote access settings with QR code" },
      ],
      mobile: [
        { src: "/projects/6.png", alt: "TermCanvas mobile - remote terminal list" },
        { src: "/projects/5.png", alt: "TermCanvas mobile - Claude Code session" },
        { src: "/projects/7.png", alt: "TermCanvas mobile - OpenCode terminal session" },
      ],
    },
  },
  {
    title: "Memory Forge RS",
    description:
      "Edit AI's memory — local session manager for Claude Code, Codex & OpenCode. 100% offline, built with Tauri + Rust. Visualize and modify AI memory with a clean interface.",
    tags: ["Tauri", "Rust", "TypeScript"],
    github: "https://github.com/voidcraft-dev/memory-forge-rs",
    stars: 32,
    featured: true,
    video: null as string | null,
    images: {
      desktop: [
        { src: "/projects/16.png", alt: "Memory Forge RS - dashboard with session stats" },
        { src: "/projects/11.png", alt: "Memory Forge RS - prompt library with tags and search" },
        { src: "/projects/12.png", alt: "Memory Forge RS - session memory editor with diff view" },
        { src: "/projects/14.png", alt: "Memory Forge RS - OpenCode session editor with chat history" },
        { src: "/projects/15.png", alt: "Memory Forge RS - settings with themes and language options" },
        { src: "/projects/17.png", alt: "Memory Forge RS - edit message modal" },
        { src: "/projects/13.png", alt: "Memory Forge RS - about page with features and tech stack" },
      ],
      mobile: [],
    },
  },
  {
    title: "Memory Forge",
    description:
      "The original memory editor for AI coding assistants. Manage and modify Claude Code sessions with a visual interface.",
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

function ProjectGallery({
  images,
  video,
}: {
  images: { desktop: { src: string; alt: string }[]; mobile: { src: string; alt: string }[] };
  video?: string | null;
}) {
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile">("desktop");
  const [activeIndex, setActiveIndex] = useState(0);
  const currentImages = activeTab === "desktop" ? images.desktop : images.mobile;

  const prev = () => setActiveIndex((i) => (i === 0 ? currentImages.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === currentImages.length - 1 ? 0 : i + 1));

  return (
    <div className="mb-4">
      {images.mobile.length > 0 && (
        <div className="mb-2 flex items-center gap-2">
          <button
            onClick={() => { setActiveTab("desktop"); setActiveIndex(0); }}
            className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
              activeTab === "desktop"
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => { setActiveTab("mobile"); setActiveIndex(0); }}
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
          activeTab === "mobile" ? "mx-auto max-w-[200px]" : ""
        }`}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {currentImages.map((img, i) => (
            <div key={img.src} className="w-full flex-shrink-0">
              <Image
                src={img.src}
                alt={img.alt}
                width={activeTab === "desktop" ? 800 : 375}
                height={activeTab === "desktop" ? 500 : 667}
                className="w-full object-cover"
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
          <video
            src={video}
            controls
            preload="metadata"
            className="w-full"
            poster=""
          >
            <track kind="captions" />
          </video>
        </div>
      )}

    </div>
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
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Projects
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Open-source tools and products I&apos;ve built for the developer
            community.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={item}
              className={project.featured && project.images ? "md:col-span-2 lg:col-span-2" : ""}
            >
              <Card className="group h-full border-border/50 bg-card/50 transition-colors hover:border-primary/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {project.stars && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3" />
                          {project.stars}
                        </span>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {project.images && <ProjectGallery images={project.images} video={project.video} />}

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
                    {project.status && (
                      <Badge className="bg-primary/20 text-primary text-xs font-normal">
                        {project.status}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary active:text-primary/80"
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
                        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary active:text-primary/80"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Live
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
