import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

async function Footer() {
  return (
    <>
      <footer className="bg-secondary text-secondary-foreground py-12 flex flex-col">
        <div className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-2xl">Manajemen Informatika</h1>
            <p className="text-muted-foreground">
              Politeknik Negeri Sriwijaya
              <br />
              Jl. Srijaya Negara, Bukit Besar
              <br />
              Palembang, Sumatera Selatan, 30139
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl">Kontak</h1>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <MapPin className="size-4" />
                <p>Jl. Srijaya Negara, Bukit Besar</p>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="size-4" />
                <p>(0711) 35341</p>
              </div>
              <div className="flex gap-2 items-center">
                <Mail className="size-4" />
                <p>mi@polsri.ac.id</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl">Prodi</h1>
            <div className="flex flex-col gap-2">
              {/* {prodi?.docs.map((item, idx) => (
                <Link href={`/prodi/${item.slug}`} key={idx}>
                  {item.judul}
                </Link>
              ))} */}
              <p>D3 Manajemen Informatika</p>
              <p>D4 Manajemen Informatika</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl">Tautan</h1>
            <div className="flex flex-col gap-2">
              <Link href="/">Beranda</Link>
              <Link href="/berita">Berita</Link>
              <Link href="/#agenda">Berita</Link>
            </div>
          </div>
        </div>
        <div className="container max-w-7xl mx-auto text-center mt-8 text-xs text-muted-foreground px-6">
          <p>© {new Date().getFullYear()} Teknik Sipil POLSRI. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default Footer
