'use client'

import { useRouter } from 'next/navigation'

import BackButton from '../../_components/back-button'
import { Base64Utils } from '@/lib/base64'
import { createDokumen } from '@/server-actions/dokumen'
import { DokumenForm } from './dokumen-form'
import { toast } from 'sonner'
import { useTransition } from 'react'

export default function NewDokumenClient() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <DokumenForm
        isLoading={isPending}
        onSubmit={async (values) => {
          startTransition(async () => {
            try {
              const result = await createDokumen({
                name: values.name,
                enName: values.enName,
                file: await Base64Utils.toDataUrl(values.file!),
              })

              if (result && typeof result === 'object' && 'error' in result) {
                toast.error(result.error)
                return
              }

              toast.success('Dokumen berhasil dibuat')
              router.push('/dashboard/dokumen')
            } catch (error) {
              toast.error('Gagal membuat dokumen')
            }
          })
        }}
      />
    </div>
  )
}
