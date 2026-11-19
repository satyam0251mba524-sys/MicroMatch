import { ArrowRight, CheckCircle2, ChevronDown, ExternalLink, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { CreatorAvatar } from '../components/CreatorAvatar';
import { MICROMATCH_WHATSAPP } from '../data/seed';
import { useApp } from '../store/AppContext';
import type { Creator, PageRoute } from '../types';
import { formatIndianNumber, formatINR, formatWhatsAppHref } from '../utils/format';

interface LandingPageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectCreator: (creator: Creator) => void;
}

const PROBLEMS = [
  {
    num: '01',
    title: 'Fake or out-of-city followers',
    body: 'Most creators pitch screenshots of follower totals, not audience geography or real comments. You pay for reach in cities you do not even ship to.',
  },
  {
    num: '02',
    title: 'Endless DM pricing guesswork',
    body: 'One creator quotes ₹3,000, another with half the views quotes ₹18,000. Founders spend evenings chasing rates instead of running launches.',
  },
  {
    num: '03',
    title: 'Zero post-campaign accountability',
    body: 'Once a reel goes live, screenshots disappear. Without link clicks, enquiries, and discount-code tracking, you never know what worked.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Tell us your launch',
    body: 'Share your product category, neighbourhood focus, budget (₹10k–₹50k), and timeline in 2 minutes.',
  },
  {
    num: '02',
    title: 'Get a vetted shortlist',
    body: 'Within 48 hours on WhatsApp, receive 3 manually audited Delhi NCR creators matched to your brand.',
  },
  {
    num: '03',
    title: 'Book at a fixed price',
    body: 'Pick Starter, Launch Pack, or Festive Boost with a written brief and upfront UPI checkout.',
  },
  {
    num: '04',
    title: 'See your results',
    body: 'Review reach, link clicks, DM enquiries, and discount-code orders in one clean results summary.',
  },
];

const EXAMPLE_PACKAGES = [
  {
    name: 'Starter',
    deliverables: '1 reel + 2 stories',
    price: 4000,
    idealFor: 'Testing a single SKU or hero product with a local creator',
  },
  {
    name: 'Launch Pack',
    deliverables: '2 reels + 3 stories',
    price: 6000,
    idealFor: 'New collection drops and skincare routine storytelling',
  },
  {
    name: 'Festive Boost',
    deliverables: '3 reels + 5 stories',
    price: 12000,
    idealFor: 'Diwali, wedding season, and weekend pop-up traffic',
  },
];

const FAQS = [
  {
    q: 'How does MicroMatch vet every creator?',
    a: 'Every creator (2,000 to 20,000 followers) undergoes a manual human check across three signals scored out of 10: Follower Quality (spotting bots or engagement pods), Engagement Pattern (genuine saves and comments), and Audience Location Fit (South Delhi & Gurugram buyer density).',
  },
  {
    q: 'Why is this better than DMing creators or hiring an agency?',
    a: 'DMs take weeks of back-and-forth and leave you exposed to fake followers. Agencies charge ₹40,000+ monthly retainers designed for big consumer brands. MicroMatch gives founder-run brands fixed prices starting at ₹4,000 with zero retainers.',
  },
  {
    q: 'How does the 20% MicroMatch fee work?',
    a: 'Every package price is all-inclusive. For example, on a ₹6,000 Launch Pack, ₹4,800 (80%) goes to the creator upon verified delivery, and ₹1,200 (20%) is the MicroMatch fee covering vetting, written brief alignment, and results reporting.',
  },
  {
    q: 'How do payments work during the pilot?',
    a: 'You pay via UPI using the checkout QR or UPI ID inside your Brand Dashboard. Our team confirms payment receipt manually and releases payout to the creator only after deliverables are posted.',
  },
  {
    q: 'How fast will I get my shortlist?',
    a: 'We send your curated 3-creator shortlist directly on WhatsApp and inside your Brand Dashboard within 48 hours of submitting your brief.',
  },
];

export function LandingPage({ onNavigate, onSelectCreator }: LandingPageProps) {
  const { state } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const featuredCreators = state.creators.filter((c) => c.status === 'approved').slice(0, 4);
  const whatsappFooterHref = formatWhatsAppHref(
    MICROMATCH_WHATSAPP,
    'Hi MicroMatch! I would like to chat about booking vetted Delhi NCR micro-creators.'
  );

  return (
    <div className="bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-xs font-semibold tracking-wide text-rose-600">
                South Delhi &amp; Gurugram · 2k–20k Follower Creators
              </p>

              <h1
                className="mt-3 font-display font-extrabold tracking-tight text-zinc-950"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', lineHeight: 1.08, textWrap: 'balance' }}
              >
                Stop guessing which influencer to hire.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
                Get a shortlist of vetted local micro-creators with fixed prices and clear deliverables for your next
                launch.
              </p>

              {/* Primary CTA + Role Switch */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => onNavigate('shortlist-request')}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl gradient-brand px-6 text-sm font-semibold text-white shadow-sm transition-transform duration-150 hover:opacity-95 active:scale-[0.98] whitespace-nowrap"
                >
                  <span>Get a free shortlist of 3 vetted creators</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('shortlist-request')}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50 transition-colors whitespace-nowrap"
                >
                  I&apos;m a brand
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('creator-apply')}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50 transition-colors whitespace-nowrap"
                >
                  I&apos;m a creator
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('directory')}
                  className="inline-flex min-h-[42px] items-center px-2 text-sm font-medium text-zinc-600 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-950 whitespace-nowrap"
                >
                  Browse vetted creators
                </button>
              </div>

              {/* Trust signals */}
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-zinc-100 pt-5 text-xs font-medium text-zinc-600">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  Every creator passes an audience check
                </span>
                <span aria-hidden="true" className="text-zinc-300">
                  ·
                </span>
                <span>Fixed price. Written brief. Results summary.</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
                <img
                  src="/src/assets/images/hero_delhi_studio_1795101106760.jpg"
                  alt="Founder-run boutique clothing and skincare shoot in South Delhi"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/35 to-transparent p-5 text-white">
                  <p className="text-xs font-medium text-zinc-200">
                    Built for boutique clothing, skincare &amp; artisanal food brands spending ₹10k–₹50k/month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-zinc-500">Why founder-led brands get burned</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl" style={{ textWrap: 'balance' }}>
            More trustworthy than DMs. Simpler and cheaper than an agency.
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {PROBLEMS.map((item) => (
            <div key={item.num} className="rounded-2xl border border-zinc-200 bg-white p-6">
              <span className="font-mono text-xs font-semibold text-rose-600">{item.num}.</span>
              <h3 className="mt-3 font-display text-lg font-bold text-zinc-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works in 4 Steps */}
      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold text-zinc-500">How MicroMatch works</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
                From launch brief to measured orders in 4 steps
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('shortlist-request')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 whitespace-nowrap"
            >
              <span>Start your free shortlist</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.num} className="border-t border-zinc-200 pt-4">
                <span className="font-mono text-xs font-semibold text-violet-600">{step.num}.</span>
                <h3 className="mt-2 font-display text-base font-bold text-zinc-950">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vetting Criteria + Featured Creators */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold text-zinc-500">Our 3-point audience check</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
              Every creator is manually scored out of 10 before listing
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              No automated vanity metrics. We inspect recent reels, comment threads, and audience city breakdowns before
              approving any creator in South Delhi or Gurugram.
            </p>

            <div className="mt-6 space-y-4 border-t border-zinc-200 pt-5">
              <div>
                <h3 className="font-display text-sm font-bold text-zinc-900">1. Follower Quality (0–10)</h3>
                <p className="mt-1 text-xs text-zinc-600">
                  We check for real local accounts, organic growth, and zero giveaway-pod spikes.
                </p>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-zinc-900">2. Engagement Pattern (0–10)</h3>
                <p className="mt-1 text-xs text-zinc-600">
                  Saves, replies asking &ldquo;link please&rdquo;, and consistent views across the last 10 reels.
                </p>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-zinc-900">3. Audience Location Fit (0–10)</h3>
                <p className="mt-1 text-xs text-zinc-600">
                  Verified Delhi NCR follower share so your studio pop-up or COD shipping actually converts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('directory')}
              className="mt-6 inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              <span>Explore all vetted creators</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredCreators.map((creator) => {
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
                    className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300"
                  >
                    <div>
                      <div className="flex items-start gap-3.5">
                        <CreatorAvatar
                          name={creator.name}
                          niche={creator.niche}
                          avatarUrl={creator.avatarUrl}
                          className="h-14 w-14"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="truncate font-display text-base font-bold text-zinc-950">{creator.name}</h3>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              Vetted
                            </span>
                          </div>
                          <p className="truncate font-mono text-xs text-zinc-500">{creator.instagram}</p>
                          <p className="mt-1 text-xs text-zinc-600 capitalize">
                            {creator.niche} · {creator.area}
                          </p>
                        </div>
                      </div>

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
                          <span className="text-zinc-500">From</span>
                          <p className="font-mono font-semibold text-zinc-900 tabular-nums">{formatINR(minPrice)}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectCreator(creator)}
                      className="mt-4 flex min-h-[40px] w-full items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
                    >
                      View scorecard &amp; packages
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Fixed-Price Packages + Pilot Proof */}
      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-zinc-500">Transparent fixed-price packages</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
              Clear deliverables upfront. 20% flat platform fee included.
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              For example, on a ₹6,000 Launch Pack, ₹4,800 goes to the creator and ₹1,200 covers MicroMatch audit,
              briefing, and results tracking.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {EXAMPLE_PACKAGES.map((pkg, idx) => (
              <div
                key={pkg.name}
                className={`flex flex-col justify-between rounded-2xl border p-6 ${
                  idx === 1 ? 'border-rose-300 gradient-brand-subtle' : 'border-zinc-200 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-zinc-950">{pkg.name}</h3>
                    <span className="font-mono text-2xl font-bold text-zinc-950 tabular-nums">
                      {formatINR(pkg.price)}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs font-medium text-zinc-700">{pkg.deliverables}</p>
                  <p className="mt-4 text-sm text-zinc-600">{pkg.idealFor}</p>
                </div>

                <div className="mt-6 border-t border-zinc-200/80 pt-4 text-xs text-zinc-600 tabular-nums">
                  Creator payout: {formatINR(pkg.price * 0.8)} · MicroMatch fee: {formatINR(pkg.price * 0.2)}
                </div>
              </div>
            ))}
          </div>

          {/* Adjacent Proof Strip from seeded completed campaigns */}
          <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold text-zinc-500">Recent Delhi NCR pilot outcomes</p>
                <h3 className="mt-1 font-display text-base font-bold text-zinc-950">
                  Sutra Loom (South Delhi) &amp; Vana Botanics (Gurugram)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('brand-dashboard')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 whitespace-nowrap"
              >
                Inspect sample results in Brand Portal →
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-5 sm:grid-cols-4">
              <div>
                <p className="text-xs text-zinc-500">Combined Reach</p>
                <p className="mt-1 font-mono text-xl font-bold text-zinc-950 tabular-nums">31,370</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Tracked Link Clicks</p>
                <p className="mt-1 font-mono text-xl font-bold text-zinc-950 tabular-nums">557</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Brand Enquiries</p>
                <p className="mt-1 font-mono text-xl font-bold text-zinc-950 tabular-nums">85</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Discount-Code Orders</p>
                <p className="mt-1 font-mono text-xl font-bold text-zinc-950 tabular-nums">33</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
          Frequently asked questions
        </h2>

        <div className="mt-6 divide-y divide-zinc-200 border-y border-zinc-200">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex min-h-[52px] w-full items-center justify-between gap-4 py-4 text-left font-display text-sm font-semibold text-zinc-900 sm:text-base"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-zinc-500 shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && <p className="pb-4 text-sm leading-relaxed text-zinc-600">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-lg font-extrabold tracking-tight text-zinc-950">
                Micro<span className="gradient-brand-text">Match</span>
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Curated micro-creator marketplace for South Delhi &amp; Gurugram founder-led brands.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('directory')}
                className="text-xs font-medium text-zinc-600 hover:text-zinc-950"
              >
                Creator Directory
              </button>
              <button
                type="button"
                onClick={() => onNavigate('creator-apply')}
                className="text-xs font-medium text-zinc-600 hover:text-zinc-950"
              >
                Apply as Creator
              </button>
              <button
                type="button"
                onClick={() => setShowRoadmap((prev) => !prev)}
                className="text-xs font-medium text-zinc-600 hover:text-zinc-950"
              >
                Post-Pilot Roadmap
              </button>
              <a
                href={whatsappFooterHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-emerald-600 px-3.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                <span>WhatsApp Us</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {showRoadmap && (
            <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-xs text-zinc-700">
              <p className="font-display text-sm font-bold text-zinc-900">
                Next-Step Improvements (To Build After Pilot Validation)
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>
                  <strong>Automated Vetting Pipeline:</strong> Instagram Graph API / Modash integration for instant bot
                  and audience-location scoring after manual rubrics prove predictive.
                </li>
                <li>
                  <strong>Live UPI Payment &amp; Escrow Automation:</strong> Razorpay Route / Cashfree split settlements
                  to auto-collect brand UPI payments and release 80% payouts on reel verification.
                </li>
                <li>
                  <strong>Verified Brand Ratings &amp; Reviews:</strong> Two-sided post-campaign reviews and on-time SLA
                  badges visible directly in the Creator Directory.
                </li>
              </ul>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
