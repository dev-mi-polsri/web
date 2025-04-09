import { Partner } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { PaginatedDocs } from 'payload'

export function usePartners(limit: number) {
  const fetchData = () =>
    fetch(`/api/partner?limit=${limit}`)
      .then((res) => {
        if (!res.ok) throw new Error('Fetch Failed')
        return res.json()
      })
      .then((data) => data as PaginatedDocs<Partner>)

  return useQuery({
    queryKey: ['facilities'],
    queryFn: fetchData,
  })
}
