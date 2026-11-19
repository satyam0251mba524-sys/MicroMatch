import { CheckCircle2, MapPin, Users, X } from 'lucide-react';
import type { Creator, Package } from '../types';
import { calculateCommission, formatIndianNumber, formatINR } from '../utils/format';
import { CreatorAvatar } from './CreatorAvatar';

interface CreatorProfileModalProps {
  creator: Creator | null;
  packages: Package[];
  onClose: () => void;
  onRequestShortlist: () => void;
  onBookCreator?: (creatorId: string, packageId: string) => void;
}

function ScoreRow({ label, score }: { label: string; score: number }) {
  const pct = Math.min(100, Math.max(0, score * 10));
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-700">{label}</span>
        <span className="font-mono font-semibold text-zinc-900 tabular-nums">{score}/10</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full gradient-brand transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function CreatorProfileModal({
  creator,
  packages,
  onClose,
  onRequestShortlist,
  onBookCreator,
}: CreatorProfileModalProps) {
  if (!creator) return null;

  const avgScore = (
    (creator.vetting_follower_quality + creator.vetting_engagement + creator.vetting_audience_fit) /
    3
  ).toFixed(1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-zinc-950/50 p-0 sm:p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creator-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 bg-white/95 px-6 py-4 backdrop-blur-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Vetted MicroMatch Creator · Audit Score {avgScore}/10</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close creator profile"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Identity header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <CreatorAvatar
              name={creator.name}
              niche={creator.niche}
              avatarUrl={creator.avatarUrl}
              className="h-24 w-24 rounded-2xl"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h2 id="creator-modal-title" className="font-display text-2xl font-bold text-zinc-950">
                  {creator.name}
                </h2>
                <span className="font-mono text-sm text-zinc-500">{creator.instagram}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-600">
                <span className="capitalize">{creator.niche}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  {creator.area}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{creator.past_collabs_count} past brand collabs</span>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Audience split: <span className="text-zinc-700 font-medium">{creator.audience_location_split}</span>
              </p>
            </div>
          </div>

          {/* Key metrics strip */}
          <div className="grid grid-cols-3 divide-x divide-zinc-200 rounded-xl border border-zinc-200 bg-zinc-50/70 py-3.5">
            <div className="px-4">
              <p className="text-xs text-zinc-500">Followers</p>
              <p className="mt-0.5 font-mono text-base sm:text-lg font-semibold text-zinc-900 tabular-nums">
                {formatIndianNumber(creator.followers)}
              </p>
            </div>
            <div className="px-4">
              <p className="text-xs text-zinc-500">Avg Reel Views</p>
              <p className="mt-0.5 font-mono text-base sm:text-lg font-semibold text-zinc-900 tabular-nums">
                {formatIndianNumber(creator.avg_reel_views)}
              </p>
            </div>
            <div className="px-4">
              <p className="text-xs text-zinc-500">Engagement</p>
              <p className="mt-0.5 font-mono text-base sm:text-lg font-semibold text-zinc-900 tabular-nums">
                {creator.engagement_rate}%
              </p>
            </div>
          </div>

          {/* Vetting scorecard */}
          <div className="space-y-3 border-t border-zinc-100 pt-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-zinc-900">Human Audience Audit Scorecard</h3>
              <span className="text-xs text-zinc-500">Verified prior to listing</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <ScoreRow label="Follower Quality" score={creator.vetting_follower_quality} />
              <ScoreRow label="Engagement Pattern" score={creator.vetting_engagement} />
              <ScoreRow label="Audience Location Fit" score={creator.vetting_audience_fit} />
            </div>
            {creator.vetting_notes && (
              <p className="rounded-xl bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-700 leading-relaxed">
                <span className="font-semibold text-zinc-900">Auditor note: </span>
                {creator.vetting_notes}
              </p>
            )}
          </div>

          {/* Fixed-price packages */}
          <div className="space-y-3 border-t border-zinc-100 pt-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-zinc-900">Fixed-Price Packages</h3>
              <span className="text-xs text-zinc-500">Includes written brief &amp; results summary</span>
            </div>

            {packages.length === 0 ? (
              <p className="text-sm text-zinc-500">Custom packages available upon shortlist request.</p>
            ) : (
              <div className="space-y-2.5">
                {packages.map((pkg) => {
                  const { platformFee, creatorPayout } = calculateCommission(pkg.price);
                  return (
                    <div
                      key={pkg.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-200 p-4 hover:border-zinc-300 transition-colors"
                    >
                      <div>
                        <p className="font-display text-sm font-bold text-zinc-900">{pkg.name}</p>
                        <p className="text-xs text-zinc-600">{pkg.deliverables}</p>
                        <p className="mt-1 text-[11px] text-zinc-400 tabular-nums">
                          {formatINR(creatorPayout)} creator payout + {formatINR(platformFee)} MicroMatch fee (20%)
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <span className="font-mono text-base font-bold text-zinc-950 tabular-nums">
                          {formatINR(pkg.price)}
                        </span>
                        {onBookCreator ? (
                          <button
                            type="button"
                            onClick={() => onBookCreator(creator.id, pkg.id)}
                            className="inline-flex min-h-[40px] items-center justify-center rounded-lg gradient-brand px-3.5 text-xs font-semibold text-white whitespace-nowrap"
                          >
                            Select &amp; Book
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={onRequestShortlist}
                            className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 whitespace-nowrap"
                          >
                            Request Shortlist
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-100 pt-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Users className="h-4 w-4 text-zinc-400" />
              <span>Want 3 matched creators like {creator.name.split(' ')[0]}?</span>
            </div>
            <button
              type="button"
              onClick={onRequestShortlist}
              className="w-full sm:w-auto inline-flex min-h-[44px] items-center justify-center rounded-lg gradient-brand px-5 text-sm font-semibold text-white whitespace-nowrap"
            >
              Get a free shortlist of 3 creators
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
