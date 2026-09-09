import { brand, nav, contact, services } from '@/data/siteData';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[var(--color-void)] pb-10 pt-16 sm:pt-20">
      <div className="container-page">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src={brand.logo} alt={brand.name} className="h-8 w-auto object-contain" />
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
              <li>{contact.email}</li>
              <li>{contact.phone}</li>
              <li>{contact.location}</li>
            </ul>
            <div className="mt-5 flex gap-4">
              {contact.social.map((s) => (
                <a key={s.label} href={s.href} className="text-sm text-[var(--color-ink-dim)] transition-colors hover:text-white">
                  {s.label}
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
