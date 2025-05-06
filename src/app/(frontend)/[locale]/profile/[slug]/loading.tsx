import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

function PostLoading() {
  return (
    <div className="container max-w-7xl mx-auto mt-20 grid grid-cols-1 p-4">
      <article className="">
        <div className="mb-4">
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <Skeleton className="h-12 w-1/2 rounded-md mb-4" />
        <div className="flex justify-between mb-4">
          <div className="flex gap-1 items-center">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
        <Skeleton className="w-full aspect-video rounded-lg mb-6" />
        <div className="prose w-full">
          <Skeleton className="h-4 w-full rounded-md mb-2" />
          <Skeleton className="h-4 w-full rounded-md mb-2" />
          <Skeleton className="h-4 w-full rounded-md mb-2" />
          <Skeleton className="h-4 w-full rounded-md mb-2" />
          <Skeleton className="h-4 w-full rounded-md mb-2" />
        </div>
      </article>
    </div>
  )
}

export default PostLoading
