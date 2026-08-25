import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type SkeletonProps = HTMLAttributes<HTMLDivElement>

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted/30', className)}
      {...props}
    />
  )
}
