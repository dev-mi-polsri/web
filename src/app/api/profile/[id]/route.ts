import { NextRequest, NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'

import db from '@/lib/db'
import { ProfileService } from '@/services/ProfileService'
import { handleApiError, StandardApiResponse } from '@/app/api/_common'
import type { Profile } from '@/schemas/ProfileTable'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/profile/[id]'>) {
  try {
    const { id } = await ctx.params

    return NextResponse.json(
      (await getProfileById(id)) satisfies StandardApiResponse<Profile>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

async function getProfileById(id: string) {
  'use cache'
  cacheLife('hours')

  const profileService = new ProfileService(db)
  return profileService.getProfileById(id)
}

