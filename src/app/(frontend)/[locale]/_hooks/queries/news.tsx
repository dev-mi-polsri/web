import { StandardErrorResponse } from '@/app/api/_common'
import { PostCriteria } from '@/repository/PostRepository'
import { PostScope } from '@/schemas/_common'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { RefObject } from 'react'
import { CMSFetchError } from './_common'
import { PostSummary } from '@/schemas/PostTable'
import { PaginatedResult } from '@/repository/_common'

type useNewsParameters = {
  controllerRef?: RefObject<AbortController | null>
  searchKeyword?: string
  limit?: number
  page?: number
  featured?: boolean
}

export function useNews({
  limit = 12,
  page = 1,
  featured,
  searchKeyword,
  controllerRef,
}: useNewsParameters) {
  const params = useParams<{ locale: string }>()

  // const query: Where = {
  //   and: [
  //     {
  //       global: {
  //         equals: params.locale === 'id' ? false : true,
  //       },
  //     },
  //     {
  //       featured: {
  //         equals: featured,
  //       },
  //     },
  //     {
  //       name: {
  //         contains: searchKeyword,
  //       },
  //     },
  //   ],
  // }
  const query: PostCriteria = {
    scope: params.locale === 'id' ? PostScope.NATIONAL : PostScope.INTERNATIONAL,
    isFeatured: featured,
    searchKeyword,
  }
  const querySearchParams = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      querySearchParams.append(key, String(value))
    }
  })

  querySearchParams.append('limit', String(limit))
  querySearchParams.append('page', String(page))

  let signal: AbortSignal | null = null

  if (controllerRef) {
    if (controllerRef.current) {
      controllerRef.current.abort()
    }

    controllerRef.current = new AbortController()
    signal = controllerRef.current.signal
  }

  const fetchData = async () => {
    const res = await fetch(`/api/post?${querySearchParams.toString()}`, {
      signal: signal ?? undefined,
    })
    if (!res.ok) {
      const parsedResponse = (await res.json()) as StandardErrorResponse
      throw new CMSFetchError(parsedResponse.code, parsedResponse.error)
    }

    return (await res.json()) as Promise<PaginatedResult<PostSummary>>
  }

  return useQuery({
    queryKey: ['news', params.locale, searchKeyword, limit, page],
    queryFn: fetchData,
  })
}
