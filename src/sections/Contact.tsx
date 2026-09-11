import { useState, type FormEvent } from 'react';
import { contact } from '@/data/siteData';
import { MailIcon, PhoneIcon, WhatsAppIcon, SocialIcon } from '@/components/Icons';

const fields = [
  { name: 'name', label: 'Your name', type: 'text', placeholder: 'Jane Smith' },
  { name: 'email', label: 'Work email', type: 'email', placeholder: 'jane@company.com' },
  { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '+91 00000 00000' },
  { name: 'company', label: 'Company', type: 'text', placeholder: 'Your company' },
] as const;

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');

    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Unable to send enquiry.');
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-[var(--color-panel)] py-10 sm:py-14">
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-cyan-500 opacity-[0.1] blur-[120px]" />
      <div className="container-page relative">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <div className="eyebrow mb-3 text-cyan-300 font-bold uppercase tracking-widest">Contact Us</div>
          <h1 className="font-display text-5xl font-black uppercase leading-[0.98] tracking-tight sm:text-7xl text-white drop-shadow-[0_2px_12px_rgba(0,229,255,0.3)]">
            Let&apos;s make an
            <span className="block text-[var(--color-signal-2)] text-glow drop-shadow-[0_0_20px_rgba(0,229,255,0.7)]">impression.</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg font-medium text-white/90 leading-relaxed">
            Tell us about the moment you want to own. We&apos;ll help shape the right aerial experience for it.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_0.85fr] xl:gap-12">
          <form onSubmit={submit} className="rounded-2xl border border-cyan-500/30 bg-[#070d1c] p-6 sm:p-9 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            <div className="grid gap-6 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.name}>
                  <span className="eyebrow mb-2 block text-cyan-200 font-semibold">{field.label}</span>
                  <input
                    required={field.name !== 'company'}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full border-b border-cyan-500/40 bg-white/5 px-3 py-2.5 text-sm text-white font-medium outline-none transition-all placeholder:text-white/40 focus:border-cyan-300 focus:bg-white/10 rounded-t"
                  />
                </label>
              ))}
              <label className="sm:col-span-2">
                <span className="eyebrow mb-2 block text-cyan-200 font-semibold">What are you planning?</span>
                <textarea
                  required
                  name="message"
                  rows={4}
                  placeholder="Event, city, date and what you want people to see."
                  className="w-full resize-none border-b border-cyan-500/40 bg-white/5 px-3 py-2.5 text-sm text-white font-medium outline-none transition-all placeholder:text-white/40 focus:border-cyan-300 focus:bg-white/10 rounded-t"
                />
              </label>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button disabled={status === 'sending'} type="submit" data-cursor="hover" className="rounded-full bg-cyan-400 hover:bg-cyan-300 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-black shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60">
                {status === 'sending' ? 'Sending…' : 'Send enquiry →'}
              </button>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-emerald-300 transition-all hover:bg-emerald-500/20 hover:scale-105 shadow-[0_0_15px_rgba(37,211,102,0.3)]"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
              {status === 'sent' && <span role="status" className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-cyan-300">Thanks — we&apos;ll be in touch.</span>}
              {status === 'error' && <span role="alert" className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-red-300">Couldn&apos;t send your enquiry. Please try again.</span>}
            </div>
          </form>

          <div className="flex flex-col gap-5">
            <div className="grid gap-px overflow-hidden rounded-xl border border-white/20 bg-white/10 sm:grid-cols-3 shadow-lg">
              <a href={`mailto:${contact.email}`} className="bg-[#0b1329] p-4 transition-all hover:bg-white/[0.08] group flex flex-col justify-between">
                <div className="eyebrow mb-2 flex items-center gap-2.5 text-white font-semibold">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/60 bg-red-500/25 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-transform duration-300 group-hover:scale-110">
                    <MailIcon className="h-4 w-4 text-red-400" />
                  </span>
                  <span className="text-white font-bold">Email us</span>
                </div>
                <div className="text-xs font-bold text-white truncate">{contact.email}</div>
              </a>
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="bg-[#0b1329] p-4 transition-all hover:bg-white/[0.08] group flex flex-col justify-between">
                <div className="eyebrow mb-2 flex items-center gap-2.5 text-white font-semibold">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/60 bg-cyan-500/25 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-transform duration-300 group-hover:scale-110">
                    <PhoneIcon className="h-4 w-4 text-cyan-300" />
                  </span>
                  <span className="text-white font-bold">Call us</span>
                </div>
                <div className="text-xs font-bold text-white">{contact.phone}</div>
              </a>
              <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="bg-[#0b1329] p-4 transition-all hover:bg-white/[0.08] group flex flex-col justify-between">
                <div className="eyebrow mb-2 flex items-center gap-2.5 text-emerald-300 font-semibold">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-500/25 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform duration-300 group-hover:scale-110">
                    <WhatsAppIcon className="h-4 w-4 text-emerald-400 fill-current" />
                  </span>
                  <span className="text-emerald-300 font-bold">WhatsApp</span>
                </div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{contact.phone}</span>
                </div>
              </a>
            </div>

            {/* Social media icons implemented directly above the map in a single clean row */}
            <div className="rounded-xl border border-white/20 bg-[#0b1329] p-4 sm:p-5 shadow-lg">
              <div className="eyebrow mb-3 text-cyan-300 font-bold uppercase tracking-widest text-xs">Connect on Social</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {contact.social.map((s) => {
                  const brandBadgeStyles = 
                    s.label === 'Instagram' ? 'border-pink-500/60 bg-pink-500/25 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.4)]' :
                    s.label === 'LinkedIn' ? 'border-sky-400/60 bg-sky-500/25 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)]' :
                    s.label === 'WhatsApp' ? 'border-emerald-400/60 bg-emerald-500/25 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' :
                    'border-red-500/60 bg-red-500/25 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]';

                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      data-cursor="hover"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-white transition-all hover:border-cyan-300 hover:bg-white/20 hover:scale-105 group shadow-md w-full"
                    >
                      <span className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 group-hover:scale-110 ${brandBadgeStyles}`}>
                        <SocialIcon label={s.label} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </span>
                      <span className="font-extrabold truncate">{s.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="relative min-h-64 overflow-hidden rounded-md border border-white/10 bg-[var(--color-void)]">
              <iframe
                title="Connect2Air location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.0893582701565!2d76.60613771107552!3d12.3097689878978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8d5f4a2084adbec9%3A0xf4fcf3522495b959!2sconnect2future!5e0!3m2!1sen!2sin!4v1789022221822!5m2!1sen!2sin"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
