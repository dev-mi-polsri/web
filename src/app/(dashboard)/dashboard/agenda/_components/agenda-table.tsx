'use client'

import { DataTable } from '@/components/table/data-table'
import DataTablePagination from '@/components/table/data-table.pagination'
import type { PaginatedResult } from '@/repository/_contracts'
import { agendaTableColumn } from './agenda-table.column'
import type { Agenda } from '@/schemas/AgendaTable'

type AgendaTableProps = {
  agenda: PaginatedResult<Agenda>
}

export default function AgendaTable({ agenda }: AgendaTableProps) {
  return (
    <div className={'flex flex-col gap-2'}>
      <DataTable columns={agendaTableColumn} data={agenda.results} />
      <div className="flex justify-end">
        <DataTablePagination {...agenda} />
      </div>
    </div>
  )
}
