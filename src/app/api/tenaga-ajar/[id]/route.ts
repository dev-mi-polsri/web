import { NextRequest, NextResponse } from 'next/server'

import { handleApiError, StandardApiResponse } from '@/app/api/_common'
import type { TenagaAjar } from '@/schemas/TenagaAjarTable'
import { getTenagaAjarById } from '@/server-actions/tenaga-ajar'

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
