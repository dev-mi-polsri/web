import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { DeleteButton, EditButton } from '@/components/table/data-table.action-buttons'
import type { Dokumen } from '@/schemas/DokumenTable'
import { deleteDokumen } from '@/server-actions/dokumen'

export const dokumenTableColumn: ColumnDef<Dokumen>[] = [
  {
    id: 'no',
    header: 'No',
    accessorFn: (_row, index) => index + 1,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'enName',
    header: 'English Name',
  },
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <div className={'flex gap-2'}>
          <EditButton editHref={'/dashboard/dokumen/edit/' + row.original.id} />
          <DeleteButton
            onConfirm={async () => {
              const actionRes = await deleteDokumen(row.original.id)

              if (actionRes && 'error' in actionRes) {
                toast.error(actionRes.code, { description: actionRes.error })
                return
              }

              toast.success('Dokumen berhasil dihapus')
            }}
          />
        </div>
      )
    },
  },
]
