import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

function PostLoading() {
  return (
    <div className="container max-w-7xl mx-auto my-20 grid grid-cols-1 p-4">
      <article className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex gap-1 items-center mb-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-12 w-3/4 rounded-md mb-4" />
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Skeleton className="w-full aspect-video rounded-lg mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          </div>
        </div>
        <div>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </article>
    </div>
  )
}

export default PostLoading
