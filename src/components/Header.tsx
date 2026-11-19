import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { PageRoute } from '../types';

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

const NAV_ITEMS: { id: PageRoute; label: string }[] = [
  { id: 'landing', label: 'Home' },
  { id: 'directory', label: 'Creators' },
  { id: 'brand-dashboard', label: 'Brand Portal' },
  { id: 'creator-dashboard', label: 'Creator Portal' },
  { id: 'admin', label: 'Admin' },
];

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageRoute) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleNav('landing')}
          className="font-display text-xl font-extrabold tracking-tight text-zinc-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
        >
          Micro<span className="gradient-brand-text">Match</span>
        </button>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive =
              currentPage === item.id ||
              (item.id === 'brand-dashboard' && currentPage === 'shortlist-request') ||
              (item.id === 'creator-dashboard' && currentPage === 'creator-apply');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
                  isActive
                    ? 'text-zinc-950 font-semibold underline decoration-rose-500 decoration-2 underline-offset-8'
                    : 'hover:text-zinc-950 hover:underline decoration-zinc-300 underline-offset-8'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('shortlist-request')}
            className="hidden sm:inline-flex items-center justify-center rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform duration-150 hover:opacity-95 active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
          >
            Get Free Shortlist
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`flex min-h-[44px] w-full items-center justify-between rounded-lg px-3 text-left text-sm font-medium transition-colors ${
                    isActive ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleNav('shortlist-request')}
              className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-lg gradient-brand px-4 text-sm font-semibold text-white"
            >
              Get Free Shortlist
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
