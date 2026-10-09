import { SITE_URL, DEFAULT_OG_IMAGE } from './pages.ts';

export interface SeoTags {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  image?: string;
  type?: 'website' | 'article';
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setLink(rel: string, href: string, extra?: Record<string, string>) {
  const selector = extra?.hreflang ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]` : `link[rel="${rel}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (extra) Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.href = href;
}

// Updates title, description, canonical, hreflang, robots and social tags for the current route.
export function applySeo({ title, description, path, noindex, image, type = 'website' }: SeoTags) {
  if (typeof document === 'undefined') return;
  const url = `${SITE_URL}${path === '/' ? '/' : path.replace(/\/$/, '')}`;
  const img = image || DEFAULT_OG_IMAGE;

  document.title = title;
  setMeta('name', 'description', description);
  setMeta('name', 'robots', noindex
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  setLink('canonical', url);
  setLink('alternate', url, { hreflang: 'en-IN' });
  setLink('alternate', url, { hreflang: 'x-default' });

  setMeta('property', 'og:type', type);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:image', img);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', img);
}
