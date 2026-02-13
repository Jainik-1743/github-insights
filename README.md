# GitHub Insights Dashboard

A GitHub repository analytics dashboard built with Next.js (App Router),
TanStack Query, and shadcn/ui. It surfaces repo metrics, contributors, and a
paginated issues browser with optimistic issue close mutations.

## Quick Features

- Server-rendered repository overview (fast, SEO-friendly)
- Client-driven issues list with TanStack Query (pagination, filters, sorting)
- Issue detail view with optimistic close + rollback
- shadcn/ui components (Cards, Table, Buttons, Badges, Dialogs, Pagination)
- Skeletons to avoid layout shifts and clean empty states

## Architecture Overview

- Next.js App Router: server components for non-interactive pages (repository
  overview, issue page's server fetch), client components for interactive
  screens (issues list, issue detail mutation).
- TanStack Query: client cache for server state (issues, pagination). Query keys
  include pagination and filters to cache pages individually.
- shadcn/ui + Tailwind: low-level, composable UI primitives keeping bundle size
  small and consistent spacing.

## Folder Structure (high level)

- `src/app` — Next.js routes (App Router)
- `src/components` — UI components (shadcn wrappers, layout)
- `src/lib` — API helpers and server actions
- `src/providers` — React Query provider
- `src/types` — Type definitions

## Performance Considerations

- Keep server components for non-interactive data to minimize client JS.
- Query cache: `staleTime=60s`, `cacheTime=5min`, `refetchOnWindowFocus=false`.
- Pagination caching: each page uses a distinct query key (page + filters), so
  navigating back restores cached page instantly and avoids refetch flicker.
- Avoid importing entire icon or UI libraries — the app uses lucide-react and
  shadcn wrappers selectively.

## Setup

1. Install deps:

```bash
pnpm install
```

2. Create `.env` from `.env.example` and set `GITHUB_ACCESS_TOKEN` (optional but
   recommended to increase rate limits):

```bash
cp .env.example .env
# set GITHUB_ACCESS_TOKEN in .env
```

3. Run development server:

```bash
pnpm dev
```

4. Open `http://localhost:3000` and search for a repository like
   `vercel/next.js`.

## Notes

- The app handles GitHub rate limits with user-friendly errors; if you hit
  limits, supply a personal access token with minimal scopes (`public_repo`) to
  increase the quota.

---

_(See `DECISIONS.md` and `LIMITATIONS.md` for architecture rationale and known
constraints.)_
