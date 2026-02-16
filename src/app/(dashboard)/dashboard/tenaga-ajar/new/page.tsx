import getSession from '../../_lib/auth'
import NewTenagaAjarClient from './new-tenaga-ajar-client'

export default async function NewTenagaAjarPage() {
  await getSession()

  return <NewTenagaAjarClient />
}
