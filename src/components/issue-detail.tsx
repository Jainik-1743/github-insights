"use client"

import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { closeIssue } from "@/lib/actions"
import { GitHubIssue } from "@/types/github"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

interface Props {
  owner: string
  repo: string
  issueNumber: number
  initialIssue: GitHubIssue
}

export default function IssueDetail({
  owner,
  repo,
  issueNumber,
  initialIssue,
}: Props) {
  const [issue, setIssue] = useState(initialIssue)

  const mutation = useMutation({
    mutationFn: () => closeIssue({ owner, repo, issueNumber }),

    onMutate: async () => {
      const previousIssue = issue
      setIssue((prev) => ({ ...prev, state: "closed" }))
      return { previousIssue }
    },

    onError: (error, variables, context) => {
      if (context?.previousIssue) {
        setIssue(context.previousIssue)
      }

      toast.error("Failed to close issue", {
        description: error.message || "You don't have permission to do this.",
      })
    },

    onSuccess: () => {
      toast.success("Issue closed successfully")
    },
  })

  return (
    <MaxWidthWrapper>
      <div className='py-6'>
        <Card className='border-2 shadow-sm'>
          <CardHeader className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <span className='text-muted-foreground font-mono text-xl'>
                  #{issue.number}
                </span>
                <CardTitle className='text-xl'>{issue.title}</CardTitle>
              </div>

              <Badge
                variant={issue.state === "open" ? "default" : "secondary"}
                className={
                  issue.state === "closed"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-green-600 hover:bg-green-700"
                }
              >
                {issue.state === "open" ? "Open" : "Closed"}
              </Badge>
            </div>

            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <span className='text-foreground font-semibold'>
                {issue.user.login}
              </span>
              <span>opened this issue</span>
              <span>•</span>
              <span>{issue.comments} comments</span>
            </div>

            <div className='flex flex-wrap gap-2'>
              {issue.labels.map((label) => (
                <Badge
                  key={label.name}
                  variant='outline'
                  style={{
                    backgroundColor: `#${label.color}20`,
                    color: `#${label.color}`,
                    borderColor: `#${label.color}40`,
                  }}
                >
                  {label.name}
                </Badge>
              ))}
            </div>
          </CardHeader>

          <CardContent className='space-y-6'>
            <div className='text-sm leading-relaxed whitespace-pre-wrap'>
              {issue.body || (
                <span className='text-muted-foreground italic'>
                  No description provided.
                </span>
              )}
            </div>

            {issue.state === "open" && (
              <div className='flex justify-end border-t pt-4'>
                <Button
                  variant='destructive'
                  onClick={() => mutation.mutate()}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Closing..." : "Close Issue"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  )
}
