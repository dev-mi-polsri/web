import { Facility, Media } from '@/payload-types'
import Image from 'next/image'
import React from 'react'
import config from '@payload-config'
import { getPayload } from 'payload'
import { getMessages } from 'next-intl/server'

async function Facilities({ locale }: { locale: string }) {
  // const t = useTranslations('pages.home.facilities')
  // const { data: facilities, isLoading: facilitiesPending, error: facilitiesError } = useFacilities()
  const {
    pages: {
      home: { facilities: t },
    },
  } = await getMessages({ locale })

  const payload = await getPayload({ config })

  const facilities = await payload.find({
    collection: 'facility',
  })

  return (
    <section className="py-8 text-center">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t.heading}</h1>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto mx-auto max-w-screen-lg px-4 pb-4">
        {facilities?.docs.map(({ ...facility }, idx) => (
          <FacilityCard {...facility} locale={locale} key={idx} />
        ))}
      </div>
    </section>
  )
}

function FacilityCard({ logo, name, enName, locale }: Facility & { locale: string }) {
  return (
    <div>
      <div className="relative w-full pb-[133.33%]">
        {/* 4:3 aspect ratio (75% padding) */}
        <Image
          className="rounded-lg object-cover absolute inset-0 w-full h-full"
          fill
          alt={locale === 'en' ? enName : name}
          src={(logo as Media).url ?? '/placeholder.svg'}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 rounded-lg" />
        <div className="absolute text-start bottom-3 left-3 text-white z-40">
          <p className="text-[1.25em] font-bold">{locale === 'en' ? enName : name}</p>
        </div>
      </div>
    </div>
  )
}

export default Facilities
