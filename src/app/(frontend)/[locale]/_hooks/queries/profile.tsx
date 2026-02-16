import { StandardApiResponse, StandardErrorResponse } from '@/app/api/_common'
import { ProfileCriteria } from '@/repository/ProfileRepository'
import { PostScope } from '@/schemas/_common'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { stringify } from 'qs-esm'
import { RefObject } from 'react'
import { CMSFetchError } from './_common'
import { PaginatedResult } from '@/repository/_contracts'
import { Profile } from '@/schemas/ProfileTable'

type useProfilesParameters = {
  controllerRef?: RefObject<AbortController | null>
  searchKeyword?: string
  limit?: number
  page?: number
}

export function useProfiles({
  limit = 12,
  page = 1,
  searchKeyword,
  controllerRef,
}: useProfilesParameters) {
  const params = useParams<{ locale: string }>()

  const query = {
    scope: params.locale === 'id' ? PostScope.NATIONAL : PostScope.INTERNATIONAL,
    searchKeyword,
  } satisfies ProfileCriteria

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
    const res = await fetch(`/api/profile?${querySearchParams.toString()}`, {
      signal: signal ?? undefined,
    })
    if (!res.ok) {
      const parsedResponse = (await res.json()) as StandardErrorResponse
      throw new CMSFetchError(parsedResponse.code, parsedResponse.error)
    }

    return (await res.json()) as Promise<PaginatedResult<Profile>>
  }

  return useQuery({
    queryKey: ['profile', params.locale, searchKeyword, limit, page],
    queryFn: fetchData,
  })
}
