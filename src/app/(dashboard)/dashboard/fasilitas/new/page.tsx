'use client'
import { FasilitasForm } from './fasilitas-form'
import { Base64Utils } from '@/lib/base64'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { createFasilitas } from '@/server-actions/fasilitas'

export default function NewFasilitasPage() {
  const router = useRouter()

  return (
    <>
      <div className="flex flex-col gap-4 max-w-screen-sm">
        <div>
          <BackButton />
        </div>
        <FasilitasForm
          onSubmit={async (values) => {
            const res = await createFasilitas({
              name: values.name,
              enName: values.enName,
              image: await Base64Utils.toDataUrl(values.foto!),
            })

            if (res && 'error' in res) {
              toast.error(res.code, { description: res.error })
              return
            }

            toast.success('Fasilitas berhasil dibuat')

            router.push('/dashboard/fasilitas')
            router.refresh()
          }}
        />
      </div>
    </>
  )
}
