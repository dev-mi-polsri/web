'use client'
import React from 'react'
import YouTube from 'react-youtube'

function VideoHero() {
  return (
    <YouTube
      videoId="3OHfNAcMIUg"
      opts={{
        width: '100%',
        height: '100%',
        playerVars: {
          controls: 0,
          autoplay: 1,
          mute: 1,
          loop: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          playlist: '3OHfNAcMIUg', // Required for looping
        },
      }}
      className="w-full h-full rounded-lg"
    />
  )
}

export default VideoHero
