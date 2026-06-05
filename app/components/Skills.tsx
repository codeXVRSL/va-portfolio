'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionLabel from './SectionLabel';
import Reveal from './Reveal';
import SplitHeading from './SplitHeading';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP, ScrollTrigger);

const core = [
  'Real Estate Social Media',
  'Content Creation & Planning',
  'Canva Graphic Design',
  'Caption & Copywriting',
  'SEO Copywriting',
  'Short-Form Video',
  'Engagement Strategy',
  'Community Engagement',
  'Hashtag Research',
  'Market Research',
  'Content Calendar Management',
  'Lead Generation Support',
  'CRM Management',
  'Email Management',
  'Calendar Management',
  'Appointment Scheduling',
  'Administrative Support',
  'Client Communication',
  'Real Estate Branding',
  'Data Entry',
];
const platforms = ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'Threads', 'X / Twitter', 'Pinterest'];
const tools = [
  'Canva',
  'CapCut',
  'Meta Business Suite',
  'Notion',
  'Google Workspace',
  'Mailchimp',
  'Grammarly',
  'Microsoft Office',
  'Google Business Profile',
  'Zillow',
  'Compass',
];
const ai = ['ChatGPT', 'Claude AI', 'Gemini', 'Canva Magic Studio', 'CapCut AI'];

export default function Skills() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.batch('.skill-chip', {
        start: 'top 92%',
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 22, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.7,
              ease: 'expo.out',
              stagger: 0.025,
              overwrite: true,
            },
          ),
      });

      ScrollTrigger.batch('.ai-chip', {
        start: 'top 92%',
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 14, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              ease: 'expo.out',
              stagger: 0.04,
              overwrite: true,
            },
          ),
      });

      // parallax — section ornament drifts
      const orn = ref.current?.querySelector('.skills-ornament');
      if (orn) {
        gsap.fromTo(
          orn,
          { yPercent: -20 },
          {
            yPercent: 25,
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        );
      }
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="surface-soft relative scroll-mt-24 overflow-hidden px-6 py-24 lg:px-10 lg:py-40"
    >
      {/* ornament */}
      <span className="skills-ornament pointer-events-none absolute -left-6 top-16 select-none font-display text-[12rem] italic leading-none text-accent/[0.08] sm:text-[16rem] md:-left-12 md:top-20 md:text-[22rem]">
        +
      </span>

      <div className="relative mx-auto max-w-[1440px]">
        <SectionLabel number="04" label="Skills & toolkit" />
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-12">
          <SplitHeading
            as="h2"
            className="md:col-span-8 font-display text-5xl leading-[1.02] tracking-tightest md:text-7xl"
          >
            What I bring to the table.
          </SplitHeading>
          <Reveal className="md:col-span-4 text-[0.95rem] italic leading-[1.7] text-ink/65 font-display">
            A working studio of one — strategy, story, and the unglamorous craft that keeps brands
            moving.
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-12">
          {/* CORE SKILLS — fills the column */}
          <div className="md:col-span-7">
            <div className="flex items-center gap-4 text-[0.62rem] uppercase tracking-[0.32em] text-ink/55">
              <span className="font-display text-[0.85rem] italic tracking-normal text-accent">
                01
              </span>
              <span className="h-px w-8 bg-ink/25" />
              <span>Core skills</span>
              <span className="ml-auto font-display text-[0.85rem] italic text-ink/40">
                {core.length}
              </span>
            </div>

            <ul className="mt-7 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              {core.map((s, i) => (
                <li
                  key={s}
                  className="skill-chip group flex items-center gap-4 border-b border-ink/10 py-3.5 text-[0.93rem] text-ink/85 transition-colors hover:text-ink"
                >
                  <span className="font-display text-[0.7rem] italic tabular text-ink/35 group-hover:text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1">{s}</span>
                  <span className="translate-x-[-4px] text-ink/30 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100">
                    →
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-xl font-display text-[0.95rem] italic leading-[1.7] text-ink/60">
              Always exploring new tools, platforms, and AI to work smarter — and I&rsquo;m never
              done learning.
            </p>
          </div>

          {/* RIGHT — platforms / tools / AI */}
          <div className="md:col-span-5 md:pl-4">
            <Reveal>
              <div className="flex items-center gap-4 text-[0.62rem] uppercase tracking-[0.32em] text-ink/55">
                <span className="font-display text-[0.85rem] italic tracking-normal text-accent">
                  02
                </span>
                <span className="h-px w-8 bg-ink/25" />
                <span>Platforms</span>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-x-6 text-[0.92rem] sm:grid-cols-2">
                {platforms.map((p) => (
                  <li
                    key={p}
                    className="group flex items-center justify-between border-b border-ink/10 py-2.5 text-ink/80 transition-colors hover:text-accent"
                  >
                    <span>{p}</span>
                    <span className="text-ink/30 opacity-0 transition-all group-hover:opacity-100">
                      →
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.06} className="mt-12">
              <div className="flex items-center gap-4 text-[0.62rem] uppercase tracking-[0.32em] text-ink/55">
                <span className="font-display text-[0.85rem] italic tracking-normal text-accent">
                  03
                </span>
                <span className="h-px w-8 bg-ink/25" />
                <span>Tools &amp; software</span>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-x-6 text-[0.92rem] sm:grid-cols-2">
                {tools.map((t) => (
                  <li
                    key={t}
                    className="group flex items-center justify-between border-b border-ink/10 py-2.5 text-ink/80 transition-colors hover:text-accent"
                  >
                    <span>{t}</span>
                    <span className="text-ink/30 opacity-0 transition-all group-hover:opacity-100">
                      →
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12} className="mt-12">
              <div className="flex items-center gap-4 text-[0.62rem] uppercase tracking-[0.32em] text-ink/55">
                <span className="font-display text-[0.85rem] italic tracking-normal text-accent">
                  04
                </span>
                <span className="h-px w-8 bg-ink/25" />
                <span>AI tools</span>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-x-6 text-[0.92rem] sm:grid-cols-2">
                {ai.map((a) => (
                  <li
                    key={a}
                    className="ai-chip group flex items-center justify-between border-b border-accent/25 py-2.5 text-accent transition-colors hover:text-ink"
                  >
                    <span>{a}</span>
                    <span className="text-accent/40 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                      ◦
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
