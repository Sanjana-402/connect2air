import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { brand } from '@/data/siteData';

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const doneCalled = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    const duration = reduced ? 200 : 1400;

    let raf: number;
    const tick = (t: number) => {
      const elapsed = t - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else if (!doneCalled.current) {
        doneCalled.current = true;
        finish();
      }
    };
    raf = requestAnimationFrame(tick);

    function finish() {
      if (!rootRef.current) return onDone();
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 0.15,
        ease: 'power2.out',
        onComplete: onDone,
      });
    }

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-6 bg-[var(--color-void)]"
    >
      <img src={brand.logo} alt={brand.name} className="h-12 w-auto object-contain opacity-90" />
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
        Initializing sky system
      </div>
      <div className="relative h-px w-48 bg-white/10">
        <div
          className="absolute left-0 top-0 h-px bg-[var(--color-signal-2)] transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="font-mono text-[10px] tabular-nums text-white/40">
        {String(progress).padStart(2, '0')}
      </div>
    </div>
  );
}
