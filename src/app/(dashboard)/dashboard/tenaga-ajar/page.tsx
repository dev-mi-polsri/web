import DataTableSearch from '@/components/table/data-table.search'
import { Button } from '@/components/ui/button'
import { getTenagaAjar } from '@/server-actions/tenaga-ajar'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import TenagaAjarTable from './_components/tenaga-ajar-table'

export default async function TenagaAjarPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string; size: string }>
}) {
  const { query, page, size } = await searchParams

  const tenagaAjar = await getTenagaAjar(
    { searchKeyword: query },
    {
      page: Number(page) || 1,
      size: Number(size) || 10,
    },
  )

  return (
    <div className={'flex flex-col gap-4'}>
      <h2 className={'text-xl'}>Dosen & Tendik</h2>
      <div className="flex flex-col gap-2">
        <div className={'flex items-center justify-between gap-2'}>
          <DataTableSearch className={'max-w-60'} />
          <Link href={'/dashboard/tenaga-ajar/new'}>
            <Button>
              <PlusIcon />
              Tenaga Ajar Baru
            </Button>
          </Link>
        </div>
        <TenagaAjarTable tenagaAjar={tenagaAjar} />
      </div>
    </div>
  )
}
