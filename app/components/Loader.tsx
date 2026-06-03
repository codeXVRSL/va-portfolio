'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('va-loaded')) {
      setDone(true);
      window.dispatchEvent(new Event('loader:done'));
      return;
    }

    document.body.style.overflow = 'hidden';
    const counterObj = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('va-loaded', '1');
        document.body.style.overflow = '';
        window.dispatchEvent(new Event('loader:done'));
        setDone(true);
      },
    });

    tl.to(counterObj, {
      v: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(counterObj.v));
      },
    })
      .to(labelRef.current, { opacity: 0, y: -12, duration: 0.4, ease: 'power2.in' }, '-=0.2')
      .to(counterRef.current, { opacity: 0, y: -16, duration: 0.4, ease: 'power2.in' }, '<')
      .to(rowARef.current, { xPercent: -100, duration: 1.0, ease: 'expo.inOut' })
      .to(rowBRef.current, { xPercent: 100, duration: 1.0, ease: 'expo.inOut' }, '<')
      .to(overlayRef.current, { autoAlpha: 0, duration: 0.2 }, '-=0.1');

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ background: 'transparent' }}
    >
      <div ref={rowARef} className="absolute inset-y-0 left-0 w-1/2 bg-ink" />
      <div ref={rowBRef} className="absolute inset-y-0 right-0 w-1/2 bg-ink" />
      <div className="relative z-10 flex flex-col items-center gap-6 text-paper">
        <div ref={labelRef} className="font-display text-2xl italic tracking-tightest md:text-3xl">
          Jamaica&nbsp;Tinguha
        </div>
        <div className="font-display text-6xl tabular tracking-tightest md:text-8xl">
          <span ref={counterRef}>0</span>
          <span className="text-accent">%</span>
        </div>
      </div>
    </div>
  );
}
