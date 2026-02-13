## API Layer Design

A centralized `githubFetch` utility was implemented in `lib/github.ts`.

### Goals:

- Avoid duplicating fetch logic
- Normalize error handling
- Inject authentication headers automatically
- Support query parameters via a typed interface
- Keep the API layer reusable across Server and Client Components

### Error Strategy:

Errors are normalized into:

- `NOT_FOUND`
- Rate limit error (403/429)
- Generic GitHub API errors

The utility does not depend on Next.js navigation APIs to maintain separation of
concerns.

### ESLint Enforcement for Server State

The TanStack Query ESLint plugin is integrated using flat config to:

- Enforce stable query keys
- Prevent anti-patterns in query usage
- Improve reliability of optimistic updates

### React Query Caching Strategy

- staleTime: 60 seconds  
  Prevents excessive API calls and protects GitHub rate limits.

- gcTime: 5 minutes  
  Keeps pagination and issue data cached temporarily to avoid refetching when
  navigating back.

- refetchOnWindowFocus: false  
  Prevents UI flicker and unnecessary background refetches when users switch
  tabs.

- retry: 1  
  Avoids repeated failed requests under rate limit scenarios.

## Layout Strategy

A reusable `MaxWidthWrapper` component was created to enforce consistent
horizontal layout.

## Routing Strategy (Static + Dynamic Routes)

### Static Route

- `/` → Repository search page

### Dynamic Route

- `/[owner]/[repo]` → Repository overview page

Reasoning:

- The application requires both `owner` and `repo` to render repository
  insights.
- Dynamic route segments better represent the domain structure (e.g.,
  `vercel/next.js`).
- Query parameters (`/?owner=x&repo=y`) were intentionally avoided because they
  do not satisfy the requirement of having a dynamically rendered route in the
  App Router.

This structure aligns with Next.js file-based routing principles and mirrors
GitHub’s URL structure.

---

## Server vs Client Component Boundary

### Server Component

- Repository Overview page (`/[owner]/[repo]`)

Reasoning:

- Repository details and contributors are static server data.
- No interactivity is required on this screen.
- Server rendering reduces client bundle size.
- Improves performance and avoids unnecessary client-side hydration.

### Client Component

- Repository Search form

Reasoning:

- Uses `useRouter` and `useTransition`.
- Requires client-side navigation.
- Handles local form state and validation.

This separation minimizes client JavaScript while preserving interactivity where
required.

## Form Handling Strategy

React Hook Form was intentionally not used for the repository search form.

Reason:

- The form contains only two inputs.
- Validation requirements are minimal.
- Avoiding additional dependencies keeps the client bundle smaller.
- Reduces unnecessary abstraction for simple state handling.

Basic controlled components were sufficient.

### Loading Strategy

A route-level `loading.tsx` file was implemented.

Decisions:

- Loading UI mirrors the final layout structure.
- Uses shadcn `Skeleton` components.
- Wrapped in `MaxWidthWrapper` to prevent layout shift.

This prevents:

- UI flicker
- Horizontal layout changes during loading
- Visual instability
