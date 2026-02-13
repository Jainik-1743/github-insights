import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { githubFetch } from "@/lib/github"
import { GitHubRepo, GitHubUser } from "@/types/github"
import { AlertCircle, GitFork, Star } from "lucide-react"
import Link from "next/link"

async function fetchRepoData(owner: string, repo: string) {
  try {
    const [repoData, contributors] = await Promise.all([
      githubFetch<GitHubRepo>(`/repos/${owner}/${repo}`),
      githubFetch<GitHubUser[]>(`/repos/${owner}/${repo}/contributors`, {
        params: { per_page: 5 },
      }),
    ])

    return { repoData, contributors, error: null }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { repoData: null, contributors: null, error: err }
    }

    return {
      repoData: null,
      contributors: null,
      error: new Error("UNKNOWN_ERROR"),
    }
  }
}

export default async function RepoPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>
}) {
  const { owner, repo } = await params
  const { repoData, contributors, error } = await fetchRepoData(owner, repo)

  return (
    <MaxWidthWrapper>
      <div className='space-y-8 py-10'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {/* Owner is static text since we don't have an owner page */}
              <span className='text-muted-foreground'>{owner}</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{repo}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {error || !repoData ? (
          <Card className='border-red-500 bg-red-50'>
            <CardHeader>
              <CardTitle className='text-red-700'>
                {error?.message === "RATE_LIMIT"
                  ? "Rate Limit Exceeded"
                  : "Repository Not Found"}
              </CardTitle>
              <CardDescription className='text-red-600'>
                {error?.message === "RATE_LIMIT"
                  ? "GitHub API rate limit exceeded. Please try again later."
                  : `Could not find ${owner}/${repo}.`}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className='grid gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle>{repoData.full_name}</CardTitle>
                  <Link
                    href={repoData.html_url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Badge variant='outline'>View on GitHub</Badge>
                  </Link>
                </div>
                <CardDescription>{repoData.description}</CardDescription>
              </CardHeader>
              <CardContent className='flex gap-6'>
                <div className='flex items-center gap-2'>
                  <Star className='h-4 w-4 text-yellow-500' />
                  {repoData.stargazers_count.toLocaleString()}
                </div>
                <div className='flex items-center gap-2'>
                  <GitFork className='h-4 w-4 text-blue-500' />
                  {repoData.forks_count.toLocaleString()}
                </div>
                <div className='flex items-center gap-2'>
                  <AlertCircle className='h-4 w-4 text-red-500' />
                  {repoData.open_issues_count.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent className='flex gap-6'>
                {contributors?.map((user) => (
                  <Link
                    key={user.login}
                    href={user.html_url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <div className='flex flex-col items-center gap-2'>
                      <Avatar>
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {user.login.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-muted-foreground text-xs'>
                        {user.login}
                      </span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <div className='col-span-full flex justify-center'>
              <Link href={`/${owner}/${repo}/issues`}>
                <Badge className='cursor-pointer px-6 py-2'>
                  View All Issues
                </Badge>
              </Link>
            </div>
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  )
}
