import { CheckCircle2, Clock, ExternalLink, LogOut, Plus, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { CreatorAvatar } from '../components/CreatorAvatar';
import { useApp } from '../store/AppContext';
import type { CreatorStatus, PageRoute } from '../types';
import { formatIndianNumber, formatINR } from '../utils/format';

interface CreatorDashboardPageProps {
  onNavigate: (page: PageRoute) => void;
}

const STATUS_LABELS: Record<CreatorStatus, string> = {
  pending: 'Pending review',
  auditing: 'Audit in progress',
  approved: 'Approved & listed',
  rejected: 'Not approved',
};

export function CreatorDashboardPage({ onNavigate }: CreatorDashboardPageProps) {
  const { state, setActiveCreatorId, addCreatorPackage, updateBookingStatus, markBookingDelivered } = useApp();

  const [handleInput, setHandleInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Add package form
  const [pkgName, setPkgName] = useState('');
  const [pkgDeliverables, setPkgDeliverables] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgError, setPkgError] = useState('');

  // Delivery submission per booking
  const [postLinks, setPostLinks] = useState<Record<string, string>>({});
  const [deliveryErrors, setDeliveryErrors] = useState<Record<string, string>>({});

  const activeCreator = state.creators.find((c) => c.id === state.activeCreatorId) ?? null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const q = handleInput.trim().toLowerCase();
    if (!q) {
      setLoginError('Enter your Instagram handle or WhatsApp number');
      return;
    }
    const found = state.creators.find(
      (c) =>
        c.instagram.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.whatsapp.includes(q.replace(/\D/g, '') || '___')
    );
    if (!found) {
      setLoginError('No application found for that handle. Apply first or pick a sample creator below.');
      return;
    }
    setLoginError('');
    setActiveCreatorId(found.id);
  };

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCreator) return;
    const priceNum = Number(pkgPrice);
    if (!pkgName.trim() || !pkgDeliverables.trim() || !Number.isFinite(priceNum) || priceNum < 1000) {
      setPkgError('Enter package name, deliverables, and price (₹1,000+)');
      return;
    }
    setPkgError('');
    addCreatorPackage(activeCreator.id, pkgName, pkgDeliverables, priceNum);
    setPkgName('');
    setPkgDeliverables('');
    setPkgPrice('');
  };

  const handleDeliverSubmit = (bookingId: string) => {
    const link = (postLinks[bookingId] ?? '').trim();
    if (!link || (!link.startsWith('http://') && !link.startsWith('https://'))) {
      setDeliveryErrors((prev) => ({
        ...prev,
        [bookingId]: 'Paste the live Instagram reel/post URL (starting with https://)',
      }));
      return;
    }
    setDeliveryErrors((prev) => ({ ...prev, [bookingId]: '' }));
    markBookingDelivered(bookingId, link);
  };

  if (!activeCreator) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
            <UserCheck className="h-3.5 w-3.5" />
            <span>Creator Portal</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-zinc-950">
            Check application status or manage bookings
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600">
            Look up your creator profile by Instagram handle, or switch into a sample creator account below.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-3">
            <label htmlFor="creator-lookup" className="block text-xs font-semibold text-zinc-700">
              Instagram handle or WhatsApp number
            </label>
            <div className="flex gap-2">
              <input
                id="creator-lookup"
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="e.g. @ananya.styles or @zoya.minimal"
                className="h-11 flex-1 rounded-xl border border-zinc-200 px-3.5 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-[44px] rounded-xl gradient-brand px-4 text-xs font-semibold text-white whitespace-nowrap"
              >
                Open Portal
              </button>
            </div>
            {loginError && <p className="text-xs text-rose-600">{loginError}</p>}
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5">
            <span className="text-xs text-zinc-500">New to MicroMatch?</span>
            <button
              type="button"
              onClick={() => onNavigate('creator-apply')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              Submit creator application →
            </button>
          </div>

          <div className="mt-5 border-t border-zinc-100 pt-5">
            <p className="text-xs font-semibold text-zinc-500">Quick demo creator sign-in</p>
            <div className="mt-3 grid gap-2">
              {state.creators.slice(0, 5).concat(state.creators.slice(-1)).map((creator) => (
                <button
                  key={creator.id}
                  type="button"
                  onClick={() => setActiveCreatorId(creator.id)}
                  className="flex min-h-[44px] items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-left text-xs hover:border-zinc-300 hover:bg-white transition-colors"
                >
                  <div>
                    <span className="font-semibold text-zinc-900">{creator.name}</span>
                    <span className="ml-2 font-mono text-zinc-500">{creator.instagram}</span>
                    <span className="ml-2 text-zinc-500">· {STATUS_LABELS[creator.status]}</span>
                  </div>
                  <span className="font-semibold text-rose-600">Open →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const myPackages = state.packages.filter((p) => p.creator_id === activeCreator.id);
  const myBookings = state.bookings.filter((b) => b.creator_id === activeCreator.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <CreatorAvatar
            name={activeCreator.name}
            niche={activeCreator.niche}
            avatarUrl={activeCreator.avatarUrl}
            className="h-16 w-16"
          />
          <div>
            <p className="text-xs font-medium text-zinc-500">
              Creator Portal · {activeCreator.instagram} · {activeCreator.area}
            </p>
            <h1 className="mt-0.5 font-display text-2xl font-bold text-zinc-950">{activeCreator.name}</h1>
            <p className="mt-0.5 text-xs text-zinc-600 tabular-nums">
              {formatIndianNumber(activeCreator.followers)} followers · {activeCreator.engagement_rate}% ER ·{' '}
              <span className="font-semibold text-zinc-900">{STATUS_LABELS[activeCreator.status]}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveCreatorId(null)}
          className="inline-flex min-h-[40px] items-center gap-1.5 self-start sm:self-auto rounded-xl border border-zinc-200 bg-white px-3.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Switch creator</span>
        </button>
      </div>

      {/* Application Status Pipeline */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-base font-bold text-zinc-950">Application &amp; Vetting Status</h2>
          <span className="text-xs font-semibold text-zinc-700">{STATUS_LABELS[activeCreator.status]}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { id: 'pending', label: '01. Pending' },
            { id: 'auditing', label: '02. Audit in progress' },
            {
              id: 'decision',
              label: activeCreator.status === 'rejected' ? '03. Rejected' : '03. Approved',
            },
          ].map((stage, idx) => {
            const active =
              (idx === 0 && activeCreator.status === 'pending') ||
              (idx === 1 && activeCreator.status === 'auditing') ||
              (idx === 2 && (activeCreator.status === 'approved' || activeCreator.status === 'rejected'));
            const passed =
              (idx === 0 && activeCreator.status !== 'pending') ||
              (idx === 1 && (activeCreator.status === 'approved' || activeCreator.status === 'rejected'));

            return (
              <div
                key={stage.id}
                className={`rounded-xl border px-3 py-2.5 text-xs ${
                  active
                    ? activeCreator.status === 'rejected'
                      ? 'border-rose-300 bg-rose-50 font-semibold text-rose-900'
                      : 'border-emerald-300 bg-emerald-50 font-semibold text-emerald-900'
                    : passed
                    ? 'border-zinc-200 bg-zinc-100 text-zinc-800 font-medium'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-400'
                }`}
              >
                {stage.label}
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 border-t border-zinc-100 pt-4 sm:grid-cols-4 text-xs">
          <div>
            <span className="text-zinc-500">Follower Quality</span>
            <p className="font-mono font-semibold text-zinc-900 tabular-nums">
              {activeCreator.vetting_follower_quality}/10
            </p>
          </div>
          <div>
            <span className="text-zinc-500">Engagement Pattern</span>
            <p className="font-mono font-semibold text-zinc-900 tabular-nums">
              {activeCreator.vetting_engagement}/10
            </p>
          </div>
          <div>
            <span className="text-zinc-500">Audience Location Fit</span>
            <p className="font-mono font-semibold text-zinc-900 tabular-nums">
              {activeCreator.vetting_audience_fit}/10
            </p>
          </div>
          <div>
            <span className="text-zinc-500">Auditor Notes</span>
            <p className="text-zinc-700">{activeCreator.vetting_notes || 'Awaiting review'}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Incoming Bookings */}
        <section className="lg:col-span-7 space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold text-zinc-950">Incoming Bookings</h2>
            <p className="text-xs text-zinc-500">Written briefs, deadlines, post-link delivery &amp; payout status</p>
          </div>

          {myBookings.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
              No active bookings yet. Once a brand books one of your packages, the written brief and deadline will
              appear here.
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((booking) => {
                const brand = state.brands.find((b) => b.id === booking.brand_id);
                const pkg = state.packages.find((p) => p.id === booking.package_id);

                return (
                  <div key={booking.id} className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-zinc-500">
                          {brand?.name ?? 'Brand'} ({brand?.instagram}) · {booking.status}
                        </p>
                        <h3 className="font-display text-base font-bold text-zinc-950">
                          {pkg?.name ?? 'Package'} — {pkg?.deliverables}
                        </h3>
                      </div>

                      <div className="text-right tabular-nums">
                        <p className="font-mono text-base font-bold text-zinc-950">
                          {formatINR(booking.creator_payout)} payout
                        </p>
                        <p className="text-xs text-zinc-500">
                          {booking.creator_payout_status === 'paid' ? (
                            <span className="font-semibold text-emerald-700">Paid out ✓</span>
                          ) : (
                            <span className="text-amber-700">Payout pending delivery</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-zinc-50 p-3.5 text-xs text-zinc-700 space-y-1.5">
                      <p>
                        <span className="font-semibold text-zinc-900">Written brief: </span>
                        {booking.brief_text}
                      </p>
                      <p className="inline-flex items-center gap-1.5 text-zinc-600">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Delivery deadline: {booking.deadline}</span>
                      </p>
                    </div>

                    {booking.status === 'Briefed' && (
                      <button
                        type="button"
                        onClick={() => updateBookingStatus(booking.id, 'In progress')}
                        className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                      >
                        Start shoot (Mark In progress)
                      </button>
                    )}

                    {(booking.status === 'Briefed' || booking.status === 'In progress') && (
                      <div className="space-y-2 border-t border-zinc-100 pt-3">
                        <label htmlFor={`post-link-${booking.id}`} className="block text-xs font-semibold text-zinc-700">
                          Submit live Instagram Reel / Post link to mark as delivered
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            id={`post-link-${booking.id}`}
                            type="url"
                            value={postLinks[booking.id] ?? ''}
                            onChange={(e) => setPostLinks((prev) => ({ ...prev, [booking.id]: e.target.value }))}
                            placeholder="https://instagram.com/reel/..."
                            className="h-11 flex-1 rounded-xl border border-zinc-200 px-3 text-xs font-mono text-zinc-900 focus:border-rose-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeliverSubmit(booking.id)}
                            className="inline-flex min-h-[44px] items-center justify-center rounded-xl gradient-brand px-4 text-xs font-semibold text-white whitespace-nowrap"
                          >
                            Mark as delivered
                          </button>
                        </div>
                        {deliveryErrors[booking.id] && (
                          <p className="text-xs text-rose-600">{deliveryErrors[booking.id]}</p>
                        )}
                      </div>
                    )}

                    {(booking.status === 'Delivered' || booking.status === 'Results shared') &&
                      booking.deliverable_link && (
                        <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            Delivered
                          </span>
                          <a
                            href={booking.deliverable_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-rose-600 underline underline-offset-2"
                          >
                            <span>View submitted post</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Fixed-price Packages */}
        <section className="lg:col-span-5 space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold text-zinc-950">My Fixed-Price Packages</h2>
            <p className="text-xs text-zinc-500">You receive 80% of the listed price after delivery</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
            {myPackages.length === 0 ? (
              <p className="text-xs text-zinc-500">No packages listed yet. Add your first fixed package below.</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {myPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="font-display text-sm font-bold text-zinc-900">{pkg.name}</p>
                      <p className="text-xs text-zinc-600">{pkg.deliverables}</p>
                    </div>
                    <div className="text-right tabular-nums">
                      <p className="font-mono text-sm font-bold text-zinc-950">{formatINR(pkg.price)}</p>
                      <p className="text-[11px] text-zinc-500">Your 80%: {formatINR(pkg.price * 0.8)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddPackage} className="border-t border-zinc-100 pt-4 space-y-3">
              <p className="text-xs font-semibold text-zinc-700">Add a fixed-price package</p>
              <input
                type="text"
                value={pkgName}
                onChange={(e) => setPkgName(e.target.value)}
                placeholder="Package title (e.g. Festive Boost)"
                className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-xs text-zinc-900 focus:border-rose-400 focus:outline-none"
              />
              <input
                type="text"
                value={pkgDeliverables}
                onChange={(e) => setPkgDeliverables(e.target.value)}
                placeholder="Deliverables (e.g. 3 reels + 5 stories)"
                className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-xs text-zinc-900 focus:border-rose-400 focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={pkgPrice}
                  onChange={(e) => setPkgPrice(e.target.value)}
                  placeholder="Price in ₹ (e.g. 12000)"
                  className="h-10 flex-1 rounded-xl border border-zinc-200 px-3 font-mono text-xs text-zinc-900 focus:border-rose-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-zinc-300 bg-zinc-900 px-3.5 text-xs font-semibold text-white hover:bg-zinc-800 whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
              {pkgError && <p className="text-xs text-rose-600">{pkgError}</p>}
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
