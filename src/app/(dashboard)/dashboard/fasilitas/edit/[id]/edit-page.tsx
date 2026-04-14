'use client'
import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { useRouter } from 'next/navigation'
import { Fasilitas } from '@/schemas/FasilitasTable'
import { FasilitasForm } from '../../new/fasilitas-form'
import { updateFasilitas } from '@/server-actions/fasilitas'
import { Base64Utils } from '@/lib/base64'
import { toast } from 'sonner'
import { useTransition } from 'react'

type EditFasilitasPageProps = {
  fasilitas: Fasilitas
}

export default function EditFasilitasPage({ fasilitas }: EditFasilitasPageProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

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
          isLoading={isPending}
          onSubmit={async (values) => {
            startTransition(async () => {
              try {
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
              } catch (error) {
                toast.error('Gagal memperbarui fasilitas')
              }
            })
          }}
          skipValidation={{ foto: true }}
        />
      </div>
    </>
  )
}
