'use client'

import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { useRouter } from 'next/navigation'
import type { TenagaAjar } from '@/schemas/TenagaAjarTable'
import { TenagaAjarForm } from '../../new/tenaga-ajar-form'
import { useUpdateTenagaAjar } from '@/app/(dashboard)/_hooks/tenaga-ajar'
import { Base64Utils } from '@/lib/base64'

type EditTenagaAjarPageProps = {
  tenagaAjar: TenagaAjar
}

export default function EditTenagaAjarPage({ tenagaAjar }: EditTenagaAjarPageProps) {
  const router = useRouter()
  const updateMutation = useUpdateTenagaAjar(tenagaAjar.id)

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>
      <TenagaAjarForm
        title={`Edit Tenaga Ajar: ${tenagaAjar.nama}`}
        actionButtonLabel={'Simpan'}
        initialValues={{
          nama: tenagaAjar.nama,
          jenis: tenagaAjar.jenis,
          homebase: tenagaAjar.homebase,
          nip: tenagaAjar.nip,
          nidn: tenagaAjar.nidn ?? '',
          nuptk: tenagaAjar.nuptk ?? '',
          isPejabat: tenagaAjar.isPejabat,
        }}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({
            nama: values.nama,
            jenis: values.jenis,
            homebase: values.homebase,
            nip: values.nip,
            nidn: values.nidn || undefined,
            nuptk: values.nuptk || undefined,
            isPejabat: values.isPejabat,
            ...(values.foto ? { foto: await Base64Utils.toDataUrl(values.foto) } : {}),
          })

          router.push('/dashboard/tenaga-ajar')
          router.refresh()
        }}
        skipValidation={{ foto: true }}
      />
    </div>
  )
}
