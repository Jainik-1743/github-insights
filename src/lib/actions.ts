"use server"

import { githubFetch } from "@/lib/github"
import { GitHubIssue } from "@/types/github"

interface FetchIssuesParams {
  owner: string
  repo: string
  page?: number
  state?: "open" | "closed" | "all"
  sort?: "created" | "comments"
  direction?: "asc" | "desc"
  assignee?: string
}

export async function getIssues({
  owner,
  repo,
  page = 1,
  state = "open",
  sort = "created",
  direction = "desc",
  assignee,
}: FetchIssuesParams): Promise<GitHubIssue[]> {
  const params: Record<string, string | number> = {
    page,
    per_page: 10,
    state,
    sort,
    direction,
  }

  if (assignee) {
    params.assignee = assignee
  }

  const issues = await githubFetch<GitHubIssue[]>(
    `/repos/${owner}/${repo}/issues`,
    { params },
  )

  return issues.filter((issue) => !issue.pull_request)
}
