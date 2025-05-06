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
    docs: { 0: profile },
  } = await payload.find({
    collection: 'profile',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!profile) {
    return null
  }

  if (locale === 'en' && !profile.global) {
    return null
  }

  return {
    title: profile.name,
    description: profile.description,
    openGraph: {
      images: [
        { url: `https://manajemeninformatika.polsri.ac.id${(profile.thumbnail as Media).url!}` },
      ],
    },
  }
}

async function ProfilePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const {
    pages: { newsPage: t },
  } = await getMessages({ locale })

  const payload = await getPayload({ config })

  const {
    docs: { 0: profile },
  } = await payload.find({
    collection: 'profile',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!profile) {
    notFound()
  }

  if (locale === 'en' && !profile.global) {
    notFound()
  }

  return (
    <div className="container max-w-7xl mx-auto mt-20 grid grid-cols-1 p-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}`}>{t.breadcrumbs.home}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/news`}>{t.breadcrumbs.profile}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{profile.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <article>
        <h1 className="text-4xl font-bold">{profile.name}</h1>
        <div>
          <div className="mb-2 text-muted-foreground">
            {new Date(profile.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
        <Image
          src={(profile.thumbnail as Media).url || '/placeholder.png'}
          alt={profile.name}
          width={1280}
          height={720}
          className="w-full aspect-video object-cover rounded-lg mb-6"
        />
        <div className="w-full text-lg">
          <RichText data={profile.content!} className="w-full text-lg" enableGutter={false} />
        </div>
      </article>
      <div className="my-8">
        <RecommendedNews />
      </div>
    </div>
  )
}

export default ProfilePage
