'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from './SectionLabel';
import Reveal from './Reveal';
import SplitHeading from './SplitHeading';
import RevealImage from './RevealImage';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        ScrollTrigger.create({
          trigger: '.about-pin-wrap',
          start: 'top 12%',
          endTrigger: '.about-text-end',
          end: 'bottom 80%',
          pin: '.about-pin',
          pinSpacing: false,
        });
      });
      return () => mm.revert();
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      className="relative scroll-mt-24 bg-paper px-6 py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel number="01" label="About" />
        <div className="about-pin-wrap grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <SplitHeading
              as="h2"
              className="font-display text-5xl leading-[1.02] tracking-tightest md:text-7xl"
            >
              Strategy and creativity,
            </SplitHeading>
            <SplitHeading
              as="h2"
              delay={0.1}
              className="font-display text-5xl italic leading-[1.02] tracking-tightest text-accent md:text-7xl"
            >
              working together.
            </SplitHeading>

            <div className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-ink/80">
              <Reveal>
                <p>
                  Hi! I&rsquo;m Jamaica, a social media manager, content creator, and virtual
                  assistant specializing in social media management, content creation, and
                  digital marketing support for real estate professionals, growing brands, and
                  busy entrepreneurs.
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <p>
                  I help businesses strengthen their online presence through engaging content,
                  strategic social media management, short-form video ideas, and audience
                  engagement — plus the day-to-day VA support that keeps everything running
                  smoothly.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <p>
                  I&rsquo;m highly organized, detail-oriented, and proactive. Most of all,
                  I&rsquo;m always ready to learn — new tools, platforms, and niches — so I
                  keep growing right alongside the brands I work with.
                </p>
              </Reveal>
            </div>

            <div className="about-text-end mt-16 grid grid-cols-2 gap-x-10 gap-y-6 text-sm text-ink/80 md:grid-cols-2 md:max-w-xl">
              <Reveal>
                <dt className="text-xs uppercase tracking-[0.18em] text-muted">Based in</dt>
                <dd className="mt-1">Philippines · Remote worldwide</dd>
              </Reveal>
              <Reveal delay={0.06}>
                <dt className="text-xs uppercase tracking-[0.18em] text-muted">Experience</dt>
                <dd className="mt-1">7+ years in social &amp; content</dd>
              </Reveal>
              <Reveal delay={0.12}>
                <dt className="text-xs uppercase tracking-[0.18em] text-muted">I help with</dt>
                <dd className="mt-1">Brands, real estate &amp; VA support</dd>
              </Reveal>
              <Reveal delay={0.18}>
                <dt className="text-xs uppercase tracking-[0.18em] text-muted">Email</dt>
                <dd className="mt-1">
                  <a className="underline underline-offset-4 hover:text-accent" href="mailto:thejamaica1995@gmail.com">
                    thejamaica1995@gmail.com
                  </a>
                </dd>
              </Reveal>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="about-pin">
              <RevealImage
                src="/portrait/jamaica-1.jpg"
                alt="Jamaica Tinguha"
                parallax={0.08}
              />
              <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted">
                <span>Naga · PH</span>
                <span className="tabular">01 / 02</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
