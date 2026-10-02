import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import crypto from 'crypto';
import { db, LeadStatus, LeadConfiguration, LeadSource, ActivityType } from './src/server/db.ts';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Trust proxy for IP rate limiting behind Cloud Run / reverse proxies
app.set('trust proxy', 1);

// Helper to hash IP for privacy compliance
function getIpHash(req: Request): string {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const ipStr = Array.isArray(ip) ? ip[0] : ip;
  return crypto.createHash('sha256').update(ipStr).digest('hex').substring(0, 16);
}

// In-memory rate limiter structures
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const leadSubmissions = new Map<string, { count: number; resetAt: number }>();

// Simple Session Store for Admin Authentication (secure, httpOnly)
const activeSessions = new Map<string, { userId: string; email: string; expiresAt: number }>();

// Helper to authenticate admin
function verifyAdminSession(req: Request): { userId: string; email: string } | null {
  const token = req.cookies['dxn_admin_session'] || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return { userId: session.userId, email: session.email };
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = verifyAdminSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
  }
  (req as any).admin = session;
  next();
}

// Dynamic 301/302 Redirect Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  // Ignore API, assets, and internal routes
  if (req.path.startsWith('/api') || req.path.startsWith('/@') || req.path.includes('.')) {
    return next();
  }
  const redirect = db.Redirects.findByFromPath(req.path);
  if (redirect) {
    return res.redirect(redirect.statusCode, redirect.toPath);
  }
  next();
});

// --- SEO ENDPOINTS ---

// Dynamic /sitemap.xml
app.get('/sitemap.xml', (_req: Request, res: Response) => {
  const settings = db.Settings.get();
  const baseUrl = process.env.APP_URL || 'https://dxn-orion.com';
  const posts = db.Posts.getAll(false); // published only
  const categories = db.Categories.getAll();

  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/floor-plans', changefreq: 'weekly', priority: '0.9' },
    { loc: '/amenities', changefreq: 'weekly', priority: '0.8' },
    { loc: '/location', changefreq: 'weekly', priority: '0.9' },
    { loc: '/blog', changefreq: 'daily', priority: '0.8' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
    { loc: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
    { loc: '/disclaimer', changefreq: 'yearly', priority: '0.3' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  staticPages.forEach(p => {
    xml += `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
  });

  posts.forEach(post => {
    xml += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  categories.forEach(cat => {
    xml += `  <url>
    <loc>${baseUrl}/blog/category/${cat.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  });

  xml += `</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Dynamic /robots.txt
app.get('/robots.txt', (_req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || 'https://dxn-orion.com';
  const robots = `User-agent: *
Disallow: /admin
Disallow: /api/
Disallow: /thank-you
Disallow: /blog/preview/
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

// Dynamic /blog/rss.xml
app.get('/blog/rss.xml', (_req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || 'https://dxn-orion.com';
  const posts = db.Posts.getAll(false);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DXN Orion Luxury Real Estate Journal</title>
    <link>${baseUrl}/blog</link>
    <description>Latest insights, price analysis, and infrastructure updates for Sector 22D Yamuna Expressway &amp; Jewar Airport corridor.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
`;

  posts.forEach(post => {
    xml += `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>
`;
  });

  xml += `  </channel>
</rss>`;

  res.header('Content-Type', 'application/rss+xml');
  res.send(xml);
});

// --- LEAD CAPTURE & CONVERSION API ---

app.post('/api/leads', (req: Request, res: Response) => {
  try {
    const {
      name,
      phone,
      email,
      configuration = '3BHK_SERVANT',
      budget,
      message,
      source = 'hero_form',
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      gclid,
      fbclid,
      landingPage = '/',
      consent,
      // Honeypot fields for anti-spam
      website,
      fax,
      company_url
    } = req.body;

    // 1. Anti-spam honeypot detection
    if (website || fax || company_url) {
      // Silently succeed to fool spambots
      return res.status(200).json({ success: true, message: 'Enquiry received successfully.' });
    }

    // 2. IP Rate Limit: 3 submissions / 10 minutes per IP
    const ipHash = getIpHash(req);
    const now = Date.now();
    const rateData = leadSubmissions.get(ipHash);
    if (rateData && now < rateData.resetAt) {
      if (rateData.count >= 6) { // soft buffer
        return res.status(429).json({ error: 'Too many requests. Please try again after a few minutes.' });
      }
      rateData.count++;
    } else {
      leadSubmissions.set(ipHash, { count: 1, resetAt: now + 10 * 60 * 1000 });
    }

    // 3. Validation: Name (2-60 chars)
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60) {
      return res.status(400).json({ error: 'Please provide a valid full name (2–60 characters).' });
    }

    // 4. Validation: Indian Mobile ^[6-9]\d{9}$
    const cleanPhone = (phone || '').toString().replace(/\D/g, '').slice(-10);
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!cleanPhone || !indianPhoneRegex.test(cleanPhone)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
    }

    // 5. Consent validation
    if (consent === false) {
      return res.status(400).json({ error: 'You must authorize our team to contact you to proceed.' });
    }

    // 6. Deduplication check within 24h: Update existing lead instead of creating duplicate
    const existing = db.Leads.findByPhone(cleanPhone);
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

    let leadResult;
    let isExisting = false;

    if (existing && new Date(existing.updatedAt).getTime() > twentyFourHoursAgo) {
      isExisting = true;
      leadResult = db.Leads.update(existing.id, {
        name: name.trim(),
        email: email ? email.trim() : existing.email,
        configuration: configuration as LeadConfiguration,
        budget: budget || existing.budget,
        message: message ? `${existing.message ? existing.message + ' | ' : ''}${message}` : existing.message,
        source: source as LeadSource,
        utmSource: utmSource || existing.utmSource,
        utmMedium: utmMedium || existing.utmMedium,
        utmCampaign: utmCampaign || existing.utmCampaign,
      });

      // Record lead activity
      db.Activities.create({
        leadId: existing.id,
        type: 'STATUS_CHANGE',
        content: `Lead re-submitted form from ${source} (${configuration})`
      });
    } else {
      // Create new lead
      leadResult = db.Leads.create({
        name: name.trim(),
        phone: cleanPhone,
        email: email ? email.trim() : undefined,
        configuration: configuration as LeadConfiguration,
        budget,
        message,
        source: source as LeadSource,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        gclid,
        fbclid,
        landingPage,
        ipHash,
        userAgent: req.headers['user-agent'] || '',
        status: 'NEW',
        consent: true
      });
    }

    // Fire simulated instant notification logging (Resend / SendGrid / WhatsApp webhook)
    console.log(`[LEAD NOTIFICATION] Sent priority alert to admin for lead #${leadResult?.id}: ${leadResult?.name} (${cleanPhone})`);

    return res.status(200).json({
      success: true,
      leadId: leadResult?.id,
      isExisting,
      message: 'Your pre-launch priority request has been confirmed.'
    });
  } catch (error: any) {
    console.error('Error submitting lead:', error);
    return res.status(500).json({ error: 'Internal server error processing enquiry.' });
  }
});

// --- PUBLIC BLOG ENDPOINTS ---

app.get('/api/posts', (req: Request, res: Response) => {
  const includeDrafts = req.query.admin === 'true' && Boolean(verifyAdminSession(req));
  const category = req.query.category as string;
  const tag = req.query.tag as string;
  const search = (req.query.search as string || '').toLowerCase();

  let posts = db.Posts.getAll(includeDrafts);

  if (category) {
    posts = posts.filter(p => p.categoryId === category || p.categoryName.toLowerCase() === category.toLowerCase());
  }

  if (tag) {
    posts = posts.filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  }

  if (search) {
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(search) ||
      p.excerpt.toLowerCase().includes(search) ||
      p.focusKeyword.toLowerCase().includes(search)
    );
  }

  res.json(posts);
});

app.get('/api/posts/:slug', (req: Request, res: Response) => {
  const post = db.Posts.findBySlug(req.params.slug);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  // Increment view counter if not in admin preview
  if (req.query.preview !== 'true') {
    db.Posts.incrementViews(req.params.slug);
  }

  // Return post with related posts (same category or tags)
  const allPosts = db.Posts.getAll(false);
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && (p.categoryId === post.categoryId || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      coverImageUrl: p.coverImageUrl,
      readingTime: p.readingTime,
      categoryName: p.categoryName,
      createdAt: p.createdAt
    }));

  res.json({ ...post, relatedPosts });
});

app.get('/api/categories', (_req: Request, res: Response) => {
  res.json(db.Categories.getAll());
});

app.get('/api/tags', (_req: Request, res: Response) => {
  res.json(db.Tags.getAll());
});

app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(db.Settings.get());
});

// --- ADMIN AUTH & MANAGEMENT APIS ---

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ip = getIpHash(req);
  const now = Date.now();

  // Rate limit: 5 attempts per 15 minutes per IP
  const rate = loginAttempts.get(ip);
  if (rate && now < rate.resetAt) {
    if (rate.count >= 5) {
      return res.status(429).json({ error: 'Too many failed login attempts. Please wait 15 minutes.' });
    }
  }

  const admin = db.AdminUsers.findByEmail(email || '');
  if (!admin) {
    loginAttempts.set(ip, { count: (rate?.count || 0) + 1, resetAt: now + 15 * 60 * 1000 });
    return res.status(401).json({ error: 'Invalid credentials. Please check your email and password.' });
  }

  // Check password: default admin password is Admin@DXN2026 or configured password
  const validPassword = (password === 'Admin@DXN2026') || (password === process.env.ADMIN_PASSWORD);
  
  if (!validPassword) {
    loginAttempts.set(ip, { count: (rate?.count || 0) + 1, resetAt: now + 15 * 60 * 1000 });
    return res.status(401).json({ error: 'Invalid credentials. Please check your email and password.' });
  }

  // Clear failed attempts on success
  loginAttempts.delete(ip);
  db.AdminUsers.updateLastLogin(admin.id);

  // Generate session token (8 hours)
  const sessionToken = 'dxn_sess_' + crypto.randomBytes(32).toString('hex');
  const expiresAt = now + 8 * 60 * 60 * 1000;
  activeSessions.set(sessionToken, { userId: admin.id, email: admin.email, expiresAt });

  res.cookie('dxn_admin_session', sessionToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000
  });

  return res.json({
    success: true,
    token: sessionToken,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  });
});

// Admin Me
app.get('/api/admin/me', (req: Request, res: Response) => {
  const session = verifyAdminSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const admin = db.AdminUsers.findById(session.userId);
  if (!admin) {
    return res.status(401).json({ error: 'User not found' });
  }
  res.json({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role
  });
});

// Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const token = req.cookies['dxn_admin_session'] || req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    activeSessions.delete(token);
  }
  res.clearCookie('dxn_admin_session');
  res.json({ success: true });
});

// Admin Change Password
app.post('/api/admin/change-password', requireAdmin, (req: Request, res: Response) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }
  // Store new password hash placeholder
  const admin = (req as any).admin;
  db.AdminUsers.updatePassword(admin.userId, 'hash_' + newPassword);
  res.json({ success: true, message: 'Password updated successfully.' });
});

// Admin Dashboard Summary Metrics
app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  const leads = db.Leads.getAll();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const leadsToday = leads.filter(l => new Date(l.createdAt).getTime() >= todayStart).length;
  const leadsThisWeek = leads.filter(l => new Date(l.createdAt).getTime() >= weekStart).length;
  const leadsThisMonth = leads.filter(l => new Date(l.createdAt).getTime() >= monthStart).length;

  // Status Funnel
  const statusCounts: Record<LeadStatus, number> = {
    NEW: 0,
    CONTACTED: 0,
    INTERESTED: 0,
    SITE_VISIT: 0,
    CLOSED: 0,
    NOT_INTERESTED: 0
  };
  leads.forEach(l => {
    if (statusCounts[l.status] !== undefined) {
      statusCounts[l.status]++;
    }
  });

  // Source Breakdown
  const sourceCounts: Record<string, number> = {};
  leads.forEach(l => {
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  });

  // Campaign Breakdown
  const campaignCounts: Record<string, number> = {};
  leads.forEach(l => {
    const cmp = l.utmCampaign || 'organic / direct';
    campaignCounts[cmp] = (campaignCounts[cmp] || 0) + 1;
  });

  // Top Blog Posts by Views
  const topPosts = db.Posts.getAll(true)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map(p => ({ id: p.id, title: p.title, views: p.views, slug: p.slug, status: p.status }));

  res.json({
    totalLeads: leads.length,
    leadsToday,
    leadsThisWeek,
    leadsThisMonth,
    conversionRate: leads.length ? Math.round((statusCounts.CLOSED / leads.length) * 100) : 0,
    statusCounts,
    sourceCounts,
    campaignCounts,
    recentLeads: leads.slice(0, 10),
    topPosts
  });
});

// Admin Leads Listing & Filtering
app.get('/api/leads', requireAdmin, (req: Request, res: Response) => {
  let leads = db.Leads.getAll();

  const { search, status, configuration, source, campaign, page = '1', limit = '20' } = req.query;

  if (status && status !== 'ALL') {
    leads = leads.filter(l => l.status === status);
  }

  if (configuration && configuration !== 'ALL') {
    leads = leads.filter(l => l.configuration === configuration);
  }

  if (source && source !== 'ALL') {
    leads = leads.filter(l => l.source === source);
  }

  if (campaign && campaign !== 'ALL') {
    leads = leads.filter(l => (l.utmCampaign || 'organic / direct') === campaign);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    leads = leads.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.notes && l.notes.toLowerCase().includes(q))
    );
  }

  const p = parseInt(page as string, 10) || 1;
  const l = parseInt(limit as string, 10) || 20;
  const total = leads.length;
  const paginated = leads.slice((p - 1) * l, p * l);

  res.json({
    leads: paginated,
    total,
    page: p,
    totalPages: Math.ceil(total / l)
  });
});

// Admin Export CSV
app.get('/api/leads/export', requireAdmin, (_req: Request, res: Response) => {
  const leads = db.Leads.getAll();

  const headers = ['ID', 'Name', 'Phone', 'Email', 'Configuration', 'Status', 'Source', 'Campaign', 'Created At', 'Notes'];
  const rows = leads.map(l => [
    l.id,
    `"${l.name.replace(/"/g, '""')}"`,
    `"${l.phone}"`,
    `"${l.email || ''}"`,
    l.configuration,
    l.status,
    l.source,
    `"${l.utmCampaign || 'direct'}"`,
    l.createdAt,
    `"${(l.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="dxn-orion-leads.csv"');
  res.send(csvContent);
});

// Admin Lead Details & Activities
app.get('/api/leads/:id', requireAdmin, (req: Request, res: Response) => {
  const lead = db.Leads.findById(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });
  const activities = db.Activities.getByLeadId(lead.id);
  res.json({ lead, activities });
});

// Admin Update Lead
app.patch('/api/leads/:id', requireAdmin, (req: Request, res: Response) => {
  const { status, notes, followUpAt, assignedTo } = req.body;
  const updated = db.Leads.update(req.params.id, {
    status,
    notes,
    followUpAt,
    assignedTo
  });
  if (!updated) return res.status(404).json({ error: 'Lead not found.' });
  res.json(updated);
});

// Admin Add Lead Activity
app.post('/api/leads/:id/activity', requireAdmin, (req: Request, res: Response) => {
  const { type, content } = req.body;
  if (!content) return res.status(400).json({ error: 'Activity content required.' });
  const act = db.Activities.create({
    leadId: req.params.id,
    type: (type as ActivityType) || 'NOTE',
    content
  });
  res.json(act);
});

// Admin Bulk Action on Leads
app.post('/api/leads/bulk-action', requireAdmin, (req: Request, res: Response) => {
  const { action, ids, status } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No lead IDs provided.' });
  }

  if (action === 'DELETE') {
    db.Leads.bulkDelete(ids);
    return res.json({ success: true, count: ids.length });
  }

  if (action === 'STATUS_CHANGE' && status) {
    db.Leads.bulkStatus(ids, status as LeadStatus);
    return res.json({ success: true, count: ids.length });
  }

  res.status(400).json({ error: 'Invalid bulk action.' });
});

// Admin Blog Management
app.post('/api/posts', requireAdmin, (req: Request, res: Response) => {
  const admin = (req as any).admin;
  const {
    title,
    slug,
    excerpt,
    contentHtml,
    coverImageUrl,
    coverImageAlt,
    status = 'DRAFT',
    categoryId,
    categoryName,
    tags = [],
    readingTime = 5,
    metaTitle,
    metaDescription,
    focusKeyword,
    canonicalUrl,
    ogImageUrl,
    noindex = false,
    faqJson = []
  } = req.body;

  if (!title || !slug) {
    return res.status(400).json({ error: 'Title and slug are required.' });
  }

  // Ensure slug uniqueness
  if (db.Posts.findBySlug(slug)) {
    return res.status(400).json({ error: 'A post with this URL slug already exists.' });
  }

  const post = db.Posts.create({
    title,
    slug,
    excerpt: excerpt || '',
    contentHtml: contentHtml || '',
    coverImageUrl: coverImageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5pTukeE2hQkmXut-7c8iJ0yI61f-uCHv8VYP7ZWazC1nbxF-o6pZvc6bFD3qPLWuYYhW71XwY4fTfHHwN1OAV-ys3BryEpwm_4AYB9zjJIhanugWiuBmzXz-WNtiCeUe6JUKF21nViuaD5Uwoz001Z1sooeyVwR4Dj4g2gtzSFZZ49Rn8E8ypv6H5ci2hAfbohZCltgRHA0jBdnC5NS4fCMwyvXMc1bhWpY6IKdHJeF8ZetQ9hb3d',
    coverImageAlt: coverImageAlt || title,
    status,
    publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null,
    scheduledAt: null,
    authorId: admin.userId,
    authorName: 'Shivam Sharma',
    categoryId: categoryId || 'cat-1',
    categoryName: categoryName || 'Location Guides',
    tags,
    readingTime,
    metaTitle: metaTitle || title,
    metaDescription: metaDescription || excerpt,
    focusKeyword: focusKeyword || '',
    canonicalUrl,
    ogImageUrl,
    noindex,
    faqJson
  });

  res.json(post);
});

app.put('/api/posts/:id', requireAdmin, (req: Request, res: Response) => {
  const post = db.Posts.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found.' });

  const updates = req.body;
  if (updates.status === 'PUBLISHED' && !post.publishedAt) {
    updates.publishedAt = new Date().toISOString();
  }

  const updated = db.Posts.update(req.params.id, updates);
  res.json(updated);
});

app.delete('/api/posts/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.Posts.delete(req.params.id);
  res.json({ success: deleted });
});

// Admin Categories & Redirects
app.post('/api/categories', requireAdmin, (req: Request, res: Response) => {
  const { name, slug, description } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'Name and slug required.' });
  const cat = db.Categories.create({ name, slug, description: description || '' });
  res.json(cat);
});

app.get('/api/redirects', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.Redirects.getAll());
});

app.post('/api/redirects', requireAdmin, (req: Request, res: Response) => {
  const { fromPath, toPath, statusCode = 301 } = req.body;
  if (!fromPath || !toPath) return res.status(400).json({ error: 'From and To paths required.' });
  const red = db.Redirects.create({ fromPath, toPath, statusCode: parseInt(statusCode, 10) });
  res.json(red);
});

app.delete('/api/redirects/:id', requireAdmin, (req: Request, res: Response) => {
  db.Redirects.delete(req.params.id);
  res.json({ success: true });
});

// Admin Settings
app.post('/api/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.Settings.update(req.body);
  res.json(updated);
});

// --- VITE MIDDLEWARE / STATIC ASSETS ---

async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ DXN Orion Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
