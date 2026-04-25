const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Browser should use relative path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel SSR
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // Fallback
};

const API_BASE = getBaseUrl();

async function fetcher<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) },
  })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}

export const api = {
  getEvents: (p?: Record<string, string>) =>
    fetcher<any>(`/api/events${p ? '?' + new URLSearchParams(p) : ''}`),
  getUpcomingEvents: () => fetcher<any>('/api/events/upcoming'),
  getAsteroids: () => fetcher<any>('/api/events/asteroids'),
  setReminder: (id: number, email: string) =>
    fetch(`${API_BASE}/api/events/${id}/reminder`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }).then(r => r.json()),

  getStarOfDay: () => fetcher<any>('/api/stars/star-of-day'),
  getStars: () => fetcher<any>('/api/stars'),

  getNews: (p?: Record<string, string>) =>
    fetcher<any>(`/api/news${p ? '?' + new URLSearchParams(p) : ''}`),
  getApod: () => fetcher<any>('/api/news/apod'),
  getTodayApod: () => fetcher<any>('/api/news/today-apod'),

  getConstellations: (p?: Record<string, string>) =>
    fetcher<any>(`/api/constellations${p ? '?' + new URLSearchParams(p) : ''}`),
  getConstellation: (id: number) => fetcher<any>(`/api/constellations/${id}`),

  getGallery: (p?: Record<string, string>) =>
    fetcher<any>(`/api/gallery${p ? '?' + new URLSearchParams(p) : ''}`),
  likeGallery: (id: string | number) =>
    fetch(`${API_BASE}/api/gallery/${id}/like`, { method: 'POST' }).then(r => r.json()),

  getCommunity: () => fetcher<any>('/api/community'),
  submitPhoto: (data: any) =>
    fetch(`${API_BASE}/api/community`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),

  chat: (message: string) =>
    fetch(`${API_BASE}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) }).then(r => r.json()),

  // ISS Live Tracking
  getIssLocation: () => fetcher<any>('/api/iss/location'),
  getIssCrew: () => fetcher<any>('/api/iss/crew'),
}

export default api
