import { ColumnDef } from '@tanstack/react-table'
import { DeleteButton, EditButton } from '@/components/table/data-table.action-buttons'
import { toast } from 'sonner'
import { Fasilitas } from '@/schemas/FasilitasTable'
import { deleteFasilitas } from '@/server-actions/fasilitas'

export const fasiltiasTableColumn: ColumnDef<Fasilitas>[] = [
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
    id: 'action',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <div className={'flex gap-2'}>
          <EditButton editHref={'/dashboard/fasilitas/edit/' + row.original.id} />
          <DeleteButton
            onConfirm={async () => {
              try {
                const result = await deleteFasilitas(row.original.id)
                if (result && typeof result === 'object' && 'error' in result) {
                  toast.error(result.error)
                  return
                }
                toast.success('Fasilitas berhasil dihapus')
                window.location.reload()
              } catch (error) {
                const message = error instanceof Error ? error.message : 'Gagal menghapus fasilitas'
                toast.error(message)
              }
            }}
          />
        </div>
      )
    },
  },
]
