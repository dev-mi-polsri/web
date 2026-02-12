import { NextResponse } from 'next/server'
import { ServiceError } from '@/services/_common'

export type StandardErrorResponse = {
  error: string
  code: string
}

export type StandardApiResponse<T> = T | StandardErrorResponse

export class ApiError extends Error {
  public errorCode?: string
  public errorStatus?: number
  constructor(message: string, errorCode?: string, errorStatus?: number) {
    super(message)
    this.name = 'ApiError'
    this.errorCode = errorCode
    this.errorStatus = errorStatus
  }
}


export function parsePagination(searchParams: URLSearchParams): { page: number; size: number } {
  const page = parseInt(searchParams.get('page') || '1', 10)
  const size = parseInt(searchParams.get('size') || '10', 10)

  if (isNaN(page) || page <= 0) {
    throw new ApiError('Invalid page number')
  }

  if (isNaN(size) || size <= 0) {
    throw new ApiError('Invalid size number')
  }

  return { page, size }
}


export function handleError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { code: 'BAD_REQUEST', error: error.message } satisfies StandardApiResponse<unknown>,
      { status: 400 },
    )
  }

  if (error instanceof ServiceError) {
    return NextResponse.json(
      { code: error.errorCode, error: error.message } satisfies StandardApiResponse<unknown>,
      { status: error.errorStatus },
    )
  }

  console.error('Unexpected error in GET /api/agenda:', error)
  return NextResponse.json(
    { code: 'INTERNAL_SERVER_ERROR', error: 'An unexpected error occurred' } satisfies StandardApiResponse<unknown>,
    { status: 500 },
  )
}
