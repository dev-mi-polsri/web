import { getProfileById } from '@/server-actions/profile'
import EditProfilePage from './edit-page'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getProfileById(id)

  return <EditProfilePage profile={profile} />
}
