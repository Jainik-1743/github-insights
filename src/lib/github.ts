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

  // 3. "Rate Limit"
  if (res.status === 403 || res.status === 429) {
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
