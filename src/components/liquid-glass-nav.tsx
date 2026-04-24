"use client";

import { useEffect, useRef } from "react";

function buildDisplacementMap(w: number, h: number, r: number = 12): string {
  const b = Math.min(w, h) * 0.035;
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gx" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient>
        <linearGradient id="gy" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="black"/>
      <rect width="${w}" height="${h}" rx="${r}" fill="url(#gx)"/>
      <rect width="${w}" height="${h}" rx="${r}" fill="url(#gy)" style="mix-blend-mode:difference"/>
      <rect x="${b}" y="${b}" width="${w - b * 2}" height="${h - b * 2}" rx="${r}" fill="hsl(0 0% 50%/.93)" style="filter:blur(8px)"/>
    </svg>`)}`;
}

export function LiquidGlassNav({ children }: { children: React.ReactNode }) {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const feImg = document.getElementById("lg-disp-nav");
    if (!feImg) return;

    const observer = new ResizeObserver(() => {
      const w = nav.offsetWidth;
      const h = nav.offsetHeight;
      if (w && h) {
        feImg.setAttribute("href", buildDisplacementMap(w, h));
      }
    });
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={navRef} className="relative">
      {/* Liquid glass refraction layer */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          backdropFilter: "url(#lg-filter-nav)",
          WebkitBackdropFilter: "url(#lg-filter-nav)",
          background: "oklch(1 0 0 / 3%)",
          boxShadow:
            "0 0 2px 1px rgba(255,255,255,0.06) inset, 0 0 12px 4px rgba(255,255,255,0.03) inset, 0 8px 40px rgba(0,0,0,0.25)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* SVG filter */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="lg-filter-nav" colorInterpolationFilters="sRGB">
            <feImage
              x="0"
              y="0"
              width="100%"
              height="100%"
              id="lg-disp-nav"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              xChannelSelector="R"
              yChannelSelector="B"
              scale="-80"
              result="dR"
            />
            <feColorMatrix
              in="dR"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="lR"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              xChannelSelector="R"
              yChannelSelector="B"
              scale="-72"
              result="dG"
            />
            <feColorMatrix
              in="dG"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="lG"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              xChannelSelector="R"
              yChannelSelector="B"
              scale="-64"
              result="dB"
            />
            <feColorMatrix
              in="dB"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="lB"
            />
            <feBlend in="lR" in2="lG" mode="screen" result="rg" />
            <feBlend in="rg" in2="lB" mode="screen" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
