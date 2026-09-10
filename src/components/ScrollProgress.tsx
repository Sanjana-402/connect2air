import { useEffect, useRef, useState } from 'react';

const SECTION_IDS = [
  'home', 'about', 'services', 'process', 'experiences', 'contact',
];

export default function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? scrolled / max : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${pct})`;

      let current = 1;
      SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) {
          current = i + 1;
        }
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
      <span className="font-mono text-[10px] tabular-nums text-white/70">
        {String(active).padStart(2, '0')}
      </span>
      <div className="relative h-40 w-px bg-white/10">
        <div
          ref={fillRef}
          className="absolute left-0 top-0 h-full w-px origin-top bg-[var(--color-signal-2)]"
          style={{ transform: 'scaleY(0)' }}
        />
      </div>
      <span className="font-mono text-[10px] tabular-nums text-white/30">
        {String(SECTION_IDS.length).padStart(2, '0')}
      </span>
    </div>
  );
}
