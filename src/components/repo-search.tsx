"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Label } from "./ui/label"

export function RepoSearch() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [owner, setOwner] = useState("vercel")
  const [repo, setRepo] = useState("next.js")
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmedOwner = owner.trim()
    const trimmedRepo = repo.trim()

    if (!trimmedOwner || !trimmedRepo) {
      setError("Both owner and repository name are required.")
      return
    }

    setError(null)

    startTransition(() => {
      router.push(`/${trimmedOwner}/${trimmedRepo}`)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Repository Insights</CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4 md:flex-row md:items-end'
        >
          <div className='flex flex-1 flex-col gap-2'>
            <Label htmlFor='owner'>Repository Owner</Label>
            <Input
              id='owner'
              placeholder='e.g. vercel'
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>

          <div className='flex flex-1 flex-col gap-2'>
            <Label htmlFor='repo'>Repository Name</Label>
            <Input
              id='repo'
              placeholder='e.g. next.js'
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
            />
          </div>

          <Button type='submit'>
            {isPending ? "Loading..." : "Analyze Repository"}
          </Button>
        </form>

        {error && <p className='text-sm text-red-500'>{error}</p>}
      </CardContent>
    </Card>
  )
}
