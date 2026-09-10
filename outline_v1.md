# Shram Setu — current working status

> Note: This file documents the initial prototype / early MVP state of the project. It is not the final target architecture. For the future roadmap aligned with the cooperative marketplace problem statement, see [outline_v2.md](outline_v2.md).

**Project:** Shram Setu  
**Team:** RADIANS  
**Status:** Functional MVP / working feature set implemented  
**Updated:** 2026-09-10

---

## 1. What is working now

This project is no longer in a pure mock-demo state. The app currently includes a full role-based workflow with a working UI flow and backend scaffolding for customer, Shramik, and admin journeys.

### Working features

- [x] Landing page with trust branding and service discovery entry points
- [x] Role-driven app flow: customer, Shramik, admin
- [x] Login gating and intent-based redirect flow
- [x] Search and browse worker listings
- [x] Worker profile view with service details and verification state
- [x] Booking flow with date/time selection and confirmation
- [x] Shramik verification flow with pending and approved states
- [x] Booking lifecycle tracking: Pending → Confirmed → In Progress → Completed → Paid
- [x] Review/rating flow after job completion
- [x] Admin approval dashboard for pending Shramiks
- [x] Admin booking and worker management screens
- [x] Shramik dashboard and earnings pages
- [x] Payment and completion flow logic in controller layer
- [x] Express API with health check and environment-based DB gating
- [x] Supabase-aware backend integration with local fallback/demo data
- [x] Electron desktop packaging setup

---

## 2. App architecture now in place

### Frontend
- React app with screen-based route handling
- Global app state in AppContext for users, roles, session, bookings, filters, and app actions
- Seed demo data for workers and bookings to keep the product usable even without a live backend
- Multi-language support structure with translations and localized content

### Backend
- Node.js + Express API server
- Route modules for:
  - shramiks
  - bookings
  - customer auth
  - auth
  - admin
- Database connectivity check and health endpoint
- Graceful fallback when database is not configured

### Data layer
- Supabase integration layer prepared and used where available
- Local storage/session management for demo/offline use
- Customer, booking, and Shramik records structured for persistence and retrieval

---

## 3. Working user journeys

### Customer journey
- Open landing page
- Search for services or view workers
- Open worker profile
- Select service/date/time slot
- Confirm booking
- Receive booking confirmation and tracking
- View bookings and payment flow

### Shramik journey
- Sign up as a Shramik
- Wait for admin approval / verification
- Access dashboard after approval
- View assigned jobs
- Start work and complete job flow
- See earnings, payment history, and grievance views

### Admin journey
- Review pending Shramik applications
- Approve or reject profiles
- Manage bookings and view worker records
- Control approval-related state and verification badge logic

---

## 4. Current status of core business logic

### Verified and implemented

- [x] Service matching logic between requested service and worker skill/service list
- [x] Booking validation for missing required fields
- [x] Manual worker selection before booking confirmation
- [x] Date/time slot conflict prevention
- [x] City/location and skill validation for worker selection
- [x] Customer persistence and booking record creation
- [x] Booking status updates through backend controllers
- [x] Payment state transitions and completion rules
- [x] Review submission tied to booking lifecycle

### Environment-dependent / not fully live yet

- [ ] Real production database is not yet configured in the environment
- [ ] Live Supabase credentials / schema must be finalized and connected for full production use
- [ ] API behavior is ready, but full end-to-end live validation still depends on configured environment values
- [ ] Some data flows are working through seeded/fallback data, not yet all from a fully live backend

---

## 5. Current technical state

### Stack in use
- React + Vite + JavaScript
- Express backend
- Supabase integration support
- Tailwind-styled UI
- Electron desktop package support

### Command setup available
- `npm run dev` — frontend
- `npm run server` — backend
- `npm run dev:full` — frontend + backend together
- `npm run build` — production frontend build
- `npm run desktop` — Electron app packaging flow

---

## 6. What has been achieved compared with the original idea

The original goal was a basic demo around one booking loop. The project has moved beyond that and now includes:

- a multi-role app shell
- end-to-end customer workflow
- worker verification system
- admin management screens
- backend API scaffolding for production-style use
- reusable state/data architecture

This is now closer to a real MVP than a throwaway internal demo.

---

## 7. Remaining work before full production readiness

- [ ] Finalize live DB schema and environment configuration
- [ ] Validate API behavior against real Supabase tables and edge cases
- [ ] Test all booking workflows end-to-end with persisted data
- [ ] Harden auth/session logic for production usage
- [ ] Validate admin actions and customer flows under real data conditions
- [ ] Add final QA, cleanup, and deployment configuration

---

## 8. Summary

Shram Setu is currently in a working MVP state with the core user journeys implemented and the app architecture largely complete. The business loop — search, select, verify, book, track, complete, pay, review — is now represented in the codebase and running as a functional system in demo/offline/live-ready form, with final production readiness depending on live environment setup and validation.
