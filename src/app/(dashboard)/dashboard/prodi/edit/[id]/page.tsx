import { getProdiById } from '@/server-actions/prodi'
import EditProdiPage from './edit-page'
import getSession from '../../../_lib/auth'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await getSession()
  const { id } = await params
  const prodi = await getProdiById(id)

  return <EditProdiPage prodi={prodi} />
}
