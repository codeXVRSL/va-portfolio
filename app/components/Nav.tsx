'use client';
import { useEffect, useState } from 'react';
import Magnetic from './Magnetic';

const links = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: "Let's talk" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
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
                <span className="relative inline-block overflow-hidden">
                  <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">
                    {l.label}
                  </span>
                  <span className="absolute inset-x-0 top-full inline-block text-accent transition-transform duration-500 group-hover:-translate-y-full">
                    {l.label}
                  </span>
                </span>
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <Magnetic strength={0.25}>
            <a
              href="#contact"
              className="hidden rounded-full border border-ink/20 px-5 py-2 text-sm transition hover:border-ink hover:bg-ink hover:text-paper md:inline-block"
            >
              Work with me →
            </a>
          </Magnetic>

          <button
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 h-8 w-8 md:hidden"
            aria-label="Menu"
          >
            <span
              className={`absolute left-1 right-1 h-px bg-ink transition-all duration-300 ${
                open ? 'top-3.5 rotate-45' : 'top-2.5'
              }`}
            />
            <span
              className={`absolute left-1 right-1 h-px bg-ink transition-all duration-300 ${
                open ? 'top-3.5 -rotate-45' : 'top-4.5'
              }`}
            />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-paper transition-all duration-500 md:hidden ${
          open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <nav className="flex flex-col items-center gap-8 text-3xl font-display">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
