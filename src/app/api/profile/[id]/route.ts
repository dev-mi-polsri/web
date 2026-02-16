import { NextRequest, NextResponse } from 'next/server'

import { handleApiError, StandardApiResponse } from '@/app/api/_common'
import type { Profile } from '@/schemas/ProfileTable'
import { getProfileById } from '@/server-actions/profile'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/profile/[id]'>) {
  try {
    const { id } = await ctx.params

    return NextResponse.json((await getProfileById(id)) satisfies StandardApiResponse<Profile>, {
      status: 200,
    })
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
