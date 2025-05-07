'use client'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import YouTube from 'react-youtube'

export function VideoProfile() {
  const [toggled, setToggled] = useState<boolean>(false)

  return (
    <div className="relative h-[19rem] aspect-video rounded overflow-hidden">
      {toggled ? (
        <YouTube
          videoId="NU5ytMsu3AY"
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              controls: 1,
              modestbranding: 1,
              rel: 0,
              showinfo: 1,
            },
          }}
          className="w-full h-[20rem]"
        />
      ) : (
        <>
          <Image
            key="Head-3.jpg"
            src="/Hero-1.jpeg"
            alt="hero"
            width={1920}
            height={1080}
            className="absolute inset-0 object-cover h-full w-full transition-opacity duration-1000 ease-in-out hover:cursor-pointer"
            onClick={() => setToggled(true)}
          />
          <Button
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-6"
            size="icon"
          >
            <Play className="size-8" />
          </Button>
        </>
      )}
    </div>
  )
}
