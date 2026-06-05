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
    gsap.set('.hero-portrait-frame', { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set('.hero-portrait-img', { scale: 1.18 });
    gsap.set(['.hero-tag', '.hero-ornament'], { autoAlpha: 0, y: 14 });
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
        .to('.hero-portrait-frame', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out' }, 0.2)
        .to('.hero-portrait-img', { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.2)
        .to('.hero-ornament', { autoAlpha: 1, y: 0, duration: 0.9 }, 0.35)
        .to('.hero-tag', { autoAlpha: 1, y: 0, duration: 0.7 }, 0.55)
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
        // portrait floats up slower than text → editorial parallax
        gsap.to('.hero-portrait', {
          yPercent: -22,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
        gsap.to('.hero-ornament', {
          yPercent: -45,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
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

      {/* EDITORIAL SPREAD — left: massive type; right: portrait plate */}
      <div className="mt-12 w-full flex-1 sm:mt-16 md:mt-20">
        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-12 md:gap-x-10 md:gap-y-14">
          {/* LEFT COLUMN — type spread */}
          <div className="md:col-span-7 lg:col-span-7">
            <div className="hero-rule mb-6 flex items-center gap-4 md:mb-10">
              <span className="block h-px w-24 origin-left scale-x-0 bg-accent/70" />
              <span className="hero-kicker font-mono text-[0.6rem] uppercase tracking-[0.42em] text-ink/55">
                Social media · Strategy · Story
              </span>
            </div>

            <h1
              ref={h1}
              className="font-display font-normal text-ink text-balance"
              style={{
                fontSize: 'clamp(2.4rem, 6.2vw, 6.6rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.035em',
              }}
            >
              <span className="block">Jamaica Tinguha</span>
              <span className="block">
                makes <em className="italic text-ink/80">social</em>
              </span>
              <span className="block">
                that turns followers
              </span>
              <span className="block">
                into{' '}
                <span ref={magnet} className="relative inline-block italic text-accent">
                  clients.
                </span>
              </span>
            </h1>

            <p className="hero-lede mt-10 max-w-[44ch] font-display text-[var(--t-lede)] italic leading-[1.55] text-ink/70 md:mt-14">
              Strategy, story &amp; quiet, dependable craft — partnering with real estate
              professionals, growing brands, and busy founders who&rsquo;d rather build their
              business than babysit a feed.
            </p>

            <div className="hero-action mt-10 flex flex-wrap items-center gap-5">
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

          {/* RIGHT COLUMN — editorial portrait plate */}
          <aside className="hero-plate relative md:col-span-5 lg:col-span-5">
            <figure className="hero-portrait relative mx-auto w-[78%] max-w-[440px] md:w-full md:max-w-none md:translate-y-2 lg:translate-y-6">
              {/* editorial tag, top-left, rotated */}
              <div className="hero-tag absolute -left-3 -top-4 z-10 flex items-center gap-2 rounded-full border border-ink/15 bg-paper/95 px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.32em] text-ink/70 shadow-[0_18px_30px_-22px_rgba(43,35,28,0.55)] backdrop-blur md:-left-6 md:-top-6 md:px-4 md:py-2">
                <span className="font-display text-[0.78rem] italic tracking-normal text-accent">
                  01
                </span>
                <span>Press portrait</span>
              </div>

              {/* large italic accent letter behind the frame */}
              <span
                aria-hidden
                className="hero-ornament pointer-events-none absolute -right-3 -top-12 z-0 select-none font-display text-[10rem] italic leading-none text-accent/[0.12] sm:-right-6 sm:text-[14rem] md:-right-8 md:-top-16 md:text-[18rem]"
              >
                J
              </span>

              <div className="hero-portrait-frame relative z-[1] aspect-[4/5] w-full overflow-hidden bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/portrait/jamaica-1.jpg"
                  alt="Jamaica Tinguha — Social Media Manager"
                  className="hero-portrait-img absolute inset-0 h-full w-full object-cover object-[center_18%] grayscale-[0.04] saturate-[0.95]"
                />
                {/* paper-tone wash overlays to blend with backdrop */}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-paper/10 mix-blend-multiply" />
                <span className="pointer-events-none absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-paper to-transparent" />

                {/* foot caption inside the frame */}
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-paper md:p-5">
                  <div>
                    <div className="font-mono text-[0.55rem] uppercase tracking-[0.32em] text-paper/80">
                      Edition MMXXVI
                    </div>
                    <div className="mt-1 font-display text-[1.05rem] italic leading-tight tracking-[-0.01em] md:text-[1.25rem]">
                      The keeper of feeds.
                    </div>
                  </div>
                  <div className="text-right font-mono text-[0.55rem] uppercase tracking-[0.32em] text-paper/80">
                    Naga, PH
                    <br />
                    <span className="text-accent">●</span> live
                  </div>
                </figcaption>
              </div>

              {/* meta strip beneath the frame */}
              <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-ink/15 pt-3 font-mono text-[0.55rem] uppercase tracking-[0.32em] text-ink/55">
                <span>Studio of one</span>
                <span className="font-display text-[0.78rem] italic tracking-normal text-accent">
                  Vol. 01
                </span>
                <span>2026</span>
              </div>
            </figure>
          </aside>
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
