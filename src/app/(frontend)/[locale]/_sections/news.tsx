'use client'
import React from 'react'
import { useNews } from '../_hooks/queries/news'
import { NewsCard, NewsCardSkeleton } from './news/news-card'

function News() {
  const { data: news, isPending: newsPending, isError: newsError } = useNews(12)
  return (
    <section id='news' className="max-w-screen-xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="font-bold text-2xl">Berita Terbaru</h1>
        <p className="text-sm text-muted-foreground">Kabar Terbaru dan Aktivitas Kampus terkini</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {newsPending
          ? Array.from({ length: 12 }).map((_, idx) => <NewsCardSkeleton key={idx} />)
          : newsError
            ? Array.from({ length: 12 }).map((_, idx) => <NewsCardSkeleton key={idx} />)
            : news.docs.map((data, idx) => <NewsCard {...data} key={idx} />)}
      </div>
    </section>
  )
}

export default News
