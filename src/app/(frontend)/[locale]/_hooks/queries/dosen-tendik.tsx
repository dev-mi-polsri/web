import { StandardErrorResponse } from '@/app/api/_common'
import { TenagaAjarCriteria } from '@/repository/TenagaAjarRepository'
import { Homebase, TenagaAjar } from '@/schemas/TenagaAjarTable'
import { useQuery } from '@tanstack/react-query'
import { RefObject } from 'react'
import { CMSFetchError } from './_common'
import { PaginatedResult } from '@/repository/_contracts'

type useDosenTendikParameters = {
  controllerRef?: RefObject<AbortController | null>
  searchKeyword?: string
  limit?: number
  page?: number
  homebase?: 'd3' | 'd4'
  pejabat?: boolean
}

export function useDosenTendik({
  limit = 12,
  page = 1,
  searchKeyword,
  controllerRef,
  homebase = 'd4',
  pejabat = false,
}: useDosenTendikParameters) {
  const query: TenagaAjarCriteria = {
    homebase: homebase === 'd4' ? Homebase.D4 : Homebase.D3,
    isPejabat: pejabat,
    searchKeyword,
  }
  const querySearchParams = new URLSearchParams({
    ...Object.fromEntries(Object.entries(query).filter(([_, value]) => value !== undefined)),
    limit: String(limit),
    page: String(page),
  }).toString

  let signal: AbortSignal | null = null

  if (controllerRef) {
    if (controllerRef.current) {
      controllerRef.current.abort()
    }

    controllerRef.current = new AbortController()
    signal = controllerRef.current.signal
  }

  const fetchData = async () => {
    const res = await fetch(`/api/tenaga-ajar?${querySearchParams.toString()}`, {
      signal: signal ?? undefined,
    })
    if (!res.ok) {
      const parsedResponse = (await res.json()) as StandardErrorResponse
      throw new CMSFetchError(parsedResponse.code, parsedResponse.error)
    }

    return (await res.json()) as Promise<PaginatedResult<TenagaAjar>>
  }

  return useQuery({
    queryKey: ['dosen-tendik', searchKeyword, limit, page],
    queryFn: fetchData,
  })
}
