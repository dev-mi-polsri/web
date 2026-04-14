'use client'

import type { Prodi } from '@/schemas/ProdiTable'
import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { ProdiForm } from '@/app/(dashboard)/dashboard/prodi/new/prodi-form'
import { updateProdi } from '@/server-actions/prodi'
import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTransition } from 'react'

type EditProdiPageProps = {
  prodi: Prodi
}

export default function EditProdiPage({ prodi }: EditProdiPageProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>
      <ProdiForm
        title={`Edit Program Studi: ${prodi.title}`}
        actionButtonLabel={'Simpan'}
        initialValues={{
          content: prodi.content,
          title: prodi.title,
          description: prodi.description,
          scope: prodi.scope,
        }}
        isLoading={isPending}
        onSubmit={async (values) => {
          startTransition(async () => {
            try {
              let thumbnail
              if (values.thumbnail instanceof File) {
                thumbnail = await Base64Utils.toDataUrl(values.thumbnail)
              }

              const result = await updateProdi({
                id: prodi.id,
                title: values.title,
                description: values.description,
                content: values.content!,
                scope: values.scope,
                thumbnail,
              })

              if (result && typeof result === 'object' && 'error' in result) {
                toast.error(result.error)
                return
              }

              toast.success('Prodi berhasil diperbarui')
              router.push('/dashboard/prodi')
            } catch (error) {
              toast.error('Gagal memperbarui prodi')
            }
          })
        }}
        skipValidation={{ thumbnail: true }}
      />
    </div>
  )
}
