import { useEffect, useRef, useState } from 'react';
import { stats } from '@/data/siteData';

function useCountUp(target: string, active: boolean) {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    if (!active) return;
    const numeric = parseInt(target.replace(/\D/g, ''), 10);
    if (Number.isNaN(numeric)) {
      setDisplay(target); // e.g. the infinity symbol
      return;
    }
    const suffix = target.replace(/[0-9]/g, '');
    const duration = 1200;
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const progress = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${Math.round(numeric * eased)}${suffix}`);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return display;
}

function StatItem({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const display = useCountUp(value, active);

  return (
    <div ref={ref} className="border-t border-white/10 py-3 sm:py-4">
      <div className="font-display text-4xl font-extrabold text-white sm:text-6xl">{display}</div>
      <div className="eyebrow mt-2 text-xs text-white/70">{label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="relative bg-[var(--color-void)] py-4 sm:py-6">
      <div className="container-page grid grid-cols-2 gap-x-8 gap-y-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatItem key={s.label} value={s.value} label={s.label} />
        ))}
      </div>
    </section>
  );
}
