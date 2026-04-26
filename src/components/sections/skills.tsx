"use client";

import { motion } from "framer-motion";
import type { LandingFeaturesData } from "@/lib/cms";

const LAYOUT_CLASSES: Record<string, string> = {
  "grid-2": "sm:grid-cols-2",
  "grid-3": "sm:grid-cols-2 lg:grid-cols-3",
  "grid-4": "sm:grid-cols-2 lg:grid-cols-4",
  list: "grid-cols-1",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Skills({ data }: { data: LandingFeaturesData }) {
  const gridClass = LAYOUT_CLASSES[data.layout ?? "grid-3"] ?? LAYOUT_CLASSES["grid-3"];

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
            {data.headline}
          </h2>
          {data.subheadline && (
            <p className="mx-auto max-w-lg text-muted-foreground">
              {data.subheadline}
            </p>
          )}
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className={`grid gap-6 ${gridClass}`}
        >
          {data.items.map((group) => (
            <motion.div
              key={group.title}
              variants={item}
              className="glass-card group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="mb-4 font-mono text-sm font-semibold tracking-wider text-primary uppercase">
                {group.icon && <span className="mr-2">{group.icon}</span>}
                {group.title}
              </h3>
              {group.description && (
                <div className="flex flex-wrap gap-2">
                  {group.description.split(", ").map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-secondary/60 px-3 py-1.5 text-xs text-secondary-foreground transition-colors hover:bg-primary/15 hover:text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
