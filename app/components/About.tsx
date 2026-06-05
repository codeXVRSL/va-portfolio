'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from './SectionLabel';
import Reveal from './Reveal';
import SplitHeading from './SplitHeading';

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

      // PARALLAX — desktop only; on mobile the composition is already tight
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const layers = [
          { sel: '.about-layer-1', y: 60 },
          { sel: '.about-layer-2', y: -30 },
          { sel: '.about-layer-3', y: 18 },
          { sel: '.about-ornament', y: -90 },
          { sel: '.about-spark', y: 110 },
        ];
        layers.forEach((l) => {
          const el = ref.current!.querySelector(l.sel);
          if (!el) return;
          gsap.fromTo(
            el,
            { yPercent: -l.y * 0.4 },
            {
              yPercent: l.y * 0.6,
              ease: 'none',
              scrollTrigger: {
                trigger: ref.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            },
          );
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
      className="surface-warm relative scroll-mt-24 overflow-hidden px-6 py-24 lg:px-10 lg:py-40"
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
            <div className="about-pin relative mx-auto h-[460px] w-full max-w-[440px] sm:h-[520px] md:h-[560px]">
              {/* huge italic ornament — anchors the composition */}
              <span className="about-ornament pointer-events-none absolute -right-2 -top-8 select-none font-display text-[12rem] italic leading-none text-accent/[0.12] sm:-right-4 sm:text-[15rem] md:-right-6 md:-top-10 md:text-[18rem]">
                &amp;
              </span>

              {/* layer 1 — pull-quote card, back */}
              <div className="about-layer-1 absolute left-0 top-6 w-[80%] -rotate-[3deg] rounded-[2px] border border-ink/12 bg-cream/70 p-5 shadow-[0_30px_60px_-40px_rgba(43,35,28,0.5)] backdrop-blur-sm sm:w-[78%] sm:p-7">
                <div className="text-[0.55rem] uppercase tracking-[0.32em] text-ink/45 sm:text-[0.6rem]">
                  The promise
                </div>
                <p className="mt-3 font-display text-[1.5rem] italic leading-[1.15] tracking-[-0.01em] text-ink sm:mt-4 sm:text-[1.85rem]">
                  Followers become{' '}
                  <span className="text-accent">clients</span>.
                </p>
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.28em] text-ink/45 sm:mt-3 sm:text-[0.8rem]">
                  through strategy &amp; story
                </p>
              </div>

              {/* layer 2 — content tile, middle, simulates a feed post card */}
              <div className="about-layer-2 absolute right-0 top-[36%] w-[60%] rotate-[2deg] overflow-hidden rounded-[2px] border border-ink/12 bg-paper shadow-[0_40px_70px_-30px_rgba(43,35,28,0.55)] sm:top-[34%] sm:w-[64%]">
                <div className="flex items-center justify-between border-b border-ink/8 px-3 py-2 text-[0.5rem] uppercase tracking-[0.28em] text-ink/55 sm:px-4 sm:py-2.5 sm:text-[0.55rem] sm:tracking-[0.3em]">
                  <span>Editorial</span>
                  <span className="tabular text-accent">04 / 09</span>
                </div>
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/portrait/jamaica-1.jpg"
                    alt="Jamaica Tinguha"
                    className="absolute inset-0 h-full w-full object-cover object-[center_top] grayscale-[0.08] saturate-[0.92]"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-between p-4 text-paper sm:p-5">
                    <div className="text-[0.5rem] uppercase tracking-[0.3em] text-paper/85 sm:text-[0.55rem] sm:tracking-[0.32em]">
                      Brand voice
                    </div>
                    <div>
                      <p className="font-display text-[1.2rem] italic leading-[1.05] tracking-[-0.02em] sm:text-[1.55rem]">
                        Quiet luxury,
                        <br />
                        loud results.
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[0.5rem] uppercase tracking-[0.28em] text-paper/80 sm:mt-4 sm:gap-3 sm:text-[0.55rem] sm:tracking-[0.3em]">
                        <span>+38% saves</span>
                        <span className="h-px w-2 bg-paper/40 sm:w-3" />
                        <span>+12% reach</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* layer 3 — credentials chip card, front */}
              <div className="about-layer-3 absolute bottom-0 left-[4%] w-[92%] rounded-[2px] border border-ink/12 bg-paper p-4 shadow-[0_30px_60px_-30px_rgba(43,35,28,0.55)] sm:w-[88%] sm:p-6">
                <div className="flex items-center justify-between text-[0.55rem] uppercase tracking-[0.3em] text-ink/50 sm:text-[0.58rem] sm:tracking-[0.32em]">
                  <span>Studio of one</span>
                  <span className="font-display text-[0.8rem] italic tracking-normal text-accent sm:text-[0.85rem]">
                    Est. MMXIX
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 border-y border-ink/10 py-4 sm:mt-5 sm:gap-4 sm:py-5">
                  <div>
                    <div className="font-display text-[1.45rem] leading-none tracking-[-0.02em] text-ink sm:text-[1.85rem]">
                      7<span className="text-accent">+</span>
                    </div>
                    <div className="mt-1 text-[0.5rem] uppercase tracking-[0.26em] text-ink/55 sm:text-[0.52rem] sm:tracking-[0.28em]">
                      Years
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-[1.45rem] italic leading-none tracking-[-0.02em] text-ink sm:text-[1.85rem]">
                      24
                    </div>
                    <div className="mt-1 text-[0.5rem] uppercase tracking-[0.26em] text-ink/55 sm:text-[0.52rem] sm:tracking-[0.28em]">
                      Brands
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-[1.45rem] leading-none tracking-[-0.02em] text-ink sm:text-[1.85rem]">
                      1k<span className="text-accent">+</span>
                    </div>
                    <div className="mt-1 text-[0.5rem] uppercase tracking-[0.26em] text-ink/55 sm:text-[0.52rem] sm:tracking-[0.28em]">
                      Posts
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1 text-[0.55rem] uppercase tracking-[0.2em] text-ink/65 sm:mt-4 sm:gap-1.5 sm:text-[0.58rem] sm:tracking-[0.22em]">
                  {['Strategy', 'Short-form', 'Captions', 'VA support', 'Real estate'].map(
                    (s) => (
                      <span
                        key={s}
                        className="rounded-full border border-ink/15 px-2 py-0.5 sm:px-2.5 sm:py-1"
                      >
                        {s}
                      </span>
                    ),
                  )}
                </div>
              </div>

              {/* tiny floating sparks for parallax depth */}
              <span className="about-spark absolute left-[8%] top-[12%] h-1.5 w-1.5 rounded-full bg-accent/70" />
              <span className="about-spark absolute right-[12%] bottom-[28%] h-1 w-1 rounded-full bg-ink/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
