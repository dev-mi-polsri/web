import { NextRequest, NextResponse } from 'next/server'
import { handleApiError, StandardApiResponse } from '@/app/api/_common'
import { cacheLife } from 'next/cache'
import { UserService } from '@/services/UserService'
import db from '@/lib/db'
import type { MaskedUser } from '@/schemas/User'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/user/[id]'>) {
  try {
    const { id } = await ctx.params

    return NextResponse.json(
      (await getUserById(id)) satisfies StandardApiResponse<MaskedUser>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

async function getUserById(id: string) {
  'use cache'
  cacheLife('hours')

  const userService = new UserService(db)
  return userService.getUserById(id)
}

