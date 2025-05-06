import { getMessages } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'
import { Media, Studyprogram } from '@/payload-types'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

async function StudyPrograms({ locale }: { locale: string }) {
  const {
    pages: {
      home: { studyPrograms: t },
    },
  } = await getMessages({ locale })

  const payload = await getPayload({ config })

  const studyPrograms = await payload.find({
    collection: 'studyprogram',
    limit: 10,
    where: {
      global: {
        equals: locale === 'id' ? false : true,
      },
    },
  })

  return (
    <section className="py-12 relative">
      <div className="relative max-w-2xl mx-auto px-4 z-20">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">{t.heading}</h1>
          <p className="text-sm">{t.description}</p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-2">
          {studyPrograms?.docs.map((program, idx) => (
            <StudyProgramCard {...program} t={t} locale={locale} key={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StudyProgramCard({
  thumbnail,
  name,
  description,
  slug,
  locale,
  t,
}: Studyprogram & { locale: string; t: Record<string, string> }) {
  return (
    <Link href={`/${locale}/program/${slug}`}>
      <div className="group max-w-[20rem] p-2 w-full h-full bg-secondary/50 rounded-lg transition-colors duration-200 overflow-hidden">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <Image
            src={(thumbnail as Media)?.url || '/placeholder.svg'}
            alt={name}
            fill
            className="h-full w-full rounded-lg object-cover"
          />
        </AspectRatio>
        <div className="mt-4 flex flex-col gap-2">
          <h3 className="font-semibold text-xl">{name}</h3>
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
