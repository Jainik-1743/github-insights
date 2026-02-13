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
