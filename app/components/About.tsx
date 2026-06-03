'use client';
import Image from 'next/image';
import SectionLabel from './SectionLabel';
import Reveal from './Reveal';

export default function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-24 bg-paper px-6 py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel number="01" label="About" />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <h2 className="font-display text-5xl leading-[1.02] tracking-tightest md:text-7xl">
              Strategy and creativity, <br />
              <span className="italic text-accent">working together</span>.
            </h2>
            <div className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-ink/80">
              <p>
                Hi! I&rsquo;m Jamaica, a social media manager, content creator, and virtual
                assistant specializing in social media management, content creation, and
                digital marketing support for real estate professionals, growing brands, and
                busy entrepreneurs.
              </p>
              <p>
                I help businesses strengthen their online presence through engaging content,
                strategic social media management, short-form video ideas, and audience
                engagement — plus the day-to-day VA support that keeps everything running
                smoothly.
              </p>
              <p>
                I&rsquo;m highly organized, detail-oriented, and proactive. Most of all,
                I&rsquo;m always ready to learn — new tools, platforms, and niches — so I
                keep growing right alongside the brands I work with.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="md:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-ink/5">
              <Image
                src="/portrait/jamaica-1.jpg"
                alt="Jamaica Tinguha"
                fill
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-cover"
                priority={false}
              />
            </div>
            <dl className="mt-8 grid grid-cols-1 gap-5 text-sm text-ink/80">
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-muted">Based in</dt>
                <dd className="mt-1">Philippines &middot; Remote worldwide</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-muted">Experience</dt>
                <dd className="mt-1">7+ years in social &amp; content</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-muted">I help with</dt>
                <dd className="mt-1">Brands, real estate &amp; VA support</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-muted">Email</dt>
                <dd className="mt-1">
                  <a className="underline underline-offset-4" href="mailto:thejamaica1995@gmail.com">
                    thejamaica1995@gmail.com
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
