"use client";

import { motion } from "framer-motion";
import { Mail, FileText } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import type { LandingCtaData } from "@/lib/cms";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "mailto:": Mail,
  "github.com": GithubIcon,
};

function getIcon(href: string) {
  for (const [key, Icon] of Object.entries(ICON_MAP)) {
    if (href.includes(key)) return Icon;
  }
  return FileText;
}

export function Contact({ data }: { data: LandingCtaData }) {
  const primaryCta = data.ctas[0];

  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {data.headline}
          </h2>
          {data.subheadline && (
            <p className="mb-8 text-muted-foreground">{data.subheadline}</p>
          )}
        </motion.div>

        {data.ctas.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 flex flex-col items-center gap-4"
          >
            {data.ctas.slice(1).map((cta) => {
              const Icon = getIcon(cta.href);
              return (
                <a
                  key={cta.href}
                  href={cta.href}
                  target={cta.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={
                    cta.href.startsWith("mailto")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary active:text-primary/80"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{cta.label}</span>
                </a>
              );
            })}
          </motion.div>
        )}

        {primaryCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a
              href={primaryCta.href}
              target={
                primaryCta.href.startsWith("mailto") ? undefined : "_blank"
              }
              rel={
                primaryCta.href.startsWith("mailto")
                  ? undefined
                  : "noopener noreferrer"
              }
              className={buttonVariants({ size: "lg" })}
            >
              {primaryCta.label}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
