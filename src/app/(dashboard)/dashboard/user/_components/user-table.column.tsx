import type { ColumnDef } from '@tanstack/react-table'
import { EditButton } from '@/components/table/data-table.action-buttons'
import type { UserRow } from './user-table'

export const userTableColumn: ColumnDef<UserRow>[] = [
  {
    id: 'no',
    header: 'No',
    accessorFn: (_row, index) => index + 1,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.original.name || '-',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => row.original.role || '-',
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <div className={'flex gap-2'}>
          <EditButton editHref={'/dashboard/user/edit/' + row.original.id} />
        </div>
      )
    },
  },
]
