"use client"

import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper"
import { getIssues } from "@/lib/actions"
import { GitHubIssue } from "@/types/github"
import { useQuery } from "@tanstack/react-query"
import { use, useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export default function IssuesPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>
}) {
  const { owner, repo } = use(params)

  const [page, setPage] = useState(1)
  const [stateFilter, setStateFilter] = useState<"open" | "closed">("open")
  const [sort, setSort] = useState<"created" | "comments">("created")
  const [assignee, setAssignee] = useState<string | undefined>(undefined)

  const { data, isLoading, isFetching, error } = useQuery<GitHubIssue[]>({
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

  return (
    <MaxWidthWrapper>
      <div className='space-y-8 py-12'>
        {/* Header */}
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Issues — {owner}/{repo}
          </h1>

          <div className='flex flex-wrap gap-3'>
            {/* Status */}
            <Select
              value={stateFilter}
              onValueChange={(value) => {
                setPage(1)
                setStateFilter(value as "open" | "closed")
              }}
            >
              <SelectTrigger className='w-[140px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='open'>Open</SelectItem>
                <SelectItem value='closed'>Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={sort}
              onValueChange={(value) => {
                setPage(1)
                setSort(value as "created" | "comments")
              }}
            >
              <SelectTrigger className='w-[160px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='created'>Sort by Created</SelectItem>
                <SelectItem value='comments'>Sort by Comments</SelectItem>
              </SelectContent>
            </Select>

            {/* Assignee */}
            <Select
              value={assignee ?? "none"}
              onValueChange={(value) => {
                setPage(1)
                setAssignee(value === "none" ? undefined : value)
              }}
            >
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Assignee' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>All</SelectItem>
                <SelectItem value='*'>Assigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className='rounded-md border border-red-200 bg-red-50 p-4 text-red-600'>
            Failed to load issues.
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className='space-y-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full' />
            ))}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className='overflow-x-auto rounded-lg border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className='font-mono text-xs'>
                          #{issue.number}
                        </TableCell>
                        <TableCell className='max-w-[350px] truncate font-medium'>
                          {issue.title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              issue.state === "open" ? "default" : "secondary"
                            }
                          >
                            {issue.state}
                          </Badge>
                        </TableCell>
                        <TableCell>{issue.comments}</TableCell>
                        <TableCell className='text-muted-foreground text-sm'>
                          {new Date(issue.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className='h-24 text-center'>
                        No issues found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className='flex items-center justify-end gap-3'>
              <Button
                variant='outline'
                size='sm'
                disabled={page === 1 || isFetching}
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
              >
                Previous
              </Button>

              <span className='text-sm font-medium'>Page {page}</span>

              <Button
                variant='outline'
                size='sm'
                disabled={isFetching || !data || data.length < 10}
                onClick={() => setPage((old) => old + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </MaxWidthWrapper>
  )
}
