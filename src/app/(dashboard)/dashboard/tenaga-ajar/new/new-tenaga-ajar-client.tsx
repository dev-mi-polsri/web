'use client'

import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { useCreateTenagaAjar } from '@/app/(dashboard)/_hooks/tenaga-ajar'
import { TenagaAjarForm } from './tenaga-ajar-form'

export default function NewTenagaAjarClient() {
  const router = useRouter()
  const createMutation = useCreateTenagaAjar()

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <TenagaAjarForm
        onSubmit={async (values) => {
          await createMutation.mutateAsync({
            nama: values.nama,
            jenis: values.jenis,
            homebase: values.homebase,
            foto: await Base64Utils.toDataUrl(values.foto!),
            nip: values.nip,
            nidn: values.nidn || undefined,
            nuptk: values.nuptk || undefined,
            isPejabat: values.isPejabat,
          })

          router.push('/dashboard/tenaga-ajar')
          router.refresh()
        }}
      />
    </div>
  )
}
