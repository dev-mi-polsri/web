'use client'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useDebouncedCallback } from 'use-debounce'
import { handleClientSearch } from '@/lib/client-pagination'
import { useRouter, useSearchParams } from 'next/navigation'

type DataTableSearchProps = {
  placeholder?: string
  className?: string
}

export default function DataTableSearch({ placeholder, className }: DataTableSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = useDebouncedCallback(handleClientSearch({ searchParams, router }), 300)

  return (
    <Input
      className={cn('block', className)}
      placeholder={placeholder ?? 'Search'}
      type="text"
      onChange={(e) => handleSearch(e.target.value)}
      // Set defaultValue for the initial render from SSR
      defaultValue={searchParams.get('query')?.toString()}
    />
  )
}
