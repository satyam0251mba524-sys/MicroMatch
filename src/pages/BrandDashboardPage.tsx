import { Check, CheckCircle2, ExternalLink, Lock, LogOut, RotateCcw, Send, X } from 'lucide-react';
import { useState } from 'react';
import { CreatorAvatar } from '../components/CreatorAvatar';
import { UpiQrCode } from '../components/UpiQrCode';
import { useApp } from '../store/AppContext';
import type { BookingStatus, PageRoute } from '../types';
import { calculateCommission, formatIndianNumber, formatINR } from '../utils/format';

interface BrandDashboardPageProps {
  onNavigate: (page: PageRoute) => void;
}

const BOOKING_STEPS: BookingStatus[] = ['Briefed', 'In progress', 'Delivered', 'Results shared'];

export function BrandDashboardPage({ onNavigate }: BrandDashboardPageProps) {
  const { state, setActiveBrandId, createBooking, submitBrandReferral } = useApp();

  // Mock OTP login state
  const [contactInput, setContactInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Booking drawer state
  const [bookingCreatorId, setBookingCreatorId] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [briefText, setBriefText] = useState('');
  const [deadline, setDeadline] = useState('2026-12-05');
  const [bookingError, setBookingError] = useState('');

  // Referral modal state
  const [referralBookingId, setReferralBookingId] = useState<string | null>(null);
  const [referralBrandName, setReferralBrandName] = useState('');
  const [ratingOverride, setRatingOverride] = useState<Record<string, number>>({});
  const [referralSavedFor, setReferralSavedFor] = useState<string | null>(null);

  const activeBrand = state.brands.find((b) => b.id === state.activeBrandId) ?? null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim()) {
      setLoginError('Enter your registered email or WhatsApp number');
      return;
    }
    setLoginError('');
    setOtpSent(true);
    setOtpInput('4829');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim().length < 4) {
      setLoginError('Enter the 4-digit OTP (demo code: 4829)');
      return;
    }
    const q = contactInput.trim().toLowerCase();
    const matched =
      state.brands.find(
        (b) =>
          b.whatsapp.includes(q.replace(/\D/g, '') || '___') ||
          (b.email && b.email.toLowerCase() === q) ||
          b.name.toLowerCase().includes(q)
      ) ?? state.brands[0];

    setActiveBrandId(matched.id);
    setLoginError('');
  };

  const openBookingDrawer = (creatorId: string) => {
    const pkgs = state.packages.filter((p) => p.creator_id === creatorId);
    setBookingCreatorId(creatorId);
    setSelectedPackageId(pkgs[0]?.id ?? '');
    setBriefText(
      `Highlight our ${activeBrand?.category ?? 'boutique'} hero product in natural daylight. Include clear close-ups and share our brand discount code in stories with link sticker.`
    );
    setDeadline('2026-12-05');
    setBookingError('');
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBrand || !bookingCreatorId || !selectedPackageId) {
      setBookingError('Please select a package');
      return;
    }
    if (briefText.trim().length < 15) {
      setBookingError('Please add a clear written brief (at least 15 characters)');
      return;
    }
    if (!deadline) {
      setBookingError('Select a delivery deadline');
      return;
    }

    createBooking({
      brand_id: activeBrand.id,
      creator_id: bookingCreatorId,
      package_id: selectedPackageId,
      brief_text: briefText,
      deadline,
    });
    setBookingCreatorId(null);
  };

  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralBookingId || !referralBrandName.trim()) return;
    submitBrandReferral(
      referralBookingId,
      referralBrandName,
      ratingOverride[referralBookingId]
    );
    setReferralSavedFor(referralBookingId);
    setReferralBrandName('');
    setReferralBookingId(null);
  };

  if (!activeBrand) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
            <Lock className="h-3.5 w-3.5" />
            <span>Brand Portal Login (Mock OTP)</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-zinc-950">
            Access your shortlists, bookings &amp; results
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600">
            Sign in with your WhatsApp number or email, or jump directly into one of our sample Delhi NCR brands.
          </p>

          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="mt-6 space-y-4">
            <div>
              <label htmlFor="brand-login-contact" className="block text-xs font-semibold text-zinc-700">
                WhatsApp number or email
              </label>
              <input
                id="brand-login-contact"
                type="text"
                value={contactInput}
                onChange={(e) => setContactInput(e.target.value)}
                placeholder="e.g. 9811234567 or radhika@sutraloom.in"
                className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
              />
            </div>

            {otpSent && (
              <div>
                <label htmlFor="brand-otp" className="block text-xs font-semibold text-zinc-700">
                  4-digit OTP (pre-filled for demo)
                </label>
                <input
                  id="brand-otp"
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 font-mono text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
                />
              </div>
            )}

            {loginError && <p className="text-xs text-rose-600">{loginError}</p>}

            <button
              type="submit"
              className="flex min-h-[44px] w-full items-center justify-center rounded-xl gradient-brand px-5 text-sm font-semibold text-white"
            >
              {otpSent ? 'Verify & Enter Brand Portal' : 'Send OTP'}
            </button>
          </form>

          <div className="mt-7 border-t border-zinc-100 pt-5">
            <p className="text-xs font-semibold text-zinc-500">Quick demo brand sign-in</p>
            <div className="mt-3 grid gap-2">
              {state.brands.map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => setActiveBrandId(brand.id)}
                  className="flex min-h-[44px] items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-left text-xs hover:border-zinc-300 hover:bg-white transition-colors"
                >
                  <div>
                    <span className="font-semibold text-zinc-900">{brand.name}</span>
                    <span className="ml-2 text-zinc-500">
                      {brand.area} · {brand.category}
                    </span>
                  </div>
                  <span className="font-semibold text-rose-600">Sign in →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const brandRequests = state.shortlistRequests.filter((r) => r.brand_id === activeBrand.id);
  const brandShortlists = brandRequests
    .map((req) => ({
      request: req,
      shortlist: state.shortlists.find((s) => s.request_id === req.id) ?? null,
    }))
    .filter((item) => item.shortlist !== null || item.request.status === 'pending');

  const brandBookings = state.bookings.filter((b) => b.brand_id === activeBrand.id);

  const bookingCreator = bookingCreatorId
    ? state.creators.find((c) => c.id === bookingCreatorId) ?? null
    : null;
  const bookingPackages = bookingCreatorId
    ? state.packages.filter((p) => p.creator_id === bookingCreatorId)
    : [];
  const chosenPackage = bookingPackages.find((p) => p.id === selectedPackageId) ?? bookingPackages[0] ?? null;
  const commissionBreakdown = chosenPackage ? calculateCommission(chosenPackage.price) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-10">
      {/* Brand header */}
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium text-zinc-500">
            Brand Portal · {activeBrand.instagram} · {activeBrand.area}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-zinc-950 sm:text-3xl">
            Welcome, {activeBrand.founder} ({activeBrand.name})
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('shortlist-request')}
            className="inline-flex min-h-[40px] items-center justify-center rounded-xl gradient-brand px-4 text-xs font-semibold text-white whitespace-nowrap"
          >
            New shortlist request
          </button>
          <button
            type="button"
            onClick={() => setActiveBrandId(null)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 whitespace-nowrap"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Switch brand</span>
          </button>
        </div>
      </div>

      {/* Section 1: My Shortlists */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-zinc-950">My Shortlists</h2>
            <p className="text-xs text-zinc-500">3 vetted local creators matched to each launch request</p>
          </div>
        </div>

        {brandShortlists.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-8 text-center">
            <p className="font-display text-base font-bold text-zinc-900">No shortlists requested yet</p>
            <p className="mt-1 text-sm text-zinc-600">
              Submit a 2-minute launch brief and we&apos;ll send 3 audited creators within 48 hours.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('shortlist-request')}
              className="mt-4 inline-flex min-h-[40px] items-center rounded-xl gradient-brand px-4 text-xs font-semibold text-white"
            >
              Request free shortlist
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {brandShortlists.map(({ request, shortlist }) => (
              <div key={request.id} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-4">
                  <div>
                    <p className="font-display text-sm font-bold text-zinc-900 capitalize">
                      {request.goal} campaign · {request.timeline}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Requested {request.created_at} · Status:{' '}
                      <span className="font-semibold text-zinc-800">
                        {request.status === 'pending'
                          ? 'Curating shortlist (under 48h)'
                          : request.status === 'shortlist_sent'
                          ? 'Shortlist ready to book'
                          : 'Collaboration booked'}
                      </span>
                    </p>
                  </div>
                </div>

                {!shortlist ? (
                  <div className="mt-4 rounded-xl bg-zinc-50 p-4 text-xs text-zinc-600">
                    Your shortlist is currently being curated by the MicroMatch team. You can also test building it
                    immediately inside the{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('admin')}
                      className="font-semibold text-rose-600 underline underline-offset-2"
                    >
                      Admin Shortlist Builder
                    </button>
                    .
                  </div>
                ) : (
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {shortlist.creator_ids.map((cid) => {
                      const creator = state.creators.find((c) => c.id === cid);
                      if (!creator) return null;
                      const pkgs = state.packages.filter((p) => p.creator_id === creator.id);
                      const minPrice = pkgs.length > 0 ? Math.min(...pkgs.map((p) => p.price)) : 4000;
                      const avgScore = (
                        (creator.vetting_follower_quality +
                          creator.vetting_engagement +
                          creator.vetting_audience_fit) /
                        3
                      ).toFixed(1);

                      return (
                        <div
                          key={creator.id}
                          className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50/60 p-4"
                        >
                          <div>
                            <div className="flex items-start gap-3">
                              <CreatorAvatar
                                name={creator.name}
                                niche={creator.niche}
                                avatarUrl={creator.avatarUrl}
                                className="h-12 w-12"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-display text-sm font-bold text-zinc-950">{creator.name}</p>
                                <p className="truncate font-mono text-xs text-zinc-500">{creator.instagram}</p>
                                <p className="mt-0.5 text-xs text-zinc-600 capitalize">
                                  {creator.niche} · {creator.area}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 grid grid-cols-3 border-t border-zinc-200/70 pt-2.5 text-xs">
                              <div>
                                <span className="text-zinc-500">Followers</span>
                                <p className="font-mono font-semibold text-zinc-900 tabular-nums">
                                  {formatIndianNumber(creator.followers)}
                                </p>
                              </div>
                              <div>
                                <span className="text-zinc-500">Score</span>
                                <p className="font-mono font-semibold text-zinc-900 tabular-nums">{avgScore}/10</p>
                              </div>
                              <div>
                                <span className="text-zinc-500">From</span>
                                <p className="font-mono font-semibold text-zinc-900 tabular-nums">
                                  {formatINR(minPrice)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => openBookingDrawer(creator.id)}
                            className="mt-4 flex min-h-[40px] w-full items-center justify-center rounded-lg gradient-brand px-3 text-xs font-semibold text-white"
                          >
                            Book collaboration
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: My Collaborations & Results Summary */}
      <section>
        <div>
          <h2 className="font-display text-xl font-bold text-zinc-950">My Collaborations &amp; Results</h2>
          <p className="text-xs text-zinc-500">Track delivery progress, UPI payment confirmation, and outcomes</p>
        </div>

        {brandBookings.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
            No booked collaborations yet. Choose a creator from your shortlist above to book a fixed-price package.
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            {brandBookings.map((booking) => {
              const creator = state.creators.find((c) => c.id === booking.creator_id);
              const pkg = state.packages.find((p) => p.id === booking.package_id);
              const result = state.resultSummaries.find((r) => r.booking_id === booking.id);
              const currentStepIdx = BOOKING_STEPS.indexOf(booking.status);

              return (
                <div key={booking.id} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-5">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      {creator && (
                        <CreatorAvatar
                          name={creator.name}
                          niche={creator.niche}
                          avatarUrl={creator.avatarUrl}
                          className="h-12 w-12"
                        />
                      )}
                      <div>
                        <h3 className="font-display text-base font-bold text-zinc-950">
                          {creator?.name ?? 'Creator'} · {pkg?.name ?? 'Package'} ({pkg?.deliverables})
                        </h3>
                        <p className="text-xs text-zinc-500 tabular-nums">
                          {formatINR(booking.price)} total ({formatINR(booking.creator_payout)} creator +{' '}
                          {formatINR(booking.platform_fee)} fee) · Deadline {booking.deadline}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs font-medium">
                      {booking.upi_payment_status === 'received' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          UPI payment verified
                        </span>
                      ) : (
                        <span className="text-amber-700">UPI payment pending admin check</span>
                      )}
                    </div>
                  </div>

                  {/* 4-Step Tracker */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {BOOKING_STEPS.map((step, idx) => {
                      const done = idx <= currentStepIdx;
                      return (
                        <div
                          key={step}
                          className={`rounded-xl border px-3 py-2.5 text-xs ${
                            done
                              ? 'border-rose-200 bg-rose-50/70 text-zinc-900 font-semibold'
                              : 'border-zinc-200 bg-zinc-50 text-zinc-400'
                          }`}
                        >
                          <span className="font-mono text-[11px] mr-1.5">0{idx + 1}.</span>
                          {step}
                        </div>
                      );
                    })}
                  </div>

                  {/* Brief & Deliverable Link */}
                  <div className="rounded-xl bg-zinc-50 p-4 text-xs text-zinc-700 space-y-2">
                    <p>
                      <span className="font-semibold text-zinc-900">Written brief: </span>
                      {booking.brief_text}
                    </p>
                    {booking.deliverable_link && (
                      <p className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-900">Live deliverable: </span>
                        <a
                          href={booking.deliverable_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-rose-600 underline underline-offset-2"
                        >
                          <span>{booking.deliverable_link}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Results Summary View */}
                  {result && (
                    <div className="border-t border-zinc-200 pt-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-display text-sm font-bold text-zinc-950">Campaign Results Summary</h4>
                        <span className="font-mono text-xs font-semibold text-emerald-700 tabular-nums">
                          Brand satisfaction: {ratingOverride[booking.id] ?? result.satisfaction_score}/10
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:grid-cols-4">
                        <div>
                          <p className="text-xs text-zinc-500">Reach</p>
                          <p className="mt-0.5 font-mono text-lg font-bold text-zinc-950 tabular-nums">
                            {formatIndianNumber(result.reach)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Link Clicks</p>
                          <p className="mt-0.5 font-mono text-lg font-bold text-zinc-950 tabular-nums">
                            {formatIndianNumber(result.link_clicks)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">DM / WA Enquiries</p>
                          <p className="mt-0.5 font-mono text-lg font-bold text-zinc-950 tabular-nums">
                            {formatIndianNumber(result.enquiries)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Discount-Code Orders</p>
                          <p className="mt-0.5 font-mono text-lg font-bold text-zinc-950 tabular-nums">
                            {formatIndianNumber(result.discount_code_orders)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                          <label htmlFor={`rate-${booking.id}`} className="font-medium">
                            Update satisfaction (1–10):
                          </label>
                          <select
                            id={`rate-${booking.id}`}
                            value={ratingOverride[booking.id] ?? result.satisfaction_score}
                            onChange={(e) => {
                              const score = Number(e.target.value);
                              setRatingOverride((prev) => ({ ...prev, [booking.id]: score }));
                              submitBrandReferral(booking.id, result.referral_name ?? '', score);
                            }}
                            className="h-9 rounded-lg border border-zinc-200 bg-white px-2 font-mono text-xs text-zinc-900"
                          >
                            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                              <option key={n} value={n}>
                                {n}/10
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          {creator && (
                            <button
                              type="button"
                              onClick={() => openBookingDrawer(creator.id)}
                              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl gradient-brand px-4 text-xs font-semibold text-white"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>Rebook {creator.name.split(' ')[0]}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setReferralBookingId(booking.id);
                              setReferralBrandName(result.referral_name ?? '');
                            }}
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-4 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>
                              {result.referral_name ? `Referred: ${result.referral_name}` : 'Refer another brand'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {referralSavedFor === booking.id && (
                        <p className="text-xs font-medium text-emerald-700">
                          <Check className="mr-1 inline h-3.5 w-3.5" />
                          Referral saved! Thank you for introducing a fellow founder.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Book Collaboration Modal */}
      {bookingCreator && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-zinc-950/50 p-0 sm:p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <p className="text-xs font-medium text-zinc-500">Fixed-price booking</p>
                <h3 className="font-display text-lg font-bold text-zinc-950">
                  Book {bookingCreator.name} ({bookingCreator.instagram})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBookingCreatorId(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100"
                aria-label="Close booking dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="mt-5 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700">1. Choose fixed-price package</label>
                <div className="mt-2 space-y-2">
                  {bookingPackages.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-colors ${
                        chosenPackage?.id === pkg.id
                          ? 'border-rose-400 bg-rose-50/40'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="package"
                          checked={chosenPackage?.id === pkg.id}
                          onChange={() => setSelectedPackageId(pkg.id)}
                          className="accent-rose-600"
                        />
                        <div>
                          <p className="font-display text-sm font-bold text-zinc-900">{pkg.name}</p>
                          <p className="text-xs text-zinc-600">{pkg.deliverables}</p>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-bold text-zinc-950 tabular-nums">
                        {formatINR(pkg.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="booking-brief" className="block text-xs font-semibold text-zinc-700">
                  2. Written brief (shared with creator)
                </label>
                <textarea
                  id="booking-brief"
                  rows={3}
                  value={briefText}
                  onChange={(e) => setBriefText(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 p-3 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="booking-deadline" className="block text-xs font-semibold text-zinc-700">
                  3. Delivery deadline
                </label>
                <input
                  id="booking-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 font-mono text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
                />
              </div>

              {commissionBreakdown && (
                <>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs space-y-1.5 tabular-nums">
                    <div className="flex justify-between text-zinc-600">
                      <span>Creator payout (80%)</span>
                      <span className="font-mono font-medium text-zinc-900">
                        {formatINR(commissionBreakdown.creatorPayout)}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>MicroMatch platform fee (20%)</span>
                      <span className="font-mono font-medium text-zinc-900">
                        {formatINR(commissionBreakdown.platformFee)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-zinc-200 pt-2 text-sm font-bold text-zinc-950">
                      <span>Total payable</span>
                      <span className="font-mono">{formatINR(commissionBreakdown.price)}</span>
                    </div>
                  </div>

                  <UpiQrCode amount={commissionBreakdown.price} />
                </>
              )}

              {bookingError && <p className="text-xs text-rose-600">{bookingError}</p>}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingCreatorId(null)}
                  className="min-h-[44px] rounded-xl border border-zinc-300 px-4 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] rounded-xl gradient-brand px-5 text-xs font-semibold text-white"
                >
                  Confirm Booking &amp; I&apos;ve Paid via UPI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Referral Modal */}
      {referralBookingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-zinc-950">Refer another founder-run brand</h3>
              <button
                type="button"
                onClick={() => setReferralBookingId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100"
                aria-label="Close referral modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-xs text-zinc-600">
              Share the name or Instagram handle of a South Delhi or Gurugram founder who should get a free vetted
              shortlist.
            </p>
            <form onSubmit={handleReferralSubmit} className="mt-4 space-y-4">
              <input
                type="text"
                value={referralBrandName}
                onChange={(e) => setReferralBrandName(e.target.value)}
                placeholder="e.g. Terra Clay Pottery (@terraclay.in)"
                className="h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReferralBookingId(null)}
                  className="min-h-[40px] rounded-xl border border-zinc-200 px-4 text-xs font-semibold text-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] rounded-xl gradient-brand px-4 text-xs font-semibold text-white"
                >
                  Submit Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
