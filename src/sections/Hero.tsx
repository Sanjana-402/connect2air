import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { hero } from '@/data/siteData';
import MagneticButton from '@/components/MagneticButton';
import heroVideo from '@/videos/background video.mp4';

export default function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(glowRef.current, { opacity: 0 }, { opacity: 1, duration: 1.1 }, 0)
      .fromTo(eyebrowRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, 0.5)
      .fromTo(
        headlineRef.current?.querySelectorAll('.line') ?? [],
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.09 },
        0.65
      )
      .fromTo(subRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 1.0)
      .fromTo(ctaRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 1.15)
      .fromTo(sideRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.2);
  }, [ready]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        yPercent: -18,
        opacity: 0,
        scale: 0.94,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to(glowRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      ScrollTrigger.refresh();
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[var(--color-void)]">
      <video
        autoPlay
        loop
        muted
        playsInline
        src={heroVideo}
        className="pointer-events-none absolute inset-0 hidden h-full w-full scale-125 object-cover object-[80%_center] filter brightness-110 contrast-105 lg:block transition-all duration-700"
      />
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{
          background:
            'linear-gradient(90deg, rgba(4,7,14,0.70) 0%, rgba(4,7,14,0.40) 45%, rgba(4,7,14,0.10) 85%), linear-gradient(0deg, rgba(4,7,14,0.80) 0%, transparent 25%, transparent 75%, rgba(4,7,14,0.30) 100%)',
        }}
      />

      <div ref={contentRef} className="container-page relative flex flex-1 flex-col justify-center pb-24 pt-32 will-change-transform">
        {/* side vertical labels */}
        <div
          ref={sideRef}
          className="pointer-events-none absolute right-[3%] top-[26%] hidden flex-col items-end gap-4 opacity-0 xl:flex"
        >
          {hero.sideLabels.map((label) => (
            <div key={label} className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{label}</span>
              <span className="h-px w-6 bg-[var(--color-signal-2)] shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
            </div>
          ))}
        </div>

        <div ref={eyebrowRef} className="eyebrow mb-6 max-w-md opacity-0 text-cyan-300 font-semibold tracking-widest text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] uppercase">
          {hero.eyebrow}
        </div>

        <h1 ref={headlineRef} className="font-display max-w-xl text-[8vw] font-black uppercase leading-[0.94] tracking-tight sm:text-[5vw] lg:text-[3.8vw] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
          <span className="block overflow-hidden">
            <span className="line block text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">{hero.headlineTop}</span>
          </span>
          <span className="block overflow-hidden">
            <span className="line block text-[var(--color-signal-2)] text-glow drop-shadow-[0_0_25px_rgba(0,229,255,0.8)]">{hero.headlineAccent}.</span>
          </span>
        </h1>

        <p ref={subRef} className="mt-6 max-w-md text-lg sm:text-xl font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] opacity-0 leading-relaxed">
          {hero.sub}
        </p>

        <div ref={ctaRef} className="mt-8 flex flex-wrap items-center gap-5 opacity-0">
          <MagneticButton
            as="a"
            href="#services"
            cursorLabel="Go"
            className="inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-cyan-300 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all hover:scale-105"
          >
            {hero.ctaPrimary}
          </MagneticButton>
          <a
            href="#showreel"
            data-cursor="hover"
            className="inline-flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white hover:text-cyan-300 transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] group"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/50 bg-black/40 group-hover:bg-cyan-500/20 group-hover:border-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.3)] transition-all">
              ▸
            </span>
            {hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
