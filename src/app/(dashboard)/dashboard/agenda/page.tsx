import DataTableSearch from '@/components/table/data-table.search'
import { Button } from '@/components/ui/button'
import { getAgenda } from '@/server-actions/agenda'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import AgendaTable from './_components/agenda-table'
import getSession from '../_lib/auth'
import { connection } from 'next/server'

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string; size: string }>
}) {
  await connection()
  await getSession()
  const { query, page, size } = await searchParams

  const agenda = await getAgenda(
    { searchKeyword: query },
    {
      page: Number(page) || 1,
      size: Number(size) || 10,
    },
  )

  return (
    <div className={'flex flex-col gap-4'}>
      <h2 className={'text-xl'}>Agenda</h2>
      <div className="flex flex-col gap-2">
        <div className={'flex items-center justify-between gap-2'}>
          <DataTableSearch className={'max-w-60'} />
          <Link href={'/dashboard/agenda/new'}>
            <Button>
              <PlusIcon />
              Agenda Baru
            </Button>
          </Link>
        </div>
        <AgendaTable agenda={agenda} />
      </div>
    </div>
  )
}
