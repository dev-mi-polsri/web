import type { ColumnDef } from '@tanstack/react-table'
import { DeleteButton, EditButton } from '@/components/table/data-table.action-buttons'
import { toast } from 'sonner'
import { PostScope } from '@/schemas/_common'
import { deleteResource } from '@/app/(dashboard)/_hooks/delete-resource'
import type { Profile } from '@/schemas/ProfileTable'

const SCOPE_MAP: Record<PostScope, string> = {
  [PostScope.INTERNATIONAL]: 'International',
  [PostScope.NATIONAL]: 'National',
}

export const profileTableColumn: ColumnDef<Profile>[] = [
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
          <EditButton editHref={'/dashboard/profile/edit/' + row.original.id} />
          <DeleteButton
            onConfirm={async () => {
              try {
                await deleteResource(`/api/profile/${row.original.id}`)
                toast.success('Profile deleted successfully')
              } catch (error) {
                const message = error instanceof Error ? error.message : 'Gagal menghapus profile'
                toast.error(message)
              }
            }}
          />
        </div>
      )
    },
  },
]
