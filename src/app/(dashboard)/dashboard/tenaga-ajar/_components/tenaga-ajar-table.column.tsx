import type { ColumnDef } from '@tanstack/react-table'
import { DeleteButton, EditButton } from '@/components/table/data-table.action-buttons'
import { toast } from 'sonner'
import type { TenagaAjar } from '@/schemas/TenagaAjarTable'
import { deleteTenagaAjar } from '@/server-actions/tenaga-ajar'

export const tenagaAjarTableColumn: ColumnDef<TenagaAjar>[] = [
  {
    id: 'no',
    header: 'No',
    accessorFn: (_row, index) => index + 1,
  },
  {
    accessorKey: 'nama',
    header: 'Nama',
  },
  {
    accessorKey: 'jenis',
    header: 'Jenis',
  },
  {
    accessorKey: 'homebase',
    header: 'Homebase',
  },
  {
    accessorKey: 'nip',
    header: 'NIP',
  },
  {
    id: 'isPejabat',
    header: 'Pejabat',
    accessorFn: (row) => (row.isPejabat ? 'Ya' : 'Tidak'),
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <div className={'flex gap-2'}>
          <EditButton editHref={'/dashboard/tenaga-ajar/edit/' + row.original.id} />
          <DeleteButton
            onConfirm={async () => {
              const actionRes = await deleteTenagaAjar(row.original.id)

              if (actionRes && 'error' in actionRes) {
                toast.error(actionRes.code, { description: actionRes.error })
                return
              }

              toast.success('Tenaga ajar berhasil dihapus')
            }}
          />
        </div>
      )
    },
  },
]
