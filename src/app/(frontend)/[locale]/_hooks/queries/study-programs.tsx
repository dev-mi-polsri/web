import { StandardErrorResponse } from '@/app/api/_common'
import { ProdiCriteria } from '@/repository/ProdiRepository'
import { PostScope } from '@/schemas/_common'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { stringify } from 'qs-esm'
import { RefObject } from 'react'
import { CMSFetchError } from './_common'
import { PaginatedResult } from '@/repository/_common'
import { Prodi } from '@/schemas/ProdiTable'

type useStudyProgramsParameters = {
  controllerRef?: RefObject<AbortController | null>
  searchKeyword?: string
  limit?: number
  page?: number
}

export function useStudyPrograms({
  limit = 12,
  page = 1,
  searchKeyword,
  controllerRef,
}: useStudyProgramsParameters) {
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

  const query: ProdiCriteria = {
    scope: params.locale === 'id' ? PostScope.NATIONAL : PostScope.INTERNATIONAL,
    searchKeyword: searchKeyword,
  }

  const searchParams = new URLSearchParams({
    ...(limit ? { limit: limit.toString() } : {}),
    ...(page ? { page: page.toString() } : {}),
    ...(query.scope ? { scope: query.scope } : {}),
    ...(query.searchKeyword ? { searchKeyword: query.searchKeyword } : {}),
  }).toString()

  let signal: AbortSignal | null = null

  if (controllerRef) {
    if (controllerRef.current) {
      controllerRef.current.abort()
    }

    controllerRef.current = new AbortController()
    signal = controllerRef.current.signal
  }

  const fetchData = async () => {
    const res = await fetch(`/api/prodi?${searchParams.toString()}`, {
      signal: signal ?? undefined,
    })
    if (!res.ok) {
      const parsedResponse = (await res.json()) as StandardErrorResponse
      throw new CMSFetchError(parsedResponse.code, parsedResponse.error)
    }

    return (await res.json()) as Promise<PaginatedResult<Prodi>>
  }

  return useQuery({
    queryKey: ['studyprogram', params.locale, searchKeyword, limit, page],
    queryFn: fetchData,
  })
}

export function useStudyProgramsSuspense({
  limit = 12,
  page = 1,
  searchKeyword,
}: useStudyProgramsParameters) {
  const params = useParams<{ locale: string }>()

  const query: ProdiCriteria = {
    scope: params.locale === 'id' ? PostScope.NATIONAL : PostScope.INTERNATIONAL,
    searchKeyword: searchKeyword,
  }

  const searchParams = new URLSearchParams({
    ...(limit ? { limit: limit.toString() } : {}),
    ...(page ? { page: page.toString() } : {}),
    ...(query.scope ? { scope: query.scope } : {}),
    ...(query.searchKeyword ? { searchKeyword: query.searchKeyword } : {}),
  }).toString()

  const fetchData = async () => {
    const res = await fetch(`/api/prodi?${searchParams.toString()}`)
    if (!res.ok) {
      const parsedResponse = (await res.json()) as StandardErrorResponse
      throw new CMSFetchError(parsedResponse.code, parsedResponse.error)
    }

    return (await res.json()) as Promise<PaginatedResult<Prodi>>
  }

  return useSuspenseQuery({
    queryKey: ['studyprogram', params.locale, searchKeyword, limit, page],
    queryFn: fetchData,
  })
}
