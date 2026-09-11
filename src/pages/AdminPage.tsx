import React, { useState, useEffect } from 'react';
import {
  getCMSEnquiries,
  deleteCMSEnquiry,
  getCMSServices,
  addCMSService,
  updateCMSService,
  deleteCMSService,
  getCMSPricing,
  addCMSPricing,
  updateCMSPricing,
  deleteCMSPricing,
  type EnquiryItem,
  type ServiceItem,
  type PricingItem,
} from '@/utils/cmsStorage';
import { brand } from '@/data/siteData';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'enquiries' | 'services' | 'pricing'>('enquiries');

  // Enquiries state
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Services state
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceForm, setServiceForm] = useState({ title: '', category: '', description: '' });

  // Pricing state
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [editingPricing, setEditingPricing] = useState<PricingItem | null>(null);
  const [pricingForm, setPricingForm] = useState({
    step: '',
    price: '',
    duration: '',
    badge: '',
    timeline: '',
    description: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load backend + local CMS state with content deduplication
  const refreshData = async () => {
    // 1. Enquiries
    let localEnquiries = getCMSEnquiries();
    let combinedList: EnquiryItem[] = [];

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const apiEnquiries: EnquiryItem[] = json.data.map((item: any) => ({
            id: item._id || item.id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            company: item.company,
            message: item.message,
            source: item.source || 'Website Form',
            createdAt: item.createdAt || new Date().toISOString(),
          }));
          combinedList = [...apiEnquiries, ...localEnquiries];
        } else {
          combinedList = [...localEnquiries];
        }
      } else {
        combinedList = [...localEnquiries];
      }
    } catch (e) {
      console.log('Backend API offline or unreachable, using local storage state.');
      combinedList = [...localEnquiries];
    }

    // Deduplicate by ID and content signature (name + phone + message)
    const seenIds = new Set<string>();
    const seenSignatures = new Set<string>();
    const deduplicatedEnquiries: EnquiryItem[] = [];

    combinedList.forEach((item) => {
      const contentSignature = `${(item.name || '').trim().toLowerCase()}|${(item.phone || '').trim()}|${(item.message || '').trim().toLowerCase()}`;
      if (!seenIds.has(item.id) && !seenSignatures.has(contentSignature)) {
        seenIds.add(item.id);
        seenSignatures.add(contentSignature);
        deduplicatedEnquiries.push(item);
      }
    });

    // Save deduplicated list back to local storage
    localStorage.setItem('c2a_cms_enquiries', JSON.stringify(deduplicatedEnquiries));
    setEnquiries(deduplicatedEnquiries);

    // 2. Services
    setServices(getCMSServices());

    // 3. Pricing
    setPricing(getCMSPricing());
  };

  useEffect(() => {
    // Auto authenticate if previously logged in this session
    if (sessionStorage.getItem('c2a_admin_authed') === 'true') {
      setIsAuthenticated(true);
    }
    refreshData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple admin passcode check: default is admin or connect2air
    if (pinInput === 'admin' || pinInput === 'connect2air' || pinInput === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('c2a_admin_authed', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Enquiries Actions
  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    deleteCMSEnquiry(id);
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact/${id}`, { method: 'DELETE' });
    } catch (e) {
      // local delete handled
    }
    refreshData();
    showToast('Enquiry deleted successfully.');
  };

  // Services Actions
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.category || !serviceForm.description) {
      alert('Please fill out all service fields.');
      return;
    }
    if (editingService) {
      updateCMSService(editingService.id, serviceForm);
      showToast('Service updated successfully.');
    } else {
      addCMSService(serviceForm);
      showToast('New Service added to the overlapping cards section.');
    }
    setServiceForm({ title: '', category: '', description: '' });
    setEditingService(null);
    refreshData();
  };

  const handleEditService = (service: ServiceItem) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      category: service.category,
      description: service.description,
    });
  };

  const handleDeleteService = (id: string) => {
    if (!confirm('Are you sure you want to delete this service card?')) return;
    deleteCMSService(id);
    refreshData();
    showToast('Service card deleted.');
  };

  // Pricing Actions
  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricingForm.step || !pricingForm.price || !pricingForm.duration) {
      alert('Please fill out Title, Price, and Duration.');
      return;
    }
    if (editingPricing) {
      updateCMSPricing(editingPricing.id, pricingForm);
      showToast('Pricing package updated.');
    } else {
      addCMSPricing(pricingForm);
      showToast('New Pricing package created.');
    }
    setPricingForm({
      step: '',
      price: '',
      duration: '',
      badge: '',
      timeline: '',
      description: '',
    });
    setEditingPricing(null);
    refreshData();
  };

  const handleEditPricing = (pkg: PricingItem) => {
    setEditingPricing(pkg);
    setPricingForm({
      step: pkg.step,
      price: pkg.price,
      duration: pkg.duration,
      badge: pkg.badge,
      timeline: pkg.timeline,
      description: pkg.description,
    });
  };

  const handleDeletePricing = (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing package card?')) return;
    deleteCMSPricing(id);
    refreshData();
    showToast('Pricing package deleted.');
  };

  const filteredEnquiries = enquiries.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.includes(searchQuery) ||
      (e.company && e.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#04070e] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gradient-to-b from-[#0b1329] to-[#070d1c] border border-cyan-500/40 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,229,255,0.2)]">
          <div className="text-center mb-8">
            <img src={brand.logo} alt={brand.name} className="h-12 mx-auto object-contain mb-3" />
            <h1 className="font-display text-2xl font-black uppercase text-white tracking-wide">
              Admin Portal
            </h1>
            <p className="text-xs text-cyan-300 mt-1">Authorized Connect2Air Management Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-cyan-200 mb-2">Enter Admin Security PIN / Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-white/5 border border-cyan-500/30 rounded-xl px-4 py-3 text-white text-center tracking-widest text-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-2 text-center">Incorrect Passcode. Try 'admin' or 'connect2air'.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-sm text-white rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.4)] transition hover:scale-[1.02] active:scale-95"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-8 text-center">
            <a href="/" className="text-xs text-white/50 hover:text-white transition">
              ← Return to Main Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04070e] text-white font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[200] bg-cyan-500 text-black font-bold text-sm px-5 py-3 rounded-xl shadow-[0_0_25px_rgba(0,229,255,0.5)] animate-bounce">
          ✓ {toastMessage}
        </div>
      )}

      {/* Admin Top Navbar */}
      <header className="border-b border-cyan-500/30 bg-[#070d1c] sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={brand.logo} alt={brand.name} className="h-10 w-auto object-contain" />
            <div className="h-6 w-px bg-cyan-500/30" />
            <div>
              <span className="font-display font-black uppercase text-lg text-white tracking-wider">
                Admin Control Console
              </span>
              <span className="block text-[10px] text-cyan-300 font-mono">Live Management & Content CMS</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-xs font-mono font-bold text-white transition"
            >
              View Public Website ↗
            </a>
            <button
              onClick={() => {
                sessionStorage.removeItem('c2a_admin_authed');
                setIsAuthenticated(false);
              }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-lg text-xs font-mono font-bold transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-8">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'enquiries'
                  ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>📩 Form Submissions</span>
              <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px]">{enquiries.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'services'
                  ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>⚡ Overlapping Services</span>
              <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px]">{services.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'pricing'
                  ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>🏷️ Pricing Packages</span>
              <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px]">{pricing.length}</span>
            </button>
          </div>

          <button
            onClick={refreshData}
            className="px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 rounded-lg text-xs font-mono font-bold hover:bg-cyan-500/20 transition flex items-center gap-2"
          >
            <span>🔄 Refresh Sync</span>
          </button>
        </div>

        {/* TAB 1: ENQUIRIES / FORM SUBMISSIONS */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#070d1c] p-6 rounded-2xl border border-cyan-500/30">
              <div>
                <h2 className="text-xl font-extrabold uppercase text-white tracking-tight">Contact Form Enquiries</h2>
                <p className="text-xs text-white/70 mt-1">
                  Submissions received from website forms. Instant notification copy sent to <strong className="text-cyan-300">hr@connect2future.com</strong>.
                </p>
              </div>
              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-cyan-500/30 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {filteredEnquiries.length === 0 ? (
              <div className="text-center py-16 bg-[#070d1c] rounded-2xl border border-white/10">
                <div className="text-4xl mb-3">📭</div>
                <h3 className="text-lg font-bold text-white">No Enquiries Found</h3>
                <p className="text-xs text-white/60 mt-1">Submit a query from the main website or popup modal to see submissions here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-cyan-500/30 bg-[#070d1c] shadow-xl">
                <table className="w-full text-left text-sm text-white">
                  <thead className="bg-white/5 font-mono text-xs uppercase text-cyan-300 border-b border-white/10">
                    <tr>
                      <th className="p-4">Date / Source</th>
                      <th className="p-4">Client Name</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Company / Event</th>
                      <th className="p-4">Requirements / Message</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredEnquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-white/[0.02] transition">
                        <td className="p-4 text-xs font-mono text-white/70">
                          <div>{new Date(enq.createdAt).toLocaleDateString()}</div>
                          <div className="text-[10px] text-cyan-400 mt-0.5">{enq.source || 'Website'}</div>
                        </td>
                        <td className="p-4 font-bold text-white">
                          {enq.name}
                        </td>
                        <td className="p-4 text-xs space-y-1">
                          {enq.email && (
                            <div>
                              <a href={`mailto:${enq.email}`} className="text-cyan-300 hover:underline">
                                ✉ {enq.email}
                              </a>
                            </div>
                          )}
                          <div>
                            <a href={`https://wa.me/${enq.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-mono">
                              📞 {enq.phone}
                            </a>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-medium text-white/90">
                          {enq.company || enq.eventLocation || 'N/A'}
                        </td>
                        <td className="p-4 text-xs text-white/80 max-w-xs leading-relaxed">
                          {enq.message}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteEnquiry(enq.id)}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/40 text-red-300 rounded-lg text-xs font-mono font-bold transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: OVERLAPPING SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-5 bg-[#070d1c] p-6 rounded-2xl border border-cyan-500/30 space-y-5 h-fit">
              <div className="border-b border-white/10 pb-4">
                <span className="eyebrow text-cyan-300 font-bold uppercase text-xs">Dynamic Services CMS</span>
                <h3 className="text-xl font-extrabold uppercase text-white mt-1">
                  {editingService ? 'Edit Service Card' : 'Add New Service Card'}
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  Services dynamically render as sticky 3D overlapping cards below the pricing section on the homepage.
                </p>
              </div>

              <form onSubmit={handleSaveService} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-cyan-200 mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Drone LED advertising"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="w-full bg-white/5 border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-200 mb-1">Category Badge *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Core display, Experiential, Retail"
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="w-full bg-white/5 border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-200 mb-1">Description *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detailed explanation of the aerial service..."
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="w-full bg-white/5 border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-sm text-white rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.4)] transition hover:scale-[1.02]"
                  >
                    {editingService ? 'Update Service Card' : '+ Add Service Card'}
                  </button>

                  {editingService && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingService(null);
                        setServiceForm({ title: '', category: '', description: '' });
                      }}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Active Overlapping Service Cards ({services.length})
                </h3>
              </div>

              {services.map((service, idx) => (
                <div
                  key={service.id}
                  className="bg-[#070d1c] border border-cyan-500/30 rounded-2xl p-6 relative group hover:border-cyan-400 transition-all shadow-md"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-black text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-400/30">
                        {service.number}
                      </span>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/30">
                        {service.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/40 text-cyan-300 rounded-lg text-xs font-mono font-bold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/40 text-red-300 rounded-lg text-xs font-mono font-bold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <h4 className="font-display text-xl font-extrabold uppercase text-white mt-2">
                    {service.title}
                  </h4>
                  <p className="mt-2 text-sm text-white/90 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRICING PACKAGES MANAGEMENT */}
        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-5 bg-[#070d1c] p-6 rounded-2xl border border-cyan-500/30 space-y-5 h-fit">
              <div className="border-b border-white/10 pb-4">
                <span className="eyebrow text-cyan-300 font-bold uppercase text-xs">Pricing Flight Packages</span>
                <h3 className="text-xl font-extrabold uppercase text-white mt-1">
                  {editingPricing ? 'Edit Pricing Card' : 'Add Pricing Card'}
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  Edit or add flight pricing cards rendered on the homepage under Services & Packages.
                </p>
              </div>

              <form onSubmit={handleSavePricing} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-cyan-200 mb-1">Package Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ONE FLY"
                      value={pricingForm.step}
                      onChange={(e) => setPricingForm({ ...pricingForm, step: e.target.value })}
                      className="w-full bg-white/5 border border-cyan-500/30 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-cyan-200 mb-1">Price *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹15,000"
                      value={pricingForm.price}
                      onChange={(e) => setPricingForm({ ...pricingForm, price: e.target.value })}
                      className="w-full bg-white/5 border border-cyan-500/30 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-cyan-200 mb-1">Duration *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10 MINS"
                      value={pricingForm.duration}
                      onChange={(e) => setPricingForm({ ...pricingForm, duration: e.target.value })}
                      className="w-full bg-white/5 border border-cyan-500/30 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-cyan-200 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Flight"
                      value={pricingForm.badge}
                      onChange={(e) => setPricingForm({ ...pricingForm, badge: e.target.value })}
                      className="w-full bg-white/5 border border-cyan-500/30 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-200 mb-1">Timeline Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Single Display / 2 Sessions"
                    value={pricingForm.timeline}
                    onChange={(e) => setPricingForm({ ...pricingForm, timeline: e.target.value })}
                    className="w-full bg-white/5 border border-cyan-500/30 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-200 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Short description of flights and intervals..."
                    value={pricingForm.description}
                    onChange={(e) => setPricingForm({ ...pricingForm, description: e.target.value })}
                    className="w-full bg-white/5 border border-cyan-500/30 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-sm text-white rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.4)] transition hover:scale-[1.02]"
                  >
                    {editingPricing ? 'Update Pricing Card' : '+ Add Pricing Card'}
                  </button>

                  {editingPricing && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPricing(null);
                        setPricingForm({
                          step: '',
                          price: '',
                          duration: '',
                          badge: '',
                          timeline: '',
                          description: '',
                        });
                      }}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
              {pricing.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-[#070d1c] border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-400 transition shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                        {pkg.badge || 'Flight Package'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditPricing(pkg)}
                          className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 rounded text-xs font-mono font-bold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePricing(pkg.id)}
                          className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded text-xs font-mono font-bold transition"
                        >
                          Del
                        </button>
                      </div>
                    </div>

                    <h4 className="font-display text-xl font-black uppercase text-white">
                      {pkg.step}
                    </h4>

                    <div className="font-display text-2xl font-black text-cyan-300 mt-1">
                      {pkg.price}
                    </div>

                    <div className="text-xs font-mono font-bold text-white/90 mt-2">
                      ⏱ {pkg.duration}
                    </div>

                    <p className="text-xs text-white/80 mt-3 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono text-white/60 uppercase">
                    {pkg.timeline}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
