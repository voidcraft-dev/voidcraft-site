"use client";

import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    title: "TermCanvas",
    description:
      "Multi-terminal management desktop app with an intuitive canvas UI. Organize workspaces visually, manage multiple terminals at once.",
    tags: ["Tauri", "Rust", "React", "TypeScript"],
    github: "https://github.com/voidcraft-dev/termcanvas-site",
    live: "https://termcanvas-site.vercel.app",
    stars: null,
    featured: true,
    status: "In Development",
  },
  {
    title: "Memory Forge RS",
    description:
      "Edit AI's memory — local session manager for Claude Code, Codex & OpenCode. 100% offline, built with Tauri + Rust.",
    tags: ["Tauri", "Rust", "TypeScript"],
    github: "https://github.com/voidcraft-dev/memory-forge-rs",
    stars: 32,
    featured: true,
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
            <motion.div key={project.title} variants={item}>
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
