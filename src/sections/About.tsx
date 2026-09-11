import { about } from '@/data/siteData';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function About() {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.08 });

  return (
    <section id="about" className="relative bg-[var(--color-void)] py-10 sm:py-14 border-t border-cyan-500/20">
      <div className="container-page">
        <div ref={ref} className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left Column: Headline & Parent Company Venture Callout */}
          <div className="lg:col-span-6">
            <div data-reveal className="eyebrow mb-4 text-cyan-300 font-bold uppercase tracking-widest">{about.eyebrow}</div>
            <h2 data-reveal className="font-display text-4xl font-black uppercase leading-[1.02] tracking-tight sm:text-6xl text-white drop-shadow-[0_2px_12px_rgba(0,229,255,0.3)]">
              Pioneering
              <br />
              <span className="text-[var(--color-signal-2)] text-glow">aviation technology.</span>
            </h2>
            
            <p data-reveal className="mt-5 text-lg font-medium leading-relaxed text-white/90">
              {about.description}
            </p>

            {/* Venture Callout Card with Connect2Future Button */}
            <div data-reveal className="mt-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0d172e] to-[#040814] p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-cyan-400">
              <div className="eyebrow mb-2 text-cyan-300 font-bold">Strategic Venture</div>
              <div className="font-display text-xl font-extrabold uppercase text-white sm:text-2xl">
                Connect2Air is a venture of <span className="text-[var(--color-signal-2)] text-glow">{about.parentCompany}</span>.
              </div>
              <p className="mt-2 text-xs font-medium text-white/80 leading-relaxed">
                Backed by Connect2Future's innovation and technological expertise in high-impact media solutions.
              </p>
              <div className="mt-5">
                <a
                  href={about.parentLink}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400 bg-cyan-500/20 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:scale-105"
                >
                  <span>Visit {about.parentCompany}</span>
                  <span className="text-sm font-bold">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Highlights Cards */}
          <div data-reveal className="lg:col-span-6 flex flex-col gap-4">
            {about.highlights.map((h, i) => (
              <div
                key={h.title}
                className="group relative overflow-hidden rounded-xl border border-cyan-500/30 bg-[#070d1c] p-6 shadow-md transition-all duration-500 hover:border-cyan-400 hover:bg-white/[0.06] hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">0{i + 1}</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400/30 group-hover:bg-cyan-400 transition-colors shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
                </div>
                <h3 className="font-display mt-3 text-xl font-extrabold uppercase text-white group-hover:text-cyan-300 transition-colors">
                  {h.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-white/90 leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
