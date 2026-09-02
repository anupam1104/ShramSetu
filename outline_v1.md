# Shram Setu — outline_v1
### Basic Demo for SIH Internal R1

**Team:** RADIANS · **PS ID:** SIH26089 · **Status:** Build Target for R1

---

## 1. Goal

Prove the core loop is real, not just a slide: a customer can search, see a verified Shramik, and book — live, in front of judges. Nothing else matters for this round.

## 2. Scope

**One trade. One ward. One flow. No shortcuts on that flow, no extra features around it.**

### In scope
- [ ] Seed data (1 cooperative, 5–6 electricians, 3–4 households)
- [ ] Search Shramiks by trade, sorted by distance
- [ ] Verified badge visible on profile
- [ ] Book from 2–3 hardcoded slots
- [ ] Status tracking: `Pending → Confirmed → Completed`
- [ ] Mocked "Pay Now" → static invoice screen (fee breakdown shown, no live gateway)
- [ ] Basic admin screen: approve a Shramik → badge turns on

### Explicitly out of scope for R1
- ❌ Real OTP / real auth
- ❌ Live Razorpay integration
- ❌ Ratings
- ❌ Emergency booking flag
- ❌ Demand-surge banner
- ❌ Multiple trades / multiple wards
- ❌ Vouching, insurance, grievance, AI forecasting, NLP

**Why mocked payments/OTP:** removes network + third-party dependency risk from an early, possibly low-prep-time internal round. The badge and the booking loop are what prove the idea — the payment gateway doesn't need to be real yet to prove the concept.

## 3. Screens (build in this order)

1. **Login/Signup** — mock login is fine (pick a demo user from a dropdown if time is short)
2. **Search** — list of nearby Shramiks: name, trade, distance, rating, **verified badge**
3. **Profile + Book** — Shramik details, 2–3 slots, confirm button
4. **Track** — status line, updatable by a button click (simulates the Shramik marking work done)
5. **Pay (mocked)** — static invoice: total, platform fee %, worker payout
6. **Admin (1 screen)** — list of pending Shramiks, one "Approve & Issue ID" button

## 4. Data (seed file, not a real DB if time is tight)

```json
{
  "cooperative": { "id": "coop_1", "name": "Radians Cooperative" },
  "shramiks": [
    { "id": "shr_1", "name": "...", "trade": "electrician", "lat": 0, "lng": 0, "rating": 4.7, "verified": true }
  ],
  "customers": [ { "id": "cust_1", "name": "..." } ]
}
```

## 5. Minimal Tech

- React (frontend only is enough if the backend is just a JSON file or in-memory store)
- Node.js/Express only if you need real persistence between page loads — otherwise skip it for R1
- No Maps API call required yet — hardcode distances in the seed data if needed

## 6. Acceptance Criteria

- [ ] A judge can search, see a verified badge, book a slot, watch status change, and see a mock invoice — with zero code visible, zero crashes
- [ ] The verified badge only shows on Shramiks the "admin" screen has approved
- [ ] Nothing on screen requires internet to keep working

## 7. Team Briefing Notes

- This is a **throwaway-safe** build — if the 48-hour round has a different stack decision, none of this needs to survive intact. Optimize for "works today," not "extensible."
- Whoever owns Search + Booking should start first — everything else depends on that loop existing.
