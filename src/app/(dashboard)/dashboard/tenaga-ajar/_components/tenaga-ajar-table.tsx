'use client'

import { DataTable } from '@/components/table/data-table'
import DataTablePagination from '@/components/table/data-table.pagination'
import type { PaginatedResult } from '@/repository/_contracts'
import { tenagaAjarTableColumn } from './tenaga-ajar-table.column'
import type { TenagaAjar } from '@/schemas/TenagaAjarTable'

type TenagaAjarTableProps = {
  tenagaAjar: PaginatedResult<TenagaAjar>
}

export default function TenagaAjarTable({ tenagaAjar }: TenagaAjarTableProps) {
  return (
    <div className={'flex flex-col gap-2'}>
      <DataTable columns={tenagaAjarTableColumn} data={tenagaAjar.results} />
      <div className="flex justify-end">
        <DataTablePagination {...tenagaAjar} />
      </div>
    </div>
  )
}
