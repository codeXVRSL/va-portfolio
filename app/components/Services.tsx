'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionLabel from './SectionLabel';
import Reveal from './Reveal';
import SplitHeading from './SplitHeading';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP, ScrollTrigger);

const services = [
  {
    n: '01',
    title: 'Social Media Management',
    desc: 'Manage Facebook, Instagram, TikTok, LinkedIn, and Threads for your brand — start to finish.',
    detail: 'Profile audit · Strategy · Posting · Engagement · Monthly reporting',
  },
  {
    n: '02',
    title: 'Content Creation',
    desc: 'Engaging posts, carousels, reels ideas, and on-brand branded graphics designed to stop the scroll.',
    detail: 'Concept · Copy · Canva design · Asset delivery',
  },
  {
    n: '03',
    title: 'Real Estate Marketing',
    desc: 'Promote listings, open houses, client testimonials, and market updates that build trust and reach.',
    detail: 'MLS · Compass · Zillow · Just-listed/sold campaigns',
  },
  {
    n: '04',
    title: 'Short-Form Video',
    desc: 'Reels ideas and edited short-form videos that get your brand seen, saved, and shared.',
    detail: 'CapCut editing · Hook writing · Captions · Trending audio',
  },
  {
    n: '05',
    title: 'Content Calendar',
    desc: 'Plan and organize consistent posting schedules so your feed never goes quiet.',
    detail: 'Notion calendars · Meta Suite scheduling · Approval workflows',
  },
  {
    n: '06',
    title: 'Lead Generation Support',
    desc: 'Assist with audience engagement, inquiries, and nurturing online leads into real conversations.',
    detail: 'DM triage · CRM updates · Follow-up sequences',
  },
];

function ServiceCard({ s, i }: { s: (typeof services)[number]; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const card = cardRef.current!;
      const reveal = card.querySelector('.svc-detail');
      const arrow = card.querySelector('.svc-arrow');
      const title = card.querySelector('.svc-title');

      gsap.set(reveal, { height: 0, opacity: 0 });

      const enter = () => {
        gsap.to(reveal, { height: 'auto', opacity: 1, duration: 0.5, ease: 'expo.out' });
        gsap.to(arrow, { rotate: 45, x: 4, duration: 0.4, ease: 'expo.out' });
        gsap.to(title, { color: '#C66B3D', duration: 0.4 });
      };
      const leave = () => {
        gsap.to(reveal, { height: 0, opacity: 0, duration: 0.45, ease: 'expo.inOut' });
        gsap.to(arrow, { rotate: 0, x: 0, duration: 0.4, ease: 'expo.out' });
        gsap.to(title, { color: '#0B0B0A', duration: 0.4 });
      };

      card.addEventListener('pointerenter', enter);
      card.addEventListener('pointerleave', leave);

      gsap.from(card, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        delay: (i % 3) * 0.08,
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true,
        },
      });

      return () => {
        card.removeEventListener('pointerenter', enter);
        card.removeEventListener('pointerleave', leave);
      };
    },
    { scope: cardRef, dependencies: [i] },
  );

  return (
    <div
      ref={cardRef}
      className="svc-card group relative bg-cream p-8 transition-colors duration-500 hover:bg-paper"
    >
      <div className="flex items-baseline justify-between text-xs uppercase tracking-[0.18em] text-muted">
        <span className="tabular font-mono text-accent">{s.n}</span>
        <span className="svc-arrow inline-block">→</span>
      </div>
      <h3 className="svc-title mt-8 font-display text-3xl leading-tight tracking-tightest md:text-4xl">
        {s.title}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-ink/75">{s.desc}</p>
      <div className="svc-detail overflow-hidden">
        <p className="mt-5 border-t border-ink/15 pt-4 text-xs uppercase tracking-[0.14em] text-muted">
          {s.detail}
        </p>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="relative scroll-mt-24 bg-cream px-6 py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel number="02" label="Here's how I can help" />
        <SplitHeading
          as="h2"
          className="font-display text-5xl leading-[1.02] tracking-tightest md:text-7xl"
        >
          Services that move the needle.
        </SplitHeading>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.n} s={s} i={i} />
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
