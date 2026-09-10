import { about } from '@/data/siteData';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function About() {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.08 });

  return (
    <section id="about" className="relative bg-[var(--color-void)] py-28 sm:py-36 border-t border-white/10">
      <div className="container-page">
        <div ref={ref} className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Left Column: Headline & Parent Company Venture Callout */}
          <div className="lg:col-span-6">
            <div data-reveal className="eyebrow mb-5">{about.eyebrow}</div>
            <h2 data-reveal className="font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-6xl text-white">
              Pioneering aerial
              <br />
              <span className="text-[var(--color-signal-2)] text-glow">display technology.</span>
            </h2>
            
            <p data-reveal className="mt-6 text-lg leading-relaxed text-[var(--color-ink-dim)]">
              {about.description}
            </p>

            {/* Venture Callout Card with Connect2Future Button */}
            <div data-reveal className="mt-8 rounded-2xl border border-white/15 bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:border-[var(--color-signal-2)]/50">
              <div className="eyebrow mb-2 text-[var(--color-signal-2)]">Strategic Venture</div>
              <div className="font-display text-xl font-bold uppercase text-white sm:text-2xl">
                Connect2Air is a venture of <span className="text-[var(--color-signal-2)]">{about.parentCompany}</span>.
              </div>
              <p className="mt-2 text-xs text-[var(--color-ink-dim)]">
                Backed by Connect2Future's innovation and technological expertise in high-impact media solutions.
              </p>
              <div className="mt-5">
                <a
                  href={about.parentLink}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-signal-2)] bg-[var(--color-signal-2)]/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[var(--color-signal-2)] hover:shadow-lg hover:shadow-[var(--color-signal-2)]/25"
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
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-500 hover:border-[var(--color-signal-2)]/50 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--color-signal-2)]">0{i + 1}</span>
                  <span className="h-2 w-2 rounded-full bg-white/20 group-hover:bg-[var(--color-signal-2)] transition-colors" />
                </div>
                <h3 className="font-display mt-4 text-xl font-bold uppercase text-white group-hover:text-[var(--color-signal-2)] transition-colors">
                  {h.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-ink-dim)]">
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
