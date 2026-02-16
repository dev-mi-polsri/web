import { getDokumenById } from '@/server-actions/dokumen'
import EditDokumenPage from './edit-page'
import { connection } from 'next/server'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params
  const dokumen = await getDokumenById(id)

  return <EditDokumenPage dokumen={dokumen} />
}
