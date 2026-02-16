import { NextRequest, NextResponse } from 'next/server'

import { handleApiError, respondFromServerAction, StandardApiResponse } from '@/app/api/_common'
import type { Fasilitas } from '@/schemas/FasilitasTable'
import { deleteFasilitas, getFasilitasById, updateFasilitas } from '@/server-actions/fasilitas'

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

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/fasilitas/[id]'>) {
  try {
    const { id } = await ctx.params
    const payload = await request.json()
    const result = await updateFasilitas({ ...payload, id })

    return respondFromServerAction(result)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export async function DELETE(_: NextRequest, ctx: RouteContext<'/api/fasilitas/[id]'>) {
  try {
    const { id } = await ctx.params
    const result = await deleteFasilitas(id)

    return respondFromServerAction(result)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
