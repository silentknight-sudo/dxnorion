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
  <a href="/">DXN Orion Sector 22D home</a> · <a href="/price-list">DXN Orion price list</a> · <a href="/floor-plans">DXN Orion floor plans</a> ·
  <a href="/amenities">DXN Orion amenities</a> · <a href="/location">Sector 22D location map</a> ·
  <a href="/blog">Yamuna Expressway property blog</a> · <a href="/faq">DXN Orion FAQs</a> · <a href="/contact">Contact DXN Orion sales</a>
</nav>`;

const footer = `<footer><address>DXN Orion, Plot GH-01, Sector 22D, Yamuna Expressway, Greater Noida, Uttar Pradesh 203201, India · Phone: <a href="tel:+917217227777">+91 72172 27777</a></address></footer>`;

export function wrapBody(main: string): string {
  return `<header><a href="/"><img src="/logo.png" alt="DXN Orion Yamuna Expressway logo" width="178" height="63" /></a>${nav}</header><main>${main}</main>${footer}`;
}

export const PAGE_SEO: Record<string, PageSeo> = {
  '/': {
    title: 'DXN Orion Sector 22D Yamuna Expressway | 3 & 4 BHK Flats',
    description: 'DXN Orion (Orion DXN), Sector 22D Yamuna Expressway: luxury 3 & 4 BHK flats near Jewar Airport from ₹2.2 Cr*. Get the price list, floor plans & EOI.'
  },
  '/floor-plans': {
    title: 'DXN Orion Floor Plans | 3 & 4 BHK Sizes, Sector 22D',
    description: 'View DXN Orion floor plans: 3 BHK (1,900 sq.ft), 3 BHK + Servant (2,400 sq.ft) and 4 BHK + Servant (3,000 sq.ft) on Yamuna Expressway. Get the price list.',
    breadcrumb: 'Floor Plans',
    bodyHtml: wrapBody(`<h1>DXN Orion Floor Plans – 3 &amp; 4 BHK Apartments in Sector 22D</h1>
<p>DXN Orion on the Yamuna Expressway offers three spacious, golf-facing layouts designed for low-density luxury living near Noida International Airport (Jewar).</p>
<h2>DXN Orion Unit Sizes &amp; Prices</h2>
<ul>
<li><h3>3 BHK Luxury – approx. 1,900 sq.ft</h3><p>Three bedrooms with attached baths, private viewing deck, from ₹2.20 Cr*.</p></li>
<li><h3>3 BHK + Servant Room – approx. 2,400 sq.ft</h3><p>Larger living and dining with a dedicated staff room and utility.</p></li>
<li><h3>4 BHK + Servant Room – approx. 3,000 sq.ft</h3><p>Sky estates with wrap-around decks and golf views, from ₹3.40 Cr*.</p></li>
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

// ---- Keyword landing pages (rendered by server for crawlers and by LandingPage.tsx for users) ----
export interface FaqItem { question: string; answer: string }

export const FAQ_ITEMS: FaqItem[] = [
  { question: 'What is DXN Orion (Orion DXN)?', answer: 'DXN Orion, also searched as Orion DXN or Orion Yamuna Expressway, is a pre-launch luxury residential project of 3 BHK and 4 BHK golf-view apartments in Sector 22D, Yamuna Expressway (YEIDA), Greater Noida, close to Noida International Airport (Jewar).' },
  { question: 'Where exactly is DXN Orion located?', answer: 'DXN Orion is at Plot GH-01, Sector 22D, Yamuna Expressway, Greater Noida, Uttar Pradesh 203201 – directly on the expressway corridor, about 15 minutes from Jewar International Airport and 8 minutes from the upcoming International Film City.' },
  { question: 'What apartment sizes are available at DXN Orion?', answer: 'DXN Orion offers 3 BHK (approx. 1,900 sq.ft), 3 BHK + Servant (approx. 2,400 sq.ft) and 4 BHK + Servant (approx. 3,000 sq.ft) residences, planned with only 4 units per floor.' },
  { question: 'What is the DXN Orion price list?', answer: 'Indicative pre-launch EOI pricing starts from ₹2.20 Crore* for 3 BHK and ₹3.40 Crore* for 4 BHK residences. Final prices are shared by the official sales desk and are subject to change.' },
  { question: 'What payment plans are available?', answer: 'Flexible construction-linked plans (CLP) and milestone payment structures, such as 10:90 pre-launch windows, are available for first-phase pre-registered buyers.' },
  { question: 'How big is the DXN Orion project?', answer: 'The project is planned on approximately 11 acres of landscaped land with low-density towers of 4 apartments per floor and golf-facing views.' },
  { question: 'Is DXN Orion RERA registered?', answer: 'Master layout plans have been submitted and are under UP RERA processing. Formal allotment and sales commence only after receipt of the official UP RERA registration number.' },
  { question: 'Why invest in Sector 22D Yamuna Expressway?', answer: 'Sector 22D sits in the YEIDA Master Plan 2031 growth corridor near Noida International Airport, Film City, the Eastern Peripheral Expressway and planned industrial clusters, which drives long-term housing demand and appreciation potential.' },
  { question: 'How do I book or get the DXN Orion brochure and floor plans?', answer: 'Register on dxn-orion.com or call the official sales desk on +91 72172 27777. A relationship manager will share the brochure, floor plans, price list and a priority EOI number.' }
];

const faqHtml = FAQ_ITEMS.map(f => `<h3>${f.question}</h3>\n<p>${f.answer}</p>`).join('\n');

export interface LandingPage extends PageSeo {
  h1: string;
  mainHtml: string; // inner content (no H1)
  faq?: FaqItem[];
}

export const LANDING_PAGES: Record<string, LandingPage> = {
  '/price-list': {
    title: 'DXN Orion Price List 2026 | Orion DXN 3 & 4 BHK Prices',
    description: 'DXN Orion (Orion DXN) price list 2026: 3 BHK from ₹2.20 Cr* and 4 BHK from ₹3.40 Cr* in Sector 22D, Yamuna Expressway. Sizes, payment plan & EOI details.',
    breadcrumb: 'Price List',
    h1: 'DXN Orion Price List 2026 – Orion DXN Sector 22D, Yamuna Expressway',
    faq: FAQ_ITEMS.filter((_, i) => [3, 4, 2, 8].includes(i)),
    mainHtml: `<p>Here is the latest indicative <strong>DXN Orion price list</strong> for the pre-launch Expression of Interest (EOI) phase of Orion DXN, Sector 22D, Yamuna Expressway, Greater Noida.</p>
<h2>DXN Orion Price List by Configuration</h2>
<table>
<thead><tr><th>Configuration</th><th>Approx. Size</th><th>Indicative Price</th></tr></thead>
<tbody>
<tr><td>3 BHK Luxury</td><td>1,900 sq.ft</td><td>From ₹2.20 Cr*</td></tr>
<tr><td>3 BHK + Servant</td><td>2,400 sq.ft</td><td>On request</td></tr>
<tr><td>4 BHK + Servant</td><td>3,000 sq.ft</td><td>From ₹3.40 Cr*</td></tr>
</tbody>
</table>
<p>*Indicative pre-launch pricing; final price, PLC and other charges are confirmed by the official sales desk at allotment.</p>
<h2>DXN Orion Payment Plan</h2>
<ul>
<li>Construction-linked payment plan (CLP)</li>
<li>Milestone-based payment structures, including 10:90 pre-launch windows for first-phase pre-registered buyers</li>
<li>Refundable EOI to reserve a priority number</li>
</ul>
<h2>Why the Pre-Launch Price Matters</h2>
<p>Buyers who register during pre-launch get inaugural pricing, first choice of floors and golf-facing units, and the benefit of appreciation as Noida International Airport (Jewar), Film City and the YEIDA Master Plan 2031 projects come online.</p>
<p>Call <a href="tel:+917217227777">+91 72172 27777</a> to receive the complete DXN Orion price sheet and floor plans.</p>`
  },
  '/faq': {
    title: 'DXN Orion FAQs | Orion DXN Sector 22D Questions Answered',
    description: 'Answers about DXN Orion (Orion DXN) Sector 22D, Yamuna Expressway: location, sizes, price list, payment plan, RERA status, project size and how to book.',
    breadcrumb: 'FAQs',
    h1: 'DXN Orion FAQs – Everything About Orion DXN, Sector 22D',
    faq: FAQ_ITEMS,
    mainHtml: `<p>Common questions about DXN Orion, the luxury 3 &amp; 4 BHK project in Sector 22D, Yamuna Expressway near Jewar Airport.</p>\n<h2>DXN Orion Frequently Asked Questions</h2>\n${faqHtml}`
  }
};

for (const [path, page] of Object.entries(LANDING_PAGES)) {
  PAGE_SEO[path] = { ...page, bodyHtml: wrapBody(`<h1>${page.h1}</h1>\n${page.mainHtml}`) };
}

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
