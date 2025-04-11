import { News } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { PaginatedDocs } from 'payload'
import { Where } from 'payload'
import { stringify } from 'qs-esm'

export function useNews(limit: number, featured?: boolean) {
  const params = useParams<{ locale: string }>()

  const query: Where = {
    and: [
      {
        global: {
          equals: params.locale === 'id' ? undefined : true,
        },
      },
      {
        featured: {
          equals: featured,
        },
      },
    ],
  }

  const stringifiedQuery = stringify(
    {
      where: query,
      limit,
    },
    {
      addQueryPrefix: true,
    },
  )

  const fetchData = () =>
    fetch(`/api/news${stringifiedQuery}`)
      .then((res) => {
        if (!res.ok) throw new Error('Fetch Failed')
        return res.json()
      })
      .then((data) => data as PaginatedDocs<News>)

  return useQuery({
    queryKey: ['news', params.locale, limit],
    queryFn: fetchData,
  })
}
