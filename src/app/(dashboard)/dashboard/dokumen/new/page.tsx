import getSession from '../../_lib/auth'
import NewDokumenClient from './new-dokumen-client'
import { connection } from 'next/server'

export default async function NewDokumenPage() {
  await connection()
  await getSession()

  return <NewDokumenClient />
}
