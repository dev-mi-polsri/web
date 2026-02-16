'use client'

import { DataTable } from '@/components/table/data-table'
import DataTablePagination from '@/components/table/data-table.pagination'
import type { PaginatedResult } from '@/repository/_contracts'
import type { Dokumen } from '@/schemas/DokumenTable'
import { dokumenTableColumn } from './dokumen-table.column'

type DokumenTableProps = {
  dokumen: PaginatedResult<Dokumen>
}

export default function DokumenTable({ dokumen }: DokumenTableProps) {
  return (
    <div className={'flex flex-col gap-2'}>
      <DataTable columns={dokumenTableColumn} data={dokumen.results} />
      <div className="flex justify-end">
        <DataTablePagination {...dokumen} />
      </div>
    </div>
  )
}
