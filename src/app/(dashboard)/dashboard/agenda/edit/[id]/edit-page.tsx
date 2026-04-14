'use client'

import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { useRouter } from 'next/navigation'
import type { Agenda } from '@/schemas/AgendaTable'
import { AgendaForm } from '../../new/agenda-form'
import { updateAgenda } from '@/server-actions/agenda'
import { parseDate } from '@/lib/date'
import { toast } from 'sonner'
import { useTransition } from 'react'

type EditAgendaPageProps = {
  agenda: Agenda
}

export default function EditAgendaPage({ agenda }: EditAgendaPageProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

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
        isLoading={isPending}
        onSubmit={async (values) => {
          startTransition(async () => {
            try {
              const result = await updateAgenda({
                id: agenda.id,
                title: values.title,
                enTitle: values.enTitle,
                description: values.description,
                startDate: values.startDate,
                endDate: values.endDate,
                location: values.location,
              })

              if (result && typeof result === 'object' && 'error' in result) {
                toast.error(result.error)
                return
              }

              toast.success('Agenda berhasil diperbarui')
              router.push('/dashboard/agenda')
            } catch (error) {
              toast.error('Gagal memperbarui agenda')
            }
          })
        }}
      />
    </div>
  )
}
