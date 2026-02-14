'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import BackButton from '../../_components/back-button'
import { Base64Utils } from '@/lib/base64'
import { createDokumen } from '@/server-actions/dokumen'
import { DokumenForm } from './dokumen-form'

export default function NewDokumenClient() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <DokumenForm
        onSubmit={async (values) => {
          const res = await createDokumen({
            name: values.name,
            enName: values.enName,
            file: await Base64Utils.toDataUrl(values.file!),
          })

          if (res && 'error' in res) {
            toast.error(res.code, { description: res.error })
            return
          }

          toast.success('Dokumen berhasil dibuat')

          router.push('/dashboard/dokumen')
          router.refresh()
        }}
      />
    </div>
  )
}
