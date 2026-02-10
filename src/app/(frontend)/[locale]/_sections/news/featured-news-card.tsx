import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Media, News } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface FeaturedNewsCardProps {
  data: News
  variant?: 'main' | 'side'
}

export function FeaturedNewsCard({
  data: { name, createdAt, thumbnail, tags, slug },
  variant = 'side',
}: FeaturedNewsCardProps) {
  const { locale } = useParams<{ locale: string }>()
  // return (
  //   <div className="flex flex-col gap-2 text-start w-full">
  //     <div className="w-full max-w-full overflow-hidden rounded-lg">
  //       <AspectRatio ratio={16 / 9}>
  //         <Image
  //           fill
  //           src={(thumbnail as Media.ts)?.url ?? '/placeholder.svg'}
  //           alt={name}
  //           className="rounded-lg object-cover hover:brightness-50 hover:scale-105 transition-all duration-300 ease-in-out"
  //         />
  //       </AspectRatio>
  //     </div>
  //     <div className="flex flex-col lg:flex-row gap-2">
  //       <h2
  //         className={`font-bold ${variant === 'main' ? 'text-2xl' : 'text-lg'} leading-tight flex-3`}
  //       >
  //         {name}
  //       </h2>
  //       <span className="text-sm text-muted-foreground text-right flex-1">
  //         {new Intl.DateTimeFormat('id-ID', {
  //           day: 'numeric',
  //           month: 'long',
  //           year: 'numeric',
  //         }).format(new Date(createdAt))}
  //       </span>
  //     </div>
  //   </div>
  // )
  return (
    <Link href={`/${locale}/news/${slug}`}>
      <div className="w-full h-full aspect-video rounded-lg relative overflow-hidden group">
        <Image
          fill
          src={(thumbnail as Media).url ?? '/placeholder.svg'}
          alt={name}
          className="group-hover:scale-110 group-hover:brightness-50 transition-all ease-in-out object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 rounded-lg" />

        <div className="absolute z-20 bottom-4 left-4 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {tags && tags?.length > 0 && tags.map((tag, idx) => <Badge key={idx}>{tag.tag}</Badge>)}
          </div>
          <h2
            className={`font-bold ${variant === 'main' ? 'text-lg lg:text-2xl' : 'lg:text-lg'} leading-tight flex-3`}
          >
            {/* {name.length > 25 ? name.slice(0, 80) + (name.length > 25 ? '...' : '') : name} */}
            {name.length > 25 ? name.slice(0, 100) + '...' : name}
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
