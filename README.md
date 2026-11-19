# MicroMatch — Curated Micro-Creator Marketplace for Founder-Run Indian Brands

MicroMatch connects founder-run, Instagram-first Indian brands (spending ₹10,000–₹50,000/month in South Delhi and Gurugram) with manually vetted micro-creators (2,000–20,000 followers) for fixed-price collaborations with clear deliverables and measured outcomes.

---

## 1. Setup Steps

```bash
# Install dependencies
npm install

# Run local development server (port 3000)
npm run dev

# Type-check and build for production
npm run lint
npm run build
```

All sample data (8 creators, 3 brands, 2 delivered shortlists, and 2 completed bookings with result summaries) is pre-loaded into client state and persisted in `localStorage` (`micromatch_state_v1`). Use **Admin → Reset demo data** at any time to restore the initial seed state.

---

## 2. Data Model (`src/types.ts`)

- **Brand**: `id, name, instagram, founder, whatsapp, category, area, budget_range, brand_age, current_discovery`
- **Creator**: `id, name, instagram, followers, niche, area, audience_location_split, avg_reel_views, engagement_rate, past_collabs_count, status ('pending' | 'auditing' | 'approved' | 'rejected'), vetting_follower_quality, vetting_engagement, vetting_audience_fit, vetting_notes, whatsapp`
- **Package**: `id, creator_id, name, deliverables, price`
- **ShortlistRequest**: `id, brand_id, goal, timeline, status ('pending' | 'shortlist_sent' | 'booked'), created_at`
- **Shortlist**: `id, request_id, creator_ids[], sent_at, whatsapp_message`
- **Booking**: `id, brand_id, creator_id, package_id, price, platform_fee (20%), creator_payout (80%), status ('Briefed' | 'In progress' | 'Delivered' | 'Results shared'), brief_text, deadline, upi_payment_status, creator_payout_status, deliverable_link`
- **ResultSummary**: `id, booking_id, reach, link_clicks, enquiries, discount_code_orders, satisfaction_score, would_rebook, referral_name`

---

## 3. How to Demo the Full End-to-End Flow

1. **Brand Shortlist Request**:
   - Click **Get Free Shortlist** (or **I'm a brand**) on the landing page.
   - Submit details for a new brand (e.g., *Noor Linen Studio*, `@noorlinen.in`, South Delhi).
   - Confirm the 48-hour WhatsApp confirmation screen.

2. **Creator Application & Admin Vetting**:
   - Click **I'm a creator** (or navigate to **Creator Portal → Submit creator application**).
   - Submit an application and check its status (`Pending`).
   - Open **Admin → Applications**, click **Audit / Review** on the new creator (or seeded `@zoya.minimal`), score the 3 criteria out of 10, and click **Approve & List**. They immediately appear in the **Creators** directory.

3. **Admin Shortlist Builder**:
   - In **Admin → Shortlist Builder**, select the pending brand request (e.g., *Kesar & Crumb* or your newly submitted brand).
   - Pick **3 approved creators**, copy the auto-formatted WhatsApp shortlist message, and click **Save & Send Shortlist**.

4. **Brand Booking & UPI Checkout**:
   - Open **Brand Portal** and sign in with the brand (or use quick demo sign-in).
   - Under **My Shortlists**, click **Book collaboration** on one of the 3 matched creators.
   - Pick a fixed-price package (e.g., *Launch Pack — ₹6,000*), review the written brief and the 80% / 20% fee split (₹4,800 creator payout + ₹1,200 MicroMatch fee), view the UPI QR & ID, and click **Confirm Booking & I've Paid via UPI**.

5. **Creator Delivery & Admin Verification**:
   - Open **Admin → Bookings & UPI** and click **Mark UPI Received**.
   - Open **Creator Portal**, switch to the booked creator, click **Start shoot**, paste a live reel URL, and click **Mark as delivered**.
   - Return to **Admin → Bookings & UPI** and click **Mark Paid Out** once the 80% payout is settled.

6. **Results Entry & 30-Day Experiment Metrics**:
   - In **Admin → Results Entry**, select the delivered booking and enter reach, link clicks, enquiries, discount-code orders, and satisfaction score.
   - View the updated scorecard in **Brand Portal** (with **Rebook** and **Refer another brand** actions) and track progress against pilot targets in **Admin → 30-Day Experiment Metrics**.

---

## 4. Next-Step Improvements (After 30-Day Pilot Validation)

1. **Automated Audience Vetting**: Connect Instagram Graph API / creator analytics providers to pre-flag bot spikes and verify Delhi NCR audience geography before manual review.
2. **Automated UPI Split & Escrow**: Integrate Razorpay Route or Cashfree Marketplace Settlements to automatically verify brand UPI payments and release 80% creator payouts upon deliverable verification.
3. **Verified Ratings, Reviews & SLA Badges**: Add post-campaign two-sided reviews and automated on-time delivery badges directly on public Creator Directory cards.
