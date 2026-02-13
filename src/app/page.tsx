import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper"

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className='min-h-screen py-16'>
        <h1 className='text-3xl font-semibold tracking-tight'>
          GitHub Repository Insights Dashboard
        </h1>

        <p className='text-muted-foreground mt-4'>
          Enter a repository owner and name to explore repository insights.
        </p>
      </div>
    </MaxWidthWrapper>
  )
}
