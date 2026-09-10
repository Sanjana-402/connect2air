import { brand, nav, contact, services } from '@/data/siteData';
import { SocialIcon } from '@/components/Icons';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[var(--color-void)] pb-8 pt-10 sm:pt-14">
      <div className="container-page">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src={brand.logo} alt={brand.name} className="h-14 w-auto object-contain" />
            <p className="eyebrow mt-5">{brand.tagline}</p>
          </div>

          <div>
            <div className="eyebrow mb-4">Navigation</div>
            <ul className="flex flex-col gap-2.5">
              {nav.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-[var(--color-ink-dim)] transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-4">Services</div>
            <ul className="flex flex-col gap-2.5">
              {services.slice(0, 5).map((s) => (
                <li key={s.number} className="text-sm text-[var(--color-ink-dim)]">
                  {s.title}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-4">Contact</div>
            <ul className="flex flex-col gap-2.5 text-sm text-[var(--color-ink-dim)]">
              <li>
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="transition-colors hover:text-white">
                  {contact.phone}
                </a>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              {contact.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  data-cursor="hover"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-signal-2)] hover:text-white"
                >
                  <SocialIcon label={s.label} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[11px] text-white/35">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </span>
          <div className="flex gap-6">
            <a href="#" className="font-mono text-[11px] text-white/35 transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="font-mono text-[11px] text-white/35 transition-colors hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
