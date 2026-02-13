import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <MaxWidthWrapper>
      <div className='space-y-6 py-10'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-8 w-[250px]' />
          <Skeleton className='h-10 w-[150px]' />
        </div>

        <div className='space-y-3'>
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
        </div>

        <div className='mt-6 flex items-center justify-between'>
          <Skeleton className='h-10 w-[100px]' />
          <Skeleton className='h-6 w-[80px]' />
          <Skeleton className='h-10 w-[100px]' />
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
