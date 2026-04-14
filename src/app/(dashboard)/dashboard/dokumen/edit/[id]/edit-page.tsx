'use client'

import { useRouter } from 'next/navigation'

import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import type { Dokumen } from '@/schemas/DokumenTable'
import { Base64Utils } from '@/lib/base64'
import { updateDokumen } from '@/server-actions/dokumen'
import { DokumenForm } from '../../new/dokumen-form'
import { toast } from 'sonner'
import { useTransition } from 'react'

type EditDokumenPageProps = {
  dokumen: Dokumen
}

export default function EditDokumenPage({ dokumen }: EditDokumenPageProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

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
        isLoading={isPending}
        onSubmit={async (values) => {
          startTransition(async () => {
            try {
              const result = await updateDokumen({
                id: dokumen.id,
                name: values.name,
                enName: values.enName,
                ...(values.file ? { file: await Base64Utils.toDataUrl(values.file) } : {}),
              })

              if (result && typeof result === 'object' && 'error' in result) {
                toast.error(result.error)
                return
              }

              toast.success('Dokumen berhasil diperbarui')
              router.push('/dashboard/dokumen')
              router.refresh()
            } catch (error) {
              toast.error('Gagal memperbarui dokumen')
            }
          })
        }}
        skipValidation={{ file: true }}
      />
    </div>
  )
}
