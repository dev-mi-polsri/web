import { News } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { PaginatedDocs } from 'payload'

export function useNews(limit: number) {
  const fetchData = () =>
    fetch(`/api/news?limit=${limit}`)
      .then((res) => {
        if (!res.ok) throw new Error('Fetch Failed')
        return res.json()
      })
      .then((data) => data as PaginatedDocs<News>)

  return useQuery({
    queryKey: ['news'],
    queryFn: fetchData,
  })
}
