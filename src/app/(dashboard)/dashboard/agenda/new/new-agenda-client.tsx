'use client'

import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { useCreateAgenda } from '@/app/(dashboard)/_hooks/agenda'
import { AgendaForm } from './agenda-form'

export default function NewAgendaClient() {
  const router = useRouter()
  const createMutation = useCreateAgenda()

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <AgendaForm
        onSubmit={async (values) => {
          await createMutation.mutateAsync({
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
