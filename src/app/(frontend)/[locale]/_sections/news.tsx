'use client'
import React, { useState } from 'react'
import { useNews } from '../_hooks/queries/news'
import { NewsCard, NewsCardSkeleton } from './news/news-card'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function News({ pagination = false }: { pagination?: boolean }) {
  const [page, setPage] = useState(1)

  const t = useTranslations('news')

  const {
    data: news,
    isPending: newsPending,
    isError: newsError,
  } = useNews({
    limit: 12,
    page,
  })
  return (
    <section id="news" className="max-w-screen-xl mx-auto px-8 py-10 w-full text-center">
      <div className="mb-8">
        <h1 className="font-bold text-2xl">{t('heading')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 w-full">
        {newsPending
          ? Array.from({ length: 12 }).map((_, idx) => <NewsCardSkeleton key={idx} />)
          : newsError
            ? Array.from({ length: 12 }).map((_, idx) => <NewsCardSkeleton key={idx} />)
            : news.docs.map((data, idx) => <NewsCard {...data} key={idx} />)}
      </div>
      {pagination && news && (
        <div className="flex w-full justify-center items-center gap-2">
          {news.hasPrevPage && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                setPage((page) => page++)
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
                setPage((page) => page--)
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
