"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  Star,
  Smartphone,
  ChevronLeft,
  ChevronRight,
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
import type { ProductsMatrixData } from "@/lib/cms";
import { projectsMeta, type ProjectImage } from "@/lib/projects-meta";

const STATUS_MAP: Record<string, string> = {
  active: "Live",
  beta: "In Development",
  "coming-soon": "Concept",
  archived: "Archived",
};

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
}: {
  images: { desktop: ProjectImage[]; mobile: ProjectImage[] };
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
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;

  const displayStatus = STATUS_MAP[status] ?? status;

  const colorMap: Record<string, string> = {
    Live: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    "In Development": "bg-primary/15 text-primary border-primary/20",
    Concept: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    Archived: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  };

  return (
    <Badge
      className={`border text-xs font-normal ${colorMap[displayStatus] || "bg-primary/15 text-primary border-primary/20"}`}
    >
      {displayStatus === "Live" && (
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      )}
      {displayStatus}
    </Badge>
  );
}

export function Projects({ data }: { data: ProductsMatrixData }) {
  const sorted = [...data.products].sort(
    (a, b) => (a.order ?? 100) - (b.order ?? 100),
  );
  const featured = sorted.filter((p) => p.featured);
  const ecosystem = sorted.filter((p) => !p.featured);

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
          {data.headline && (
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {data.headline}
            </h2>
          )}
          {data.subheadline && (
            <p className="mx-auto max-w-lg text-muted-foreground">
              {data.subheadline}
            </p>
          )}
        </motion.div>

        {featured.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-16 grid gap-6 md:grid-cols-2"
          >
            {featured.map((product) => {
              const meta = projectsMeta[product.id];
              return (
                <motion.div key={product.id} variants={item}>
                  <SpotlightCard className="h-full">
                    <Card className="group flex h-full flex-col border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">
                            {product.name}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {meta?.stars && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-amber-400/50 text-amber-400" />
                                {meta.stars}
                              </span>
                            )}
                            <StatusBadge status={product.status} />
                          </div>
                        </div>
                        <CardDescription className="text-sm leading-relaxed">
                          {product.description || product.tagline}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-1 flex-col">
                        {meta?.images &&
                          meta.images.desktop.length > 0 && (
                            <div className="mb-4">
                              <ProjectGallery images={meta.images} />
                            </div>
                          )}

                        <div className="mt-auto">
                          <div className="mb-4 flex flex-wrap gap-2">
                            {product.tags?.map((tag) => (
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
                            {meta?.github && (
                              <a
                                href={meta.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                              >
                                <GithubIcon className="h-3.5 w-3.5" />
                                Source
                              </a>
                            )}
                            {meta?.live && (
                              <a
                                href={meta.live}
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
              );
            })}
          </motion.div>
        )}

        {ecosystem.length > 0 && (
          <>
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
              {ecosystem.map((product) => {
                const meta = projectsMeta[product.id];
                return (
                  <motion.div key={product.id} variants={item}>
                    <SpotlightCard className="h-full">
                      <div className="glass-card group h-full rounded-xl p-5 transition-all duration-300 hover:-translate-y-1">
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            {product.icon && (
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                                <span className="text-base">
                                  {product.icon}
                                </span>
                              </div>
                            )}
                            <h4 className="font-semibold">{product.name}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            {meta?.stars && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-amber-400/50 text-amber-400" />
                                {meta.stars}
                              </span>
                            )}
                            <StatusBadge status={product.status} />
                          </div>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                          {product.description || product.tagline}
                        </p>
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {product.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          {meta?.github && (
                            <a
                              href={meta.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                            >
                              <GithubIcon className="h-3.5 w-3.5" />
                              Source
                            </a>
                          )}
                          {meta?.live && (
                            <a
                              href={meta.live}
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
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
