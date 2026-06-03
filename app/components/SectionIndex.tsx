'use client';
import { useEffect, useState } from 'react';

const sections = [
  { id: 'top', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export default function SectionIndex() {
  const [active, setActive] = useState('top');

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="pointer-events-auto group flex items-center justify-end gap-3 text-xs uppercase tracking-[0.18em]"
        >
          <span
            className={`overflow-hidden text-ink transition-all duration-500 ${
              active === s.id ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'
            }`}
          >
            {s.label}
          </span>
          <span
            className={`h-px transition-all duration-500 ${
              active === s.id ? 'w-8 bg-accent' : 'w-4 bg-ink/30'
            }`}
          />
        </a>
      ))}
    </div>
  );
}
