import { CalendarEvent, EventColor } from '@/components/event-calendar'
import { Agenda } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { PaginatedDocs } from 'payload'

export function useAgendas() {
  const COLORS: EventColor[] = ['amber', 'emerald', 'orange', 'rose', 'sky', 'violet']

  const fetchData = () =>
    fetch('/api/agenda?limit=50')
      .then((res) => {
        if (!res.ok) throw new Error('Fetch Failed')
        return res.json()
      })
      .then((data) => data as PaginatedDocs<Agenda>)
      .then(({ docs: agendas }) =>
        agendas.map(
          (agenda, idx): CalendarEvent => ({
            id: idx.toString(),
            title: agenda.name,
            description: agenda.description,
            color: COLORS[Math.floor(Math.random() * COLORS.length + 1)],
            start: new Date(agenda.startDate),
            end: new Date(agenda.endDate),
            location: agenda.location ?? '',
            allDay: true,
          }),
        ),
      )

  return useQuery({
    queryKey: ['agendas'],
    queryFn: fetchData,
  })
}
