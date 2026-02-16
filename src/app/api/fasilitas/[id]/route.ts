import { NextRequest, NextResponse } from 'next/server'

import { handleApiError, StandardApiResponse } from '@/app/api/_common'
import type { Fasilitas } from '@/schemas/FasilitasTable'
import { getFasilitasById } from '@/server-actions/fasilitas'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/fasilitas/[id]'>) {
  try {
    const { id } = await ctx.params

    return NextResponse.json(
      (await getFasilitasById(id)) satisfies StandardApiResponse<Fasilitas>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
