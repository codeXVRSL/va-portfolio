'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Magnetic from './Magnetic';

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
      className="relative flex min-h-[100svh] w-full flex-col justify-end px-6 pb-16 pt-32 lg:px-10 lg:pb-24"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12">
        <div className="hero-eyebrow flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em] text-muted">
          <span className="tabular">Portfolio — 2026</span>
          <span aria-hidden>·</span>
          <span>Social Media · Content · Virtual Assistance</span>
          <span aria-hidden>·</span>
          <span>Based in the Philippines · Remote</span>
        </div>

        <h1
          ref={headlineRef}
          className="font-display text-[14vw] leading-[0.92] tracking-tightest md:text-[9.5vw] md:max-w-[80%]"
        >
          <span>Social media that turns</span>
          <br />
          <span className="italic text-accent">followers</span>
          <span> into </span>
          <span className="italic">clients.</span>
        </h1>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <p className="hero-sub col-span-1 max-w-xl text-base leading-relaxed text-ink/80 md:col-span-6 md:col-start-1">
            I&rsquo;m Jamaica — a social media manager, content creator, and virtual assistant
            helping real estate professionals, growing brands, and busy entrepreneurs strengthen
            their online presence through strategic content, short-form video, and reliable
            day-to-day support.
          </p>

          <div className="hero-meta col-span-1 flex flex-col gap-3 text-sm text-muted md:col-span-3 md:col-start-8">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              Open for projects
            </div>
            <div className="rule" />
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl text-ink">7+</span>
              <span>yrs in social media &amp; content</span>
            </div>
          </div>

          <div className="hero-cta col-span-1 flex flex-col items-start gap-3 md:col-span-2 md:col-start-11 md:items-end">
            <Magnetic strength={0.25}>
              <a
                href="#work"
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:bg-accent"
              >
                View my work
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <a href="#contact" className="group relative text-sm text-ink">
              Work with me
              <span className="absolute -bottom-0.5 left-0 h-px w-full bg-ink/30 transition-all duration-500 group-hover:bg-ink" />
            </a>
          </div>
        </div>

        <div className="scroll-cue mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
          <span>Scroll</span>
          <span aria-hidden className="scroll-cue-arrow">↓</span>
        </div>
      </div>
    </section>
  );
}
