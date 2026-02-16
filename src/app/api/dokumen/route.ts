import { NextRequest, NextResponse } from 'next/server'

import {
  handleApiError,
  parsePagination,
  respondFromServerAction,
  StandardApiResponse,
} from '@/app/api/_common'
import type { PaginatedResult } from '@/repository/_contracts'
import { DokumenCriteria } from '@/repository/DokumenRepository'
import { Dokumen } from '@/schemas/DokumenTable'
import { createDokumen, getDokumen } from '@/server-actions/dokumen'
import { MediaType } from '@/schemas/MediaTable'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  try {
    const { page, size } = parsePagination(searchParams)
    const searchKeyword = searchParams.get('searchKeyword') || undefined
    const jenisDokumenParam = searchParams.get('jenisDokumen') || undefined
    const jenisDokumen =
      jenisDokumenParam && Object.values(MediaType).includes(jenisDokumenParam as MediaType)
        ? (jenisDokumenParam as MediaType)
        : undefined

    const criteria: DokumenCriteria = {
      ...(searchKeyword ? { searchKeyword } : {}),
      ...(jenisDokumen ? { jenisDokumen } : {}),
    }

    const paginatedResult: PaginatedResult<Dokumen> = await getDokumen(criteria, { page, size })

    return NextResponse.json(
      paginatedResult satisfies StandardApiResponse<PaginatedResult<Dokumen>>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const result = await createDokumen(payload)

    return respondFromServerAction(result, 201)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
