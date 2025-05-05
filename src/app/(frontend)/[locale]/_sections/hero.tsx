'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Hero() {
  const t = useTranslations('page.home.hero')
  
  const heroImages = useMemo(() => ['Hero-1.jpeg', 'Hero-2.jpeg'], [])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <div className="relative min-h-screen pt-20 px-4 md:px-8">
      {/* Main Container with rounded corners and margin */}
      <div className="relative h-[calc(100vh-6rem)] rounded-lg overflow-hidden">
        {/* YouTube Video for large screens */}

        {/* Image carousel for smaller screens */}
        {heroImages.map((image, index) => (
          <Image
            key={image}
            src={`/${image}`}
            alt={`Hero image ${index + 1}`}
            width={1920}
            height={1080}
            className={`absolute inset-0 object-cover h-full w-full transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            priority={index === 0}
          />
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

        {/* Content Container */}
        <div className="relative h-full flex items-end z-20">
          <div className="max-w-7xl px-4 sm:px-6 w-full">
            <div className="max-w-4xl pb-8">
              <h1 className="text-2xl md:text-6xl font-bold text-white mb-4">{t('heading')}</h1>
              <p className="text-base text-white/90 mb-8">{t('description')}</p>
              <Button
                variant="default"
                size="lg"
                className="rounded-full"
                onClick={() => {
                  window.scrollBy({
                    top: window.innerHeight,
                    behavior: 'smooth',
                  })
                }}
              >
                {t('button')} <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 lg:flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 hover:cursor-pointer ${
                index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="absolute right-2 bottom-2 md:right-4 md:bottom-4 text-muted-foreground text-sm z-40">
          {t('imageCredit')}
        </div>
      </div>
    </div>
  )
}
