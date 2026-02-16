import { NextRequest, NextResponse } from 'next/server'

import { handleApiError, respondFromServerAction, StandardApiResponse } from '@/app/api/_common'
import { Dokumen } from '@/schemas/DokumenTable'
import { deleteDokumen, getDokumenById, updateDokumen } from '@/server-actions/dokumen'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/dokumen/[id]'>) {
  try {
    const { id } = await ctx.params

    return NextResponse.json((await getDokumenById(id)) satisfies StandardApiResponse<Dokumen>, {
      status: 200,
    })
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/dokumen/[id]'>) {
  try {
    const { id } = await ctx.params
    const payload = await request.json()
    const result = await updateDokumen({ ...payload, id })

    return respondFromServerAction(result)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export async function DELETE(_: NextRequest, ctx: RouteContext<'/api/dokumen/[id]'>) {
  try {
    const { id } = await ctx.params
    const result = await deleteDokumen(id)

    return respondFromServerAction(result)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
