'use client'
import React from 'react'
import { useAgendas } from '../_hooks/queries/agendas'
import { Skeleton } from '@/components/ui/skeleton'
import { EventCalendar } from '@/components/event-calendar'

function Agenda() {
  const { data: agendas, isPending: agendasPending, isError: agendasError } = useAgendas()

  return (
    <section className="py-8 p-4 text-center lg:px-[20dvw]">
      <h1 className="text-2xl font-bold">Agenda</h1>
      <p className="text-sm text-muted-foreground mb-8">Agenda lalu dan mendatang kampus</p>
      {agendasPending ? (
        <Skeleton className="h-[20vh] w-full rounded-lg" />
      ) : agendasError ? (
        <Skeleton className="h-[20vh] w-full rounded-lg" />
      ) : (
        <EventCalendar className="w-full" events={agendas} readOnly />
      )}
    </section>
  )
}

export default Agenda
