'use client'

import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { createAgenda } from '@/server-actions/agenda'
import { AgendaForm } from './agenda-form'
import { toast } from 'sonner'
import { useTransition } from 'react'

export default function NewAgendaClient() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <AgendaForm
        isLoading={isPending}
        onSubmit={async (values) => {
          startTransition(async () => {
            try {
              const result = await createAgenda({
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

              toast.success('Agenda berhasil dibuat')
              router.push('/dashboard/agenda')
              router.refresh()
            } catch (error) {
              toast.error('Gagal membuat agenda')
            }
          })
        }}
      />
    </div>
  )
}
