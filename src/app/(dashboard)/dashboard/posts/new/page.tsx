import getSession from '../../_lib/auth'
import NewPostClient from './new-post-client'
import { connection } from 'next/server'

export default async function NewPostPage() {
  await connection()
  await getSession()

  return <NewPostClient />
}
