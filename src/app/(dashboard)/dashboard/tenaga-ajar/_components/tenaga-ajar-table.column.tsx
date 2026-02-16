import type { ColumnDef } from '@tanstack/react-table'
import { DeleteButton, EditButton } from '@/components/table/data-table.action-buttons'
import { toast } from 'sonner'
import type { TenagaAjar } from '@/schemas/TenagaAjarTable'
import { deleteResource } from '@/app/(dashboard)/_hooks/delete-resource'

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
              try {
                await deleteResource(`/api/tenaga-ajar/${row.original.id}`)
                toast.success('Tenaga ajar berhasil dihapus')
              } catch (error) {
                const message =
                  error instanceof Error ? error.message : 'Gagal menghapus tenaga ajar'
                toast.error(message)
              }
            }}
          />
        </div>
      )
    },
  },
]
