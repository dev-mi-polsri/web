'use client'
import { FasilitasForm } from './fasilitas-form'
import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { useCreateFasilitas } from '@/app/(dashboard)/_hooks/fasilitas'

export default function NewFasilitasClient() {
  const router = useRouter()
  const createMutation = useCreateFasilitas()

  return (
    <>
      <div className="flex flex-col gap-4 max-w-screen-sm">
        <div>
          <BackButton />
        </div>
        <FasilitasForm
          onSubmit={async (values) => {
            await createMutation.mutateAsync({
              name: values.name,
              enName: values.enName,
              image: await Base64Utils.toDataUrl(values.foto!),
            })

            router.push('/dashboard/fasilitas')
            router.refresh()
          }}
        />
      </div>
    </>
  )
}
