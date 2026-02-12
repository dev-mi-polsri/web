import { getMessages } from 'next-intl/server'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { PostScope } from '@/schemas/_common'
import { getProdi } from '@/server-actions/prodi'
import { Prodi } from '@/schemas/ProdiTable'

async function StudyPrograms({ locale }: { locale: string }) {
  const {
    pages: {
      home: { studyPrograms: t },
    },
  } = await getMessages({ locale })

  const studyPrograms = await getProdi(
    {
      scope: locale === 'id' ? PostScope.NATIONAL : PostScope.INTERNATIONAL,
    },
    {
      page: 1,
      size: 10,
    },
  )
  return (
    <section className="py-12 relative">
      <div className="relative max-w-2xl mx-auto px-4 z-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">{t.heading}</h2>
          <p className="text-sm">{t.description}</p>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-stretch w-full justify-center gap-2">
          {studyPrograms?.results.map((program, idx) => (
            <StudyProgramCard {...program} t={t} locale={locale} key={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StudyProgramCard({
  thumbnail,
  title,
  description,
  slug,
  locale,
  t,
}: Prodi & { locale: string; t: Record<string, string> }) {
  return (
    <Link href={`/${locale}/program/${slug}`}>
      <div className="group max-w-[20rem] p-2 w-full h-full bg-secondary/50 rounded-lg transition-colors duration-200 overflow-hidden">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <Image
            src={thumbnail || '/placeholder.svg'}
            alt={title}
            fill
            className="h-full w-full rounded-lg object-cover"
          />
        </AspectRatio>
        <div className="mt-4 flex flex-col gap-2 w-full">
          <h3 className="font-semibold text-xl">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
          <Button size="sm" className="mt-2">
            {t.button} <ChevronRight />
          </Button>
        </div>
      </div>
    </Link>
  )
}

export default StudyPrograms
