import { PostSummary } from '@/schemas/PostTable'
import { ColumnDef } from '@tanstack/react-table'
import { PostScope } from '@/schemas/_common'
import { DeleteButton, EditButton } from '@/components/table/data-table.action-buttons'
import { deletePost } from '@/server-actions/post'
import { toast } from 'sonner'
import { CheckIcon, XIcon } from 'lucide-react'

const SCOPE_MAP: Record<PostScope, string> = {
  [PostScope.INTERNATIONAL]: 'International',
  [PostScope.NATIONAL]: 'National',
}

export const postTableColumn: ColumnDef<PostSummary>[] = [
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
    accessorKey: 'isPublished',
    header: () => <div className="flex justify-center">Published</div>,
    cell: ({ row }) => {
      const isPublished = row.getValue<boolean>('isPublished')
      return (
        <div className="flex justify-center">
          {isPublished ? (
            <CheckIcon className="size-4" />
          ) : (
            <XIcon className="size-4 text-destructive" />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'isFeatured',
    header: () => <div className="flex justify-center">Featured</div>,
    cell: ({ row }) => {
      const isFeatured = row.getValue<boolean>('isFeatured')
      return (
        <div className="flex justify-center">
          {isFeatured ? (
            <CheckIcon className="size-4" />
          ) : (
            <XIcon className="size-4 text-destructive" />
          )}
        </div>
      )
    },
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <div className={'flex gap-2'}>
          <EditButton editHref={'/dashboard/post/' + row.original.id} />
          <DeleteButton
            onConfirm={async () => {
              const actionRes = await deletePost(row.original.id)

              if (actionRes && 'error' in actionRes) {
                toast.error(actionRes.code, { description: actionRes.error })
                return
              }

              toast.success('Post deleted successfully')
            }}
          />
        </div>
      )
    },
  },
]
