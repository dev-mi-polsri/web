import type { ColumnDef } from '@tanstack/react-table'
import { DeleteButton, EditButton } from '@/components/table/data-table.action-buttons'
import { toast } from 'sonner'
import type { Agenda } from '@/schemas/AgendaTable'
import { deleteResource } from '@/app/(dashboard)/_hooks/delete-resource'
import { parseDate } from '@/lib/date'

function formatAgendaDate(value: unknown): string {
  if (!value) return '-'

  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return '-'

  return parseDate(date)
}

export const agendaTableColumn: ColumnDef<Agenda>[] = [
  {
    id: 'no',
    header: 'No',
    accessorFn: (_row, index) => index + 1,
  },
  {
    accessorKey: 'title',
    header: 'Judul',
  },
  {
    accessorKey: 'enTitle',
    header: 'Judul (English)',
  },
  {
    accessorKey: 'location',
    header: 'Lokasi',
  },
  {
    id: 'startDate',
    header: 'Mulai',
    accessorFn: (row) => formatAgendaDate(row.startDate as unknown),
  },
  {
    id: 'endDate',
    header: 'Selesai',
    accessorFn: (row) => formatAgendaDate(row.endDate as unknown),
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <div className={'flex gap-2'}>
          <EditButton editHref={'/dashboard/agenda/edit/' + row.original.id} />
          <DeleteButton
            onConfirm={async () => {
              try {
                await deleteResource(`/api/agenda/${row.original.id}`)
                toast.success('Agenda berhasil dihapus')
              } catch (error) {
                const message = error instanceof Error ? error.message : 'Gagal menghapus agenda'
                toast.error(message)
              }
            }}
          />
        </div>
      )
    },
  },
]
