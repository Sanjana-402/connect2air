import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { services } from '@/data/siteData';

const flightPackages = [
  {
    step: 'ONE FLY',
    price: '₹15,000',
    duration: '10 MINS',
    badge: '1 Flight',
    timeline: 'Single Display',
    description: '1 Flight duration of 10 minutes over the venue crowd.',
  },
  {
    step: 'TWO FLIES',
    price: '₹30,000',
    duration: '20 MINS',
    badge: '2 Flights',
    timeline: '2 Sessions',
    description: '2 Flights totaling 20 minutes with 1 hour interval.',
  },
  {
    step: 'THREE FLIES',
    price: '₹45,000',
    duration: '30 MINS',
    badge: '3 Flights',
    timeline: '3 Sessions',
    description: '3 Flights totaling 30 minutes with 1 hour intervals.',
  },
];

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
    <section id="services" ref={sectionRef} className="relative bg-[var(--color-void)] py-16 sm:py-24">
      <div ref={headingRef} className="container-page mb-10 sm:mb-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Left Column: Heading & Tagline */}
          <div className="lg:col-span-5">
            <div data-reveal className="eyebrow mb-5">Services & Packages</div>
            <h2 data-reveal className="font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-6xl">
              One sky.
              <br />
              <span className="text-[var(--color-signal-2)] text-glow">Endless possibilities.</span>
            </h2>
            <p data-reveal className="mt-5 text-[var(--color-ink-dim)]">
              Aerial advertising engineered for moments people remember. Multi-flight display packages tailored to your event schedule.
            </p>
            <div data-reveal className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-signal-2)]/30 bg-[var(--color-signal-2)]/10 px-4 py-2 font-mono text-xs text-[var(--color-signal-2)]">
              <span className="h-2 w-2 rounded-full bg-[var(--color-signal-2)] animate-pulse" />
              <span>Same Ground, Bigger Possibilities</span>
            </div>
          </div>

          {/* Right Column: 3 Flight Cards */}
          <div data-reveal className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {flightPackages.map((pkg, idx) => (
                <div
                  key={pkg.step}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-500 hover:border-[var(--color-signal-2)]/60 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-[var(--color-signal-2)]/10"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--color-signal-2)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20" />
                  
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-signal-2)] bg-[var(--color-signal-2)]/10 border border-[var(--color-signal-2)]/20 px-2 py-0.5 rounded-full">
                        {pkg.badge}
                      </span>
                      <span className="font-mono text-xs text-white/30">0{idx + 1}</span>
                    </div>

                    <div className="font-display text-xl font-extrabold uppercase text-white group-hover:text-[var(--color-signal-2)] transition-colors">
                      {pkg.step}
                    </div>

                    <div className="mt-1 font-display text-2xl font-black text-[var(--color-signal-2)] text-glow-sm">
                      {pkg.price}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-white/90">
                      <ClockIcon className="h-4 w-4 text-[var(--color-signal-2)] shrink-0" />
                      <span className="font-mono text-xs font-bold tracking-wider">{pkg.duration}</span>
                    </div>

                    <p className="mt-3 text-xs text-[var(--color-ink-dim)] leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">{pkg.timeline}</span>
                    <span className="text-xs text-[var(--color-signal-2)] transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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

function ClockIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
