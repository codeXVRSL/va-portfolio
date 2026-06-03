'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Magnetic from './Magnetic';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const head = ref.current!.querySelector('.contact-head') as HTMLElement;
      const split = SplitText.create(head, {
        type: 'lines',
        linesClass: 'split-line',
        mask: 'lines',
        autoSplit: true,
      });
      gsap.set(split.lines, { yPercent: 110 });
      gsap.to(split.lines, {
        yPercent: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
      });

      gsap.from('.contact-sub', {
        y: 24, opacity: 0, duration: 1, ease: 'expo.out', delay: 0.3,
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
      });
      gsap.from('.contact-link', {
        y: 28, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12, delay: 0.4,
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
      });
      gsap.from('.contact-foot > *', {
        y: 12, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.06,
        scrollTrigger: { trigger: '.contact-foot', start: 'top 90%', once: true },
      });

      return () => split.revert();
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

        <h2 className="contact-head font-display text-6xl leading-[0.95] tracking-tightest md:text-[9vw]">
          Ready to grow{' '}
          <span className="italic text-accent">your brand?</span>
        </h2>

        <p className="contact-sub mt-10 max-w-xl text-base leading-relaxed text-paper/75">
          Tell me about your brand and goals — I&rsquo;d love to help you show up online with
          content that works.
        </p>

        <div className="mt-12 flex flex-col gap-6">
          <Magnetic strength={0.18}>
            <a
              href="mailto:thejamaica1995@gmail.com"
              className="contact-link group inline-flex w-fit items-center gap-4 border-b border-paper/30 pb-2 font-display text-3xl tracking-tightest transition hover:border-accent hover:text-accent md:text-5xl"
            >
              thejamaica1995@gmail.com
              <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
            </a>
          </Magnetic>
          <a
            href="tel:+639482561449"
            className="contact-link inline-flex w-fit items-center gap-3 text-paper/80 transition hover:text-accent"
          >
            <span className="tabular">0948 256 1449</span>
          </a>
        </div>

        <div className="mt-20 flex flex-wrap gap-x-8 gap-y-3 text-sm text-paper/70">
          {[
            { href: 'mailto:thejamaica1995@gmail.com', label: 'Email' },
            { href: 'https://facebook.com', label: 'Facebook' },
            { href: 'https://instagram.com', label: 'Instagram' },
            { href: 'https://linkedin.com', label: 'LinkedIn' },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="group relative inline-block"
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="contact-foot mt-24 flex flex-col justify-between gap-4 border-t border-paper/15 pt-8 text-xs uppercase tracking-[0.18em] text-paper/50 md:flex-row">
          <span>© 2026 Jamaica Tinguha — Social Media Manager</span>
          <span>Designed with intention · Edition 2026</span>
        </div>
      </div>
    </section>
  );
}
