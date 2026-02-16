'use client'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Image from 'next/image'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import Autoplay from 'embla-carousel-autoplay'
import { useParams } from 'next/navigation'
import { PostSummary } from '@/schemas/PostTable'
import { Link } from '@/i18n/navigation'

export default function AnnouncementThumbnailCarousel({ items }: { items: PostSummary[] }) {
  const { locale } = useParams<{ locale: string }>()
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent>
        {items.map((announcement, idx) => (
          <CarouselItem key={idx}>
            <Link href={`/news/${announcement.slug}`}>
              <AspectRatio ratio={16 / 9}>
                <div className="w-full h-full aspect-video rounded-lg relative overflow-hidden hover:cursor-pointer group">
                  <Image
                    src={announcement.thumbnail ?? '/Hero-1.jpeg'}
                    alt={announcement.title}
                    className="group-hover:scale-110 group-hover:brightness-50 transition-all ease-in-out"
                    fill
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 rounded-lg" />

                  <div className="absolute z-20 bottom-4 left-4 text-white text-start">
                    <h2 className={`font-bold text-xl leading-tight flex-3`}>
                      {announcement.title.length > 20
                        ? announcement.title.slice(0, 80) +
                          (announcement.title.length > 20 ? '...' : '')
                        : announcement.title}
                    </h2>
                    <span className="text-sm flex-1">
                      {new Intl.DateTimeFormat('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(new Date(announcement.createdAt))}
                    </span>
                  </div>
                </div>
              </AspectRatio>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
