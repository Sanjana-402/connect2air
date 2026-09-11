import { services as defaultServices } from '@/data/siteData';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
}

export interface PricingItem {
  id: string;
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

// SERVICES CRUD
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
  // Default to siteData services with generated IDs
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
  // Re-index numbers
  const reindexed = filtered.map((item, idx) => ({
    ...item,
    number: String(idx + 1).padStart(2, '0'),
  }));
  saveCMSServices(reindexed);
  return reindexed;
};


// PRICING CRUD
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
  
  // Avoid saving exact duplicate if ID already present
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
