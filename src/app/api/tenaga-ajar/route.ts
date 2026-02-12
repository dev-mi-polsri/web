import { NextRequest, NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'

import db from '@/lib/db'
import { TenagaAjarService } from '@/services/TenagaAjarService'
import { TenagaAjarCriteria } from '@/repository/TenagaAjarRepository'
import { handleApiError, parsePagination, StandardApiResponse } from '@/app/api/_common'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { TenagaAjar } from '@/schemas/TenagaAjarTable'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const { page, size } = parsePagination(searchParams)
    const searchKeyword = searchParams.get('searchKeyword') || undefined

    const jenis = (searchParams.get('jenis') || undefined) as TenagaAjarCriteria['jenis']
    const homebase = (searchParams.get('homebase') || undefined) as TenagaAjarCriteria['homebase']

    const isPejabatRaw = searchParams.get('isPejabat')
    const isPejabat = typeof isPejabatRaw === 'string' ? isPejabatRaw === 'true' : undefined

    const criteria: TenagaAjarCriteria = {
      ...(searchKeyword ? { searchKeyword } : {}),
      ...(jenis ? { jenis } : {}),
      ...(homebase ? { homebase } : {}),
      ...(typeof isPejabat === 'boolean' ? { isPejabat } : {}),
    }

    const paginatedResult: PaginatedResult<TenagaAjar> = await getTenagaAjar(criteria, { page, size })

    return NextResponse.json(
      paginatedResult satisfies StandardApiResponse<PaginatedResult<TenagaAjar>>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

async function getTenagaAjar(criteria: TenagaAjarCriteria, pageable: PaginationRequest) {
  'use cache'
  cacheLife('hours')

  const tenagaAjarService = new TenagaAjarService(db)
  return tenagaAjarService.getTenagaAjar(criteria, pageable)
}

