const BASE_URL = "https://api.github.com"

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>
}

export async function githubFetch<T>(
  endpoint: string,
  { params, ...options }: FetchOptions = {},
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  const res = await fetch(url.toString(), {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      Accept: "application/vnd.github+json",
      ...options.headers,
    },
    cache: options.cache || "no-store",
  })

  if (res.status === 403) {
    // Check if it is actually a rate limit
    const remaining = res.headers.get("x-ratelimit-remaining")

    if (remaining === "0") {
      throw new Error(
        "⚠️ GitHub Rate Limit Exceeded. Please try again in an hour.",
      )
    }

    // If we have requests left, it's a Permission/Auth error
    throw new Error(
      "⛔ Permission Denied: You do not have access to modify this repository.",
    )
  }

  // 4. Handle Rate Limit (429 is always rate limit)
  if (res.status === 429) {
    throw new Error(
      "⚠️ GitHub Rate Limit Exceeded. Please try again in an hour.",
    )
  }

  // 4. "Not Found"
  if (res.status === 404) {
    throw new Error("NOT_FOUND")
  }

  // 5. Generic Error Handling
  if (!res.ok) {
    throw new Error(`GitHub API Error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
