'use client'
import React, { useState } from 'react'
import { useDosenTendik } from '../_hooks/queries/dosen-tendik'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { Dosentendik, Media } from '@/payload-types'

const DosenCard = ({ dosen }: { dosen: Dosentendik }) => {
  return (
    <div className="bg-card rounded-lg border overflow-hidden flex flex-col h-full">
      {dosen.image && typeof dosen.image === 'object' && (
        <div className="relative w-full">
          <Image
            src={(dosen.image as Media).url || ''}
            alt={dosen.name}
            width={800}
            height={800}
            className="object-cover aspect-square w-full"
          />
        </div>
      )}
      <div className="p-4 flex flex-col justify-between h-full">
        <div className="text-center">
          <h2 className="font-bold">{dosen.name}</h2>
          {dosen.nip && <p className="text-muted-foreground text-sm">NIP: {dosen.nip}</p>}
        </div>
      </div>
    </div>
  )
}

function DosenList() {
  const [page, setPage] = useState(1)
  const { data: dosen, isPending, error } = useDosenTendik({ page, limit: 24 })

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isPending
          ? Array.from({ length: 12 }).map((_, idx) => (
              <Skeleton key={idx} className="w-full h-[400px]" />
            ))
          : error
            ? Array.from({ length: 12 }).map((_, idx) => (
                <Skeleton key={idx} className="w-full h-[400px] bg-destructive/20 animate-none" />
              ))
            : dosen.docs.map((data, idx) => <DosenCard key={idx} dosen={data} />)}
      </div>
      <div className="flex items-center gap-2">
        {dosen && (
          <>
            {page > 1 && (
              <Button variant="secondary" size="icon" onClick={() => setPage((page) => page - 1)}>
                <ChevronLeft />
              </Button>
            )}
            {Array.from({ length: dosen?.totalPages }).map((_, idx) => (
              <Button
                disabled={page === idx + 1}
                key={idx}
                variant="secondary"
                size="icon"
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </Button>
            ))}
            {page !== dosen?.totalPages && (
              <Button variant="secondary" size="icon" onClick={() => setPage((page) => page + 1)}>
                <ChevronRight />
              </Button>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default DosenList
