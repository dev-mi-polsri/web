'use client'
import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Fasilitas } from '@/schemas/FasilitasTable'
import { FasilitasForm } from '../../new/fasilitas-form'
import { updateFasilitas } from '@/server-actions/fasilitas'

type EditFasilitasPageProps = {
  fasilitas: Fasilitas
}

export default function EditFasilitasPage({ fasilitas }: EditFasilitasPageProps) {
  const router = useRouter()

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
            const res = await updateFasilitas({
              id: fasilitas.id,
              name: values.name,
              enName: values.enName,
            })

            if (res && 'error' in res) {
              toast.error(res.code, { description: res.error })
              return
            }

            toast.success('Fasilitas berhasil diperbarui')

            router.push('/dashboard/fasilitas')
            router.refresh()
          }}
          skipValidation={{ foto: true }}
        />
      </div>
    </>
  )
}
