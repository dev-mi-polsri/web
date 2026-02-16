import type { ColumnDef } from '@tanstack/react-table'
import { DeleteButton, EditButton } from '@/components/table/data-table.action-buttons'
import { toast } from 'sonner'
import { PostScope } from '@/schemas/_common'
import { deleteProdi } from '@/server-actions/prodi'
import type { Prodi } from '@/schemas/ProdiTable'

const SCOPE_MAP: Record<PostScope, string> = {
  [PostScope.INTERNATIONAL]: 'International',
  [PostScope.NATIONAL]: 'National',
}

export const prodiTableColumn: ColumnDef<Prodi>[] = [
  {
    id: 'no',
    header: 'No',
    accessorFn: (_row, index) => index + 1,
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'scope',
    header: 'Scope',
    cell: ({ row }) => {
      const scope = row.getValue<PostScope>('scope')
      return SCOPE_MAP[scope] || scope
    },
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <div className={'flex gap-2'}>
          <EditButton editHref={'/dashboard/prodi/edit/' + row.original.id} />
          <DeleteButton
            onConfirm={async () => {
              const actionRes = await deleteProdi(row.original.id)

              if (actionRes && 'error' in actionRes) {
                toast.error(actionRes.code, { description: actionRes.error })
                return
              }

              toast.success('Program studi deleted successfully')
            }}
          />
        </div>
      )
    },
  },
]
