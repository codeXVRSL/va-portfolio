'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionLabel from './SectionLabel';
import Reveal from './Reveal';
import SplitHeading from './SplitHeading';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP, ScrollTrigger);

const education = [
  { title: 'Master of Arts in English', where: 'Ateneo de Naga University', when: '2019 – Present' },
  { title: 'Bachelor of Secondary Education — English', where: 'Naga College Foundation, Inc.', when: '2013 – 2018' },
];

const jobs = [
  {
    title: 'Social Media & Content VA',
    where: 'VA Masters',
    when: 'Jan 2026 – Present',
    bullets: [
      'Create engaging social media content for real estate professionals',
      'Write captions and marketing copy for listings and property promotions',
      'Schedule and publish content with Meta Business Suite and scheduling tools',
      'Design flyers, brochures, and postcards; edit short-form videos and reels',
      'Assist with digital marketing campaigns and online brand presence',
    ],
  },
  {
    title: 'Social Media & Content',
    where: 'Light Naga',
    when: '2021 – Present',
    bullets: [
      'Create content marketing strategies to increase attendance',
      'Produce engaging social media content and post service highlights',
    ],
  },
  {
    title: 'Content & Communications',
    where: 'Naga College Foundation, Inc.',
    when: '2018 – 2025',
    bullets: [
      'Create content for school promotion; trend and target-audience research',
      'Monitor social media engagement; write news articles and updates',
    ],
  },
];

function JobItem({ j, i }: { j: (typeof jobs)[number]; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const rule = el.querySelector('.job-rule');
      const bullets = el.querySelectorAll('.job-bullet');

      gsap.set(rule, { scaleX: 0, transformOrigin: '0% 50%' });
      gsap.to(rule, {
        scaleX: 1,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
      gsap.from(el.querySelector('.job-heading'), {
        y: 24, opacity: 0, duration: 1, ease: 'expo.out', delay: 0.05,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
      gsap.from(bullets, {
        y: 14, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06, delay: 0.25,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    },
    { scope: ref, dependencies: [i] },
  );

  return (
    <li ref={ref} className="pt-6">
      <div className="job-rule h-px w-full bg-ink/15" />
      <div className="job-heading mt-6 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
        <div>
          <div className="font-display text-3xl tracking-tightest md:text-4xl">{j.title}</div>
          <div className="mt-1 text-sm text-ink/70">{j.where}</div>
        </div>
        <div className="text-xs uppercase tracking-[0.14em] text-muted">{j.when}</div>
      </div>
      <ul className="mt-5 space-y-2 text-sm leading-relaxed text-ink/80">
        {j.bullets.map((b) => (
          <li key={b} className="job-bullet relative pl-5">
            <span className="absolute left-0 top-2.5 h-px w-3 bg-accent" />
            {b}
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="surface-warm relative scroll-mt-24 px-6 py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel number="06" label="Resume" />
        <SplitHeading
          as="h2"
          className="font-display text-5xl leading-[1.02] tracking-tightest md:text-7xl"
        >
          Experience & education.
        </SplitHeading>

        <div className="mt-20 grid grid-cols-1 gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <h3 className="text-xs uppercase tracking-[0.18em] text-muted">Education</h3>
            <ul className="mt-6 space-y-8">
              {education.map((e) => (
                <li key={e.title}>
                  <div className="font-display text-2xl tracking-tightest">{e.title}</div>
                  <div className="mt-2 text-sm text-ink/80">{e.where}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                    {e.when}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="md:col-span-8">
            <h3 className="text-xs uppercase tracking-[0.18em] text-muted">Work Experience</h3>
            <ul className="mt-6 space-y-12">
              {jobs.map((j, i) => (
                <JobItem key={j.title + j.where} j={j} i={i} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
