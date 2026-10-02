// First-touch UTM and Click ID tracker

export interface UtmData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  landingPage: string;
}

const STORAGE_KEY = 'dxn_first_touch_attribution';

export function captureUtmParams(): void {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmTerm = urlParams.get('utm_term');
  const utmContent = urlParams.get('utm_content');
  const gclid = urlParams.get('gclid');
  const fbclid = urlParams.get('fbclid');

  // If first touch or new campaign detected
  const existing = getStoredUtm();
  if (!existing || utmSource || gclid || fbclid) {
    const data: UtmData = {
      utmSource: utmSource || existing?.utmSource || (document.referrer.includes('google') ? 'google' : document.referrer ? 'referrer' : 'direct'),
      utmMedium: utmMedium || existing?.utmMedium || (gclid ? 'cpc' : 'organic'),
      utmCampaign: utmCampaign || existing?.utmCampaign || undefined,
      utmTerm: utmTerm || existing?.utmTerm || undefined,
      utmContent: utmContent || existing?.utmContent || undefined,
      gclid: gclid || existing?.gclid || undefined,
      fbclid: fbclid || existing?.fbclid || undefined,
      landingPage: window.location.pathname
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Also store in cookie for first-touch persistence across sessions
      document.cookie = `dxn_utm=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=2592000; SameSite=Lax`;
    } catch (e) {
      // Storage unavailable
    }
  }
}

export function getStoredUtm(): UtmData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}
