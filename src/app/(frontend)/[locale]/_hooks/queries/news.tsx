import { News } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { PaginatedDocs } from 'payload'
import { Where } from 'payload'
import { stringify } from 'qs-esm'

type useNewsParameters = {
  limit?: number
  page?: number
  featured?: boolean
}

export function useNews({ limit = 12, page = 1, featured }: useNewsParameters) {
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
      page,
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
    queryKey: ['news', params.locale, limit, page],
    queryFn: fetchData,
  })
}
