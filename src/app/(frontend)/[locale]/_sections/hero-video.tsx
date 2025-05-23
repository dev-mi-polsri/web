import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getMessages } from 'next-intl/server'
import VideoHero from '../_components/video-hero'
import AnnouncementBanner from './announcement/banner'

export async function Hero({ locale }: { locale: string }) {
  const {
    pages: {
      home: { hero: t },
    },
  } = await getMessages({ locale })

  return (
    <div className="relative min-h-screen pt-20 px-4 md:px-8">
      {/* Main Container with rounded corners and margin */}
      <div className="relative h-[calc(100vh-6rem)] rounded-lg overflow-hidden">
        {/* YouTube Video for large screens */}
        <div className="hidden lg:block absolute inset-0 w-full h-full">
          <VideoHero />
        </div>

        {/* Mobile fallback image */}
        <div className="lg:hidden">
          <Image
            src={'/Hero-1.jpeg'}
            alt={'Hero image'}
            width={1920}
            height={1080}
            className={`absolute inset-0 object-cover h-full w-full transition-opacity duration-1000 ease-in-out`}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

        {/* Content Container */}
        <div className="relative h-full flex items-end z-20">
          <div className="max-w-7xl px-4 sm:px-6 w-full">
            <div className="max-w-4xl pb-8">
              <div className="hidden md:flex mb-4">
                <AnnouncementBanner locale={locale} />
              </div>
              <h1 className="text-2xl md:text-5xl font-bold text-white mb-4">{t.heading}</h1>
              <p className="text-base text-white/90 mb-8">{t.description}</p>
              <Link href={`/${locale}/profile/${locale === 'en' ? 'about-us' : 'tentang-kami'}`}>
                <Button variant="default" size="lg" className="rounded-full">
                  {t.button} <ChevronRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
