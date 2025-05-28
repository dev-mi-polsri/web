import { Button } from '@/components/ui/button'
import { getMessages } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import * as React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default async function AnnouncementBanner({ locale }: { locale: string }) {
  const {
    pages: {
      home: { announcementBanner: t },
    },
  } = await getMessages({ locale })

  const payload = await getPayload({ config })

  const announcements = await payload.find({
    collection: 'news',
    where: {
      and: [
        {
          tipe: {
            equals: 'pengumuman',
          },
        },
        {
          global: {
            equals: locale === 'id' ? false : true,
          },
        },
      ],
    },
    limit: 1,
  })
  if (announcements?.docs?.length > 0)
    return (
      <div className="bg-white/20 text-white backdrop-blur-sm rounded-full z-50 p-2 pl-4">
        <Link
          href={`${locale}/news/${announcements.docs[0].slug}`}
          className="flex flex-col group justify-between gap-8 md:flex-row md:items-center"
        >
          <p className="text-sm group-hover:underline">
            📢 <span className="font-bold">{t.headline}</span> - {announcements.docs[0].name}
          </p>
          <div className="flex gap-2 max-md:flex-wrap">
            <Button size="sm" className="rounded-full">
              {t.button}
              <ChevronRight />
            </Button>
          </div>
        </Link>
      </div>
    )

  return
}
