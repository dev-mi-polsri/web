import { getPost, getPostById } from '@/server-actions/post'
import EditPostPage from './edit-page'

export default async function Page({params}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPostById(id)

  return <EditPostPage post={post} />
}
