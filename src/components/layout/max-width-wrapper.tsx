import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

interface MaxWidthWrapperProps {
  children: ReactNode
  className?: string
}

export function MaxWidthWrapper({ children, className }: MaxWidthWrapperProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  )
}
