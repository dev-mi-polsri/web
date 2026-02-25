'use client'
import { Input } from '@/components/ui/input'
import { getDokumen } from '@/server-actions/dokumen'
import { SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type { PaginatedResult } from '@/repository/_contracts'
import type { Dokumen } from '@/schemas/DokumenTable'
import DokumenList from '../dokumen/DokumenList'

export default function Dokumen() {
  const [page, setPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [data, setData] = useState<PaginatedResult<Dokumen> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations('pages.document')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchKeyword])

  useEffect(() => {
    setIsLoading(true)
    getDokumen({ searchKeyword: debouncedKeyword || undefined }, { page, size: 10 })
      .then(setData)
      .finally(() => setIsLoading(false))
  }, [page, debouncedKeyword])

  return (
    <div className="flex flex-col gap-8 items-center py-24 max-w-5xl mx-auto text-center">
      <div className="flex flex-col gap-2 px-4 w-full items-center">
        <div>
          <h1 className="font-bold text-2xl">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
        <div className="my-4 w-full md:w-[50%] lg:w-[40%]">
          <div className="*:not-first:mt-2">
            <div className="relative">
              <Input
                onChange={(e) => setSearchKeyword(e.target.value)}
                value={searchKeyword}
                className="peer pe-9 rounded-full"
                placeholder={t('searchBarText')}
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                <SearchIcon size={16} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DokumenList data={data} page={page} setPage={setPage} />
    </div>
  )
}
