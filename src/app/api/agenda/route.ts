import {
  ApiError,
  handleApiError,
  parsePagination,
  respondFromServerAction,
  StandardApiResponse,
} from '@/app/api/_common'
import { PaginatedResult } from '@/repository/_contracts'
import { AgendaCriteria } from '@/repository/AgendaRepository'
import { Agenda } from '@/schemas/AgendaTable'
import { createAgenda, getAgenda } from '@/server-actions/agenda'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  try {
    const { page, size } = parsePagination(searchParams)
    const { startDate, endDate } = parseDateRange(searchParams)
    const searchKeyword = searchParams.get('searchKeyword') || undefined
    const location = searchParams.get('location') || undefined
    const criteria: AgendaCriteria = {
      ...(startDate || endDate ? { dateRange: { startDate, endDate } } : {}),
      ...(searchKeyword ? { searchKeyword } : {}),
      ...(location ? { location } : {}),
    }

    const paginatedResult: PaginatedResult<Agenda> = await getAgenda(criteria, { page, size })

    return NextResponse.json(
      paginatedResult satisfies StandardApiResponse<PaginatedResult<Agenda>>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const result = await createAgenda(payload)

    return respondFromServerAction(result, 201)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

/// Validate date format YYYY-MM-DD
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

function validateDate(dateStr: string): boolean {
  return DATE_REGEX.test(dateStr)
}

function parseDateRange(searchParams: URLSearchParams): { startDate?: Date; endDate?: Date } {
  const startDateStr = searchParams.get('startDate')
  const endDateStr = searchParams.get('endDate')
  let startDate: Date | undefined
  let endDate: Date | undefined

  if (startDateStr) {
    if (!validateDate(startDateStr)) {
      throw new ApiError('startDate must be in YYYY-MM-DD format')
    }
    startDate = new Date(startDateStr)
  }

  if (endDateStr) {
    if (!validateDate(endDateStr)) {
      throw new ApiError('endDate must be in YYYY-MM-DD format')
    }
    endDate = new Date(endDateStr)
  }

  return { startDate, endDate }
}
