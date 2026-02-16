import getSession from '../../_lib/auth'
import NewTenagaAjarClient from './new-tenaga-ajar-client'
import { connection } from 'next/server'

export default async function NewTenagaAjarPage() {
  await connection()
  await getSession()

  return <NewTenagaAjarClient />
}
