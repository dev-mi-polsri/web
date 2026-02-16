import { NextRequest, NextResponse } from 'next/server'

import {
  handleApiError,
  parsePagination,
  respondFromServerAction,
  StandardApiResponse,
} from '@/app/api/_common'
import type { PaginatedResult } from '@/repository/_contracts'
import { FasilitasCriteria } from '@/repository/FasilitasRepository'
import type { Fasilitas } from '@/schemas/FasilitasTable'
import { createFasilitas, getFasilitas } from '@/server-actions/fasilitas'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  try {
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

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const result = await createFasilitas(payload)

    return respondFromServerAction(result, 201)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
