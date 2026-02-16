import { NextRequest, NextResponse } from 'next/server'

import { handleApiError, respondFromServerAction, StandardApiResponse } from '@/app/api/_common'
import type { TenagaAjar } from '@/schemas/TenagaAjarTable'
import { deleteTenagaAjar, getTenagaAjarById, updateTenagaAjar } from '@/server-actions/tenaga-ajar'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/tenaga-ajar/[id]'>) {
  try {
    const { id } = await ctx.params

    return NextResponse.json(
      (await getTenagaAjarById(id)) satisfies StandardApiResponse<TenagaAjar>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/tenaga-ajar/[id]'>) {
  try {
    const { id } = await ctx.params
    const payload = await request.json()
    const result = await updateTenagaAjar({ ...payload, id })

    return respondFromServerAction(result)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export async function DELETE(_: NextRequest, ctx: RouteContext<'/api/tenaga-ajar/[id]'>) {
  try {
    const { id } = await ctx.params
    const result = await deleteTenagaAjar(id)

    return respondFromServerAction(result)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
