import { Button } from '@/components/ui/button'
import { getMessages } from 'next-intl/server'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getPost } from '@/server-actions/post'
import { PostType } from '@/schemas/PostTable'
import { PostScope } from '@/schemas/_common'

export default async function AnnouncementBanner({ locale }: { locale: string }) {
  const {
    pages: {
      home: { announcementBanner: t },
    },
  } = await getMessages({ locale })

  // const announcements = await payload.find({
  //   collection: 'news',
  //   where: {
  //     and: [
  //       {
  //         tipe: {
  //           equals: 'pengumuman',
  //         },
  //       },
  //       {
  //         global: {
  //           equals: locale === 'id' ? false : true,
  //         },
  //       },
  //     ],
  //   },
  //   limit: 1,
  // })

  const announcements = await getPost(
    {
      type: PostType.PENGUMUMAN,
      scope: locale === 'id' ? PostScope.NATIONAL : PostScope.INTERNATIONAL,
      isPublished: true,
    },
    {
      page: 1,
      size: 11,
    },
  )

  if (announcements?.results?.length > 0)
    return (
      <div className="bg-white/20 text-white backdrop-blur-sm rounded-full z-50 p-2 pl-4">
        <Link
          href={`${locale}/news/${announcements.results[0].slug}`}
          className="flex flex-col group justify-between gap-8 md:flex-row md:items-center"
        >
          <p className="text-sm group-hover:underline">
            📢 <span className="font-bold">{t.headline}</span> - {announcements.results[0].title}
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
