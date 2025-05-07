import { Dosentendik } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { PaginatedDocs } from 'payload'
import { Where } from 'payload'
import { stringify } from 'qs-esm'
import { RefObject } from 'react'

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
  const query: Where = {
    and: [
      {
        name: {
          contains: searchKeyword,
        },
        homebase: {
          equals: homebase,
        },
        pejabat: {
          equals: pejabat,
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
    fetch(`/api/dosentendik${stringifiedQuery}`, {
      signal: signal ?? undefined,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Fetch Failed')
        return res.json()
      })
      .then((data) => data as PaginatedDocs<Dosentendik>)

  return useQuery({
    queryKey: ['dosen-tendik', searchKeyword, limit, page],
    queryFn: fetchData,
  })
}
