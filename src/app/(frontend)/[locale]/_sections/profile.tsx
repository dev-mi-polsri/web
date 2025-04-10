'use client'
import { Button } from '@/components/ui/button'
import { BookOpen, Calendar, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import YouTube from 'react-youtube'

function Profile() {
  const [toggled, setToggled] = useState<boolean>(false)

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 p-6 md:p-4">
        <div className="relative h-[19rem] aspect-video rounded overflow-hidden">
          {toggled ? (
            <YouTube
              videoId="cBZ9q42R2LU"
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
                src="/placeholder.svg"
                alt="hero"
                width={1920}
                height={1080}
                className={
                  'absolute inset-0 object-cover h-full w-full transition-opacity duration-1000 ease-in-out hover:cursor-pointer'
                }
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
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-2xl font-bold">Profil Jurusan Manajemen Informatika</h1>
          <p className="text-muted-foreground text-lg text-justify">
            Manajemen Informatika Polsri menghasilkan ahli TI dengan keahlian manajerial melalui
            pendidikan komprehensif dalam pengembangan aplikasi, sistem informasi, analisis data,
            dan manajemen proyek TI, didukung kurikulum relevan, dosen ahli, dan fasilitas modern
            untuk menyiapkan lulusan yang kompeten dan siap berkarir di era digital.
          </p>
          <div className="flex gap-2 items-center mt-4">
            <Link href="/berita">
              <Button>
                <BookOpen />
                Berita MI
              </Button>
            </Link>
            <Link href="#agenda" scroll>
              <Button variant="secondary">
                <Calendar />
                Agenda Kami
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile
