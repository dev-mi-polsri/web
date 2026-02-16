'use client'
import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { useRouter } from 'next/navigation'
import { Fasilitas } from '@/schemas/FasilitasTable'
import { FasilitasForm } from '../../new/fasilitas-form'
import { useUpdateFasilitas } from '@/app/(dashboard)/_hooks/fasilitas'

type EditFasilitasPageProps = {
  fasilitas: Fasilitas
}

export default function EditFasilitasPage({ fasilitas }: EditFasilitasPageProps) {
  const router = useRouter()
  const updateMutation = useUpdateFasilitas(fasilitas.id)

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
            await updateMutation.mutateAsync({
              name: values.name,
              enName: values.enName,
            })

            router.push('/dashboard/fasilitas')
            router.refresh()
          }}
          skipValidation={{ foto: true }}
        />
      </div>
    </>
  )
}
