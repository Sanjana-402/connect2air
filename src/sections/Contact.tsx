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
    <section id="contact" className="relative overflow-hidden bg-[var(--color-panel)] py-16 sm:py-24">
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[var(--color-signal)] opacity-[0.07] blur-[120px]" />
      <div className="container-page relative">
        <div className="mb-8 max-w-2xl sm:mb-12">
          <div className="eyebrow mb-5">Contact</div>
          <h1 className="font-display text-5xl font-bold uppercase leading-[0.98] tracking-tight sm:text-7xl">
            Let&apos;s make an
            <span className="block text-[var(--color-signal-2)]">impression.</span>
          </h1>
          <p className="mt-6 max-w-lg text-[var(--color-ink-dim)]">
            Tell us about the moment you want to own. We&apos;ll help shape the right aerial experience for it.
          </p>
        </div>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_0.82fr] xl:gap-16">
          <form onSubmit={submit} className="rounded-md border border-white/10 bg-[var(--color-void)] p-6 sm:p-9">
            <div className="grid gap-6 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.name}>
                  <span className="eyebrow mb-3 block">{field.label}</span>
                  <input
                    required={field.name !== 'company'}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[var(--color-signal-2)]"
                  />
                </label>
              ))}
              <label className="sm:col-span-2">
                <span className="eyebrow mb-3 block">What are you planning?</span>
                <textarea
                  required
                  name="message"
                  rows={4}
                  placeholder="Event, city, date and what you want people to see."
                  className="w-full resize-none border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[var(--color-signal-2)]"
                />
              </label>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <button disabled={status === 'sending'} type="submit" data-cursor="hover" className="rounded-full bg-white px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.15em] text-black disabled:cursor-not-allowed disabled:opacity-60">
                {status === 'sending' ? 'Sending…' : 'Send enquiry →'}
              </button>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:border-[#25D366]"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
              {status === 'sent' && <span role="status" className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-signal-2)]">Thanks — we&apos;ll be in touch.</span>}
              {status === 'error' && <span role="alert" className="font-mono text-[11px] uppercase tracking-[0.12em] text-red-300">Couldn&apos;t send your enquiry. Please try again.</span>}
            </div>
          </form>

          <div className="flex flex-col gap-5">
            <div className="grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-3">
              <a href={`mailto:${contact.email}`} className="bg-[var(--color-void)] p-5 transition-colors hover:bg-white/[0.04]">
                <div className="eyebrow mb-2 flex items-center gap-2">
                  <MailIcon className="h-3.5 w-3.5 text-[var(--color-signal-2)]" />
                  <span>Email us</span>
                </div>
                <div className="text-xs text-white truncate">{contact.email}</div>
              </a>
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="bg-[var(--color-void)] p-5 transition-colors hover:bg-white/[0.04]">
                <div className="eyebrow mb-2 flex items-center gap-2">
                  <PhoneIcon className="h-3.5 w-3.5 text-[var(--color-signal-2)]" />
                  <span>Call us</span>
                </div>
                <div className="text-xs text-white">{contact.phone}</div>
              </a>
              <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="bg-[var(--color-void)] p-5 transition-colors hover:bg-white/[0.04]">
                <div className="eyebrow mb-2 flex items-center gap-2">
                  <WhatsAppIcon className="h-3.5 w-3.5 fill-current text-[#25D366]" />
                  <span>WhatsApp</span>
                </div>
                <div className="text-xs text-white flex items-center gap-1">
                  <span>{contact.phone}</span>
                </div>
              </a>
            </div>

            <div className="rounded-md border border-white/10 bg-[var(--color-void)] p-5">
              <div className="eyebrow mb-3">Connect on Social</div>
              <div className="flex flex-wrap gap-3">
                {contact.social.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-mono uppercase tracking-wider text-white/80 transition-colors hover:border-[var(--color-signal-2)] hover:text-white"
                  >
                    <SocialIcon label={s.label} className="h-4 w-4" />
                    <span>{s.label}</span>
                  </a>
                ))}
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
