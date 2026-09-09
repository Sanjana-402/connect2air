import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import MagneticButton from '@/components/MagneticButton';

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        glowRef.current,
        { scale: 0.4, opacity: 0.15 },
        {
          scale: 1,
          opacity: 0.55,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 30%', scrub: 0.6 },
        }
      );
      gsap.fromTo(
        headingRef.current?.querySelectorAll('[data-reveal]') ?? [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative overflow-hidden bg-[var(--color-void)] py-32 sm:py-44">
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[50vw] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(242,10,131,0.35), transparent 70%)' }}
      />
      <div className="pulse-dot pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />

      <div ref={headingRef} className="container-page relative text-center">
        <div data-reveal className="eyebrow mb-8">Ready when you are</div>
        <h2 className="font-display mx-auto max-w-4xl text-[11vw] font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl">
          <span data-reveal className="block">Ready to take</span>
          <span data-reveal className="block">your brand <span className="text-[var(--color-signal-2)] text-glow">higher?</span></span>
        </h2>
        <p data-reveal className="mx-auto mt-8 max-w-md text-[var(--color-ink-dim)]">
          Let's create something people can't help but look up for.
        </p>

        <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <MagneticButton
            as="a"
            href="mailto:hello@connect2air.com"
            cursorLabel="Start"
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 font-mono text-xs uppercase tracking-[0.14em] text-black"
          >
            Start a campaign →
          </MagneticButton>
          <a
            href="mailto:hello@connect2air.com"
            data-cursor="hover"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-4 font-mono text-xs uppercase tracking-[0.14em] text-white transition-colors hover:border-[var(--color-signal-2)]"
          >
            Talk to our team
          </a>
        </div>
      </div>
    </section>
  );
}
