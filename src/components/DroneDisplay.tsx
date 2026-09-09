import { useMemo, type CSSProperties } from 'react';

function Drone({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 90" className={className} style={style} fill="none" aria-hidden="true">
      <g className="drone-rotor drone-rotor--a" style={{ transformOrigin: '18px 22px' }}>
        <ellipse cx="18" cy="22" rx="16" ry="4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
      </g>
      <g className="drone-rotor drone-rotor--b" style={{ transformOrigin: '102px 22px' }}>
        <ellipse cx="102" cy="22" rx="16" ry="4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
      </g>
      <line x1="18" y1="22" x2="46" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <line x1="102" y1="22" x2="74" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <rect x="46" y="38" width="28" height="16" rx="5" fill="#111114" stroke="rgba(255,255,255,0.25)" />
      <circle cx="60" cy="46" r="3.5" fill="#ff1493" className="drone-light" />
      <circle cx="18" cy="22" r="2.5" fill="rgba(255,255,255,0.6)" />
      <circle cx="102" cy="22" r="2.5" fill="rgba(255,255,255,0.6)" />
    </svg>
  );
}

/** Deterministic pseudo-random pixel brightness grid, memoised once. */
function usePixelGrid(cols: number, rows: number) {
  return useMemo(() => {
    const cells: { on: boolean; delay: number; signal: boolean }[] = [];
    for (let i = 0; i < cols * rows; i++) {
      cells.push({
        on: Math.random() > 0.35,
        delay: Math.random() * 3,
        signal: Math.random() > 0.94,
      });
    }
    return cells;
  }, [cols, rows]);
}

export default function DroneDisplay({ className = '' }: { className?: string }) {
  const cols = 22;
  const rows = 8;
  const cells = usePixelGrid(cols, rows);

  return (
    <div className={`relative ${className}`} data-cursor="explore" data-cursor-label="Explore">
      {/* cables from drones to display frame */}
      <svg viewBox="0 0 600 60" className="absolute -top-14 left-0 h-14 w-full" aria-hidden="true">
        <line x1="60" y1="0" x2="130" y2="58" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <line x1="300" y1="0" x2="300" y2="58" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <line x1="540" y1="0" x2="470" y2="58" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      </svg>

      <div className="pointer-events-none absolute -top-16 left-[4%] w-14 sm:w-20">
        <Drone className="w-full drone-float" />
      </div>
      <div className="pointer-events-none absolute -top-20 left-1/2 w-16 -translate-x-1/2 sm:w-24">
        <Drone className="w-full drone-float" style={{ animationDelay: '0.6s' }} />
      </div>
      <div className="pointer-events-none absolute -top-16 right-[4%] w-14 sm:w-20">
        <Drone className="w-full drone-float" style={{ animationDelay: '1.1s' }} />
      </div>

      {/* the LED display frame */}
      <div className="drone-panel-float rounded-md border border-white/10 bg-[#0a0a0c] p-1.5 shadow-[0_0_120px_-20px_rgba(242,10,131,0.35)] sm:p-2">
        <div
          className="grid gap-[2px] overflow-hidden rounded-sm bg-black p-2"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {cells.map((cell, i) => (
            <span
              key={i}
              className="aspect-square rounded-[1px]"
              style={{
                background: cell.signal ? '#ff1493' : cell.on ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.06)',
                animation: cell.on ? `ledFlicker 2.6s ease-in-out ${cell.delay}s infinite` : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
