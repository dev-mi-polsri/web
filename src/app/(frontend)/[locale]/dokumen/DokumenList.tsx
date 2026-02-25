'use client'
import type { PaginatedResult } from '@/repository/_contracts'
import type { Dokumen } from '@/schemas/DokumenTable'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { DownloadIcon, FileIcon, FileTextIcon, FileImageIcon } from 'lucide-react'

interface DokumenListProps {
  data: PaginatedResult<Dokumen> | null
  page: number
  setPage: (page: number) => void
}

function getExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname
    return pathname.split('.').pop()?.toLowerCase() ?? ''
  } catch {
    return url.split('.').pop()?.toLowerCase() ?? ''
  }
}

interface FileIconBadgeProps {
  url: string
}

function FileIconBadge({ url }: FileIconBadgeProps) {
  const ext = getExtension(url)

  if (ext === 'pdf') {
    return (
      <span className="inline-flex items-center justify-center size-9 rounded-lg bg-red-100 dark:bg-red-900/30 shrink-0">
        <FileTextIcon className="size-5 text-red-600 dark:text-red-400" />
      </span>
    )
  }

  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'tiff'].includes(ext)) {
    return (
      <span className="inline-flex items-center justify-center size-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 shrink-0">
        <FileImageIcon className="size-5 text-purple-600 dark:text-purple-400" />
      </span>
    )
  }

  return (
    <span className="inline-flex items-center justify-center size-9 rounded-lg bg-muted shrink-0">
      <FileIcon className="size-5 text-muted-foreground" />
    </span>
  )
}

export default function DokumenList({ data, page, setPage }: DokumenListProps) {
  if (!data || data.results.length === 0) {
    return <p className="text-muted-foreground text-sm py-8">No documents found.</p>
  }

  return (
    <div className="w-full flex flex-col gap-4 px-4">
      <div className="w-full grid grid-cols-2 gap-4">
        {data.results.map((doc) => (
          <div
            key={doc.id}
            className="flex justify-between p-4 rounded-lg border bg-card text-left gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileIconBadge url={doc.url} />
              <div className="min-w-0">
                <p className="font-medium truncate">{doc.name}</p>
              </div>
            </div>
            <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
              <Button variant="outline" size="sm" className="shrink-0">
                <DownloadIcon className="mr-2 size-4" />
                Download
              </Button>
            </a>
          </div>
        ))}
      </div>

      {data.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(page - 1)}
                aria-disabled={!data.hasPrevPage}
                className={!data.hasPrevPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm px-4 text-muted-foreground">
                {page} / {data.totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(page + 1)}
                aria-disabled={!data.hasNextPage}
                className={!data.hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
