'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import type { Dokumen } from '@/schemas/DokumenTable'
import { Base64Utils } from '@/lib/base64'
import { updateDokumen } from '@/server-actions/dokumen'
import { DokumenForm } from '../../new/dokumen-form'

type EditDokumenPageProps = {
  dokumen: Dokumen
}

export default function EditDokumenPage({ dokumen }: EditDokumenPageProps) {
  const router = useRouter()

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
          const res = await updateDokumen({
            id: dokumen.id,
            name: values.name,
            enName: values.enName,
            ...(values.file ? { file: await Base64Utils.toDataUrl(values.file) } : {}),
          })

          if (res && 'error' in res) {
            toast.error(res.code, { description: res.error })
            return
          }

          toast.success('Dokumen berhasil diperbarui')

          router.push('/dashboard/dokumen')
          router.refresh()
        }}
        skipValidation={{ file: true }}
      />
    </div>
  )
}
