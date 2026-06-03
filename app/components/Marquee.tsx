'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const rowA = [
  'Social Media Management',
  'Content Creation',
  'Short-Form Video',
  'Branded Graphics',
  'Community Engagement',
  'Virtual Assistance',
];
const rowB = [
  'Real Estate Marketing',
  'Lead Generation Support',
  'Content Calendar',
  'Caption Writing',
  'AI-Powered Workflows',
  'Always Learning',
];

function Row({
  items,
  reverse = false,
  speedRef,
}: {
  items: string[];
  reverse?: boolean;
  speedRef: React.MutableRefObject<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const widthRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    widthRef.current = el.scrollWidth / 2;

    const tick = () => {
      const baseSpeed = 0.6;
      const dir = reverse ? 1 : -1;
      xRef.current += dir * (baseSpeed + speedRef.current);
      if (reverse) {
        if (xRef.current > 0) xRef.current -= widthRef.current;
      } else {
        if (xRef.current <= -widthRef.current) xRef.current += widthRef.current;
      }
      gsap.set(el, { x: xRef.current });
    };
    gsap.ticker.add(tick);
    if (reverse) xRef.current = -widthRef.current;
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [reverse, speedRef]);

  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div ref={ref} className="flex w-max gap-12 whitespace-nowrap">
        {doubled.map((t, i) => (
          <span
            key={i}
            className={`font-display text-3xl italic tracking-tightest md:text-5xl ${
              reverse ? 'text-paper/70' : 'text-paper'
            }`}
          >
            {t}{' '}
            <span className="not-italic text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const speedRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const vel = Math.min(Math.abs(ScrollTrigger.getAll()[0]?.getVelocity?.() ?? 0) / 1500, 4);
      gsap.to(speedRef, { current: vel, duration: 0.5, overwrite: true, ease: 'power2.out' });
    };
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const v = Math.min(Math.abs(self.getVelocity()) / 1500, 4);
        gsap.to(speedRef, { current: v, duration: 0.5, overwrite: true, ease: 'power2.out' });
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-ink/10 bg-ink py-8 text-paper">
      <Row items={rowA} speedRef={speedRef} />
      <div className="h-4" />
      <Row items={rowB} reverse speedRef={speedRef} />
    </section>
  );
}
