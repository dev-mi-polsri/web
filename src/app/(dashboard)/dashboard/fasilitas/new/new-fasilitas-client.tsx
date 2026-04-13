'use client'
import { FasilitasForm } from './fasilitas-form'
import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { createFasilitas } from '@/server-actions/fasilitas'
import { toast } from 'sonner'
import { useState } from 'react'

export default function NewFasilitasClient() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-4 max-w-screen-sm">
        <div>
          <BackButton />
        </div>
        <FasilitasForm
          onSubmit={async (values) => {
            try {
              setIsLoading(true)
              const result = await createFasilitas({
                name: values.name,
                enName: values.enName,
                image: await Base64Utils.toDataUrl(values.foto!),
              })

              if (result && typeof result === 'object' && 'error' in result) {
                toast.error(result.error)
                return
              }

              toast.success('Fasilitas berhasil dibuat')
              router.push('/dashboard/fasilitas')
              router.refresh()
            } catch (error) {
              toast.error('Gagal membuat fasilitas')
            } finally {
              setIsLoading(false)
            }
          }}
        />
      </div>
    </>
  )
}
