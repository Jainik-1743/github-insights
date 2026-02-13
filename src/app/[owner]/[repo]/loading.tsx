import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper"

export default function Loading() {
  return (
    <MaxWidthWrapper>
      <div className='space-y-8 py-16'>
        <div className='grid gap-6 md:grid-cols-2'>
          <div className='bg-muted h-[200px] animate-pulse rounded-xl' />
          <div className='bg-muted h-[200px] animate-pulse rounded-xl' />
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
