'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('.contact-line', {
        yPercent: 110,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 70%',
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="contact"
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden bg-ink px-6 py-32 text-paper lg:px-10 lg:py-44"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex items-baseline gap-3 text-xs uppercase tracking-[0.22em] text-paper/60">
          <span className="tabular font-mono text-accent">07</span>
          <span className="h-px flex-1 max-w-12 bg-paper/20" />
          <span>Let&rsquo;s connect</span>
        </div>

        <h2 className="font-display text-6xl leading-[0.95] tracking-tightest md:text-[9vw]">
          <div className="split-line"><span className="contact-line inline-block">Ready to grow</span></div>
          <div className="split-line"><span className="contact-line inline-block italic text-accent">your brand?</span></div>
        </h2>

        <p className="mt-10 max-w-xl text-base leading-relaxed text-paper/75">
          Tell me about your brand and goals — I&rsquo;d love to help you show up online with
          content that works.
        </p>

        <div className="mt-12 flex flex-col gap-6">
          <a
            href="mailto:thejamaica1995@gmail.com"
            className="group inline-flex w-fit items-center gap-4 border-b border-paper/30 pb-2 font-display text-3xl tracking-tightest transition hover:border-accent hover:text-accent md:text-5xl"
          >
            thejamaica1995@gmail.com
            <span className="transition group-hover:translate-x-2">→</span>
          </a>
          <a
            href="tel:+639482561449"
            className="inline-flex w-fit items-center gap-3 text-paper/80 transition hover:text-accent"
          >
            <span className="tabular">0948 256 1449</span>
          </a>
        </div>

        <div className="mt-20 flex flex-wrap gap-x-8 gap-y-3 text-sm text-paper/70">
          <a href="mailto:thejamaica1995@gmail.com" className="underline-offset-4 hover:underline">
            Email
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
            Facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
            Instagram
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
            LinkedIn
          </a>
        </div>

        <div className="mt-24 flex flex-col justify-between gap-4 border-t border-paper/15 pt-8 text-xs uppercase tracking-[0.18em] text-paper/50 md:flex-row">
          <span>© 2026 Jamaica Tinguha — Social Media Manager</span>
          <span>Designed with intention · Edition 2026</span>
        </div>
      </div>
    </section>
  );
}
