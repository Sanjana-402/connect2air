import React, { useState, useEffect } from 'react';
import { contact } from '@/data/siteData';
import { saveCMSEnquiry } from '@/utils/cmsStorage';

export const ContactModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventLocation: '',
    message: ''
  });

  useEffect(() => {
    // Show modal shortly after opening site if not previously closed in this session
    const hasClosed = sessionStorage.getItem('c2a_contact_modal_closed');
    if (!hasClosed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('c2a_contact_modal_closed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim() || 'N/A',
      phone: formData.phone.trim(),
      company: formData.eventLocation.trim() || 'N/A',
      message: formData.message.trim() || 'Quick Enquiry from pop-up modal',
      source: 'Quick Enquiry Modal',
    };

    // Send to backend API and trigger email notification
    let backendId = undefined;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const resJson = await res.json();
        backendId = resJson.id;
      }
    } catch (err) {
      console.log('Backend API offline, saving to local store');
    }

    // Save with unique backend ID or fallback
    saveCMSEnquiry(payload, backendId);

    setFormData({ name: '', email: '', phone: '', eventLocation: '', message: '' });
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
      setSubmitted(false);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn">
      {/* Modal Content Box */}
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-[#1c0811] to-[#0a0305] border border-rose-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,42,85,0.25)] transition-all duration-300 transform scale-100"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-pink-400/80 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full border border-pink-500/20 transition-all duration-200 group hover:rotate-90"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-pink-500/20 border border-pink-400 text-pink-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,77,109,0.4)]">
              <svg className="w-10 h-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-wide">Message Received!</h3>
            <p className="text-white/90 text-sm">Our aerial display team will reach out to you immediately.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6 pr-6">
              <span className="inline-block px-3 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold rounded-full uppercase tracking-wider mb-2 shadow-[0_0_10px_rgba(255,42,85,0.2)]">
                Quick Enquiry
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,42,85,0.3)]">
                Launch Your Aerial Display
              </h3>
              <p className="text-white/80 text-xs mt-1">
                Tell us about your event and get instant customized flight plans.
              </p>
            </div>

            {/* Quick Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-pink-200 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-rose-500/30 rounded-lg px-3.5 py-2.5 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-pink-200 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-rose-500/30 rounded-lg px-3.5 py-2.5 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-pink-200 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-rose-500/30 rounded-lg px-3.5 py-2.5 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-200 mb-1">Event Location & Date</label>
                <input
                  type="text"
                  placeholder="City, State / Target Date"
                  value={formData.eventLocation}
                  onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                  className="w-full bg-white/5 border border-rose-500/30 rounded-lg px-3.5 py-2.5 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-200 mb-1">Brief Requirements</label>
                <textarea
                  rows={2}
                  placeholder="Brand launch, wedding, festival aerial advertising..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-rose-500/30 rounded-lg px-3.5 py-2 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition resize-none"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Chat instantly on WhatsApp
                </a>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-sm rounded-lg shadow-[0_0_20px_rgba(255,42,85,0.4)] transition hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>Submit Inquiry</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
