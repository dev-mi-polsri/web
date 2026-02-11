import type { PaginationRequest } from '@/repository/_contracts'

export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

/**
 * Normalizes pagination request to 1-based pages (matches repository offset formula: (page - 1) * size).
 */
export function normalizePagination(
  pageable?: PaginationRequest,
  defaults: PaginationRequest = { page: 1, size: DEFAULT_PAGE_SIZE },
): PaginationRequest {
  const page = pageable?.page ?? defaults.page
  const size = pageable?.size ?? defaults.size

  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : defaults.page
  const normalizedSize = Number.isFinite(size)
    ? Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(size)))
    : defaults.size

  return { page: normalizedPage, size: normalizedSize }
}

export class ServiceError extends Error {
  public errorCode?: string
  public errorStatus?: number
  constructor(message: string, errorCode?: string, errorStatus?: number) {
    super(message)
    this.name = 'ServiceError'
    this.errorCode = errorCode
    this.errorStatus = errorStatus
  }
}