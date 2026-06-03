'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    const ring = ringRef.current!;
    const dot = dotRef.current!;
    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, opacity: 1 });

    const xTo = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
    const dxTo = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dyTo = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      dxTo(e.clientX);
      dyTo(e.clientY);
    };

    const enter = () => gsap.to(ring, { scale: 1.9, duration: 0.3, ease: 'power3' });
    const leave = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power3' });

    window.addEventListener('pointermove', move);
    document.querySelectorAll('a, button, [data-hover]').forEach((el) => {
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointerleave', leave);
    });

    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-8 w-8 rounded-full border border-ink/70 mix-blend-difference md:block"
        style={{ opacity: 0 }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-1 w-1 rounded-full bg-ink md:block"
        style={{ opacity: 0 }}
      />
    </>
  );
}
