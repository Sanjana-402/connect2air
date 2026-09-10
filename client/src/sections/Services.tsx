import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { services } from '@/data/siteData';

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current?.querySelectorAll('[data-reveal]') ?? [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 75%' } }
      );

      panelRefs.current.forEach((panel, i) => {
        const next = panelRefs.current[i + 1];
        if (!panel || !next) return;
        gsap.to(panel, {
          scale: 0.94,
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: {
            trigger: next,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        });
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative bg-[var(--color-void)] py-28 sm:py-36">
      <div ref={headingRef} className="container-page mb-16 sm:mb-24">
        <div data-reveal className="eyebrow mb-5">Services</div>
        <h2 data-reveal className="font-display max-w-2xl text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-6xl">
          One sky.
          <br />
          Endless possibilities.
        </h2>
        <p data-reveal className="mt-5 max-w-md text-[var(--color-ink-dim)]">
          Aerial advertising engineered for moments people remember.
        </p>
      </div>

      <div className="relative">
        {services.map((service, i) => (
          <div
            key={service.number}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="sticky origin-top border-t border-white/10 bg-[var(--color-void)]"
            style={{ top: `${88 + i * 2}px` }}
          >
            <div className="container-page flex min-h-[62vh] flex-col justify-center gap-6 py-14 sm:min-h-[68vh] sm:flex-row sm:items-center sm:gap-14">
              <div className="flex items-baseline gap-5 sm:w-1/3">
                <span className="font-mono text-sm text-[var(--color-signal-2)]">{service.number}</span>
                <span className="eyebrow">{service.category}</span>
              </div>

              <div className="sm:w-2/3">
                <h3 className="font-display max-w-xl text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl">
                  {service.title}
                </h3>
                <p className="mt-5 max-w-lg text-[var(--color-ink-dim)]">{service.description}</p>
                <div className="mt-8 h-px w-full max-w-lg bg-white/10">
                  <div className="h-px w-0 bg-[var(--color-signal-2)] transition-[width] duration-700 group-hover:w-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
