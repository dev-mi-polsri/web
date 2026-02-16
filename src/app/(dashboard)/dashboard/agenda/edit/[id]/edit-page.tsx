'use client'

import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { useRouter } from 'next/navigation'
import type { Agenda } from '@/schemas/AgendaTable'
import { AgendaForm } from '../../new/agenda-form'
import { useUpdateAgenda } from '@/app/(dashboard)/_hooks/agenda'
import { parseDate } from '@/lib/date'

type EditAgendaPageProps = {
  agenda: Agenda
}

export default function EditAgendaPage({ agenda }: EditAgendaPageProps) {
  const router = useRouter()
  const updateMutation = useUpdateAgenda(agenda.id)

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <AgendaForm
        title={`Edit Agenda: ${agenda.title}`}
        actionButtonLabel={'Simpan'}
        initialValues={{
          title: agenda.title,
          enTitle: agenda.enTitle,
          description: agenda.description,
          startDate: parseDate(agenda.startDate as unknown as Date),
          endDate: parseDate(agenda.endDate as unknown as Date),
          location: agenda.location,
        }}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({
            title: values.title,
            enTitle: values.enTitle,
            description: values.description,
            startDate: values.startDate,
            endDate: values.endDate,
            location: values.location,
          })

          router.push('/dashboard/agenda')
          router.refresh()
        }}
      />
    </div>
  )
}
