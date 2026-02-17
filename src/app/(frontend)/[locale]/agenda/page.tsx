import React from 'react'
import Agenda from '../_sections/agenda'
import { getMessages } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const messages = await getMessages({ locale })
  const title = messages.pages.agenda.title
  const description = messages.pages.agenda.description

  return {
    title,
    description,
  }
}

function Page() {
  return (
    <div className="my-12">
      <Agenda />
    </div>
  )
}

export default Page
