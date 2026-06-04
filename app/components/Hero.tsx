'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, SplitText);
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [ready, setReady] = useState(false);

  useIsoLayoutEffect(() => {
    if (!root.current) return;
    gsap.set(
      [
        '.hero-eyebrow > *',
        '.hero-sub',
        '.hero-meta > *',
        '.hero-cta > *',
        '.scroll-cue',
        headlineRef.current,
      ],
      { autoAlpha: 0 },
    );
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
      if (!ready || !headlineRef.current) return;

      const split = SplitText.create(headlineRef.current, {
        type: 'lines,chars',
        linesClass: 'split-line',
        mask: 'lines',
        autoSplit: true,
      });

      gsap.set(split.chars, { yPercent: 110 });
      gsap.set(headlineRef.current, { autoAlpha: 1 });

      const tl = gsap.timeline();
      tl.to('.hero-eyebrow > *', {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.05,
        ease: 'expo.out',
      })
        .to(
          split.chars,
          {
            yPercent: 0,
            duration: 1.0,
            ease: 'expo.out',
            stagger: { each: 0.012, from: 'start' },
          },
          0.05,
        )
        .to(
          '.hero-sub',
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' },
          0.45,
        )
        .to(
          '.hero-meta > *',
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' },
          0.6,
        )
        .to(
          '.hero-cta > *',
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' },
          0.75,
        )
        .to(
          '.scroll-cue',
          { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' },
          0.9,
        );

      return () => split.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  useEffect(() => {
    const el = document.querySelector('.scroll-cue-arrow');
    if (!el) return;
    const a = gsap.to(el, { y: 8, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut' });
    return () => {
      a.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col justify-end px-7 pb-20 pt-36 lg:px-14 lg:pb-28 lg:pt-44"
    >
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-14 lg:gap-16">
        <div className="hero-eyebrow flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.32em] text-muted/90">
          <span className="tabular">Portfolio — 2026</span>
          <span aria-hidden className="text-muted/40">·</span>
          <span>Social · Content · VA</span>
          <span aria-hidden className="text-muted/40">·</span>
          <span>Philippines · Remote</span>
        </div>

        <h1
          ref={headlineRef}
          className="font-display max-w-[15ch] text-[clamp(2.6rem,7.6vw,6.2rem)] leading-[1.02] tracking-[-0.025em] md:max-w-[13ch]"
        >
          <span>Social media that turns</span>
          <br />
          <span className="italic text-accent">followers</span>
          <span> into </span>
          <span className="italic">clients.</span>
        </h1>

        <div className="grid grid-cols-1 gap-y-10 gap-x-8 md:grid-cols-12">
          <p className="hero-sub col-span-1 max-w-[40ch] text-[15px] leading-[1.75] text-ink/70 md:col-span-5 md:col-start-1">
            I&rsquo;m Jamaica — a social media manager, content creator, and virtual assistant
            helping real estate professionals, growing brands, and busy entrepreneurs strengthen
            their online presence through strategic content, short-form video, and reliable
            day-to-day support.
          </p>

          <div className="hero-meta col-span-1 flex flex-col gap-3 md:col-span-3 md:col-start-7">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
              </span>
              Open for projects
            </div>
            <div className="rule" />
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl italic text-ink">7+</span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-muted">
                years in social &amp; content
              </span>
            </div>
          </div>

          <div className="hero-cta col-span-1 flex flex-col items-start gap-4 md:col-span-3 md:col-start-10 md:items-end">
            <a
              href="#work"
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-ink"
            >
              <span className="relative">
                View selected work
                <span className="absolute -bottom-1 left-0 h-px w-full bg-ink/50 transition-all duration-500 group-hover:bg-ink" />
              </span>
              <span
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-muted"
            >
              <span className="relative">
                Work with me
                <span className="absolute -bottom-1 left-0 h-px w-full bg-muted/40 transition-all duration-500 group-hover:bg-ink" />
              </span>
            </a>
          </div>
        </div>

        <div className="scroll-cue mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-muted">
          <span>Scroll</span>
          <span aria-hidden className="scroll-cue-arrow">↓</span>
        </div>
      </div>
    </section>
  );
}
