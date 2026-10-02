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
