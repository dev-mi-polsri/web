'use client'

import { DataTable } from '@/components/table/data-table'
import DataTablePagination from '@/components/table/data-table.pagination'
import type { PaginatedResult } from '@/repository/_contracts'
import { userTableColumn } from './user-table.column'

export type UserRow = {
  id: string
  email: string
  name?: string
  role?: string
}

type UserTableProps = {
  users: PaginatedResult<UserRow>
}

export default function UserTable({ users }: UserTableProps) {
  return (
    <div className={'flex flex-col gap-2'}>
      <DataTable columns={userTableColumn} data={users.results} />
      <div className="flex justify-end">
        <DataTablePagination {...users} />
      </div>
    </div>
  )
}
