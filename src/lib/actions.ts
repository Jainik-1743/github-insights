"use server"

import { githubFetch } from "@/lib/github"
import { GitHubIssue } from "@/types/github"
import { revalidatePath } from "next/cache"

interface FetchIssuesParams {
  owner: string
  repo: string
  page?: number
  state?: "open" | "closed" | "all"
  sort?: "created" | "comments"
  direction?: "asc" | "desc"
  assignee?: string
}

interface CloseIssueParams {
  owner: string
  repo: string
  issueNumber: number
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
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

  try {
    const issues = await githubFetch<GitHubIssue[]>(
      `/repos/${owner}/${repo}/issues`,
      { params },
    )

    if (!Array.isArray(issues)) {
      return []
    }

    return issues
  } catch (error) {
    console.error("Failed to fetch issues:", getErrorMessage(error))
    return []
  }
}

export async function closeIssue({
  owner,
  repo,
  issueNumber,
}: CloseIssueParams) {
  try {
    await githubFetch(`/repos/${owner}/${repo}/issues/${issueNumber}`, {
      method: "PATCH",
      body: JSON.stringify({ state: "closed" }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    revalidatePath(`/${owner}/${repo}/issues/${issueNumber}`)
    return { success: true }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(errorMessage)
  }
}
