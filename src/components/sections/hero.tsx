"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";

const roles = [

  "Full-Stack Developer",
  "AI Builder",
  "Open Source Creator",
  "Indie Maker",
];

function RotatingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % roles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="relative inline-block h-[1.4em] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 text-primary"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}


export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 grid-bg grid-bg-fade" />

      {/* Floating orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float-1 absolute left-[15%] top-[20%] h-[28rem] w-[28rem] rounded-full bg-primary/8 blur-[100px]" />
        <div className="animate-float-2 absolute bottom-[15%] right-[15%] h-[24rem] w-[24rem] rounded-full bg-accent-blue/8 blur-[100px]" />
        <div className="animate-float-3 absolute left-[55%] top-[10%] h-[18rem] w-[18rem] rounded-full bg-[oklch(0.65_0.18_300)]/6 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-6 font-mono text-sm tracking-widest text-muted-foreground uppercase">
            <RotatingText />
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl"
        >
          Building things
          <br />
          <span className="gradient-text">from the void</span>
          <span className="ml-1 inline-block text-primary/60">✦</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground"
        >
          Crafting AI-powered tools, desktop apps, and an interconnected
          creative universe — where music, stories, art, and worlds converge.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className={`glow-btn ${buttonVariants({ size: "lg" })}`}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Explore Products
          </a>
          <a
            href="https://github.com/voidcraft-dev"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <GithubIcon className="mr-2 h-4 w-4" />
            GitHub
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#projects" aria-label="Scroll to projects">
          <ArrowDown className="h-5 w-5 animate-subtle-float text-muted-foreground" />
        </a>
      </motion.div>
    </section>
  );
}
