import { Studyprogram } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { PaginatedDocs } from 'payload'
import { Where } from 'payload'
import { stringify } from 'qs-esm'
import { RefObject } from 'react'

type useStudyProgramsParameters = {
  controllerRef?: RefObject<AbortController | null>
  searchKeyword?: string
  limit?: number
  page?: number
  featured?: boolean
}

export function useStudyPrograms({
  limit = 12,
  page = 1,
  featured,
  searchKeyword,
  controllerRef,
}: useStudyProgramsParameters) {
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
      {
        name: {
          contains: searchKeyword,
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

  let signal: AbortSignal | null = null

  if (controllerRef) {
    if (controllerRef.current) {
      controllerRef.current.abort()
    }

    controllerRef.current = new AbortController()
    signal = controllerRef.current.signal
  }

  const fetchData = () =>
    fetch(`/api/studyprogram${stringifiedQuery}`, {
      signal: signal ?? undefined,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Fetch Failed')
        return res.json()
      })
      .then((data) => data as PaginatedDocs<Studyprogram>)

  return useQuery({
    queryKey: ['studyprogram', params.locale, searchKeyword, limit, page],
    queryFn: fetchData,
  })
}
