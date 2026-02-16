'use client'
import React, { useRef, useState } from 'react'
import { useNews } from '../_hooks/queries/news'
import { NewsCard, NewsCardSkeleton } from './news/news-card'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

function News({
  pagination = false,
  searchBar = false,
}: {
  pagination?: boolean
  searchBar?: boolean
}) {
  const [page, setPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const controllerRef = useRef<AbortController | null>(null)

  const t = useTranslations('pages.home.news')

  const {
    data: news,
    isPending: newsPending,
    isError: newsError,
  } = useNews({
    searchKeyword,
    limit: 12,
    page,
    controllerRef,
  })

  return (
    <section
      id="news"
      className="max-w-7xl mx-auto px-8 py-10 w-full text-center flex flex-col items-center"
    >
      <div>
        <h1 className="font-bold text-2xl">{t('heading')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <div className="my-4 w-full md:w-[50%] lg:w-[40%]">
        {searchBar && (
          <div className="*:not-first:mt-2">
            <div className="relative">
              <Input
                onChange={(e) => setSearchKeyword(e.target.value)}
                value={searchKeyword}
                className="peer pe-9 rounded-full"
                placeholder={t('searchBar')}
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                <SearchIcon size={16} aria-hidden="true" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 w-full">
        {newsPending
          ? Array.from({ length: 12 }).map((_, idx) => <NewsCardSkeleton key={idx} />)
          : newsError
            ? Array.from({ length: 12 }).map((_, idx) => <NewsCardSkeleton key={idx} />)
            : news.results.map((data, idx) => <NewsCard {...data} key={idx} />)}
      </div>
      {pagination && news && (
        <div className="flex w-full justify-center items-center gap-2">
          {news.hasPrevPage && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                setPage((page) => page - 1)
              }}
            >
              <ChevronLeft />
            </Button>
          )}
          {news.totalPages &&
            Array.from({ length: news.totalPages }).map((_, idx) => (
              <Button
                disabled={page === idx + 1}
                key={idx}
                size="icon"
                variant="outline"
                onClick={() => {
                  setPage(idx + 1)
                }}
              >
                {idx + 1}
              </Button>
            ))}
          {news.hasNextPage && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                setPage((page) => page + 1)
              }}
            >
              <ChevronRight />
            </Button>
          )}
        </div>
      )}
    </section>
  )
}

export default News
