import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { getCMSServices, getCMSPricing, type ServiceItem, type PricingItem } from '@/utils/cmsStorage';

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);

  const [servicesList, setServicesList] = useState<ServiceItem[]>(getCMSServices());
  const [pricingList, setPricingList] = useState<PricingItem[]>(getCMSPricing());

  // Listen for CMS updates from Admin Page
  useEffect(() => {
    const handleUpdate = () => {
      setServicesList(getCMSServices());
      setPricingList(getCMSPricing());
    };
    window.addEventListener('c2a_cms_updated', handleUpdate);
    return () => window.removeEventListener('c2a_cms_updated', handleUpdate);
  }, []);

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
  }, [servicesList]);

  return (
    <section id="services" ref={sectionRef} className="relative bg-[var(--color-void)] py-10 sm:py-16">
      <div id="pricing" ref={headingRef} className="container-page mb-8 sm:mb-12 scroll-mt-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Left Column: Heading & Tagline */}
          <div className="lg:col-span-5">
            <div data-reveal className="eyebrow mb-4 text-pink-300 font-bold uppercase tracking-widest">Services & Packages</div>
            <h2 data-reveal className="font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-6xl text-white drop-shadow-[0_2px_12px_rgba(255,42,85,0.3)]">
              One sky.
              <br />
              <span className="text-[var(--color-signal-2)] text-glow drop-shadow-[0_0_20px_rgba(255,77,109,0.7)]">Endless possibilities.</span>
            </h2>
            <p data-reveal className="mt-4 text-lg font-medium text-white/90 leading-relaxed">
              Aerial advertising engineered for moments people remember. Multi-flight display packages tailored to your event schedule.
            </p>
            <div data-reveal className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-2 font-mono text-xs font-bold text-pink-300 shadow-[0_0_15px_rgba(255,42,85,0.2)]">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Same Ground, Bigger Possibilities</span>
            </div>
          </div>

          {/* Right Column: Pricing Flight Cards */}
          <div data-reveal className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {pricingList.map((pkg, idx) => (
                <div
                  key={pkg.id || pkg.step}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 backdrop-blur-xl transition-all duration-500 hover:border-pink-400 hover:bg-white/[0.1] hover:shadow-[0_0_30px_rgba(255,77,109,0.3)] hover:-translate-y-1"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-rose-500 opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-40" />
                  
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-pink-300 bg-pink-500/20 border border-pink-400/30 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(255,42,85,0.2)]">
                        {pkg.badge || 'Flight Package'}
                      </span>
                      <span className="font-mono text-xs font-bold text-white/50">0{idx + 1}</span>
                    </div>

                    <div className="font-display text-xl font-black uppercase text-white group-hover:text-pink-300 transition-colors">
                      {pkg.step}
                    </div>

                    <div className="mt-1 font-display text-3xl font-black text-pink-300 text-glow drop-shadow-[0_0_12px_rgba(255,77,109,0.6)]">
                      {pkg.price}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-white">
                      <ClockIcon className="h-4 w-4 text-rose-400 shrink-0" />
                      <span className="font-mono text-xs font-extrabold tracking-wider">{pkg.duration}</span>
                    </div>

                    <p className="mt-3 text-xs font-medium text-white/80 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-white/15 pt-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/70">{pkg.timeline}</span>
                    <span className="text-xs font-bold text-pink-400 transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Overlapping Sticky Cards with 3D & Color Effects */}
      <div className="relative mt-8">
        {servicesList.map((service, i) => (
          <div
            key={service.id || service.number}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="sticky origin-top py-4"
            style={{ top: `${80 + i * 16}px` }}
          >
            <div className="container-page">
              <div className="group relative overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-r from-[#240913]/95 via-[#1a060e]/95 to-[#100308]/95 p-8 sm:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-500 hover:border-pink-400 hover:shadow-[0_0_50px_rgba(255,77,109,0.3)] hover:-translate-y-1">
                
                {/* Vibrant ambient background glow effect */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-500/15 blur-3xl transition-all duration-700 group-hover:bg-pink-500/30 group-hover:scale-125" />
                <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-red-600/15 blur-3xl transition-all duration-700 group-hover:bg-red-500/30" />

                <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center sm:gap-12">
                  {/* Service Number & Category */}
                  <div className="flex items-center gap-4 sm:w-1/3">
                    <span className="font-mono text-3xl font-black text-pink-400 text-glow drop-shadow-[0_0_15px_rgba(255,77,109,0.6)]">
                      {service.number}
                    </span>
                    <div className="h-8 w-px bg-pink-500/30" />
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-pink-300 bg-pink-500/15 border border-pink-400/30 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(255,42,85,0.2)]">
                      {service.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="sm:w-2/3">
                    <h3 className="font-display text-2xl font-extrabold uppercase leading-[1.08] tracking-tight sm:text-4xl text-white group-hover:text-pink-200 transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-base font-medium text-white/90 leading-relaxed max-w-xl">
                      {service.description}
                    </p>
                    <div className="mt-6 h-0.5 w-full max-w-lg bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 transition-all duration-700 group-hover:w-full" />
                    </div>
                  </div>
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
