import { useState } from 'react';
import { campaigns } from '@/data/siteData';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import concertImg from '@/images/CONECRT.png';
import sportsImg from '@/images/SPORTS.png';
import festivalImg from '@/images/FESTIVALS.png';
import brandLaunchImg from '@/images/BRANDLAUNCH.png';
import realEstateImg from '@/images/REALESTATE.png';
import corporateEventsImg from '@/images/CORPORATE EVENTS.png';
import storeOpeningImg from '@/images/STORE OPENING.png';
import publicEventsImg from '@/images/publicevents.png';

const imageMap: Record<string, string> = {
  Concerts: concertImg,
  Sports: sportsImg,
  Festivals: festivalImg,
  'Brand launches': brandLaunchImg,
  'Real estate': realEstateImg,
  Corporate: corporateEventsImg,
  'Store openings': storeOpeningImg,
  'City events': publicEventsImg,
};

export default function Campaigns() {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.06 });
  const [flippedMap, setFlippedMap] = useState<Record<number, boolean>>({});

  const toggleFlip = (idx: number) => {
    setFlippedMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <section id="experiences" className="relative bg-[var(--color-void)] py-10 sm:py-14">
      <div className="container-page">
        <div className="mb-6 sm:mb-10">
          <div className="eyebrow mb-4 text-pink-300 font-bold uppercase tracking-widest">Experiences</div>
          <h2 className="font-display max-w-xl text-4xl font-black uppercase leading-[1.02] tracking-tight sm:text-6xl text-white drop-shadow-[0_2px_12px_rgba(255,42,85,0.3)]">
            Where your
            <br />
            <span className="text-[var(--color-signal-2)] text-glow">brand takes off.</span>
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 lg:gap-8">
          {campaigns.map((c, idx) => {
            const imgSrc = imageMap[c.category];
            const numberStr = String(idx + 1).padStart(2, '0');
            const isFlipped = !!flippedMap[idx];

            return (
              <div
                key={c.category}
                data-reveal
                data-cursor="hover"
                onClick={() => toggleFlip(idx)}
                className="group relative aspect-[4/5] w-full cursor-pointer [perspective:1000px]"
              >
                {/* 3D Inner Wrapper */}
                <div
                  className={`relative h-full w-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] shadow-xl shadow-black/60 group-hover:[transform:rotateY(180deg)] ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  
                  {/* FRONT FACE */}
                  <div className="absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/12 bg-neutral-900 p-6 [backface-visibility:hidden]">
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={c.label}
                        className="absolute inset-0 h-full w-full object-cover object-center opacity-65 transition-all duration-700 ease-out group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/20" />
                    
                    {/* Top index badge + flip hint */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold tracking-wider text-white/90 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                        {numberStr}
                      </span>
                      <span className="font-mono text-[10px] text-pink-300/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-pink-500/30 flex items-center gap-1">
                        Tap / Hover <span>↻</span>
                      </span>
                    </div>

                    {/* Bottom title & line indicator */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="h-0.5 w-6 bg-[var(--color-signal-2)]" />
                      </div>
                      <div className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-white">
                        {c.label}
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div className="absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-signal-2)]/70 bg-gradient-to-b from-[#250914] via-[#1a060e] to-[#0c0307] p-6 shadow-[0_0_30px_rgba(255,42,85,0.25)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-pink-500/20 blur-2xl" />
                    
                    <div>
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-pink-300">
                          {numberStr} • {c.category}
                        </span>
                        <span className="text-xs text-white/60">Tap to flip ↺</span>
                      </div>
                      
                      <h3 className="font-display text-lg font-extrabold uppercase text-white mt-4 leading-tight">
                        {c.label}
                      </h3>
                      
                      <p className="text-xs text-white/85 mt-3 leading-relaxed font-medium">
                        {c.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-pink-300 font-bold uppercase tracking-wider">
                      <span>Drone LED Screen</span>
                      <span className="text-white/50">Connect2Air</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
