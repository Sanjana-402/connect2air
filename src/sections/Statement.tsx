import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import PixelField from '@/components/PixelField';

export default function Statement() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);
  const rowCRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: '+=180%',
        scrub: 0.4,
        pin: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      gsap.to(rowARef.current, {
        xPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top top', end: '+=180%', scrub: 0.4 },
      });
      gsap.to(rowBRef.current, {
        xPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top top', end: '+=180%', scrub: 0.4 },
      });
      gsap.to(rowCRef.current, {
        xPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top top', end: '+=180%', scrub: 0.4 },
      });
      gsap.fromTo(
        captionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top top', end: '+=90%', scrub: 0.4 },
        }
      );

      return () => st.kill();
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="relative h-[100svh] overflow-hidden bg-[var(--color-void)]">
      <PixelField progressRef={progressRef} className="absolute inset-0 h-full w-full opacity-70" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <div ref={captionRef} className="eyebrow mb-8 opacity-0">
          Every campaign starts as a signal
        </div>
        <div className="font-display select-none font-extrabold uppercase leading-[0.92] tracking-tight text-white">
          <div ref={rowARef} className="text-[13vw] sm:text-[9vw] lg:text-[7vw]">The sky is</div>
          <div ref={rowBRef} className="text-[13vw] text-[var(--color-signal-2)] sm:text-[9vw] lg:text-[7vw]">your next</div>
          <div ref={rowCRef} className="text-[13vw] sm:text-[9vw] lg:text-[7vw]">canvas.</div>
        </div>
      </div>
    </div>
  );
}
