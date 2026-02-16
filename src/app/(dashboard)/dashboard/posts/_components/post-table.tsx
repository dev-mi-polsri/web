'use client'
import { PostSummary } from '@/schemas/PostTable'
import { DataTable } from '@/components/table/data-table'
import { postTableColumn } from '@/app/(dashboard)/dashboard/posts/_components/post-table.column'
import { PaginatedResult } from '@/repository/_contracts'
import DataTablePagination from '@/components/table/data-table.pagination'

interface IPostTableProps {
  posts: PaginatedResult<PostSummary>
}

export function PostTable({ posts }: IPostTableProps) {
  return (
    <div className={'flex flex-col gap-2'}>
      <DataTable columns={postTableColumn} data={posts.results} />
      <div className="flex justify-end">
        <DataTablePagination {...posts} />
      </div>
    </div>
  )
}
