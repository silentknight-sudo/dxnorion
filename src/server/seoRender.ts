// Server-side SEO rendering: injects route-specific <head> tags, JSON-LD and crawlable
// content into the SPA's index.html so search engines and AI crawlers get real HTML per URL.
import {
  PAGE_SEO, NOT_FOUND_SEO, SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE,
  PageSeo, wrapBody, categorySeo, clampDescription
} from '../seo/pages.ts';

export interface SeoPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  coverImageUrl: string;
  coverImageAlt: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  categoryName: string;
  categoryId: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  ogImageUrl?: string;
  noindex: boolean;
  faqJson: { question: string; answer: string }[];
}

export interface SeoCategory { id: string; name: string; slug: string; description: string }

export interface SeoDeps {
  getPosts: () => Promise<SeoPost[]>; // published posts only
  getCategories: () => SeoCategory[];
}

const esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ORG_REF = { '@id': `${SITE_URL}/#organization` };
const ORG_FULL = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'DXN Orion',
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png`, width: 178, height: 63 },
  telephone: '+917217227777'
};

function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.path}`
    }))
  };
}

const isHttpUrl = (u?: string) => !!u && /^https?:\/\//.test(u);

interface Rendered {
  status: number;
  seo: PageSeo;
  path: string;
  image: string;
  type: 'website' | 'article';
  jsonLd: object[];
  bodyHtml: string;
}

async function resolve(pathname: string, deps: SeoDeps): Promise<Rendered> {
  const path = pathname.replace(/\/+$/, '') || '/';
  const home = { name: 'Home', path: '/' };

  // Blog post
  const postMatch = path.match(/^\/blog\/([^/]+)$/);
  if (postMatch && path !== '/blog/rss.xml') {
    const slug = decodeURIComponent(postMatch[1]);
    const posts = await deps.getPosts();
    const post = posts.find(p => p.slug === slug);
    if (post) {
      const url = `/blog/${post.slug}`;
      const image = isHttpUrl(post.ogImageUrl) ? post.ogImageUrl! : isHttpUrl(post.coverImageUrl) ? post.coverImageUrl : DEFAULT_OG_IMAGE;
      const description = clampDescription(post.metaDescription || post.excerpt || post.title);
      const related = posts.filter(p => p.id !== post.id).slice(0, 5);
      const jsonLd: object[] = [
        {
          '@type': 'BlogPosting',
          '@id': `${SITE_URL}${url}#article`,
          headline: post.title.slice(0, 110),
          description,
          image: [image],
          datePublished: post.publishedAt || post.createdAt,
          dateModified: post.updatedAt,
          author: { '@type': 'Person', name: post.authorName || 'DXN Orion' },
          publisher: ORG_FULL,
          mainEntityOfPage: `${SITE_URL}${url}`,
          articleSection: post.categoryName,
          keywords: post.tags.join(', '),
          inLanguage: 'en-IN'
        },
        breadcrumbLd([home, { name: 'Blog', path: '/blog' }, { name: post.title, path: url }])
      ];
      if (post.faqJson?.length) {
        jsonLd.push({
          '@type': 'FAQPage',
          mainEntity: post.faqJson.map(f => ({
            '@type': 'Question', name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer }
          }))
        });
      }
      // Strip inline base64 images from the crawler copy to keep the HTML light.
      const content = post.contentHtml.replace(/<img[^>]+src="data:[^"]*"[^>]*>/gi, '');
      const faqHtml = post.faqJson?.length
        ? `<h2>Frequently Asked Questions</h2>${post.faqJson.map(f => `<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`).join('')}`
        : '';
      const bodyHtml = wrapBody(`<article>
<h1>${esc(post.title)}</h1>
<p><time datetime="${esc(post.publishedAt || post.createdAt)}">${esc((post.publishedAt || post.createdAt).split('T')[0])}</time> · ${esc(post.authorName)} · ${esc(post.categoryName)}</p>
${isHttpUrl(post.coverImageUrl) ? `<img src="${esc(post.coverImageUrl)}" alt="${esc(post.coverImageAlt || post.title)}" />` : ''}
${content}
${faqHtml}
</article>
${related.length ? `<aside><h2>Related Yamuna Expressway Articles</h2><ul>${related.map(r => `<li><a href="/blog/${esc(r.slug)}">${esc(r.title)}</a></li>`).join('')}</ul></aside>` : ''}`);
      return {
        status: 200,
        seo: { title: post.metaTitle || post.title, description, noindex: post.noindex },
        path: url, image, type: 'article', jsonLd, bodyHtml
      };
    }
    return notFound(path);
  }

  // Blog index + category listings
  const catMatch = path.match(/^\/blog\/category\/([^/]+)$/);
  if (path === '/blog' || catMatch) {
    const posts = await deps.getPosts();
    let list = posts;
    let seo = PAGE_SEO['/blog'];
    let heading = 'Yamuna Expressway Real Estate Blog – DXN Orion Insights';
    let crumbs = [home, { name: 'Blog', path: '/blog' }];
    if (catMatch) {
      const cat = deps.getCategories().find(c => c.slug === catMatch[1]);
      if (!cat) return notFound(path);
      list = posts.filter(p => p.categoryId === cat.id || p.categoryName === cat.name);
      seo = categorySeo(cat.name, cat.description);
      heading = `${cat.name} – Yamuna Expressway Property Articles`;
      crumbs = [...crumbs, { name: cat.name, path }];
    }
    const jsonLd = [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}${path}#webpage`,
        name: seo.title,
        description: seo.description,
        url: `${SITE_URL}${path}`,
        publisher: ORG_REF,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/blog/${p.slug}`, name: p.title }))
        }
      },
      breadcrumbLd(crumbs)
    ];
    const cats = deps.getCategories();
    const bodyHtml = wrapBody(`<h1>${esc(heading)}</h1>
<p>${esc(seo.description)}</p>
${list.map(p => `<article><h2><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a></h2><p>${esc(p.excerpt)}</p></article>`).join('\n')}
<nav aria-label="Blog categories"><h2>Browse by Topic</h2><ul>${cats.map(c => `<li><a href="/blog/category/${esc(c.slug)}">${esc(c.name)}</a></li>`).join('')}</ul></nav>`);
    return { status: 200, seo, path, image: DEFAULT_OG_IMAGE, type: 'website', jsonLd, bodyHtml };
  }

  // Tag listings: thin duplicate content → noindex
  if (/^\/blog\/tag\/[^/]+$/.test(path)) {
    const name = decodeURIComponent(path.split('/').pop()!).replace(/-/g, ' ');
    return {
      status: 200, path, image: DEFAULT_OG_IMAGE, type: 'website', jsonLd: [],
      seo: { ...categorySeo(name, `Articles tagged ${name}.`), noindex: true },
      bodyHtml: wrapBody(`<h1>${esc(name)} – DXN Orion Blog</h1>`)
    };
  }

  const page = PAGE_SEO[path];
  if (page && path !== '/') {
    const jsonLd = [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}${path}#webpage`,
        name: page.title,
        description: page.description,
        url: `${SITE_URL}${path}`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#apartmentcomplex` },
        publisher: ORG_REF,
        inLanguage: 'en-IN'
      },
      breadcrumbLd([home, { name: page.breadcrumb || page.title, path }]),
      ORG_FULL
    ];
    return {
      status: 200, seo: page, path, image: DEFAULT_OG_IMAGE, type: 'website', jsonLd,
      bodyHtml: page.bodyHtml || wrapBody(`<h1>${esc(page.title)}</h1><p>${esc(page.description)}</p>`)
    };
  }

  return notFound(path);
}

function notFound(path: string): Rendered {
  return {
    status: 404, seo: NOT_FOUND_SEO, path, image: DEFAULT_OG_IMAGE, type: 'website', jsonLd: [],
    bodyHtml: wrapBody(`<h1>Page not found</h1><p>${esc(NOT_FOUND_SEO.description)}</p>`)
  };
}

function setTag(html: string, re: RegExp, replacement: string): string {
  return re.test(html) ? html.replace(re, replacement) : html.replace('</head>', `    ${replacement}\n  </head>`);
}

export async function renderSeoPage(template: string, pathname: string, deps: SeoDeps): Promise<{ status: number; html: string }> {
  const r = await resolve(pathname, deps);
  const url = `${SITE_URL}${r.path === '/' ? '/' : r.path}`;
  const title = esc(r.seo.title);
  const desc = esc(r.seo.description);
  const robots = r.seo.noindex
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = setTag(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${desc}" />`);
  html = setTag(html, /<meta name="robots"[^>]*>/, `<meta name="robots" content="${robots}" />`);
  html = setTag(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(url)}" />`);
  html = html.replace(/(<link rel="alternate" hreflang="[^"]+" href=")[^"]*(")/g, `$1${esc(url)}$2`);
  html = setTag(html, /<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${r.type}" />`);
  html = setTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`);
  html = setTag(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${desc}" />`);
  html = setTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${esc(url)}" />`);
  html = setTag(html, /<meta property="og:image" [^>]*>/, `<meta property="og:image" content="${esc(r.image)}" />`);
  html = setTag(html, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`);
  html = setTag(html, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${desc}" />`);
  html = setTag(html, /<meta name="twitter:image" [^>]*>/, `<meta name="twitter:image" content="${esc(r.image)}" />`);

  // Replace the homepage JSON-LD graph with page-specific structured data.
  const ld = r.jsonLd.length
    ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': r.jsonLd }).replace(/</g, '\\u003c')}</script>`
    : '';
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => ld);

  // Replace crawlable #root fallback content (React replaces it again on mount).
  html = html.replace(/<!--seo-root-start-->[\s\S]*?<!--seo-root-end-->/, () => `<!--seo-root-start-->${r.bodyHtml}<!--seo-root-end-->`);

  return { status: r.status, html };
}

export { SITE_NAME };
