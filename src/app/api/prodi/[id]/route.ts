import { NextRequest, NextResponse } from 'next/server'

import { handleApiError, respondFromServerAction, StandardApiResponse } from '@/app/api/_common'
import type { Prodi } from '@/schemas/ProdiTable'
import { deleteProdi, getProdiById, updateProdi } from '@/server-actions/prodi'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/prodi/[id]'>) {
  try {
    const { id } = await ctx.params

    return NextResponse.json((await getProdiById(id)) satisfies StandardApiResponse<Prodi>, {
      status: 200,
    })
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/prodi/[id]'>) {
  try {
    const { id } = await ctx.params
    const payload = await request.json()
    const result = await updateProdi({ ...payload, id })

    return respondFromServerAction(result)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export async function DELETE(_: NextRequest, ctx: RouteContext<'/api/prodi/[id]'>) {
  try {
    const { id } = await ctx.params
    const result = await deleteProdi(id)

    return respondFromServerAction(result)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
