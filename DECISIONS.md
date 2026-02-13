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

## Issues Page Architecture

The Issues page is implemented as a **Client Component**.

### Reasoning

The page requires:

- Pagination
- Filtering (open / closed)
- Assignee filtering
- Sorting (created / comments)
- Optimistic UI updates for mutation

These features require local UI state and React Query, which are client-side
concerns.

Therefore, the Issues page was intentionally implemented as a Client Component.

---

## Server Action Integration for Secure Data Fetching

Instead of calling the GitHub API directly from the browser, a Server Action
(`getIssues`) is used.

### Why Not Direct Client Fetch?

- GitHub API requires a private token.
- Environment variables are not accessible in client components.
- Exposing tokens via `NEXT_PUBLIC_` would be a security risk.

### Why Not Create Custom API Routes?

- The assignment requires using the GitHub REST API.
- Server Actions provide a built-in server boundary without introducing
  additional REST endpoints.
- Keeps architecture minimal and aligned with Next.js App Router principles.

### Final Data Flow

Client (React Query)  
→ Server Action  
→ `githubFetch`  
→ GitHub API

This ensures:

- Secure token handling
- No credential exposure
- No 401 unauthorized errors
- Clean separation of concerns

## Mutation Strategy (Closing Issues)

A Server Action (`closeIssue`) was implemented to handle the closing of issues.

### Optimistic UI Updates

To meet the requirement of "No UI flicker," **TanStack Query's `onMutate`**
lifecycle is used.

**Workflow:**

1.  **Immediate:** User clicks "Close Issue". The UI state (`issue.state`) is
    manually updated to `"closed"`, and the badge color changes.
2.  **Background:** The network request is sent to the GitHub API.
3.  **Rollback:** If the request fails (e.g., Permission Denied), the `onError`
    callback fires, reverting the UI to "Open" and triggering a toast
    notification.

This ensures the application feels instant while maintaining data integrity.

### Prevention of Duplicate Submissions

The "Close Issue" button is disabled (`disabled={mutation.isPending}`) while a
request is in-flight to prevent race conditions and API abuse.
