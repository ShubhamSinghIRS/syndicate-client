import { useEffect, useRef } from "react";

interface BarSeed {
  phase: number;
  noise: number;
}

export function TranscriptWaveform({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const dpr = window.devicePixelRatio || 1;
    let w = 0;
    let h = 0;
    const seeds: BarSeed[] = [];
    const BAR_W = 2.5;
    const GAP = 3.5;
    let count = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      count = Math.ceil(w / (BAR_W + GAP));
      seeds.length = 0;
      for (let i = 0; i < count; i++) {
        seeds.push({
          phase: Math.random() * Math.PI * 2,
          noise: 0.55 + Math.random() * 0.45,
        });
      }
    };
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const start = performance.now();
    const RADIUS = 180;

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      const midY = h / 2;
      const { x: mx, active } = mouseRef.current;

      for (let i = 0; i < count; i++) {
        const x = i * (BAR_W + GAP) + GAP / 2;
        const seed = seeds[i];
        if (!seed) continue;

        // Normalized coordinate across the waveform (0 to 1)
        const tNorm = count > 1 ? i / (count - 1) : 0.5;

        // Multi-peak envelope matching the reference image: peaks at 15%, 50%, and 85%
        const peak1 = 0.48 * Math.exp(-Math.pow((tNorm - 0.15) / 0.10, 2));
        const peak2 = 0.95 * Math.exp(-Math.pow((tNorm - 0.50) / 0.14, 2));
        const peak3 = 0.48 * Math.exp(-Math.pow((tNorm - 0.85) / 0.10, 2));
        const envelope = peak1 + peak2 + peak3;

        // Dynamic animation: faster, more pronounced rippling/breathing effect
        const osc = reduced ? 1.0 : 0.70 + 0.30 * Math.sin(t * 2.8 + seed.phase);
        const baseH = h * 1.25 * envelope * seed.noise * osc;

        // Proximity influence (interactive hover effect)
        let glow = 0;
        if (active) {
          const dx = x + BAR_W / 2 - mx;
          const d = Math.abs(dx);
          if (d < RADIUS) {
            glow = Math.pow(1 - d / RADIUS, 2);
          }
        }
        const barH = Math.max(3, baseH * (1 + glow * 0.7));
        const alpha = 0.22 + glow * 0.38;

        // Warm orange matching COLORS.accent2 (#ec9324)
        ctx.fillStyle = `rgba(236, 147, 36, ${alpha})`;
        const y = midY - barH / 2;
        
        ctx.fillRect(x, y, BAR_W, barH);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
