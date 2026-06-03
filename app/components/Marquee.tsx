'use client';

const items = [
  'Social Media Management',
  'Content Creation',
  'Short-Form Video',
  'Branded Graphics',
  'Community Engagement',
  'Virtual Assistance',
  'Real Estate Marketing',
  'Lead Generation Support',
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <section className="relative overflow-hidden border-y border-ink/10 bg-ink py-7 text-paper">
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="font-display text-3xl italic md:text-4xl">
            {t} <span className="not-italic text-accent">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
