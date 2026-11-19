import React, { createContext, useContext, useEffect, useState } from 'react';
import { SEED_STATE } from '../data/seed';
import type {
  AppState,
  Booking,
  BookingStatus,
  Brand,
  CampaignGoal,
  Creator,
  CreatorStatus,
  Package,
  ResultSummary,
  Shortlist,
  ShortlistRequest,
} from '../types';
import { calculateCommission, normalizeHandle } from '../utils/format';

const STORAGE_KEY = 'micromatch_state_v1';

interface SubmitShortlistInput {
  brandName: string;
  instagram: string;
  founder: string;
  whatsapp: string;
  category: Brand['category'];
  area: Brand['area'];
  brand_age: string;
  budget_range: Brand['budget_range'];
  current_discovery: string;
  goal: CampaignGoal;
  timeline: string;
}

interface SubmitCreatorInput {
  name: string;
  instagram: string;
  followers: number;
  niche: Creator['niche'];
  area: Creator['area'];
  audience_location_split: string;
  avg_reel_views: number;
  engagement_rate: number;
  past_collabs_count: number;
  expected_price_note: string;
  whatsapp: string;
  consent_agreed: boolean;
}

interface AppContextValue {
  state: AppState;
  setActiveBrandId: (id: string | null) => void;
  setActiveCreatorId: (id: string | null) => void;
  submitShortlistRequest: (input: SubmitShortlistInput) => { brand: Brand; request: ShortlistRequest };
  submitCreatorApplication: (input: SubmitCreatorInput) => Creator;
  updateCreatorAudit: (
    creatorId: string,
    payload: {
      status: CreatorStatus;
      vetting_follower_quality: number;
      vetting_engagement: number;
      vetting_audience_fit: number;
      vetting_notes: string;
    }
  ) => void;
  addCreatorPackage: (creatorId: string, name: string, deliverables: string, price: number) => void;
  createShortlist: (requestId: string, creatorIds: string[], whatsappMessage: string) => Shortlist;
  createBooking: (payload: {
    brand_id: string;
    creator_id: string;
    package_id: string;
    brief_text: string;
    deadline: string;
  }) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  toggleBookingUpiPayment: (bookingId: string) => void;
  toggleCreatorPayout: (bookingId: string) => void;
  markBookingDelivered: (bookingId: string, deliverableLink: string) => void;
  saveResultSummary: (payload: Omit<ResultSummary, 'id'>) => void;
  submitBrandReferral: (bookingId: string, referralName: string, satisfactionScore?: number) => void;
  setInterviewsConducted: (count: number) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_STATE;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || !Array.isArray(parsed.creators) || !Array.isArray(parsed.brands)) {
      return SEED_STATE;
    }
    return parsed;
  } catch {
    return SEED_STATE;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const setActiveBrandId = (id: string | null) => {
    setState((prev) => ({ ...prev, activeBrandId: id }));
  };

  const setActiveCreatorId = (id: string | null) => {
    setState((prev) => ({ ...prev, activeCreatorId: id }));
  };

  const submitShortlistRequest = (input: SubmitShortlistInput) => {
    const brandId = `brand-${Date.now()}`;
    const requestId = `req-${Date.now()}`;
    const brand: Brand = {
      id: brandId,
      name: input.brandName.trim(),
      instagram: normalizeHandle(input.instagram),
      founder: input.founder.trim(),
      whatsapp: input.whatsapp.trim(),
      category: input.category,
      area: input.area,
      budget_range: input.budget_range,
      brand_age: input.brand_age,
      current_discovery: input.current_discovery.trim(),
    };
    const request: ShortlistRequest = {
      id: requestId,
      brand_id: brandId,
      goal: input.goal,
      timeline: input.timeline.trim(),
      status: 'pending',
      created_at: new Date().toISOString().slice(0, 10),
    };

    setState((prev) => ({
      ...prev,
      brands: [brand, ...prev.brands],
      shortlistRequests: [request, ...prev.shortlistRequests],
      activeBrandId: brandId,
    }));

    return { brand, request };
  };

  const submitCreatorApplication = (input: SubmitCreatorInput) => {
    const creatorId = `creator-${Date.now()}`;
    const creator: Creator = {
      id: creatorId,
      name: input.name.trim(),
      instagram: normalizeHandle(input.instagram),
      followers: input.followers,
      niche: input.niche,
      area: input.area,
      audience_location_split: input.audience_location_split.trim(),
      avg_reel_views: input.avg_reel_views,
      engagement_rate: input.engagement_rate,
      past_collabs_count: input.past_collabs_count,
      status: 'pending',
      vetting_follower_quality: 0,
      vetting_engagement: 0,
      vetting_audience_fit: 0,
      vetting_notes: 'Application received. Scheduled for manual audience check.',
      whatsapp: input.whatsapp.trim(),
      expected_price_note: input.expected_price_note.trim(),
      consent_agreed: input.consent_agreed,
    };

    const starterPriceMatch = input.expected_price_note.match(/\d[\d,]*/);
    const parsedPrice = starterPriceMatch
      ? Math.max(2500, Math.min(20000, Number(starterPriceMatch[0].replace(/,/g, ''))))
      : 4000;

    const defaultPackages: Package[] = [
      {
        id: `pkg-${Date.now()}-a`,
        creator_id: creatorId,
        name: 'Starter',
        deliverables: '1 reel + 2 stories',
        price: parsedPrice,
      },
      {
        id: `pkg-${Date.now()}-b`,
        creator_id: creatorId,
        name: 'Launch Pack',
        deliverables: '2 reels + 3 stories',
        price: Math.round(parsedPrice * 1.5),
      },
    ];

    setState((prev) => ({
      ...prev,
      creators: [creator, ...prev.creators],
      packages: [...prev.packages, ...defaultPackages],
      activeCreatorId: creatorId,
    }));

    return creator;
  };

  const updateCreatorAudit = (
    creatorId: string,
    payload: {
      status: CreatorStatus;
      vetting_follower_quality: number;
      vetting_engagement: number;
      vetting_audience_fit: number;
      vetting_notes: string;
    }
  ) => {
    setState((prev) => {
      const hasPackages = prev.packages.some((p) => p.creator_id === creatorId);
      const nextPackages =
        payload.status === 'approved' && !hasPackages
          ? [
              ...prev.packages,
              {
                id: `pkg-${Date.now()}-1`,
                creator_id: creatorId,
                name: 'Starter',
                deliverables: '1 reel + 2 stories',
                price: 4000,
              },
              {
                id: `pkg-${Date.now()}-2`,
                creator_id: creatorId,
                name: 'Launch Pack',
                deliverables: '2 reels + 3 stories',
                price: 6000,
              },
            ]
          : prev.packages;

      return {
        ...prev,
        creators: prev.creators.map((c) =>
          c.id === creatorId
            ? {
                ...c,
                ...payload,
              }
            : c
        ),
        packages: nextPackages,
      };
    });
  };

  const addCreatorPackage = (creatorId: string, name: string, deliverables: string, price: number) => {
    const pkg: Package = {
      id: `pkg-${Date.now()}`,
      creator_id: creatorId,
      name: name.trim(),
      deliverables: deliverables.trim(),
      price,
    };
    setState((prev) => ({
      ...prev,
      packages: [...prev.packages, pkg],
    }));
  };

  const createShortlist = (requestId: string, creatorIds: string[], whatsappMessage: string) => {
    const existing = state.shortlists.find((s) => s.request_id === requestId);
    const shortlist: Shortlist = {
      id: existing ? existing.id : `sl-${Date.now()}`,
      request_id: requestId,
      creator_ids: creatorIds,
      sent_at: new Date().toISOString().slice(0, 10),
      whatsapp_message: whatsappMessage,
    };

    setState((prev) => ({
      ...prev,
      shortlists: existing
        ? prev.shortlists.map((s) => (s.request_id === requestId ? shortlist : s))
        : [shortlist, ...prev.shortlists],
      shortlistRequests: prev.shortlistRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'shortlist_sent' } : r
      ),
    }));

    return shortlist;
  };

  const createBooking = (payload: {
    brand_id: string;
    creator_id: string;
    package_id: string;
    brief_text: string;
    deadline: string;
  }) => {
    const pkg = state.packages.find((p) => p.id === payload.package_id);
    const price = pkg ? pkg.price : 4000;
    const { platformFee, creatorPayout } = calculateCommission(price);

    const booking: Booking = {
      id: `book-${Date.now()}`,
      brand_id: payload.brand_id,
      creator_id: payload.creator_id,
      package_id: payload.package_id,
      price,
      platform_fee: platformFee,
      creator_payout: creatorPayout,
      status: 'Briefed',
      brief_text: payload.brief_text.trim(),
      deadline: payload.deadline,
      upi_payment_status: 'pending',
      creator_payout_status: 'pending',
      delivered_on_time: true,
      created_at: new Date().toISOString().slice(0, 10),
    };

    setState((prev) => ({
      ...prev,
      bookings: [booking, ...prev.bookings],
      shortlistRequests: prev.shortlistRequests.map((r) =>
        r.brand_id === payload.brand_id && r.status === 'shortlist_sent'
          ? { ...r, status: 'booked' }
          : r
      ),
    }));

    return booking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) => (b.id === bookingId ? { ...b, status } : b)),
    }));
  };

  const toggleBookingUpiPayment = (bookingId: string) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) =>
        b.id === bookingId
          ? { ...b, upi_payment_status: b.upi_payment_status === 'received' ? 'pending' : 'received' }
          : b
      ),
    }));
  };

  const toggleCreatorPayout = (bookingId: string) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) =>
        b.id === bookingId
          ? { ...b, creator_payout_status: b.creator_payout_status === 'paid' ? 'pending' : 'paid' }
          : b
      ),
    }));
  };

  const markBookingDelivered = (bookingId: string, deliverableLink: string) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Delivered',
              deliverable_link: deliverableLink.trim(),
            }
          : b
      ),
    }));
  };

  const saveResultSummary = (payload: Omit<ResultSummary, 'id'>) => {
    setState((prev) => {
      const existing = prev.resultSummaries.find((r) => r.booking_id === payload.booking_id);
      const nextSummaries = existing
        ? prev.resultSummaries.map((r) =>
            r.booking_id === payload.booking_id ? { ...existing, ...payload } : r
          )
        : [{ id: `res-${Date.now()}`, ...payload }, ...prev.resultSummaries];

      return {
        ...prev,
        resultSummaries: nextSummaries,
        bookings: prev.bookings.map((b) =>
          b.id === payload.booking_id ? { ...b, status: 'Results shared' } : b
        ),
      };
    });
  };

  const submitBrandReferral = (bookingId: string, referralName: string, satisfactionScore?: number) => {
    setState((prev) => ({
      ...prev,
      resultSummaries: prev.resultSummaries.map((r) =>
        r.booking_id === bookingId
          ? {
              ...r,
              referral_name: referralName.trim(),
              satisfaction_score: satisfactionScore ?? r.satisfaction_score,
            }
          : r
      ),
    }));
  };

  const setInterviewsConducted = (count: number) => {
    setState((prev) => ({ ...prev, interviewsConducted: Math.max(0, count) }));
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(SEED_STATE);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setActiveBrandId,
        setActiveCreatorId,
        submitShortlistRequest,
        submitCreatorApplication,
        updateCreatorAudit,
        addCreatorPackage,
        createShortlist,
        createBooking,
        updateBookingStatus,
        toggleBookingUpiPayment,
        toggleCreatorPayout,
        markBookingDelivered,
        saveResultSummary,
        submitBrandReferral,
        setInterviewsConducted,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
