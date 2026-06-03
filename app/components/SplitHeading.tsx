'use client';
import { createElement, useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);
}

export default function SplitHeading({
  as = 'h2',
  children,
  className = '',
  delay = 0,
  stagger = 0.06,
}: {
  as?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const split = SplitText.create(ref.current, {
        type: 'lines',
        linesClass: 'split-line',
        mask: 'lines',
        autoSplit: true,
      });
      gsap.set(split.lines, { yPercent: 110 });
      gsap.to(split.lines, {
        yPercent: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger,
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 88%',
          once: true,
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return createElement(as, { ref, className }, children);
}
