import { githubFetch } from "@/lib/github"
import { GitHubIssue } from "@/types/github"
import IssueDetailClient from "../../../../../components/issue-detail"

interface PageProps {
  params: Promise<{
    owner: string
    repo: string
    issueNumber: string
  }>
}

export default async function IssuePage({ params }: PageProps) {
  const { owner, repo, issueNumber } = await params

  const issue = await githubFetch<GitHubIssue>(
    `/repos/${owner}/${repo}/issues/${issueNumber}`,
  )

  return (
    <IssueDetailClient
      owner={owner}
      repo={repo}
      issueNumber={Number(issueNumber)}
      initialIssue={issue}
    />
  )
}
