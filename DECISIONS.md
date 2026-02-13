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
