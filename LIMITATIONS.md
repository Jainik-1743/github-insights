# Known Limitations

## 1. Pagination Constraints

The GitHub API uses "Link Headers" for pagination, which makes it difficult to
calculate the "Total Pages" count upfront without making additional requests.

- **Current Behavior:** The pagination implementation uses a "Load More"
  strategy. The "Next" button is disabled only when the current page returns
  fewer than 10 items, assuming we have reached the end of the list.
- **Tradeoff:** We cannot show "Page 1 of 50" to the user.
- **Future Improvement:** Implement a recursive function to parse the `Link`
  header in `actions.ts` to determine the exact last page number.

## 2. Assignee Filtering

The current Assignee filter supports "All", "Assigned", and "Unassigned".

- **Limitation:** It does not allow filtering by a _specific_ user (e.g.,
  "Assignee: Vercel").
- **Reason:** This would require an additional API call to fetch all repository
  members (`/repos/{owner}/{repo}/assignees`) to populate the dropdown. This was
  deemed out of scope for the current timeline.

## 3. Pull Request Filtering

The GitHub Issues API returns both Issues and Pull Requests.

- **Current Decision:** We explicitly decided **not** to filter out Pull
  Requests to prevent "empty pages" (where a page of 10 items might contain 10
  PRs and 0 Issues).
- **Solution:** We display Pull Requests in the list but visually distinguish
  them with a specific icon and label to provide a complete view of repository
  activity.

## 4. Rate Limiting (Public IP)

Since this application uses a Personal Access Token on the server, it shares the
5,000 request/hour limit across all users of the deployed instance.

- **Risk:** If deployed to Vercel/Netlify without user-specific OAuth, a high
  traffic spike could exhaust the API limit for everyone.
- **Future Improvement:** Implement "Sign in with GitHub" (OAuth) to use the
  authenticated user's own token and rate limit quota.

## 5. Search & SEO

The dashboard exists behind a dynamic route `/[owner]/[repo]`.

- **Limitation:** Search engines will not discover these pages unless they are
  linked from elsewhere.
- **Future Improvement:** For a production app, generating a `sitemap.xml` or
  using `generateStaticParams` for popular repositories would improve SEO
  discovery.
