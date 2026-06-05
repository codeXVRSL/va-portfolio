'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const phrase = 'Available 2026 · Strategy · Story · Studio of one · Naga PH · ';

export default function VelocityStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef(0);

  useEffect(() => {
    const wrap = ref.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    let raf = 0;
    let last = performance.now();
    const setX = gsap.quickSetter(track, 'x', 'px');

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const lenis = (window as unknown as { __lenis?: { velocity: number } }).__lenis;
      const v = lenis ? lenis.velocity : 0;
      // base drift + extra push from scroll velocity, signed
      const speed = 22 + Math.abs(v) * 0.6;
      const dir = v >= 0 ? -1 : 1;
      baseRef.current += dir * speed * dt;
      // wrap by half track width (duplicated content)
      const w = track.scrollWidth / 2;
      if (w > 0) {
        if (baseRef.current <= -w) baseRef.current += w;
        if (baseRef.current >= 0) baseRef.current -= w;
      }
      setX(baseRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const items = Array.from({ length: 8 }, (_, i) => i);

  return (
    <section
      ref={ref}
      aria-hidden
      className="relative w-full overflow-hidden border-y border-ink/12 bg-paper/40 py-8 sm:py-10"
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {[0, 1].map((g) => (
          <div key={g} className="flex items-center">
            {items.map((i) => (
              <span
                key={`${g}-${i}`}
                className="flex items-center gap-8 px-8 font-display text-[clamp(2.4rem,7vw,5.5rem)] italic leading-none tracking-[-0.02em] text-ink"
              >
                {phrase.split(' · ').map((seg, j) => (
                  <span key={j} className="flex items-center gap-8">
                    <span className={j % 2 ? 'text-accent' : 'text-ink/85'}>{seg}</span>
                    {j < phrase.split(' · ').length - 1 && (
                      <span className="font-display not-italic text-accent">◦</span>
                    )}
                  </span>
                ))}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
