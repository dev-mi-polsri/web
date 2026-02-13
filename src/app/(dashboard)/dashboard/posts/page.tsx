import { getPost } from '@/server-actions/post'
import { PostTable } from '@/app/(dashboard)/dashboard/posts/_components/post-table'
import DataTableSearch from '@/components/table/data-table.search'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import DataTablePagination from '@/components/table/data-table.pagination'

export default async function PostPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string; size: string }>
}) {
  const { query, page, size } = await searchParams

  const posts = await getPost(
    { searchKeyword: query },
    {
      page: Number(page) || 1,
      size: Number(size) || 10,
    },
  )
  return (
    <div className={'flex flex-col gap-4'}>
      <h2 className={'text-xl'}>Posts</h2>
      <div className="flex flex-col gap-2">
        <div className={'flex items-center justify-between gap-2'}>
          <DataTableSearch className={'max-w-60'} />
          <Link href={'/dashboard/posts/new'}>
            <Button>
              <PlusIcon />
              Postingan Baru
            </Button>
          </Link>
        </div>
        <PostTable posts={posts} />
      </div>
    </div>
  )
}
