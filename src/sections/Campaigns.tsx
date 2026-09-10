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

  return (
    <section id="experiences" className="relative bg-[var(--color-void)] py-28 sm:py-36">
      <div className="container-page">
        <div className="mb-14 sm:mb-20">
          <div className="eyebrow mb-5">Experiences</div>
          <h2 className="font-display max-w-xl text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-6xl">
            Where your
            <br />
            brand takes off.
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 lg:gap-8">
          {campaigns.map((c, idx) => {
            const imgSrc = imageMap[c.category];
            const numberStr = String(idx + 1).padStart(2, '0');
            return (
              <div
                key={c.category}
                data-reveal
                data-cursor="hover"
                className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl border border-white/12 bg-neutral-900 p-6 transition-all duration-500 hover:border-[var(--color-signal-2)]/60 hover:shadow-2xl hover:shadow-[var(--color-signal-2)]/10"
              >
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={c.label}
                    className="absolute inset-0 h-full w-full object-cover object-center opacity-65 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-85"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/20 transition-opacity duration-500 group-hover:from-black/95 group-hover:via-black/40 group-hover:to-transparent" />
                
                {/* Top index badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold tracking-wider text-white/80 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                    {numberStr}
                  </span>
                </div>

                {/* Bottom title & line indicator */}
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-0.5 w-6 bg-[var(--color-signal-2)] transition-all duration-500 group-hover:w-10" />
                  </div>
                  <div className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-white transition-transform duration-300 group-hover:-translate-y-1">
                    {c.label}
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
