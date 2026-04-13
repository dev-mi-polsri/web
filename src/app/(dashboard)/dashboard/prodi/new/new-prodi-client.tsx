'use client'

import { ProdiForm } from './prodi-form'
import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { createProdi } from '@/server-actions/prodi'
import { toast } from 'sonner'
import { useState } from 'react'

export default function NewProdiClient() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>
      <ProdiForm
        onSubmit={async (values) => {
          try {
            setIsLoading(true)
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
            router.refresh()
          } catch (error) {
            toast.error('Gagal membuat prodi')
          } finally {
            setIsLoading(false)
          }
        }}
      />
    </div>
  )
}
