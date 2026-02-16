import { NextRequest, NextResponse } from 'next/server'

import { handleApiError, StandardApiResponse } from '@/app/api/_common'
import { Dokumen } from '@/schemas/DokumenTable'
import { getDokumenById } from '@/server-actions/dokumen'

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
