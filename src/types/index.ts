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
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
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
  relatedPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    coverImageUrl: string;
    readingTime: number;
    categoryName: string;
    createdAt: string;
  }>;
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

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
