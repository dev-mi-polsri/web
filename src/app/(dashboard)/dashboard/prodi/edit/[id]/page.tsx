import { getProdiById } from '@/server-actions/prodi'
import EditProdiPage from './edit-page'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const prodi = await getProdiById(id)

  return <EditProdiPage prodi={prodi} />
}
