import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/i18n/navigation'
import { PostSummary } from '@/schemas/PostTable'
import Image from 'next/image'

interface FeaturedNewsCardProps {
  data: PostSummary
  variant?: 'main' | 'side'
}

export function FeaturedNewsCard({
  data: { title, createdAt, thumbnail, slug, tags },
  variant = 'side',
}: FeaturedNewsCardProps) {
  return (
    <Link href={`/news/${slug}`}>
      <div className="w-full h-full aspect-video rounded-lg relative overflow-hidden group">
        <Image
          fill
          src={thumbnail ?? '/placeholder.svg'}
          alt={title}
          className="group-hover:scale-110 group-hover:brightness-50 transition-all ease-in-out object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent z-10 rounded-lg" />

        <div className="absolute z-20 bottom-4 left-4 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {tags &&
              tags?.length > 0 &&
              tags.map((tag, idx) => <Badge key={idx}>{tag.name}</Badge>)}
          </div>
          <h2
            className={`font-bold ${variant === 'main' ? 'text-lg lg:text-2xl' : 'lg:text-lg'} leading-tight flex-3`}
          >
            {/* {name.length > 25 ? name.slice(0, 80) + (name.length > 25 ? '...' : '') : name} */}
            {title.length > 25 ? title.slice(0, 100) + '...' : title}
          </h2>
          <span className="text-sm text-right flex-1">
            {new Intl.DateTimeFormat('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format(new Date(createdAt))}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function FeaturedNewsCardSkeleton() {
  return <Skeleton className="w-full h-full aspect-video rounded-lg relative overflow-hidden" />
}
