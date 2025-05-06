import React from 'react'
import News from '../_sections/news'
import FeaturedNews from '../_sections/featured-news'
import { getMessages } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const messages = await getMessages({ locale })
  const title = messages.layout.navbar.title

  return {
    title,
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
