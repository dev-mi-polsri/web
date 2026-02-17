import { getDokumenById } from '@/server-actions/dokumen'
import EditDokumenPage from './edit-page'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dokumen = await getDokumenById(id)

  return <EditDokumenPage dokumen={dokumen} />
}
