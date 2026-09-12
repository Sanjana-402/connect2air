import { services as defaultServices } from '@/data/siteData';

export interface ServiceItem {
  id: string;
  _id?: string;
  number: string;
  title: string;
  category: string;
  description: string;
}

export interface PricingItem {
  id: string;
  _id?: string;
  step: string;
  price: string;
  duration: string;
  badge: string;
  timeline: string;
  description: string;
}

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  eventLocation?: string;
  message: string;
  source?: string;
  createdAt: string;
  status?: 'new' | 'reviewed';
}

export interface MediaItem {
  id: string;
  _id?: string; // MongoDB ObjectId (returned from API)
  title: string;
  tagline?: string;
  description?: string;
  type: 'video' | 'image';
  url: string;
  aspectRatio: 'portrait';
  size: 'reel' | 'post' | 'square'; // reel=9:16, post=4:5, square=1:1
  createdAt: string;
}

const STORAGE_KEYS = {
  SERVICES: 'c2a_cms_services',
  PRICING: 'c2a_cms_pricing',
  ENQUIRIES: 'c2a_cms_enquiries',
};

const DEFAULT_PRICING: PricingItem[] = [
  {
    id: 'p1',
    step: 'ONE FLY',
    price: '₹15,000',
    duration: '10 MINS',
    badge: '1 Flight',
    timeline: 'Single Display',
    description: '1 Flight duration of 10 minutes over the venue crowd.',
  },
  {
    id: 'p2',
    step: 'TWO FLIES',
    price: '₹30,000',
    duration: '20 MINS',
    badge: '2 Flights',
    timeline: '2 Sessions',
    description: '2 Flights totaling 20 minutes with 1 hour interval.',
  },
  {
    id: 'p3',
    step: 'THREE FLIES',
    price: '₹45,000',
    duration: '30 MINS',
    badge: '3 Flights',
    timeline: '3 Sessions',
    description: '3 Flights totaling 30 minutes with 1 hour intervals.',
  },
];

// Helper to notify all UI components when CMS data changes
const notifyCMSUpdate = () => {
  window.dispatchEvent(new Event('c2a_cms_updated'));
};

// API base — uses Vite dev proxy (/api → http://127.0.0.1:5001). Set VITE_API_URL for production.
const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

// Safely parse JSON responses and throw clear error if server returned HTML
async function parseJsonResponse(res: Response) {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Backend server unreachable or returned non-JSON (HTTP ${res.status}). Is backend running on http://127.0.0.1:5001?`);
  }
  return res.json();
}

// Normalise a raw API response item to MediaItem shape
function normaliseMedia(raw: any): MediaItem {
  return {
    id: raw._id || raw.id,
    _id: raw._id,
    title: raw.title,
    tagline: raw.tagline || '',
    description: raw.description || '',
    type: raw.type,
    url: raw.url,
    aspectRatio: 'portrait',
    size: raw.size || 'reel', // default to reel if missing
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

// GET all media from backend
export async function getCMSMediaAsync(): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/media`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await parseJsonResponse(res);
    if (json.success && Array.isArray(json.data)) {
      return json.data.map(normaliseMedia);
    }
    return [];
  } catch (err) {
    console.warn('getCMSMediaAsync failed, returning empty list:', err);
    return [];
  }
}

// POST — upload file (FormData) or save URL-only entry
export async function uploadCMSMedia(formData: FormData): Promise<MediaItem | null> {
  try {
    const res = await fetch(`${API_BASE}/api/media`, {
      method: 'POST',
      body: formData, // multipart/form-data — do NOT set Content-Type manually
    });
    const json = await parseJsonResponse(res);
    if (!res.ok || !json.success) throw new Error(json.message || 'Upload failed');
    notifyCMSUpdate();
    return normaliseMedia(json.data);
  } catch (err) {
    console.error('uploadCMSMedia failed:', err);
    throw err;
  }
}

// PATCH — update metadata (title, tagline, description) only
export async function updateCMSMediaMeta(
  id: string,
  data: Partial<Pick<MediaItem, 'title' | 'tagline' | 'description'>>
): Promise<MediaItem | null> {
  try {
    const res = await fetch(`${API_BASE}/api/media/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await parseJsonResponse(res);
    if (!res.ok || !json.success) throw new Error(json.message || 'Update failed');
    notifyCMSUpdate();
    return normaliseMedia(json.data);
  } catch (err) {
    console.error('updateCMSMediaMeta failed:', err);
    throw err;
  }
}

// DELETE — remove from Cloudinary + MongoDB
export async function deleteCMSMediaItem(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/api/media/${id}`, { method: 'DELETE' });
    const json = await parseJsonResponse(res);
    if (!res.ok || !json.success) throw new Error(json.message || 'Delete failed');
    notifyCMSUpdate();
  } catch (err) {
    console.error('deleteCMSMediaItem failed:', err);
    throw err;
  }
}

// Legacy sync compat shim (returns empty — all reads are now async)
export const getCMSMedia = (): MediaItem[] => [];


// --- SERVICES CRUD ---
export async function getCMSServicesAsync(): Promise<ServiceItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/services`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await parseJsonResponse(res);
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((raw: any) => ({
        id: raw._id || raw.id,
        _id: raw._id,
        number: raw.number,
        title: raw.title,
        category: raw.category,
        description: raw.description,
      }));
    }
    return getCMSServices();
  } catch (err) {
    return getCMSServices();
  }
}

export async function addCMSServiceAsync(service: Omit<ServiceItem, 'id' | 'number'>): Promise<ServiceItem> {
  try {
    const res = await fetch(`${API_BASE}/api/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
    const json = await parseJsonResponse(res);
    if (res.ok && json.success) {
      notifyCMSUpdate();
      return { id: json.data._id, _id: json.data._id, ...json.data };
    }
  } catch (e) {}
  return addCMSService(service)[0];
}

export async function updateCMSServiceAsync(id: string, serviceData: Partial<ServiceItem>): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/api/services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    await parseJsonResponse(res);
    notifyCMSUpdate();
  } catch (e) {
    updateCMSService(id, serviceData);
  }
}

export async function deleteCMSServiceAsync(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/api/services/${id}`, { method: 'DELETE' });
    await parseJsonResponse(res);
    notifyCMSUpdate();
  } catch (e) {
    deleteCMSService(id);
  }
}

export const getCMSServices = (): ServiceItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading services from storage', e);
  }
  const initial = defaultServices.map((s, idx) => ({
    id: `srv_${idx + 1}`,
    number: s.number,
    title: s.title,
    category: s.category,
    description: s.description,
  }));
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(initial));
  return initial;
};

export const saveCMSServices = (services: ServiceItem[]) => {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  notifyCMSUpdate();
};

export const addCMSService = (service: Omit<ServiceItem, 'id' | 'number'>) => {
  const list = getCMSServices();
  const nextNum = String(list.length + 1).padStart(2, '0');
  const newService: ServiceItem = {
    ...service,
    id: `srv_${Date.now()}`,
    number: nextNum,
  };
  const updated = [...list, newService];
  saveCMSServices(updated);
  return updated;
};

export const updateCMSService = (id: string, serviceData: Partial<ServiceItem>) => {
  const list = getCMSServices();
  const updated = list.map((item) => (item.id === id ? { ...item, ...serviceData } : item));
  saveCMSServices(updated);
  return updated;
};

export const deleteCMSService = (id: string) => {
  const list = getCMSServices();
  const filtered = list.filter((item) => item.id !== id);
  const reindexed = filtered.map((item, idx) => ({
    ...item,
    number: String(idx + 1).padStart(2, '0'),
  }));
  saveCMSServices(reindexed);
  return reindexed;
};


// --- PRICING CRUD ---
export async function getCMSPricingAsync(): Promise<PricingItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/pricing`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await parseJsonResponse(res);
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((raw: any) => ({
        id: raw._id || raw.id,
        _id: raw._id,
        step: raw.step,
        price: raw.price,
        duration: raw.duration,
        badge: raw.badge || '',
        timeline: raw.timeline || '',
        description: raw.description,
      }));
    }
    return getCMSPricing();
  } catch (err) {
    return getCMSPricing();
  }
}

export async function addCMSPricingAsync(pkg: Omit<PricingItem, 'id'>): Promise<PricingItem> {
  try {
    const res = await fetch(`${API_BASE}/api/pricing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pkg),
    });
    const json = await parseJsonResponse(res);
    if (res.ok && json.success) {
      notifyCMSUpdate();
      return { id: json.data._id, _id: json.data._id, ...json.data };
    }
  } catch (e) {}
  return addCMSPricing(pkg)[0];
}

export async function updateCMSPricingAsync(id: string, pkgData: Partial<PricingItem>): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/api/pricing/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pkgData),
    });
    await parseJsonResponse(res);
    notifyCMSUpdate();
  } catch (e) {
    updateCMSPricing(id, pkgData);
  }
}

export async function deleteCMSPricingAsync(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/api/pricing/${id}`, { method: 'DELETE' });
    await parseJsonResponse(res);
    notifyCMSUpdate();
  } catch (e) {
    deleteCMSPricing(id);
  }
}

export const getCMSPricing = (): PricingItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRICING);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading pricing from storage', e);
  }
  localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(DEFAULT_PRICING));
  return DEFAULT_PRICING;
};

export const saveCMSPricing = (pricing: PricingItem[]) => {
  localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricing));
  notifyCMSUpdate();
};

export const addCMSPricing = (pkg: Omit<PricingItem, 'id'>) => {
  const list = getCMSPricing();
  const newPkg: PricingItem = {
    ...pkg,
    id: `pkg_${Date.now()}`,
  };
  const updated = [...list, newPkg];
  saveCMSPricing(updated);
  return updated;
};

export const updateCMSPricing = (id: string, pkgData: Partial<PricingItem>) => {
  const list = getCMSPricing();
  const updated = list.map((item) => (item.id === id ? { ...item, ...pkgData } : item));
  saveCMSPricing(updated);
  return updated;
};

export const deleteCMSPricing = (id: string) => {
  const list = getCMSPricing();
  const filtered = list.filter((item) => item.id !== id);
  saveCMSPricing(filtered);
  return filtered;
};


// ENQUIRIES STORE
export const getCMSEnquiries = (): EnquiryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading enquiries from storage', e);
  }
  return [];
};

export const saveCMSEnquiry = (enquiry: Omit<EnquiryItem, 'id' | 'createdAt'>, customId?: string) => {
  const list = getCMSEnquiries();
  const targetId = customId || `enq_${Date.now()}`;
  
  if (list.some((item) => item.id === targetId)) {
    return list.find((item) => item.id === targetId)!;
  }

  const newEnquiry: EnquiryItem = {
    ...enquiry,
    id: targetId,
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  const updated = [newEnquiry, ...list];
  localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(updated));
  notifyCMSUpdate();
  return newEnquiry;
};

export const deleteCMSEnquiry = (id: string) => {
  const list = getCMSEnquiries();
  const filtered = list.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(filtered));
  notifyCMSUpdate();
  return filtered;
};


