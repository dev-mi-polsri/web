import { StandardErrorResponse } from '@/app/api/_common'
import { CalendarEvent, EventColor } from '@/components/event-calendar'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { CMSFetchError } from './_common'
import { PaginatedResult } from '@/repository/_contracts'
import { Agenda } from '@/schemas/AgendaTable'

export function useAgendas() {
  const COLORS: EventColor[] = ['amber', 'emerald', 'orange', 'rose', 'sky', 'violet']
  const { locale } = useParams<{ locale: string }>()

  // const fetchData = () =>
  //   fetch('/api/agenda?limit=50')
  //     .then((res) => {
  //       if (!res.ok) throw new Error('Fetch Failed')
  //       return res.json()
  //     })
  //     .then((data) => data as PaginatedDocs<Agenda>)
  //     .then(({ docs: agendas }) =>
  //       agendas.map(
  //         (agenda, idx): CalendarEvent => ({
  //           id: idx.toString(),
  //           title: locale === 'en' ? agenda.enName : agenda.name,
  //           description: agenda.description,
  //           color: COLORS[Math.floor(Math.random() * COLORS.length + 1)],
  //           start: new Date(agenda.startDate),
  //           end: new Date(agenda.endDate),
  //           location: agenda.location ?? '',
  //           allDay: true,
  //         }),
  //       ),
  //     )

  const fetchData = async () => {
    const res = await fetch(`/api/agenda`)
    if (!res.ok) {
      const parsedResponse = (await res.json()) as StandardErrorResponse
      throw new CMSFetchError(parsedResponse.code, parsedResponse.error)
    }

    const agendas = (await res.json()) as PaginatedResult<Agenda>
    return agendas.results.map(
      (agenda, idx): CalendarEvent => ({
        id: idx.toString(),
        title: locale === 'en' ? agenda.enTitle : agenda.title,
        description: agenda.description,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        start: new Date(agenda.startDate),
        end: new Date(agenda.endDate),
        location: agenda.location ?? '',
        allDay: true,
      }),
    )
  }

  return useQuery({
    queryKey: ['agendas'],
    queryFn: fetchData,
  })
}
