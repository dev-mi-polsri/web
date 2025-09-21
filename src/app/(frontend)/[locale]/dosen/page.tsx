import React from 'react'
import DosenList from './list'
import { getMessages } from 'next-intl/server'
import config from '@payload-config'
import { getPayload } from 'payload'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const messages = await getMessages({ locale })
  const title = messages.pages.lecturers.metadataTitle
  const description = messages.pages.lecturers.description

  return {
    title,
    description,
  }
}

async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const {
    pages: { lecturers: t },
  } = await getMessages({ locale })

  const payload = await getPayload({ config })

  const dosenD4 = await payload.find({
    collection: 'dosentendik',
    limit: 0,
    where: {
      and: [
        {
          homebase: {
            equals: 'd4',
          },
        },
      ],
    },
  })

  const dosenD3 = await payload.find({
    collection: 'dosentendik',
    limit: 0,
    where: {
      and: [
        {
          homebase: {
            equals: 'd3',
          },
        },
      ],
    },
  })

  return (
    <div className="flex flex-col gap-8 items-center py-24 max-w-screen-lg mx-auto text-center">
      <div className="flex flex-col gap-4 px-4 items-center">
        <h1 className="text-2xl font-bold mb-6">{t.title.d4}</h1>
        <DosenList dosen={dosenD4} />
      </div>
      <div className="flex flex-col gap-4 px-4 items-center">
        <h2 className="text-2xl font-bold mb-6">{t.title.d3}</h2>
        <DosenList dosen={dosenD3} />
      </div>
    </div>
  )
}

export default Page
