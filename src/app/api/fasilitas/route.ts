import { NextRequest, NextResponse } from 'next/server'

import { FasilitasCriteria } from '@/repository/FasilitasRepository'
import { handleApiError, parsePagination, StandardApiResponse } from '@/app/api/_common'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { Fasilitas } from '@/schemas/FasilitasTable'
import { getFasilitas } from '@/server-actions/fasilitas'

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
    return handleApiError(error)
  }
}
