import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { brand, nav } from '@/data/siteData';
import MagneticButton from './MagneticButton';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const onSectionScroll = () => {
      let current = nav.links[0].href;
      for (const link of nav.links) {
        const el = document.querySelector(link.href);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) {
          current = link.href;
        }
      }
      setActive(current);
    };
    onSectionScroll();
    window.addEventListener('scroll', onSectionScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onSectionScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;
    if (open) {
      gsap.set(menuRef.current, { display: 'flex' });
      gsap.fromTo(
        menuRef.current,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.inOut' }
      );
      gsap.fromTo(
        menuRef.current.querySelectorAll('a'),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.15, ease: 'power3.out' }
      );
    } else {
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.45,
        ease: 'power3.inOut',
        onComplete: () => gsap.set(menuRef.current, { display: 'none' }),
      });
    }
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-500 ${
          scrolled ? 'border-b border-white/10 bg-black/70 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
        }`}
        style={{ height: 78 }}
      >
        <div className="container-page flex h-full items-center justify-between">
          <a href="#home" className="flex items-center" data-cursor="hover">
            <img src={brand.logo} alt={brand.name} className="h-25 w-auto max-w-none object-contain" />
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-cursor="hover"
                className={`group relative py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                  active === link.href ? 'text-white' : 'text-white/55 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-[var(--color-signal-2)] transition-all duration-300 ${
                    active === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
              data-cursor="hover"
            >
              <span className={`h-px w-5 bg-white transition-transform duration-300 ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
              <span className={`h-px w-5 bg-white transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`h-px w-5 bg-white transition-transform duration-300 ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        className="fixed inset-0 z-[90] hidden flex-col justify-center gap-6 bg-black px-8 lg:hidden"
        style={{ display: 'none' }}
      >
        {nav.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="font-display text-4xl font-semibold text-white"
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
