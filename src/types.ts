export type BrandCategory = 'clothing' | 'skincare' | 'food' | 'other';
export type CreatorNiche = 'fashion' | 'skincare' | 'lifestyle' | 'food';
export type NcrArea = 'South Delhi' | 'Gurugram' | 'Other NCR';
export type BudgetRange = '₹10k–20k' | '₹20k–35k' | '₹35k–50k' | '₹50k+';
export type CampaignGoal = 'launch' | 'festive sale' | 'seasonal drop';
export type CreatorStatus = 'pending' | 'auditing' | 'approved' | 'rejected';
export type ShortlistRequestStatus = 'pending' | 'shortlist_sent' | 'booked';
export type BookingStatus = 'Briefed' | 'In progress' | 'Delivered' | 'Results shared';
export type PaymentStatus = 'pending' | 'received';
export type PayoutStatus = 'pending' | 'paid';

export type PageRoute =
  | 'landing'
  | 'directory'
  | 'shortlist-request'
  | 'brand-dashboard'
  | 'creator-apply'
  | 'creator-dashboard'
  | 'admin';

export interface Brand {
  id: string;
  name: string;
  instagram: string;
  founder: string;
  whatsapp: string;
  email?: string;
  category: BrandCategory;
  area: NcrArea;
  budget_range: BudgetRange;
  brand_age: string;
  current_discovery: string;
}

export interface Creator {
  id: string;
  name: string;
  instagram: string;
  followers: number;
  niche: CreatorNiche;
  area: NcrArea;
  audience_location_split: string;
  avg_reel_views: number;
  engagement_rate: number;
  past_collabs_count: number;
  status: CreatorStatus;
  vetting_follower_quality: number;
  vetting_engagement: number;
  vetting_audience_fit: number;
  vetting_notes: string;
  whatsapp: string;
  avatarUrl?: string;
  expected_price_note?: string;
  consent_agreed: boolean;
}

export interface Package {
  id: string;
  creator_id: string;
  name: string;
  deliverables: string;
  price: number;
}

export interface ShortlistRequest {
  id: string;
  brand_id: string;
  goal: CampaignGoal;
  timeline: string;
  status: ShortlistRequestStatus;
  created_at: string;
}

export interface Shortlist {
  id: string;
  request_id: string;
  creator_ids: string[];
  sent_at: string;
  whatsapp_message: string;
}

export interface Booking {
  id: string;
  brand_id: string;
  creator_id: string;
  package_id: string;
  price: number;
  platform_fee: number;
  creator_payout: number;
  status: BookingStatus;
  brief_text: string;
  deadline: string;
  upi_payment_status: PaymentStatus;
  creator_payout_status: PayoutStatus;
  deliverable_link?: string;
  delivered_on_time: boolean;
  created_at: string;
}

export interface ResultSummary {
  id: string;
  booking_id: string;
  reach: number;
  link_clicks: number;
  enquiries: number;
  discount_code_orders: number;
  satisfaction_score: number;
  would_rebook: boolean;
  referral_name?: string;
}

export interface AppState {
  brands: Brand[];
  creators: Creator[];
  packages: Package[];
  shortlistRequests: ShortlistRequest[];
  shortlists: Shortlist[];
  bookings: Booking[];
  resultSummaries: ResultSummary[];
  interviewsConducted: number;
  activeBrandId: string | null;
  activeCreatorId: string | null;
}
