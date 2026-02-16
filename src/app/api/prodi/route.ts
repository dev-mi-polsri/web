import { NextRequest, NextResponse } from 'next/server'
import { ProdiService } from '@/services/ProdiService'
import db from '@/lib/db'
import { ProdiCriteria } from '@/repository/ProdiRepository'
import { handleApiError, parsePagination, StandardApiResponse } from '@/app/api/_common'
import type { Prodi } from '@/schemas/ProdiTable'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import { cacheLife } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const { page, size } = parsePagination(searchParams)
    const searchKeyword = searchParams.get('searchKeyword') || undefined
    const scope = (searchParams.get('scope') || undefined) as ProdiCriteria['scope']
    const slug = searchParams.get('slug') || undefined

    const criteria: ProdiCriteria = {
      ...(searchKeyword ? { searchKeyword } : {}),
      ...(scope ? { scope } : {}),
      ...(slug ? { slug } : {}),
    }

    const paginatedResult: PaginatedResult<Prodi> = await getProdi(criteria, { page, size })

    return NextResponse.json(
      paginatedResult satisfies StandardApiResponse<PaginatedResult<Prodi>>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

async function getProdi(criteria: ProdiCriteria, pageable: PaginationRequest) {
  'use cache'
  cacheLife('hours')

  const prodiService = new ProdiService(db)
  return prodiService.getProdi(criteria, pageable)
}
