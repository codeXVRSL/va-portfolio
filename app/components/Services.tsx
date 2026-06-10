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

      const num = card.querySelector('.svc-num');

      const enter = () => {
        gsap.to(reveal, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' });
        gsap.to(arrow, { x: 8, color: '#C66B3D', duration: 0.4, ease: 'expo.out' });
        gsap.to(title, { color: '#C66B3D', duration: 0.4 });
        gsap.to(num, { x: -4, duration: 0.5, ease: 'expo.out' });
      };
      const leave = () => {
        gsap.to(reveal, { opacity: 0.65, x: 0, duration: 0.45, ease: 'expo.inOut' });
        gsap.to(arrow, { x: 0, color: 'rgba(11,11,10,0.3)', duration: 0.4, ease: 'expo.out' });
        gsap.to(title, { color: '#0B0B0A', duration: 0.4 });
        gsap.to(num, { x: 0, duration: 0.5, ease: 'expo.out' });
      };
      gsap.set(reveal, { opacity: 0.65 });

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
    <article
      ref={cardRef}
      className="svc-card group relative grid grid-cols-12 items-start gap-6 border-t border-ink/15 py-10 transition-colors duration-500 md:gap-8 md:py-14"
    >
      <span className="svc-num col-span-2 font-display text-[2.4rem] italic leading-none text-accent md:col-span-1 md:text-[3rem]">
        {s.n}
      </span>
      <div className="col-span-10 md:col-span-7">
        <h3 className="svc-title font-display text-3xl leading-[1.04] tracking-tightest text-ink md:text-[3.2rem]">
          {s.title}
        </h3>
        <p className="mt-4 max-w-[58ch] text-[var(--t-body)] leading-relaxed text-ink/75">
          {s.desc}
        </p>
      </div>
      <div className="col-span-12 flex flex-col items-start gap-3 md:col-span-4 md:items-end md:text-right">
        <span className="svc-arrow font-display text-[1.6rem] italic text-ink/30 md:text-[2rem]">
          →
        </span>
        <div className="svc-detail overflow-hidden">
          <p className="max-w-[26ch] border-t border-ink/15 pt-3 text-[0.7rem] uppercase tracking-[0.22em] text-ink/60 md:border-t-0 md:pt-0">
            {s.detail}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="surface-paper relative scroll-mt-24 px-6 py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel number="02" label="Here's how I can help" />
        <SplitHeading
          as="h2"
          className="font-display text-5xl leading-[1.02] tracking-tightest md:text-7xl"
        >
          Services that move the needle.
        </SplitHeading>

        <div className="mt-16 border-b border-ink/15">
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
