'use client'

import { Base64Utils } from '@/lib/base64'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { createTenagaAjar } from '@/server-actions/tenaga-ajar'
import { TenagaAjarForm } from './tenaga-ajar-form'

export default function NewTenagaAjarClient() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <TenagaAjarForm
        onSubmit={async (values) => {
          const res = await createTenagaAjar({
            nama: values.nama,
            jenis: values.jenis,
            homebase: values.homebase,
            foto: await Base64Utils.toDataUrl(values.foto!),
            nip: values.nip,
            nidn: values.nidn || undefined,
            nuptk: values.nuptk || undefined,
            isPejabat: values.isPejabat,
          })

          if (res && 'error' in res) {
            toast.error(res.code, { description: res.error })
            return
          }

          toast.success('Tenaga ajar berhasil dibuat')

          router.push('/dashboard/tenaga-ajar')
          router.refresh()
        }}
      />
    </div>
  )
}
