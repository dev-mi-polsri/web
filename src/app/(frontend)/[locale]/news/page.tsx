import React from 'react'
import News from '../_sections/news'
import FeaturedNews from '../_sections/featured-news'
import { getMessages } from 'next-intl/server'
import { connection } from 'next/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  await connection()
  const { locale } = await params

  const messages = await getMessages({ locale })
  const title = messages.pages.news.title
  const description = messages.pages.news.description

  return {
    title,
    description,
  }
}

function Page() {
  return (
    <div className="my-12">
      <FeaturedNews />
      <News pagination searchBar />
    </div>
  )
}

export default Page
