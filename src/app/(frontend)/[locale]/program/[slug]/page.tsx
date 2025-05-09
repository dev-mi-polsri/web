import { getPayload } from 'payload'
import React from 'react'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import RichText from '@/components/richtext'
import Image from 'next/image'
import { Media } from '@/payload-types'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import RecommendedNews from '../../_sections/news/recomended-news'
import { getMessages } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const payload = await getPayload({ config })

  const {
    docs: { 0: program },
  } = await payload.find({
    collection: 'studyprogram',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!program) {
    return null
  }

  if (locale === 'en' && !program.global) {
    return null
  }

  return {
    title: program.name,
    description: program.description,
    openGraph: {
      images: [
        { url: `https://manajemeninformatika.polsri.ac.id${(program.thumbnail as Media).url!}` },
      ],
    },
  }
}

async function ProgramPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const {
    pages: { newsPage: t },
  } = await getMessages({ locale })

  const payload = await getPayload({ config })

  const {
    docs: { 0: program },
  } = await payload.find({
    collection: 'studyprogram',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!program) {
    notFound()
  }

  if (locale === 'en' && !program.global) {
    notFound()
  }

  return (
    <div className="container max-w-7xl mx-auto my-20 grid grid-cols-1 p-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}`}>{t.breadcrumbs.home}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/news`}>{t.breadcrumbs.news}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{program.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <article className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col">
          <h1 className="text-4xl font-bold max-w-4xl">{program.name}</h1>
          <div>
            <div className="mb-2 text-muted-foreground">
              {new Date(program.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Image
              src={(program.thumbnail as Media).url || '/placeholder.png'}
              alt={program.name}
              width={1280}
              height={720}
              className="w-full aspect-video object-cover rounded-lg mb-6"
            />
            <div>
              <RichText data={program.content!} className="w-full text-lg" enableGutter={false} />
            </div>
          </div>
        </div>
        <div>
          <RecommendedNews />
        </div>
      </article>
    </div>
  )
}

export default ProgramPage
