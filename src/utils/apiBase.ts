export function getApiBaseUrl(): string {
  const rawBase = (import.meta as any).env?.VITE_API_URL;
  const trimmedBase = String(rawBase ?? '').trim().replace(/\/+$/, '');

  // Endpoints are built as `${base}/api/...`; collapse a trailing `/api` in base.
  if (trimmedBase.endsWith('/api')) {
    return trimmedBase.slice(0, -4);
  }

  return trimmedBase;
}
