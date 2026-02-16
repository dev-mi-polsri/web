'use client'
import { DataTable } from '@/components/table/data-table'
import DataTablePagination from '@/components/table/data-table.pagination'
import { PaginatedResult } from '@/repository/_contracts'
import { fasiltiasTableColumn } from './fasilitas-table.column'
import { Fasilitas } from '@/schemas/FasilitasTable'

type FasilitasTableProps = {
  fasilitas: PaginatedResult<Fasilitas>
}

export default function FasilitasTable({ fasilitas }: FasilitasTableProps) {
  return (
    <div className={'flex flex-col gap-2'}>
      <DataTable columns={fasiltiasTableColumn} data={fasilitas.results} />
      <div className="flex justify-end">
        <DataTablePagination {...fasilitas} />
      </div>
    </div>
  )
}
