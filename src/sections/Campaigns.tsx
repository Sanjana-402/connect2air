import { campaigns } from '@/data/siteData';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const gradients = [
  'from-[#1c0b16] to-[#050505]',
  'from-[#0b1620] to-[#050505]',
  'from-[#1a0f1c] to-[#050505]',
  'from-[#0f1a14] to-[#050505]',
  'from-[#1c1206] to-[#050505]',
  'from-[#0b0f1c] to-[#050505]',
  'from-[#161c0b] to-[#050505]',
  'from-[#1c0b0b] to-[#050505]',
];

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

        <div ref={ref} className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {campaigns.map((c, i) => (
            <div
              key={c.category}
              data-reveal
              data-cursor="hover"
              className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden bg-gradient-to-br p-6 ${gradients[i % gradients.length]}`}
            >
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/25" />
              <div className="absolute inset-0 scale-100 opacity-30 transition-transform duration-700 ease-out group-hover:scale-110" style={{
                backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,20,147,0.25), transparent 55%)',
              }} />
              <div className="relative">
                <span className="block h-0 w-8 bg-[var(--color-signal-2)] transition-[width,height] duration-500 group-hover:h-px group-hover:w-10" />
                <div className="mt-4 translate-y-1 font-display text-lg font-bold uppercase leading-tight tracking-tight text-white transition-transform duration-500 group-hover:-translate-y-0">
                  {c.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
