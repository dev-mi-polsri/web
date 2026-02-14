'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { createAgenda } from '@/server-actions/agenda'
import { AgendaForm } from './agenda-form'

export default function NewAgendaClient() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <AgendaForm
        onSubmit={async (values) => {
          const res = await createAgenda({
            title: values.title,
            enTitle: values.enTitle,
            description: values.description,
            startDate: values.startDate,
            endDate: values.endDate,
            location: values.location,
          })

          if (res && 'error' in res) {
            toast.error(res.code, { description: res.error })
            return
          }

          toast.success('Agenda berhasil dibuat')

          router.push('/dashboard/agenda')
          router.refresh()
        }}
      />
    </div>
  )
}
