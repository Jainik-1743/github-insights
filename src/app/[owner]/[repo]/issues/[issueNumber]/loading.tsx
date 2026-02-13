import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className='space-y-4 py-6'>
      <MaxWidthWrapper>
        {/* 1. Breadcrumb Skeleton */}
        <div className='mb-6 flex items-center gap-2'>
          <Skeleton className='h-4 w-10' />
          <span className='text-muted-foreground/40'>/</span>
          <Skeleton className='h-4 w-24' />
          <span className='text-muted-foreground/40'>/</span>
          <Skeleton className='h-4 w-16' />
          <span className='text-muted-foreground/40'>/</span>
          <Skeleton className='h-4 w-8' />
        </div>

        {/* 2. Issue Card Skeleton */}
        <Card className='border-2 shadow-sm'>
          <CardHeader className='space-y-4'>
            <div className='flex items-start justify-between'>
              <div className='flex w-3/4 gap-3'>
                <Skeleton className='h-8 w-16' />
                <Skeleton className='h-8 w-full' />
              </div>
              <Skeleton className='h-6 w-20' />
            </div>

            <div className='flex gap-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-4 rounded-full' />
              <Skeleton className='h-4 w-24' />
            </div>
          </CardHeader>

          <CardContent className='space-y-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
          </CardContent>
        </Card>
      </MaxWidthWrapper>
    </div>
  )
}
