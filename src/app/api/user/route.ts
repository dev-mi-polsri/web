import { NextRequest, NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'

import db from '@/lib/db'
import { UserService } from '@/services/UserService'
import { UserCriteria } from '@/repository/UserRepository'
import { handleError, parsePagination, StandardApiResponse } from '@/app/api/_common'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { MaskedUser, UserRole } from '@/schemas/User'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const { page, size } = parsePagination(searchParams)
    const searchKeyword = searchParams.get('searchKeyword') || undefined
    const email = searchParams.get('email') || undefined
    const role = (searchParams.get('role') || undefined) as UserRole | undefined

    const criteria: UserCriteria = {
      ...(searchKeyword ? { searchKeyword } : {}),
      ...(email ? { email } : {}),
      ...(role ? { role } : {}),
    }

    const paginatedResult: PaginatedResult<MaskedUser> = await getUser(criteria, { page, size })

    return NextResponse.json(
      paginatedResult satisfies StandardApiResponse<PaginatedResult<MaskedUser>>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleError(error)
  }
}

async function getUser(criteria: UserCriteria, pageable: PaginationRequest) {
  'use cache'
  cacheLife('hours')

  const userService = new UserService(db)
  return userService.getUser(criteria, pageable)
}

