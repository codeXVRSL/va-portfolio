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
  'Real Estate Social Media','Content Creation & Planning','Canva Graphic Design',
  'Caption & Copywriting','SEO Copywriting','Short-Form Video','Engagement Strategy',
  'Community Engagement','Hashtag Research','Market Research','Content Calendar Management',
  'Lead Generation Support','CRM Management','Email Management','Calendar Management',
  'Appointment Scheduling','Administrative Support','Client Communication',
  'Real Estate Branding','Data Entry',
];
const platforms = ['Facebook','Instagram','TikTok','LinkedIn','Threads','X / Twitter','Pinterest'];
const tools = ['Canva','CapCut','Meta Business Suite','Notion','Google Workspace','Mailchimp','Grammarly','Microsoft Office','Google Business Profile','Zillow','Compass'];
const ai = ['ChatGPT','Claude AI','Gemini','Canva Magic Studio','CapCut AI'];

export default function Skills() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('.chip', {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: { each: 0.025, from: 'random' },
        scrollTrigger: { trigger: '.chip-grid', start: 'top 80%', once: true },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative scroll-mt-24 bg-paper px-6 py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel number="04" label="Skills & toolkit" />
        <SplitHeading
          as="h2"
          className="font-display text-5xl leading-[1.02] tracking-tightest md:text-7xl"
        >
          What I bring to the table.
        </SplitHeading>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <h3 className="text-xs uppercase tracking-[0.18em] text-muted">Core Skills</h3>
            <ul className="chip-grid mt-5 flex flex-wrap gap-2">
              {core.map((s) => (
                <li
                  key={s}
                  className="chip cursor-default rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-paper hover:shadow-lg"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5">
            <Reveal>
              <h3 className="text-xs uppercase tracking-[0.18em] text-muted">Platforms</h3>
              <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
                {platforms.map((p) => (
                  <li
                    key={p}
                    className="group flex items-center justify-between border-b border-ink/10 py-2 transition-colors hover:text-accent"
                  >
                    <span>{p}</span>
                    <span className="opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">→</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08} className="mt-10">
              <h3 className="text-xs uppercase tracking-[0.18em] text-muted">Tools & Software</h3>
              <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
                {tools.map((t) => (
                  <li
                    key={t}
                    className="group flex items-center justify-between border-b border-ink/10 py-2 transition-colors hover:text-accent"
                  >
                    <span>{t}</span>
                    <span className="opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">→</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15} className="mt-10">
              <h3 className="text-xs uppercase tracking-[0.18em] text-muted">AI Tools</h3>
              <ul className="mt-5 flex flex-wrap gap-2 text-sm">
                {ai.map((a) => (
                  <li
                    key={a}
                    className="chip rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-accent transition hover:-translate-y-0.5 hover:bg-accent hover:text-paper"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-12 max-w-2xl text-sm italic text-muted">
          Always exploring new tools, platforms, and AI to work smarter — and I&rsquo;m never
          done learning.
        </Reveal>
      </div>
    </section>
  );
}
