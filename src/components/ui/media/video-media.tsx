'use client'

import { cn, getClientSideURL } from '@/lib/utils'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from './types'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    const { filename } = resource

    return (
      <video
        className={cn('rounded-lg', videoClassName)}
        controls={true}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={`${getClientSideURL()}/api/media/file/${filename}`} />
      </video>
    )
  }

  return null
}
