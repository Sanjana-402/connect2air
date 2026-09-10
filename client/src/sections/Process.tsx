import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { process } from '@/data/siteData';

export default function Process() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const scrollDistance = track.scrollWidth - wrap.clientWidth;
      const st = ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: () => `+=${scrollDistance + 400}`,
        scrub: 0.5,
        pin: true,
      });

      gsap.to(track, {
        x: () => -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${scrollDistance + 400}`,
          scrub: 0.5,
        },
      });

      gsap.to(lineRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${scrollDistance + 400}`,
          scrub: 0.5,
        },
      });

      return () => st.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="process" className="relative bg-[var(--color-void)]">
      <div ref={wrapRef} className="relative overflow-hidden py-28 sm:py-0">
        <div className="container-page mb-14 sm:absolute sm:left-0 sm:right-0 sm:top-16 sm:z-10 sm:mb-0">
          <div className="eyebrow mb-5">Process</div>
          <h2 className="font-display max-w-xl text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-6xl">
            From idea
            <br />
            to sky.
          </h2>
        </div>

        {/* mobile: simple vertical list */}
        <div className="container-page flex flex-col gap-10 sm:hidden">
          {process.map((step) => (
            <div key={step.number} className="border-t border-white/10 pt-6">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-sm text-[var(--color-signal-2)]">{step.number}</span>
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight">{step.title}</h3>
              </div>
              <p className="mt-3 max-w-sm text-[var(--color-ink-dim)]">{step.description}</p>
            </div>
          ))}
        </div>

        {/* desktop: pinned horizontal timeline */}
        <div className="hidden h-screen items-center sm:flex">
          <div ref={trackRef} id="processTrack" className="flex items-center gap-[8vw] pl-[8vw] will-change-transform">
            {process.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="w-[34vw] max-w-md shrink-0"
              >
                <div className="mb-8 flex items-center gap-3">
                  <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[var(--color-signal-2)]" />
                  <span className="font-mono text-sm text-[var(--color-signal-2)]">{step.number}</span>
                </div>
                <h3 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight lg:text-5xl">
                  {step.title}
                </h3>
                <p className="mt-5 max-w-sm text-[var(--color-ink-dim)]">{step.description}</p>
              </div>
            ))}
            <div className="w-[10vw] shrink-0" />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-[28%] mx-[8vw] hidden h-px bg-white/10 sm:block">
            <div ref={lineRef} className="h-px w-full origin-left scale-x-0 bg-[var(--color-signal-2)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
