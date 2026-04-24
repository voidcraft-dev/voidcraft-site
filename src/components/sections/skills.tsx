"use client";

import { motion } from "framer-motion";

const skillGroups = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "Vue 3", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"],
  },
  {
    title: "Backend",
    skills: ["Rust", "Node.js", "Python", "FastAPI", "REST APIs", "GraphQL"],
  },
  {
    title: "Desktop & Tools",
    skills: ["Tauri", "Electron", "Godot", "Chrome Extensions", "CLI Tools"],
  },
  {
    title: "AI & Automation",
    skills: ["MCP Servers", "Claude API", "LLM Integration", "AI Agents", "Prompt Engineering"],
  },
  {
    title: "Cloud & Infra",
    skills: ["Cloudflare Workers", "D1", "R2", "Docker", "Vercel", "GitHub Actions"],
  },
  {
    title: "Data",
    skills: ["Web Scraping", "PostgreSQL", "SQLite", "Data Pipelines"],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Skills() {
  return (
    <section id="skills" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Skills & Tech Stack
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Technologies and tools I use to bring ideas to life.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skillGroups.map((group) => (
            <motion.div
              key={group.title}
              variants={item}
              className="glass-card group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="mb-4 font-mono text-sm font-semibold tracking-wider text-primary uppercase">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-secondary/60 px-3 py-1.5 text-xs text-secondary-foreground transition-colors hover:bg-primary/15 hover:text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
