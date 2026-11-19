import { Check, Copy, RotateCcw, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useApp } from '../store/AppContext';
import type { BookingStatus, Creator, CreatorStatus } from '../types';
import { calculateCommission, formatIndianNumber, formatINR } from '../utils/format';

type AdminTab = 'applications' | 'shortlists' | 'bookings' | 'results' | 'metrics';

export function AdminPage() {
  const {
    state,
    updateCreatorAudit,
    createShortlist,
    updateBookingStatus,
    toggleBookingUpiPayment,
    toggleCreatorPayout,
    saveResultSummary,
    setInterviewsConducted,
    resetDemoData,
  } = useApp();

  const [tab, setTab] = useState<AdminTab>('applications');
  const [confirmReset, setConfirmReset] = useState(false);

  // Audit drawer state
  const [auditingCreator, setAuditingCreator] = useState<Creator | null>(null);
  const [scoreQuality, setScoreQuality] = useState(8);
  const [scoreEngagement, setScoreEngagement] = useState(8);
  const [scoreFit, setScoreFit] = useState(8);
  const [auditNotes, setAuditNotes] = useState('');
  const [appFilter, setAppFilter] = useState<'all' | CreatorStatus>('all');

  // Shortlist builder state
  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    state.shortlistRequests.find((r) => r.status === 'pending')?.id ?? state.shortlistRequests[0]?.id ?? ''
  );
  const [pickedCreatorIds, setPickedCreatorIds] = useState<string[]>([]);
  const [copiedWa, setCopiedWa] = useState(false);
  const [shortlistSavedMsg, setShortlistSavedMsg] = useState('');

  // Commission calculator state
  const [calcAmount, setCalcAmount] = useState('6000');

  // Results entry state
  const [resultsBookingId, setResultsBookingId] = useState<string>(state.bookings[0]?.id ?? '');
  const [reach, setReach] = useState('14500');
  const [linkClicks, setLinkClicks] = useState('240');
  const [enquiries, setEnquiries] = useState('35');
  const [orders, setOrders] = useState('12');
  const [satisfaction, setSatisfaction] = useState('9');
  const [wouldRebook, setWouldRebook] = useState(true);
  const [referralName, setReferralName] = useState('');
  const [resultsSaved, setResultsSaved] = useState(false);

  const openAudit = (creator: Creator) => {
    setAuditingCreator(creator);
    setScoreQuality(creator.vetting_follower_quality || 8);
    setScoreEngagement(creator.vetting_engagement || 8);
    setScoreFit(creator.vetting_audience_fit || 8);
    setAuditNotes(creator.vetting_notes || '');
  };

  const handleSaveAudit = (status: CreatorStatus) => {
    if (!auditingCreator) return;
    updateCreatorAudit(auditingCreator.id, {
      status,
      vetting_follower_quality: scoreQuality,
      vetting_engagement: scoreEngagement,
      vetting_audience_fit: scoreFit,
      vetting_notes: auditNotes,
    });
    setAuditingCreator(null);
  };

  const approvedCreators = useMemo(
    () => state.creators.filter((c) => c.status === 'approved'),
    [state.creators]
  );

  const selectedRequest = state.shortlistRequests.find((r) => r.id === selectedRequestId) ?? null;
  const selectedBrand = selectedRequest
    ? state.brands.find((b) => b.id === selectedRequest.brand_id) ?? null
    : null;

  const togglePickCreator = (id: string) => {
    setShortlistSavedMsg('');
    setPickedCreatorIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const generatedWhatsAppText = useMemo(() => {
    if (!selectedBrand || !selectedRequest || pickedCreatorIds.length === 0) return '';
    const lines = pickedCreatorIds.map((cid, index) => {
      const c = state.creators.find((item) => item.id === cid);
      if (!c) return '';
      const pkgs = state.packages.filter((p) => p.creator_id === cid);
      const starter = pkgs[0];
      const avgScore = (
        (c.vetting_follower_quality + c.vetting_engagement + c.vetting_audience_fit) /
        3
      ).toFixed(1);
      return `${index + 1}. ${c.name} (${c.instagram}) — ${formatIndianNumber(c.followers)} followers · ${c.area} · Audit ${avgScore}/10 · ${
        starter ? `${starter.name} (${starter.deliverables}) at ${formatINR(starter.price)}` : 'From ₹4,000'
      }`;
    });

    return `Hi ${selectedBrand.founder}! Here is your vetted MicroMatch shortlist for ${selectedBrand.name} (${selectedRequest.goal}):\n\n${lines.join(
      '\n'
    )}\n\nReply with the creator name(s) you'd like to book and we'll lock your written brief + UPI checkout.`;
  }, [selectedBrand, selectedRequest, pickedCreatorIds, state.creators, state.packages]);

  const handleCopyWhatsApp = async () => {
    if (!generatedWhatsAppText) return;
    try {
      await navigator.clipboard.writeText(generatedWhatsAppText);
      setCopiedWa(true);
      setTimeout(() => setCopiedWa(false), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleSaveShortlist = () => {
    if (!selectedRequest || pickedCreatorIds.length !== 3) return;
    createShortlist(selectedRequest.id, pickedCreatorIds, generatedWhatsAppText);
    setShortlistSavedMsg(`Shortlist saved and delivered to ${selectedBrand?.name}'s Brand Portal.`);
  };

  const handleSelectResultsBooking = (bookingId: string) => {
    setResultsBookingId(bookingId);
    setResultsSaved(false);
    const existing = state.resultSummaries.find((r) => r.booking_id === bookingId);
    if (existing) {
      setReach(String(existing.reach));
      setLinkClicks(String(existing.link_clicks));
      setEnquiries(String(existing.enquiries));
      setOrders(String(existing.discount_code_orders));
      setSatisfaction(String(existing.satisfaction_score));
      setWouldRebook(existing.would_rebook);
      setReferralName(existing.referral_name ?? '');
    }
  };

  const handleSaveResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultsBookingId) return;
    saveResultSummary({
      booking_id: resultsBookingId,
      reach: Number(reach) || 0,
      link_clicks: Number(linkClicks) || 0,
      enquiries: Number(enquiries) || 0,
      discount_code_orders: Number(orders) || 0,
      satisfaction_score: Math.min(10, Math.max(1, Number(satisfaction) || 8)),
      would_rebook: wouldRebook,
      referral_name: referralName.trim() || undefined,
    });
    setResultsSaved(true);
  };

  // Experiment metrics computation
  const shortlistsDelivered = state.shortlists.length;
  const paidPilots = state.bookings.filter((b) => b.upi_payment_status === 'received').length;
  const rebookIntentCount = state.resultSummaries.filter((r) => r.would_rebook).length;
  const referralCount = state.resultSummaries.filter((r) => Boolean(r.referral_name?.trim())).length;
  const avgSatisfaction =
    state.resultSummaries.length > 0
      ? (
          state.resultSummaries.reduce((acc, r) => acc + r.satisfaction_score, 0) / state.resultSummaries.length
        ).toFixed(1)
      : '0.0';
  const deliveredBookings = state.bookings.filter(
    (b) => b.status === 'Delivered' || b.status === 'Results shared'
  );
  const onTimeRate =
    deliveredBookings.length > 0
      ? Math.round(
          (deliveredBookings.filter((b) => b.delivered_on_time).length / deliveredBookings.length) * 100
        )
      : 100;

  const calcResult = calculateCommission(Math.max(0, Number(calcAmount) || 0));

  const filteredApplications = state.creators.filter((c) =>
    appFilter === 'all' ? true : c.status === appFilter
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold text-zinc-500">MicroMatch Concierge Operations</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-zinc-950 sm:text-3xl">Founder Admin Panel</h1>
        </div>

        <div className="flex items-center gap-2">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset demo data</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs">
              <span className="font-medium text-rose-900">Restore seed state?</span>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setConfirmReset(false);
                }}
                className="font-bold text-rose-700 underline"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="text-zinc-600 hover:text-zinc-900"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-zinc-200 bg-white p-1.5">
        {(
          [
            { id: 'applications', label: `Applications (${state.creators.length})` },
            { id: 'shortlists', label: `Shortlist Builder (${state.shortlistRequests.length})` },
            { id: 'bookings', label: `Bookings & UPI (${state.bookings.length})` },
            { id: 'results', label: 'Results Entry' },
            { id: 'metrics', label: '30-Day Experiment Metrics' },
          ] as { id: AdminTab; label: string }[]
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`min-h-[38px] rounded-lg px-3.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              tab === item.id ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Applications & Audit */}
      {tab === 'applications' && (
        <section className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4">
            <h2 className="font-display text-base font-bold text-zinc-950">Creator Applications &amp; Vetting</h2>
            <div className="flex flex-wrap gap-1">
              {(['all', 'pending', 'auditing', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setAppFilter(status)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium capitalize ${
                    appFilter === status ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-100 bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Creator</th>
                  <th className="px-4 py-3 font-semibold">Niche &amp; Area</th>
                  <th className="px-4 py-3 font-semibold text-right">Followers</th>
                  <th className="px-4 py-3 font-semibold text-right">ER %</th>
                  <th className="px-4 py-3 font-semibold text-right">Audit Avg</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredApplications.map((creator) => {
                  const avg = (
                    (creator.vetting_follower_quality +
                      creator.vetting_engagement +
                      creator.vetting_audience_fit) /
                    3
                  ).toFixed(1);
                  return (
                    <tr key={creator.id} className="hover:bg-zinc-50/70">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-zinc-900">{creator.name}</p>
                        <p className="font-mono text-zinc-500">{creator.instagram}</p>
                      </td>
                      <td className="px-4 py-3 capitalize text-zinc-700">
                        {creator.niche} · {creator.area}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-zinc-900">
                        {formatIndianNumber(creator.followers)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-zinc-900">
                        {creator.engagement_rate}%
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-zinc-900">
                        {creator.vetting_follower_quality > 0 ? `${avg}/10` : '—'}
                      </td>
                      <td className="px-4 py-3 capitalize font-medium">
                        <span
                          className={
                            creator.status === 'approved'
                              ? 'text-emerald-700'
                              : creator.status === 'rejected'
                              ? 'text-rose-700'
                              : creator.status === 'auditing'
                              ? 'text-amber-700'
                              : 'text-zinc-600'
                          }
                        >
                          {creator.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openAudit(creator)}
                          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100"
                        >
                          Audit / Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab 2: Shortlist Builder */}
      {tab === 'shortlists' && (
        <section className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <div>
              <h2 className="font-display text-base font-bold text-zinc-950">1. Select Brand Shortlist Request</h2>
              <select
                value={selectedRequestId}
                onChange={(e) => {
                  setSelectedRequestId(e.target.value);
                  setPickedCreatorIds([]);
                  setShortlistSavedMsg('');
                }}
                aria-label="Select brand shortlist request"
                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
              >
                {state.shortlistRequests.map((req) => {
                  const brand = state.brands.find((b) => b.id === req.brand_id);
                  return (
                    <option key={req.id} value={req.id}>
                      {brand?.name ?? 'Brand'} ({brand?.category}, {brand?.area}) — {req.goal} · [{req.status}]
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedBrand && selectedRequest && (
              <div className="rounded-xl bg-zinc-50 p-4 text-xs text-zinc-700 space-y-1">
                <p>
                  <span className="font-semibold text-zinc-900">Founder:</span> {selectedBrand.founder} (WhatsApp:{' '}
                  <span className="font-mono">{selectedBrand.whatsapp}</span>)
                </p>
                <p>
                  <span className="font-semibold text-zinc-900">Budget &amp; Timeline:</span>{' '}
                  {selectedBrand.budget_range} · {selectedRequest.timeline}
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-zinc-950">
                  2. Pick 3 Approved Creators ({pickedCreatorIds.length}/3 selected)
                </h3>
              </div>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {approvedCreators.map((c) => {
                  const checked = pickedCreatorIds.includes(c.id);
                  const avg = (
                    (c.vetting_follower_quality + c.vetting_engagement + c.vetting_audience_fit) /
                    3
                  ).toFixed(1);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => togglePickCreator(c.id)}
                      className={`flex items-start justify-between rounded-xl border p-3 text-left text-xs transition-colors ${
                        checked ? 'border-rose-400 bg-rose-50/60' : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-zinc-950">{c.name}</p>
                        <p className="font-mono text-zinc-500">{c.instagram}</p>
                        <p className="mt-1 capitalize text-zinc-600">
                          {c.niche} · {c.area} · {formatIndianNumber(c.followers)} · {avg}/10
                        </p>
                      </div>
                      <span
                        className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border text-[11px] font-bold ${
                          checked ? 'border-rose-600 bg-rose-600 text-white' : 'border-zinc-300 bg-white'
                        }`}
                      >
                        {checked ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div>
              <h2 className="font-display text-base font-bold text-zinc-950">3. WhatsApp-Ready Shortlist Message</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Select 3 creators on the left to generate the formatted message, then copy or deliver directly to the
                Brand Portal.
              </p>

              <textarea
                readOnly
                rows={10}
                value={
                  generatedWhatsAppText ||
                  'Select 3 approved creators to preview the WhatsApp shortlist message...'
                }
                aria-label="WhatsApp shortlist preview"
                className="mt-3 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-sans text-xs leading-relaxed text-zinc-800"
              />
            </div>

            <div className="space-y-2.5">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!generatedWhatsAppText}
                  onClick={handleCopyWhatsApp}
                  className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-4 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-40"
                >
                  {copiedWa ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedWa ? 'Copied ✓' : 'Copy WhatsApp Message'}</span>
                </button>
                <button
                  type="button"
                  disabled={pickedCreatorIds.length !== 3 || !selectedRequest}
                  onClick={handleSaveShortlist}
                  className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-xl gradient-brand px-4 text-xs font-semibold text-white disabled:opacity-40"
                >
                  Save &amp; Send Shortlist
                </button>
              </div>
              {shortlistSavedMsg && <p className="text-xs font-medium text-emerald-700">{shortlistSavedMsg}</p>}
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: Bookings, UPI Tracker & Commission Calculator */}
      {tab === 'bookings' && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-zinc-950">20% Commission Calculator</h2>
                <p className="text-xs text-zinc-500">Quick split check for custom packages</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 tabular-nums">
                <div>
                  <label htmlFor="calc-price" className="block text-[11px] font-medium text-zinc-500">
                    Booking Price (₹)
                  </label>
                  <input
                    id="calc-price"
                    type="number"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value)}
                    className="mt-1 h-10 w-32 rounded-xl border border-zinc-200 px-3 font-mono text-sm font-semibold text-zinc-900"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-zinc-500">MicroMatch Fee (20%)</span>
                  <span className="font-mono text-base font-bold text-rose-600">
                    {formatINR(calcResult.platformFee)}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-zinc-500">Creator Payout (80%)</span>
                  <span className="font-mono text-base font-bold text-zinc-950">
                    {formatINR(calcResult.creatorPayout)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-100 bg-zinc-50 text-zinc-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Brand &amp; Creator</th>
                    <th className="px-4 py-3 font-semibold text-right">Total</th>
                    <th className="px-4 py-3 font-semibold text-right">Fee (20%)</th>
                    <th className="px-4 py-3 font-semibold text-right">Payout (80%)</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Brand UPI</th>
                    <th className="px-4 py-3 font-semibold">Creator Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {state.bookings.map((b) => {
                    const brand = state.brands.find((item) => item.id === b.brand_id);
                    const creator = state.creators.find((item) => item.id === b.creator_id);
                    return (
                      <tr key={b.id} className="hover:bg-zinc-50/70">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-zinc-900">{brand?.name ?? 'Brand'}</p>
                          <p className="text-zinc-500">
                            {creator?.name ?? 'Creator'} ({creator?.instagram})
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums font-semibold text-zinc-900">
                          {formatINR(b.price)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-rose-700">
                          {formatINR(b.platform_fee)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-zinc-900">
                          {formatINR(b.creator_payout)}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={b.status}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                            aria-label={`Booking status for ${brand?.name}`}
                            className="h-9 rounded-lg border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-900"
                          >
                            <option value="Briefed">Briefed</option>
                            <option value="In progress">In progress</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Results shared">Results shared</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => toggleBookingUpiPayment(b.id)}
                            className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                              b.upi_payment_status === 'received'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-amber-200 bg-amber-50 text-amber-800'
                            }`}
                          >
                            {b.upi_payment_status === 'received' ? 'UPI Received ✓' : 'Mark UPI Received'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => toggleCreatorPayout(b.id)}
                            className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                              b.creator_payout_status === 'paid'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                            }`}
                          >
                            {b.creator_payout_status === 'paid' ? 'Paid Out ✓' : 'Mark Paid Out'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Results Entry */}
      {tab === 'results' && (
        <section className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-display text-lg font-bold text-zinc-950">Enter Collaboration Results Summary</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Saving results marks the booking as &ldquo;Results shared&rdquo; and displays the scorecard in the Brand
            Portal.
          </p>

          <form onSubmit={handleSaveResults} className="mt-5 space-y-4">
            <div>
              <label htmlFor="res-booking" className="block text-xs font-semibold text-zinc-700">
                Select booking
              </label>
              <select
                id="res-booking"
                value={resultsBookingId}
                onChange={(e) => handleSelectResultsBooking(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
              >
                {state.bookings.map((b) => {
                  const brand = state.brands.find((item) => item.id === b.brand_id);
                  const creator = state.creators.find((item) => item.id === b.creator_id);
                  return (
                    <option key={b.id} value={b.id}>
                      {brand?.name} × {creator?.name} ({b.status})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="res-reach" className="block text-xs font-semibold text-zinc-700">
                  Total Reach
                </label>
                <input
                  id="res-reach"
                  type="number"
                  value={reach}
                  onChange={(e) => setReach(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3 font-mono text-sm text-zinc-900"
                />
              </div>
              <div>
                <label htmlFor="res-clicks" className="block text-xs font-semibold text-zinc-700">
                  Link Clicks
                </label>
                <input
                  id="res-clicks"
                  type="number"
                  value={linkClicks}
                  onChange={(e) => setLinkClicks(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3 font-mono text-sm text-zinc-900"
                />
              </div>
              <div>
                <label htmlFor="res-enq" className="block text-xs font-semibold text-zinc-700">
                  DM / WhatsApp Enquiries
                </label>
                <input
                  id="res-enq"
                  type="number"
                  value={enquiries}
                  onChange={(e) => setEnquiries(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3 font-mono text-sm text-zinc-900"
                />
              </div>
              <div>
                <label htmlFor="res-orders" className="block text-xs font-semibold text-zinc-700">
                  Discount-Code Orders
                </label>
                <input
                  id="res-orders"
                  type="number"
                  value={orders}
                  onChange={(e) => setOrders(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3 font-mono text-sm text-zinc-900"
                />
              </div>
              <div>
                <label htmlFor="res-sat" className="block text-xs font-semibold text-zinc-700">
                  Brand Satisfaction (1–10)
                </label>
                <input
                  id="res-sat"
                  type="number"
                  min={1}
                  max={10}
                  value={satisfaction}
                  onChange={(e) => setSatisfaction(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3 font-mono text-sm text-zinc-900"
                />
              </div>
              <div>
                <label htmlFor="res-ref" className="block text-xs font-semibold text-zinc-700">
                  Referral Brand Name (optional)
                </label>
                <input
                  id="res-ref"
                  type="text"
                  value={referralName}
                  onChange={(e) => setReferralName(e.target.value)}
                  placeholder="e.g. Noor Linen Studio"
                  className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm text-zinc-900"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-zinc-800">
              <input
                type="checkbox"
                checked={wouldRebook}
                onChange={(e) => setWouldRebook(e.target.checked)}
                className="h-4 w-4 accent-rose-600"
              />
              <span>Brand expressed intent to rebook</span>
            </label>

            <div className="flex items-center justify-between pt-2">
              {resultsSaved ? (
                <span className="text-xs font-semibold text-emerald-700">Results saved &amp; shared ✓</span>
              ) : (
                <span />
              )}
              <button
                type="submit"
                className="min-h-[44px] rounded-xl gradient-brand px-5 text-xs font-semibold text-white"
              >
                Save Results Summary
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Tab 5: 30-Day Experiment Metrics */}
      {tab === 'metrics' && (
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-xs text-zinc-500">Founder Interviews Conducted</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="font-mono text-2xl font-bold text-zinc-950 tabular-nums">
                  {state.interviewsConducted}
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setInterviewsConducted(state.interviewsConducted - 1)}
                    className="h-8 w-8 rounded-lg border border-zinc-200 text-xs font-bold hover:bg-zinc-50"
                    aria-label="Decrease interview count"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterviewsConducted(state.interviewsConducted + 1)}
                    className="h-8 w-8 rounded-lg border border-zinc-200 text-xs font-bold hover:bg-zinc-50"
                    aria-label="Increase interview count"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-xs text-zinc-500">Shortlists Delivered (Target 4)</p>
              <p className="mt-2 font-mono text-2xl font-bold text-zinc-950 tabular-nums">
                {shortlistsDelivered} / 4
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-xs text-zinc-500">Paid Pilots (Target 3)</p>
              <p className="mt-2 font-mono text-2xl font-bold text-zinc-950 tabular-nums">{paidPilots} / 3</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-xs text-zinc-500">Rebook Intent (Target 2)</p>
              <p className="mt-2 font-mono text-2xl font-bold text-zinc-950 tabular-nums">
                {rebookIntentCount} / 2
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-xs text-zinc-500">Brand Referrals (Target 3)</p>
              <p className="mt-2 font-mono text-2xl font-bold text-zinc-950 tabular-nums">{referralCount} / 3</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-xs text-zinc-500">Average Satisfaction (Target 7+/10)</p>
              <p className="mt-2 font-mono text-2xl font-bold text-zinc-950 tabular-nums">
                {avgSatisfaction} / 10
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-xs text-zinc-500">Creator On-Time Delivery Rate</p>
              <p className="mt-2 font-mono text-2xl font-bold text-zinc-950 tabular-nums">{onTimeRate}%</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-xs text-zinc-500">Pilot Platform Revenue (20%)</p>
              <p className="mt-2 font-mono text-2xl font-bold text-rose-600 tabular-nums">
                {formatINR(
                  state.bookings
                    .filter((b) => b.upi_payment_status === 'received')
                    .reduce((acc, b) => acc + b.platform_fee, 0)
                )}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h3 className="font-display text-base font-bold text-zinc-950">
              Post-Pilot Roadmap (Build only after 30-day experiment validates)
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs text-zinc-600">
              <li>
                <strong>Automated Vetting:</strong> Instagram Graph API / audience bot checks to pre-score creator
                applications before manual spot-checking.
              </li>
              <li>
                <strong>Live UPI Escrow Integration:</strong> Razorpay Route / Cashfree split payments to automate
                brand collection and 80% creator settlement.
              </li>
              <li>
                <strong>Verified Ratings &amp; Reviews:</strong> Public brand reviews and on-time delivery badges on
                creator profiles.
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* Audit Creator Modal */}
      {auditingCreator && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <p className="text-xs text-zinc-500">Manual Audience Audit</p>
                <h3 className="font-display text-lg font-bold text-zinc-950">
                  {auditingCreator.name} ({auditingCreator.instagram})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAuditingCreator(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100"
                aria-label="Close audit modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl bg-zinc-50 p-3.5 text-xs text-zinc-700 space-y-1">
              <p>
                Followers: <strong className="font-mono">{formatIndianNumber(auditingCreator.followers)}</strong> ·
                Avg Reel Views:{' '}
                <strong className="font-mono">{formatIndianNumber(auditingCreator.avg_reel_views)}</strong> · ER:{' '}
                <strong className="font-mono">{auditingCreator.engagement_rate}%</strong>
              </p>
              <p>Audience split: {auditingCreator.audience_location_split}</p>
              {auditingCreator.expected_price_note && (
                <p>Expected pricing: {auditingCreator.expected_price_note}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="audit-q" className="block text-xs font-semibold text-zinc-700">
                  Follower Quality (/10)
                </label>
                <input
                  id="audit-q"
                  type="number"
                  min={1}
                  max={10}
                  value={scoreQuality}
                  onChange={(e) => setScoreQuality(Number(e.target.value))}
                  className="mt-1 h-10 w-full rounded-xl border border-zinc-200 px-3 font-mono text-sm"
                />
              </div>
              <div>
                <label htmlFor="audit-e" className="block text-xs font-semibold text-zinc-700">
                  Engagement (/10)
                </label>
                <input
                  id="audit-e"
                  type="number"
                  min={1}
                  max={10}
                  value={scoreEngagement}
                  onChange={(e) => setScoreEngagement(Number(e.target.value))}
                  className="mt-1 h-10 w-full rounded-xl border border-zinc-200 px-3 font-mono text-sm"
                />
              </div>
              <div>
                <label htmlFor="audit-f" className="block text-xs font-semibold text-zinc-700">
                  Location Fit (/10)
                </label>
                <input
                  id="audit-f"
                  type="number"
                  min={1}
                  max={10}
                  value={scoreFit}
                  onChange={(e) => setScoreFit(Number(e.target.value))}
                  className="mt-1 h-10 w-full rounded-xl border border-zinc-200 px-3 font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="audit-notes" className="block text-xs font-semibold text-zinc-700">
                Auditor notes
              </label>
              <textarea
                id="audit-notes"
                rows={3}
                value={auditNotes}
                onChange={(e) => setAuditNotes(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 p-3 text-xs text-zinc-900"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => handleSaveAudit('rejected')}
                className="min-h-[40px] rounded-xl border border-rose-200 bg-rose-50 px-3.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleSaveAudit('auditing')}
                className="min-h-[40px] rounded-xl border border-zinc-300 bg-white px-3.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                Mark Audit in Progress
              </button>
              <button
                type="button"
                onClick={() => handleSaveAudit('approved')}
                className="min-h-[40px] rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Approve &amp; List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
