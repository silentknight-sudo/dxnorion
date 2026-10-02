import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { StickyBottomBar } from './components/StickyBottomBar.tsx';
import { LeadModal } from './components/LeadModal.tsx';
import { ExitIntentModal } from './components/ExitIntentModal.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { FloorPlansPage } from './pages/FloorPlansPage.tsx';
import { AmenitiesPage } from './pages/AmenitiesPage.tsx';
import { LocationPage } from './pages/LocationPage.tsx';
import { BlogListPage } from './pages/BlogListPage.tsx';
import { BlogPostPage } from './pages/BlogPostPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { LegalPage } from './pages/LegalPage.tsx';
import { ThankYouPage } from './pages/ThankYouPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

import { AdminLoginPage } from './pages/admin/AdminLoginPage.tsx';
import { AdminLayout } from './pages/admin/AdminLayout.tsx';

import { captureUtmParams } from './utils/utm.ts';
import { SiteSettings } from './types/index.ts';
import './lib/firebase.ts';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState<string>('Request Priority Brochure');
  const [modalConfig, setModalConfig] = useState<string>('3BHK_SERVANT');
  const [lastSubmittedLeadId, setLastSubmittedLeadId] = useState<string | undefined>(undefined);

  // Admin authentication state
  const [adminUser, setAdminUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Dynamic Site Settings (RERA number, phone, email, etc.)
  const [settings, setSettings] = useState<SiteSettings>({
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
  });

  useEffect(() => {
    // 1. Capture first-touch UTM attribution from URL query params
    captureUtmParams();

    // 2. Fetch live site settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});

    // 3. Verify Admin session
    fetch('/api/admin/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setAdminUser(data);
      })
      .catch(() => {})
      .finally(() => setAuthChecking(false));

    // 4. Handle browser back/forward buttons
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const handleOpenEnquiry = (contextTitle?: string, configuration?: string) => {
    if (contextTitle) setModalContext(contextTitle);
    if (configuration) setModalConfig(configuration);
    setLeadModalOpen(true);
  };

  const handleLeadSuccess = (leadId: string) => {
    setLastSubmittedLeadId(leadId);
    setLeadModalOpen(false);
    navigate('/thank-you');
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateListing',
        '@id': 'https://dxn-orion.com/#listing',
        name: 'DXN Orion Luxury Residences',
        description: 'Ultra-modern 3 & 4 BHK sky estates overlooking golf courses in Sector 22D, Yamuna Expressway.',
        url: 'https://dxn-orion.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Sector 22D, Yamuna Expressway',
          addressLocality: 'Greater Noida',
          addressRegion: 'Uttar Pradesh',
          postalCode: '203201',
          addressCountry: 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '28.2831',
          longitude: '77.5312'
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: 'Price on Request',
          availability: 'https://schema.org/PreOrder'
        }
      },
      {
        '@type': 'Organization',
        '@id': 'https://dxn-orion.com/#organization',
        name: 'DXN Orion',
        url: 'https://dxn-orion.com',
        logo: 'https://dxn-orion.com/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: settings.phone,
          contactType: 'sales',
          areaServed: 'IN',
          availableLanguage: ['en', 'Hindi']
        }
      }
    ]
  };

  // Check if route is an Admin route
  const isAdminRoute = currentPath.startsWith('/admin');

  // Render Admin View
  if (isAdminRoute) {
    if (currentPath === '/admin/login') {
      return (
        <AdminLoginPage
          onLoginSuccess={(user) => {
            setAdminUser(user);
            navigate('/admin');
          }}
          onNavigate={navigate}
        />
      );
    }

    if (authChecking) {
      return (
        <div className="min-h-screen bg-[#0B1426] flex items-center justify-center text-xs text-[#94A3B8]">
          Verifying security privileges...
        </div>
      );
    }

    if (!adminUser) {
      return (
        <AdminLoginPage
          onLoginSuccess={(user) => {
            setAdminUser(user);
            navigate('/admin');
          }}
          onNavigate={navigate}
        />
      );
    }

    return (
      <AdminLayout
        user={adminUser}
        onLogout={async () => {
          await fetch('/api/admin/logout', { method: 'POST' });
          setAdminUser(null);
          navigate('/admin/login');
        }}
        onNavigatePublic={navigate}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
      />
    );
  }

  // Parse Public Routes
  let pageContent: React.ReactNode = null;

  if (currentPath === '/' || currentPath === '/home') {
    pageContent = (
      <HomePage
        onOpenEnquiry={handleOpenEnquiry}
        onNavigate={navigate}
        onLeadSuccess={handleLeadSuccess}
      />
    );
  } else if (currentPath === '/floor-plans') {
    pageContent = (
      <FloorPlansPage
        onOpenEnquiry={handleOpenEnquiry}
        onNavigate={navigate}
      />
    );
  } else if (currentPath === '/amenities') {
    pageContent = (
      <AmenitiesPage
        onOpenEnquiry={handleOpenEnquiry}
        onNavigate={navigate}
      />
    );
  } else if (currentPath === '/location') {
    pageContent = (
      <LocationPage
        onOpenEnquiry={handleOpenEnquiry}
        onNavigate={navigate}
      />
    );
  } else if (currentPath === '/blog') {
    pageContent = (
      <BlogListPage
        onNavigate={navigate}
        onOpenEnquiry={handleOpenEnquiry}
      />
    );
  } else if (currentPath.startsWith('/blog/category/')) {
    const catSlug = currentPath.replace('/blog/category/', '');
    pageContent = (
      <BlogListPage
        onNavigate={navigate}
        onOpenEnquiry={handleOpenEnquiry}
        categoryFilter={catSlug}
      />
    );
  } else if (currentPath.startsWith('/blog/tag/')) {
    const tagSlug = currentPath.replace('/blog/tag/', '');
    pageContent = (
      <BlogListPage
        onNavigate={navigate}
        onOpenEnquiry={handleOpenEnquiry}
        tagFilter={tagSlug}
      />
    );
  } else if (currentPath.startsWith('/blog/')) {
    const postSlug = currentPath.replace('/blog/', '');
    pageContent = (
      <BlogPostPage
        slug={postSlug}
        onNavigate={navigate}
        onOpenEnquiry={handleOpenEnquiry}
      />
    );
  } else if (currentPath === '/contact') {
    pageContent = (
      <ContactPage
        onLeadSuccess={handleLeadSuccess}
        phone={settings.phone}
        whatsappNumber={settings.whatsappNumber}
        email={settings.email}
      />
    );
  } else if (currentPath === '/privacy-policy') {
    pageContent = (
      <LegalPage
        type="privacy"
        reraNumber={settings.reraNumber}
        onNavigate={navigate}
      />
    );
  } else if (currentPath === '/disclaimer') {
    pageContent = (
      <LegalPage
        type="disclaimer"
        reraNumber={settings.reraNumber}
        onNavigate={navigate}
      />
    );
  } else if (currentPath === '/thank-you') {
    pageContent = (
      <ThankYouPage
        leadId={lastSubmittedLeadId}
        onNavigate={navigate}
        whatsappNumber={settings.whatsappNumber}
      />
    );
  } else {
    pageContent = (
      <NotFoundPage
        onNavigate={navigate}
        onOpenEnquiry={handleOpenEnquiry}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1426] text-[#F7F4EE] flex flex-col font-sans selection:bg-[#C9A86A] selection:text-[#0B1426]">
      {/* Dynamic JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Sticky Luxury Header */}
      <Header
        activePath={currentPath}
        onOpenEnquiry={handleOpenEnquiry}
        onNavigate={navigate}
      />

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {pageContent}
      </main>

      {/* Global Modals */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        contextTitle={modalContext}
        defaultConfig={modalConfig}
        onSuccessRedirect={handleLeadSuccess}
      />

      <ExitIntentModal onOpenEnquiry={handleOpenEnquiry} />

      {/* Sticky Bottom Bar (Mobile/Responsive) */}
      <StickyBottomBar
        onOpenEnquiry={handleOpenEnquiry}
        phone={settings.phone}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Footer with Compliance Notices */}
      <Footer
        reraNumber={settings.reraNumber}
        onNavigate={navigate}
      />
    </div>
  );
}
