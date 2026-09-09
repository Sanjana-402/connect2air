import { useEffect, useRef, useState } from 'react';
import { whyPoints } from '@/data/siteData';

const visualAccent = ['#ffffff', '#ff1493', '#ffffff', '#ff1493'];

export default function Why() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = itemRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="why" ref={sectionRef} className="relative bg-[var(--color-panel)] py-28 sm:py-36">
      <div className="container-page">
        <div className="mb-16 sm:mb-24">
          <div className="eyebrow mb-5">Why Connect2Air</div>
          <h2 className="font-display max-w-2xl text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-6xl">
            Why brands
            <br />
            look up.
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-24 sm:gap-32">
            {whyPoints.map((point, i) => (
              <div
                key={point.number}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="transition-opacity duration-500"
                style={{ opacity: active === i ? 1 : 0.35 }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-[var(--color-signal-2)]">{point.number}</span>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
                    {point.title}
                  </h3>
                </div>
                <p className="mt-4 max-w-md text-[var(--color-ink-dim)]">{point.description}</p>
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-32 flex h-[60vh] items-center justify-center overflow-hidden rounded-md border border-white/10 bg-[var(--color-void)]">
              <div
                className="h-40 w-40 rounded-full opacity-70 blur-3xl transition-all duration-700"
                style={{ background: visualAccent[active], transform: `scale(${1 + active * 0.15})` }}
              />
              <div className="absolute font-display text-7xl font-extrabold text-white/10">
                {whyPoints[active].number}
              </div>
              <div className="absolute bottom-8 left-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Benefit {whyPoints[active].number} / {String(whyPoints.length).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
