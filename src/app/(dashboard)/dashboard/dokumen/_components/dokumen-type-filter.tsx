'use client'

import { useDebouncedCallback } from 'use-debounce'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MediaType } from '@/schemas/MediaTable'
import { DOKUMEN_TYPE_LABEL } from '../constants'

type DokumenTypeFilterProps = {
  className?: string
}

const ALL_VALUE = '__all__'

export default function DokumenTypeFilter({ className }: DokumenTypeFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentParam = searchParams.get('jenisDokumen')
  const currentValue =
    currentParam && Object.values(MediaType).includes(currentParam as MediaType)
      ? (currentParam as MediaType)
      : ALL_VALUE

  const setValue = useDebouncedCallback((value: MediaType | typeof ALL_VALUE) => {
    const params = new URLSearchParams(searchParams)

    if (value === ALL_VALUE) {
      params.delete('jenisDokumen')
    } else {
      params.set('jenisDokumen', value)
    }

    params.set('page', '1')

    router.replace(`?${params.toString()}`)
  }, 150)

  return (
    <Select
      value={currentValue}
      onValueChange={(value) => setValue(value as MediaType | typeof ALL_VALUE)}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Jenis dokumen" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>Semua</SelectItem>
        {Object.values(MediaType).map((value) => (
          <SelectItem key={value} value={value}>
            {DOKUMEN_TYPE_LABEL[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
