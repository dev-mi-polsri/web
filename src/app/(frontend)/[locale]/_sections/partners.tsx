'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { Media } from '@/payload-types'
import Image from 'next/image'
import Marquee from 'react-fast-marquee'
import { usePartners } from '../_hooks/queries/partners'
import { useTranslations } from 'next-intl'

export default function Partners() {
  const t = useTranslations('partners')
  const { data: partners, isLoading: partnersPending, error: partnersError } = usePartners(100)
  return (
    <div className="flex flex-col gap-8 my-8 items-center max-w-full lg:max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t('heading')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>
      {/* <div className="flex flex-row items-center justify-around w-full"> */}
      <Marquee>
        {partnersPending
          ? Array.from({ length: 12 }).map((_, idx) => (
              <Skeleton key={idx} className="h-16 w-16 mr-8" />
            ))
          : partnersError
            ? Array.from({ length: 12 }).map((_, idx) => (
                <Skeleton key={idx} className="h-16 w-16 mr-8" />
              ))
            : partners!.docs.map((item, idx) => (
                <Image
                  key={idx}
                  src={(item.logo as Media).url!}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="object-contain h-16 mr-8"
                />
              ))}
      </Marquee>
      {/* </div> */}
    </div>
  )
}
