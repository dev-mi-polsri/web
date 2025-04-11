import React from 'react'
import News from '../_sections/news'
import FeaturedNews from '../_sections/featurednews'

const pages = () => {
  return (
    <div className='flex flex-col my-12'>
      <FeaturedNews />
      <News />    
    </div>
  )
}

export default pages
