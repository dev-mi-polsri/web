import getSession from '../../_lib/auth'
import NewDokumenClient from './new-dokumen-client'

export default async function NewDokumenPage() {
  await getSession()

  return <NewDokumenClient />
}
