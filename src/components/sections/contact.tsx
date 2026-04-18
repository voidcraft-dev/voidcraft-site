"use client";

import { motion } from "framer-motion";
import { Mail, FileText } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    href: "mailto:revk3315196130@gmail.com",
    text: "revk3315196130@gmail.com",
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    href: "https://github.com/voidcraft-dev",
    text: "github.com/voidcraft-dev",
  },
  {
    icon: FileText,
    label: "Blog",
    href: "https://voidcraft-blog.vercel.app",
    text: "VoidCraft Blog",
  },
];

export function Contact() {
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
            Let&apos;s Work Together
          </h2>
          <p className="mb-8 text-muted-foreground">
            Available for freelance projects, consulting, and collaboration.
            Let&apos;s build something great.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-col items-center gap-4"
        >
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={
                link.href.startsWith("mailto")
                  ? undefined
                  : "noopener noreferrer"
              }
              className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary active:text-primary/80"
            >
              <link.icon className="h-4 w-4" />
              <span className="text-sm">{link.text}</span>
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a
            href="mailto:revk3315196130@gmail.com"
            className={buttonVariants({ size: "lg" })}
          >
            Get In Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
