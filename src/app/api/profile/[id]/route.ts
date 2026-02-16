import { NextRequest, NextResponse } from 'next/server'

import { handleApiError, respondFromServerAction, StandardApiResponse } from '@/app/api/_common'
import type { Profile } from '@/schemas/ProfileTable'
import { deleteProfile, getProfileById, updateProfile } from '@/server-actions/profile'

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

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/profile/[id]'>) {
  try {
    const { id } = await ctx.params
    const payload = await request.json()
    const result = await updateProfile({ ...payload, id })

    return respondFromServerAction(result)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export async function DELETE(_: NextRequest, ctx: RouteContext<'/api/profile/[id]'>) {
  try {
    const { id } = await ctx.params
    const result = await deleteProfile(id)

    return respondFromServerAction(result)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
