import { NextRequest, NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'

import db from '@/lib/db'
import { ProfileService } from '@/services/ProfileService'
import { ProfileCriteria } from '@/repository/ProfileRepository'
import {
  handleApiError,
  parsePagination,
  respondFromServerAction,
  StandardApiResponse,
} from '@/app/api/_common'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { Profile } from '@/schemas/ProfileTable'
import { createProfile, getProfile } from '@/server-actions/profile'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  try {
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
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const result = await createProfile(payload)

    return respondFromServerAction(result, 201)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
