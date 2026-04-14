'use client'

import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { createTenagaAjar } from '@/server-actions/tenaga-ajar'
import { TenagaAjarForm } from './tenaga-ajar-form'
import { toast } from 'sonner'
import { useTransition } from 'react'

export default function NewTenagaAjarClient() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <TenagaAjarForm
        isLoading={isPending}
        onSubmit={async (values) => {
          startTransition(async () => {
            try {
              const result = await createTenagaAjar({
                nama: values.nama,
                jenis: values.jenis,
                homebase: values.homebase,
                foto: await Base64Utils.toDataUrl(values.foto!),
                nip: values.nip,
                nidn: values.nidn || undefined,
                nuptk: values.nuptk || undefined,
                isPejabat: values.isPejabat,
              })

              if (result && typeof result === 'object' && 'error' in result) {
                toast.error(result.error)
                return
              }

              toast.success('Tenaga ajar berhasil dibuat')
              router.push('/dashboard/tenaga-ajar')
              router.refresh()
            } catch (error) {
              toast.error('Gagal membuat tenaga ajar')
            }
          })
        }}
      />
    </div>
  )
}
