'use client'

import type { Prodi } from '@/schemas/ProdiTable'
import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { ProdiForm } from '@/app/(dashboard)/dashboard/prodi/new/prodi-form'
import { updateProdi } from '@/server-actions/prodi'
import { Base64Utils } from '@/lib/base64'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type EditProdiPageProps = {
  prodi: Prodi
}

export default function EditProdiPage({ prodi }: EditProdiPageProps) {
  const router = useRouter()

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
        onSubmit={async (values) => {
          let thumbnail
          if (values.thumbnail instanceof File) {
            thumbnail = await Base64Utils.toDataUrl(values.thumbnail)
          }

          const res = await updateProdi({
            id: prodi.id,
            title: values.title,
            description: values.description,
            content: values.content!,
            scope: values.scope,
            thumbnail,
          })

          if (res && 'error' in res) {
            toast.error(res.code, { description: res.error })
            return
          }

          toast.success('Program studi berhasil diperbarui')
          router.push('/dashboard/prodi')
          router.refresh()
        }}
        skipValidation={{ thumbnail: true }}
      />
    </div>
  )
}
