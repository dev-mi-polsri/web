import { getProfileById } from '@/server-actions/profile'
import EditProfilePage from './edit-page'
import getSession from '../../../_lib/auth'
import { connection } from 'next/server'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  await getSession()
  const { id } = await params
  const profile = await getProfileById(id)

  return <EditProfilePage profile={profile} />
}
