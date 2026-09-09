import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const environments = [
  { label: 'City', alt: '120 FT', spd: '28 KM/H', bat: '96%', zone: 'Downtown corridor' },
  { label: 'Stadium', alt: '150 FT', spd: '18 KM/H', bat: '88%', zone: 'Sports venue' },
  { label: 'Concert', alt: '90 FT', spd: '22 KM/H', bat: '79%', zone: 'Festival grounds' },
  { label: 'Brand event', alt: '110 FT', spd: '15 KM/H', bat: '71%', zone: 'Activation site' },
];

export default function Experience() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const droneRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [envIndex, setEnvIndex] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !droneRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(droneRef.current, {
        x: () => window.innerWidth * 0.84,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=220%',
          scrub: 0.5,
          pin: true,
          onUpdate: (self) => {
            const idx = Math.min(environments.length - 1, Math.floor(self.progress * environments.length));
            setEnvIndex(idx);
          },
        },
      });
      gsap.to(trackRef.current, {
        xPercent: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=220%',
          scrub: 0.5,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  const env = environments[envIndex];

  return (
    <div id="experience" ref={wrapRef} className="relative h-[100svh] overflow-hidden bg-[var(--color-void-2)]">
      {/* environment word backdrop, scrolls horizontally beneath the flight path */}
      <div ref={trackRef} className="absolute inset-0 flex items-center will-change-transform">
        <div className="flex shrink-0 gap-[18vw] pl-[10vw]">
          {environments.map((e) => (
            <span
              key={e.label}
              className="font-display shrink-0 select-none text-[16vw] font-extrabold uppercase leading-none text-white/[0.05]"
            >
              {e.label}
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[46%] mx-[6%] h-px bg-white/10" />

      <div ref={droneRef} className="absolute top-[46%] flex -translate-y-1/2 flex-col items-center will-change-transform" style={{ left: '8%' }}>
        <div className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--color-signal-2)]" />
        <div className="mt-2 h-8 w-px bg-gradient-to-b from-[var(--color-signal-2)] to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-24 sm:px-12">
        <div>
          <div className="eyebrow mb-4">The journey</div>
          <h2 className="font-display max-w-lg text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl">
            One display,
            <br />
            every environment.
          </h2>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-white/50">
            Now over — <span className="text-white">{env.zone}</span>
          </div>
          <div className="grid grid-cols-3 gap-x-8 gap-y-3 rounded-md border border-white/10 bg-black/40 px-6 py-4 backdrop-blur-sm sm:flex sm:gap-10">
            <Telemetry label="Alt" value={env.alt} />
            <Telemetry label="Spd" value={env.spd} />
            <Telemetry label="Bat" value={env.bat} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Telemetry({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">{label}</div>
      <div className="font-mono text-sm text-white">{value}</div>
    </div>
  );
}
