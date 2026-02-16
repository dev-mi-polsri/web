import { NextResponse } from 'next/server'
import { ServiceError } from '@/services/_common'
import { ZodError } from 'zod'
import type { ServerActionResponse } from '@/server-actions/_common'

export type StandardErrorResponse = {
  error: string
  code: string
}

export type ValidationErrorResponse = StandardErrorResponse & {
  issues: ZodError['issues']
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

export class ValidationError extends ApiError {
  issues: ZodError['issues']

  constructor(issues: ZodError['issues']) {
    super('Validation Error', 'VALIDATION_ERROR')
    this.issues = issues
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

export function handleApiError(error: unknown): NextResponse<StandardApiResponse<unknown>> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { code: 'BAD_REQUEST', error: error.message } satisfies StandardApiResponse<unknown>,
      { status: 400 },
    )
  }

  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        code: error.errorCode,
        error: error.message,
        issues: error.issues,
      } satisfies StandardApiResponse<unknown>,
      { status: 400 },
    )
  }

  if (error instanceof ServiceError) {
    return NextResponse.json(
      { code: error.errorCode, error: error.message } satisfies StandardApiResponse<unknown>,
      { status: error.errorStatus },
    )
  }

  console.error('Unhandled API error: ', error)
  return NextResponse.json(
    {
      code: 'INTERNAL_SERVER_ERROR',
      error: 'An unexpected error occurred',
    } satisfies StandardApiResponse<unknown>,
    { status: 500 },
  )
}

type ServerActionErrorShape = {
  error: string
  code: string
  issues?: ZodError['issues']
}

function isServerActionErrorShape(value: unknown): value is ServerActionErrorShape {
  return typeof value === 'object' && value !== null && 'error' in value && 'code' in value
}

function mapServerActionErrorStatus(code: string): number {
  switch (code) {
    case 'UNAUTHORIZED':
      return 401
    case 'FORBIDDEN':
      return 403
    case 'NOT_FOUND':
      return 404
    case 'VALIDATION_ERROR':
      return 400
    case 'INTERNAL_SERVER_ERROR':
      return 500
    default:
      return 400
  }
}

export function respondFromServerAction<T>(
  result: ServerActionResponse<T>,
  successStatus = 200,
): NextResponse<StandardApiResponse<T>> {
  if (isServerActionErrorShape(result)) {
    return NextResponse.json(result satisfies StandardApiResponse<T>, {
      status: mapServerActionErrorStatus(result.code),
    })
  }

  return NextResponse.json(result satisfies StandardApiResponse<T>, { status: successStatus })
}
