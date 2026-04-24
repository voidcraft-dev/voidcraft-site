"use client";

import { useEffect, useRef } from "react";

export function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let mounted = true;

    import("@/lib/fluid-core.js").then(({ FluidSimulation }) => {
      if (!mounted || !canvas) return;
      try {
        simRef.current = new FluidSimulation(canvas, {
          SIM_RESOLUTION: 128,
          DYE_RESOLUTION: 1024,
          DENSITY_DISSIPATION: 2.5,
          VELOCITY_DISSIPATION: 1.5,
          PRESSURE: 0.1,
          PRESSURE_ITERATIONS: 20,
          CURL: 5,
          SPLAT_RADIUS: 0.25,
          SPLAT_FORCE: 8000,
          SHADING: true,
          COLOR_UPDATE_SPEED: 8,
          TRANSPARENT: true,
        });
      } catch {
        // WebGL not available, fail silently
      }
    });

    return () => {
      mounted = false;
      simRef.current?.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-50"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
