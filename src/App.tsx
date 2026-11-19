import { useEffect, useState } from 'react';
import { CreatorProfileModal } from './components/CreatorProfileModal';
import { Header } from './components/Header';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { AdminPage } from './pages/AdminPage';
import { BrandDashboardPage } from './pages/BrandDashboardPage';
import { CreatorApplyPage } from './pages/CreatorApplyPage';
import { CreatorDashboardPage } from './pages/CreatorDashboardPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { LandingPage } from './pages/LandingPage';
import { ShortlistRequestPage } from './pages/ShortlistRequestPage';
import { AppProvider, useApp } from './store/AppContext';
import type { Creator, PageRoute } from './types';

const PUBLIC_PAGES: PageRoute[] = ['landing', 'directory', 'shortlist-request', 'creator-apply'];

function MicroMatchShell() {
  const { state } = useApp();
  const [page, setPage] = useState<PageRoute>('landing');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  const navigate = (nextPage: PageRoute) => {
    setPage(nextPage);
    setSelectedCreator(null);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [page]);

  const showWhatsApp = PUBLIC_PAGES.includes(page);
  const creatorPackages = selectedCreator
    ? state.packages.filter((p) => p.creator_id === selectedCreator.id)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900">
      <Header currentPage={page} onNavigate={navigate} />

      <main className="flex-1">
        {page === 'landing' && (
          <LandingPage onNavigate={navigate} onSelectCreator={setSelectedCreator} />
        )}
        {page === 'directory' && (
          <DirectoryPage onNavigate={navigate} onSelectCreator={setSelectedCreator} />
        )}
        {page === 'shortlist-request' && <ShortlistRequestPage onNavigate={navigate} />}
        {page === 'brand-dashboard' && <BrandDashboardPage onNavigate={navigate} />}
        {page === 'creator-apply' && <CreatorApplyPage onNavigate={navigate} />}
        {page === 'creator-dashboard' && <CreatorDashboardPage onNavigate={navigate} />}
        {page === 'admin' && <AdminPage />}
      </main>

      {showWhatsApp && <WhatsAppFloatingButton />}

      <CreatorProfileModal
        creator={selectedCreator}
        packages={creatorPackages}
        onClose={() => setSelectedCreator(null)}
        onRequestShortlist={() => navigate('shortlist-request')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MicroMatchShell />
    </AppProvider>
  );
}
