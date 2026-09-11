import { brand, nav, contact, services } from '@/data/siteData';
import { SocialIcon } from '@/components/Icons';

export default function Footer() {
  return (
    <footer className="relative border-t border-cyan-500/20 bg-[var(--color-void)] pb-8 pt-8 sm:pt-10">
      <div className="container-page">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src={brand.logo} alt={brand.name} className="h-14 w-auto object-contain" />
            <p className="eyebrow mt-1 text-cyan-300 font-bold uppercase tracking-wider text-xs drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]">{brand.tagline}</p>
          </div>

          <div>
            <div className="eyebrow mb-3 text-cyan-300 font-bold uppercase tracking-widest text-xs">Navigation</div>
            <ul className="flex flex-col gap-2">
              {nav.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm font-medium text-white/90 transition-colors hover:text-cyan-300">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-3 text-cyan-300 font-bold uppercase tracking-widest text-xs">Services</div>
            <ul className="flex flex-col gap-2">
              {services.slice(0, 5).map((s) => (
                <li key={s.number} className="text-sm font-medium text-white/80">
                  {s.title}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-3 text-cyan-300 font-bold uppercase tracking-widest text-xs">Contact</div>
            <ul className="flex flex-col gap-2 text-sm font-medium text-white/90">
              <li>
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-cyan-300">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="transition-colors hover:text-cyan-300">
                  {contact.phone}
                </a>
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-3">
              {contact.social.map((s) => {
                const brandStyles = 
                  s.label === 'Instagram' ? 'border-pink-500/60 bg-pink-500/25 text-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.3)] hover:scale-110' :
                  s.label === 'LinkedIn' ? 'border-sky-400/60 bg-sky-500/25 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.3)] hover:scale-110' :
                  s.label === 'WhatsApp' ? 'border-emerald-400/60 bg-emerald-500/25 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:scale-110' :
                  'border-red-500/60 bg-red-500/25 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)] hover:scale-110';

                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    data-cursor="hover"
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${brandStyles}`}
                  >
                    <SocialIcon label={s.label} className="h-4.5 w-4.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[11px] font-semibold text-white/60">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </span>
          <div className="flex gap-6">
            <a href="#" className="font-mono text-[11px] font-semibold text-white/60 transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="font-mono text-[11px] font-semibold text-white/60 transition-colors hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
