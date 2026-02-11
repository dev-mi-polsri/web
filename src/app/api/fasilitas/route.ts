import { NextRequest, NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'

import db from '@/lib/db'
import { FasilitasService } from '@/services/FasilitasService'
import { FasilitasCriteria } from '@/repository/FasilitasRepository'
import { handleError, parsePagination, StandardApiResponse } from '@/app/api/_common'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { Fasilitas } from '@/schemas/FasilitasTable'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const { page, size } = parsePagination(searchParams)
    const searchKeyword = searchParams.get('searchKeyword') || undefined

    const criteria: FasilitasCriteria = {
      ...(searchKeyword ? { searchKeyword } : {}),
    }

    const paginatedResult: PaginatedResult<Fasilitas> = await getFasilitas(criteria, { page, size })

    return NextResponse.json(
      paginatedResult satisfies StandardApiResponse<PaginatedResult<Fasilitas>>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleError(error)
  }
}

async function getFasilitas(criteria: FasilitasCriteria, pageable: PaginationRequest) {
  'use cache'
  cacheLife('hours')

  const fasilitasService = new FasilitasService(db)
  return fasilitasService.getFasilitas(criteria, pageable)
}
