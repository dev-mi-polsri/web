import { Mail, MapPin, Phone } from 'lucide-react'
import { getMessages } from 'next-intl/server'
import Link from 'next/link'
import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

async function Footer({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const { layout } = await getMessages({ locale })

  const payload = await getPayload({ config })

  const studyPrograms = await payload.find({
    collection: 'studyprogram',
    where: {
      global: {
        equals: locale === 'id' ? false : true,
      },
    },
  })

  return (
    <>
      <footer className="bg-secondary text-secondary-foreground py-12 flex flex-col">
        <div className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-2xl">{layout.footer.title}</h1>
            <p className="text-muted-foreground">
              {layout.footer.campus}
              <br />
              {layout.footer.road}
              <br />
              {layout.footer.city}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl">{layout.footer.links.contact}</h1>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <MapPin className="size-4" />
                <p>{layout.footer.road}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="size-4" />
                <p>{layout.footer.contact.phone}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Mail className="size-4" />
                <p>{layout.footer.contact.email}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl">{layout.footer.links.study}</h1>
            <div className="flex flex-col gap-2">
              {studyPrograms?.docs.map((item, idx) => (
                <Link href={`/${locale}/program/${item.slug}`} key={idx}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl">{layout.footer.links.links}</h1>
            <div className="flex flex-col gap-2">
              <Link href="/">{layout.footer.links.home}</Link>
              <Link href={`/${locale}/news`}>{layout.footer.links.news}</Link>
              <Link href="https://www.instagram.com/jurusan.mi.polsri/">
                {layout.footer.links.ig}
              </Link>
              <Link href="https://www.instagram.com/hmjmi_polsri/">{layout.footer.links.hmj}</Link>
            </div>
          </div>
        </div>
        <div className="container max-w-7xl mx-auto text-center mt-8 text-xs text-muted-foreground px-6">
          <p>
            © {new Date().getFullYear()} {layout.footer.title} Polsri. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer
