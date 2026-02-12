import { NextRequest, NextResponse } from 'next/server'
import { handleApiError, StandardApiResponse } from '@/app/api/_common'
import { cacheLife } from 'next/cache'
import { ProfileService } from '@/services/ProfileService'
import db from '@/lib/db'
import type { Profile } from '@/schemas/ProfileTable'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/profile/slug/[slug]'>) {
  try {
    const { slug } = await ctx.params

    return NextResponse.json(
      (await getProfileBySlug(slug)) satisfies StandardApiResponse<Profile>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

async function getProfileBySlug(slug: string) {
  'use cache'
  cacheLife('hours')

  const profileService = new ProfileService(db)
  return profileService.getProfileBySlug(slug)
}

