import DataTableSearch from '@/components/table/data-table.search'
import { Button } from '@/components/ui/button'
import { getFasilitas } from '@/server-actions/fasilitas'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import FasilitasTable from './_components/fasilitas-table'

export default async function FasilitasPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string; size: string }>
}) {
  const { query, page, size } = await searchParams

  const fasilitas = await getFasilitas(
    { searchKeyword: query },
    {
      page: Number(page) || 1,
      size: Number(size) || 10,
    },
  )
  return (
    <div className={'flex flex-col gap-4'}>
      <h2 className={'text-xl'}>Fasilitas</h2>
      <div className="flex flex-col gap-2">
        <div className={'flex items-center justify-between gap-2'}>
          <DataTableSearch className={'max-w-60'} />
          <Link href={'/dashboard/fasilitas/new'}>
            <Button>
              <PlusIcon />
              Fasilitas Baru
            </Button>
          </Link>
        </div>
        <FasilitasTable fasilitas={fasilitas} />
      </div>
    </div>
  )
}
