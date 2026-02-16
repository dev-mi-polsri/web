import { getProfile } from '@/server-actions/profile'
import DataTableSearch from '@/components/table/data-table.search'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { ProfileTable } from '@/app/(dashboard)/dashboard/profile/_components/profile-table'
import getSession from '../_lib/auth'
import { connection } from 'next/server'

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string; size: string }>
}) {
  await connection()
  await getSession()
  const { query, page, size } = await searchParams

  const profile = await getProfile(
    { searchKeyword: query },
    {
      page: Number(page) || 1,
      size: Number(size) || 10,
    },
  )

  return (
    <div className={'flex flex-col gap-4'}>
      <h2 className={'text-xl'}>Profile Jurusan</h2>
      <div className="flex flex-col gap-2">
        <div className={'flex items-center justify-between gap-2'}>
          <DataTableSearch className={'max-w-60'} />
          <Link href={'/dashboard/profile/new'}>
            <Button>
              <PlusIcon />
              Profile Baru
            </Button>
          </Link>
        </div>
        <ProfileTable profile={profile} />
      </div>
    </div>
  )
}
