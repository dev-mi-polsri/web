'use client'

import type { Profile } from '@/schemas/ProfileTable'
import type { PaginatedResult } from '@/repository/_contracts'
import { DataTable } from '@/components/table/data-table'
import { profileTableColumn } from '@/app/(dashboard)/dashboard/profile/_components/profile-table.column'
import DataTablePagination from '@/components/table/data-table.pagination'

interface ProfileTableProps {
  profile: PaginatedResult<Profile>
}

export function ProfileTable({ profile }: ProfileTableProps) {
  return (
    <div className={'flex flex-col gap-2'}>
      <DataTable columns={profileTableColumn} data={profile.results} />
      <div className="flex justify-end">
        <DataTablePagination {...profile} />
      </div>
    </div>
  )
}
