import React from 'react'
import News from '../_sections/news'
import HotNews from '../_sections/hotnews'

const pages = () => {
  return (
    <div className='flex flex-col my-12'>
      <HotNews />
      <News />    
    </div>
  )
}

export default pages
