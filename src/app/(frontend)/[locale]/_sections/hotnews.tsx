'use client'

import React from 'react'
import { useNews } from '../_hooks/queries/news'
import { HotNewsCard, HotNewsCardSkeleton } from './news/hot-news-card'

function HotNews() {
  const { data: news, isPending, isError } = useNews(3)
  const skeletons = Array.from({ length: 3 })

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main News */}
        <div className="lg:col-span-2 lg:row-span-1 ">
          {isPending || isError ? (
            <HotNewsCardSkeleton variant="main" />
          ) : (
            <HotNewsCard data={news.docs[0]} variant="main" />
          )}
        </div>

        {/* Side News */}
        <div className="flex flex-col gap-6 row-span-1">
          {isPending || isError
            ? skeletons
                .slice(0, 2)
                .map((_, idx) => <HotNewsCardSkeleton variant="side" key={idx} />)
            : news.docs
                .slice(1, 3)
                .map((data, idx) => <HotNewsCard data={data} variant="side" key={idx} />)}
        </div>
      </div>
    </section>
  )
}

export default HotNews
