import Link from 'next/link'
import { PlusIcon } from 'lucide-react'

import DataTableSearch from '@/components/table/data-table.search'
import { Button } from '@/components/ui/button'
import { getDokumen } from '@/server-actions/dokumen'
import DokumenTable from './_components/dokumen-table'
import DokumenTypeFilter from './_components/dokumen-type-filter'
import { MediaType } from '@/schemas/MediaTable'

export default async function DokumenPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string
    page?: string
    size?: string
    jenisDokumen?: string
  }>
}) {
  const { query, page, size, jenisDokumen } = await searchParams

  const parsedJenisDokumen =
    jenisDokumen && Object.values(MediaType).includes(jenisDokumen as MediaType)
      ? (jenisDokumen as MediaType)
      : undefined

  const dokumen = await getDokumen(
    {
      ...(query ? { searchKeyword: query } : {}),
      ...(parsedJenisDokumen ? { jenisDokumen: parsedJenisDokumen } : {}),
    },
    {
      page: Number(page) || 1,
      size: Number(size) || 10,
    },
  )

  return (
    <div className={'flex flex-col gap-4'}>
      <h2 className={'text-xl'}>Dokumen</h2>
      <div className="flex flex-col gap-2">
        <div className={'flex items-center justify-between gap-2'}>
          <div className="flex gap-2 items-center">
            <DataTableSearch className={'max-w-60'} />
            <DokumenTypeFilter className={'w-44'} />
          </div>
          <Link href={'/dashboard/dokumen/new'}>
            <Button>
              <PlusIcon />
              Dokumen Baru
            </Button>
          </Link>
        </div>
        <DokumenTable dokumen={dokumen} />
      </div>
    </div>
  )
}
