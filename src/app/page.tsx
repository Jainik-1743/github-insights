import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper"
import { RepoSearch } from "@/components/repo-search"

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className='space-y-8 py-16'>
        <RepoSearch />
      </div>
    </MaxWidthWrapper>
  )
}
