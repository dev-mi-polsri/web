import { NextRequest, NextResponse } from 'next/server'
import { AgendaService } from '@/services/AgendaService'
import db from '@/lib/db'
import { AgendaCriteria } from '@/repository/AgendaRepository'
import { ApiError, handleError, parsePagination, StandardApiResponse } from '@/app/api/_common'
import { Agenda } from '@/schemas/AgendaTable'
import { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import { cacheLife } from 'next/cache'

export async function GET(request: NextRequest) {
 try {
    const searchParams = request.nextUrl.searchParams

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
    return handleError(error)
 }
}

async function getAgenda(criteria: AgendaCriteria, pageable: PaginationRequest) {
  'use cache'
  cacheLife('hours')

  const agendaService = new AgendaService(db)
  return agendaService.getAgenda(criteria, pageable)
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
