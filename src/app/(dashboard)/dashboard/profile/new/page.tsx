import getSession from '../../_lib/auth'
import NewProfileClient from './new-profile-client'

export default async function NewProfilePage() {
  await getSession()

  return <NewProfileClient />
}
