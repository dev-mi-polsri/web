import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import { Media, News } from '@/payload-types'
import Image from 'next/image'

interface HotNewsCardProps {
  data: News
  variant?: 'main' | 'side'
}

export function HotNewsCard({ data, variant = 'side' }: HotNewsCardProps) {
  const { name, createdAt, thumbnail } = data

  return (
    <div className="flex flex-col gap-2 text-start w-full">
      <div className="w-full max-w-full overflow-hidden rounded-lg">
        <AspectRatio ratio={16 / 9}>
          <Image
            fill
            src={(thumbnail as Media)?.url ?? '/placeholder.svg'}
            alt={name}
            className="rounded-lg object-cover hover:brightness-50 hover:scale-105 transition-all duration-300 ease-in-out"
          />
        </AspectRatio>
      </div>
      <div className="flex flex-col lg:flex-row gap-2">
        <h2 className={`font-bold ${variant === 'main' ? 'text-2xl' : 'text-lg'} leading-tight flex-3`}>
          {name}
        </h2>
        <span className="text-sm text-muted-foreground text-right flex-1">
          {new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(new Date(createdAt))}
        </span>
      </div>
    </div>
  )
}

export function HotNewsCardSkeleton({ variant = 'side' }: { variant?: 'main' | 'side' }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <Skeleton className={`h-4 ${variant === 'main' ? 'w-[60%]' : 'w-[40%]'}`} />
      <Skeleton className={`h-6 ${variant === 'main' ? 'w-full' : 'w-[80%]'}`} />
    </div>
  )
}
