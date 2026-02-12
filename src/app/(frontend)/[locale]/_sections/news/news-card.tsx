'use client'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import { PostSummary } from '@/schemas/PostTable'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export function NewsCard({ title, thumbnail, slug, createdAt }: PostSummary) {
  const { locale } = useParams<{ locale: string }>()
  return (
    <Link href={`/${locale}/news/${slug}`} className="flex flex-col gap-2 text-start">
      <div className="w-full max-w-full overflow-hidden rounded-lg">
        <AspectRatio ratio={16 / 9}>
          <Image
            fill
            src={thumbnail ?? '/placeholder.svg'}
            alt={'Thumbnail ' + title}
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
        <h2 className="font-bold text-lg leading-6 group-hover:text-primary group-hover:cursor-pointer transition-all ease-in-out line-clamp-2">
          {title}
        </h2>
      </div>
    </Link>
  )
}

export function NewsCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 text-start">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="flex flex-col gap-1">
        <Skeleton className="w-[40%] h-8" />
        <Skeleton className="w-full h-10" />
      </div>
    </div>
  )
}
