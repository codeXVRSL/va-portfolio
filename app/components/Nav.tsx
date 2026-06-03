'use client';
import { useEffect, useState } from 'react';

const links = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: "Let's talk" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-4 backdrop-blur-md' : 'py-6'
      }`}
      style={{
        background: scrolled ? 'rgba(244,241,234,0.78)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(11,11,10,0.08)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <a href="#top" className="font-display text-xl tracking-tight md:text-2xl">
          Jamaica&nbsp;Tinguha
        </a>
        <nav className="hidden items-center gap-9 text-sm md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-ink/80 transition hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="hidden rounded-full border border-ink/20 px-5 py-2 text-sm transition hover:border-ink hover:bg-ink hover:text-paper md:inline-block"
        >
          Work with me →
        </a>
      </div>
    </header>
  );
}
