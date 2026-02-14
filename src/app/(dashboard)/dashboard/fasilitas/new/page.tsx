import getSession from '../../_lib/auth'
import NewFasilitasClient from './new-fasilitas-client'

export default async function NewFasilitasPage() {
  await getSession()

  return <NewFasilitasClient />
}
