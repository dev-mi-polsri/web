import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function CTA() {
  return (
    <section id="call-to-action" className="py-8 max-w-screen-lg mx-auto p-4">
      <div className="rounded-lg p-8 text-card-foreground bg-card border">
        <div className="flex flex-col gap-2 mb-4 items-center text-center md:max-w-[80%] mx-auto">
          <h1 className="text-2xl font-bold">Tetap Update dengan Berita MI Polsri!</h1>
          <p>
            Dapatkan informasi terbaru seputar kegiatan, prestasi, dan pengumuman penting dari
            Jurusan Manajemen Informatika.
          </p>
        </div>
        <Link href="/berita">
          <div className="w-full flex justify-center">
            <Button>
              <BookOpen />
              Baca Berita
            </Button>
          </div>
        </Link>
      </div>
    </section>
  )
}

export default CTA
