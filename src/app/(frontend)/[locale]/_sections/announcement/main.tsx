import { getMessages } from 'next-intl/server'
import AnnouncementThumbnailCarousel from './carousel'
import { PostSummary, PostType } from '@/schemas/PostTable'
import { PostScope } from '@/schemas/_common'
import { getPost } from '@/server-actions/post'
import { Link } from '@/i18n/navigation'

export default async function AnnouncementSection({ locale }: { locale: string }) {
  const {
    pages: {
      home: { announcement: t },
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
  //   limit: 5,
  // })
  const announcements = await getPost(
    {
      type: PostType.PENGUMUMAN,
      scope: locale === 'id' ? PostScope.NATIONAL : PostScope.INTERNATIONAL,
      isPublished: true,
    },
    {
      page: 1,
      size: 5,
    },
  )

  if (announcements.results.length < 1) return null

  return (
    <section
      id="announcement"
      className="max-w-5xl mx-auto px-8 py-10 w-full text-center flex flex-col items-center"
    >
      <div>
        <h2 className="text-2xl font-bold">{t.heading}</h2>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
        <div className="order-2 md:order-1 col-span-1">
          {announcements?.results?.map((announcement, idx) => (
            <AnnouncementListItem key={idx} locale={locale} {...announcement} />
          ))}
        </div>
        <div className="order-1 md:order-2 col-span-2">
          <AnnouncementThumbnailCarousel items={announcements?.results} />
        </div>
      </div>
    </section>
  )
}

function AnnouncementListItem({
  title,
  createdAt,
  slug,
  locale,
}: PostSummary & { locale: string }) {
  return (
    <Link
      href={`/news/${slug}`}
      className="text-start flex flex-col group hover:cursor-pointer hover:bg-muted p-1.5 rounded-lg"
    >
      <h2 className="text-lg font-bold group-hover:tunderline">{title}</h2>
      <span className="text-muted-foreground">
        {Intl.DateTimeFormat('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(new Date(createdAt))}
      </span>
    </Link>
  )
}
