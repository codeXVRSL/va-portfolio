'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, SplitText);
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!headlineRef.current) return;

      const split = SplitText.create(headlineRef.current, {
        type: 'lines,chars',
        linesClass: 'split-line',
        mask: 'lines',
        autoSplit: true,
      });

      gsap.set(split.chars, { yPercent: 110, opacity: 1 });

      const tl = gsap.timeline({ delay: 0.25 });
      tl.to(split.chars, {
        yPercent: 0,
        duration: 1.05,
        ease: 'expo.out',
        stagger: { each: 0.012, from: 'start' },
      })
        .from(
          '.hero-eyebrow > *',
          { y: 18, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' },
          0.15,
        )
        .from(
          '.hero-sub',
          { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out' },
          0.6,
        )
        .from(
          '.hero-meta > *',
          { y: 14, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'expo.out' },
          0.8,
        )
        .from(
          '.hero-cta > *',
          { y: 18, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' },
          0.95,
        );

      return () => split.revert();
    },
    { scope: root },
  );

  // chevron pulse
  useEffect(() => {
    const el = document.querySelector('.scroll-cue');
    if (!el) return;
    const a = gsap.to(el, {
      y: 8,
      repeat: -1,
      yoyo: true,
      duration: 1.4,
      ease: 'sine.inOut',
    });
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
          className="font-display text-[14vw] leading-[0.92] tracking-tightest md:text-[10.5vw]"
        >
          <span>Social media that turns</span>
          <br />
          <span className="italic text-accent">followers</span>
          <span> into </span>
          <span className="italic">clients.</span>
        </h1>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <p
            ref={subRef}
            className="hero-sub col-span-1 max-w-xl text-base leading-relaxed text-ink/80 md:col-span-6 md:col-start-1"
          >
            I&rsquo;m Jamaica — a social media manager, content creator, and virtual assistant
            helping real estate professionals, growing brands, and busy entrepreneurs strengthen
            their online presence through strategic content, short-form video, and reliable
            day-to-day support.
          </p>

          <div className="hero-meta col-span-1 flex flex-col gap-3 text-sm text-muted md:col-span-3 md:col-start-8">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Open for projects
            </div>
            <div className="rule" />
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl text-ink">7+</span>
              <span>yrs in social media &amp; content</span>
            </div>
          </div>

          <div className="hero-cta col-span-1 flex flex-col items-start gap-3 md:col-span-2 md:col-start-11 md:items-end">
            <a
              href="#work"
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:bg-accent"
            >
              View my work
              <span className="transition group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#contact"
              className="text-sm text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-ink"
            >
              Work with me
            </a>
          </div>
        </div>

        <div className="scroll-cue mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
          <span>Scroll</span>
          <span aria-hidden>↓</span>
        </div>
      </div>
    </section>
  );
}
