import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <MaxWidthWrapper>
      <div className='space-y-8 py-10'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-12' />
          <span className='text-muted-foreground/40'>/</span>
          <Skeleton className='h-4 w-24' />
          <span className='text-muted-foreground/40'>/</span>
          <Skeleton className='h-4 w-24' />
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader className='space-y-2'>
              <div className='flex justify-between'>
                <Skeleton className='h-6 w-1/2' />
                <Skeleton className='h-6 w-24 rounded-full' />
              </div>
              <Skeleton className='h-4 w-3/4' />
            </CardHeader>
            <CardContent className='flex gap-6'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-16' />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-32' />
            </CardHeader>
            <CardContent className='flex gap-6'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='flex flex-col items-center gap-2'>
                  <Skeleton className='h-10 w-10 rounded-full' />
                  <Skeleton className='h-3 w-12' />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
