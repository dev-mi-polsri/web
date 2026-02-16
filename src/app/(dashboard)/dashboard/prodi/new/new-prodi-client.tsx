'use client'

import { ProdiForm } from './prodi-form'
import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { useCreateProdi } from '@/app/(dashboard)/_hooks/prodi'

export default function NewProdiClient() {
  const router = useRouter()
  const createMutation = useCreateProdi()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>
      <ProdiForm
        onSubmit={async (values) => {
          await createMutation.mutateAsync({
            title: values.title,
            description: values.description,
            content: values.content!,
            scope: values.scope,
            thumbnail: await Base64Utils.toDataUrl(values.thumbnail!),
          })

          router.push('/dashboard/prodi')
          router.refresh()
        }}
      />
    </div>
  )
}
