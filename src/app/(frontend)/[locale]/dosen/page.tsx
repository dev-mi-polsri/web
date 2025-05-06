import React from 'react'
import DosenList from './list'
import { getMessages } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const messages = await getMessages({ locale })
  const title = messages.pages.lecturer.title
  const description = messages.pages.lecturer.description

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
  return (
    <div className="flex flex-col gap-4 items-center py-24 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
      <DosenList />
    </div>
  )
}

export default Page
