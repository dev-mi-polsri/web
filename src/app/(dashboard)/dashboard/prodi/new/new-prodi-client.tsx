'use client'

import { ProdiForm } from './prodi-form'
import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { createProdi } from '@/server-actions/prodi'
import { toast } from 'sonner'
import { useTransition } from 'react'

export default function NewProdiClient() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>
      <ProdiForm
        isLoading={isPending}
        onSubmit={async (values) => {
          startTransition(async () => {
            try {
              const result = await createProdi({
                title: values.title,
                description: values.description,
                content: values.content!,
                scope: values.scope,
                thumbnail: await Base64Utils.toDataUrl(values.thumbnail!),
              })

              if (result && typeof result === 'object' && 'error' in result) {
                toast.error(result.error)
                return
              }

              toast.success('Prodi berhasil dibuat')
              router.push('/dashboard/prodi')
            } catch (error) {
              toast.error('Gagal membuat prodi')
            }
          })
        }}
      />
    </div>
  )
}
