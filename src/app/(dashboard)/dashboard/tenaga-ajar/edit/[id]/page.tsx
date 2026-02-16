import EditTenagaAjarPage from './edit-page'
import { getTenagaAjarById } from '@/server-actions/tenaga-ajar'
import getSession from '../../../_lib/auth'
import { connection } from 'next/server'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  await getSession()
  const { id } = await params
  const tenagaAjar = await getTenagaAjarById(id)

  return <EditTenagaAjarPage tenagaAjar={tenagaAjar} />
}
