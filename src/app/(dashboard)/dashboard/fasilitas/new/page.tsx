import getSession from '../../_lib/auth'
import NewFasilitasClient from './new-fasilitas-client'
import { connection } from 'next/server'

export default async function NewFasilitasPage() {
  await connection()
  await getSession()

  return <NewFasilitasClient />
}
