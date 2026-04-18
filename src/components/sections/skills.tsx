"use client";

import { motion } from "framer-motion";

const skillGroups = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Backend",
    skills: ["Rust", "Node.js", "Python", "REST APIs", "GraphQL"],
  },
  {
    title: "Desktop & Tools",
    skills: ["Tauri", "Electron", "Chrome Extensions", "CLI Tools"],
  },
  {
    title: "AI & Automation",
    skills: ["MCP Servers", "Claude API", "LLM Integration", "AI Agents", "Prompt Engineering"],
  },
  {
    title: "DevOps & Infra",
    skills: ["Docker", "Vercel", "GitHub Actions", "Linux"],
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
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skillGroups.map((group) => (
            <motion.div
              key={group.title}
              variants={item}
              className="rounded-lg border border-border/50 bg-card/30 p-6"
            >
              <h3 className="mb-4 font-mono text-sm font-semibold tracking-wider text-primary uppercase">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-secondary px-3 py-1.5 text-xs text-secondary-foreground"
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
