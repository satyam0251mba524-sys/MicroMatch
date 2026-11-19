import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../store/AppContext';
import type { CreatorNiche, NcrArea, PageRoute } from '../types';
import { isValidIndianMobile } from '../utils/format';

interface CreatorApplyPageProps {
  onNavigate: (page: PageRoute) => void;
}

export function CreatorApplyPage({ onNavigate }: CreatorApplyPageProps) {
  const { submitCreatorApplication } = useApp();

  const [name, setName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [followers, setFollowers] = useState('6500');
  const [niche, setNiche] = useState<CreatorNiche>('fashion');
  const [area, setArea] = useState<NcrArea>('South Delhi');
  const [audienceSplit, setAudienceSplit] = useState('65% Delhi NCR · 20% Mumbai · 15% Other');
  const [avgReelViews, setAvgReelViews] = useState('4800');
  const [engagementRate, setEngagementRate] = useState('4.9');
  const [pastCollabs, setPastCollabs] = useState('4');
  const [expectedPrice, setExpectedPrice] = useState('Starter ₹4,000 / Launch Pack ₹6,000');
  const [whatsapp, setWhatsapp] = useState('');
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedHandle, setSubmittedHandle] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    const followerCount = Number(followers);
    const reelViewsCount = Number(avgReelViews);
    const erValue = Number(engagementRate);
    const collabsCount = Number(pastCollabs);

    if (!name.trim()) nextErrors.name = 'Enter your full name';
    if (!instagram.trim()) nextErrors.instagram = 'Enter your Instagram handle';
    if (!Number.isFinite(followerCount) || followerCount < 1000) {
      nextErrors.followers = 'Enter your current follower count (typically 2,000–20,000)';
    }
    if (!audienceSplit.trim()) nextErrors.audienceSplit = 'Share your top audience cities';
    if (!Number.isFinite(reelViewsCount) || reelViewsCount <= 0) {
      nextErrors.avgReelViews = 'Enter average reel views';
    }
    if (!Number.isFinite(erValue) || erValue <= 0) {
      nextErrors.engagementRate = 'Enter average engagement rate (%)';
    }
    if (!Number.isFinite(collabsCount) || collabsCount < 0) {
      nextErrors.pastCollabs = 'Enter number of past collaborations';
    }
    if (!expectedPrice.trim()) nextErrors.expectedPrice = 'Share your expected package pricing';
    if (!isValidIndianMobile(whatsapp)) {
      nextErrors.whatsapp = 'Enter a valid 10-digit WhatsApp number';
    }
    if (!consent) {
      nextErrors.consent = 'You must agree to the audience check, fixed packages, and written brief terms';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const created = submitCreatorApplication({
      name,
      instagram,
      followers: followerCount,
      niche,
      area,
      audience_location_split: audienceSplit,
      avg_reel_views: reelViewsCount,
      engagement_rate: erValue,
      past_collabs_count: collabsCount,
      expected_price_note: expectedPrice,
      whatsapp,
      consent_agreed: consent,
    });

    setSubmittedHandle(created.instagram);
  };

  if (submittedHandle) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Creator application submitted</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-zinc-950">
            Application status for {submittedHandle}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            We manually review every creator&apos;s follower quality, engagement pattern, and Delhi NCR audience fit
            within 48 hours.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {['Pending', 'Audit in progress', 'Approved / Rejected'].map((step, i) => (
              <div
                key={step}
                className={`rounded-xl border p-3 text-xs ${
                  i === 0
                    ? 'border-rose-300 bg-rose-50/70 font-semibold text-zinc-950'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-400'
                } ${i === 2 ? 'col-span-2' : ''}`}
              >
                <span className="font-mono text-[11px] mr-1">0{i + 1}.</span>
                {step}
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onNavigate('creator-dashboard')}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl gradient-brand px-5 text-sm font-semibold text-white"
            >
              <span>Open Creator Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              Demo Admin Audit Queue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="border-b border-zinc-200 pb-6">
        <p className="text-xs font-semibold text-violet-600">For Delhi NCR micro-creators (2k–20k followers)</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-zinc-950">
          Apply to join MicroMatch
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Work with founder-run Indian clothing, skincare, and food brands on fixed-price packages—no awkward DM
          haggling and guaranteed payout upon delivery.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="creator-name" className="block text-xs font-semibold text-zinc-700">
              Full name *
            </label>
            <input
              id="creator-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kriti Sharma"
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="creator-ig" className="block text-xs font-semibold text-zinc-700">
              Instagram handle *
            </label>
            <input
              id="creator-ig"
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="e.g. @kriti.wardrobe"
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 font-mono text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            />
            {errors.instagram && <p className="mt-1 text-xs text-rose-600">{errors.instagram}</p>}
          </div>

          <div>
            <label htmlFor="creator-followers" className="block text-xs font-semibold text-zinc-700">
              Follower count (2,000 – 20,000) *
            </label>
            <input
              id="creator-followers"
              type="number"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 font-mono text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            />
            {errors.followers && <p className="mt-1 text-xs text-rose-600">{errors.followers}</p>}
          </div>

          <div>
            <label htmlFor="creator-niche" className="block text-xs font-semibold text-zinc-700">
              Primary niche
            </label>
            <select
              id="creator-niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value as CreatorNiche)}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            >
              <option value="fashion">Fashion</option>
              <option value="skincare">Skincare</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="food">Food</option>
            </select>
          </div>

          <div>
            <label htmlFor="creator-area" className="block text-xs font-semibold text-zinc-700">
              City / Area
            </label>
            <select
              id="creator-area"
              value={area}
              onChange={(e) => setArea(e.target.value as NcrArea)}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            >
              <option value="South Delhi">South Delhi</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Other NCR">Other NCR</option>
            </select>
          </div>

          <div>
            <label htmlFor="creator-whatsapp" className="block text-xs font-semibold text-zinc-700">
              WhatsApp number *
            </label>
            <input
              id="creator-whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="10-digit mobile number"
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 font-mono text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            />
            {errors.whatsapp && <p className="mt-1 text-xs text-rose-600">{errors.whatsapp}</p>}
          </div>

          <div>
            <label htmlFor="creator-views" className="block text-xs font-semibold text-zinc-700">
              Average reel views *
            </label>
            <input
              id="creator-views"
              type="number"
              value={avgReelViews}
              onChange={(e) => setAvgReelViews(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 font-mono text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            />
            {errors.avgReelViews && <p className="mt-1 text-xs text-rose-600">{errors.avgReelViews}</p>}
          </div>

          <div>
            <label htmlFor="creator-er" className="block text-xs font-semibold text-zinc-700">
              Average engagement rate (%) *
            </label>
            <input
              id="creator-er"
              type="number"
              step="0.1"
              value={engagementRate}
              onChange={(e) => setEngagementRate(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 font-mono text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            />
            {errors.engagementRate && <p className="mt-1 text-xs text-rose-600">{errors.engagementRate}</p>}
          </div>

          <div>
            <label htmlFor="creator-collabs" className="block text-xs font-semibold text-zinc-700">
              Past brand collaborations *
            </label>
            <input
              id="creator-collabs"
              type="number"
              value={pastCollabs}
              onChange={(e) => setPastCollabs(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 font-mono text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            />
            {errors.pastCollabs && <p className="mt-1 text-xs text-rose-600">{errors.pastCollabs}</p>}
          </div>

          <div>
            <label htmlFor="creator-price" className="block text-xs font-semibold text-zinc-700">
              Expected price per package *
            </label>
            <input
              id="creator-price"
              type="text"
              value={expectedPrice}
              onChange={(e) => setExpectedPrice(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            />
            {errors.expectedPrice && <p className="mt-1 text-xs text-rose-600">{errors.expectedPrice}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="creator-split" className="block text-xs font-semibold text-zinc-700">
            Audience location split (from Instagram Insights) *
          </label>
          <input
            id="creator-split"
            type="text"
            value={audienceSplit}
            onChange={(e) => setAudienceSplit(e.target.value)}
            placeholder="e.g. 65% Delhi NCR · 20% Mumbai · 15% Other"
            className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
          />
          {errors.audienceSplit && <p className="mt-1 text-xs text-rose-600">{errors.audienceSplit}</p>}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-rose-600"
            />
            <span className="text-xs leading-relaxed text-zinc-800 font-medium">
              I agree to an audience check, fixed-price packages and a written brief for every collaboration.
            </span>
          </label>
          {errors.consent && <p className="mt-2 text-xs text-rose-600">{errors.consent}</p>}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">MicroMatch takes 20% from the listed package price upon booking.</p>
          <button
            type="submit"
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl gradient-brand px-6 text-sm font-semibold text-white whitespace-nowrap"
          >
            <span>Submit Creator Application</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
