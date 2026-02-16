import { getPost, getPostById } from '@/server-actions/post'
import EditPostPage from './edit-page'
import getSession from '../../../_lib/auth'
import { connection } from 'next/server'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  await getSession()
  const { id } = await params
  const post = await getPostById(id)

  return <EditPostPage post={post} />
}
