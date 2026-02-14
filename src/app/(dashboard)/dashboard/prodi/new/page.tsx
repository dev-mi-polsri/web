'use client'

import { createProdi } from '@/server-actions/prodi'
import { ProdiForm } from './prodi-form'
import { Base64Utils } from '@/lib/base64'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'

export default function NewProdiPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>
      <ProdiForm
        onSubmit={async (values) => {
          const res = await createProdi({
            title: values.title,
            description: values.description,
            content: values.content!,
            scope: values.scope,
            thumbnail: await Base64Utils.toDataUrl(values.thumbnail!),
          })

          if (res && 'error' in res) {
            toast.error(res.code, { description: res.error })
            return
          }

          toast.success('Program studi berhasil dibuat')
          router.push('/dashboard/prodi')
          router.refresh()
        }}
      />
    </div>
  )
}
