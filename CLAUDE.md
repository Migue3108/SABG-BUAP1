# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

SABG-BUAP: platform guiding Puebla municipalities through the 8-chapter "Buen Gobierno" practical guide (diagnosis, route, instrument, evidence, tracking). UI text, routes, and commit messages are in Spanish; code identifiers are English. Deployed on Vercel (`https://sabg-buap-1.vercel.app`) with Supabase Postgres.

## Commands

- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint` (ESLint 9 flat config, `eslint-config-next`)
- Typecheck: `npx tsc --noEmit`
- No test framework is configured. `scripts/test-admin-flow.ts` is a manual end-to-end check of user creation + email.
- Local DB: `docker compose up -d` (Postgres 15.3, `user`/`admin` on :5432, data in `./postgres`)
- Prisma: `npx prisma generate` (also runs on `postinstall`), `npx prisma migrate deploy`, `npx prisma migrate dev --name <name>`
- One-off scripts run with tsx: `npx tsx scripts/<file>.ts`
  - `create-user.ts "Name" email password role` — creates a user through Better Auth and sets role
  - `create-dev-user.ts` — seeds admin from `SMART_COP_*` env vars
  - `enable-rls.ts` — enables RLS on the auth tables (Supabase)

Env vars: see `.env.template` (`BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `DATABASE_URL` pooled + `DIRECT_URL` for migrations, optional `SMTP_*`/`EMAIL_FROM`, optional `NEXT_PUBLIC_DEMO_*`). Without SMTP vars, `lib/email.ts` logs emails to the console instead of sending.

## Architecture

**Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Better Auth (email+password) with Prisma adapter, Prisma 6 on PostgreSQL. Path alias `@/*` → repo root.

**Route groups** (`app/`):
- `(municipal)/` — all non-admin roles. URLs have no prefix: `/dashboard`, `/capitulo-1`..`/capitulo-8/*`, `/recursos`, `/seguimiento`, `/perfil`, `/preferencias`, `/ayuda`.
- `(admin)/admin/*` — admin only (users, municipalities, audit log, profile, preferences).
- `auth/*` — login, register, first-login (forced password change), two-factor.
- `/` and `/conocenos` — public pages.
- All route paths are centralized in `config/routes.ts`; use it instead of string literals. Sidebar nav lives in `config/navigation/*`.

**Auth and access control is layered:**
1. `proxy.ts` (Next 16 replacement for `middleware.ts`) only checks that a Better Auth session cookie exists on protected paths, redirects to `/` otherwise, and sets no-store headers. Its `matcher` must be updated when adding a protected top-level path; `next.config.ts` `headers()` repeats the same path list for cache headers.
2. Server layouts do the real check: `app/(municipal)/layout.tsx` and `app/(admin)/admin/layout.tsx` call `auth.api.getSession`, reload the user from Prisma, and redirect on `!active`, `mustChangePassword` (→ `/auth/first-login`), or wrong role (admins are bounced out of municipal, non-admins out of admin).
3. API routes repeat the session + role check themselves (see `app/api/admin/users/route.ts` pattern). `app/api/auth/destination` returns where a user should land after login.

Users are created by admins only (closed system): `app/api/admin/users` generates a temp password, sets `mustChangePassword`, and emails credentials via `lib/email.ts` (nodemailer). Roles: `UserRole` enum in Prisma, mirrored by `config/roles.ts`.

**Municipal progress state:** `contexts/municipal-progress-context.tsx` holds the workflow step (`not-started → diagnosis → route → instrument → evidence → tracking`) and unlocked chapter. Initial values come from `UserPreference` (loaded in the municipal layout), mirrored to per-user `localStorage` keys (`sabg-step-<uid>`), and persisted via `app/api/user/progress`. Pages/components gate on `isUnlocked` / `isChapterUnlocked`. Workflow/instrument/tracking definitions are in `config/*.ts`; several screens still use config mock data (`config/route.ts`, `config/instrument.ts`, `config/tracking.ts`) rather than DB data.

**UI composition:** pages under `app/` are thin; content lives in `components/municipal/chapter-N/*`, `components/municipal/<section>/*`, and `components/admin/*`. Both dashboards wrap the shared `components/dashboard/dashboard-shell.tsx` (header, sidebar, progress bars). Dark mode is class-based via `contexts/theme-context.tsx`, persisted to `localStorage`, the `sabg-theme` cookie, and `app/api/user/preferences`; theme changes are ignored on public and `/auth` pages.

**Database:** `prisma/schema.prisma` models the full domain (municipalities/microregions, chapters, annexes, evidence + versions + reviews, indicators, reports, audit log, chapter assessments, user preferences). The committed migrations only cover the auth tables plus role/active, so the schema is ahead of `prisma/migrations/`; check actual DB state before assuming `migrate deploy` produces the full schema. `lib/prisma.ts` is the singleton client.

Chapter PDFs/resources are static files under `public/resources/chapter-N/`.
