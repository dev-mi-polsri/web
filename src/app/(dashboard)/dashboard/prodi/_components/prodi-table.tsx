'use client'

import type { Prodi } from '@/schemas/ProdiTable'
import type { PaginatedResult } from '@/repository/_contracts'
import { DataTable } from '@/components/table/data-table'
import { prodiTableColumn } from '@/app/(dashboard)/dashboard/prodi/_components/prodi-table.column'
import DataTablePagination from '@/components/table/data-table.pagination'

interface ProdiTableProps {
  prodi: PaginatedResult<Prodi>
}

export function ProdiTable({ prodi }: ProdiTableProps) {
  return (
    <div className={'flex flex-col gap-2'}>
      <DataTable columns={prodiTableColumn} data={prodi.results} />
      <div className="flex justify-end">
        <DataTablePagination {...prodi} />
      </div>
    </div>
  )
}
