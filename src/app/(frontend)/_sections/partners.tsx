'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { Partner, Media } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { PaginatedDocs } from 'payload'
import Marquee from 'react-fast-marquee'

const fetchPartners = () =>
  fetch('/api/partner')
    .then((res) => {
      if (!res.ok) throw new Error('Fetch Failed')
      return res.json()
    })
    .then((data) => data as PaginatedDocs<Partner>)

export default function Partners() {
  const {
    data: partners,
    isLoading: partnersPending,
    error: partnersError,
  } = useQuery({
    queryKey: ['partners'],
    queryFn: fetchPartners,
  })
  return (
    <div className="flex flex-col gap-8 my-8 items-center max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Kerja Sama</h1>
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
