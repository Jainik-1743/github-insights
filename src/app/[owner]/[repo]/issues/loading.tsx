import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <MaxWidthWrapper>
      <div className='space-y-8 py-12'>
        {/* Breadcrumb */}
        <Skeleton className='h-4 w-[280px]' />

        {/* Header */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-[200px]' />
            <Skeleton className='h-4 w-[280px]' />
          </div>

          <div className='flex flex-wrap gap-3'>
            <Skeleton className='h-10 w-[130px]' />
            <Skeleton className='h-10 w-[160px]' />
            <Skeleton className='h-10 w-[160px]' />
          </div>
        </div>

        {/* Table Card */}
        <Card className='overflow-hidden border shadow-sm'>
          <div className='space-y-4 p-6'>
            {/* Table Header */}
            <Skeleton className='h-6 w-full' />

            {/* Rows */}
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-14 w-full' />
            ))}
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-end gap-4 border-t p-4'>
            <Skeleton className='h-9 w-[90px]' />
            <Skeleton className='h-6 w-[60px]' />
            <Skeleton className='h-9 w-[90px]' />
          </div>
        </Card>
      </div>
    </MaxWidthWrapper>
  )
}
