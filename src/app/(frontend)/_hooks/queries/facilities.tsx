import { Facility } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { PaginatedDocs } from 'payload'

export function useFacilities() {
  const fetchData = () =>
    fetch(`/api/facility?limit=5`)
      .then((res) => {
        if (!res.ok) throw new Error('Fetch Failed')
        return res.json()
      })
      .then((data) => data as PaginatedDocs<Facility>)

  return useQuery({
    queryKey: ['facilities'],
    queryFn: fetchData,
  })
}
