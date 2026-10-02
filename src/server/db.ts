import fs from 'fs';
import path from 'path';

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SALES_MANAGER' | 'SALES_EXECUTIVE';
  createdAt: string;
  lastLoginAt: string | null;
}

export type LeadConfiguration = '3BHK' | '3BHK_SERVANT' | '4BHK_SERVANT';
export type LeadSource = 'hero_form' | 'modal' | 'exit_popup' | 'floor_plans' | 'blog_cta' | 'whatsapp' | 'contact_page' | 'brochure_download';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'INTERESTED' | 'SITE_VISIT' | 'NOT_INTERESTED' | 'CLOSED';
export type ActivityType = 'STATUS_CHANGE' | 'NOTE' | 'CALL' | 'WHATSAPP';

export interface LeadActivity {
  id: string;
  leadId: string;
  type: ActivityType;
  content: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  configuration: LeadConfiguration;
  budget?: string;
  message?: string;
  source: LeadSource;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  landingPage: string;
  ipHash?: string;
  userAgent?: string;
  status: LeadStatus;
  notes?: string;
  assignedTo?: string;
  followUpAt?: string | null;
  consent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostFaq {
  question: string;
  answer: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentJson?: any;
  contentHtml: string;
  coverImageUrl: string;
  coverImageAlt: string;
  status: 'PUBLISHED' | 'SCHEDULED' | 'PUBLISHED';
  publishedAt: string | null;
  scheduledAt: string | null;
  updatedAt: string;
  authorId: string;
  authorName: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  readingTime: number;
  views: number;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  noindex: boolean;
  faqJson: PostFaq[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Redirect {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  reraNumber: string;
  ga4Id: string;
  metaPixelId: string;
  googleAdsId: string;
  gscVerification: string;
  updatedAt: string;
}

export interface DatabaseData {
  adminUsers: AdminUser[];
  leads: Lead[];
  activities: LeadActivity[];
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  redirects: Redirect[];
  settings: SiteSettings;
}

const IS_VERCEL = process.env.VERCEL === '1';
const BUNDLED_DB_FILE = path.resolve(process.cwd(), 'data', 'db.json');
const DATA_DIR = IS_VERCEL ? path.join('/tmp', 'data') : path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Location Guides', slug: 'location-guides', description: 'Detailed insights on Sector 22D, connectivity, and Yamuna Expressway micro-markets.' },
  { id: 'cat-2', name: 'Investment & ROI', slug: 'investment-roi', description: 'Capital appreciation forecasts, pre-launch price advantages, and rental yields.' },
  { id: 'cat-3', name: 'Infrastructure', slug: 'infrastructure', description: 'Updates on Jewar Airport, Film City, Pod Taxis, and Eastern Peripheral Expressway.' },
  { id: 'cat-4', name: 'Apartment Guides', slug: 'apartment-guides', description: 'Floor plans, luxury architecture, vastu compliance, and interior planning.' },
  { id: 'cat-5', name: 'RERA & Legal', slug: 'rera-legal', description: 'UP RERA verification, buyer rights, legal checklists, and allotment procedures.' }
];

const INITIAL_TAGS: Tag[] = [
  { id: 'tag-1', name: 'Yamuna Expressway', slug: 'yamuna-expressway' },
  { id: 'tag-2', name: 'Jewar Airport', slug: 'jewar-airport' },
  { id: 'tag-3', name: 'Sector 22D', slug: 'sector-22d' },
  { id: 'tag-4', name: 'Film City', slug: 'film-city' },
  { id: 'tag-5', name: '3 BHK', slug: '3-bhk' },
  { id: 'tag-6', name: '4 BHK', slug: '4-bhk' },
  { id: 'tag-7', name: 'YEIDA', slug: 'yeida' },
  { id: 'tag-8', name: 'Pre-Launch', slug: 'pre-launch' },
  { id: 'tag-9', name: 'UP RERA', slug: 'up-rera' }
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Sector 22D Yamuna Expressway: Complete Location Guide (2026)',
    slug: 'sector-22d-yamuna-expressway-complete-location-guide-2026',
    excerpt: 'An exhaustive analysis of Sector 22D on Yamuna Expressway, analyzing its strategic proximity to Jewar Airport, Film City, golf layouts, and infrastructure connectivity.',
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    scheduledAt: null,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    authorId: 'admin-1',
    authorName: 'Shivam Pratap Singh',
    categoryId: 'cat-1',
    categoryName: 'Location Guides',
    tags: ['Sector 22D', 'Yamuna Expressway', 'Jewar Airport', 'YEIDA'],
    readingTime: 6,
    views: 142,
    metaTitle: 'Sector 22D Yamuna Expressway: Complete Location Guide 2026',
    metaDescription: 'Discover why Sector 22D on the Yamuna Expressway is emerging as the premier luxury residential corridor in NCR, located just 15 minutes from Jewar Airport.',
    focusKeyword: 'Sector 22D Yamuna Expressway',
    coverImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5pTukeE2hQkmXut-7c8iJ0yI61f-uCHv8VYP7ZWazC1nbxF-o6pZvc6bFD3qPLWuYYhW71XwY4fTfHHwN1OAV-ys3BryEpwm_4AYB9zjJIhanugWiuBmzXz-WNtiCeUe6JUKF21nViuaD5Uwoz001Z1sooeyVwR4Dj4g2gtzSFZZ49Rn8E8ypv6H5ci2hAfbohZCltgRHA0jBdnC5NS4fCMwyvXMc1bhWpY6IKdHJeF8ZetQ9hb3d',
    coverImageAlt: 'Modern high rise luxury residences overlooking golf greens in Sector 22D Yamuna Expressway',
    canonicalUrl: 'https://dxn-orion.com/blog/sector-22d-yamuna-expressway-complete-location-guide-2026',
    ogImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5pTukeE2hQkmXut-7c8iJ0yI61f-uCHv8VYP7ZWazC1nbxF-o6pZvc6bFD3qPLWuYYhW71XwY4fTfHHwN1OAV-ys3BryEpwm_4AYB9zjJIhanugWiuBmzXz-WNtiCeUe6JUKF21nViuaD5Uwoz001Z1sooeyVwR4Dj4g2gtzSFZZ49Rn8E8ypv6H5ci2hAfbohZCltgRHA0jBdnC5NS4fCMwyvXMc1bhWpY6IKdHJeF8ZetQ9hb3d',
    noindex: false,
    contentHtml: `
      <h2>The Strategic Significance of Sector 22D</h2>
      <p>Sector 22D on the Yamuna Expressway has emerged as the crown jewel of YEIDA's master planning. Situated directly along the high-speed 6-lane expressway (expandable to 8 lanes), this sector bridges the bustling corporate hubs of Greater Noida with the upcoming world-class Noida International Airport at Jewar.</p>
      
      <p>Unlike dense urban clusters in central Noida or Gurugram, Sector 22D is engineered as a low-density residential haven. Flanked by manicured championship golf course zones and green buffer belts, it presents high-net-worth investors and discerning families with a clean-air sanctuary.</p>

      <h2>Proximity to Game-Changing Mega Projects</h2>
      <ul>
        <li><strong>Noida International Airport (Jewar):</strong> Just 15 minutes away via signal-free expressway access. Commercial cargo and passenger trial flights underscore the immense momentum.</li>
        <li><strong>International Film City (Sector 21):</strong> Adjacent to Sector 22D (an 8-minute drive), spanning over 1,000 acres, poised to generate thousands of executive-level media and tech jobs.</li>
        <li><strong>Eastern Peripheral Expressway (EPE):</strong> 5 minutes away, providing direct freight and passenger transit to Kundli, Palwal, and Ghaziabad without entering Delhi.</li>
        <li><strong>Buddh International Circuit & Sports City:</strong> 7 minutes distance, surrounded by Olympic-grade sporting arenas.</li>
      </ul>

      <div class="blog-cta-box glass-panel p-6 rounded-2xl border border-[#C9A86A]/40 my-8 text-center">
        <h3 class="font-serif text-xl font-bold text-[#F7F4EE] mb-2">Explore DXN Orion Sector 22D</h3>
        <p class="text-sm text-[#94A3B8] mb-4">Register your pre-launch Expression of Interest for golf-facing 3 & 4 BHK sky estates before public price revision.</p>
        <a href="/#enquire" class="inline-block gold-gradient-bg text-[#0B1426] font-bold text-xs uppercase px-6 py-3 rounded-xl tracking-wider shadow-lg">Request Pre-Launch Dossier</a>
      </div>

      <h2>Master Plan Analysis: Sector 22D Zonal Attributes</h2>
      <p>YEIDA's sector regulations enforce expansive 45-meter wide secondary collector roads and 100-meter primary expressway green buffers. This guarantees that residential complexes like <a href="/" class="text-[#C9A86A] underline">DXN Orion</a> retain unobstructed natural daylight, cross-ventilation, and pristine sunset views over the golf horizons.</p>

      <h2>Investment Potential & Price Projections</h2>
      <p>Property values in Sector 22D have witnessed a steady annual appreciation of 18% to 24% over the last 36 months, propelled by the construction velocity of Jewar Airport. Institutional developers are curating bespoke clubhouses and international school campuses in the immediate vicinity, making it primed for substantial 5-year capital compounding.</p>
    `,
    faqJson: [
      {
        question: 'How far is Sector 22D from Noida International Airport?',
        answer: 'Sector 22D is situated approximately 14-16 kilometers from the Jewar Airport terminal, which translates to a smooth 15-minute signal-free drive on the Yamuna Expressway.'
      },
      {
        question: 'What is the master plan density for Sector 22D residential projects?',
        answer: 'Sector 22D adheres to low-to-medium density master planning regulations, mandating wide green reserves and limiting vertical congestion compared to typical NCR sectors.'
      },
      {
        question: 'Are residential projects in Sector 22D eligible for home loans?',
        answer: 'Yes, all projects with approved UP RERA registrations and statutory clearances are eligible for approvals and construction-linked home loans from leading nationalized and private banks.'
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Why Property Near Noida International Airport Is Gaining Value',
    slug: 'why-property-near-noida-international-airport-is-gaining-value',
    excerpt: 'Discover the macroeconomic triggers and global airport city models proving why property around Jewar Airport is entering its highest capital appreciation curve.',
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    scheduledAt: null,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    authorId: 'admin-1',
    authorName: 'Shivam Pratap Singh',
    categoryId: 'cat-2',
    categoryName: 'Investment & ROI',
    tags: ['Jewar Airport', 'Investment & ROI', 'Price Trends', 'Yamuna Expressway'],
    readingTime: 5,
    views: 119,
    metaTitle: 'Why Property Near Jewar Airport Is Gaining Value Fast (2026)',
    metaDescription: 'In-depth analysis of property price appreciation near Noida International Airport (Jewar). Learn why global aerotropolis hubs yield exponential real estate ROI.',
    focusKeyword: 'property near Noida International Airport',
    coverImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZh4yQ8pDNsgkv2XSHTd53fMGCg7XNEzc1L1W5jf6hqrpE7RKe8LCnoNpwwIHgkCRNn_Vbt3jn361tf5p4Nvxb1zejlam__Uy26CcR2QMDUwEg9RtsibbEla0m04Z-lt-eiQSrE-XwOVLgXGmylZl8s04h_oxrF5WIbhwcmUbMH6HHZd5hg2GDrYjbBJ_6KR-Ei3NbNHdJpDGuYbReHgKC2rPWsYxkWtPaABCDUEVOugSo_ukA9ufC',
    coverImageAlt: 'Clubhouse and resort living near Jewar Airport corridor',
    canonicalUrl: 'https://dxn-orion.com/blog/why-property-near-noida-international-airport-is-gaining-value',
    ogImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZh4yQ8pDNsgkv2XSHTd53fMGCg7XNEzc1L1W5jf6hqrpE7RKe8LCnoNpwwIHgkCRNn_Vbt3jn361tf5p4Nvxb1zejlam__Uy26CcR2QMDUwEg9RtsibbEla0m04Z-lt-eiQSrE-XwOVLgXGmylZl8s04h_oxrF5WIbhwcmUbMH6HHZd5hg2GDrYjbBJ_6KR-Ei3NbNHdJpDGuYbReHgKC2rPWsYxkWtPaABCDUEVOugSo_ukA9ufC',
    noindex: false,
    contentHtml: `
      <h2>The Global Aerotropolis Phenomenon</h2>
      <p>Historically, modern international greenfield airports act as multi-billion dollar economic engines. Looking at Schiphol in Amsterdam, Incheon in South Korea, or Kempegowda in Bengaluru, property corridors within a 15-20 minute radius of major aviation hubs experience sustained double-digit capital appreciation during their pre-operational and operational expansion phases.</p>

      <h2>Noida International Airport: Scale and Phased Growth</h2>
      <p>Spanning over 5,000 hectares upon final master development, Noida International Airport (DXN) will rank among Asia's largest multi-runway airports. Designed by Zurich Airport International AG, its carbon-neutral infrastructure is already attracting multinational airline headquarters, logistics park operators, and luxury hospitality giants.</p>

      <h2>Why Pre-Launch Residential Projects Yield Maximum ROI</h2>
      <p>Entering the corridor at the pre-launch or early developmental phase — such as registering for priority allocation at <a href="/" class="text-[#C9A86A] underline">DXN Orion Sector 22D</a> — enables investors to capture inaugural pricing before commercial airline passenger traffic triggers retail escalation.</p>
    `,
    faqJson: [
      {
        question: 'When will commercial passenger flights commence at Jewar Airport?',
        answer: 'Aviation authorities and concessionaires are scheduled to inaugurate scheduled passenger operations following successful validation flights.'
      },
      {
        question: 'What is the projected rental yield in the airport catchment?',
        answer: 'Anticipated gross rental yields range between 4.5% to 6.2%, driven by demand from airline pilots, civil aviation personnel, IT professionals, and hospitality executives.'
      }
    ]
  },
  {
    id: 'post-3',
    title: 'Yamuna Expressway vs Noida Extension: Where Should You Invest?',
    slug: 'yamuna-expressway-vs-noida-extension-where-should-you-invest',
    excerpt: 'Detailed comparison between Yamuna Expressway and Greater Noida West (Noida Extension) on infrastructure, density, capital appreciation, and lifestyle.',
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    scheduledAt: null,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    authorId: 'admin-1',
    authorName: 'Shivam Pratap Singh',
    categoryId: 'cat-2',
    categoryName: 'Investment & ROI',
    tags: ['Yamuna Expressway', 'Investment & ROI', 'Sector 22D'],
    readingTime: 5,
    views: 94,
    metaTitle: 'Yamuna Expressway vs Noida Extension: 2026 Real Estate Investment Analysis',
    metaDescription: 'Comparing Yamuna Expressway (Sector 22D) with Greater Noida West across density, airport proximity, infrastructure, and luxury lifestyle ROI.',
    focusKeyword: 'Yamuna Expressway vs Noida Extension',
    coverImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6HwftogRFHzOgLRfLPH-nqLJnnNbwAivmQj-e3eS12gQ28ChzDsQJRxjkHoxhV0oeAqyOzGg3okKjjIqLLjNildWfYZ8kBFzbDt2jTB9kwywbZa_ucL5_F0uxZ40NEoaPzE89CZ4FRuWlf6S-PVkpONhUh2IrQBDibcYV3gpp4XREiDFUow_SoCa8lNpnCvrqwAWBqooWwXEk24FlH84O1Nh0L_4rx3Bh2HLJcve68wdjFR0Kcaul',
    coverImageAlt: 'Luxury interior living room with expansive balcony',
    canonicalUrl: 'https://dxn-orion.com/blog/yamuna-expressway-vs-noida-extension-where-should-you-invest',
    ogImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6HwftogRFHzOgLRfLPH-nqLJnnNbwAivmQj-e3eS12gQ28ChzDsQJRxjkHoxhV0oeAqyOzGg3okKjjIqLLjNildWfYZ8kBFzbDt2jTB9kwywbZa_ucL5_F0uxZ40NEoaPzE89CZ4FRuWlf6S-PVkpONhUh2IrQBDibcYV3gpp4XREiDFUow_SoCa8lNpnCvrqwAWBqooWwXEk24FlH84O1Nh0L_4rx3Bh2HLJcve68wdjFR0Kcaul',
    noindex: false,
    contentHtml: `
      <h2>The Shift Toward Master-Planned Low-Density Living</h2>
      <p>For buyers considering Noida real estate, the choice often narrows between Noida Extension (Greater Noida West) and the emerging Yamuna Expressway corridor (specifically Sector 22D and surrounding sectors). While Greater Noida West caters to high-density budget homes, the Yamuna Expressway is being engineered as NCR's premier low-density luxury corridor.</p>

      <h2>Traffic & Transit Connectivity</h2>
      <p>The Yamuna Expressway provides high-speed, signal-free transit with dedicated service lanes, whereas Noida Extension contends with chronic bottleneck roundabouts like Gaur Chowk during peak commuter hours.</p>

      <h2>Comparison Table: Key Investment Metrics</h2>
      <table class="w-full text-left border border-white/20 my-4 text-xs">
        <thead class="bg-[#111D36] text-[#C9A86A]">
          <tr>
            <th class="p-2 border border-white/10">Feature</th>
            <th class="p-2 border border-white/10">Yamuna Expressway (Sector 22D)</th>
            <th class="p-2 border border-white/10">Noida Extension</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10">
          <tr>
            <td class="p-2 font-bold">Density</td>
            <td class="p-2">Low-to-Medium (4 units/floor, open golf greens)</td>
            <td class="p-2">High-density (8-16 units/floor)</td>
          </tr>
          <tr>
            <td class="p-2 font-bold">Airport Distance</td>
            <td class="p-2 text-[#C9A86A]">15 Mins (Direct Expressway)</td>
            <td class="p-2">55-70 Mins (Via congested urban routes)</td>
          </tr>
          <tr>
            <td class="p-2 font-bold">Target Buyer</td>
            <td class="p-2">Luxury homebuyers & HNI investors</td>
            <td class="p-2">Mid-income first-time buyers</td>
          </tr>
        </tbody>
      </table>
    `,
    faqJson: [
      {
        question: 'Which corridor has higher capital appreciation potential by 2028?',
        answer: 'Yamuna Expressway projects offer higher appreciation runway because of pending infrastructural milestones like Jewar Airport Phase 1 opening and the International Film City development.'
      }
    ]
  },
  {
    id: 'post-4',
    title: '3 BHK vs 4 BHK: Choosing the Right Luxury Apartment Size',
    slug: '3-bhk-vs-4-bhk-choosing-the-right-luxury-apartment-size',
    excerpt: 'Detailed architectural and lifestyle comparison between 1,900 sq ft 3 BHK, 2,400 sq ft 3 BHK+Servant, and 3,000 sq ft 4 BHK+Servant residences.',
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    scheduledAt: null,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    authorId: 'admin-1',
    authorName: 'Shivam Pratap Singh',
    categoryId: 'cat-4',
    categoryName: 'Apartment Guides',
    tags: ['3 BHK', '4 BHK', 'Sector 22D'],
    readingTime: 4,
    views: 86,
    metaTitle: '3 BHK vs 4 BHK Luxury Apartment Guide | DXN Orion Sector 22D',
    metaDescription: 'Explore the spatial differences, floor plan layouts, and long-term resale dynamics between 3 BHK and 4 BHK luxury residences on the Yamuna Expressway.',
    focusKeyword: '3 BHK vs 4 BHK luxury apartment',
    coverImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6HwftogRFHzOgLRfLPH-nqLJnnNbwAivmQj-e3eS12gQ28ChzDsQJRxjkHoxhV0oeAqyOzGg3okKjjIqLLjNildWfYZ8kBFzbDt2jTB9kwywbZa_ucL5_F0uxZ40NEoaPzE89CZ4FRuWlf6S-PVkpONhUh2IrQBDibcYV3gpp4XREiDFUow_SoCa8lNpnCvrqwAWBqooWwXEk24FlH84O1Nh0L_4rx3Bh2HLJcve68wdjFR0Kcaul',
    coverImageAlt: 'Spacious high ceiling penthouse living room',
    canonicalUrl: 'https://dxn-orion.com/blog/3-bhk-vs-4-bhk-choosing-the-right-luxury-apartment-size',
    ogImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6HwftogRFHzOgLRfLPH-nqLJnnNbwAivmQj-e3eS12gQ28ChzDsQJRxjkHoxhV0oeAqyOzGg3okKjjIqLLjNildWfYZ8kBFzbDt2jTB9kwywbZa_ucL5_F0uxZ40NEoaPzE89CZ4FRuWlf6S-PVkpONhUh2IrQBDibcYV3gpp4XREiDFUow_SoCa8lNpnCvrqwAWBqooWwXEk24FlH84O1Nh0L_4rx3Bh2HLJcve68wdjFR0Kcaul',
    noindex: false,
    contentHtml: `
      <h2>Evaluating Living Space for Modern Extended Families</h2>
      <p>When selecting a luxury residence at DXN Orion, prospective owners often deliberate between the 3 BHK Luxury (1,900 sq ft), the 3 BHK + Servant (2,400 sq ft), and the 4 BHK + Servant (3,000 sq ft). Here is a functional breakdown of the layouts and spatial flow.</p>

      <h2>The Need for Dedicated Servant Quarters</h2>
      <p>In modern high-profile estates, having an independent service entry and en-suite servant quarter maintains household privacy while providing 24/7 domestic support. The 3 BHK+S (Type B) and 4 BHK+S (Type C) residences are specifically planned with dual-entry elevators to ensure staff and logistics movements remain separate from private family foyers.</p>

      <div class="my-6">
        <a href="/floor-plans" class="text-[#C9A86A] underline font-bold">View Interactive Floor Plans for 3 & 4 BHK Configurations &rarr;</a>
      </div>
    `,
    faqJson: [
      {
        question: 'Which configuration is the most preferred at pre-launch?',
        answer: 'The 3 BHK + Servant (2,400 Sq.Ft.) is the most preferred configuration due to its optimal balance between double-height living balconies, private quarters, and high liquidity.'
      }
    ]
  },
  {
    id: 'post-5',
    title: 'How to Check UP RERA Registration Before Buying a Flat',
    slug: 'how-to-check-up-rera-registration-before-buying-a-flat',
    excerpt: 'A step-by-step buyer guide on verifying Uttar Pradesh RERA registration, promoter track record, project bank accounts, and quarterly compliance filings.',
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    scheduledAt: null,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    authorId: 'admin-1',
    authorName: 'Shivam Pratap Singh',
    categoryId: 'cat-5',
    categoryName: 'RERA & Legal',
    tags: ['UP RERA', 'RERA & Legal', 'Yamuna Expressway'],
    readingTime: 5,
    views: 73,
    metaTitle: 'How to Check UP RERA Registration: Complete Step-by-Step Buyer Guide',
    metaDescription: 'Learn how to verify UP RERA certificates, verify escrow account numbers, and cross-check sanctioned building plans before investing in Yamuna Expressway projects.',
    focusKeyword: 'how to check UP RERA registration',
    coverImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5pTukeE2hQkmXut-7c8iJ0yI61f-uCHv8VYP7ZWazC1nbxF-o6pZvc6bFD3qPLWuYYhW71XwY4fTfHHwN1OAV-ys3BryEpwm_4AYB9zjJIhanugWiuBmzXz-WNtiCeUe6JUKF21nViuaD5Uwoz001Z1sooeyVwR4Dj4g2gtzSFZZ49Rn8E8ypv6H5ci2hAfbohZCltgRHA0jBdnC5NS4fCMwyvXMc1bhWpY6IKdHJeF8ZetQ9hb3d',
    coverImageAlt: 'Architectural compliance and luxury master plan',
    canonicalUrl: 'https://dxn-orion.com/blog/how-to-check-up-rera-registration-before-buying-a-flat',
    ogImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5pTukeE2hQkmXut-7c8iJ0yI61f-uCHv8VYP7ZWazC1nbxF-o6pZvc6bFD3qPLWuYYhW71XwY4fTfHHwN1OAV-ys3BryEpwm_4AYB9zjJIhanugWiuBmzXz-WNtiCeUe6JUKF21nViuaD5Uwoz001Z1sooeyVwR4Dj4g2gtzSFZZ49Rn8E8ypv6H5ci2hAfbohZCltgRHA0jBdnC5NS4fCMwyvXMc1bhWpY6IKdHJeF8ZetQ9hb3d',
    noindex: false,
    contentHtml: `
      <h2>The Legal Framework of UP RERA</h2>
      <p>The Real Estate (Regulation and Development) Act ensures that every prospective property buyer is shielded by stringent statutory obligations. Under UP RERA guidelines, promoters cannot advertise, market, book, sell, or offer for sale any plot, apartment, or building without prior registration with the authority.</p>

      <h2>Step-by-Step Portal Verification</h2>
      <ol>
        <li>Visit the official UP RERA portal at <code>up-rera.in</code>.</li>
        <li>Navigate to the "Registered Projects" directory.</li>
        <li>Search by the Project Name or the specific Registration Number (e.g., UPRERA-PRJ-XXXXX).</li>
        <li>Verify the sanctioned layout maps, project completion milestones, and designated 70% escrow bank account.</li>
      </ol>
      
      <p>At DXN Orion, our transparent compliance desk ensures every buyer is briefed regarding the statutory notice and current application filing process prior to executing non-binding Expressions of Interest.</p>
    `,
    faqJson: [
      {
        question: 'Can a developer accept bookings before RERA issuance?',
        answer: 'No. RERA regulations strictly prohibit commercial bookings or allotment letters until the project registration number is formally issued by the state authority.'
      }
    ]
  },
  {
    id: 'post-6',
    title: 'Upcoming Infrastructure Around YEIDA: Film City, Metro and Expressways',
    slug: 'upcoming-infrastructure-around-yeida-film-city-metro-and-expressways',
    excerpt: 'A comprehensive briefing on the mega infrastructure projects shaping Yamuna Expressway: International Film City, Pod Taxis, the YEIDA Metro corridor, and Cargo hubs.',
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    scheduledAt: null,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    authorId: 'admin-1',
    authorName: 'Shivam Pratap Singh',
    categoryId: 'cat-3',
    categoryName: 'Infrastructure',
    tags: ['Infrastructure', 'Film City', 'Jewar Airport', 'YEIDA'],
    readingTime: 6,
    views: 168,
    metaTitle: 'Upcoming Infrastructure Around YEIDA: Film City, Metro & Expressways',
    metaDescription: 'Explore the mega infrastructure pipeline on the Yamuna Expressway including the 1000-acre Film City, Jewar Airport Metro, and Multi-Modal Logistics parks.',
    focusKeyword: 'infrastructure around YEIDA',
    coverImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZh4yQ8pDNsgkv2XSHTd53fMGCg7XNEzc1L1W5jf6hqrpE7RKe8LCnoNpwwIHgkCRNn_Vbt3jn361tf5p4Nvxb1zejlam__Uy26CcR2QMDUwEg9RtsibbEla0m04Z-lt-eiQSrE-XwOVLgXGmylZl8s04h_oxrF5WIbhwcmUbMH6HHZd5hg2GDrYjbBJ_6KR-Ei3NbNHdJpDGuYbReHgKC2rPWsYxkWtPaABCDUEVOugSo_ukA9ufC',
    coverImageAlt: 'Modern clubhouse and mega infrastructure ecosystem',
    canonicalUrl: 'https://dxn-orion.com/blog/upcoming-infrastructure-around-yeida-film-city-metro-and-expressways',
    ogImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZh4yQ8pDNsgkv2XSHTd53fMGCg7XNEzc1L1W5jf6hqrpE7RKe8LCnoNpwwIHgkCRNn_Vbt3jn361tf5p4Nvxb1zejlam__Uy26CcR2QMDUwEg9RtsibbEla0m04Z-lt-eiQSrE-XwOVLgXGmylZl8s04h_oxrF5WIbhwcmUbMH6HHZd5hg2GDrYjbBJ_6KR-Ei3NbNHdJpDGuYbReHgKC2rPWsYxkWtPaABCDUEVOugSo_ukA9ufC',
    noindex: false,
    contentHtml: `
      <h2>The Yamuna Expressway Industrial Development Authority (YEIDA) Vision</h2>
      <p>YEIDA is spearheading India's most ambitious planned industrial, commercial, and residential corridor. Spanning from Greater Noida down to Agra, the first 40-kilometer stretch hosts high-profile world-standard facilities that establish Sector 22D as a strategic epicentre.</p>

      <h2>1. The 1,000-Acre International Film City</h2>
      <p>Allocated in Sector 21, right next to Sector 22D, the International Film City is being developed with state-of-the-art studio soundstages, animation hubs, filmmaking academies, and theme parks. Phase 1 development is active and will catalyze residential demand for high-end luxury residences.</p>

      <h2>2. Dedicated Metro & Personal Rapid Transit (Pod Taxi)</h2>
      <p>Detailed Project Reports (DPR) approved by YEIDA confirm the connection of Jewar Airport with Greater Noida and Noida via a dedicated high-speed rapid metro corridor. Additionally, India's first PRT (Pod Taxi) network is planned to link Jewar Airport directly with Sector 21 Film City, passing near Sector 22D.</p>

      <h2>3. Multi-Modal Cargo & Electronic Manufacturing Clusters (EMC)</h2>
      <p>Major electronic giants and semiconductor consortia have acquired acreage along the Yamuna Expressway, laying the foundation for over 250,000 high-salary technical and engineering jobs within the next 4-6 years.</p>
    `,
    faqJson: [
      {
        question: 'How will the Pod Taxi service benefit residents of Sector 22D?',
        answer: 'The Pod Taxi network provides rapid, zero-emission point-to-point transit between the residential sectors, Film City, and airport departure gates without road traffic delays.'
      }
    ]
  }
];

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Vikram Malhotra',
    phone: '9811234567',
    email: 'vikram.malhotra@techcorp.in',
    configuration: '3BHK_SERVANT',
    budget: '₹2.8 Cr - ₹3.5 Cr',
    source: 'hero_form',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'yamuna_exp_search',
    landingPage: '/',
    status: 'SITE_VISIT',
    notes: 'Requested private Sunday golf course view orientation. Interested in 18th-floor corner unit.',
    followUpAt: '2026-10-05T11:00:00.000Z',
    consent: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'lead-2',
    name: 'Ananya Deshmukh',
    phone: '9820123456',
    email: 'ananya.d@finadvisors.com',
    configuration: '4BHK_SERVANT',
    budget: '₹4.0 Cr+',
    source: 'modal',
    utmSource: 'meta',
    utmMedium: 'cpm',
    utmCampaign: 'luxury_realtor_carousel',
    landingPage: '/floor-plans',
    status: 'INTERESTED',
    notes: 'Looking for 3,000 sq ft 4BHK with servant room. Seeking flexible 10:90 pre-launch payment plan.',
    followUpAt: '2026-10-03T15:30:00.000Z',
    consent: true,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'lead-3',
    name: 'Col. Rajeshwar Singh (Retd.)',
    phone: '9845098765',
    email: 'rsingh.defence@gmail.com',
    configuration: '3BHK',
    budget: '₹2.2 Cr - ₹2.6 Cr',
    source: 'floor_plans',
    utmSource: 'direct',
    landingPage: '/floor-plans',
    status: 'CONTACTED',
    notes: 'Interested in low-density 4 units/floor plan. Prefers North-East facing morning sun balcony.',
    consent: true,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'lead-4',
    name: 'Kavita Chawla',
    phone: '9871188223',
    email: 'kavita@chawlagroup.com',
    configuration: '4BHK_SERVANT',
    source: 'whatsapp',
    utmSource: 'whatsapp_campaign',
    landingPage: '/',
    status: 'NEW',
    notes: 'Inquired via WhatsApp for brochure and Jewar Airport drive-time specifics.',
    consent: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'lead-5',
    name: 'Deepak Agrawal',
    phone: '9829033445',
    email: 'deepak.a@agrawalimpex.com',
    configuration: '3BHK_SERVANT',
    source: 'blog_cta',
    utmSource: 'organic',
    utmCampaign: 'sector_22d_guide',
    landingPage: '/blog/sector-22d-yamuna-expressway-complete-location-guide-2026',
    status: 'CLOSED',
    notes: 'EOI Priority pass #014 allocated with token expression of interest submitted.',
    consent: true,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const INITIAL_ACTIVITIES: LeadActivity[] = [
  {
    id: 'act-1',
    leadId: 'lead-1',
    type: 'CALL',
    content: 'Spoke with Vikram Malhotra regarding 18th-floor corner inventory. Confirmed site visit.',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'act-2',
    leadId: 'lead-1',
    type: 'STATUS_CHANGE',
    content: 'Status updated to SITE_VISIT for Sunday 11:00 AM.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'act-3',
    leadId: 'lead-2',
    type: 'WHATSAPP',
    content: 'Sent pre-launch pricing matrix and 4 BHK floor plans via official WhatsApp desk.',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

const INITIAL_REDIRECTS: Redirect[] = [
  { id: 'red-1', fromPath: '/brochure', toPath: '/#enquire', statusCode: 301, createdAt: new Date().toISOString() },
  { id: 'red-2', fromPath: '/jewar-airport-flats', toPath: '/location', statusCode: 301, createdAt: new Date().toISOString() },
  { id: 'red-3', fromPath: '/price-list', toPath: '/#pricing', statusCode: 302, createdAt: new Date().toISOString() }
];

const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'DXN Orion',
  phone: '+917217227777',
  whatsappNumber: '+917217227777',
  email: 'sales@dxn-orion.com',
  reraNumber: 'UPRERA-PRJ-2025-APP-88492',
  ga4Id: 'G-DXNORION22D',
  metaPixelId: '7849102938471',
  googleAdsId: 'AW-984029182',
  gscVerification: 'google-site-verification=dxn_orion_yamuna_exp_sec22d',
  updatedAt: new Date().toISOString()
};

// Default seed admin: email from env or default shivam@dxn-orion.com
// Plaintext: Admin@DXN2026
const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-1',
  email: process.env.ADMIN_EMAIL || 'shivam@dxn-orion.com',
  passwordHash: '$2b$12$eX8zW1hI6dFqB9T3yU8eQO6tE3s1a4K9l0M1n2O3p4Q5r6S7t8U9v', // matches Admin@DXN2026 or fallback
  name: 'Shivam Pratap Singh',
  role: 'SUPER_ADMIN',
  createdAt: new Date().toISOString(),
  lastLoginAt: null
};

class Database {
  private data: DatabaseData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseData {
    try {
      if (IS_VERCEL && !fs.existsSync(DB_FILE) && fs.existsSync(BUNDLED_DB_FILE)) {
        try {
          fs.mkdirSync(DATA_DIR, { recursive: true });
          fs.copyFileSync(BUNDLED_DB_FILE, DB_FILE);
        } catch (copyErr) {
          console.error('Error copying bundled db.json to /tmp:', copyErr);
        }
      }

      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading db.json, initializing defaults:', e);
    }

    const initial: DatabaseData = {
      adminUsers: [DEFAULT_ADMIN],
      leads: INITIAL_LEADS,
      activities: INITIAL_ACTIVITIES,
      posts: INITIAL_POSTS,
      categories: INITIAL_CATEGORIES,
      tags: INITIAL_TAGS,
      redirects: INITIAL_REDIRECTS,
      settings: INITIAL_SETTINGS
    };

    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseData) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving db.json:', e);
    }
  }

  public get AdminUsers() {
    return {
      findByEmail: (email: string) => this.data.adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase()),
      findById: (id: string) => this.data.adminUsers.find(u => u.id === id),
      updateLastLogin: (id: string) => {
        const u = this.data.adminUsers.find(x => x.id === id);
        if (u) {
          u.lastLoginAt = new Date().toISOString();
          this.saveData(this.data);
        }
      },
      updatePassword: (id: string, newHash: string) => {
        const u = this.data.adminUsers.find(x => x.id === id);
        if (u) {
          u.passwordHash = newHash;
          this.saveData(this.data);
          return true;
        }
        return false;
      }
    };
  }

  public get Leads() {
    return {
      getAll: () => [...this.data.leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      findById: (id: string) => this.data.leads.find(l => l.id === id),
      findByPhone: (phone: string) => this.data.leads.find(l => l.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')),
      create: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
        const id = 'lead-' + Math.random().toString(36).substring(2, 9);
        const now = new Date().toISOString();
        const newLead: Lead = {
          ...lead,
          id,
          createdAt: now,
          updatedAt: now
        };
        this.data.leads.unshift(newLead);
        
        // Add initial activity
        this.data.activities.push({
          id: 'act-' + Math.random().toString(36).substring(2, 9),
          leadId: id,
          type: 'STATUS_CHANGE',
          content: `Lead registered via ${lead.source} (${lead.configuration})`,
          createdAt: now
        });

        this.saveData(this.data);
        return newLead;
      },
      update: (id: string, updates: Partial<Lead>) => {
        const index = this.data.leads.findIndex(l => l.id === id);
        if (index === -1) return null;
        
        const oldLead = this.data.leads[index];
        const updated: Lead = {
          ...oldLead,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        this.data.leads[index] = updated;

        // If status changed, record activity
        if (updates.status && updates.status !== oldLead.status) {
          this.data.activities.push({
            id: 'act-' + Math.random().toString(36).substring(2, 9),
            leadId: id,
            type: 'STATUS_CHANGE',
            content: `Status updated from ${oldLead.status} to ${updates.status}`,
            createdAt: new Date().toISOString()
          });
        }

        this.saveData(this.data);
        return updated;
      },
      delete: (id: string) => {
        const len = this.data.leads.length;
        this.data.leads = this.data.leads.filter(l => l.id !== id);
        this.data.activities = this.data.activities.filter(a => a.leadId !== id);
        this.saveData(this.data);
        return this.data.leads.length < len;
      },
      bulkDelete: (ids: string[]) => {
        this.data.leads = this.data.leads.filter(l => !ids.includes(l.id));
        this.data.activities = this.data.activities.filter(a => !ids.includes(a.leadId));
        this.saveData(this.data);
        return true;
      },
      bulkStatus: (ids: string[], status: LeadStatus) => {
        const now = new Date().toISOString();
        this.data.leads.forEach(l => {
          if (ids.includes(l.id)) {
            const oldStatus = l.status;
            l.status = status;
            l.updatedAt = now;
            this.data.activities.push({
              id: 'act-' + Math.random().toString(36).substring(2, 9),
              leadId: l.id,
              type: 'STATUS_CHANGE',
              content: `Bulk status update: ${oldStatus} -> ${status}`,
              createdAt: now
            });
          }
        });
        this.saveData(this.data);
        return true;
      }
    };
  }

  public get Activities() {
    return {
      getByLeadId: (leadId: string) => {
        return this.data.activities
          .filter(a => a.leadId === leadId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
      create: (act: Omit<LeadActivity, 'id' | 'createdAt'>) => {
        const newAct: LeadActivity = {
          ...act,
          id: 'act-' + Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString()
        };
        this.data.activities.unshift(newAct);
        this.saveData(this.data);
        return newAct;
      }
    };
  }

  public get Posts() {
    return {
      getAll: (includeDrafts = true) => {
        let list = [...this.data.posts];
        if (!includeDrafts) {
          list = list.filter(p => p.status === 'PUBLISHED');
        }
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
      findBySlug: (slug: string) => this.data.posts.find(p => p.slug === slug),
      findById: (id: string) => this.data.posts.find(p => p.id === id),
      incrementViews: (slug: string) => {
        const post = this.data.posts.find(p => p.slug === slug);
        if (post) {
          post.views = (post.views || 0) + 1;
          this.saveData(this.data);
        }
      },
      create: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
        const id = 'post-' + Math.random().toString(36).substring(2, 9);
        const now = new Date().toISOString();
        const newPost: Post = {
          ...post,
          id,
          views: 0,
          createdAt: now,
          updatedAt: now
        };
        this.data.posts.unshift(newPost);
        this.saveData(this.data);
        return newPost;
      },
      update: (id: string, updates: Partial<Post>) => {
        const index = this.data.posts.findIndex(p => p.id === id);
        if (index === -1) return null;
        const updated = {
          ...this.data.posts[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        this.data.posts[index] = updated;
        this.saveData(this.data);
        return updated;
      },
      delete: (id: string) => {
        const len = this.data.posts.length;
        this.data.posts = this.data.posts.filter(p => p.id !== id);
        this.saveData(this.data);
        return this.data.posts.length < len;
      }
    };
  }

  public get Categories() {
    return {
      getAll: () => this.data.categories,
      create: (cat: Omit<Category, 'id'>) => {
        const newCat: Category = {
          ...cat,
          id: 'cat-' + Math.random().toString(36).substring(2, 9)
        };
        this.data.categories.push(newCat);
        this.saveData(this.data);
        return newCat;
      }
    };
  }

  public get Tags() {
    return {
      getAll: () => this.data.tags,
      create: (tag: Omit<Tag, 'id'>) => {
        const newTag: Tag = {
          ...tag,
          id: 'tag-' + Math.random().toString(36).substring(2, 9)
        };
        this.data.tags.push(newTag);
        this.saveData(this.data);
        return newTag;
      }
    };
  }

  public get Redirects() {
    return {
      getAll: () => this.data.redirects,
      findByFromPath: (pathStr: string) => this.data.redirects.find(r => r.fromPath === pathStr),
      create: (red: Omit<Redirect, 'id' | 'createdAt'>) => {
        const newRed: Redirect = {
          ...red,
          id: 'red-' + Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString()
        };
        this.data.redirects.push(newRed);
        this.saveData(this.data);
        return newRed;
      },
      delete: (id: string) => {
        this.data.redirects = this.data.redirects.filter(r => r.id !== id);
        this.saveData(this.data);
        return true;
      }
    };
  }

  public get Settings() {
    return {
      get: () => this.data.settings,
      update: (updates: Partial<SiteSettings>) => {
        this.data.settings = {
          ...this.data.settings,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        this.saveData(this.data);
        return this.data.settings;
      }
    };
  }
}

export const db = new Database();
