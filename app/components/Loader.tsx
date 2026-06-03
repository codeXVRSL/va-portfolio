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
      window.dispatchEvent(new Event('loader:done'));
      setDone(true);
      return;
    }

    document.body.style.overflow = 'hidden';
    const counterObj = { v: 0 };
    let revealFired = false;

    const fireReveal = () => {
      if (revealFired) return;
      revealFired = true;
      window.dispatchEvent(new Event('loader:done'));
    };

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('va-loaded', '1');
        document.body.style.overflow = '';
        setDone(true);
      },
    });

    tl.to(counterObj, {
      v: 100,
      duration: 1.05,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(counterObj.v));
      },
    })
      .to([labelRef.current, counterRef.current], {
        opacity: 0,
        y: -14,
        duration: 0.3,
        ease: 'power2.in',
      }, '-=0.1')
      .add(fireReveal, '>-0.05')
      .to(rowARef.current, { xPercent: -100, duration: 0.85, ease: 'expo.inOut' }, '<')
      .to(rowBRef.current, { xPercent: 100, duration: 0.85, ease: 'expo.inOut' }, '<')
      .set(overlayRef.current, { autoAlpha: 0 });

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
