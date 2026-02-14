import EditFasilitasPage from './edit-page'
import { getFasilitasById } from '@/server-actions/fasilitas'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const fasilitas = await getFasilitasById(id)

  return <EditFasilitasPage fasilitas={fasilitas} />
}
