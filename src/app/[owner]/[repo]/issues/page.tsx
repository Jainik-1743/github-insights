"use client"

import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper"
import { getIssues } from "@/lib/actions"
import { GitHubIssue } from "@/types/github"
import { useQuery } from "@tanstack/react-query"
import {
  AlertCircle,
  Calendar,
  CircleDot,
  GitPullRequest,
  MessageSquare,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { use, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function IssuesPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>
}) {
  const router = useRouter()
  const { owner, repo } = use(params)

  const [page, setPage] = useState(1)
  const [stateFilter, setStateFilter] = useState<"open" | "closed">("open")
  const [sort, setSort] = useState<"created" | "comments">("created")
  const [assignee, setAssignee] = useState<string | undefined>(undefined)

  const { data, isLoading, error } = useQuery<GitHubIssue[]>({
    queryKey: ["issues", owner, repo, page, stateFilter, sort, assignee],
    queryFn: () =>
      getIssues({
        owner,
        repo,
        page,
        state: stateFilter,
        sort,
        direction: "desc",
        assignee,
      }),
    placeholderData: (prev) => prev,
  })

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault()
    setPage((old) => Math.max(old - 1, 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    setPage((old) => old + 1)
  }

  const handleRowClick = (issueNumber: number) => {
    router.push(`/${owner}/${repo}/issues/${issueNumber}`)
  }

  return (
    <MaxWidthWrapper>
      <div className='space-y-8 py-12'>
        {/* Header */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Issues</h1>
            <p className='text-muted-foreground mt-1 text-sm'>
              Browsing{" "}
              <span className='text-foreground font-semibold'>
                {owner}/{repo}
              </span>
            </p>
          </div>

          <div className='flex flex-wrap gap-3'>
            <Select
              value={stateFilter}
              onValueChange={(value) => {
                setPage(1)
                setStateFilter(value as "open" | "closed")
              }}
            >
              <SelectTrigger className='bg-background w-[130px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='open'>Open</SelectItem>
                <SelectItem value='closed'>Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sort}
              onValueChange={(value) => {
                setPage(1)
                setSort(value as "created" | "comments")
              }}
            >
              <SelectTrigger className='bg-background w-[160px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='created'>Newest First</SelectItem>
                <SelectItem value='comments'>Most Commented</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={assignee ?? "all"}
              onValueChange={(value) => {
                setPage(1)
                setAssignee(value === "all" ? undefined : value)
              }}
            >
              <SelectTrigger className='bg-background w-[160px]'>
                <SelectValue placeholder='Assignee' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Issues</SelectItem>
                <SelectItem value='*'>Assigned to anyone</SelectItem>
                <SelectItem value='none'>Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className='flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600'>
            <AlertCircle className='h-4 w-4' />
            <span>Failed to load issues.</span>
          </div>
        )}

        <Card className='overflow-hidden border shadow-sm'>
          {isLoading ? (
            <div className='space-y-4 p-6'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          ) : (
            <>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader className='bg-muted/50'>
                    <TableRow>
                      <TableHead className='w-[80px]'>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className='w-[120px]'>Status</TableHead>
                      <TableHead className='w-[100px] text-right'>
                        Comments
                      </TableHead>
                      <TableHead className='w-[150px] text-right'>
                        Created
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data && data.length > 0 ? (
                      data.map((issue) => {
                        const isPR = !!issue.pull_request

                        return (
                          <TableRow
                            key={issue.id}
                            onClick={() => handleRowClick(issue.number)}
                            className={`hover:bg-muted/50 cursor-pointer transition-colors ${isPR ? "bg-blue-50/40 dark:bg-blue-950/10" : ""} `}
                          >
                            <TableCell className='text-muted-foreground font-mono text-xs'>
                              #{issue.number}
                            </TableCell>

                            <TableCell className='font-medium'>
                              <div className='flex items-start gap-3'>
                                <div className='mt-1 shrink-0'>
                                  {isPR ? (
                                    <GitPullRequest className='h-4 w-4 text-purple-500' />
                                  ) : (
                                    <CircleDot className='h-4 w-4 text-green-600' />
                                  )}
                                </div>

                                <div className='max-w-[300px] space-y-1.5 md:max-w-[500px]'>
                                  {/* 5. Title Truncation */}
                                  <span className='text-foreground block truncate font-semibold'>
                                    {issue.title}
                                  </span>

                                  <div className='flex flex-wrap gap-2'>
                                    {isPR && (
                                      <span className='inline-flex items-center rounded border border-purple-200 bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700'>
                                        Pull Request
                                      </span>
                                    )}
                                    {issue.labels.slice(0, 3).map((label) => (
                                      <span
                                        key={label.name}
                                        className='inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap'
                                        style={{
                                          backgroundColor: `#${label.color}15`,
                                          color: `#${label.color}`,
                                          borderColor: `#${label.color}40`,
                                        }}
                                      >
                                        {label.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge
                                variant={
                                  issue.state === "open"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  issue.state === "open"
                                    ? isPR
                                      ? "bg-purple-600"
                                      : "bg-green-600"
                                    : "bg-gray-500"
                                }
                              >
                                {issue.state}
                              </Badge>
                            </TableCell>

                            <TableCell className='text-right'>
                              <div className='text-muted-foreground flex items-center justify-end gap-1'>
                                <MessageSquare className='h-3 w-3' />
                                {issue.comments}
                              </div>
                            </TableCell>

                            <TableCell className='text-muted-foreground text-right text-sm whitespace-nowrap'>
                              <div className='flex items-center justify-end gap-1'>
                                <Calendar className='h-3 w-3' />
                                {new Date(
                                  issue.created_at,
                                ).toLocaleDateString()}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className='h-48 text-center'>
                          <div className='text-muted-foreground flex flex-col items-center justify-center'>
                            <CircleDot className='mb-2 h-8 w-8 opacity-20' />
                            <p>No issues found matching your filters.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className='bg-muted/20 flex items-center justify-end border-t p-4'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href='#'
                        onClick={handlePrev}
                        className={
                          page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    <PaginationItem>
                      <span className='block min-w-[3rem] px-4 text-center text-sm font-medium'>
                        Page {page}
                      </span>
                    </PaginationItem>

                    <PaginationItem>
                      <PaginationNext
                        href='#'
                        onClick={handleNext}
                        className={
                          !data || data.length < 10
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </Card>
      </div>
    </MaxWidthWrapper>
  )
}
