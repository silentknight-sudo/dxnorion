// Per-route SEO metadata + crawlable fallback content.
// Shared by server.ts (injects into raw HTML for search/AI crawlers) and App.tsx (updates tags on client navigation).

export const SITE_URL = 'https://dxn-orion.com';
export const SITE_NAME = 'DXN Orion Yamuna Expressway';
export const DEFAULT_OG_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5pTukeE2hQkmXut-7c8iJ0yI61f-uCHv8VYP7ZWazC1nbxF-o6pZvc6bFD3qPLWuYYhW71XwY4fTfHHwN1OAV-ys3BryEpwm_4AYB9zjJIhanugWiuBmzXz-WNtiCeUe6JUKF21nViuaD5Uwoz001Z1sooeyVwR4Dj4g2gtzSFZZ49Rn8E8ypv6H5ci2hAfbohZCltgRHA0jBdnC5NS4fCMwyvXMc1bhWpY6IKdHJeF8ZetQ9hb3d';

export interface PageSeo {
  title: string;        // 50-60 chars
  description: string;  // 120-160 chars
  breadcrumb?: string;
  noindex?: boolean;
  bodyHtml?: string;    // static crawlable content placed inside #root
}

const nav = `<nav aria-label="Main">
  <a href="/">DXN Orion Sector 22D home</a> · <a href="/floor-plans">DXN Orion floor plans</a> ·
  <a href="/amenities">DXN Orion amenities</a> · <a href="/location">Sector 22D location map</a> ·
  <a href="/blog">Yamuna Expressway property blog</a> · <a href="/contact">Contact DXN Orion sales</a>
</nav>`;

const footer = `<footer><address>DXN Orion, Plot GH-01, Sector 22D, Yamuna Expressway, Greater Noida, Uttar Pradesh 203201, India · Phone: <a href="tel:+917217227777">+91 72172 27777</a></address></footer>`;

export function wrapBody(main: string): string {
  return `<header><a href="/"><img src="/logo.png" alt="DXN Orion Yamuna Expressway logo" width="178" height="63" /></a>${nav}</header><main>${main}</main>${footer}`;
}

export const PAGE_SEO: Record<string, PageSeo> = {
  '/': {
    title: 'DXN Orion Sector 22D Yamuna Expressway | 3 & 4 BHK Flats',
    description: 'DXN Orion Sector 22D, Yamuna Expressway: luxury 3 & 4 BHK flats near Jewar Airport from ₹2.2 Cr*. Get the DXN Orion price list, floor plans & EOI details.'
  },
  '/floor-plans': {
    title: 'DXN Orion Floor Plans | 3 & 4 BHK Sizes, Sector 22D',
    description: 'View DXN Orion floor plans: 3 BHK (2,150 sq.ft), 3 BHK + Servant (2,600 sq.ft) and 4 BHK + Servant (3,250 sq.ft) on Yamuna Expressway. Get the price list.',
    breadcrumb: 'Floor Plans',
    bodyHtml: wrapBody(`<h1>DXN Orion Floor Plans – 3 &amp; 4 BHK Apartments in Sector 22D</h1>
<p>DXN Orion on the Yamuna Expressway offers three spacious, golf-facing layouts designed for low-density luxury living near Noida International Airport (Jewar).</p>
<h2>DXN Orion Unit Sizes &amp; Prices</h2>
<ul>
<li><h3>3 BHK Luxury – approx. 2,150 sq.ft</h3><p>Three bedrooms with attached baths, private viewing deck, from ₹2.20 Cr*.</p></li>
<li><h3>3 BHK + Servant Room – approx. 2,600 sq.ft</h3><p>Larger living and dining with a dedicated staff room and utility.</p></li>
<li><h3>4 BHK + Servant Room – approx. 3,250 sq.ft</h3><p>Sky estates with wrap-around decks and golf views, from ₹3.40 Cr*.</p></li>
</ul>
<p>Request the detailed DXN Orion floor plan PDF, price list and construction-linked payment plan from the official sales desk. *Prices indicative, subject to change.</p>`)
  },
  '/amenities': {
    title: 'DXN Orion Amenities | Clubhouse, Pool & Golf Views',
    description: 'Explore DXN Orion amenities in Sector 22D, Yamuna Expressway: palatial clubhouse, infinity pool, gym, spa, kids arena, sky observatory and 24x7 security.',
    breadcrumb: 'Amenities',
    bodyHtml: wrapBody(`<h1>DXN Orion Amenities – Luxury Lifestyle on Yamuna Expressway</h1>
<p>Residents of DXN Orion, Sector 22D enjoy resort-style amenities inside a low-density, IGBC Gold pre-certified green community.</p>
<h2>Clubhouse &amp; Wellness</h2>
<ul><li>Palatial clubhouse with banquet and lounges</li><li>Temperature-controlled infinity edge swimming pool</li><li>Gym &amp; aerobics studio</li><li>Ayurveda spa</li></ul>
<h2>Family &amp; Outdoors</h2>
<ul><li>Kids play arena</li><li>Sky observatory</li><li>Landscaped zen greens and golf-facing terraces</li></ul>
<h2>Security &amp; Services</h2>
<ul><li>5-tier biometric &amp; RFID security</li><li>24x7 concierge and power backup</li></ul>`)
  },
  '/location': {
    title: 'DXN Orion Location | Sector 22D Near Jewar Airport',
    description: 'DXN Orion location map: Sector 22D on Yamuna Expressway, 15 mins from Noida International Airport (Jewar), 8 mins to Film City and 5 mins to EPE.',
    breadcrumb: 'Location',
    bodyHtml: wrapBody(`<h1>DXN Orion Location – Sector 22D, Yamuna Expressway</h1>
<p>DXN Orion is located at Plot GH-01, Sector 22D, Yamuna Expressway (YEIDA), Greater Noida, Uttar Pradesh 203201.</p>
<h2>Connectivity from Sector 22D</h2>
<ul>
<li>Noida International Airport, Jewar – approx. 15 minutes</li>
<li>YEIDA Film City – approx. 8 minutes</li>
<li>Eastern Peripheral Expressway – approx. 5 minutes</li>
<li>Pari Chowk, Greater Noida – via Yamuna Expressway</li>
</ul>
<h2>Why Sector 22D Yamuna Expressway?</h2>
<p>Sector 22D sits in the heart of the YEIDA Master Plan 2031 growth corridor, close to the airport, Film City, the proposed Medical Device Park and planned metro and pod-taxi links – driving strong long-term demand for luxury housing.</p>`)
  },
  '/contact': {
    title: 'Contact DXN Orion | Sales Office, Sector 22D YEIDA',
    description: 'Contact the DXN Orion sales desk on +91 72172 27777 for price list, floor plans, site visits and pre-launch EOI in Sector 22D, Yamuna Expressway.',
    breadcrumb: 'Contact',
    bodyHtml: wrapBody(`<h1>Contact DXN Orion Sales – Sector 22D, Yamuna Expressway</h1>
<p>Call <a href="tel:+917217227777">+91 72172 27777</a> or WhatsApp the official sales desk to book a site visit, receive the DXN Orion price list and floor plans, or register your pre-launch Expression of Interest.</p>
<h2>Project Address</h2>
<p>Plot GH-01, Sector 22D, Yamuna Expressway, Greater Noida, Uttar Pradesh 203201, India.</p>`)
  },
  '/blog': {
    title: 'Yamuna Expressway Property Blog | DXN Orion Insights',
    description: 'Guides on Yamuna Expressway real estate, Sector 22D, Jewar Airport impact, YEIDA projects, UP RERA checks and choosing 3 vs 4 BHK flats, by DXN Orion.',
    breadcrumb: 'Blog'
  },
  '/privacy-policy': {
    title: 'Privacy Policy | DXN Orion Yamuna Expressway',
    description: 'Privacy policy of the DXN Orion website: how enquiry details for Sector 22D, Yamuna Expressway apartments are collected, used and protected.',
    breadcrumb: 'Privacy Policy'
  },
  '/disclaimer': {
    title: 'Disclaimer & RERA Notice | DXN Orion Sector 22D',
    description: 'Disclaimer and UP RERA notice for DXN Orion, Sector 22D, Yamuna Expressway: marketing partner details, artistic impressions and tentative specifications.',
    breadcrumb: 'Disclaimer'
  },
  '/thank-you': {
    title: 'Thank You | DXN Orion',
    description: 'Thank you for your interest in DXN Orion, Sector 22D, Yamuna Expressway. Our sales team will contact you shortly.',
    noindex: true
  }
};

export const NOT_FOUND_SEO: PageSeo = {
  title: 'Page Not Found | DXN Orion',
  description: 'The page you are looking for does not exist. Explore DXN Orion 3 & 4 BHK luxury apartments in Sector 22D, Yamuna Expressway.',
  noindex: true
};

export function categorySeo(name: string, description: string): PageSeo {
  return {
    title: `${name} | Yamuna Expressway Blog – DXN Orion`.slice(0, 65),
    description: `${description} Expert articles from DXN Orion, Sector 22D, Yamuna Expressway.`.slice(0, 160),
    breadcrumb: name
  };
}

export function clampDescription(text: string, max = 160): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}
