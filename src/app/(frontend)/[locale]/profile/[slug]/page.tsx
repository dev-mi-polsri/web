import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
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
import { getProfileBySlug } from '@/server-actions/profile'
import { PostScope } from '@/schemas/_common'
import RichTextEditor from '@/app/(dashboard)/dashboard/_components/richtext/richtext.editor'
import { connection } from 'next/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  await connection()
  const { slug, locale } = await params
  // const payload = await getPayload({ config })

  // const {
  //   docs: { 0: profile },
  // } = await payload.find({
  //   collection: 'profile',
  //   where: {
  //     slug: {
  //       equals: slug,
  //     },
  //   },
  // })
  let profile
  try {
    profile = await getProfileBySlug(slug)
  } catch (error) {
    notFound()
  }

  if (!profile) {
    notFound()
  }

  if (locale === 'en' && profile.scope !== PostScope.INTERNATIONAL) {
    notFound()
  }

  return {
    title: profile.title,
    description: profile.description,
    openGraph: {
      images: [{ url: `https://manajemeninformatika.polsri.ac.id${profile.thumbnail}` }],
    },
  }
}

async function ProfilePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  await connection()
  const { slug, locale } = await params
  const {
    pages: { newsPage: t },
  } = await getMessages({ locale })

  let profile
  try {
    profile = await getProfileBySlug(slug)
  } catch (error) {
    notFound()
  }

  if (!profile) {
    notFound()
  }

  if (locale === 'en' && profile.scope !== PostScope.INTERNATIONAL) {
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
            <BreadcrumbPage>{profile.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <article className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col">
          <h1 className="text-4xl font-bold max-w-4xl">{profile.title}</h1>
          <div>
            <div className="mb-2 text-muted-foreground">
              {new Date(profile.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Image
              src={profile.thumbnail || '/placeholder.png'}
              alt={profile.title}
              width={1280}
              height={720}
              className="w-full aspect-video object-cover rounded-lg mb-6"
            />
            <div>
              <RichTextEditor value={profile.content} hideMenuBar readOnly />
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

export default ProfilePage
