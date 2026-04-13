'use client'
import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { useRouter } from 'next/navigation'
import { Fasilitas } from '@/schemas/FasilitasTable'
import { FasilitasForm } from '../../new/fasilitas-form'
import { updateFasilitas } from '@/server-actions/fasilitas'
import { Base64Utils } from '@/lib/base64'
import { toast } from 'sonner'
import { useState } from 'react'

type EditFasilitasPageProps = {
  fasilitas: Fasilitas
}

export default function EditFasilitasPage({ fasilitas }: EditFasilitasPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-4 max-w-screen-sm">
        <div>
          <BackButton />
        </div>
        <FasilitasForm
          title={`Edit Fasilitas: ${fasilitas.name}`}
          actionButtonLabel={'Simpan'}
          initialValues={{
            name: fasilitas.name,
            enName: fasilitas.enName,
          }}
          onSubmit={async (values) => {
            try {
              setIsLoading(true)
              let image
              if (values.foto instanceof File) {
                image = await Base64Utils.toDataUrl(values.foto)
              }

              const result = await updateFasilitas({
                id: fasilitas.id,
                name: values.name,
                enName: values.enName,
                ...(image ? { image } : {}),
              })

              if (result && typeof result === 'object' && 'error' in result) {
                toast.error(result.error)
                return
              }

              toast.success('Fasilitas berhasil diperbarui')
              router.push('/dashboard/fasilitas')
              router.refresh()
            } catch (error) {
              toast.error('Gagal memperbarui fasilitas')
            } finally {
              setIsLoading(false)
            }
          }}
          skipValidation={{ foto: true }}
        />
      </div>
    </>
  )
}
