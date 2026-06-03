'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from './SectionLabel';
import Reveal from './Reveal';
import SplitHeading from './SplitHeading';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

type Item = {
  src: string;
  title: string;
  kind: 'Carousels' | 'Flyers & Graphics' | 'Reels' | 'Feeds & Posts' | 'Email';
};

const items: Item[] = [
  { src: '/work/002-real-estate-ig-feed.jpg', title: 'Real Estate IG Feed', kind: 'Feeds & Posts' },
  { src: '/work/003-sold-in-24-hours.jpg', title: 'Sold in 24 Hours', kind: 'Feeds & Posts' },
  { src: '/work/004-fha-vs-conventional.jpg', title: 'FHA vs Conventional', kind: 'Carousels' },
  { src: '/work/005-homeowner-tax-tips.jpg', title: 'Homeowner Tax Tips', kind: 'Carousels' },
  { src: '/work/006-just-sold-highlights.jpg', title: 'Just Sold Highlights', kind: 'Flyers & Graphics' },
  { src: '/work/007-relocation-guide.jpg', title: 'Relocation Guide', kind: 'Flyers & Graphics' },
  { src: '/work/008-commercial-listing.jpg', title: 'Commercial Listing', kind: 'Flyers & Graphics' },
  { src: '/work/009-realtor-introduction.jpg', title: 'Realtor Introduction', kind: 'Carousels' },
  { src: '/work/010-skincare-myths-or-facts.jpg', title: 'Skincare Myths or Facts', kind: 'Carousels' },
  { src: '/work/011-property-managers.jpg', title: 'Property Managers', kind: 'Carousels' },
  { src: '/work/012-nene-chicken.jpg', title: 'Nene Chicken', kind: 'Carousels' },
  { src: '/work/013-if-you-could-only-pick-one.jpg', title: 'If You Could Only Pick One', kind: 'Reels' },
  { src: '/work/014-still-thinking-about-this.jpg', title: 'Still Thinking About This', kind: 'Reels' },
  { src: '/work/015-happy-easter.jpg', title: 'Happy Easter', kind: 'Reels' },
  { src: '/work/016-time-management-tip.jpg', title: 'Time Management Tip', kind: 'Reels' },
  { src: '/work/017-buyer-guide-email.jpg', title: 'Buyer Guide Email', kind: 'Email' },
];

const filters = ['All', 'Carousels', 'Flyers & Graphics', 'Reels', 'Feeds & Posts', 'Email'] as const;

function WorkCard({ it, i }: { it: Item; i: number }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const wrap = ref.current!;
      const img = wrap.querySelector('.work-img') as HTMLElement;
      const overlay = wrap.querySelector('.work-overlay') as HTMLElement;
      const meta = wrap.querySelectorAll('.work-meta');

      gsap.set(wrap, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(img, { scale: 1.25 });

      gsap.to(wrap, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.1,
        ease: 'expo.out',
        delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: wrap, start: 'top 88%', once: true },
      });
      gsap.to(img, {
        scale: 1,
        duration: 1.5,
        ease: 'expo.out',
        delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: wrap, start: 'top 88%', once: true },
      });

      const enter = () => {
        gsap.to(img, { scale: 1.08, duration: 0.8, ease: 'expo.out' });
        gsap.to(overlay, { yPercent: 0, duration: 0.6, ease: 'expo.out' });
        gsap.from(meta, { y: 16, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'expo.out' });
      };
      const leave = () => {
        gsap.to(img, { scale: 1, duration: 0.8, ease: 'expo.out' });
        gsap.to(overlay, { yPercent: 100, duration: 0.6, ease: 'expo.inOut' });
      };
      wrap.addEventListener('pointerenter', enter);
      wrap.addEventListener('pointerleave', leave);
    }, ref);
    return () => ctx.revert();
  }, [i]);

  return (
    <figure
      ref={ref}
      className="group relative overflow-hidden rounded-md bg-ink/5"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <div className="work-img absolute inset-0">
          <Image
            src={it.src}
            alt={it.title}
            fill
            sizes="(max-width: 768px) 90vw, 33vw"
            className="object-cover"
          />
        </div>
      </div>
      <figcaption
        className="work-overlay absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-gradient-to-t from-ink/90 via-ink/70 to-transparent p-4 text-paper"
      >
        <span className="work-meta text-sm">{it.title}</span>
        <span className="work-meta text-[10px] uppercase tracking-[0.18em] text-paper/70">
          {it.kind}
        </span>
      </figcaption>
      <div className="absolute left-4 top-4 rounded-full bg-paper/95 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-ink">
        {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
      </div>
    </figure>
  );
}

export default function Work() {
  const [active, setActive] = useState<(typeof filters)[number]>('All');
  const filtered = active === 'All' ? items : items.filter((i) => i.kind === active);

  return (
    <section
      id="work"
      className="relative scroll-mt-24 bg-cream px-6 py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel number="05" label="Sample works" />
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SplitHeading
            as="h2"
            className="font-display text-5xl leading-[1.02] tracking-tightest md:text-7xl"
          >
            Selected work.
          </SplitHeading>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={`group relative overflow-hidden rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] transition-all duration-300 ${
                    active === f
                      ? 'border-ink bg-ink text-paper'
                      : 'border-ink/15 text-ink/70 hover:border-ink hover:-translate-y-0.5'
                  }`}
                >
                  <span className="relative z-10">{f}</span>
                  {active !== f && (
                    <span className="absolute inset-0 -translate-y-full bg-ink transition-transform duration-500 group-hover:translate-y-0" />
                  )}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it, i) => (
            <WorkCard key={it.src} it={it} i={i} />
          ))}
        </div>

        <Reveal className="mt-12 text-sm text-muted">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center gap-2 underline-offset-4 hover:text-ink"
          >
            <span className="relative">
              View my full IG portfolio
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-ink transition-all duration-500 group-hover:w-full" />
            </span>
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
