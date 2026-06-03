'use client';
import { useState } from 'react';
import Image from 'next/image';
import SectionLabel from './SectionLabel';
import Reveal from './Reveal';

type Item = {
  src: string;
  title: string;
  kind: 'Carousels' | 'Flyers & Graphics' | 'Reels' | 'Feeds & Posts' | 'Email';
};

const items: Item[] = [
  { src: '/work/002-real-estate-ig-feed.jpg', title: 'Real Estate IG Feed', kind: 'Feeds & Posts' },
  { src: '/work/003-sold-in-24-hours.jpg', title: 'Sold in 24 Hours — Facebook Post', kind: 'Feeds & Posts' },
  { src: '/work/004-fha-vs-conventional.jpg', title: 'FHA vs Conventional — Real Estate Carousel', kind: 'Carousels' },
  { src: '/work/005-homeowner-tax-tips.jpg', title: 'Homeowner Tax Tips — Real Estate Carousel', kind: 'Carousels' },
  { src: '/work/006-just-sold-highlights.jpg', title: 'Just Sold Highlights — Flyer', kind: 'Flyers & Graphics' },
  { src: '/work/007-relocation-guide.jpg', title: 'Relocation Guide — Flyer', kind: 'Flyers & Graphics' },
  { src: '/work/008-commercial-listing.jpg', title: 'Commercial Listing — Flyer / Letter', kind: 'Flyers & Graphics' },
  { src: '/work/009-realtor-introduction.jpg', title: 'Realtor Introduction — Carousel', kind: 'Carousels' },
  { src: '/work/010-skincare-myths-or-facts.jpg', title: 'Skincare Myths or Facts — Beauty Brand Carousel', kind: 'Carousels' },
  { src: '/work/011-property-managers.jpg', title: 'Property Managers — Trade Brand Carousel', kind: 'Carousels' },
  { src: '/work/012-nene-chicken.jpg', title: 'Nene Chicken — Food Brand Carousel', kind: 'Carousels' },
  { src: '/work/013-if-you-could-only-pick-one.jpg', title: 'If You Could Only Pick One — Short-Form Reel', kind: 'Reels' },
  { src: '/work/014-still-thinking-about-this.jpg', title: 'Still Thinking About This — Short-Form Reel', kind: 'Reels' },
  { src: '/work/015-happy-easter.jpg', title: 'Happy Easter — Short-Form Reel', kind: 'Reels' },
  { src: '/work/016-time-management-tip.jpg', title: 'Time Management Tip — Short-Form Reel', kind: 'Reels' },
  { src: '/work/017-buyer-guide-email.jpg', title: 'Buyer Guide Email — Email Design', kind: 'Email' },
];

const filters = ['All', 'Carousels', 'Flyers & Graphics', 'Reels', 'Feeds & Posts', 'Email'] as const;

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
          <Reveal>
            <h2 className="font-display text-5xl leading-[1.02] tracking-tightest md:text-7xl">
              Selected <span className="italic text-accent">work</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] transition ${
                    active === f
                      ? 'border-ink bg-ink text-paper'
                      : 'border-ink/15 text-ink/70 hover:border-ink'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it, i) => (
            <Reveal key={it.src} delay={(i % 3) * 0.06}>
              <figure className="group relative overflow-hidden rounded-md bg-ink/5">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={it.src}
                    alt={it.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/85 to-transparent p-4 text-paper">
                  <span className="text-xs">{it.title}</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-paper/70">
                    {it.kind}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-sm text-muted">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-ink"
          >
            View my full IG portfolio →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
