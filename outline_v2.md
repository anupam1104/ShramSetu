# Shram Setu — outline_v2
### Final MVP for Round 2 (48-Hour Offline Build)

**Team:** RADIANS · **PS ID:** SIH26089 · **Status:** Build Target if Selected Past R1

---

## 1. Goal

A stable, uninterrupted, real transaction loop a judge can watch end-to-end:

**Customer → Search → Verified Shramik → Book → Pay → Invoice → Rate**

Real integrations this time — not mocks. Reliability under live demo conditions matters as much as features.

## 2. Scope

### In scope (core levers)
- [ ] **Lever 1 — Discovery + Booking + Geo-Matching:** live Google Maps API, real distance/ETA ranking
- [ ] **Lever 2 — Shramik ID + Verification:** admin approval issues a real Shramik ID (`SHR-RAD-2026-000X`), badge tied to that action only
- [ ] **Lever 3 — Payments + Auto-Invoicing:** Razorpay test-mode checkout, invoice shows platform fee % + worker payout, prominently
- [ ] **Support — Minimal Admin Screen:** approve/reject Shramik, issue ID
- [ ] **Add-on — Ratings:** 1–5 stars + comment, post-completion only
- [ ] **Add-on — Emergency Booking:** boolean flag, reorders match priority
- [ ] **Add-on — Demand-Surge Banner:** static/seeded text, no real model
- [ ] Real OTP for signup/login

### Explicitly out of scope (roadmap only — say it, don't build it)
- ❌ Community vouching
- ❌ SID-linked insurance
- ❌ Grievance/dispute escalation flow
- ❌ Real AI demand forecasting / discovery ranking model
- ❌ Regional language NLP / voice interface
- ❌ Federation-level treasury, analytics, governance
- ❌ In-app real-time chat
- ❌ Shramik earnings/reputation dashboard

## 3. Screens (build in this order)

1. **Auth** — real OTP signup/login, role selection (customer/Shramik/admin)
2. **Shramik Onboarding** — trade, location, skill quiz + work sample upload
3. **Search & Discovery** — live geo-matching, verified badge, rating, ETA
4. **Booking** — slot selection, emergency toggle, confirm
5. **Track** — `Pending → Confirmed → In Progress → Completed`
6. **Admin** — approve/reject Shramik, issue Shramik ID
7. **Payment** — Razorpay test checkout
8. **Invoice** — total, platform fee %, worker payout, clearly visible
9. **Rate** — post-completion only, 1–5 stars + comment
10. **Surge Banner** — static seeded text on Shramik/admin view

## 4. Data Model

```
users            (id, name, phone, role, status)
cooperatives     (id, name, region)
shramiks         (id, user_id, cooperative_id, shramik_id, trade,
                   latitude, longitude, rating, verified, verification_status)
skill_verifications (id, shramik_id, quiz_score, work_sample_url, status)
bookings         (id, customer_id, shramik_id, service, scheduled_at,
                   status, is_emergency, distance_km, service_amount)
payments         (id, booking_id, amount, platform_fee, worker_payout,
                   payment_status, invoice_url)
ratings          (id, booking_id, stars, comment)
```

## 5. Tech Stack (kept deliberately lean)

| Layer | Choice |
|---|---|
| Frontend | React |
| Backend | Node.js + Express |
| Database | One simple DB — Postgres or MongoDB, whichever the team knows best. No ORM/migration layer unless someone's already fluent in it. |
| Geo | Google Maps API |
| Payments | Razorpay (test mode) |
| Auth | Real OTP provider |
| AI/Python | Not required — surge banner is static, not a model |

## 6. Business Rules (enforce server-side, not just in the UI)

- [ ] Verified badge only set via admin approval — never client-side
- [ ] Only completed bookings can be rated
- [ ] `worker_payout + platform_fee == service_amount`, always
- [ ] No double-booking a slot
- [ ] Shramik IDs are unique
- [ ] Platform fee disclosed before/at payment

## 7. Build Order (48 hours)

| Hours | Deliverable |
|---|---|
| 0–4 | Repo, stack, schema, seed data |
| 4–14 | Booking + search + geo-matching |
| 14–22 | Verification + admin approval |
| 22–30 | Razorpay + auto-invoicing |
| 30–34 | Full integration, one uninterrupted flow |
| 34–38 | Ratings, emergency booking, surge banner |
| 38–44 | UI polish, bug fixing |
| 44–48 | Testing, demo rehearsal, backup video recorded |

## 8. Acceptance Criteria

- [ ] Full flow (search → book → pay → invoice → rate) completes without a live failure
- [ ] Verified badge appears only after admin approval, never by default
- [ ] Invoice visibly shows fee % and worker payout — this is the proof of the pitch's core claim
- [ ] App demoable on a mobile hotspot, not dependent on venue wifi alone
- [ ] One screen-recorded backup run exists before presenting

## 9. Team Briefing Notes

- This build should feel closer to production than `outline_v1` — real integrations, real error handling on the core paths.
- Don't start Lever 2 or 3 until Lever 1 (search/booking) is solid — they depend on its data model.
- Reserve the last 4–6 hours for rehearsal, not new features. A polished 6-feature demo beats a buggy 9-feature one.
