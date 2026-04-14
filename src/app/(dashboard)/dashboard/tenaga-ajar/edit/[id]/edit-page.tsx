'use client'

import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { useRouter } from 'next/navigation'
import type { TenagaAjar } from '@/schemas/TenagaAjarTable'
import { TenagaAjarForm } from '../../new/tenaga-ajar-form'
import { updateTenagaAjar } from '@/server-actions/tenaga-ajar'
import { Base64Utils } from '@/lib/base64'
import { toast } from 'sonner'
import { useTransition } from 'react'

type EditTenagaAjarPageProps = {
  tenagaAjar: TenagaAjar
}

export default function EditTenagaAjarPage({ tenagaAjar }: EditTenagaAjarPageProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <TenagaAjarForm
        title={`Edit Tenaga Ajar: ${tenagaAjar.nama}`}
        actionButtonLabel={'Simpan'}
        initialValues={{
          nama: tenagaAjar.nama,
          jenis: tenagaAjar.jenis,
          homebase: tenagaAjar.homebase,
          nip: tenagaAjar.nip,
          nidn: tenagaAjar.nidn ?? '',
          nuptk: tenagaAjar.nuptk ?? '',
          isPejabat: tenagaAjar.isPejabat,
        }}
        isLoading={isPending}
        onSubmit={async (values) => {
          startTransition(async () => {
            try {
              const result = await updateTenagaAjar({
                id: tenagaAjar.id,
                nama: values.nama,
                jenis: values.jenis,
                homebase: values.homebase,
                nip: values.nip,
                nidn: values.nidn || undefined,
                nuptk: values.nuptk || undefined,
                isPejabat: values.isPejabat,
                ...(values.foto ? { foto: await Base64Utils.toDataUrl(values.foto) } : {}),
              })

              if (result && typeof result === 'object' && 'error' in result) {
                toast.error(result.error)
                return
              }

              toast.success('Tenaga ajar berhasil diperbarui')
              router.push('/dashboard/tenaga-ajar')
            } catch (error) {
              toast.error('Gagal memperbarui tenaga ajar')
            }
          })
        }}
        skipValidation={{ foto: true }}
      />
    </div>
  )
}
