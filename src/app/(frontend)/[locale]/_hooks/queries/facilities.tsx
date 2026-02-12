import { StandardErrorResponse } from '@/app/api/_common'
import { PaginatedResult } from '@/repository/_common'
import { useQuery } from '@tanstack/react-query'
import { CMSFetchError } from './_common'
import { Fasilitas } from '@/schemas/FasilitasTable'

export function useFacilities() {
  const fetchData = async () => {
    const res = await fetch(`/api/fasilitas?limit=10`)
    if (!res.ok) {
      const parsedResponse = (await res.json()) as StandardErrorResponse
      throw new CMSFetchError(parsedResponse.code, parsedResponse.error)
    }

    return (await res.json()) as Promise<PaginatedResult<Fasilitas>>
  }

  return useQuery({
    queryKey: ['facilities'],
    queryFn: fetchData,
  })
}
