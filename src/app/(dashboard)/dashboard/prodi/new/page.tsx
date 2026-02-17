import getSession from '../../_lib/auth'
import NewProdiClient from './new-prodi-client'

export default async function NewProdiPage() {
  await getSession()

  return <NewProdiClient />
}
