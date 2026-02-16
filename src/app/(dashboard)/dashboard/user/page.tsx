import DataTableSearch from '@/components/table/data-table.search'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'

import getSession from '../_lib/auth'
import { getUsers } from '@/server-actions/auth'
import UserTable from './_components/user-table'
import { connection } from 'next/server'

export default async function UserPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string; size?: string }>
}) {
  await connection()
  const session = await getSession()
  if (session.role !== 'admin') {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-xl">Users</h2>
        <div className="text-sm text-muted-foreground">
          You are not allowed to access this page.
        </div>
      </div>
    )
  }

  const { query, page, size } = await searchParams
  const pageNumber = Number(page) || 1
  const sizeNumber = Number(size) || 10

  const users = await getUsers(
    {
      searchKeyword: query,
    },
    {
      page: pageNumber,
      size: sizeNumber,
    },
  )

  if (users && 'error' in users) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-xl">Users</h2>
        <div className="text-sm text-muted-foreground">Failed to load users.</div>
      </div>
    )
  }

  return (
    <div className={'flex flex-col gap-4'}>
      <h2 className={'text-xl'}>Users</h2>
      <div className="flex flex-col gap-2">
        <div className={'flex items-center justify-between gap-2'}>
          <DataTableSearch className={'max-w-60'} placeholder="Search users" />
          <Link href={'/dashboard/user/new'}>
            <Button>
              <PlusIcon />
              User Baru
            </Button>
          </Link>
        </div>
        <UserTable users={users} />
      </div>
    </div>
  )
}
