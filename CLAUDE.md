# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint      # ESLint over the whole project
```

There is no test runner configured in this project (no test script, no test files).

## Architecture

LaporAman ("JalanAman") is a Jakarta-focused civic incident-reporting SPA: React 19 + Vite, React Router 7, Tailwind CSS v4, Firebase (Auth + Firestore), and MapLibre GL via `react-map-gl`.

### Entry point and routing

There is no `App.jsx` — routes are declared directly in [src/main.jsx](src/main.jsx), wrapped in a single `AuthProvider`:
`/` (LandingPage), `/login`, `/register`, `/settings`, `/dashboard`.

There is no route-guard/`ProtectedRoute` wrapper. Pages that need auth state read `useAuth()` themselves and redirect manually (e.g. LoginPage redirects away if already logged in via `location.state?.from`). Keep this pattern when adding new protected pages rather than introducing a wrapper component.

### Auth (Firebase)

The context is deliberately split into three files so that only components are exported from component files (satisfies the `react-refresh/only-export-components` lint rule):
- [src/contexts/authContextObject.js](src/contexts/authContextObject.js) — bare `createContext(null)`
- [src/contexts/AuthContext.jsx](src/contexts/AuthContext.jsx) — `AuthProvider`, wraps Firebase `onAuthStateChanged`/email-password/Google-popup/sign-out calls
- [src/contexts/useAuth.js](src/contexts/useAuth.js) — the `useAuth()` hook, throws if used outside the provider

Firebase project config lives in [src/services/firebaseConfig.js](src/services/firebaseConfig.js) (client-side Firebase config, not a secret — safe to be visible). Auth error codes are translated to user-facing copy in [src/utils/firebaseErrors.js](src/utils/firebaseErrors.js) — add new `auth/*` codes there rather than inlining error strings in pages.

### Reports/markers data flow

[src/services/markerService.js](src/services/markerService.js) is the only Firestore access point, backed by a single `reports` collection: `saveMarker`, `fetchAllMarkers`, `createNewMarker`. There's no per-report document fetch — the whole collection is pulled and filtered/derived client-side.

Three components independently fetch/render markers and each keep their own copy of a `mapColorToTheme()` helper that normalizes a marker's stored `color` into one of three theme colors (`#FF2525` red / `#FF8125` orange / `#23B58A` green, representing danger level):
- [src/components/MapRestricted.jsx](src/components/MapRestricted.jsx) — read-only preview map on the landing page; prompts login (`onShowLogin`) or navigates to `/dashboard` map tab depending on auth state
- [src/components/MapInteractive.jsx](src/components/MapInteractive.jsx) — the full editable map used inside the dashboard's "peta" tab; has an edit-mode toggle that lets a logged-in user click the map to drop a draft marker (via [SideBarMaps.jsx](src/components/SideBarMaps.jsx)) and persist it with `saveMarker`
- [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx) — "beranda" tab shows a non-interactive mini map plus a report feed/detail-modal built from mock data (`INITIAL_REPORTS`, marked with a `// TODO` to replace with real data) merged with live Firestore markers; `getCategoryOfReport()` classifies a report into one of five Indonesian category buckets by keyword-matching its title/description

If you change the marker color convention or category keywords, update all three copies (or extract a shared helper — none exists today).

Dashboard tab state (`beranda` vs `peta`) is passed via `useLocation().state.activeTab` or a `?tab=` query param, not via separate routes — `MapRestricted` and `NavBar` navigate to `/dashboard` with `{ state: { activeTab: 'peta' } }` rather than a dedicated `/dashboard/peta` route.

Maps use OpenFreeMap tiles (`https://tiles.openfreemap.org/styles/bright`) — no API key required.

### Styling

Tailwind v4 is configured CSS-first — there is no `tailwind.config.js`. Theme tokens (`--color-main`, `--color-text2`, `--color-text3`, `--color-stroke`, `--color-background`, spacing/text-size scale) and custom utility classes (`.card`, `.form`, `.button-300`/`.button-500`, `.button-sidebar[-selected]`, `.add-report-btn`/`.see-map-btn`) are defined in [src/styles/globals.css](src/styles/globals.css) under `@theme` / `@layer utilities`. Prefer reusing these tokens/utilities over introducing new ad-hoc color values.

UI copy is a mix of Indonesian and English (Indonesian for report/category/status content, English for structural chrome) — match whichever the surrounding component already uses rather than translating wholesale.
