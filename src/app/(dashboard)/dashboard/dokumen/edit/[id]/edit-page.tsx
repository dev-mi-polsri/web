'use client'

import { useRouter } from 'next/navigation'

import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import type { Dokumen } from '@/schemas/DokumenTable'
import { Base64Utils } from '@/lib/base64'
import { useUpdateDokumen } from '@/app/(dashboard)/_hooks/dokumen'
import { DokumenForm } from '../../new/dokumen-form'

type EditDokumenPageProps = {
  dokumen: Dokumen
}

export default function EditDokumenPage({ dokumen }: EditDokumenPageProps) {
  const router = useRouter()
  const updateMutation = useUpdateDokumen(dokumen.id)

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <DokumenForm
        title={`Edit Dokumen: ${dokumen.name}`}
        actionButtonLabel={'Simpan'}
        initialValues={{
          name: dokumen.name,
          enName: dokumen.enName,
        }}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({
            name: values.name,
            enName: values.enName,
            ...(values.file ? { file: await Base64Utils.toDataUrl(values.file) } : {}),
          })

          router.push('/dashboard/dokumen')
          router.refresh()
        }}
        skipValidation={{ file: true }}
      />
    </div>
  )
}
