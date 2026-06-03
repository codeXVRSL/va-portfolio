'use client';
import SectionLabel from './SectionLabel';
import Reveal from './Reveal';

const services = [
  {
    n: '01',
    title: 'Social Media Management',
    desc: 'Manage Facebook, Instagram, TikTok, LinkedIn, and Threads for your brand — start to finish.',
  },
  {
    n: '02',
    title: 'Content Creation',
    desc: 'Engaging posts, carousels, reels ideas, and on-brand branded graphics designed to stop the scroll.',
  },
  {
    n: '03',
    title: 'Real Estate Marketing',
    desc: 'Promote listings, open houses, client testimonials, and market updates that build trust and reach.',
  },
  {
    n: '04',
    title: 'Short-Form Video',
    desc: 'Reels ideas and edited short-form videos that get your brand seen, saved, and shared.',
  },
  {
    n: '05',
    title: 'Content Calendar',
    desc: 'Plan and organize consistent posting schedules so your feed never goes quiet.',
  },
  {
    n: '06',
    title: 'Lead Generation Support',
    desc: 'Assist with audience engagement, inquiries, and nurturing online leads into real conversations.',
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative scroll-mt-24 bg-cream px-6 py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel number="02" label="Here's how I can help" />
        <Reveal>
          <h2 className="font-display text-5xl leading-[1.02] tracking-tightest md:text-7xl">
            Services that <span className="italic text-accent">move the needle</span>.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal
              key={s.n}
              delay={(i % 3) * 0.08}
              className="group relative bg-cream p-8 transition-colors duration-500 hover:bg-paper"
            >
              <div className="flex items-baseline justify-between text-xs uppercase tracking-[0.18em] text-muted">
                <span className="tabular font-mono text-accent">{s.n}</span>
                <span aria-hidden className="transition group-hover:translate-x-1">→</span>
              </div>
              <h3 className="mt-8 font-display text-3xl leading-tight tracking-tightest md:text-4xl">
                {s.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/75">{s.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 max-w-3xl text-sm text-muted">
          <p>
            Also offering: <span className="text-ink">Graphic Design</span> ·{' '}
            <span className="text-ink">Listing Promotion Graphics</span> ·{' '}
            <span className="text-ink">Caption Writing</span> ·{' '}
            <span className="text-ink">CRM &amp; Client Support</span> ·{' '}
            <span className="text-ink">Email &amp; Scheduling</span> ·{' '}
            <span className="text-ink">Administrative Support</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
