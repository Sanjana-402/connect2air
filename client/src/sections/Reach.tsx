import { useMemo, useState, type ReactNode } from 'react';
import { reachDefaults } from '@/data/siteData';

const sizes = ['Small', 'Medium', 'Large'] as const;
const sizeRadius: Record<(typeof sizes)[number], number> = { Small: 60, Medium: 90, Large: 130 };
const sizeReach: Record<(typeof sizes)[number], [number, number]> = {
  Small: [8, 20],
  Medium: [18, 45],
  Large: [30, 70],
};

export default function Reach() {
  const [height, setHeight] = useState(reachDefaults.flightHeight);
  const [size, setSize] = useState<(typeof sizes)[number]>(reachDefaults.displaySize);
  const [duration, setDuration] = useState(reachDefaults.duration);

  const radius = useMemo(() => {
    const heightFactor = 0.7 + (height - 60) / 200;
    return Math.round(sizeRadius[size] * heightFactor);
  }, [height, size]);

  const [reachLow, reachHigh] = sizeReach[size];
  const visibility = height > 130 ? 'Very high' : height > 90 ? 'High' : 'Moderate';

  return (
    <section id="reach" className="relative bg-[var(--color-panel)] py-28 sm:py-36">
      <div className="container-page">
        <div className="mb-14 sm:mb-20">
          <div className="eyebrow mb-5">Reach</div>
          <h2 className="font-display max-w-xl text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-6xl">
            See the
            <br />
            reach.
          </h2>
          <p className="mt-5 max-w-md text-[var(--color-ink-dim)]">
            Adjust flight height and display size to see how coverage and estimated reach shift. Figures are
            illustrative — confirmed campaign numbers are set with our team during planning.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          {/* stylized map */}
          <div className="relative aspect-square w-full overflow-hidden rounded-md border border-white/10 bg-[var(--color-void)] sm:aspect-[4/3]">
            <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#grid)" />

              {/* city block hints */}
              {[
                [40, 40, 50, 30], [110, 60, 34, 46], [30, 140, 60, 24], [280, 40, 46, 60],
                [250, 160, 70, 36], [330, 120, 34, 60], [140, 200, 60, 30], [220, 220, 50, 24],
              ].map(([x, y, w, h], i) => (
                <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(255,255,255,0.045)" />
              ))}

              {/* flight path */}
              <path
                d="M 60 250 Q 150 180 200 150 T 340 70"
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1.5"
                strokeDasharray="3 5"
              />

              {/* coverage circle */}
              <circle
                cx="200"
                cy="150"
                r={radius}
                fill="rgba(242,10,131,0.08)"
                stroke="rgba(255,20,147,0.55)"
                strokeWidth="1.5"
                style={{ transition: 'r 0.4s ease' }}
              />
              <circle cx="200" cy="150" r="4" fill="#ff1493" className="pulse-dot" style={{ transformOrigin: '200px 150px' }} />
            </svg>

            <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              {reachDefaults.city}
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Illustrative — not surveyed
            </div>
          </div>

          {/* control panel */}
          <div className="flex flex-col gap-8 rounded-md border border-white/10 bg-[var(--color-void)] p-6 sm:p-8">
            <Field label={`Flight height — ${height} ft`}>
              <input
                type="range"
                min={60}
                max={200}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="range-signal w-full"
              />
            </Field>

            <Field label="Display size">
              <div className="flex gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    data-cursor="hover"
                    className={`flex-1 rounded-full border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                      size === s
                        ? 'border-[var(--color-signal-2)] bg-[var(--color-signal-soft)] text-white'
                        : 'border-white/15 text-white/50 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={`Duration — ${duration} min`}>
              <input
                type="range"
                min={5}
                max={60}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="range-signal w-full"
              />
            </Field>

            <div className="line-hair" />

            <div className="grid grid-cols-2 gap-6">
              <Stat label="Estimated reach" value={`${reachLow}K–${reachHigh}K`} />
              <Stat label="Visibility" value={visibility} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-3">{label}</div>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold text-white">{value}</div>
      <div className="eyebrow mt-1">{label}</div>
    </div>
  );
}
