'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const services = [
  { n: '01', label: 'Social strategy' },
  { n: '02', label: 'Short-form video' },
  { n: '03', label: 'Content & captions' },
  { n: '04', label: 'Virtual assistance' },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const magnet = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useIsoLayoutEffect(() => {
    if (!root.current) return;
    gsap.set(['.hero-meta', '.hero-rule', '.hero-kicker', '.hero-lede', '.hero-action', '.hero-idx > li'], {
      autoAlpha: 0,
      y: 20,
    });
  }, []);

  useEffect(() => {
    const on = () => setReady(true);
    if (sessionStorage.getItem('va-loaded')) {
      const t = window.setTimeout(on, 60);
      return () => window.clearTimeout(t);
    }
    window.addEventListener('loader:done', on);
    return () => window.removeEventListener('loader:done', on);
  }, []);

  useGSAP(
    () => {
      if (!ready || !h1.current) return;

      const split = SplitText.create(h1.current, {
        type: 'lines,chars',
        linesClass: 'hero-line',
        mask: 'lines',
        autoSplit: true,
      });

      gsap.set(split.chars, { yPercent: 110 });
      gsap.set(h1.current, { autoAlpha: 1 });

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.to('.hero-meta', { autoAlpha: 1, y: 0, duration: 0.7 })
        .to('.hero-rule', { autoAlpha: 1, y: 0, scaleX: 1, duration: 0.9 }, 0.05)
        .to('.hero-kicker', { autoAlpha: 1, y: 0, duration: 0.65 }, 0.15)
        .to(
          split.chars,
          { yPercent: 0, duration: 1.05, stagger: { each: 0.012, from: 'start' } },
          0.12,
        )
        .to('.hero-lede', { autoAlpha: 1, y: 0, duration: 0.85 }, 0.55)
        .to('.hero-action', { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.7)
        .to(
          '.hero-idx > li',
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05 },
          0.78,
        );

      // MAGNETIC pull on the accent word
      const m = magnet.current;
      if (m) {
        const xTo = gsap.quickTo(m, 'x', { duration: 0.6, ease: 'expo.out' });
        const yTo = gsap.quickTo(m, 'y', { duration: 0.6, ease: 'expo.out' });
        const onMove = (e: MouseEvent) => {
          const r = m.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);
          const max = 220;
          if (dist < max) {
            const k = (1 - dist / max) * 0.25;
            xTo(dx * k);
            yTo(dy * k);
          } else {
            xTo(0);
            yTo(0);
          }
        };
        window.addEventListener('mousemove', onMove);
        const cleanup = () => window.removeEventListener('mousemove', onMove);
        // cleanup on revert
        gsap.context(() => {}, root).add(cleanup);
      }

      // PARALLAX — desktop only
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.to('.hero-meta', {
          yPercent: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.4,
          },
        });
        gsap.to(h1.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
        gsap.to('.hero-idx', {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative flex w-full flex-col justify-between px-6 pb-12 pt-28 sm:px-8 md:min-h-[100svh] lg:px-12 lg:pb-16 lg:pt-32"
    >
      {/* TOP META STRIP */}
      <div className="hero-meta mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-4 text-[0.62rem] uppercase tracking-[0.34em] text-ink/55">
        <div className="flex items-center gap-3">
          <span className="font-display text-[0.92rem] italic tracking-normal text-accent">
            ◦
          </span>
          <span>Portfolio — MMXXVI</span>
          <span className="h-px w-6 bg-ink/25" />
          <span className="hidden sm:inline">Studio of one · Naga, PH</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
          </span>
          <span>Available · 2026</span>
        </div>
      </div>

      {/* HEADLINE — viewport-scale editorial statement, bleeds past 1400 clamp */}
      <div className="mt-14 w-full flex-1 sm:mt-20 md:mt-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="hero-rule mb-6 flex items-center gap-4 md:mb-10">
            <span className="block h-px w-24 origin-left scale-x-0 bg-accent/70" />
            <span className="hero-kicker font-mono text-[0.6rem] uppercase tracking-[0.42em] text-ink/55">
              Social media · Strategy · Story
            </span>
          </div>
        </div>

        <h1
          ref={h1}
          className="font-display font-normal text-ink text-balance mx-auto max-w-[1480px]"
          style={{
            fontSize: 'clamp(2.9rem, 11vw, 11rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.045em',
          }}
        >
          <span className="block">Jamaica Tinguha makes</span>
          <span className="block">
            <em className="italic text-ink/85">social media</em> that turns
          </span>
          <span className="block">
            followers into{' '}
            <span ref={magnet} className="relative inline-block italic text-accent">
              clients.
            </span>
          </span>
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-12 md:gap-8">
          <p className="hero-lede font-display md:col-span-5 md:col-start-1 text-[1.05rem] italic leading-[1.55] text-ink/70 sm:text-[1.18rem]">
            Strategy, story &amp; quiet, dependable craft — partnering with real estate
            professionals, growing brands, and busy founders who&rsquo;d rather build their
            business than babysit a feed.
          </p>

          <div className="hero-action flex items-center gap-5 md:col-span-4 md:col-start-7">
            <a
              href="#work"
              className="group inline-flex items-center gap-3 rounded-full border border-ink bg-ink px-7 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.28em] text-paper transition-all duration-500 hover:-translate-y-0.5 hover:border-accent hover:bg-accent"
            >
              <span>Selected work</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.28em] text-ink/70"
            >
              <span className="relative">
                Get in touch
                <span className="absolute -bottom-1 left-0 h-px w-full bg-ink/30 transition-all duration-500 group-hover:bg-accent" />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* SERVICES INDEX — bottom of hero, ListSlider pattern */}
      <ul className="hero-idx mx-auto mt-16 grid w-full max-w-[1400px] grid-cols-1 gap-x-12 gap-y-3 border-t border-ink/15 pt-6 sm:mt-20 sm:grid-cols-2 md:mt-24 md:grid-cols-4">
        {services.map((s) => (
          <li
            key={s.n}
            className="group flex items-baseline gap-4 text-[0.78rem] uppercase tracking-[0.18em] text-ink/75 transition-colors hover:text-ink"
          >
            <span className="font-display text-[0.95rem] italic tracking-normal text-accent">
              {s.n}
            </span>
            <span className="flex-1">{s.label}</span>
            <span className="opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
              →
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
