// GA4, Meta Pixel, and Google Ads Conversion Tracking Helper

export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  // 1. GA4 Data Layer Event
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }

  // 2. Meta Pixel Event
  if ((window as any).fbq) {
    if (eventName === 'generate_lead') {
      (window as any).fbq('track', 'Lead', {
        content_name: params.configuration || 'DXN Orion Pre-Launch',
        value: 1.00,
        currency: 'INR'
      });
    } else {
      (window as any).fbq('trackCustom', eventName, params);
    }
  }

  // Visual/console logging for testing and analytics confirmation
  console.log(`[EVENT TRACKED] ${eventName}:`, params);
}

export function fireLeadConversion(leadData: { configuration?: string; source?: string; leadId?: string }) {
  trackEvent('generate_lead', {
    event_category: 'engagement',
    event_label: leadData.source || 'pre_launch_form',
    configuration: leadData.configuration,
    lead_id: leadData.leadId
  });
}

// Injects GA4 / Google Ads gtag and Meta Pixel when IDs are configured via Vite env vars.
export function loadTrackingScripts() {
  if (typeof window === 'undefined') return;
  const env = (import.meta as any).env || {};
  const w = window as any;
  const gaId: string | undefined = env.VITE_GA4_ID;
  const adsId: string | undefined = env.VITE_GOOGLE_ADS_ID;
  const pixelId: string | undefined = env.VITE_META_PIXEL_ID;

  const primaryTagId = gaId || adsId;
  if (primaryTagId && !w.gtag) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${primaryTagId}`;
    document.head.appendChild(s);
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () { w.dataLayer.push(arguments); };
    w.gtag('js', new Date());
    if (gaId) w.gtag('config', gaId);
    if (adsId) w.gtag('config', adsId);
  }

  if (pixelId && !w.fbq) {
    const fbq: any = function (...args: any[]) {
      fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args);
    };
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    w.fbq = w._fbq = fbq;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
    fbq('init', pixelId);
    fbq('track', 'PageView');
  }
}
