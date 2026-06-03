'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function RevealImage({
  src,
  alt,
  ratio = 'aspect-[4/5]',
  sizes = '(max-width: 768px) 90vw, 40vw',
  parallax = 0.12,
  className = '',
}: {
  src: string;
  alt: string;
  ratio?: string;
  sizes?: string;
  parallax?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current || !imgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(wrapRef.current, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(imgRef.current, { scale: 1.25 });

      gsap.to(wrapRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top 88%',
          once: true,
        },
      });
      gsap.to(imgRef.current, {
        scale: 1,
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top 88%',
          once: true,
        },
      });

      if (parallax > 0) {
        gsap.to(imgRef.current, {
          yPercent: parallax * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, wrapRef);
    return () => ctx.revert();
  }, [parallax]);

  return (
    <div
      ref={wrapRef}
      className={`relative ${ratio} w-full overflow-hidden rounded-md bg-ink/5 ${className}`}
    >
      <div ref={imgRef} className="absolute inset-0 h-[120%]">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}
