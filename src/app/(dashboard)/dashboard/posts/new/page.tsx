import getSession from '../../_lib/auth'
import NewPostClient from './new-post-client'

export default async function NewPostPage() {
  await getSession()

  return <NewPostClient />
}
