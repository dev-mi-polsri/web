import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'
import { handleClientPageChange, handleClientSizeChange } from '@/lib/client-pagination'
import { useDebouncedCallback } from 'use-debounce'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChevronsUpDownIcon } from 'lucide-react'

export type DataTablePaginationProps = {
  page: number
  size: number
  total: number
  hasPrevPage: boolean
  hasNextPage: boolean
  totalPages: number
  onChangePage?: (page: number) => void
  onChangeSize?: (size: number) => void
}

export default function DataTablePagination(props: DataTablePaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPage = props.page
  const totalPages = Math.max(1, props.totalPages)

  const handlePageChange = useDebouncedCallback(
    handleClientPageChange({
      searchParams,
      router,
      onChange(page) {
        props.onChangePage?.(page)
      },
    }),
    300,
  )
  const handleSizeChange = useDebouncedCallback(
    handleClientSizeChange({
      searchParams,
      router,
      onChange(size) {
        props.onChangeSize?.(size)
      },
    }),
    300,
  )

  const siblingCount = 2
  const startPage = Math.max(1, currentPage - siblingCount)
  const endPage = Math.min(totalPages, currentPage + siblingCount)

  const pageItems: Array<number | 'ellipsis'> = []
  const pushEllipsis = () => {
    if (pageItems[pageItems.length - 1] !== 'ellipsis') {
      pageItems.push('ellipsis')
    }
  }

  if (totalPages <= 1) {
    pageItems.push(1)
  } else {
    pageItems.push(1)

    if (startPage > 2) {
      pushEllipsis()
    }

    for (let page = startPage; page <= endPage; page++) {
      if (page !== 1 && page !== totalPages) {
        pageItems.push(page)
      }
    }

    if (endPage < totalPages - 1) {
      pushEllipsis()
    }

    pageItems.push(totalPages)
  }

  return (
    <div className="flex gap-4 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {props.size} <ChevronsUpDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Page Size</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              handleSizeChange(10)
            }}
          >
            10
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleSizeChange(25)
            }}
          >
            25
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleSizeChange(50)
            }}
          >
            50
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Pagination>
        <PaginationContent>
          {totalPages > 1 && props.hasPrevPage && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  handlePageChange(currentPage - 1)
                }}
              />
            </PaginationItem>
          )}

          {pageItems.map((item, idx) => {
            if (item === 'ellipsis') {
              return (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            const isActive = item === currentPage
            return (
              <PaginationItem key={item}>
                <PaginationLink
                  isActive={isActive}
                  onClick={() => {
                    if (!isActive) {
                      handlePageChange(item)
                    }
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          {totalPages > 1 && props.hasNextPage && (
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  handlePageChange(currentPage + 1)
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
