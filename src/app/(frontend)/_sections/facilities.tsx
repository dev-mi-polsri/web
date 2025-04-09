'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { Facility, Media } from '@/payload-types'
import Image from 'next/image'
import React from 'react'
import { useFacilities } from '../_hooks/queries/facilities'

function Facilities() {
  const { data: facilities, isLoading: facilitiesPending, error: facilitiesError } = useFacilities()

  return (
    <section className="py-8 text-center">
      <h1 className="text-2xl font-bold pb-8">Fasilitas</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto mx-auto max-w-screen-lg px-4 pb-4">
        {facilitiesPending
          ? Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="relative w-full pb-[133.33%]" />
            ))
          : facilitiesError
            ? Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className="relative w-full pb-[133.33%]" />
              ))
            : !facilities
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="relative w-full pb-[133.33%]" />
                ))
              : facilities.docs.map((facility, idx) => <FacilityCard {...facility} key={idx} />)}
      </div>
    </section>
  )
}

function FacilityCard({ logo, name }: Facility) {
  return (
    <div>
      <div className="relative w-full pb-[133.33%]">
        {/* 4:3 aspect ratio (75% padding) */}
        <Image
          className="rounded-lg object-cover absolute inset-0 w-full h-full"
          fill
          alt={name}
          src={(logo as Media).url ?? '/placeholder.svg'}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 rounded-lg" />
        <div className="absolute bottom-4 left-4 text-white z-50">
          <p className="text-[1.25em] font-bold">{name}</p>
        </div>
      </div>
    </div>
  )
}

export default Facilities
