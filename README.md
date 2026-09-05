# React + Vite

## Backend setup

The API runs on port `4000` and persists Shramik registrations in Supabase.

1. Run the SQL in `server/db/schema.sql` in the Supabase SQL editor.
2. Run `server/db/admin-seed.sql` to create the demo admin account.
3. Keep `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`. The API accepts these existing names for local development.
4. Start both applications with `npm run dev:full`.

The API health check is available at `http://localhost:4000/health`. Worker data is exposed at `GET /api/shramiks` and registrations use `POST /api/shramiks`.

The demo admin login is phone `9000000000` with password `1234`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
