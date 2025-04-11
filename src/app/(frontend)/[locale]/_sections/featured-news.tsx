'use client'
import React from 'react'
import { useNews } from '../_hooks/queries/news'
import { FeaturedNewsCard, FeaturedNewsCardSkeleton } from './news/featured-news-card'

function FeaturedNews() {
  const { data: news, isPending, isError } = useNews({ limit: 3, featured: true })
  const skeletons = Array.from({ length: 3 })

  return (
    <section id="featurednews" className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main News */}
        <div className="md:col-span-2 md:row-span-1 ">
          {isPending || isError ? (
            <FeaturedNewsCardSkeleton />
          ) : (
            <FeaturedNewsCard data={news.docs[0]} variant="main" />
          )}
        </div>

        {/* Side News */}
        <div className="flex flex-col gap-6 row-span-1">
          {isPending || isError
            ? skeletons.slice(0, 2).map((_, idx) => <FeaturedNewsCardSkeleton key={idx} />)
            : news.docs.slice(1, 3).map((data, idx) => <FeaturedNewsCard data={data} key={idx} />)}
        </div>
      </div>
    </section>
  )
}

export default FeaturedNews
