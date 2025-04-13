import React from 'react'
import News from '../_sections/news'
import FeaturedNews from '../_sections/featured-news'

function Page() {
  return (
    <div className="my-12">
      <FeaturedNews />
      <News pagination searchBar />
    </div>
  )
}

export default Page
