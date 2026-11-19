import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { MICROMATCH_WHATSAPP } from '../data/seed';
import { useApp } from '../store/AppContext';
import type { BrandCategory, BudgetRange, CampaignGoal, NcrArea, PageRoute } from '../types';
import { formatWhatsAppHref, isValidIndianMobile } from '../utils/format';

interface ShortlistRequestPageProps {
  onNavigate: (page: PageRoute) => void;
}

export function ShortlistRequestPage({ onNavigate }: ShortlistRequestPageProps) {
  const { submitShortlistRequest } = useApp();

  const [brandName, setBrandName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [founder, setFounder] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [category, setCategory] = useState<BrandCategory>('clothing');
  const [area, setArea] = useState<NcrArea>('South Delhi');
  const [brandAge, setBrandAge] = useState('6–12 months');
  const [budgetRange, setBudgetRange] = useState<BudgetRange>('₹10k–20k');
  const [goal, setGoal] = useState<CampaignGoal>('launch');
  const [timeline, setTimeline] = useState('Within 2 weeks');
  const [currentDiscovery, setCurrentDiscovery] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedBrandName, setSubmittedBrandName] = useState<string | null>(null);
  const [submittedWhatsApp, setSubmittedWhatsApp] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!brandName.trim()) nextErrors.brandName = 'Enter your brand name';
    if (!instagram.trim()) nextErrors.instagram = 'Enter your brand Instagram handle';
    if (!founder.trim()) nextErrors.founder = 'Enter the founder name';
    if (!isValidIndianMobile(whatsapp)) {
      nextErrors.whatsapp = 'Enter a valid 10-digit Indian WhatsApp number';
    }
    if (!timeline.trim()) nextErrors.timeline = 'Share your preferred launch timeline';
    if (!currentDiscovery.trim()) nextErrors.currentDiscovery = 'Tell us how you currently find creators';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    submitShortlistRequest({
      brandName,
      instagram,
      founder,
      whatsapp,
      category,
      area,
      brand_age: brandAge,
      budget_range: budgetRange,
      current_discovery: currentDiscovery,
      goal,
      timeline,
    });

    setSubmittedBrandName(brandName.trim());
    setSubmittedWhatsApp(whatsapp.trim());
  };

  if (submittedBrandName) {
    const waHref = formatWhatsAppHref(
      MICROMATCH_WHATSAPP,
      `Hi MicroMatch! I just requested a creator shortlist for ${submittedBrandName} (${area}).`
    );

    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="mt-4 text-xs font-semibold text-emerald-700">Shortlist request received</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-zinc-950 sm:text-3xl">
            We&apos;ll send your shortlist on WhatsApp within 48 hours.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Our team is reviewing vetted South Delhi &amp; Gurugram creators for{' '}
            <span className="font-semibold text-zinc-900">{submittedBrandName}</span> and will message{' '}
            <span className="font-mono text-zinc-900">{submittedWhatsApp}</span> with 3 fixed-price matches.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onNavigate('brand-dashboard')}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl gradient-brand px-5 text-sm font-semibold text-white"
            >
              <span>Open Brand Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              Demo Admin Shortlist Builder
            </button>
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-5">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Have urgent launch dates? Ping us directly on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="border-b border-zinc-200 pb-6">
        <p className="text-xs font-semibold text-rose-600">Free for Delhi NCR founder-run brands</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-zinc-950">
          Get a free shortlist of 3 vetted creators
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Tell us about your upcoming drop or campaign. You&apos;ll receive 3 audited local micro-creators with fixed
          package prices on WhatsApp within 48 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="brand-name" className="block text-xs font-semibold text-zinc-700">
              Brand name *
            </label>
            <input
              id="brand-name"
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Noor Linen Studio"
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            />
            {errors.brandName && <p className="mt-1 text-xs text-rose-600">{errors.brandName}</p>}
          </div>

          <div>
            <label htmlFor="brand-ig" className="block text-xs font-semibold text-zinc-700">
              Brand Instagram handle *
            </label>
            <input
              id="brand-ig"
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="e.g. @noorlinen.in"
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            />
            {errors.instagram && <p className="mt-1 text-xs text-rose-600">{errors.instagram}</p>}
          </div>

          <div>
            <label htmlFor="founder-name" className="block text-xs font-semibold text-zinc-700">
              Founder name *
            </label>
            <input
              id="founder-name"
              type="text"
              value={founder}
              onChange={(e) => setFounder(e.target.value)}
              placeholder="Your name"
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            />
            {errors.founder && <p className="mt-1 text-xs text-rose-600">{errors.founder}</p>}
          </div>

          <div>
            <label htmlFor="brand-whatsapp" className="block text-xs font-semibold text-zinc-700">
              WhatsApp number *
            </label>
            <input
              id="brand-whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="10-digit mobile number"
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 font-mono text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            />
            {errors.whatsapp && <p className="mt-1 text-xs text-rose-600">{errors.whatsapp}</p>}
          </div>

          <div>
            <label htmlFor="brand-category" className="block text-xs font-semibold text-zinc-700">
              Category
            </label>
            <select
              id="brand-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as BrandCategory)}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            >
              <option value="clothing">Clothing &amp; Apparel</option>
              <option value="skincare">Skincare &amp; Clean Beauty</option>
              <option value="food">Food &amp; Artisanal Cafe</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="brand-area" className="block text-xs font-semibold text-zinc-700">
              Area
            </label>
            <select
              id="brand-area"
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
            <label htmlFor="brand-age" className="block text-xs font-semibold text-zinc-700">
              Brand age
            </label>
            <select
              id="brand-age"
              value={brandAge}
              onChange={(e) => setBrandAge(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            >
              <option value="Under 6 months">Under 6 months</option>
              <option value="6–12 months">6–12 months</option>
              <option value="12–18 months">12–18 months</option>
              <option value="18–24 months">18–24 months</option>
              <option value="24+ months">24+ months</option>
            </select>
          </div>

          <div>
            <label htmlFor="brand-budget" className="block text-xs font-semibold text-zinc-700">
              Monthly marketing budget
            </label>
            <select
              id="brand-budget"
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value as BudgetRange)}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            >
              <option value="₹10k–20k">₹10k–20k</option>
              <option value="₹20k–35k">₹20k–35k</option>
              <option value="₹35k–50k">₹35k–50k</option>
              <option value="₹50k+">₹50k+</option>
            </select>
          </div>

          <div>
            <label htmlFor="campaign-goal" className="block text-xs font-semibold text-zinc-700">
              Campaign goal
            </label>
            <select
              id="campaign-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value as CampaignGoal)}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            >
              <option value="launch">New product launch</option>
              <option value="festive sale">Festive sale</option>
              <option value="seasonal drop">Seasonal collection drop</option>
            </select>
          </div>

          <div>
            <label htmlFor="campaign-timeline" className="block text-xs font-semibold text-zinc-700">
              Preferred timeline *
            </label>
            <input
              id="campaign-timeline"
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g. Next 2 weeks, or by 30 Nov"
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
            />
            {errors.timeline && <p className="mt-1 text-xs text-rose-600">{errors.timeline}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="current-discovery" className="block text-xs font-semibold text-zinc-700">
            How do you currently find creators? *
          </label>
          <input
            id="current-discovery"
            type="text"
            value={currentDiscovery}
            onChange={(e) => setCurrentDiscovery(e.target.value)}
            placeholder="e.g. Cold DMing on Instagram, asking friends, spreadsheets"
            className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm text-zinc-900 focus:border-rose-400 focus:outline-none"
          />
          {errors.currentDiscovery && <p className="mt-1 text-xs text-rose-600">{errors.currentDiscovery}</p>}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">Zero upfront fee to request a shortlist. Fixed prices only.</p>
          <button
            type="submit"
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl gradient-brand px-6 text-sm font-semibold text-white whitespace-nowrap"
          >
            <span>Submit Shortlist Request</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
