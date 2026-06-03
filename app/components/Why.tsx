'use client';
import Reveal from './Reveal';
import SplitHeading from './SplitHeading';
import Counter from './Counter';

const reasons = [
  { n: 'i.', title: 'Experienced', body: '7+ years in social media management, copywriting, and digital communication across many brands.' },
  { n: 'ii.', title: 'Versatile', body: 'From real estate to growing brands and everyday VA tasks — I adapt to what your business actually needs.' },
  { n: 'iii.', title: 'Multi-Platform', body: 'Comfortable across Facebook, Instagram, TikTok, LinkedIn, Threads, Meta Business Suite, Canva, and more.' },
  { n: 'iv.', title: 'AI-Powered', body: 'I use AI tools like ChatGPT and Claude AI to work faster and smarter — without losing the human touch.' },
  { n: 'v.', title: 'Strong Communicator', body: "Clear, reliable, and proactive communication — you'll always know what's happening and why." },
  { n: 'vi.', title: 'Always Learning', body: 'Eager to pick up new tools, platforms, and niches so I keep delivering better results over time.' },
];

const stats = [
  { v: 7, l: 'Years experience' },
  { v: 20, l: 'Core skills' },
  { v: 6, l: 'Platforms managed' },
  { v: 10, l: 'Tools mastered' },
];

export default function Why() {
  return (
    <section className="relative bg-ink px-6 py-28 text-paper lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex items-baseline gap-3 text-xs uppercase tracking-[0.22em] text-paper/60">
          <span className="tabular font-mono text-accent">03</span>
          <span className="h-px flex-1 max-w-12 bg-paper/20" />
          <span>Why work with me</span>
        </div>
        <SplitHeading
          as="h2"
          className="font-display text-5xl leading-[1.02] tracking-tightest md:text-7xl"
        >
          A safe pair of hands for your socials.
        </SplitHeading>

        <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) * 0.08} className="group">
              <div className="text-xs font-mono text-accent">{r.n}</div>
              <h3 className="mt-3 font-display text-2xl tracking-tightest transition-colors duration-500 group-hover:text-accent">
                {r.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/75">{r.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-paper/15 bg-paper/15 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-ink px-6 py-10 transition-colors duration-500 hover:bg-accent">
              <div className="font-display text-5xl tracking-tightest md:text-6xl">
                <Counter to={s.v} />
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.18em] text-paper/60">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
