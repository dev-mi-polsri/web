import { NextRequest, NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'

import db from '@/lib/db'
import { ProfileService } from '@/services/ProfileService'
import { ProfileCriteria } from '@/repository/ProfileRepository'
import { handleError, parsePagination, StandardApiResponse } from '@/app/api/_common'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { Profile } from '@/schemas/ProfileTable'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const { page, size } = parsePagination(searchParams)
    const searchKeyword = searchParams.get('searchKeyword') || undefined
    const scope = (searchParams.get('scope') || undefined) as ProfileCriteria['scope']
    const slug = searchParams.get('slug') || undefined

    const criteria: ProfileCriteria = {
      ...(searchKeyword ? { searchKeyword } : {}),
      ...(scope ? { scope } : {}),
      ...(slug ? { slug } : {}),
    }

    const paginatedResult: PaginatedResult<Profile> = await getProfile(criteria, { page, size })

    return NextResponse.json(
      paginatedResult satisfies StandardApiResponse<PaginatedResult<Profile>>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleError(error)
  }
}

async function getProfile(criteria: ProfileCriteria, pageable: PaginationRequest) {
  'use cache'
  cacheLife('hours')

  const profileService = new ProfileService(db)
  return profileService.getProfile(criteria, pageable)
}

