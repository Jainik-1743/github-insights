import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <MaxWidthWrapper>
      <div className='py-12'>
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

            <div className='flex gap-2'>
              <Skeleton className='h-5 w-16 rounded-full' />
              <Skeleton className='h-5 w-20 rounded-full' />
              <Skeleton className='h-5 w-14 rounded-full' />
            </div>
          </CardHeader>

          <CardContent className='space-y-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-5/6' />
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  )
}
