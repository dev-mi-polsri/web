'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { TenagaAjar } from '@/schemas/TenagaAjarTable'
import { PaginatedResult } from '@/repository/_contracts'

const DosenCard = ({ dosen }: { dosen: TenagaAjar }) => {
  return (
    <div className="bg-card rounded-lg border overflow-hidden flex flex-col h-full">
      {dosen.foto && (
        <div className="relative w-full">
          <Image
            src={dosen.foto || ''}
            alt={dosen.nama}
            width={800}
            height={800}
            className="object-cover aspect-square w-full"
          />
        </div>
      )}
      <div className="p-4 flex flex-col justify-between h-full">
        <div className="text-center">
          <h2 className="font-bold">{dosen.nama}</h2>
          <p className="text-muted-foreground text-sm">NIP: {dosen.nip ?? '-'}</p>
          <p className="text-muted-foreground text-sm">NUPTK: {dosen.nuptk ?? '-'}</p>
          <p className="text-muted-foreground text-sm">NIDN: {dosen.nidn ?? '-'}</p>
        </div>
      </div>
    </div>
  )
}

function DosenList({ dosen }: { dosen: PaginatedResult<TenagaAjar> }) {
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 12

  const getCurrentPageData = () => {
    if (!dosen?.results) return []
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    return dosen.results
      .sort((a, b) => {
        const parameterA = Number(a.nip.split('').splice(8, 4).join(''))
        const parameterB = Number(b.nip.split('').splice(8, 4).join(''))
        return parameterA - parameterB
      })
      .slice(startIndex, startIndex + ITEMS_PER_PAGE)
    // .map(({ nip, ...data }) => ({ nip: parseInt(nip), ...data }))
  }

  const totalPages = dosen?.results ? Math.ceil(dosen.results.length / ITEMS_PER_PAGE) : 0

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {getCurrentPageData().map((data, idx) => (
          <DosenCard key={idx} dosen={data} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        {dosen && totalPages > 0 && (
          <>
            {page > 1 && (
              <Button variant="secondary" size="icon" onClick={() => setPage((page) => page - 1)}>
                <ChevronLeft />
              </Button>
            )}
            {Array.from({ length: totalPages }).map((_, idx) => (
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
            {page !== totalPages && (
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
