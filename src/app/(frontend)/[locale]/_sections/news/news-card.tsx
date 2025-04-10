import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import { Media, News } from '@/payload-types'
import Image from 'next/image'
import React from 'react'

export function NewsCard({ name, thumbnail, createdAt }: News) {
  return (
    <div className="flex flex-col gap-2 text-start">
      <div className="w-full max-w-full overflow-hidden rounded-lg">
        <AspectRatio ratio={16 / 9}>
          <Image
            fill
            src={(thumbnail as Media).url ?? '/placeholder.svg'}
            alt={'Thumbnail ' + name}
            className="rounded-lg object-cover hover:brightness-50 hover:scale-110 hover:cursor-pointer transition-all ease-in-out"
          />
        </AspectRatio>
      </div>
      <div className="group">
        <span className="text-muted-foreground text-sm">
          {Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(new Date(createdAt))}
        </span>
        <h2 className="font-bold text-lg leading-6 group-hover:text-primary group-hover:cursor-pointer transition-all ease-in-out">
          {name}
        </h2>
      </div>
    </div>
  )
}

export function NewsCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 text-start">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="flex flex-col gap-1">
        <Skeleton className="w-[40%] h-10" />
        <Skeleton className="w-[100%] h-12" />
      </div>
    </div>
  )
}
