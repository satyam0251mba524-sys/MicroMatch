import { CheckCircle2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CreatorAvatar } from '../components/CreatorAvatar';
import { useApp } from '../store/AppContext';
import type { Creator, CreatorNiche, NcrArea, PageRoute } from '../types';
import { formatIndianNumber, formatINR } from '../utils/format';

interface DirectoryPageProps {
  onSelectCreator: (creator: Creator) => void;
  onNavigate: (page: PageRoute) => void;
}

type FollowerFilter = 'all' | '2k-5k' | '5k-10k' | '10k-20k';
type PriceFilter = 'all' | 'under-4k' | '4k-8k' | '8k-plus';

export function DirectoryPage({ onSelectCreator, onNavigate }: DirectoryPageProps) {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [niche, setNiche] = useState<'all' | CreatorNiche>('all');
  const [area, setArea] = useState<'all' | NcrArea>('all');
  const [followerRange, setFollowerRange] = useState<FollowerFilter>('all');
  const [priceRange, setPriceRange] = useState<PriceFilter>('all');

  const approvedCreators = useMemo(
    () => state.creators.filter((c) => c.status === 'approved'),
    [state.creators]
  );

  const filteredCreators = useMemo(() => {
    return approvedCreators.filter((creator) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!creator.name.toLowerCase().includes(q) && !creator.instagram.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (niche !== 'all' && creator.niche !== niche) return false;
      if (area !== 'all' && creator.area !== area) return false;

      if (followerRange === '2k-5k' && (creator.followers < 2000 || creator.followers > 5000)) return false;
      if (followerRange === '5k-10k' && (creator.followers <= 5000 || creator.followers > 10000)) return false;
      if (followerRange === '10k-20k' && (creator.followers <= 10000 || creator.followers > 20000)) return false;

      const pkgs = state.packages.filter((p) => p.creator_id === creator.id);
      const minPrice = pkgs.length > 0 ? Math.min(...pkgs.map((p) => p.price)) : 4000;
      const maxPrice = pkgs.length > 0 ? Math.max(...pkgs.map((p) => p.price)) : 4000;

      if (priceRange === 'under-4k' && minPrice > 4000) return false;
      if (priceRange === '4k-8k' && !pkgs.some((p) => p.price > 4000 && p.price <= 8000)) return false;
      if (priceRange === '8k-plus' && maxPrice <= 8000) return false;

      return true;
    });
  }, [approvedCreators, search, niche, area, followerRange, priceRange, state.packages]);

  const clearFilters = () => {
    setSearch('');
    setNiche('all');
    setArea('all');
    setFollowerRange('all');
    setPriceRange('all');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold text-zinc-500">South Delhi &amp; Gurugram Directory</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-zinc-950">
            Vetted Micro-Creators
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600">
            Every listed creator has passed a manual 3-point audience audit and offers fixed-price packages.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('shortlist-request')}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl gradient-brand px-5 text-sm font-semibold text-white whitespace-nowrap shrink-0"
        >
          Request custom 3-creator shortlist
        </button>
      </div>

      {/* Filters bar */}
      <div className="mt-6 space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or @handle..."
              aria-label="Search creators by name or Instagram handle"
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-400 focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value as 'all' | CreatorNiche)}
            aria-label="Filter by category"
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-800 focus:border-rose-400 focus:bg-white focus:outline-none"
          >
            <option value="all">All categories</option>
            <option value="fashion">Fashion</option>
            <option value="skincare">Skincare</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="food">Food</option>
          </select>

          <select
            value={area}
            onChange={(e) => setArea(e.target.value as 'all' | NcrArea)}
            aria-label="Filter by area"
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-800 focus:border-rose-400 focus:bg-white focus:outline-none"
          >
            <option value="all">All NCR areas</option>
            <option value="South Delhi">South Delhi</option>
            <option value="Gurugram">Gurugram</option>
          </select>

          <select
            value={followerRange}
            onChange={(e) => setFollowerRange(e.target.value as FollowerFilter)}
            aria-label="Filter by follower range"
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-800 focus:border-rose-400 focus:bg-white focus:outline-none"
          >
            <option value="all">All follower counts</option>
            <option value="2k-5k">2,000 – 5,000</option>
            <option value="5k-10k">5,001 – 10,000</option>
            <option value="10k-20k">10,001 – 20,000</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-medium text-zinc-500">Package price:</span>
            {(
              [
                { id: 'all', label: 'Any price' },
                { id: 'under-4k', label: 'Up to ₹4,000' },
                { id: '4k-8k', label: '₹4,001 – ₹8,000' },
                { id: '8k-plus', label: '₹8,000+' },
              ] as { id: PriceFilter; label: string }[]
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPriceRange(opt.id)}
                className={`min-h-[34px] rounded-lg px-3 text-xs font-medium transition-colors whitespace-nowrap ${
                  priceRange === opt.id
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-zinc-500 tabular-nums">
            Showing {filteredCreators.length} of {approvedCreators.length} vetted creators
          </p>
        </div>
      </div>

      {/* Results grid */}
      {filteredCreators.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-10 text-center">
          <p className="font-display text-lg font-bold text-zinc-900">No creators match these filters</p>
          <p className="mt-1 text-sm text-zinc-600">
            Try widening the follower range or price filter, or ask our team for a custom shortlist.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCreators.map((creator) => {
            const pkgs = state.packages.filter((p) => p.creator_id === creator.id);
            const minPrice = pkgs.length > 0 ? Math.min(...pkgs.map((p) => p.price)) : 4000;
            const avgScore = (
              (creator.vetting_follower_quality + creator.vetting_engagement + creator.vetting_audience_fit) /
              3
            ).toFixed(1);

            return (
              <article
                key={creator.id}
                className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <CreatorAvatar
                      name={creator.name}
                      niche={creator.niche}
                      avatarUrl={creator.avatarUrl}
                      className="h-16 w-16"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="truncate font-display text-base font-bold text-zinc-950">{creator.name}</h2>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Vetted ✓
                        </span>
                      </div>
                      <p className="truncate font-mono text-xs text-zinc-500">{creator.instagram}</p>
                      <p className="mt-1 text-xs text-zinc-600 capitalize">
                        {creator.niche} · {creator.area}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-zinc-500">{creator.audience_location_split}</p>

                  <div className="mt-4 grid grid-cols-3 border-t border-zinc-100 pt-3 text-xs">
                    <div>
                      <span className="text-zinc-500">Followers</span>
                      <p className="font-mono font-semibold text-zinc-900 tabular-nums">
                        {formatIndianNumber(creator.followers)}
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Audit Score</span>
                      <p className="font-mono font-semibold text-zinc-900 tabular-nums">{avgScore}/10</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Starts at</span>
                      <p className="font-mono font-semibold text-zinc-900 tabular-nums">{formatINR(minPrice)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectCreator(creator)}
                    className="flex min-h-[42px] flex-1 items-center justify-center rounded-xl border border-zinc-300 bg-white px-3 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
                  >
                    View profile &amp; packages
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
