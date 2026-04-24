"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { LiquidGlassNav } from "@/components/liquid-glass-nav";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
  { href: "https://voidcraft-blog.vercel.app", label: "Blog", external: true },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2">
      <LiquidGlassNav>
        <div className="flex h-12 items-center justify-between px-5">
          <a href="#" className="group font-mono text-lg font-bold tracking-tight">
            <span className="gradient-text">Void</span>
            <span className="text-foreground transition-colors group-hover:text-primary">Craft</span>
          </a>

          <div className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/voidcraft-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="text-muted-foreground transition-colors hover:text-primary md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-white/10 px-5 py-3 md:hidden">
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </LiquidGlassNav>
    </nav>
  );
}
