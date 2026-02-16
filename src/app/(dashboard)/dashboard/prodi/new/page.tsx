import getSession from '../../_lib/auth'
import NewProdiClient from './new-prodi-client'
import { connection } from 'next/server'

export default async function NewProdiPage() {
  await connection()
  await getSession()

  return <NewProdiClient />
}
