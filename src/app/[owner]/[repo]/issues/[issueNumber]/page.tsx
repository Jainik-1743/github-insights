import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
    <div className='space-y-4 py-6'>
      <MaxWidthWrapper>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href={`/${owner}/${repo}`}>
                {owner}/{repo}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href={`/${owner}/${repo}/issues`}>
                Issues
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>#{issueNumber}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </MaxWidthWrapper>
      <IssueDetailClient
        owner={owner}
        repo={repo}
        issueNumber={Number(issueNumber)}
        initialIssue={issue}
      />
    </div>
  )
}
