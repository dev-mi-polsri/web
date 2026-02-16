'use client'

import { useRouter } from 'next/navigation'

import BackButton from '../../_components/back-button'
import { Base64Utils } from '@/lib/base64'
import { useCreateDokumen } from '@/app/(dashboard)/_hooks/dokumen'
import { DokumenForm } from './dokumen-form'

export default function NewDokumenClient() {
  const router = useRouter()
  const createMutation = useCreateDokumen()

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <DokumenForm
        onSubmit={async (values) => {
          await createMutation.mutateAsync({
            name: values.name,
            enName: values.enName,
            file: await Base64Utils.toDataUrl(values.file!),
          })

          router.push('/dashboard/dokumen')
          router.refresh()
        }}
      />
    </div>
  )
}
