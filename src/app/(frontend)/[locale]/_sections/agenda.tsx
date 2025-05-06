'use client'
import React from 'react'
import { useAgendas } from '../_hooks/queries/agendas'
import { Skeleton } from '@/components/ui/skeleton'
import { EventCalendar } from '@/components/event-calendar'
import { useTranslations } from 'next-intl'
import { getMessages } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const messages = await getMessages({ locale })
  const title = messages.layout.navbar.title

  return {
    title,
  }
}

function Agenda() {
  const t = useTranslations('pages.agenda')
  const { data: agendas, isPending: agendasPending, isError: agendasError } = useAgendas()

  return (
    <section className="py-8 p-4 text-center lg:px-[20dvw]" id="agenda">
      <h1 className="text-2xl font-bold">{t('heading')}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t('description')}</p>
      {agendasPending ? (
        <Skeleton className="h-[50vh] w-full rounded-lg" />
      ) : agendasError ? (
        <Skeleton className="h-[50vh] w-full rounded-lg" />
      ) : (
        <EventCalendar className="w-full" events={agendas} readOnly />
      )}
    </section>
  )
}

export default Agenda
