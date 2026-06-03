'use client';
import SectionLabel from './SectionLabel';
import Reveal from './Reveal';

const education = [
  {
    title: 'Master of Arts in English',
    where: 'Ateneo de Naga University',
    when: '2019 – Present',
  },
  {
    title: 'Bachelor of Secondary Education — English',
    where: 'Naga College Foundation, Inc.',
    when: '2013 – 2018',
  },
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

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative scroll-mt-24 bg-paper px-6 py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel number="06" label="Resume" />
        <Reveal>
          <h2 className="font-display text-5xl leading-[1.02] tracking-tightest md:text-7xl">
            Experience &amp; <span className="italic text-accent">education</span>.
          </h2>
        </Reveal>

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
            <ul className="mt-6 space-y-10">
              {jobs.map((j, i) => (
                <Reveal
                  key={j.title + j.where}
                  delay={i * 0.08}
                  className="border-t border-ink/15 pt-6"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                    <div>
                      <div className="font-display text-3xl tracking-tightest md:text-4xl">
                        {j.title}
                      </div>
                      <div className="mt-1 text-sm text-ink/70">{j.where}</div>
                    </div>
                    <div className="text-xs uppercase tracking-[0.14em] text-muted">
                      {j.when}
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm leading-relaxed text-ink/80">
                    {j.bullets.map((b) => (
                      <li key={b} className="relative pl-5">
                        <span className="absolute left-0 top-2.5 h-px w-3 bg-ink/40" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
