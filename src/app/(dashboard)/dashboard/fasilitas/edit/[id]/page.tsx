import EditFasilitasPage from './edit-page'
import { getFasilitasById } from '@/server-actions/fasilitas'
import getSession from '../../../_lib/auth'
import { connection } from 'next/server'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  await getSession()
  const { id } = await params
  const fasilitas = await getFasilitasById(id)

  return <EditFasilitasPage fasilitas={fasilitas} />
}
