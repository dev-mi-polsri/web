import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { DeleteButton, EditButton } from '@/components/table/data-table.action-buttons'
import type { Dokumen } from '@/schemas/DokumenTable'
import { deleteDokumen } from '@/server-actions/dokumen'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import Link from 'next/link'

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
    header: 'Download',
    cell: ({ row }) => (
      <Link href={row.original.url} target="_blank">
        <Button size="icon-sm">
          <DownloadIcon />
        </Button>
      </Link>
    ),
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
              try {
                const result = await deleteDokumen(row.original.id)
                if (result && typeof result === 'object' && 'error' in result) {
                  toast.error(result.error)
                  return
                }
                toast.success('Dokumen berhasil dihapus')
                window.location.reload()
              } catch (error) {
                const message = error instanceof Error ? error.message : 'Gagal menghapus dokumen'
                toast.error(message)
              }
            }}
          />
        </div>
      )
    },
  },
]
