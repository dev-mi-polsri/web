import { getProdi } from '@/server-actions/prodi'
import DataTableSearch from '@/components/table/data-table.search'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { ProdiTable } from './_components/prodi-table'
import getSession from '../_lib/auth'
import { connection } from 'next/server'

export default async function ProdiPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string; size: string }>
}) {
  await connection()
  await getSession()
  const { query, page, size } = await searchParams

  const prodi = await getProdi(
    { searchKeyword: query },
    {
      page: Number(page) || 1,
      size: Number(size) || 10,
    },
  )

  return (
    <div className={'flex flex-col gap-4'}>
      <h2 className={'text-xl'}>Program Studi</h2>
      <div className="flex flex-col gap-2">
        <div className={'flex items-center justify-between gap-2'}>
          <DataTableSearch className={'max-w-60'} />
          <Link href={'/dashboard/prodi/new'}>
            <Button>
              <PlusIcon />
              Program Studi Baru
            </Button>
          </Link>
        </div>
        <ProdiTable prodi={prodi} />
      </div>
    </div>
  )
}
