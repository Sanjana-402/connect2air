import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { hero } from '@/data/siteData';
import MagneticButton from '@/components/MagneticButton';
import heroBackground from '@/images/WhatsApp Image 2026-09-09 at 2.53.09 PM.jpeg';

export default function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
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
      .fromTo(sideRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.2)
      .fromTo(statsRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, 1.25);
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
      <img
        src={heroBackground}
        alt="Drone light show over a city skyline"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(4,7,14,0.94) 0%, rgba(4,7,14,0.76) 36%, rgba(4,7,14,0.18) 72%), linear-gradient(0deg, rgba(4,7,14,0.76) 0%, transparent 42%, rgba(4,7,14,0.24) 100%)',
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
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">{label}</span>
              <span className="h-px w-6 bg-[var(--color-signal-2)]" />
            </div>
          ))}
        </div>

        <div ref={eyebrowRef} className="eyebrow mb-6 max-w-xs opacity-0">
          {hero.eyebrow}
        </div>

        <h1 ref={headlineRef} className="font-display max-w-4xl text-[13vw] font-extrabold uppercase leading-[0.92] tracking-tight sm:text-[9vw] lg:text-[6.6vw]">
          <span className="block overflow-hidden">
            <span className="line block">{hero.headlineTop}</span>
          </span>
          <span className="block overflow-hidden">
            <span className="line block text-[var(--color-signal-2)] text-glow">{hero.headlineAccent}.</span>
          </span>
        </h1>

        <p ref={subRef} className="mt-7 max-w-md text-base text-[var(--color-ink-dim)] opacity-0 sm:text-lg">
          {hero.sub}
        </p>

        <div ref={ctaRef} className="mt-9 flex flex-wrap items-center gap-5 opacity-0">
          <MagneticButton
            as="a"
            href="#services"
            cursorLabel="Go"
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-black transition-transform"
          >
            {hero.ctaPrimary}
          </MagneticButton>
          <a
            href="#experiences"
            data-cursor="hover"
            className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25">
              ▸
            </span>
            {hero.ctaSecondary}
          </a>
        </div>

      </div>

      <div ref={statsRef} className="container-page relative border-t border-white/10 py-6 opacity-0">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {hero.stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl font-bold text-white sm:text-3xl">{s.value}</div>
              <div className="eyebrow mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
