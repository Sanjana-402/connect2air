import React from 'react';

export function WhatsAppIcon({ className = "h-4 w-4 fill-current text-[#25D366]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12.04 2a9.78 9.78 0 0 0-8.27 15l-1.22 4.46 4.57-1.2A9.8 9.8 0 1 0 12.04 2Zm0 17.8a8.05 8.05 0 0 1-4.1-1.12l-.3-.18-2.71.71.73-2.64-.2-.32a8.03 8.03 0 1 1 6.58 3.55Zm4.4-6.02c-.24-.12-1.4-.7-1.62-.78-.22-.08-.39-.12-.55.12-.16.23-.63.78-.77.94-.14.16-.29.18-.53.06a6.5 6.5 0 0 1-1.9-1.17 7.15 7.15 0 0 1-1.32-1.64c-.14-.24-.02-.37.1-.49l.37-.43c.12-.14.16-.24.24-.4.08-.15.04-.3-.02-.43-.06-.12-.55-1.32-.75-1.8-.2-.47-.4-.4-.55-.4h-.47c-.16 0-.42.06-.64.3-.22.23-.84.82-.84 2s.86 2.33.98 2.5c.12.15 1.7 2.6 4.12 3.65.57.25 1.02.4 1.37.52.58.18 1.1.16 1.52.1.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.27Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-4 w-4 fill-none stroke-current" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
    </svg>
  );
}

export function LinkedInIcon({ className = "h-4 w-4 fill-current" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M5.35 3.5A1.85 1.85 0 1 1 5.3 7.2a1.85 1.85 0 0 1 .05-3.7ZM3.8 8.8h3v11.4h-3V8.8Zm4.9 0h2.9v1.56h.04c.4-.77 1.4-1.58 2.9-1.58 3.1 0 3.66 2.04 3.66 4.7v6.78h-3v-6.01c0-1.44-.02-3.28-2-3.28-2 0-2.3 1.56-2.3 3.18v6.11h-3V8.8Z" />
    </svg>
  );
}

export function MailIcon({ className = "h-4 w-4 fill-none stroke-current" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function PhoneIcon({ className = "h-4 w-4 fill-none stroke-current" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function SocialIcon({ label, className }: { label: string; className?: string }) {
  if (label === 'Instagram') return <InstagramIcon className={className ?? "h-4 w-4 fill-none stroke-current"} />;
  if (label === 'LinkedIn') return <LinkedInIcon className={className ?? "h-4 w-4 fill-current"} />;
  if (label === 'WhatsApp') return <WhatsAppIcon className={className ?? "h-4 w-4 fill-current text-[#25D366]"} />;
  if (label === 'Email') return <MailIcon className={className ?? "h-4 w-4 fill-none stroke-current"} />;
  return null;
}
